import { Link } from "react-router-dom";
import { useContentStore } from "../../store/contentStore.js";
import EditableText from "../admin/EditableText.jsx";
import EditableIcon from "../admin/EditableIcon.jsx";

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
                <a
                  key={social.id}
                  href="#"
                  className="w-11 h-11 rounded-xl glass glass-hover grid place-items-center text-white/60 hover:text-accent transition-all duration-300 hover:scale-110"
                  aria-label={getText(social.id)}
                >
                  <EditableIcon id={social.iconId} className="w-5 h-5" />
                </a>
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
              <li><Link to="/shop" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_shop_men_polos" as="span" /></Link></li>
              <li><Link to="/shop" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_shop_women_polos" as="span" /></Link></li>
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
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_help_shipping" as="span" /></a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_help_returns" as="span" /></a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_help_size_guide" as="span" /></a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_help_faq" as="span" /></a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_help_contact" as="span" /></a></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full" />
              <EditableText id="footer_company_title" as="span" />
            </h4>
            <ul className="space-y-3 text-white/60">
              <li><Link to="/" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_company_about" as="span" /></Link></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_company_careers" as="span" /></a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_company_press" as="span" /></a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_company_privacy" as="span" /></a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300"><EditableText id="footer_company_terms" as="span" /></a></li>
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
            <form className="space-y-3">
              <input
                type="email"
                placeholder={getText("footer_newsletter_placeholder")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-white/30"
              />
              <button className="w-full bg-gradient-to-r from-accent to-accent-light hover:from-accent-hover hover:to-accent text-white rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 hover:shadow-glow">
                <EditableText id="footer_newsletter_button" as="span" />
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/40">
            <p>© {new Date().getFullYear()} <EditableText id="footer_copyright" as="span" /></p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors"><EditableText id="footer_privacy_link" as="span" /></a>
              <a href="#" className="hover:text-white transition-colors"><EditableText id="footer_terms_link" as="span" /></a>
              <a href="#" className="hover:text-white transition-colors"><EditableText id="footer_cookies_link" as="span" /></a>
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
