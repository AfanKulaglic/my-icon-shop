/**
 * Export the 3D model with designs baked into the texture.
 * 
 * This creates a downloadable OBJ file with a new texture that has
 * all the user's designs composited onto the base diffuse map.
 */

/**
 * Bake all side designs onto the base texture using canvas compositing.
 * Returns a data URL of the final baked texture.
 */
async function bakeTextureWithDesigns(model, textureURLs, shirtColor) {
  console.log('Baking texture...');
  console.log('Model:', model.id);
  console.log('TextureURLs:', Object.keys(textureURLs).filter(k => textureURLs[k]));
  
  // Create an offscreen canvas for compositing
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Load the base diffuse texture
  const baseImage = await loadImage(model.maps?.diffuse);
  
  if (!baseImage) {
    // If no base texture, create a solid color canvas
    canvas.width = 2048;
    canvas.height = 2048;
    ctx.fillStyle = shirtColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log('Created blank canvas:', canvas.width, 'x', canvas.height);
  } else {
    canvas.width = baseImage.width;
    canvas.height = baseImage.height;
    
    // Draw base texture
    ctx.drawImage(baseImage, 0, 0);
    console.log('Drew base texture:', canvas.width, 'x', canvas.height);
    
    // Apply shirt color tint if not white
    if (shirtColor && shirtColor !== '#ffffff') {
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = shirtColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      console.log('Applied color tint:', shirtColor);
    }
  }
  
  // Composite each side's design onto the texture
  const sides = ['front', 'back', 'sleeves'];
  
  for (const side of sides) {
    const designURL = textureURLs[side];
    if (!designURL) {
      console.log(`No design for ${side}`);
      continue;
    }
    
    console.log(`Loading design for ${side}...`);
    const designImage = await loadImage(designURL);
    if (!designImage) {
      console.log(`Failed to load design for ${side}`);
      continue;
    }
    
    console.log(`Design loaded for ${side}:`, designImage.width, 'x', designImage.height);
    
    // Get decal configuration
    const decal = model.printDecals?.[side];
    const sizeScale = decal?.size || [0.3, 0.3];
    
    // Calculate design dimensions - make them larger and more visible
    const designWidth = canvas.width * sizeScale[0] * 1.5;
    const designHeight = canvas.height * sizeScale[1] * 1.5;
    
    // Position designs based on typical UV layout
    // Adjusted positions to be more visible
    let x, y;
    
    if (side === 'front') {
      // Front chest area - center of texture
      x = (canvas.width - designWidth) / 2;
      y = canvas.height * 0.25;
    } else if (side === 'back') {
      // Back area - center, lower
      x = (canvas.width - designWidth) / 2;
      y = canvas.height * 0.55;
    } else { // sleeves
      // Sleeves - left side
      x = canvas.width * 0.05;
      y = canvas.height * 0.65;
    }
    
    console.log(`Drawing ${side} at (${x}, ${y}) size ${designWidth}x${designHeight}`);
    
    // Draw the design with proper blending
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(designImage, x, y, designWidth, designHeight);
    ctx.restore();
  }
  
  console.log('Texture baking complete');
  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Load an image from URL and return as Image element
 */
function loadImage(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.error('Failed to load image:', url);
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Convert data URL to Blob
 */
async function dataURLToBlob(dataURL) {
  const response = await fetch(dataURL);
  return response.blob();
}

/**
 * Fetch a file as text
 */
async function fetchText(url) {
  const response = await fetch(url);
  return response.text();
}

/**
 * Export the edited model as OBJ with baked texture
 */
export async function exportEditedOBJ(product, model, shirtColor, textureURLs) {
  try {
    console.log('Starting OBJ export...');
    console.log('Texture URLs:', textureURLs);
    console.log('Shirt color:', shirtColor);
    
    // 1. Bake the texture with all designs
    const bakedTextureURL = await bakeTextureWithDesigns(model, textureURLs, shirtColor);
    const textureBlob = await dataURLToBlob(bakedTextureURL);
    
    console.log('Texture baked, size:', textureBlob.size);
    
    // 2. Fetch the original OBJ file
    const objContent = await fetchText(model.obj);
    
    console.log('OBJ loaded, length:', objContent.length);
    
    // 3. Create MTL file that references the baked texture
    const textureName = `${product.id}_texture.jpg`;
    const mtlContent = `# Material file for ${product.name}
# Generated by my-icon.shop editor
newmtl material_0
Ka 1.000 1.000 1.000
Kd 1.000 1.000 1.000
Ks 0.000 0.000 0.000
Ns 10.0
d 1.0
illum 2
map_Kd ${textureName}
`;
    
    // 4. Update OBJ to reference the MTL file
    const mtlName = `${product.id}.mtl`;
    let updatedObjContent = objContent;
    
    // Remove existing mtllib references
    updatedObjContent = updatedObjContent.replace(/^mtllib .+$/gm, '');
    
    // Add our mtllib reference at the top (after comments)
    const lines = updatedObjContent.split('\n');
    const insertIndex = lines.findIndex(line => !line.startsWith('#') && line.trim() !== '');
    
    if (insertIndex >= 0) {
      lines.splice(insertIndex, 0, `mtllib ${mtlName}`);
      updatedObjContent = lines.join('\n');
    } else {
      updatedObjContent = `mtllib ${mtlName}\n${updatedObjContent}`;
    }
    
    // Add header comment
    updatedObjContent = `# Exported from my-icon.shop editor
# Product: ${product.name}
# Date: ${new Date().toISOString()}
${updatedObjContent}`;
    
    console.log('Export complete');
    
    // 5. Create download links
    return {
      objBlob: new Blob([updatedObjContent], { type: 'text/plain' }),
      mtlBlob: new Blob([mtlContent], { type: 'text/plain' }),
      textureBlob,
      objName: `${product.id}.obj`,
      mtlName,
      textureName,
    };
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * Download a blob as a file
 */
export function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
