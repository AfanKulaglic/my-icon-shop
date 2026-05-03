import { useState, useEffect } from "react";
import { useContentStore } from "../../store/contentStore.js";

/**
 * Wrapper component that makes any content editable in admin mode
 * Usage: <EditableContent id="hero_title">{content}</EditableContent>
 */
export default function EditableContent({ 
  id, 
  children, 
  className = "",
  as: Component = "div"
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isAdminMode = typeof window !== 'undefined' && window.location.pathname.includes('/admin');
  
  // Check if we're in an iframe (live preview)
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
  
  const handleClick = (e) => {
    if (isInIframe) {
      e.preventDefault();
      e.stopPropagation();
      
      // Send message to parent window (admin dashboard)
      window.parent.postMessage({
        type: 'EDIT_CONTENT',
        key: id
      }, '*');
    }
  };

  // Don't wrap if not in admin mode or iframe
  if (!isInIframe) {
    return children;
  }

  return (
    <Component
      className={`editable-content ${className}`}
      data-editable-id={id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ 
        cursor: 'pointer',
        position: 'relative',
        outline: isHovered ? '2px dashed #6366F1' : 'none',
        outlineOffset: '4px',
        transition: 'outline 0.2s ease'
      }}
    >
      {isHovered && (
        <div 
          style={{
            position: 'absolute',
            top: '-28px',
            left: '0',
            background: 'linear-gradient(135deg, #6366F1, #818CF8)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            zIndex: 9999,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            letterSpacing: '0.5px'
          }}
        >
          ✏️ Click to edit: {id}
        </div>
      )}
      {children}
    </Component>
  );
}
