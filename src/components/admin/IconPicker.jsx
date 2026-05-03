import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Search } from "../ui/Icons.jsx";

// Popular icon collections available in Iconify (200,000+ icons total)
const ICON_COLLECTIONS = [
  { prefix: "mdi", name: "Material Design Icons", count: "7000+" },
  { prefix: "lucide", name: "Lucide", count: "1400+" },
  { prefix: "heroicons", name: "Heroicons", count: "300+" },
  { prefix: "fa6-solid", name: "Font Awesome Solid", count: "2000+" },
  { prefix: "fa6-regular", name: "Font Awesome Regular", count: "160+" },
  { prefix: "fa6-brands", name: "Font Awesome Brands", count: "500+" },
  { prefix: "bi", name: "Bootstrap Icons", count: "2000+" },
  { prefix: "tabler", name: "Tabler Icons", count: "5000+" },
  { prefix: "carbon", name: "Carbon", count: "2100+" },
  { prefix: "ion", name: "Ionicons", count: "1300+" },
  { prefix: "ph", name: "Phosphor", count: "9000+" },
  { prefix: "solar", name: "Solar", count: "1200+" },
  { prefix: "mingcute", name: "MingCute", count: "2800+" },
  { prefix: "iconamoon", name: "Iconamoon", count: "1500+" },
  { prefix: "fluent", name: "Fluent UI", count: "12000+" },
];

