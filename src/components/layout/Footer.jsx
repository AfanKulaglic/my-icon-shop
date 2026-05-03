import { Link } from "react-router-dom";
import { useContentStore } from "../../store/contentStore.js";
import EditableText from "../admin/EditableText.jsx";
import EditableIcon from "../admin/EditableIcon.jsx";

// Renders a non-clickable link with a subtle "Coming soon" tooltip and badge.
// Used for features that exist in the UI but are not yet implemented.
function DemoLink({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 cursor-default select-none opacity-50 ${className}`}
      title="Not available in this demo version"
    >
      {children}
      <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-white/20 text-white/40 leading-none">
        soon
      </span>
    </span>
  );
}

export default function Footer() {
  const getText = useContentStore((s) => s.getText);
  
  return (
    <footer className="border-t border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container-x py-20 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* BRAND */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <img 
                src="/images/logo.png" 
                alt="my-icon.shop" 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span className="font-heading text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">
                  my-icon
                </span>
                <span className="text-accent group-hover:text-secondary transition-colors duration-300">.</span>
                <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">
                  shop
                </span>
              </span>
            </Link>
            <EditableText 
              id="footer_brand_desc" 
              as="p" 
              className="text-white/60 leading-relaxed mb-8 max-w-sm" 
            />
            
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { id: "footer_social_twitter", iconId: "footer_social_twitter_icon" },
                { id: "footer_social_instagram", iconId: "footer_social_instagram_icon" },
                { id: "footer_social_facebook", iconId: "footer_social_facebook_icon" },
                { id: "footer_social_linkedin", iconId: "footer_social_linkedin_icon" },
              ].map((social) => (
                <div
                  key={social.id}
                  className="w-11 h-11 rounded-xl glass grid place-items-center text-white/25 cursor-default opacity-50"
                  title="Not available in this demo version"
                  aria-label={getText(social.id)}
                >
                  <EditableIcon id={social.iconId} className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          {/* SHOP */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full" />
              <EditableText id="footer_shop_title" as="span" />
            </h4>
            <ul className="space-y-3 text-white/60">
              <li><Link to="/shop" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_shop_all" as="span" /></Link></li>
              <li><Link to="/shop?category=man" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_shop_men_polos" as="span" /></Link></li>
              <li><Link to="/shop?category=woman" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_shop_women_polos" as="span" /></Link></li>
              <li><Link to="/shop" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_shop_hoodies" as="span" /></Link></li>
              <li><Link to="/editor" className="hover:text-accent hover:translate-x-1 inline-block transition-all duration-300 font-semibold"><EditableText id="footer_shop_studio" as="span" /></Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full" />
              <EditableText id="footer_help_title" as="span" />
            </h4>
            <ul className="space-y-3 text-white/60">
              <li><DemoLink><EditableText id="footer_help_shipping" as="span" /></DemoLink></li>
              <li><DemoLink><EditableText id="footer_help_returns" as="span" /></DemoLink></li>
              <li><DemoLink><EditableText id="footer_help_size_guide" as="span" /></DemoLink></li>
              <li><DemoLink><EditableText id="footer_help_faq" as="span" /></DemoLink></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_help_contact" as="span" /></Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full" />
              <EditableText id="footer_company_title" as="span" />
            </h4>
            <ul className="space-y-3 text-white/60">
              <li><Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_company_about" as="span" /></Link></li>
              <li><DemoLink><EditableText id="footer_company_careers" as="span" /></DemoLink></li>
              <li><DemoLink><EditableText id="footer_company_press" as="span" /></DemoLink></li>
              <li><DemoLink><EditableText id="footer_company_privacy" as="span" /></DemoLink></li>
              <li><DemoLink><EditableText id="footer_company_terms" as="span" /></DemoLink></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full" />
              <EditableText id="footer_newsletter_title" as="span" />
            </h4>
            <EditableText 
              id="footer_newsletter_desc" 
              as="p" 
              className="text-white/60 text-sm mb-4" 
            />
            <div className="space-y-3 opacity-50 pointer-events-none" title="Not available in this demo version">
              <input
                type="email"
                placeholder={getText("footer_newsletter_placeholder")}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 cursor-not-allowed"
              />
              <button disabled className="w-full bg-gradient-to-r from-accent/50 to-accent-light/50 text-white/60 rounded-xl px-4 py-3 text-sm font-semibold cursor-not-allowed">
                <EditableText id="footer_newsletter_button" as="span" />
              </button>
            </div>
            <p className="text-[10px] text-white/25 mt-2">Newsletter available in the full release.</p>
          </div>
        </div>

        {/* DEMO NOTICE */}
        <div className="mb-8 flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-accent/20 bg-accent/5 backdrop-blur-sm">
          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-accent/90 leading-snug">Demo Version</p>
            <p className="text-[11px] text-white/40 leading-snug mt-0.5">
              This is a demonstration build. Greyed-out links (Shipping, Returns, Careers, Privacy, Social, etc.) are placeholders for the full release.
            </p>
          </div>
          <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-accent/30 text-accent/70">
            Preview
          </span>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/40">
            <p>© {new Date().getFullYear()} <EditableText id="footer_copyright" as="span" /></p>
            <div className="flex gap-6">
              <span className="opacity-40 cursor-default" title="Not available in this demo version"><EditableText id="footer_privacy_link" as="span" /></span>
              <span className="opacity-40 cursor-default" title="Not available in this demo version"><EditableText id="footer_terms_link" as="span" /></span>
              <span className="opacity-40 cursor-default" title="Not available in this demo version"><EditableText id="footer_cookies_link" as="span" /></span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="flex items-center gap-3">
            <EditableText id="footer_payment_text" as="span" className="text-xs text-white/40" />
            <div className="flex gap-2">
              {["💳", "🏦", "💰", "🔒"].map((icon, i) => (
                <div key={i} className="w-10 h-7 rounded-lg glass grid place-items-center text-sm">
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
