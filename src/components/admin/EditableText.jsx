import { useContentStore } from "../../store/contentStore.js";
import EditableContent from "./EditableContent.jsx";

/**
 * Simplified component that combines getText() and EditableContent
 * Usage: <EditableText id="hero_title" as="h1" fallback="Default Title" className="..." />
 */
export default function EditableText({ 
  id, 
  fallback = "", 
  as: Component = "span",
  className = "",
  children,
  ...props 
}) {
  const getText = useContentStore((s) => s.getText);
  const content = children || getText(id) || fallback;
  
  return (
    <EditableContent id={id} as={Component}>
      <Component className={className} {...props}>
        {content}
      </Component>
    </EditableContent>
  );
}