// Curated icon lists for each collection with verified icon names
const ICON_SETS = {
  "mdi": [
    "home", "menu", "close", "magnify", "cog", "account", "account-multiple",
    "arrow-left", "arrow-right", "arrow-up", "arrow-down",
    "chevron-left", "chevron-right", "chevron-up", "chevron-down",
    "plus", "minus", "pencil", "delete", "trash-can", "content-save", "download", "upload",
    "check", "close-circle", "refresh", "share", "content-copy", "link", "open-in-new",
    "email", "message", "phone", "chat", "bell", "bell-outline",
    "image", "video", "camera", "play", "pause", "stop", "music",
    "file", "folder", "file-document", "folder-open",
    "cart", "shopping", "credit-card", "tag", "gift",
    "heart", "star", "bookmark", "thumb-up", "share-variant",
    "facebook", "twitter", "instagram", "linkedin", "youtube",
    "briefcase", "calendar", "clock", "map", "map-marker", "pin",
    "code-tags", "console", "database", "server", "cloud", "wifi",
    "information", "help-circle", "alert-circle", "lock", "lock-open",
    "eye", "eye-off", "filter", "sort", "view-grid", "view-list",
    "tshirt-crew", "dress", "hanger", "shopping-outline"
  ],
  "lucide": [
    "home", "menu", "x", "search", "settings", "user", "users",
    "arrow-left", "arrow-right", "arrow-up", "arrow-down",
    "chevron-left", "chevron-right", "chevron-up", "chevron-down",
    "plus", "minus", "edit", "trash", "trash-2", "save", "download", "upload",
    "check", "x-circle", "refresh-cw", "share-2", "copy", "link", "external-link",
    "mail", "message-circle", "phone", "message-square", "bell",
    "image", "video", "camera", "play", "pause", "square", "music",
    "file", "folder", "file-text", "folder-open",
    "shopping-cart", "shopping-bag", "credit-card", "tag", "gift",
    "heart", "star", "bookmark", "thumbs-up", "share",
    "facebook", "twitter", "instagram", "linkedin", "youtube",
    "briefcase", "calendar", "clock", "map", "map-pin", "pin",
    "code", "terminal", "database", "server", "cloud", "wifi",
    "info", "help-circle", "alert-circle", "lock", "unlock",
    "eye", "eye-off", "filter", "arrow-up-down", "grid", "list",
    "shirt", "sparkles"
  ],
  "heroicons": [
    "home", "bars-3", "x-mark", "magnifying-glass", "cog-6-tooth", "user", "user-group",
    "arrow-left", "arrow-right", "arrow-up", "arrow-down",
    "chevron-left", "chevron-right", "chevron-up", "chevron-down",
    "plus", "minus", "pencil", "trash", "archive-box", "arrow-down-tray", "arrow-up-tray",
    "check", "x-circle", "arrow-path", "share", "clipboard", "link", "arrow-top-right-on-square",
    "envelope", "chat-bubble-left", "phone", "chat-bubble-bottom-center", "bell",
    "photo", "video-camera", "camera", "play", "pause", "stop", "musical-note",
    "document", "folder", "document-text", "folder-open",
    "shopping-cart", "shopping-bag", "credit-card", "tag", "gift",
    "heart", "star", "bookmark", "hand-thumb-up", "share",
    "briefcase", "calendar", "clock", "map", "map-pin", "map-pin",
    "code-bracket", "command-line", "circle-stack", "server", "cloud", "wifi",
    "information-circle", "question-mark-circle", "exclamation-circle", "lock-closed", "lock-open",
    "eye", "eye-slash", "funnel", "arrows-up-down", "squares-2x2", "list-bullet",
    "sparkles"
  ],
  "carbon": [
    "home", "menu", "close", "search", "settings", "user", "user-multiple",
    "arrow-left", "arrow-right", "arrow-up", "arrow-down",
    "chevron-left", "chevron-right", "chevron-up", "chevron-down",
    "add", "subtract", "edit", "trash-can", "save", "download", "upload",
    "checkmark", "close-filled", "renew", "share", "copy", "link", "launch",
    "email", "chat", "phone", "chat-bot", "notification",
    "image", "video", "camera", "play", "pause", "stop", "music",
    "document", "folder", "document-blank", "folder-open",
    "shopping-cart", "shopping-bag", "purchase", "tag", "gift",
    "favorite", "star", "bookmark", "thumbs-up", "share",
    "logo-facebook", "logo-twitter", "logo-instagram", "logo-linkedin", "logo-youtube",
    "briefcase", "calendar", "time", "map", "location", "pin",
    "code", "terminal", "data-base", "server", "cloud", "wifi",
    "information", "help", "warning", "locked", "unlocked",
    "view", "view-off", "filter", "sort", "grid", "list"
  ],
  "tabler": [
    "home", "menu-2", "x", "search", "settings", "user", "users",
    "arrow-left", "arrow-right", "arrow-up", "arrow-down",
    "chevron-left", "chevron-right", "chevron-up", "chevron-down",
    "plus", "minus", "edit", "trash", "device-floppy", "download", "upload",
    "check", "x", "refresh", "share", "copy", "link", "external-link",
    "mail", "message", "phone", "message-circle", "bell",
    "photo", "video", "camera", "player-play", "player-pause", "player-stop", "music",
    "file", "folder", "file-text", "folder-open",
    "shopping-cart", "shopping-bag", "credit-card", "tag", "gift",
    "heart", "star", "bookmark", "thumb-up", "share",
    "brand-facebook", "brand-twitter", "brand-instagram", "brand-linkedin", "brand-youtube",
    "briefcase", "calendar", "clock", "map", "map-pin", "pin",
    "code", "terminal", "database", "server", "cloud", "wifi",
    "info-circle", "help", "alert-circle", "lock", "lock-open",
    "eye", "eye-off", "filter", "arrows-sort", "layout-grid", "list",
    "shirt", "hanger", "sparkles"
  ],
  "iconamoon": [
    "home", "menu", "close", "search", "settings", "profile", "profile-circle",
    "arrow-left-2", "arrow-right-2", "arrow-up-2", "arrow-down-2",
    "arrow-left-6", "arrow-right-6", "arrow-up-6", "arrow-down-6",
    "sign-plus", "sign-minus", "edit", "trash", "save", "download", "upload",
    "check", "close-circle", "restart", "share", "copy", "link", "sign-out",
    "email", "chat", "phone", "comment", "notification",
    "image", "video", "camera", "play", "pause", "stop", "music-2",
    "file", "folder", "file-document", "folder-open",
    "shopping-cart", "shopping-bag", "credit-card", "tag", "gift",
    "heart", "star", "bookmark", "like", "share-2",
    "briefcase", "calendar", "clock", "map", "location", "pin",
    "code", "terminal", "database", "server", "cloud", "wifi",
    "information-circle", "help-circle", "sign-times-circle", "lock", "lock-open",
    "eye", "eye-off", "filter", "sort", "category", "list"
  ],
  "fluent": [
    "home-24-regular", "navigation-24-regular", "dismiss-24-regular", "search-24-regular", "settings-24-regular", "person-24-regular", "people-24-regular",
    "arrow-left-24-regular", "arrow-right-24-regular", "arrow-up-24-regular", "arrow-down-24-regular",
    "chevron-left-24-regular", "chevron-right-24-regular", "chevron-up-24-regular", "chevron-down-24-regular",
    "add-24-regular", "subtract-24-regular", "edit-24-regular", "delete-24-regular", "save-24-regular", "arrow-download-24-regular", "arrow-upload-24-regular",
    "checkmark-24-regular", "dismiss-circle-24-regular", "arrow-sync-24-regular", "share-24-regular", "copy-24-regular", "link-24-regular", "open-24-regular",
    "mail-24-regular", "chat-24-regular", "call-24-regular", "comment-24-regular", "alert-24-regular",
    "image-24-regular", "video-24-regular", "camera-24-regular", "play-24-regular", "pause-24-regular", "stop-24-regular", "music-note-1-24-regular",
    "document-24-regular", "folder-24-regular", "document-text-24-regular", "folder-open-24-regular",
    "cart-24-regular", "shopping-bag-24-regular", "payment-24-regular", "tag-24-regular", "gift-24-regular",
    "heart-24-regular", "star-24-regular", "bookmark-24-regular", "thumb-like-24-regular", "share-android-24-regular",
    "briefcase-24-regular", "calendar-24-regular", "clock-24-regular", "map-24-regular", "location-24-regular", "pin-24-regular",
    "code-24-regular", "window-console-24-regular", "database-24-regular", "server-24-regular", "cloud-24-regular", "wifi-1-24-regular",
    "info-24-regular", "question-circle-24-regular", "warning-24-regular", "lock-closed-24-regular", "lock-open-24-regular",
    "eye-24-regular", "eye-off-24-regular", "filter-24-regular", "arrow-sort-24-regular", "grid-24-regular", "list-24-regular"
  ],
};

