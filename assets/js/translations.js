/* ============================================================
 *  translations.js  –  i18n strings (EN / TR)
 *  Loaded first so t() is available to all other scripts.
 * ============================================================ */

// Persist language preference
let currentLang = localStorage.getItem('portfolio-lang') || 'en';

/** Translate a key based on currentLang with EN fallback */
function t(key) {
  return translations[currentLang]?.[key] ?? translations['en']?.[key] ?? key;
}

const translations = {
  /* ==================== ENGLISH ==================== */
  en: {
    /* Navigation */
    nav_home:     'Home',
    nav_about:    'About',
    nav_skills:   'Skills',
    nav_projects: 'Projects',
    nav_contact:  'Contact',

    /* Hero */
    hero_greeting:     "Hello, I'm",
    hero_name:         'H. Onur Söğüt',            // ← Replace with your name
    hero_typed:        ['Fullstack Developer', 'AI Engineer', 'Software Developer', 'Problem Solver'],
    hero_description:  'I craft exceptional digital experiences and build intelligent systems that make a real difference.',
    hero_cta_work:     'View My Work',
    hero_cta_contact:  "Let's Talk",
    hero_scroll:       'Scroll Down',
    hero_availability: 'Available for opportunities',

    /* About */
    about_title:        'About Me',
    about_subtitle:     'Get to know me better',
    about_bio_1:        "I'm a passionate Fullstack Developer and AI Engineer currently studying Computer Engineering. I love building innovative web applications and exploring the frontiers of artificial intelligence.",
    about_bio_2:        "My journey in software development started during my university years, where I discovered my passion for creating solutions that solve real-world problems. I'm always eager to learn new technologies and tackle challenging projects.",
    about_edu_title:    'Education',
    about_edu_1_school: 'Sivas Cumhuriyet University',
    about_edu_1_degree: 'Dept. of AI and Data Science (M.Sc.)',
    about_edu_1_year:   '2024 – Present',
    about_edu_2_school: 'Sivas Cumhuriyet University',
    about_edu_2_degree: 'Computer Engineering (B.Sc.)',
    about_edu_2_year:   '2020 – 2024',
    about_edu_3_school: 'Nevşehir Cemil Meriç',
    about_edu_3_degree: 'Social Sciences High School',
    about_edu_3_year:   '2015 – 2020',
    about_stat_1_value: '3+',
    about_stat_1_label: 'Years Coding',
    about_stat_2_value: '20+',
    about_stat_2_label: 'Projects',
    about_stat_3_value: '10+',
    about_stat_3_label: 'Technologies',

    /* Skills */
    skills_title:        'My Skills',
    skills_subtitle:     'Technologies I work with',
    skills_cat_frontend: 'Frontend',
    skills_cat_backend:  'Backend',
    skills_cat_ai:       'AI & ML',
    skills_cat_devops:   'DevOps & Tools',

    /* Projects */
    projects_title:   'My Projects',
    projects_subtitle: "Things I've built",
    project_1_title:  'Cappadocia Shuttle Service',              // ← Replace with your project
    project_1_desc:   'A full-stack transport automation project featuring dynamic routing and pricing infrastructure, multi-step booking workflows, and operational management.',
    project_1_tag_1:  'Shuttle Booking',
    project_1_tag_2:  'Route Planning',
    project_1_tag_3:  'Dynamic Pricing',
    project_1_tag_4:  'Operations Management',
    project_2_title:  'Capahenas Travel',           // ← Replace
    project_2_desc:   'A scalable full-stack tourism application featuring i18n localization, dynamic tour catalogs, and booking workflows.',
    project_2_tag_1:  'i18n Localization',
    project_2_tag_2:  'Tour Catalog',
    project_2_tag_3:  'Booking Flow',
    project_2_tag_4:  'Full-Stack App',
    project_3_title:  'NJBL Design',             // ← Replace
    project_3_desc:   'A high-performance portfolio web application featuring advanced media optimization, a dynamic content management system (CMS), and a modern UI.',
    project_3_tag_1:  'Media Optimization',
    project_3_tag_2:  'CMS',
    project_3_tag_3:  'Modern UI',
    project_3_tag_4:  'High Performance',
    project_demo:     'See Live',
    project_code:     'Project Details',

    /* Contact */
    contact_title:          'Get In Touch',
    contact_subtitle:       "Let's work together",
    contact_description:    'Whether you have a project in mind, want to collaborate, or just want to say hi — my inbox is always open.',
    contact_email_label:    'Email',
    contact_location_label: 'Location',
    contact_location_value: 'Kayseri, Turkiye',  // ← Replace
    contact_availability:   'Open to Opportunities',
    contact_form_name:      'Your Name',
    contact_form_email:     'Your Email',
    contact_form_subject:   'Subject',
    contact_form_message:   'Your Message',
    contact_form_send:      'Send Message',
    contact_form_sending:   'Sending…',
    contact_ph_name:        'e.g. Jane Smith',
    contact_ph_email:       'jane@example.com',
    contact_ph_subject:     'Project discussion…',
    contact_ph_message:     "Hello! I'd like to talk about…",

    /* Alerts */
    alert_success_title:    'Message Sent!',
    alert_success_text:     "Thank you for reaching out. I'll get back to you soon.",
    alert_error_title:      'Oops!',
    alert_error_text:       'Something went wrong. Please try again or contact me directly.',
    alert_validation_title: 'Please fill all fields',
    alert_validation_text:  'All fields are required to send your message.',
    alert_email_invalid:    'Please enter a valid email address.',

    /* Footer */
    footer_rights: 'All rights reserved.',
    footer_made:   'Made with',
    footer_by:     'by',
  },

  /* ==================== TURKISH ==================== */
  tr: {
    /* Navigation */
    nav_home:     'Ana Sayfa',
    nav_about:    'Hakkımda',
    nav_skills:   'Beceriler',
    nav_projects: 'Projeler',
    nav_contact:  'İletişim',

    /* Hero */
    hero_greeting:     'Merhaba, Ben',
    hero_name:         'H. Onur Söğüt',               // ← Adınızla değiştirin
    hero_typed:        ['Fullstack Geliştirici', 'AI Mühendisi', 'Yazılım Geliştirici', 'Problem Çözücü'],
    hero_description:  'Olağanüstü dijital deneyimler tasarlıyor ve gerçek fark yaratan akıllı sistemler inşa ediyorum.',
    hero_cta_work:     'Çalışmalarımı Gör',
    hero_cta_contact:  'İletişime Geç',
    hero_scroll:       'Aşağı Kaydır',
    hero_availability: 'İş fırsatlarına açık',

    /* About */
    about_title:        'Hakkımda',
    about_subtitle:     'Beni daha yakından tanıyın',
    about_bio_1:        'Bilgisayar Mühendisliği okuyan tutkulu bir Fullstack Geliştirici ve AI Mühendisiyim. Yenilikçi web uygulamaları geliştirmeyi ve yapay zekanın sınırlarını keşfetmeyi seviyorum.',
    about_bio_2:        'Yazılım geliştirme yolculuğum üniversite yıllarımda başladı; gerçek dünya problemlerini çözen çözümler yaratma tutkumu o dönemde keşfettim. Her zaman yeni teknolojiler öğrenmeye ve zorlu projelere girişmeye hazırım.',
    about_edu_title:    'Eğitim',
    about_edu_1_school: 'Sivas Cumhuriyet Üniversitesi',
    about_edu_1_degree: 'Yapay Zeka ve Veri Bilimi A.B.D. (Yüksek Lisans)',
    about_edu_1_year:   '2024 – Devam',
    about_edu_2_school: 'Sivas Cumhuriyet Üniversitesi',
    about_edu_2_degree: 'Bilgisayar Mühendisliği (Lisans)',
    about_edu_2_year:   '2020 – 2024',
    about_edu_3_school: 'Nevşehir Cemil Meriç',
    about_edu_3_degree: 'Sosyal Bilimler Lisesi',
    about_edu_3_year:   '2015 – 2020',
    about_stat_1_value: '3+',
    about_stat_1_label: 'Yıllık Kodlama',
    about_stat_2_value: '20+',
    about_stat_2_label: 'Proje',
    about_stat_3_value: '10+',
    about_stat_3_label: 'Teknoloji',

    /* Skills */
    skills_title:        'Becerilerim',
    skills_subtitle:     'Çalıştığım teknolojiler',
    skills_cat_frontend: 'Frontend',
    skills_cat_backend:  'Backend',
    skills_cat_ai:       'Yapay Zeka & ML',
    skills_cat_devops:   'DevOps & Araçlar',

    /* Projects */
    projects_title:    'Projelerim',
    projects_subtitle: 'Geliştirdiğim şeyler',
    project_1_title:   'Cappadocia Shuttle Service',
    project_1_desc:    'Dinamik rota ve fiyatlandırma altyapısına sahip, çok adımlı rezervasyon akışı ve operasyon yönetimi sunan full-stack ulaşım otomasyon projesi.',
    project_1_tag_1:   'Servis Rezervasyonu',
    project_1_tag_2:   'Rota Planlama',
    project_1_tag_3:   'Dinamik Fiyatlandırma',
    project_1_tag_4:   'Operasyon Yönetimi',
    project_2_title:   'Capahenas Travel',
    project_2_desc:    'Çoklu dil (i18n) mimarisine sahip, dinamik tur kataloğu ve rezervasyon akışları barındıran ölçeklenebilir full-stack turizm uygulaması.',
    project_2_tag_1:   'i18n Yerelleştirme',
    project_2_tag_2:   'Tur Kataloğu',
    project_2_tag_3:   'Rezervasyon Akışı',
    project_2_tag_4:   'Full-Stack Uygulama',
    project_3_title:   'NJBL Design',
    project_3_desc:    'Gelişmiş medya optimizasyonuna ve dinamik içerik yönetim sistemine (CMS) sahip, yüksek performanslı ve modern kullanıcı arayüzüne odaklanan portfolyo web uygulaması.',
    project_3_tag_1:   'Medya Optimizasyonu',
    project_3_tag_2:   'CMS',
    project_3_tag_3:   'Modern Arayüz',
    project_3_tag_4:   'Yüksek Performans',
    project_demo:      'Canlı Görüntüle',
    project_code:      'Proje Detayı',

    /* Contact */
    contact_title:          'İletişime Geçin',
    contact_subtitle:       'Birlikte çalışalım',
    contact_description:    'Aklınızda bir proje var mı, iş birliği yapmak mı istiyorsunuz yoksa sadece merhaba mı demek istiyorsunuz — gelen kutum her zaman açık.',
    contact_email_label:    'E-posta',
    contact_location_label: 'Konum',
    contact_location_value: 'Kayseri, Türkiye',
    contact_availability:   'İş Fırsatlarına Açık',
    contact_form_name:      'Adınız',
    contact_form_email:     'E-posta Adresiniz',
    contact_form_subject:   'Konu',
    contact_form_message:   'Mesajınız',
    contact_form_send:      'Mesaj Gönder',
    contact_form_sending:   'Gönderiliyor…',
    contact_ph_name:        'örn. Ahmet Yılmaz',
    contact_ph_email:       'ahmet@example.com',
    contact_ph_subject:     'Proje görüşmesi…',
    contact_ph_message:     'Merhaba! Şu konuda görüşmek istiyorum…',

    /* Alerts */
    alert_success_title:    'Mesaj Gönderildi!',
    alert_success_text:     'Ulaştığınız için teşekkürler. En kısa sürede geri döneceğim.',
    alert_error_title:      'Hata!',
    alert_error_text:       'Bir şeyler ters gitti. Lütfen tekrar deneyin veya doğrudan benimle iletişime geçin.',
    alert_validation_title: 'Lütfen tüm alanları doldurun',
    alert_validation_text:  'Mesajınızı göndermek için tüm alanlar zorunludur.',
    alert_email_invalid:    'Lütfen geçerli bir e-posta adresi girin.',

    /* Footer */
    footer_rights: 'Tüm hakları saklıdır.',
    footer_made:   'ile yapıldı',
    footer_by:     'tarafından',
  },
};
