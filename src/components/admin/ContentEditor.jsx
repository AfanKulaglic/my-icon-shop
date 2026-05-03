import { useState, useMemo, useEffect } from "react";
import { useContentStore } from "../../store/contentStore.js";
import { Search } from "../ui/Icons.jsx";
import { Icon } from "@iconify/react";
import IconPicker from "./IconPicker.jsx";

export default function ContentEditor({ selectedField }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [pendingChanges, setPendingChanges] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconPickerField, setIconPickerField] = useState(null);
  
  const content = useContentStore((s) => s.content);
  const currentLanguage = useContentStore((s) => s.currentLanguage);
  const updateText = useContentStore((s) => s.updateText);
  const resetContent = useContentStore((s) => s.resetContent);
  const isLoading = useContentStore((s) => s.isLoading);
  const getAllKeys = useContentStore((s) => s.getAllKeys);

  // Auto-scroll to selected field
  useEffect(() => {
    if (selectedField) {
      setTimeout(() => {
        const fieldElement = document.querySelector(`[data-field-key="${selectedField}"]`);
        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          fieldElement.classList.add('highlight-field');
          setTimeout(() => fieldElement.classList.remove('highlight-field'), 2000);
        }
      }, 100);
    }
  }, [selectedField]);

  // Group keys by section
  const sections = {
    hero: "Hero Section",
    stats: "Stats",
    process: "How It Works",
    step1: "Step 1",
    step2: "Step 2",
    step3: "Step 3",
    features: "Features",
    feature1: "Feature 1",
    feature2: "Feature 2",
    feature3: "Feature 3",
    feature4: "Feature 4",
    categories: "Categories",
    category: "Category Tabs",
    featured: "Featured",
    testimonials: "Testimonials",
    testimonial1: "Testimonial 1",
    testimonial2: "Testimonial 2",
    testimonial3: "Testimonial 3",
    trust: "Trust Indicators",
    cta: "Call to Action",
    view: "View All Button",
    about: "About Page",
    mission: "Mission",
    values: "Values",
    value1: "Value 1",
    value2: "Value 2",
    value3: "Value 3",
    contact: "Contact Page",
    faq: "FAQ",
    social: "Social Media",
    nav: "Navigation",
    shop: "Shop Page",
    product: "Product",
    editor: "Editor",
  };

  const groupedKeys = useMemo(() => {
    // Use getAllKeys which returns all possible keys from the default structure
    const allKeys = getAllKeys();
    const grouped = {};

    Object.keys(sections).forEach((section) => {
      grouped[section] = allKeys.filter((key) => key.startsWith(section + "_"));
    });

    return grouped;
  }, [getAllKeys]);

  // Filter keys based on search
  const filteredKeys = useMemo(() => {
    const allKeys = getAllKeys();
    const keys = selectedSection === "all" 
      ? allKeys
      : groupedKeys[selectedSection] || [];

    if (!searchQuery) return keys;

    return keys.filter((key) => {
      const value = content[currentLanguage]?.[key] || "";
      return (
        key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [content, currentLanguage, searchQuery, selectedSection, groupedKeys, getAllKeys]);

  // Show loading state (after all hooks)
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading content...</p>
        </div>
      </div>
    );
  }

  const handleChange = (key, value) => {
    setPendingChanges(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save all pending changes to Firebase
      for (const [key, value] of Object.entries(pendingChanges)) {
        await updateText(currentLanguage, key, value);
      }
      setPendingChanges({});
      setHasChanges(false);
      
      // Small delay to let Firebase propagate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh the iframe preview
      const iframe = document.querySelector('iframe[title="Live Preview"]');
      if (iframe) {
        iframe.src = iframe.src;
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (confirm("Discard all unsaved changes?")) {
      setPendingChanges({});
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all content to defaults? This cannot be undone.")) {
      resetContent();
      setPendingChanges({});
      setHasChanges(false);
    }
  };

  // Get current value (pending change or saved content)
  const getCurrentValue = (key) => {
    if (pendingChanges[key] !== undefined) {
      return pendingChanges[key];
    }
    return content[currentLanguage]?.[key] || "";
  };

  // Check if key is an image field
  const isImageField = (key) => {
    return key.includes('_image') || key.includes('_video') || key.includes('_icon');
  };

  // Check if key is an icon field
  const isIconField = (key) => {
    return key.includes('_icon');
  };

  const openIconPicker = (key) => {
    setIconPickerField(key);
    setIconPickerOpen(true);
  };

  const handleIconSelect = (iconValue) => {
    if (iconPickerField) {
      handleChange(iconPickerField, iconValue);
    }
    setIconPickerOpen(false);
    setIconPickerField(null);
  };

  // Format key for display
  const formatKey = (key) => {
    return key
      .split("_")
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search and Filters */}
      <div className="p-4 space-y-3 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-10 pr-4 py-2 bg-primary border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedSection("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedSection === "all"
                ? "bg-accent text-white"
                : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            All
          </button>
          {Object.entries(sections).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedSection(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSection === key
                  ? "bg-accent text-white"
                  : "bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredKeys.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <p>No content found</p>
          </div>
        ) : (
          filteredKeys.map((key) => {
            const isImage = isImageField(key);
            const isIcon = isIconField(key);
            const currentValue = getCurrentValue(key);
            const isHighlighted = selectedField === key;
            
            return (
              <div 
                key={key} 
                data-field-key={key}
                className={`space-y-2 p-3 rounded-lg transition-all duration-300 ${
                  isHighlighted ? 'bg-accent/10 border-2 border-accent' : 'border-2 border-transparent'
                }`}
              >
                <label className="block text-xs font-medium text-white/70 uppercase tracking-wider">
                  {formatKey(key)}
                  {pendingChanges[key] !== undefined && (
                    <span className="ml-2 text-warning">●</span>
                  )}
                  {isIcon && (
                    <span className="ml-2 text-accent text-[10px]">(Icon)</span>
                  )}
                  {isImage && !isIcon && (
                    <span className="ml-2 text-accent text-[10px]">(Image/Video URL)</span>
                  )}
                </label>
                
                {isIcon ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentValue}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder="mdi:home or lucide:heart"
                        className="flex-1 px-3 py-2 bg-primary border border-white/10 rounded-lg text-sm text-white resize-none focus:border-accent focus:outline-none"
                      />
                      <button
                        onClick={() => openIconPicker(key)}
                        className="px-4 py-2 bg-accent hover:bg-accent-light text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Browse Icons
                      </button>
                    </div>
                    {currentValue && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary border border-white/10">
                        <div className="w-12 h-12 bg-primary-light border border-white/10 rounded-lg flex items-center justify-center">
                          <Icon icon={currentValue} className="w-8 h-8 text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-white/60">Preview</p>
                          <p className="text-white font-mono text-xs">{currentValue}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : isImage ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder="/images/example.png or https://..."
                      className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg text-sm text-white resize-none focus:border-accent focus:outline-none"
                    />
                    {currentValue && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-primary border border-white/10">
                        {currentValue.includes('.mp4') || currentValue.includes('.webm') ? (
                          <video
                            src={currentValue}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            autoPlay
                          />
                        ) : (
                          <img
                            src={currentValue}
                            alt={formatKey(key)}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        )}
                        <div className="hidden w-full h-full items-center justify-center text-white/40 text-xs">
                          Invalid URL
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={currentValue}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={currentValue.length > 60 ? 3 : 2}
                    className="w-full px-3 py-2 bg-primary border border-white/10 rounded-lg text-sm text-white resize-none focus:border-accent focus:outline-none"
                  />
                )}
                <p className="text-[10px] text-white/30">Key: {key}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`w-full px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
            hasChanges && !isSaving
              ? "bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/20 hover:shadow-glow"
              : "bg-white/5 text-white/40 cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <>
              {hasChanges ? `Save Changes (${Object.keys(pendingChanges).length})` : "No Changes"}
            </>
          )}
        </button>
        
        {hasChanges && (
          <button
            onClick={handleDiscard}
            className="w-full px-4 py-2 text-sm border border-white/10 text-white/70 hover:bg-white/5 rounded-lg transition-colors"
          >
            Discard Changes
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 text-sm border border-red-500/30 text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          Reset All to Defaults
        </button>
        
        {hasChanges && (
          <p className="text-[10px] text-warning text-center">
            ● {Object.keys(pendingChanges).length} unsaved change{Object.keys(pendingChanges).length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      
      {/* Icon Picker Modal */}
      {iconPickerOpen && (
        <IconPicker
          value={iconPickerField ? getCurrentValue(iconPickerField) : ""}
          onChange={handleIconSelect}
          onClose={() => {
            setIconPickerOpen(false);
            setIconPickerField(null);
          }}
        />
      )}
    </div>
  );
}