export default function IconPicker({ value, onChange, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("mdi");
  const [customIcon, setCustomIcon] = useState("");

  // Get icons for selected collection
  const availableIcons = ICON_SETS[selectedCollection] || ICON_SETS["mdi"];

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!searchQuery) return availableIcons;
    
    return availableIcons.filter(icon =>
      icon.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableIcons]);

  const handleSelectIcon = (iconName) => {
    const fullIconName = `${selectedCollection}:${iconName}`;
    onChange(fullIconName);
  };

  const handleCustomIcon = () => {
    if (customIcon.trim()) {
      onChange(customIcon.trim());
    }
  };

  // Parse current icon value
  const currentIcon = value || "";
  const [currentPrefix, currentName] = currentIcon.includes(":") 
    ? currentIcon.split(":") 
    : ["mdi", currentIcon];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-primary border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">Icon Picker</h2>
            <p className="text-sm text-white/60 mt-1">
              Choose from 200,000+ free icons
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Icon icon="mdi:close" className="w-6 h-6 text-white/60" />
          </button>
        </div>

        {/* Current Selection */}
        {currentIcon && (
          <div className="p-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary border border-white/10 rounded-lg flex items-center justify-center">
                <Icon icon={currentIcon} className="w-8 h-8 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/60">Current Icon</p>
                <p className="text-white font-mono text-sm">{currentIcon}</p>
              </div>
              <button
                onClick={() => onChange("")}
                className="px-4 py-2 text-sm border border-red-500/30 text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Search & Collection Selector */}
        <div className="p-4 border-b border-white/10 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search icons... (e.g., home, user, heart)"
              className="w-full pl-10 pr-4 py-3 bg-primary-light border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
              autoFocus
            />
          </div>

          {/* Collection Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {ICON_COLLECTIONS.map((collection) => (
              <button
                key={collection.prefix}
                onClick={() => setSelectedCollection(collection.prefix)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCollection === collection.prefix
                    ? "bg-accent text-white"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {collection.name}
                <span className="ml-2 text-[10px] opacity-60">{collection.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
            {filteredIcons.map((iconName) => {
              const fullIconName = `${selectedCollection}:${iconName}`;
              const isSelected = currentIcon === fullIconName;
              
              return (
                <button
                  key={iconName}
                  onClick={() => handleSelectIcon(iconName)}
                  className={`aspect-square p-3 rounded-lg border transition-all hover:scale-110 group relative ${
                    isSelected
                      ? "bg-accent/20 border-accent"
                      : "bg-white/5 border-white/10 hover:border-accent/50 hover:bg-white/10"
                  }`}
                  title={iconName}
                >
                  <Icon 
                    icon={fullIconName} 
                    className={`w-full h-full ${isSelected ? "text-accent" : "text-white/70 group-hover:text-white"}`}
                  />
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-primary-light border border-white/10 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {iconName}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredIcons.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <p>No icons found for "{searchQuery}"</p>
              <p className="text-xs mt-2">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Custom Icon Input */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <p className="text-xs text-white/60 mb-2">
            Or enter a custom Iconify icon name:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customIcon}
              onChange={(e) => setCustomIcon(e.target.value)}
              placeholder="e.g., mdi:home or lucide:heart"
              className="flex-1 px-3 py-2 bg-primary border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
            />
            <button
              onClick={handleCustomIcon}
              disabled={!customIcon.trim()}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                customIcon.trim()
                  ? "bg-accent text-white hover:bg-accent-light"
                  : "bg-white/5 text-white/40 cursor-not-allowed"
              }`}
            >
              Use Custom
            </button>
          </div>
          <p className="text-[10px] text-white/40 mt-2">
            Browse all icons at{" "}
            <a
              href="https://icon-sets.iconify.design/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              icon-sets.iconify.design
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
