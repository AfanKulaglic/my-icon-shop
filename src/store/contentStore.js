import { create } from "zustand";
import { getFirebaseDatabase } from "../firebase/config.js";
import { ref, set as firebaseSet, onValue, get as firebaseGet } from "firebase/database";

// Default content in three languages
const defaultContent = {
  en: {
    // Hero Section
    hero_subtitle: "Custom apparel studio",
    hero_title: "Wear what you design.",
    hero_description: "Step into the studio. Drop a logo, type a phrase, place it on a real 3D shirt — then we print it and ship it.",
    hero_button_primary: "Start Designing",
    hero_button_secondary: "Browse Shop",
    
    // Stats
    stats_designs: "Designs Created",
    stats_satisfaction: "Satisfaction",
    stats_delivery: "Fast Delivery",
    
    // Hero Stats (the 6+, 100%, 3D section)
    hero_stat1_number: "6+",
    hero_stat1_label: "Products",
    hero_stat2_number: "100%",
    hero_stat2_label: "Customizable",
    hero_stat3_number: "3D",
    hero_stat3_label: "Preview",
    
    // Category Tabs
    category_tab_man: "MAN",
    category_tab_woman: "WOMAN",
    category_tab_others: "OTHERS",
    category_tab_man_icon: "mdi:tshirt-crew",
    category_tab_woman_icon: "mdi:dress",
    category_tab_others_icon: "mdi:star",
    
    // View All Button
    view_all_button: "VIEW ALL",
    
    // Process Section
    process_badge: "Simple Process",
    process_title: "How It Works",
    process_description: "From concept to creation in three seamless steps",
    step1_title: "Choose Your Canvas",
    step1_desc: "Select from our premium collection of polos, hoodies, and more. Each piece crafted with quality materials.",
    step2_title: "Design in 3D",
    step2_desc: "Use our intuitive 3D studio to add text, logos, and graphics. Watch your design come alive in real-time.",
    step3_title: "We Print & Ship",
    step3_desc: "High-precision printing with fast turnaround. Your custom piece delivered to your door.",
    
    // Features Section
    features_badge: "Why Choose Us",
    features_title: "Cutting-Edge",
    features_subtitle: "Technology",
    features_description: "Industry-leading features that set us apart from the competition",
    feature1_title: "3D Preview",
    feature1_desc: "Real-time visualization",
    feature2_title: "Fast Turnaround",
    feature2_desc: "24-48 hour production",
    feature3_title: "Premium Quality",
    feature3_desc: "High-grade materials",
    feature4_title: "Secure Payment",
    feature4_desc: "Encrypted checkout",
    
    // Testimonials Section
    testimonials_badge: "Testimonials",
    testimonials_title: "Loved by",
    testimonials_subtitle: "Creators",
    testimonials_description: "Join thousands of satisfied customers who trust us with their custom designs",
    testimonial1_name: "Sarah Chen",
    testimonial1_role: "Small Business Owner",
    testimonial1_text: "The 3D editor is a game-changer! I designed custom polos for my team in minutes. The quality is outstanding and the process was seamless.",
    testimonial2_name: "Marcus Johnson",
    testimonial2_role: "Graphic Designer",
    testimonial2_text: "Finally, a platform that lets me see exactly how my designs will look before printing. The real-time 3D preview is incredibly accurate.",
    testimonial3_name: "Emily Rodriguez",
    testimonial3_role: "Event Coordinator",
    testimonial3_text: "Ordered 50 custom hoodies for our conference. Fast delivery, perfect prints, and the team absolutely loved them. Will definitely order again!",
    trust_customers_number: "15,000+",
    trust_customers: "Happy Customers",
    trust_rating_number: "4.9/5",
    trust_rating: "Average Rating",
    trust_delivery_number: "24h",
    trust_delivery: "Fast Delivery",
    
    // Categories Section
    categories_title: "Categories",
    categories_view_all: "View all →",
    category_men_polos: "Men's Polos",
    category_women_polos: "Women's Polos",
    category_men_hoodies: "Men's Hoodies",
    category_men_tshirts: "Men's T-Shirts",
    category_women_tshirts: "Women's T-Shirts",
    
    // Featured Section
    featured_title: "Featured",
    categories_badge: "Exclusive Categories",
    product_discover: "Discover",
    
    // CTA Section
    cta_badge: "Ready to Start?",
    cta_title: "Your next favorite piece is one design away.",
    cta_description: "Open the editor, drop your idea on a 3D shirt, and watch it come to life.",
    cta_button: "Open Editor",
    cta_button_secondary: "Browse Shop",
    cta_feature1_title: "Instant Preview",
    cta_feature1_desc: "See your design in real-time 3D",
    cta_feature2_title: "Fast Production",
    cta_feature2_desc: "24-48 hour turnaround time",
    cta_feature3_title: "Premium Quality",
    cta_feature3_desc: "Professional-grade materials",
    
    // Additional Hero Buttons
    hero_button_design: "Start Designing",
    
    // Additional Product/Category Labels
    product_discover: "Discover",
    
    // Form Labels
    form_name_label: "Name",
    form_email_label: "Email",
    form_subject_label: "Subject",
    form_message_label: "Message",
    form_name_placeholder: "Your name",
    form_email_placeholder: "your@email.com",
    form_subject_placeholder: "How can we help?",
    form_message_placeholder: "Tell us more about your inquiry...",
    form_submit_button: "Send Message",
    form_submit_success: "Message Sent!",
    
    // Social Media
    social_follow_title: "Follow Us",
    social_facebook: "Facebook",
    social_twitter: "Twitter",
    social_instagram: "Instagram",
    social_linkedin: "LinkedIn",
    
    // FAQ Questions and Answers
    faq_q1: "How long does production take?",
    faq_a1: "Most orders are produced within 24-48 hours and shipped immediately after.",
    faq_q2: "Can I see my design before ordering?",
    faq_a2: "Yes! Our 3D editor shows you exactly how your design will look in real-time.",
    faq_q3: "What if I'm not satisfied with my order?",
    faq_a3: "We offer a 30-day satisfaction guarantee. If you're not happy, we'll make it right.",
    faq_q4: "Do you offer bulk discounts?",
    faq_a4: "Yes! Contact us for special pricing on orders of 10 or more items.",
    
    // About Page Values
    value1_title: "Innovation",
    value1_icon: "mdi:lightbulb-on",
    value1_desc: "Constantly pushing boundaries with cutting-edge 3D technology",
    value2_title: "Customer First",
    value2_icon: "mdi:handshake",
    value2_desc: "Your satisfaction and creative freedom are our top priorities",
    value3_title: "Quality",
    value3_icon: "mdi:star-circle",
    value3_desc: "Premium materials and precision printing in every product",
    
    // About Page Stats
    stat1_number: "15K+",
    stat1_label: "Happy Customers",
    stat1_icon: "mdi:account-group",
    stat2_number: "50K+",
    stat2_label: "Designs Created",
    stat2_icon: "mdi:palette",
    stat3_number: "4.9/5",
    stat3_label: "Average Rating",
    stat3_icon: "mdi:star",
    stat4_number: "24h",
    stat4_label: "Fast Delivery",
    stat4_icon: "mdi:rocket-launch",
    
    // Images (URLs)
    hero_video: "/videos/Modern 3D Print Shop Promo_720p.mp4",
    featured_image: "/images/featured-couple.png",
    logo_image: "/images/logo.png",
    
    // Icons (Iconify format: prefix:name)
    feature1_icon: "mdi:cube-outline",
    feature2_icon: "mdi:clock-fast",
    feature3_icon: "mdi:star",
    feature4_icon: "mdi:shield-check",
    step1_icon: "mdi:tshirt-crew",
    step2_icon: "mdi:palette",
    step3_icon: "mdi:truck-fast",
    cta_feature1_icon: "mdi:eye",
    cta_feature2_icon: "mdi:lightning-bolt",
    cta_feature3_icon: "mdi:diamond",
    value1_icon: "mdi:lightbulb",
    value2_icon: "mdi:heart",
    value3_icon: "mdi:medal",
    trust_customers_icon: "mdi:check-circle",
    trust_rating_icon: "mdi:star",
    trust_delivery_icon: "mdi:clock-fast",
    contact_email_icon: "mdi:email",
    contact_phone_icon: "mdi:phone",
    contact_mobile_icon: "mdi:cellphone",
    contact_website_icon: "mdi:web",
    contact_hours_icon: "mdi:clock",
    social_facebook_icon: "fa6-brands:facebook",
    social_twitter_icon: "fa6-brands:twitter",
    social_instagram_icon: "fa6-brands:instagram",
    social_linkedin_icon: "fa6-brands:linkedin",
    
    // About Page
    about_badge: "Our Story",
    about_title: "About Us",
    about_subtitle: "Empowering creativity through innovative 3D design technology",
    mission_badge: "Our Mission",
    mission_title: "Revolutionizing Custom Apparel",
    mission_desc1: "We believe everyone should have the power to create unique, personalized apparel without the complexity of traditional design tools. Our mission is to make custom clothing accessible, affordable, and enjoyable for everyone.",
    mission_desc2: "Using cutting-edge 3D technology, we've built a platform that lets you visualize your designs in real-time, ensuring what you see is exactly what you get.",
    values_badge: "Our Values",
    values_title: "What Drives Us",
    about_cta_title: "Ready to Create Something Amazing?",
    about_cta_desc: "Join thousands of creators who trust us with their custom designs",
    
    // Contact Page
    contact_badge: "Get In Touch",
    contact_title: "Contact Us",
    contact_subtitle: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    contact_form_title: "Send us a Message",
    contact_info_title: "Contact Information",
    contact_info_desc: "Reach out to us through any of these channels. We're here to help!",
    contact_email_label: "Email",
    contact_email_icon: "mdi:email",
    contact_email: "myicon2025@gmail.com",
    contact_phone_label: "Phone",
    contact_phone_icon: "mdi:phone",
    contact_phone_1: "02191 5606112",
    contact_mobile_label: "Mobile",
    contact_mobile_icon: "mdi:cellphone",
    contact_phone_2: "0176 64824863",
    contact_phone_3: "0178 8793509",
    contact_website_label: "Website",
    contact_website_icon: "mdi:web",
    contact_website: "www.my-icon.shop",
    contact_hours_label: "Business Hours",
    contact_hours_icon: "mdi:clock-outline",
    contact_hours: "Mon-Fri: 9AM - 6PM",
    
    // Social Media
    social_follow_title: "Follow Us",
    social_facebook: "Facebook",
    social_facebook_icon: "mdi:facebook",
    social_twitter: "Twitter",
    social_twitter_icon: "mdi:twitter",
    social_instagram: "Instagram",
    social_instagram_icon: "mdi:instagram",
    social_linkedin: "LinkedIn",
    social_linkedin_icon: "mdi:linkedin",
    
    faq_badge: "FAQ",
    faq_title: "Frequently Asked Questions",
    
    // Navigation
    nav_home: "Home",
    nav_shop: "Shop",
    nav_studio: "Studio",
    nav_studio_badge: "3D",
    nav_about: "About",
    nav_contact: "Contact",
    nav_search_placeholder: "SEARCH",
    nav_wishlist: "WISHLIST",
    nav_bag: "BAG",
    nav_menu_title: "Menu",
    
    // Navbar Categories
    nav_category_man: "MAN",
    nav_category_man_icon: "mdi:tshirt-crew",
    nav_category_woman: "WOMAN",
    nav_category_woman_icon: "mdi:dress",
    nav_category_others: "OTHERS",
    nav_category_others_icon: "mdi:star",
    nav_category_man_item1: "Polos",
    nav_category_man_item2: "T-Shirts",
    nav_category_man_item3: "Hoodies",
    nav_category_woman_item1: "Polos",
    nav_category_woman_item2: "T-Shirts",
    nav_category_others_item1: "Accessories",
    nav_category_others_item2: "Custom Orders",
    nav_shop_by_category: "Shop by Category",
    nav_language: "Language",
    
    // Footer
    footer_brand_desc: "Premium custom apparel with cutting-edge 3D design technology. Design it, wear it, own it.",
    footer_shop_title: "Shop",
    footer_shop_all: "All Products",
    footer_shop_men_polos: "Men's Polos",
    footer_shop_women_polos: "Women's Polos",
    footer_shop_hoodies: "Hoodies",
    footer_shop_studio: "3D Studio",
    footer_help_title: "Help",
    footer_help_shipping: "Shipping Info",
    footer_help_returns: "Returns & Exchanges",
    footer_help_size_guide: "Size Guide",
    footer_help_faq: "FAQ",
    footer_help_contact: "Contact Us",
    footer_company_title: "Company",
    footer_company_about: "About Us",
    footer_company_careers: "Careers",
    footer_company_press: "Press",
    footer_company_privacy: "Privacy Policy",
    footer_company_terms: "Terms of Service",
    footer_newsletter_title: "Newsletter",
    footer_newsletter_desc: "Get exclusive offers and design tips.",
    footer_newsletter_placeholder: "Enter your email",
    footer_newsletter_button: "Subscribe",
    footer_copyright: "my-icon.shop. All rights reserved.",
    footer_privacy_link: "Privacy",
    footer_terms_link: "Terms",
    footer_cookies_link: "Cookies",
    footer_payment_text: "We accept:",
    footer_social_twitter: "Twitter",
    footer_social_twitter_icon: "fa6-brands:x-twitter",
    footer_social_instagram: "Instagram",
    footer_social_instagram_icon: "fa6-brands:instagram",
    footer_social_facebook: "Facebook",
    footer_social_facebook_icon: "fa6-brands:facebook",
    footer_social_linkedin: "LinkedIn",
    footer_social_linkedin_icon: "fa6-brands:linkedin",
    
    // Shop Page
    shop_title: "Shop",
    shop_description: "Discover premium apparel for your designs.",
    shop_filter_category: "Category",
    shop_filter_size: "Size",
    shop_no_products: "No products match your filters.",
    shop_back: "Back",
    shop_filters: "Filters",
    shop_filter_collection: "Collection",
    shop_filter_price: "Price",
    shop_filter_sort_by: "Sort By",
    shop_sort_featured: "Featured",
    shop_sort_price_low: "Price: Low to High",
    shop_sort_price_high: "Price: High to Low",
    shop_sort_name: "Name",
    shop_apply_filters: "Apply Filters",
    shop_reset: "Reset",
    shop_view: "View",
    shop_design: "Design",
    shop_design_now: "Design Now",
    shop_no_products_title: "No products found",
    shop_no_products_hint: "Try adjusting your filters",
    shop_col_all: "All Products",
    shop_col_men: "Men",
    shop_col_women: "Women",
    shop_col_unisex: "Unisex",
    shop_cat_all: "All",
    shop_cat_polos: "Polos",
    shop_cat_hoodies: "Hoodies",
    shop_cat_tshirts: "T-Shirts",
    shop_cat_accessories: "Accessories",
    
    // Product Card
    product_details: "Details",
    product_customize: "Customize",
    
    // Product Page
    product_color: "Color",
    product_size: "Size",
    product_add_to_cart: "Add to Cart",
    
    // Editor
    editor_zones: "Zones",
    editor_save: "Save OBJ",
    editor_package: "Package",
    editor_design_png: "Design PNG",
    editor_tools: "Tools",
    editor_add_text: "Add Text",
    editor_upload_image: "Upload Image",
    editor_shapes: "Shapes",
    editor_templates: "Templates",
    editor_delete: "Delete selection",
    editor_controls: "Controls",
    editor_scale: "Scale",
    editor_position_x: "Position X",
    editor_position_y: "Position Y",
    editor_rotation: "Rotation",
    editor_color: "Color",
    editor_front: "Front",
    editor_back: "Back",
    editor_sleeves: "Sleeves",
    editor_quick_add: "Quick Add",
    editor_pro_tip: "Pro Tip",
    editor_pro_tip_text: "Use Shift+P to toggle print zones and see exactly where your designs will appear on the shirt.",
    editor_print_area: "Print Area",
    editor_live_sync: "Live Sync",
    editor_element_controls: "Element Controls",
    editor_element_hint: "Adjust selected element",
    editor_no_selection: "No element selected",
    editor_no_selection_hint: "Click on a design element to edit its properties",
    editor_text_color: "Text Color",
    editor_current_color: "Current Color",
    editor_back_btn: "Back",
    editor_studio_label: "Editor",
    editor_toggle_zones: "Toggle Zones",
    editor_save_package: "Save Package",
    editor_quick_guide: "Quick Guide",
    editor_quick_guide_text: "Add elements below \u2192 See them in canvas \u2192 Tap to edit \u2192 Watch your 3D model update in real-time!",
    editor_add_elements: "Add Elements",
    editor_rectangle: "Rectangle",
    editor_circle: "Circle",
    editor_design_area: "Design Area",
    editor_canvas: "Canvas",
    editor_canvas_hint: "Elements appear here instantly. Tap any element to select and edit it below.",
    editor_edit_element: "Edit Element",
    editor_no_selection_tap: "Tap an element in the canvas to edit",
    editor_shape_color: "Shape Color",
    editor_open_editor: "Open Editor",
    editor_close_editor: "Close Editor",
    editor_drag_hint: "Drag to Rotate \u2022 Scroll to Zoom",
    editor_design_studio: "Design Studio",
    editor_design_studio_hint: "Add elements, design, and customize",

    // Cart page
    cart_title: "Cart",
    cart_empty_title: "Your cart is empty",
    cart_empty_desc: "Add some products and come back to check out.",
    cart_browse: "Browse Products",
    cart_continue_editing: "Continue Editing",
    cart_clear: "Clear cart",
    cart_view_wishlist: "View Wishlist",
    cart_order_summary: "Order Summary",
    cart_subtotal: "Subtotal",
    cart_shipping: "Shipping",
    cart_total: "Total",
    cart_checkout: "Checkout",
    cart_continue_shopping: "Continue Shopping",
    cart_order_placed: "Order Placed!",
    cart_order_placed_desc: "Thank you for your order. You'll receive a confirmation soon.",
    cart_back: "Back",

    // Wishlist page
    wishlist_title: "Wishlist",
    wishlist_empty_title: "Your wishlist is empty",
    wishlist_empty_desc: "Save items you love and come back to them anytime.",
    wishlist_browse: "Browse Products",
    wishlist_add_to_cart: "Add to Cart",
    wishlist_customize: "Customize",
    wishlist_clear: "Clear wishlist",
    wishlist_back: "Back",

    // Checkout page
    checkout_title: "Checkout",
    checkout_back: "Back to Cart",
    checkout_customer_info: "Customer Information",
    checkout_name: "Full Name",
    checkout_email: "Email Address",
    checkout_phone: "Phone Number",
    checkout_address: "Street Address",
    checkout_city: "City",
    checkout_zip: "ZIP / Postal Code",
    checkout_country: "Country",
    checkout_order_summary: "Order Summary",
    checkout_subtotal: "Subtotal",
    checkout_shipping: "Shipping",
    checkout_total: "Total",
    checkout_pay_paypal: "Pay with PayPal",
    checkout_required: "Please fill in all required fields.",
    checkout_processing: "Processing Payment...",
    checkout_paypal_connecting: "Connecting to PayPal...",
    checkout_paypal_login: "PayPal Checkout",
    checkout_paypal_login_desc: "You are paying securely via PayPal simulation.",
    checkout_paypal_confirm: "Confirm & Pay",
    checkout_paypal_cancel: "Cancel",
    checkout_success_title: "Payment Successful!",
    checkout_success_desc: "Your order has been placed. You will receive a confirmation email shortly.",
    checkout_success_order: "Order ID",
    checkout_continue_shopping: "Continue Shopping",
    checkout_optional: "optional",
  },
  de: {
    // Hero Section
    hero_subtitle: "Individuelle Bekleidungsstudio",
    hero_title: "Trage was du entwirfst.",
    hero_description: "Betreten Sie das Studio. Platzieren Sie ein Logo, schreiben Sie einen Satz, setzen Sie es auf ein echtes 3D-Shirt — dann drucken und versenden wir es.",
    hero_button_primary: "Design starten",
    hero_button_secondary: "Shop durchsuchen",
    
    // Stats
    stats_designs: "Erstellte Designs",
    stats_satisfaction: "Zufriedenheit",
    stats_delivery: "Schnelle Lieferung",
    
    // Hero Stats (the 6+, 100%, 3D section)
    hero_stat1_number: "6+",
    hero_stat1_label: "Produkte",
    hero_stat2_number: "100%",
    hero_stat2_label: "Anpassbar",
    hero_stat3_number: "3D",
    hero_stat3_label: "Vorschau",
    
    // Category Tabs
    category_tab_man: "MANN",
    category_tab_woman: "FRAU",
    category_tab_others: "ANDERE",
    category_tab_man_icon: "mdi:tshirt-crew",
    category_tab_woman_icon: "mdi:dress",
    category_tab_others_icon: "mdi:star",
    
    // View All Button
    view_all_button: "ALLE ANZEIGEN",
    
    // Process Section
    process_badge: "Einfacher Prozess",
    process_title: "Wie es funktioniert",
    process_description: "Vom Konzept zur Kreation in drei nahtlosen Schritten",
    step1_title: "Wählen Sie Ihre Leinwand",
    step1_desc: "Wählen Sie aus unserer Premium-Kollektion von Polos, Hoodies und mehr. Jedes Stück mit hochwertigen Materialien gefertigt.",
    step2_title: "Design in 3D",
    step2_desc: "Verwenden Sie unser intuitives 3D-Studio, um Text, Logos und Grafiken hinzuzufügen. Sehen Sie zu, wie Ihr Design in Echtzeit zum Leben erwacht.",
    step3_title: "Wir drucken & versenden",
    step3_desc: "Hochpräzisionsdruck mit schneller Bearbeitungszeit. Ihr individuelles Stück wird an Ihre Tür geliefert.",
    
    // Features Section
    features_badge: "Warum uns wählen",
    features_title: "Modernste",
    features_subtitle: "Technologie",
    features_description: "Branchenführende Funktionen, die uns von der Konkurrenz abheben",
    feature1_title: "3D-Vorschau",
    feature1_desc: "Echtzeit-Visualisierung",
    feature2_title: "Schnelle Bearbeitung",
    feature2_desc: "24-48 Stunden Produktion",
    feature3_title: "Premium-Qualität",
    feature3_desc: "Hochwertige Materialien",
    feature4_title: "Sichere Zahlung",
    feature4_desc: "Verschlüsselte Kasse",
    
    // Testimonials Section
    testimonials_badge: "Testimonials",
    testimonials_title: "Geliebt von",
    testimonials_subtitle: "Kreativen",
    testimonials_description: "Schließen Sie sich Tausenden zufriedener Kunden an, die uns ihre individuellen Designs anvertrauen",
    testimonial1_name: "Sarah Chen",
    testimonial1_role: "Kleinunternehmerin",
    testimonial1_text: "Der 3D-Editor ist ein Wendepunkt! Ich habe in Minuten individuelle Polos für mein Team entworfen. Die Qualität ist hervorragend und der Prozess war nahtlos.",
    testimonial2_name: "Marcus Johnson",
    testimonial2_role: "Grafikdesigner",
    testimonial2_text: "Endlich eine Plattform, die mir zeigt, wie meine Designs vor dem Druck aussehen werden. Die Echtzeit-3D-Vorschau ist unglaublich genau.",
    testimonial3_name: "Emily Rodriguez",
    testimonial3_role: "Eventkoordinatorin",
    testimonial3_text: "50 individuelle Hoodies für unsere Konferenz bestellt. Schnelle Lieferung, perfekte Drucke, und das Team liebte sie absolut. Werde definitiv wieder bestellen!",
    trust_customers_number: "15.000+",
    trust_customers: "Zufriedene Kunden",
    trust_rating_number: "4,9/5",
    trust_rating: "Durchschnittsbewertung",
    trust_delivery_number: "24h",
    trust_delivery: "Schnelle Lieferung",
    
    // Categories Section
    categories_title: "Kategorien",
    categories_view_all: "Alle anzeigen →",
    category_men_polos: "Herren Polos",
    category_women_polos: "Damen Polos",
    category_men_hoodies: "Herren Hoodies",
    category_men_tshirts: "Herren T-Shirts",
    category_women_tshirts: "Damen T-Shirts",
    
    // Featured Section
    featured_title: "Empfohlen",
    
    // CTA Section
    cta_badge: "Bereit zu starten?",
    cta_title: "Ihr nächstes Lieblingsstück ist nur ein Design entfernt.",
    cta_description: "Öffnen Sie den Editor, platzieren Sie Ihre Idee auf einem 3D-Shirt und sehen Sie zu, wie es zum Leben erwacht.",
    cta_button: "Editor öffnen",
    cta_feature1_title: "Sofortige Vorschau",
    cta_feature1_desc: "Sehen Sie Ihr Design in Echtzeit-3D",
    cta_feature2_title: "Schnelle Produktion",
    cta_feature2_desc: "24-48 Stunden Bearbeitungszeit",
    cta_feature3_title: "Premium-Qualität",
    cta_feature3_desc: "Professionelle Materialien",
    
    // About Page
    about_badge: "Unsere Geschichte",
    about_title: "Über uns",
    about_subtitle: "Kreativität durch innovative 3D-Design-Technologie fördern",
    mission_badge: "Unsere Mission",
    mission_title: "Revolutionierung individueller Bekleidung",
    mission_desc1: "Wir glauben, dass jeder die Möglichkeit haben sollte, einzigartige, personalisierte Kleidung zu erstellen, ohne die Komplexität traditioneller Design-Tools. Unsere Mission ist es, individuelle Kleidung für jeden zugänglich, erschwinglich und angenehm zu machen.",
    mission_desc2: "Mit modernster 3D-Technologie haben wir eine Plattform entwickelt, die es Ihnen ermöglicht, Ihre Designs in Echtzeit zu visualisieren und sicherzustellen, dass Sie genau das bekommen, was Sie sehen.",
    values_badge: "Unsere Werte",
    values_title: "Was uns antreibt",
    about_cta_title: "Bereit, etwas Erstaunliches zu schaffen?",
    about_cta_desc: "Schließen Sie sich Tausenden von Kreativen an, die uns ihre individuellen Designs anvertrauen",
    
    // Contact Page
    contact_badge: "Kontaktieren Sie uns",
    contact_title: "Kontakt",
    contact_subtitle: "Haben Sie Fragen? Wir würden uns freuen, von Ihnen zu hören. Senden Sie uns eine Nachricht und wir antworten so schnell wie möglich.",
    contact_form_title: "Senden Sie uns eine Nachricht",
    contact_info_title: "Kontaktinformationen",
    contact_info_desc: "Erreichen Sie uns über einen dieser Kanäle. Wir sind hier, um zu helfen!",
    contact_email_label: "E-Mail",
    contact_email: "myicon2025@gmail.com",
    contact_phone_label: "Telefon",
    contact_phone_1: "02191 5606112",
    contact_mobile_label: "Mobil",
    contact_phone_2: "0176 64824863",
    contact_phone_3: "0178 8793509",
    contact_website_label: "Webseite",
    contact_website: "www.my-icon.shop",
    contact_hours_label: "Geschäftszeiten",
    contact_hours: "Mo-Fr: 9-18 Uhr",
    faq_badge: "FAQ",
    faq_title: "Häufig gestellte Fragen",
    
    // Navigation
    nav_home: "Startseite",
    nav_shop: "Shop",
    nav_studio: "Studio",
    nav_studio_badge: "3D",
    nav_about: "Über uns",
    nav_contact: "Kontakt",
    nav_search_placeholder: "SUCHEN",
    nav_wishlist: "WUNSCHLISTE",
    nav_bag: "TASCHE",
    nav_menu_title: "Menü",
    
    // Navbar Categories
    nav_category_man: "MANN",
    nav_category_man_icon: "mdi:tshirt-crew",
    nav_category_woman: "FRAU",
    nav_category_woman_icon: "mdi:dress",
    nav_category_others: "ANDERE",
    nav_category_others_icon: "mdi:star",
    nav_category_man_item1: "Polos",
    nav_category_man_item2: "T-Shirts",
    nav_category_man_item3: "Hoodies",
    nav_category_woman_item1: "Polos",
    nav_category_woman_item2: "T-Shirts",
    nav_category_others_item1: "Zubehör",
    nav_category_others_item2: "Individuelle Bestellungen",
    nav_shop_by_category: "Nach Kategorie einkaufen",
    nav_language: "Sprache",
    
    // Footer
    footer_brand_desc: "Premium-Bekleidung mit modernster 3D-Design-Technologie. Entwerfen Sie es, tragen Sie es, besitzen Sie es.",
    footer_shop_title: "Shop",
    footer_shop_all: "Alle Produkte",
    footer_shop_men_polos: "Herren Polos",
    footer_shop_women_polos: "Damen Polos",
    footer_shop_hoodies: "Hoodies",
    footer_shop_studio: "3D Studio",
    footer_help_title: "Hilfe",
    footer_help_shipping: "Versandinformationen",
    footer_help_returns: "Rücksendungen & Umtausch",
    footer_help_size_guide: "Größentabelle",
    footer_help_faq: "FAQ",
    footer_help_contact: "Kontaktieren Sie uns",
    footer_company_title: "Unternehmen",
    footer_company_about: "Über uns",
    footer_company_careers: "Karriere",
    footer_company_press: "Presse",
    footer_company_privacy: "Datenschutzrichtlinie",
    footer_company_terms: "Nutzungsbedingungen",
    footer_newsletter_title: "Newsletter",
    footer_newsletter_desc: "Erhalten Sie exklusive Angebote und Design-Tipps.",
    footer_newsletter_placeholder: "Geben Sie Ihre E-Mail ein",
    footer_newsletter_button: "Abonnieren",
    footer_copyright: "my-icon.shop. Alle Rechte vorbehalten.",
    footer_privacy_link: "Datenschutz",
    footer_terms_link: "Bedingungen",
    footer_cookies_link: "Cookies",
    footer_payment_text: "Wir akzeptieren:",
    footer_social_twitter: "Twitter",
    footer_social_twitter_icon: "fa6-brands:x-twitter",
    footer_social_instagram: "Instagram",
    footer_social_instagram_icon: "fa6-brands:instagram",
    footer_social_facebook: "Facebook",
    footer_social_facebook_icon: "fa6-brands:facebook",
    footer_social_linkedin: "LinkedIn",
    footer_social_linkedin_icon: "fa6-brands:linkedin",
    
    // Icons (same as English - icons are universal)
    feature1_icon: "mdi:cube-outline",
    feature2_icon: "mdi:clock-fast",
    feature3_icon: "mdi:star",
    feature4_icon: "mdi:shield-check",
    step1_icon: "mdi:tshirt-crew",
    step2_icon: "mdi:palette",
    step3_icon: "mdi:truck-fast",
    cta_feature1_icon: "mdi:eye",
    cta_feature2_icon: "mdi:lightning-bolt",
    cta_feature3_icon: "mdi:diamond",
    value1_icon: "mdi:lightbulb",
    value2_icon: "mdi:heart",
    value3_icon: "mdi:medal",
    trust_customers_icon: "mdi:check-circle",
    trust_rating_icon: "mdi:star",
    trust_delivery_icon: "mdi:clock-fast",
    contact_email_icon: "mdi:email",
    contact_phone_icon: "mdi:phone",
    contact_mobile_icon: "mdi:cellphone",
    contact_website_icon: "mdi:web",
    contact_hours_icon: "mdi:clock",
    social_facebook_icon: "fa6-brands:facebook",
    social_twitter_icon: "fa6-brands:twitter",
    social_instagram_icon: "fa6-brands:instagram",
    social_linkedin_icon: "fa6-brands:linkedin",
    
    // Shop Page
    shop_title: "Shop",
    shop_description: "Entdecken Sie Premium-Kleidung für Ihre Designs.",
    shop_filter_category: "Kategorie",
    shop_filter_size: "Größe",
    shop_no_products: "Keine Produkte entsprechen Ihren Filtern.",
    shop_back: "Zurück",
    shop_filters: "Filter",
    shop_filter_collection: "Kollektion",
    shop_filter_price: "Preis",
    shop_filter_sort_by: "Sortieren nach",
    shop_sort_featured: "Empfohlen",
    shop_sort_price_low: "Preis: Aufsteigend",
    shop_sort_price_high: "Preis: Absteigend",
    shop_sort_name: "Name",
    shop_apply_filters: "Filter anwenden",
    shop_reset: "Zurücksetzen",
    shop_view: "Ansehen",
    shop_design: "Gestalten",
    shop_design_now: "Jetzt gestalten",
    shop_no_products_title: "Keine Produkte gefunden",
    shop_no_products_hint: "Filter anpassen",
    shop_col_all: "Alle Produkte",
    shop_col_men: "Herren",
    shop_col_women: "Damen",
    shop_col_unisex: "Unisex",
    shop_cat_all: "Alle",
    shop_cat_polos: "Polos",
    shop_cat_hoodies: "Hoodies",
    shop_cat_tshirts: "T-Shirts",
    shop_cat_accessories: "Zubehör",
    
    // Product Card
    product_details: "Details",
    product_customize: "Anpassen",
    
    // Product Page
    product_color: "Farbe",
    product_size: "Größe",
    product_add_to_cart: "In den Warenkorb",
    
    // Editor
    editor_zones: "Zonen",
    editor_save: "OBJ speichern",
    editor_package: "Paket",
    editor_design_png: "Design PNG",
    editor_tools: "Werkzeuge",
    editor_add_text: "Text hinzufügen",
    editor_upload_image: "Bild hochladen",
    editor_shapes: "Formen",
    editor_templates: "Vorlagen",
    editor_delete: "Auswahl löschen",
    editor_controls: "Steuerung",
    editor_scale: "Skalierung",
    editor_position_x: "Position X",
    editor_position_y: "Position Y",
    editor_rotation: "Drehung",
    editor_color: "Farbe",
    editor_front: "Vorne",
    editor_back: "Hinten",
    editor_sleeves: "Ärmel",
    editor_quick_add: "Schnell hinzufügen",
    editor_pro_tip: "Profi-Tipp",
    editor_pro_tip_text: "Verwenden Sie Shift+P, um Druckzonen umzuschalten und genau zu sehen, wo Ihre Designs auf dem Shirt erscheinen.",
    editor_print_area: "Druckbereich",
    editor_live_sync: "Live-Sync",
    editor_element_controls: "Element-Steuerung",
    editor_element_hint: "Ausgewähltes Element anpassen",
    editor_no_selection: "Kein Element ausgewählt",
    editor_no_selection_hint: "Klicken Sie auf ein Designelement, um seine Eigenschaften zu bearbeiten",
    editor_text_color: "Textfarbe",
    editor_current_color: "Aktuelle Farbe",
    editor_back_btn: "Zurück",
    editor_studio_label: "Editor",
    editor_toggle_zones: "Zonen umschalten",
    editor_save_package: "Paket speichern",
    editor_quick_guide: "Schnellanleitung",
    editor_quick_guide_text: "Elemente hinzuf\u00fcgen \u2192 Im Canvas sehen \u2192 Tippen zum Bearbeiten \u2192 Das 3D-Modell aktualisiert sich in Echtzeit!",
    editor_add_elements: "Elemente hinzuf\u00fcgen",
    editor_rectangle: "Rechteck",
    editor_circle: "Kreis",
    editor_design_area: "Designbereich",
    editor_canvas: "Leinwand",
    editor_canvas_hint: "Elemente erscheinen sofort hier. Tippen Sie auf ein Element, um es unten zu bearbeiten.",
    editor_edit_element: "Element bearbeiten",
    editor_no_selection_tap: "Tippen Sie auf ein Element im Canvas, um es zu bearbeiten",
    editor_shape_color: "Formfarbe",
    editor_open_editor: "Editor \u00f6ffnen",
    editor_close_editor: "Editor schlie\u00dfen",
    editor_drag_hint: "Ziehen zum Drehen \u2022 Scrollen zum Zoomen",
    editor_design_studio: "Designstudio",
    editor_design_studio_hint: "Elemente hinzufügen, gestalten und anpassen",

    // Cart page
    cart_title: "Warenkorb",
    cart_empty_title: "Dein Warenkorb ist leer",
    cart_empty_desc: "Füge Produkte hinzu und kehre zur Kasse zurück.",
    cart_browse: "Produkte entdecken",
    cart_continue_editing: "Weiter bearbeiten",
    cart_clear: "Warenkorb leeren",
    cart_view_wishlist: "Wunschliste anzeigen",
    cart_order_summary: "Bestellübersicht",
    cart_subtotal: "Zwischensumme",
    cart_shipping: "Versand",
    cart_total: "Gesamt",
    cart_checkout: "Zur Kasse",
    cart_continue_shopping: "Weiter einkaufen",
    cart_order_placed: "Bestellung aufgegeben!",
    cart_order_placed_desc: "Vielen Dank für deine Bestellung. Du erhältst bald eine Bestätigung.",
    cart_back: "Zurück",

    // Wishlist page
    wishlist_title: "Wunschliste",
    wishlist_empty_title: "Deine Wunschliste ist leer",
    wishlist_empty_desc: "Speichere Lieblingsartikel und kehre jederzeit zurück.",
    wishlist_browse: "Produkte entdecken",
    wishlist_add_to_cart: "In den Warenkorb",
    wishlist_customize: "Anpassen",
    wishlist_clear: "Wunschliste leeren",
    wishlist_back: "Zurück",

    // Checkout page
    checkout_title: "Kasse",
    checkout_back: "Zurück zum Warenkorb",
    checkout_customer_info: "Kundeninformationen",
    checkout_name: "Vollständiger Name",
    checkout_email: "E-Mail-Adresse",
    checkout_phone: "Telefonnummer",
    checkout_address: "Straße und Hausnummer",
    checkout_city: "Stadt",
    checkout_zip: "PLZ / Postleitzahl",
    checkout_country: "Land",
    checkout_order_summary: "Bestellübersicht",
    checkout_subtotal: "Zwischensumme",
    checkout_shipping: "Versand",
    checkout_total: "Gesamt",
    checkout_pay_paypal: "Mit PayPal bezahlen",
    checkout_required: "Bitte fülle alle Pflichtfelder aus.",
    checkout_processing: "Zahlung wird verarbeitet...",
    checkout_paypal_connecting: "Verbindung zu PayPal...",
    checkout_paypal_login: "PayPal-Kasse",
    checkout_paypal_login_desc: "Sie zahlen sicher über die PayPal-Simulation.",
    checkout_paypal_confirm: "Bestätigen & bezahlen",
    checkout_paypal_cancel: "Abbrechen",
    checkout_success_title: "Zahlung erfolgreich!",
    checkout_success_desc: "Ihre Bestellung wurde aufgegeben. Sie erhalten in Kürze eine Bestätigungs-E-Mail.",
    checkout_success_order: "Bestellnummer",
    checkout_continue_shopping: "Weiter einkaufen",
    checkout_optional: "optional",
  },
  bs: {
    // Hero Section
    hero_subtitle: "Studio za prilagođenu odjeću",
    hero_title: "Nosi ono što dizajniraš.",
    hero_description: "Uđi u studio. Postavi logo, napiši frazu, stavi je na pravu 3D majicu — zatim mi štampamo i šaljemo.",
    hero_button_primary: "Počni dizajnirati",
    hero_button_secondary: "Pregledaj prodavnicu",
    
    // Stats
    stats_designs: "Kreirana dizajna",
    stats_satisfaction: "Zadovoljstvo",
    stats_delivery: "Brza dostava",
    
    // Hero Stats (the 6+, 100%, 3D section)
    hero_stat1_number: "6+",
    hero_stat1_label: "Proizvoda",
    hero_stat2_number: "100%",
    hero_stat2_label: "Prilagodljivo",
    hero_stat3_number: "3D",
    hero_stat3_label: "Pregled",
    
    // Category Tabs
    category_tab_man: "MUŠKARAC",
    category_tab_woman: "ŽENA",
    category_tab_others: "OSTALO",
    category_tab_man_icon: "mdi:tshirt-crew",
    category_tab_woman_icon: "mdi:dress",
    category_tab_others_icon: "mdi:star",
    
    // View All Button
    view_all_button: "POGLEDAJ SVE",
    
    // Process Section
    process_badge: "Jednostavan proces",
    process_title: "Kako funkcioniše",
    process_description: "Od koncepta do kreacije u tri besprijekorna koraka",
    step1_title: "Izaberi svoje platno",
    step1_desc: "Izaberi iz naše premium kolekcije polo majica, dukseva i više. Svaki komad napravljen od kvalitetnih materijala.",
    step2_title: "Dizajniraj u 3D",
    step2_desc: "Koristi naš intuitivni 3D studio da dodaš tekst, logove i grafike. Gledaj kako tvoj dizajn oživljava u realnom vremenu.",
    step3_title: "Mi štampamo i šaljemo",
    step3_desc: "Visokoprecizno štampanje sa brzim obradom. Tvoj prilagođeni komad dostavljen na tvoja vrata.",
    
    // Features Section
    features_badge: "Zašto nas izabrati",
    features_title: "Najsavremenija",
    features_subtitle: "Tehnologija",
    features_description: "Vodeće funkcije u industriji koje nas izdvajaju od konkurencije",
    feature1_title: "3D pregled",
    feature1_desc: "Vizualizacija u realnom vremenu",
    feature2_title: "Brza obrada",
    feature2_desc: "24-48 sati produkcije",
    feature3_title: "Premium kvalitet",
    feature3_desc: "Visokokvalitetni materijali",
    feature4_title: "Sigurno plaćanje",
    feature4_desc: "Šifrovana kasa",
    
    // Testimonials Section
    testimonials_badge: "Svjedočanstva",
    testimonials_title: "Voljeni od",
    testimonials_subtitle: "Kreatora",
    testimonials_description: "Pridruži se hiljadama zadovoljnih kupaca koji nam vjeruju svoje prilagođene dizajne",
    testimonial1_name: "Sarah Chen",
    testimonial1_role: "Vlasnica malog biznisa",
    testimonial1_text: "3D editor je preokret! Dizajnirala sam prilagođene polo majice za moj tim u minutama. Kvalitet je izvanredan i proces je bio besprijekoran.",
    testimonial2_name: "Marcus Johnson",
    testimonial2_role: "Grafički dizajner",
    testimonial2_text: "Konačno, platforma koja mi omogućava da vidim tačno kako će moji dizajni izgledati prije štampanja. 3D pregled u realnom vremenu je nevjerovatno precizan.",
    testimonial3_name: "Emily Rodriguez",
    testimonial3_role: "Koordinatorka događaja",
    testimonial3_text: "Naručila 50 prilagođenih dukseva za našu konferenciju. Brza dostava, savršeni otisci, i tim ih je apsolutno volio. Definitivno ću ponovo naručiti!",
    trust_customers_number: "15.000+",
    trust_customers: "Zadovoljni kupci",
    trust_rating_number: "4,9/5",
    trust_rating: "Prosječna ocjena",
    trust_delivery_number: "24h",
    trust_delivery: "Brza dostava",
    
    // Categories Section
    categories_title: "Kategorije",
    categories_view_all: "Pogledaj sve →",
    category_men_polos: "Muške polo majice",
    category_women_polos: "Ženske polo majice",
    category_men_hoodies: "Muški duksevi",
    category_men_tshirts: "Muške majice",
    category_women_tshirts: "Ženske majice",
    
    // Featured Section
    featured_title: "Istaknuto",
    
    // CTA Section
    cta_badge: "Spreman za početak?",
    cta_title: "Tvoj sljedeći omiljeni komad je samo jedan dizajn daleko.",
    cta_description: "Otvori editor, postavi svoju ideju na 3D majicu i gledaj kako oživljava.",
    cta_button: "Otvori editor",
    cta_feature1_title: "Trenutni pregled",
    cta_feature1_desc: "Vidi svoj dizajn u 3D realnom vremenu",
    cta_feature2_title: "Brza produkcija",
    cta_feature2_desc: "24-48 sati obrade",
    cta_feature3_title: "Premium kvalitet",
    cta_feature3_desc: "Profesionalni materijali",
    
    // About Page
    about_badge: "Naša priča",
    about_title: "O nama",
    about_subtitle: "Osnaživanje kreativnosti kroz inovativnu 3D dizajn tehnologiju",
    mission_badge: "Naša misija",
    mission_title: "Revolucioniranje prilagođene odjeće",
    mission_desc1: "Vjerujemo da svako treba imati moć da kreira jedinstvenu, personalizovanu odjeću bez složenosti tradicionalnih dizajn alata. Naša misija je učiniti prilagođenu odjeću pristupačnom, pristupačnom i ugodnom za sve.",
    mission_desc2: "Koristeći najsavremeniju 3D tehnologiju, izgradili smo platformu koja vam omogućava da vizualizujete svoje dizajne u realnom vremenu, osiguravajući da ono što vidite je tačno ono što dobijate.",
    values_badge: "Naše vrijednosti",
    values_title: "Šta nas pokreće",
    about_cta_title: "Spreman da kreiraš nešto nevjerovatno?",
    about_cta_desc: "Pridruži se hiljadama kreatora koji nam vjeruju svoje prilagođene dizajne",
    
    // Contact Page
    contact_badge: "Kontaktirajte nas",
    contact_title: "Kontakt",
    contact_subtitle: "Imate pitanja? Rado bismo čuli od vas. Pošaljite nam poruku i odgovorićemo što prije.",
    contact_form_title: "Pošaljite nam poruku",
    contact_info_title: "Kontakt informacije",
    contact_info_desc: "Kontaktirajte nas preko bilo kojeg od ovih kanala. Tu smo da pomognemo!",
    contact_email_label: "Email",
    contact_email: "myicon2025@gmail.com",
    contact_phone_label: "Telefon",
    contact_phone_1: "02191 5606112",
    contact_mobile_label: "Mobilni",
    contact_phone_2: "0176 64824863",
    contact_phone_3: "0178 8793509",
    contact_website_label: "Web stranica",
    contact_website: "www.my-icon.shop",
    contact_hours_label: "Radno vrijeme",
    contact_hours: "Pon-Pet: 9-18h",
    faq_badge: "FAQ",
    faq_title: "Često postavljana pitanja",
    
    // Navigation
    nav_home: "Početna",
    nav_shop: "Prodavnica",
    nav_studio: "Studio",
    nav_studio_badge: "3D",
    nav_about: "O nama",
    nav_contact: "Kontakt",
    nav_search_placeholder: "PRETRAGA",
    nav_wishlist: "LISTA ŽELJA",
    nav_bag: "TORBA",
    nav_menu_title: "Meni",
    
    // Navbar Categories
    nav_category_man: "MUŠKARAC",
    nav_category_man_icon: "mdi:tshirt-crew",
    nav_category_woman: "ŽENA",
    nav_category_woman_icon: "mdi:dress",
    nav_category_others: "OSTALO",
    nav_category_others_icon: "mdi:star",
    nav_category_man_item1: "Polo majice",
    nav_category_man_item2: "Majice",
    nav_category_man_item3: "Duksevi",
    nav_category_woman_item1: "Polo majice",
    nav_category_woman_item2: "Majice",
    nav_category_others_item1: "Dodaci",
    nav_category_others_item2: "Prilagođene narudžbe",
    nav_shop_by_category: "Kupuj po kategoriji",
    nav_language: "Jezik",
    
    // Footer
    footer_brand_desc: "Premium prilagođena odjeća sa najsavremenijom 3D dizajn tehnologijom. Dizajniraj, nosi, posjeduj.",
    footer_shop_title: "Prodavnica",
    footer_shop_all: "Svi proizvodi",
    footer_shop_men_polos: "Muške polo majice",
    footer_shop_women_polos: "Ženske polo majice",
    footer_shop_hoodies: "Duksevi",
    footer_shop_studio: "3D Studio",
    footer_help_title: "Pomoć",
    footer_help_shipping: "Informacije o dostavi",
    footer_help_returns: "Povrati i zamjene",
    footer_help_size_guide: "Vodič za veličine",
    footer_help_faq: "FAQ",
    footer_help_contact: "Kontaktirajte nas",
    footer_company_title: "Kompanija",
    footer_company_about: "O nama",
    footer_company_careers: "Karijere",
    footer_company_press: "Štampa",
    footer_company_privacy: "Politika privatnosti",
    footer_company_terms: "Uslovi korištenja",
    footer_newsletter_title: "Newsletter",
    footer_newsletter_desc: "Dobijte ekskluzivne ponude i savjete za dizajn.",
    footer_newsletter_placeholder: "Unesite svoj email",
    footer_newsletter_button: "Pretplati se",
    footer_copyright: "my-icon.shop. Sva prava zadržana.",
    footer_privacy_link: "Privatnost",
    footer_terms_link: "Uslovi",
    footer_cookies_link: "Kolačići",
    footer_payment_text: "Prihvatamo:",
    footer_social_twitter: "Twitter",
    footer_social_twitter_icon: "fa6-brands:x-twitter",
    footer_social_instagram: "Instagram",
    footer_social_instagram_icon: "fa6-brands:instagram",
    footer_social_facebook: "Facebook",
    footer_social_facebook_icon: "fa6-brands:facebook",
    footer_social_linkedin: "LinkedIn",
    footer_social_linkedin_icon: "fa6-brands:linkedin",
    
    // Icons (same as English - icons are universal)
    feature1_icon: "mdi:cube-outline",
    feature2_icon: "mdi:clock-fast",
    feature3_icon: "mdi:star",
    feature4_icon: "mdi:shield-check",
    step1_icon: "mdi:tshirt-crew",
    step2_icon: "mdi:palette",
    step3_icon: "mdi:truck-fast",
    cta_feature1_icon: "mdi:eye",
    cta_feature2_icon: "mdi:lightning-bolt",
    cta_feature3_icon: "mdi:diamond",
    value1_icon: "mdi:lightbulb",
    value2_icon: "mdi:heart",
    value3_icon: "mdi:medal",
    trust_customers_icon: "mdi:check-circle",
    trust_rating_icon: "mdi:star",
    trust_delivery_icon: "mdi:clock-fast",
    contact_email_icon: "mdi:email",
    contact_phone_icon: "mdi:phone",
    contact_mobile_icon: "mdi:cellphone",
    contact_website_icon: "mdi:web",
    contact_hours_icon: "mdi:clock",
    social_facebook_icon: "fa6-brands:facebook",
    social_twitter_icon: "fa6-brands:twitter",
    social_instagram_icon: "fa6-brands:instagram",
    social_linkedin_icon: "fa6-brands:linkedin",
    
    // Shop Page
    shop_title: "Prodavnica",
    shop_description: "Otkrijte premium odjeću za vaše dizajne.",
    shop_filter_category: "Kategorija",
    shop_filter_size: "Veličina",
    shop_no_products: "Nema proizvoda koji odgovaraju vašim filterima.",
    shop_back: "Nazad",
    shop_filters: "Filteri",
    shop_filter_collection: "Kolekcija",
    shop_filter_price: "Cijena",
    shop_filter_sort_by: "Sortiraj po",
    shop_sort_featured: "Istaknuto",
    shop_sort_price_low: "Cijena: Rastuće",
    shop_sort_price_high: "Cijena: Opadajuće",
    shop_sort_name: "Naziv",
    shop_apply_filters: "Primijeni filtere",
    shop_reset: "Resetuj",
    shop_view: "Pogledaj",
    shop_design: "Dizajniraj",
    shop_design_now: "Dizajniraj sada",
    shop_no_products_title: "Nema pronađenih proizvoda",
    shop_no_products_hint: "Pokušajte prilagoditi filtere",
    shop_col_all: "Svi proizvodi",
    shop_col_men: "Muškarci",
    shop_col_women: "Žene",
    shop_col_unisex: "Uniseks",
    shop_cat_all: "Sve",
    shop_cat_polos: "Polo majice",
    shop_cat_hoodies: "Dukserice",
    shop_cat_tshirts: "Majice",
    shop_cat_accessories: "Dodaci",
    
    // Product Card
    product_details: "Detalji",
    product_customize: "Prilagodi",
    
    // Product Page
    product_color: "Boja",
    product_size: "Veličina",
    product_add_to_cart: "Dodaj u korpu",
    
    // Editor
    editor_zones: "Zone",
    editor_save: "Sačuvaj OBJ",
    editor_package: "Paket",
    editor_design_png: "Dizajn PNG",
    editor_tools: "Alati",
    editor_add_text: "Dodaj tekst",
    editor_upload_image: "Učitaj sliku",
    editor_shapes: "Oblici",
    editor_templates: "Šabloni",
    editor_delete: "Obriši selekciju",
    editor_controls: "Kontrole",
    editor_scale: "Razmjera",
    editor_position_x: "Pozicija X",
    editor_position_y: "Pozicija Y",
    editor_rotation: "Rotacija",
    editor_color: "Boja",
    editor_front: "Prednja",
    editor_back: "Zadnja",
    editor_sleeves: "Rukavi",
    editor_quick_add: "Brzo dodaj",
    editor_pro_tip: "Pro savjet",
    editor_pro_tip_text: "Koristite Shift+P za prebacivanje zona štampe i vidite tačno gdje će se vaši dizajni pojaviti na majici.",
    editor_print_area: "Zona štampe",
    editor_live_sync: "Uživo",
    editor_element_controls: "Kontrole elementa",
    editor_element_hint: "Prilagodite odabrani element",
    editor_no_selection: "Nema odabranog elementa",
    editor_no_selection_hint: "Kliknite na element dizajna da uredite njegove osobine",
    editor_text_color: "Boja teksta",
    editor_current_color: "Trenutna boja",
    editor_back_btn: "Nazad",
    editor_studio_label: "Editor",
    editor_toggle_zones: "Prebaci zone",
    editor_save_package: "Sa\u010duvaj paket",
    editor_quick_guide: "Brzi vodi\u010d",
    editor_quick_guide_text: "Dodaj elemente ispod \u2192 Vidi ih na platnu \u2192 Tapni za ure\u0111ivanje \u2192 Prati kako se 3D model a\u017eurira u realnom vremenu!",
    editor_add_elements: "Dodaj elemente",
    editor_rectangle: "Pravougaonik",
    editor_circle: "Krug",
    editor_design_area: "Zona dizajna",
    editor_canvas: "Platno",
    editor_canvas_hint: "Elementi se odmah pojavljuju ovdje. Tapni bilo koji element da ga uredi\u0161 ispod.",
    editor_edit_element: "Uredi element",
    editor_no_selection_tap: "Tapni element na platnu da ga uredi\u0161",
    editor_shape_color: "Boja oblika",
    editor_open_editor: "Otvori editor",
    editor_close_editor: "Zatvori editor",
    editor_drag_hint: "Vuci za rotaciju \u2022 Skrolaj za zum",
    editor_design_studio: "Dizajnerski studio",
    editor_design_studio_hint: "Dodaj elemente, dizajniraj i prilagodi",

    // Cart page
    cart_title: "Korpa",
    cart_empty_title: "Vaša korpa je prazna",
    cart_empty_desc: "Dodajte proizvode i vratite se na naplatu.",
    cart_browse: "Pregledaj proizvode",
    cart_continue_editing: "Nastavi uređivanje",
    cart_clear: "Isprazni korpu",
    cart_view_wishlist: "Pogledaj listu želja",
    cart_order_summary: "Pregled narudžbe",
    cart_subtotal: "Međuzbir",
    cart_shipping: "Dostava",
    cart_total: "Ukupno",
    cart_checkout: "Naruči",
    cart_continue_shopping: "Nastavi kupovinu",
    cart_order_placed: "Narudžba potvrđena!",
    cart_order_placed_desc: "Hvala na narudžbi. Uskoro ćete dobiti potvrdu.",
    cart_back: "Nazad",

    // Wishlist page
    wishlist_title: "Lista želja",
    wishlist_empty_title: "Vaša lista želja je prazna",
    wishlist_empty_desc: "Sačuvajte omiljene artikle i vratite im se u bilo koje vrijeme.",
    wishlist_browse: "Pregledaj proizvode",
    wishlist_add_to_cart: "Dodaj u korpu",
    wishlist_customize: "Prilagodi",
    wishlist_clear: "Isprazni listu želja",
    wishlist_back: "Nazad",

    // Checkout page
    checkout_title: "Naplata",
    checkout_back: "Nazad u korpu",
    checkout_customer_info: "Podaci kupca",
    checkout_name: "Puno ime i prezime",
    checkout_email: "E-mail adresa",
    checkout_phone: "Broj telefona",
    checkout_address: "Ulica i broj",
    checkout_city: "Grad",
    checkout_zip: "Poštanski broj",
    checkout_country: "Država",
    checkout_order_summary: "Pregled narudžbe",
    checkout_subtotal: "Međuzbir",
    checkout_shipping: "Dostava",
    checkout_total: "Ukupno",
    checkout_pay_paypal: "Plati putem PayPal-a",
    checkout_required: "Molimo popunite sva obavezna polja.",
    checkout_processing: "Obrada plaćanja...",
    checkout_paypal_connecting: "Spajanje na PayPal...",
    checkout_paypal_login: "PayPal naplata",
    checkout_paypal_login_desc: "Plaćate sigurno putem PayPal simulacije.",
    checkout_paypal_confirm: "Potvrdi i plati",
    checkout_paypal_cancel: "Odustani",
    checkout_success_title: "Plaćanje uspješno!",
    checkout_success_desc: "Vaša narudžba je primljena. Uskoro ćete dobiti potvrdni e-mail.",
    checkout_success_order: "ID narudžbe",
    checkout_continue_shopping: "Nastavi kupovinu",
    checkout_optional: "opcionalno",
  },
};

