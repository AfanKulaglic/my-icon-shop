import { useContentStore } from "../../store/contentStore.js";
import EditableContent from "./EditableContent.jsx";
import { Icon } from "@iconify/react";

/**
 * Simplified component for editable icons
 * Usage: <EditableIcon id="feature1_icon" className="w-6 h-6" fallback="mdi:star" />
 */
export default function EditableIcon({ 
  id, 
  fallback = "mdi:help-circle", 
  className = "w-6 h-6",
  ...props 
}) {
  const getText = useContentStore((s) => s.getText);
  const iconName = getText(id) || fallback;
  
  // Ensure we always have a valid icon name
  const validIconName = iconName && iconName.trim() !== "" ? iconName : fallback;
  
  return (
    <EditableContent id={id} as="div">
      <Icon icon={validIconName} className={className} {...props} />
    </EditableContent>
  );
}
