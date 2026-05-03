import { useState } from "react";
import { motion } from "framer-motion";
import { useContentStore } from "../store/contentStore.js";
import { useEffect } from "react";
import EditableContent from "../components/admin/EditableContent.jsx";
import EditableText from "../components/admin/EditableText.jsx";
import EditableIcon from "../components/admin/EditableIcon.jsx";

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

export default function Contact() {
  const getText = useContentStore((s) => s.getText);
  const initFirebase = useContentStore((s) => s.initFirebase);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Initialize Firebase on mount
  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden min-h-[40vh] lg:min-h-[70vh] flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-gray-900 to-primary">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-secondary/20 rounded-full blur-[120px]"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 lg:px-12 py-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-accent/80 to-secondary/80 border-2 border-white/30 mb-4 lg:mb-8 shadow-xl"
            >
              <div className="relative">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping opacity-50" />
              </div>
              <EditableContent id="contact_badge" as="span">
                <span className="text-sm font-bold text-white drop-shadow-lg">
                  {getText("contact_badge") || "Get In Touch"}
                </span>
              </EditableContent>
            </motion.div>

            <EditableContent id="contact_title" as="motion.h1">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl lg:text-6xl xl:text-7xl font-heading font-black mb-3 lg:mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent">
                  {getText("contact_title") || "Contact Us"}
                </span>
              </motion.h1>
            </EditableContent>

            <EditableContent id="contact_subtitle" as="motion.p">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm lg:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto"
              >
                {getText("contact_subtitle") || "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
              </motion.p>
            </EditableContent>
          </div>
        </div>
      </section>

      {/* CONTACT FORM & INFO */}
      <section className="w-full py-10 lg:py-32 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-accent/5 via-secondary/5 to-accent-light/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Left - Contact Form */}
            <motion.div {...fade}>
              <div className="glass rounded-2xl p-4 lg:p-10 border border-white/10">
                <EditableContent id="contact_form_title" as="h2">
                  <h2 className="text-xl lg:text-3xl font-heading font-black mb-3 lg:mb-6 text-white">
                    {getText("contact_form_title") || "Send us a Message"}
                  </h2>
                </EditableContent>

                <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-white/80 mb-2">
                      <EditableText id="form_name_label" fallback="Name" as="span" />
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 lg:px-4 lg:py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/40 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                      placeholder={getText("form_name_placeholder") || "Your name"}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-white/80 mb-2">
                      <EditableText id="form_email_label" fallback="Email" as="span" />
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 lg:px-4 lg:py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/40 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                      placeholder={getText("form_email_placeholder") || "your@email.com"}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-white/80 mb-2">
                      <EditableText id="form_subject_label" fallback="Subject" as="span" />
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 lg:px-4 lg:py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/40 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                      placeholder={getText("form_subject_placeholder") || "How can we help?"}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-white/80 mb-2">
                      <EditableText id="form_message_label" fallback="Message" as="span" />
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-3 py-2 lg:px-4 lg:py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/40 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-300 resize-none"
                      placeholder={getText("form_message_placeholder") || "Tell us more about your inquiry..."}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-2.5 lg:px-8 lg:py-4 bg-gradient-to-r from-accent to-accent-light rounded-xl font-bold text-sm lg:text-lg text-white hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-accent/50 flex items-center justify-center gap-3"
                  >
                    <span>{submitted ? <EditableText id="form_submit_success" fallback="Message Sent!" as="span" /> : <EditableText id="form_submit_button" fallback="Send Message" as="span" />}</span>
                    {submitted ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Right - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4 lg:space-y-8"
            >
              <div>
                <EditableContent id="contact_info_title" as="h2">
                  <h2 className="text-xl lg:text-3xl font-heading font-black mb-3 lg:mb-6 text-white">
                    {getText("contact_info_title") || "Contact Information"}
                  </h2>
                </EditableContent>
                <EditableContent id="contact_info_desc" as="p">
                  <p className="text-sm lg:text-lg text-white/70 leading-relaxed mb-4 lg:mb-8">
                    {getText("contact_info_desc") || "Reach out to us through any of these channels. We're here to help!"}
                  </p>
                </EditableContent>
              </div>

              <div className="space-y-6">
                {[
                  {
                    id: "contact_email",
                    iconKey: "contact_email_icon",
                    fallbackIcon: "mdi:email",
                    iconColor: "text-accent",
                    titleKey: "contact_email_label",
                    valueKey: "contact_email",
                    link: `mailto:${getText("contact_email") || "myicon2025@gmail.com"}`
                  },
                  {
                    id: "contact_phone_1",
                    iconKey: "contact_phone_icon",
                    fallbackIcon: "mdi:phone",
                    iconColor: "text-accent",
                    titleKey: "contact_phone_label",
                    valueKey: "contact_phone_1",
                    link: `tel:${(getText("contact_phone_1") || "02191 5606112").replace(/\s/g, '')}`
                  },
                  {
                    id: "contact_phone_2",
                    iconKey: "contact_mobile_icon",
                    fallbackIcon: "mdi:cellphone",
                    iconColor: "text-accent",
                    titleKey: "contact_mobile_label",
                    valueKey: "contact_phone_2",
                    value2Key: "contact_phone_3",
                    link: null
                  },
                  {
                    id: "contact_website",
                    iconKey: "contact_website_icon",
                    fallbackIcon: "mdi:web",
                    iconColor: "text-accent",
                    titleKey: "contact_website_label",
                    valueKey: "contact_website",
                    link: `https://${getText("contact_website") || "www.my-icon.shop"}`
                  },
                  {
                    id: "contact_hours",
                    iconKey: "contact_hours_icon",
                    fallbackIcon: "mdi:clock-outline",
                    iconColor: "text-accent",
                    titleKey: "contact_hours_label",
                    valueKey: "contact_hours",
                    link: null
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="glass rounded-2xl p-3 lg:p-6 border border-white/10 hover:border-accent/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ${item.iconColor}`}>
                        <EditableIcon id={item.iconKey} className="w-7 h-7 lg:w-10 lg:h-10" fallback={item.fallbackIcon} />
                      </div>
                      <div className="flex-1">
                        <EditableText id={item.titleKey} fallback={getText(item.titleKey)} as="h3" className="text-sm lg:text-lg font-bold text-white mb-0.5" />
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-white/70 hover:text-accent transition-colors duration-300"
                          >
                            {item.value2Key ? (
                              <span>
                                <EditableText id={item.valueKey} fallback={getText(item.valueKey)} as="span" />
                                {" / "}
                                <EditableText id={item.value2Key} fallback={getText(item.value2Key)} as="span" />
                              </span>
                            ) : (
                              <EditableText id={item.valueKey} fallback={getText(item.valueKey)} as="span" />
                            )}
                          </a>
                        ) : (
                          item.value2Key ? (
                            <p className="text-white/70">
                              <EditableText id={item.valueKey} fallback={getText(item.valueKey)} as="span" />
                              {" / "}
                              <EditableText id={item.value2Key} fallback={getText(item.value2Key)} as="span" />
                            </p>
                          ) : (
                            <EditableText id={item.valueKey} fallback={getText(item.valueKey)} as="p" className="text-white/70" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="glass rounded-2xl p-3 lg:p-6 border border-white/10">
                <EditableText id="social_follow_title" fallback="Follow Us" as="h3" className="text-sm lg:text-lg font-bold text-white mb-3" />
                <div className="flex gap-4">
                  {[
                    { nameKey: "social_facebook", iconKey: "social_facebook_icon", fallbackIcon: "mdi:facebook", color: "text-accent" },
                    { nameKey: "social_twitter", iconKey: "social_twitter_icon", fallbackIcon: "mdi:twitter", color: "text-accent" },
                    { nameKey: "social_instagram", iconKey: "social_instagram_icon", fallbackIcon: "mdi:instagram", color: "text-accent" },
                    { nameKey: "social_linkedin", iconKey: "social_linkedin_icon", fallbackIcon: "mdi:linkedin", color: "text-accent" },
                  ].map((social, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-xl glass border border-white/10 hover:border-accent/50 flex items-center justify-center text-2xl transition-all duration-300"
                      title={getText(social.nameKey)}
                    >
                      <div className={social.color}>
                        <EditableIcon id={social.iconKey} className="w-6 h-6" fallback={social.fallbackIcon} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="w-full py-10 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary to-gray-900" />
        
        <div className="relative z-10 px-6 lg:px-12 max-w-4xl mx-auto">
          <motion.div {...fade} className="text-center mb-6 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <EditableText id="faq_badge" fallback="FAQ" as="span" className="text-xs font-bold text-accent uppercase tracking-wider" />
            </div>

            <EditableText
              id="faq_title"
              as="h2"
              fallback="Frequently Asked Questions"
              className="text-2xl lg:text-5xl font-heading font-black mb-3 lg:mb-6 bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent"
            />
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: getText("faq_q1") || "How long does production take?",
                a: getText("faq_a1") || "Most orders are produced within 24-48 hours and shipped immediately after."
              },
              {
                q: getText("faq_q2") || "Can I see my design before ordering?",
                a: getText("faq_a2") || "Yes! Our 3D editor shows you exactly how your design will look in real-time."
              },
              {
                q: getText("faq_q3") || "What if I'm not satisfied with my order?",
                a: getText("faq_a3") || "We offer a 30-day satisfaction guarantee. If you're not happy, we'll make it right."
              },
              {
                q: getText("faq_q4") || "Do you offer bulk discounts?",
                a: getText("faq_a4") || "Yes! Contact us for special pricing on orders of 10 or more items."
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-3 lg:p-6 border border-white/10 hover:border-accent/30 transition-all duration-300"
              >
                <EditableText id={`faq_q${i + 1}`} fallback={faq.q} as="h3" className="text-sm lg:text-lg font-bold text-white mb-1.5" />
                <EditableText id={`faq_a${i + 1}`} fallback={faq.a} as="p" className="text-xs lg:text-base text-white/70 leading-relaxed" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
