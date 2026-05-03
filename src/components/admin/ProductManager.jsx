import { useState, useEffect } from "react";
import { useProductConfigStore } from "../../store/productConfigStore.js";
import { products } from "../../utils/products.js";

export default function ProductManager() {
  const configs = useProductConfigStore((s) => s.configs);
  const updateProductConfig = useProductConfigStore((s) => s.updateProductConfig);
  const initFirebase = useProductConfigStore((s) => s.initFirebase);
  const resetToDefaults = useProductConfigStore((s) => s.resetToDefaults);

  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id);
  const [selectedColor, setSelectedColor] = useState(null);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#ffffff");
  const [showAddColor, setShowAddColor] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  
  // Local state for pending changes
  const [pendingChanges, setPendingChanges] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Default categories
  const defaultCategories = ["man", "woman", "others"];

  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  // Load current config into pending changes when product changes
  useEffect(() => {
    const currentConfig = configs[selectedProduct] || { 
      colors: [{ name: "White", hex: "#ffffff", enabled: true, availableSizes: ["S", "M", "L", "XL"] }],
      category: "man",
      customCategories: []
    };
    setPendingChanges(currentConfig);
    setHasUnsavedChanges(false);
    setSelectedColor(null);
  }, [selectedProduct, configs]);

  const currentConfig = pendingChanges;

  // Get all available categories (default + custom)
  const allCategories = [...defaultCategories, ...(currentConfig.customCategories || [])];

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Update pending changes
  const updatePendingChanges = (updates) => {
    setPendingChanges(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  // Save to Firebase
  const handleSave = async () => {
    try {
      await updateProductConfig(selectedProduct, pendingChanges);
      setHasUnsavedChanges(false);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving changes. Please try again.");
    }
  };

  const handleAddColor = () => {
    if (!newColorName.trim() || !newColorHex) return;

    const newColor = {
      name: newColorName.trim(),
      hex: newColorHex,
      enabled: true,
      availableSizes: ["S", "M", "L", "XL"],
    };

    const updatedColors = [...(currentConfig.colors || []), newColor];
    updatePendingChanges({ colors: updatedColors });

    setNewColorName("");
    setNewColorHex("#ffffff");
    setShowAddColor(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const categoryId = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');
    
    if (allCategories.includes(categoryId)) {
      alert("Category already exists!");
      return;
    }

    const updatedCategories = [...(currentConfig.customCategories || []), categoryId];
    updatePendingChanges({ customCategories: updatedCategories });

    setNewCategoryName("");
    setShowAddCategory(false);
  };

  const handleSetCategory = (category) => {
    updatePendingChanges({ category });
  };

  const handleRemoveCustomCategory = (category) => {
    if (confirm(`Remove custom category "${category}"?`)) {
      const updatedCategories = (currentConfig.customCategories || []).filter(c => c !== category);
      updatePendingChanges({ 
        customCategories: updatedCategories,
        category: currentConfig.category === category ? "man" : currentConfig.category
      });
    }
  };

  const handleRemoveColor = (colorHex) => {
    if (confirm(`Remove color "${currentConfig.colors.find(c => c.hex === colorHex)?.name}"?`)) {
      const updatedColors = currentConfig.colors.filter(c => c.hex !== colorHex);
      updatePendingChanges({ colors: updatedColors });
      if (selectedColor === colorHex) {
        setSelectedColor(null);
      }
    }
  };

  const handleToggleColorEnabled = (colorHex) => {
    const updatedColors = currentConfig.colors.map(c =>
      c.hex === colorHex ? { ...c, enabled: !c.enabled } : c
    );
    updatePendingChanges({ colors: updatedColors });
  };

  const handleToggleSizeForColor = (colorHex, size) => {
    const updatedColors = currentConfig.colors.map(c => {
      if (c.hex === colorHex) {
        const availableSizes = c.availableSizes.includes(size)
          ? c.availableSizes.filter(s => s !== size)
          : [...c.availableSizes, size];
        return { ...c, availableSizes };
      }
      return c;
    });
    updatePendingChanges({ colors: updatedColors });
  };

  const handleReset = () => {
    if (confirm("Reset all product configurations to defaults?")) {
      resetToDefaults();
      setSelectedColor(null);
    }
  };

  const selectedColorData = currentConfig.colors?.find(c => c.hex === selectedColor);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Product Selector */}
      <div className="p-4 border-b border-white/10">
        <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
          Select Product
        </label>
        <select
          value={selectedProduct}
          onChange={(e) => {
            setSelectedProduct(e.target.value);
            setSelectedColor(null);
          }}
          className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg text-white focus:border-accent focus:outline-none"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {/* Configuration */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Category Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Product Category</h3>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-xs px-3 py-1.5 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
            >
              {showAddCategory ? "Cancel" : "+ Add Category"}
            </button>
          </div>

          {/* Add Category Form */}
          {showAddCategory && (
            <div className="mb-4 p-4 bg-primary-light border border-white/10 rounded-lg space-y-3">
              <div>
                <label className="block text-xs text-white/70 mb-1">Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Kids, Accessories"
                  className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg text-white text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="w-full px-4 py-2 bg-gradient-to-r from-accent to-accent-light text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Category
              </button>
            </div>
          )}

          <p className="text-xs text-white/50 mb-4">
            Select the category for this product
          </p>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-3">
            {allCategories.map((category) => {
              const isSelected = currentConfig.category === category;
              const isCustom = !defaultCategories.includes(category);
              const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
              
              return (
                <div key={category} className="relative">
                  <button
                    onClick={() => handleSetCategory(category)}
                    className={`w-full p-4 rounded-lg border transition-all ${
                      isSelected
                        ? "border-accent bg-accent/10 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                    }`}
                  >
                    <div className="text-sm font-bold uppercase tracking-wider">{categoryLabel}</div>
                    {isSelected && (
                      <div className="text-[10px] text-accent mt-1">Selected</div>
                    )}
                  </button>
                  {isCustom && (
                    <button
                      onClick={() => handleRemoveCustomCategory(category)}
                      className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                      title="Remove category"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Colors Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Product Colors</h3>
            <button
              onClick={() => setShowAddColor(!showAddColor)}
              className="text-xs px-3 py-1.5 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
            >
              {showAddColor ? "Cancel" : "+ Add Color"}
            </button>
          </div>

          {/* Add Color Form */}
          {showAddColor && (
            <div className="mb-4 p-4 bg-primary-light border border-white/10 rounded-lg space-y-3">
              <div>
                <label className="block text-xs text-white/70 mb-1">Color Name</label>
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="e.g. Navy Blue"
                  className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg text-white text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1">Color Hex</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 px-3 py-2 bg-primary border border-white/10 rounded-lg text-white text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleAddColor}
                disabled={!newColorName.trim()}
                className="w-full px-4 py-2 bg-gradient-to-r from-accent to-accent-light text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Color
              </button>
            </div>
          )}

          <p className="text-xs text-white/50 mb-4">
            Click a color to manage its availability and sizes
          </p>

          {/* Colors List */}
          <div className="space-y-2">
            {currentConfig.colors?.map((color) => (
              <div
                key={color.hex}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedColor === color.hex
                    ? "border-accent bg-accent/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
                onClick={() => setSelectedColor(color.hex)}
              >
                <div
                  className="w-10 h-10 rounded-lg border-2 border-white/20 flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium">{color.name}</div>
                  <div className="text-[10px] text-white/40">{color.hex}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleColorEnabled(color.hex);
                    }}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      color.enabled
                        ? "bg-accent/20 text-accent"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    {color.enabled ? "Enabled" : "Disabled"}
                  </button>
                  {currentConfig.colors.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveColor(color.hex);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Remove color"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Size Availability for Selected Color */}
        {selectedColorData && (
          <div className="bg-primary-light border border-accent/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-3">
              Size Availability for {selectedColorData.name}
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Select which sizes are available for this color
            </p>
            <div className="grid grid-cols-3 gap-3">
              {allSizes.map((size) => {
                const isEnabled = selectedColorData.availableSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleToggleSizeForColor(selectedColor, size)}
                    className={`p-4 rounded-lg border transition-all ${
                      isEnabled
                        ? "border-accent bg-accent/10 text-white"
                        : "border-white/10 bg-white/5 text-white/40 opacity-50"
                    }`}
                  >
                    <div className="text-2xl font-bold">{size}</div>
                    <div className="text-[10px] mt-1">
                      {isEnabled ? "Available" : "Unavailable"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Zone Pricing */}
        <div>
          <h3 className="text-sm font-medium text-white mb-1">Print Zone Prices</h3>
          <p className="text-xs text-white/50 mb-4">
            Set the per-zone print surcharge (USD) added on top of the base product price.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "front", label: "Front" },
              { key: "back", label: "Back" },
              { key: "sleeves", label: "Sleeves" },
            ].map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs text-white/60 uppercase tracking-wider font-medium">
                  {label}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={(currentConfig.zonePrices?.[key] ?? (key === "sleeves" ? 3 : 5))}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      updatePendingChanges({
                        zonePrices: {
                          front: 5,
                          back: 5,
                          sleeves: 3,
                          ...(currentConfig.zonePrices || {}),
                          [key]: val,
                        },
                      });
                    }}
                    className="w-full pl-6 pr-3 py-2.5 bg-primary border border-white/10 rounded-lg text-white text-sm font-bold focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-primary-light border border-white/10 rounded-lg p-4">
          <h4 className="text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
            Configuration Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Total Colors:</span>
              <span className="text-white font-medium">
                {currentConfig.colors?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Enabled Colors:</span>
              <span className="text-white font-medium">
                {currentConfig.colors?.filter(c => c.enabled).length || 0}
              </span>
            </div>
            <div className="h-px bg-white/10 my-1" />
            {["front", "back", "sleeves"].map((zone) => (
              <div key={zone} className="flex justify-between">
                <span className="text-white/60 capitalize">{zone} zone:</span>
                <span className="text-accent font-bold">
                  +${(currentConfig.zonePrices?.[zone] ?? (zone === "sleeves" ? 3 : 5)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className={`w-full px-4 py-3 text-sm font-bold rounded-lg transition-all ${
            hasUnsavedChanges
              ? "bg-gradient-to-r from-accent to-accent-light text-white hover:shadow-lg hover:shadow-accent/25"
              : "bg-white/5 text-white/40 cursor-not-allowed"
          }`}
        >
          {hasUnsavedChanges ? "💾 Save Changes" : "✓ All Changes Saved"}
        </button>
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 text-sm border border-red-500/30 text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          Reset All to Defaults
        </button>
        <p className="text-[10px] text-white/40 text-center">
          {hasUnsavedChanges ? "You have unsaved changes" : "Changes sync to Firebase when saved"}
        </p>
      </div>
    </div>
  );
}