// Creates a getText function bound to specific content and language.
// Returning a new function reference on each call ensures Zustand subscribers
// re-render whenever content or currentLanguage changes.
const makeGetText = (content, currentLanguage) => (key) => {
  if (content && content[currentLanguage] && content[currentLanguage][key]) {
    return content[currentLanguage][key];
  }
  if (defaultContent[currentLanguage] && defaultContent[currentLanguage][key]) {
    return defaultContent[currentLanguage][key];
  }
  // Fallback to English if key missing in current language
  if (content && content.en && content.en[key]) {
    return content.en[key];
  }
  if (defaultContent.en && defaultContent.en[key]) {
    return defaultContent.en[key];
  }
  return key;
};

let firebaseInitialized = false;

const savedLanguage = typeof localStorage !== 'undefined'
  ? (localStorage.getItem('siteLanguage') || 'en')
  : 'en';

export const useContentStore = create((set, get) => ({
  content: defaultContent,
  currentLanguage: savedLanguage,
  isLoading: true,
  getText: makeGetText(defaultContent, savedLanguage),

  // Initialize Firebase listener
  initFirebase: async () => {
    if (firebaseInitialized) {
      return;
    }
    firebaseInitialized = true;

    try {
      const db = getFirebaseDatabase();
      const contentRef = ref(db, "siteContent");
      const languageRef = ref(db, "siteLanguage");

      // Load initial language
      const languageSnapshot = await firebaseGet(languageRef);
      if (languageSnapshot.exists()) {
        const lang = languageSnapshot.val();
        localStorage.setItem('siteLanguage', lang);
        set((state) => ({ currentLanguage: lang, getText: makeGetText(state.content, lang) }));
      }

      // Listen to content changes
      onValue(contentRef, (snapshot) => {
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          
          // Merge Firebase data with defaults to ensure all keys exist
          const mergedContent = {
            en: { ...defaultContent.en, ...(firebaseData.en || {}) },
            de: { ...defaultContent.de, ...(firebaseData.de || {}) },
            bs: { ...defaultContent.bs, ...(firebaseData.bs || {}) },
          };
          
          set((state) => ({ content: mergedContent, isLoading: false, getText: makeGetText(mergedContent, state.currentLanguage) }));
        } else {
          // Initialize with default content if nothing exists
          firebaseSet(contentRef, defaultContent).catch(console.error);
          set((state) => ({ content: defaultContent, isLoading: false, getText: makeGetText(defaultContent, state.currentLanguage) }));
        }
      });

      // Listen to language changes
      onValue(languageRef, (snapshot) => {
        if (snapshot.exists()) {
          const lang = snapshot.val();
          localStorage.setItem('siteLanguage', lang);
          set((state) => ({ currentLanguage: lang, getText: makeGetText(state.content, lang) }));
        }
      });
    } catch (error) {
      console.error("Firebase initialization error:", error);
      set((state) => ({ content: defaultContent, isLoading: false, getText: makeGetText(defaultContent, state.currentLanguage) }));
    }
  },

  // Update text for a specific language
  updateText: async (language, key, value) => {
    try {
      const db = getFirebaseDatabase();
      const textRef = ref(db, `siteContent/${language}/${key}`);
      await firebaseSet(textRef, value);
      
      // Update local state immediately for responsiveness
      set((state) => {
        if (!state.content || !state.content[language]) {
          return state;
        }
        const newContent = {
          ...state.content,
          [language]: {
            ...state.content[language],
            [key]: value,
          },
        };
        return {
          content: newContent,
          getText: makeGetText(newContent, state.currentLanguage),
        };
      });
    } catch (error) {
      console.error("Error updating text:", error);
    }
  },

  // Change current language
  setLanguage: async (language) => {
    try {
      localStorage.setItem('siteLanguage', language);
      const db = getFirebaseDatabase();
      const languageRef = ref(db, "siteLanguage");
      await firebaseSet(languageRef, language);
      set((state) => ({ currentLanguage: language, getText: makeGetText(state.content, language) }));
    } catch (error) {
      console.error("Error setting language:", error);
      localStorage.setItem('siteLanguage', language);
      set((state) => ({ currentLanguage: language, getText: makeGetText(state.content, language) }));
    }
  },

  // Reset to defaults
  resetContent: async () => {
    try {
      const db = getFirebaseDatabase();
      const contentRef = ref(db, "siteContent");
      await firebaseSet(contentRef, defaultContent);
      set((state) => ({ content: defaultContent, getText: makeGetText(defaultContent, state.currentLanguage) }));
    } catch (error) {
      console.error("Error resetting content:", error);
    }
  },

  // Get all keys
  getAllKeys: () => {
    // Always return keys from default content structure (en)
    return Object.keys(defaultContent.en || {});
  },
}));
