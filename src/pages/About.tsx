import { Award, CheckCircle, Globe, Heart, Shield, Target, Users, Zap } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import './About.css'

export default function About() {
    const { language, isRTL } = useLanguage()

    const text = {
        ar: {
            heroTag: 'من نحن',
            heroTitle: 'وحيد أوتو',
            heroSubtitle: 'شريكك الموثوق لاستيراد السيارات الجديدة والمستعملة من الصين وكوريا',
            storyTitle: 'قصتنا',
            storyP1: 'وحيد أوتو هي شركة جزائرية متخصصة في استيراد السيارات الجديدة والمستعملة من الصين وكوريا الجنوبية. نعمل بشغف لتوفير أفضل السيارات بأسعار منافسة مع ضمان الجودة.',
            storyP2: 'بفضل خبرتنا الواسعة وشبكة علاقاتنا القوية في الصين وكوريا، نضمن لعملائنا الحصول على سيارات بحالة ممتازة وبأسعار أقل بكثير من السوق المحلية.',
            storyP3: 'نحن نرافق عملاءنا في كل خطوة من عملية الاستيراد، من اختيار السيارة وحتى تسليمها أمام باب المنزل.',
            storyBadge: 'سنوات خبرة',
            missionTitle: 'مهمتنا',
            missionDesc: 'توفير سيارات عالية الجودة بأسعار عادلة مع خدمة عملاء استثنائية',
            visionTitle: 'رؤيتنا',
            visionDesc: 'أن نصبح الخيار الأول لاستيراد السيارات في الجزائر',
            valuesTitle: 'قيمنا',
            valuesDesc: 'المبادئ التي نلتزم بها في كل تعامل',
            valuesTag: 'مبادئنا',
            transparency: 'الشفافية',
            transparencyDesc: 'أسعار واضحة بدون رسوم مخفية',
            quality: 'الجودة',
            qualityDesc: 'فحص شامل لكل سيارة قبل الشراء',
            trust: 'الثقة',
            trustDesc: 'بناء علاقات طويلة الأمد مع عملائنا',
            support: 'الدعم',
            supportDesc: 'خدمة عملاء متاحة دائماً',
            whyUsTag: 'مميزاتنا',
            whyUsTitle: 'لماذا وحيد أوتو؟',
            whyUsSubtitle: 'أسباب تجعلنا الخيار الأفضل لاستيراد سيارتك',
            reason1: 'خبرة واسعة - سنوات من الخبرة في مجال استيراد السيارات',
            reason2: 'أسعار تنافسية - وفر حتى 40% مقارنة بالوكلاء المحليين',
            reason3: 'شحن آمن - شحن بحري مؤمن وسريع من الصين وكوريا للجزائر',
            reason4: 'دعم كامل - نرافقك من الاختيار حتى التسليم',
            reason5: 'فريق متخصص في الصين وكوريا الجنوبية',
            reason6: 'تقرير فحص كامل لكل سيارة',
            reason7: 'تتبع الشحنة لحظة بلحظة',
            reason8: 'ضمان الجودة على جميع السيارات',
            ctaTitle: 'مستعد لاستيراد سيارتك؟',
            ctaDesc: 'تواصل معنا اليوم وابدأ رحلتك نحو سيارة أحلامك',
            ctaWhatsapp: 'تواصل عبر واتساب',
            ctaCall: 'اتصل بنا',
            statCars: 'سيارة تم استيرادها',
            statClients: 'عميل سعيد',
            statYears: 'سنوات خبرة',
            statSatisfaction: 'رضا العملاء'
        },
        fr: {
            heroTag: 'À propos',
            heroTitle: 'Wahid Auto',
            heroSubtitle: 'Votre partenaire de confiance pour l\'importation de voitures neuves et d\'occasion de Chine et de Corée',
            storyTitle: 'Notre histoire',
            storyP1: 'Wahid Auto est une entreprise algérienne spécialisée dans l\'importation de voitures neuves et d\'occasion de Chine et de Corée du Sud. Nous travaillons avec passion pour offrir les meilleures voitures à des prix compétitifs avec garantie de qualité.',
            storyP2: 'Grâce à notre grande expérience et notre solide réseau de relations en Chine et en Corée, nous garantissons à nos clients des voitures en excellent état à des prix bien inférieurs au marché local.',
            storyP3: 'Nous accompagnons nos clients à chaque étape du processus d\'importation, du choix de la voiture jusqu\'à la livraison à domicile.',
            storyBadge: 'ans d\'expérience',
            missionTitle: 'Notre mission',
            missionDesc: 'Fournir des voitures de haute qualité à des prix justes avec un service client exceptionnel',
            visionTitle: 'Notre vision',
            visionDesc: 'Devenir le premier choix pour l\'importation de voitures en Algérie',
            valuesTitle: 'Nos valeurs',
            valuesDesc: 'Les principes auxquels nous adhérons dans chaque interaction',
            valuesTag: 'Nos principes',
            transparency: 'Transparence',
            transparencyDesc: 'Prix clairs sans frais cachés',
            quality: 'Qualité',
            qualityDesc: 'Inspection complète de chaque voiture avant achat',
            trust: 'Confiance',
            trustDesc: 'Construire des relations durables avec nos clients',
            support: 'Support',
            supportDesc: 'Service client toujours disponible',
            whyUsTag: 'Nos avantages',
            whyUsTitle: 'Pourquoi Wahid Auto?',
            whyUsSubtitle: 'Les raisons qui font de nous le meilleur choix pour importer votre voiture',
            reason1: 'Grande expérience - Des années d\'expertise en importation',
            reason2: 'Prix compétitifs - Économisez jusqu\'à 40% vs les concessionnaires',
            reason3: 'Expédition sécurisée - Transport maritime assuré de la Chine et la Corée',
            reason4: 'Support complet - Nous vous accompagnons du choix à la livraison',
            reason5: 'Équipe spécialisée en Chine et en Corée du Sud',
            reason6: 'Rapport d\'inspection complet pour chaque voiture',
            reason7: 'Suivi de l\'expédition en temps réel',
            reason8: 'Garantie de qualité sur toutes les voitures',
            ctaTitle: 'Prêt à importer votre voiture?',
            ctaDesc: 'Contactez-nous aujourd\'hui et commencez votre voyage vers la voiture de vos rêves',
            ctaWhatsapp: 'Contactez via WhatsApp',
            ctaCall: 'Appelez-nous',
            statCars: 'voitures importées',
            statClients: 'clients satisfaits',
            statYears: 'ans d\'expérience',
            statSatisfaction: 'satisfaction client'
        }
    }

    const tx = text[language]

    const stats = [
        { number: '500+', label: tx.statCars },
        { number: '1000+', label: tx.statClients },
        { number: '2', label: tx.statYears },
        { number: '98%', label: tx.statSatisfaction }
    ]

    const values = [
        { icon: Shield, title: tx.transparency, desc: tx.transparencyDesc },
        { icon: Heart, title: tx.quality, desc: tx.qualityDesc },
        { icon: Zap, title: tx.trust, desc: tx.trustDesc },
        { icon: Globe, title: tx.support, desc: tx.supportDesc }
    ]

    const reasons = [tx.reason1, tx.reason2, tx.reason3, tx.reason4, tx.reason5, tx.reason6, tx.reason7, tx.reason8]

    return (
        <div className={`about-page ${!isRTL ? 'ltr' : ''}`}>
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-bg"></div>
                <div className="container">
                    <div className="about-hero-content">
                        <span className="section-tag">{tx.heroTag}</span>
                        <h1>{tx.heroTitle}</h1>
                        <p>{tx.heroSubtitle}</p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="story-section section">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-content">
                            <h2>{tx.storyTitle}</h2>
                            <p>{tx.storyP1}</p>
                            <p>{tx.storyP2}</p>
                            <p>{tx.storyP3}</p>
                            <div className="story-stats">
                                {stats.map((stat, index) => (
                                    <div key={index} className="story-stat">
                                        <span className="stat-number">{stat.number}</span>
                                        <span className="stat-label">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="story-image">
                            <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600" alt={isRTL ? 'فريقنا' : 'Notre équipe'} />
                            <div className="story-badge">
                                <span>2</span>
                                <span>{tx.storyBadge}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section section section-dark">
                <div className="container">
                    <div className="mission-grid">
                        <div className="mission-card">
                            <div className="mission-icon">
                                <Target size={40} />
                            </div>
                            <h3>{tx.missionTitle}</h3>
                            <p>{tx.missionDesc}</p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon">
                                <Award size={40} />
                            </div>
                            <h3>{tx.visionTitle}</h3>
                            <p>{tx.visionDesc}</p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon">
                                <Users size={40} />
                            </div>
                            <h3>{tx.valuesTitle}</h3>
                            <p>{tx.valuesDesc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">{tx.valuesTag}</span>
                        <h2>{tx.valuesTitle}</h2>
                        <p>{tx.valuesDesc}</p>
                    </div>
                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div key={index} className="value-card card">
                                <div className="value-icon">
                                    <value.icon size={32} />
                                </div>
                                <h3>{value.title}</h3>
                                <p>{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-us-section section section-dark">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">{tx.whyUsTag}</span>
                        <h2>{tx.whyUsTitle}</h2>
                        <p>{tx.whyUsSubtitle}</p>
                    </div>
                    <div className="reasons-grid">
                        {reasons.map((reason, index) => (
                            <div key={index} className="reason-item">
                                <CheckCircle size={24} />
                                <span>{reason}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta section">
                <div className="container">
                    <div className="cta-box">
                        <h2>{tx.ctaTitle}</h2>
                        <p>{tx.ctaDesc}</p>
                        <div className="cta-buttons">
                            <a href="https://wa.me/821080890802" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                                {tx.ctaWhatsapp}
                            </a>
                            <a href="tel:+213557060478" className="btn btn-outline btn-lg">
                                {tx.ctaCall}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
