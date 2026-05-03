import { useState, useEffect } from "react";
import { useContentStore } from "../../store/contentStore.js";
import ContentEditor from "./ContentEditor.jsx";
import ProductManager from "./ProductManager.jsx";
import LivePreview from "./LivePreview.jsx";
import OrdersManager from "./OrdersManager.jsx";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("content");
  const [previewPage, setPreviewPage] = useState("home");
  const [selectedField, setSelectedField] = useState(null);
  const currentLanguage = useContentStore((s) => s.currentLanguage);
  const setLanguage = useContentStore((s) => s.setLanguage);
  const initFirebase = useContentStore((s) => s.initFirebase);

  // Initialize Firebase on mount
  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  const handleEditField = (fieldKey) => {
    setSelectedField(fieldKey);
    setActiveTab("content");
    // Scroll to the field in ContentEditor
    setTimeout(() => {
      const fieldElement = document.querySelector(`[data-field-key="${fieldKey}"]`);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fieldElement.classList.add('highlight-field');
        setTimeout(() => fieldElement.classList.remove('highlight-field'), 2000);
      }
    }, 100);
  };

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "bs", name: "Bosanski", flag: "🇧🇦" },
  ];

  return (
    <div className="h-screen flex flex-col bg-primary text-white overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b border-white/10 flex items-center px-4 bg-primary-light shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading text-base leading-tight">
              my-icon<span className="text-accent">.</span>shop
            </h1>
            <p className="text-[9px] text-white/50 uppercase tracking-wider">
              Content Management
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Language Selector - Only show for content tab */}
          {activeTab === "content" && (
            <div className="flex items-center gap-1 bg-primary border border-white/10 rounded-lg p-0.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                    currentLanguage === lang.code
                      ? "bg-accent text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                  title={lang.name}
                >
                  {lang.flag} {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-xs border border-white/10 hover:border-red-400/40 text-white/70 hover:text-red-300 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-white/10 flex shrink-0 bg-primary-light/40">
        {["content", "products", "orders"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeTab === t
                ? "text-accent border-b-2 border-accent"
                : "text-white/50 hover:text-white"
            }`}
          >
            {t === "content" ? "Content Editor" : t === "products" ? "Product Manager" : "Orders"}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left / Main Panel */}
        <div className={`${activeTab === "orders" ? "w-full" : "w-full lg:w-[480px]"} border-r border-white/10 flex flex-col bg-primary-light/40 overflow-hidden transition-all duration-300`}>
          <div className="border-b border-white/10 px-4 py-3 shrink-0">
            <h2 className="font-heading text-base mb-0.5">
              {activeTab === "content" ? "Content Editor" : activeTab === "products" ? "Product Manager" : "Orders"}
            </h2>
            <p className="text-xs text-white/50">
              {activeTab === "content"
                ? `Edit text content for ${languages.find(l => l.code === currentLanguage)?.name}`
                : activeTab === "products"
                ? "Manage product colors and sizes"
                : "View and manage customer orders from Firebase"}
            </p>
          </div>

          {activeTab === "content" ? <ContentEditor selectedField={selectedField} /> : activeTab === "products" ? <ProductManager /> : <OrdersManager />}
        </div>

        {/* Right Panel - Live Preview (desktop only) */}
        {activeTab !== "orders" && (
          <div className="hidden lg:flex flex-1 flex-col bg-primary">
            <div className="border-b border-white/10 p-4 flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-heading text-xl mb-1">Live Preview</h2>
                <p className="text-xs text-white/50">See changes in real-time</p>
              </div>
              <div className="flex gap-2">
                {["home", "shop", "about", "contact"].map((page) => (
                  <button
                    key={page}
                    onClick={() => setPreviewPage(page)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      previewPage === page
                        ? "bg-accent text-white"
                        : "bg-white/5 text-white/60 hover:text-white"
                    }`}
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <LivePreview page={previewPage} onEditField={handleEditField} />
          </div>
        )}
      </div>
    </div>
  );
}
