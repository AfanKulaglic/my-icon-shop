import { useEffect, useState } from "react";
import { loadOverrides } from "../utils/models.js";

/**
 * Subscribe to print-zone override changes (Firebase backed).
 * Returns the override map: { [modelId]: { front, back, sleeves } }.
 *
 * After the decal refactor each side stores
 *   { point:[x,y,z], normal:[x,y,z], size:[w,h], rotation } (any subset).
 */
export function usePrintAreasOverride() {
  const [overrides, setOverrides] = useState({});
  const [version, setVersion] = useState(0);
  
  useEffect(() => {
    // Load initial overrides
    loadOverrides().then(setOverrides);
    
    const onChange = () => {
      setVersion((v) => v + 1);
      loadOverrides().then(setOverrides);
    };
    
    window.addEventListener("printdecals:changed", onChange);
    window.addEventListener("printareas:changed", onChange);
    window.addEventListener("storage", onChange);
    
    return () => {
      window.removeEventListener("printdecals:changed", onChange);
      window.removeEventListener("printareas:changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  
  return [overrides, version];
}
