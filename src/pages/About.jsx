import { Link } from "react-router-dom";
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

export default function About() {
  const getText = useContentStore((s) => s.getText);
  const initFirebase = useContentStore((s) => s.initFirebase);

  // Initialize Firebase on mount
  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

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
              <EditableContent id="about_badge" as="span">
                <span className="text-sm font-bold text-white drop-shadow-lg">
                  {getText("about_badge") || "Our Story"}
                </span>
              </EditableContent>
            </motion.div>

            <EditableContent id="about_title" as="motion.h1">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl lg:text-6xl xl:text-7xl font-heading font-black mb-3 lg:mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent">
                  {getText("about_title") || "About Us"}
                </span>
              </motion.h1>
            </EditableContent>

            <EditableContent id="about_subtitle" as="motion.p">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-sm lg:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto"
              >
                {getText("about_subtitle") || "Empowering creativity through innovative 3D design technology"}
              </motion.p>
            </EditableContent>
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="w-full py-10 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary to-gray-900" />
        
        <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left - Content */}
            <motion.div {...fade}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-3 lg:mb-6">
              <EditableContent id="mission_badge" as="span">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  {getText("mission_badge") || "Our Mission"}
                </span>
              </EditableContent>
              </div>

              <EditableContent id="mission_title" as="h2">
                <h2 className="text-2xl lg:text-5xl font-heading font-black mb-3 lg:mb-6 text-white">
                  {getText("mission_title") || "Revolutionizing Custom Apparel"}
                </h2>
              </EditableContent>

              <EditableContent id="mission_desc1" as="p">
                <p className="text-sm lg:text-lg text-white/70 leading-relaxed mb-3 lg:mb-6">
                  {getText("mission_desc1") || "We believe everyone should have the power to create unique, personalized apparel without the complexity of traditional design tools. Our mission is to make custom clothing accessible, affordable, and enjoyable for everyone."}
                </p>
              </EditableContent>

              <EditableContent id="mission_desc2" as="p">
                <p className="text-sm lg:text-lg text-white/70 leading-relaxed">
                  {getText("mission_desc2") || "Using cutting-edge 3D technology, we've built a platform that lets you visualize your designs in real-time, ensuring what you see is exactly what you get."}
                </p>
              </EditableContent>
            </motion.div>

            {/* Right - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4 md:gap-6"
            >
              {[
                { numberKey: "stat1_number", labelKey: "stat1_label", iconKey: "stat1_icon", fallbackIcon: "mdi:account-group", color: "text-accent" },
                { numberKey: "stat2_number", labelKey: "stat2_label", iconKey: "stat2_icon", fallbackIcon: "mdi:palette", color: "text-accent" },
                { numberKey: "stat3_number", labelKey: "stat3_label", iconKey: "stat3_icon", fallbackIcon: "mdi:star", color: "text-accent" },
                { numberKey: "stat4_number", labelKey: "stat4_label", iconKey: "stat4_icon", fallbackIcon: "mdi:rocket-launch", color: "text-accent" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                  <div className="glass rounded-2xl p-3 lg:p-6 border border-white/10 hover:border-accent/30 transition-all duration-300 text-center">
                    <div className={`text-4xl mb-2 ${stat.color}`}>
                      <EditableIcon id={stat.iconKey} className="w-7 h-7 lg:w-10 lg:h-10 mx-auto" fallback={stat.fallbackIcon} />
                    </div>
                    <EditableText
                      id={stat.numberKey}
                      as="div"
                      fallback={getText(stat.numberKey)}
                      className="text-xl lg:text-4xl font-black bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-1"
                    />
                    <EditableText
                      id={stat.labelKey}
                      as="div"
                      fallback={getText(stat.labelKey)}
                      className="text-sm text-white/60"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="w-full py-10 lg:py-32 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-accent/5 via-secondary/5 to-accent-light/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 px-6 lg:px-12">
          <motion.div {...fade} className="text-center mb-8 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-3 lg:mb-6">
              <EditableText id="values_badge" fallback="Our Values" as="span" className="text-xs font-bold text-accent uppercase tracking-wider" />
            </div>

            <EditableText
              id="values_title"
              as="h2"
              fallback="What Drives Us"
              className="text-4xl lg:text-5xl font-heading font-black mb-6 bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
            {[
              {
                iconKey: "value1_icon",
                fallbackIcon: "mdi:lightbulb-on",
                iconColor: "text-accent",
                titleKey: "value1_title",
                descKey: "value1_desc",
                color: "from-accent to-accent-light"
              },
              {
                iconKey: "value2_icon",
                fallbackIcon: "mdi:handshake",
                iconColor: "text-accent",
                titleKey: "value2_title",
                descKey: "value2_desc",
                color: "from-secondary to-secondary-light"
              },
              {
                iconKey: "value3_icon",
                fallbackIcon: "mdi:star-circle",
                iconColor: "text-accent",
                titleKey: "value3_title",
                descKey: "value3_desc",
                color: "from-accent-light to-secondary"
              },
            ].map((value, i, array) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative group"
              >
                <div className="glass rounded-2xl p-4 lg:p-8 border border-white/10 hover:border-accent/30 transition-all duration-500 group-hover:scale-105">
                  <div className={`mb-3 lg:mb-6 group-hover:scale-110 transition-transform duration-300 ${value.iconColor}`}>
                    <EditableIcon id={value.iconKey} className="w-8 h-8 lg:w-16 lg:h-16" fallback={value.fallbackIcon} />
                  </div>
                  <EditableText
                    id={value.titleKey}
                    as="h3"
                    fallback={getText(value.titleKey)}
                    className={`text-lg lg:text-2xl font-heading font-bold mb-2 lg:mb-4 bg-gradient-to-r ${value.color} bg-clip-text text-transparent`}
                  />
                  <EditableText
                    id={value.descKey}
                    as="p"
                    fallback={getText(value.descKey)}
                    className="text-sm lg:text-base text-white/70 leading-relaxed"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="w-full py-10 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-secondary/10 to-accent-light/10" />
        
        <div className="relative z-10 px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center glass rounded-2xl p-5 lg:p-16 border border-white/20"
          >
            <EditableText
              id="about_cta_title"
              as="h2"
              fallback="Ready to Create Something Amazing?"
              className="text-4xl lg:text-5xl font-heading font-black mb-6 bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent"
            />
            <EditableText
              id="about_cta_desc"
              as="p"
              fallback="Join thousands of creators who trust us with their custom designs"
              className="text-sm lg:text-xl text-white/70 mb-4 lg:mb-8 leading-relaxed"
            />
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-accent-light rounded-xl font-bold text-sm lg:text-lg text-white hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-accent/50"
              >
                <span>Start Designing</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-white/20 hover:border-accent/50 rounded-xl font-bold text-sm lg:text-lg backdrop-blur-sm hover:bg-white/5 transition-all duration-300 hover:scale-105"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
