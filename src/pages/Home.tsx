import emailjs from '@emailjs/browser'
import {
    ArrowLeft, ArrowRight,
    Car,
    CheckCircle,
    DollarSign,
    Factory,
    FileCheck,
    Headphones,
    Home as HomeIcon,
    Mail, MapPin,
    Package,
    Phone,
    Shield,
    Ship
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice, getPopularCars } from '../data/cars'
import { budgetRanges, carBrands, carModelsByBrand, wilayas } from '../data/wilayas'
import { generateReferenceNumber, supabase } from '../lib/supabase'
import './Home.css'

// EmailJS configuration - Gmail
const EMAILJS_SERVICE_ID = 'service_u8c498u'
const EMAILJS_TEMPLATE_ID = 'template_iftksee'
const EMAILJS_PUBLIC_KEY = 'v00jNbJkzIBI1HQyE'

export default function Home() {
    const { isRTL, language } = useLanguage()
    const popularCars = getPopularCars()
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        wilaya: '',
        carBrand: '',
        carModel: '',
        budget: '',
        customBudget: '',
        notes: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [referenceNumber, setReferenceNumber] = useState('')

    // Translations object for Home page
    const text = {
        ar: {
            heroBadge: '🚗 الوكيل الأول في الجزائر',
            heroTitle1: 'استورد سيارتك الكورية المستعملة مباشرة من',
            heroTitle2: 'كوريا',
            heroSubtitle: 'خبرة واسعة في استيراد سيارات كيا، هيونداي ورينو بأفضل الأسعار مع ضمان الجودة والدعم الكامل من الشراء حتى التسليم',
            startOrder: 'ابدأ طلبك الآن',
            browseCars: 'تصفح السيارات',
            guarantee100: 'ضمان 100%',
            save40: 'وفر 40%',
            bestPrices: 'أفضل الأسعار',
            bestPricesDesc: 'وفر حتى 40% مقارنة بالوكلاء المحليين',
            qualityGuarantee: 'ضمان الجودة',
            qualityGuaranteeDesc: 'فحص شامل لكل سيارة قبل الشراء',
            fullSupport: 'دعم كامل',
            fullSupportDesc: 'نرافقك من الاختيار حتى التسليم',
            carsImported: 'سيارة تم استيرادها',
            customerSatisfaction: 'رضا العملاء',
            yearsExperience: 'سنوات خبرة',
            stepsTag: 'الخطوات',
            howToOrder: 'كيف تطلب سيارتك؟',
            simpleProcess: 'عملية بسيطة وشفافة من البداية للنهاية',
            chooseCar: 'اختر السيارة',
            chooseCarDesc: 'تصفح مجموعتنا الواسعة من السيارات الكورية واختر ما يناسبك',
            contactUs: 'تواصل معنا',
            contactUsDesc: 'أرسل لنا تفاصيل السيارة المطلوبة وسنقدم لك عرض سعر',
            weHandleEverything: 'نحن نهتم بكل شيء',
            weHandleEverythingDesc: 'نتولى عملية الشراء، الشحن، الجمارك والتوصيل',
            sendOrder: 'أرسل طلبك الآن',
            formSubtitle: 'املأ النموذج وسنتواصل معك خلال 24 ساعة',
            fullName: 'الاسم الكامل',
            fullNamePlaceholder: 'أدخل اسمك الكامل',
            phone: 'رقم الهاتف',
            phonePlaceholder: '0555 XX XX XX',
            email: 'البريد الإلكتروني',
            wilaya: 'الولاية',
            selectWilaya: 'اختر الولاية',
            brand: 'العلامة التجارية',
            selectBrand: 'اختر العلامة',
            model: 'الموديل',
            selectModel: 'اختر الموديل',
            selectBrandFirst: 'اختر العلامة أولاً',
            budget: 'الميزانية',
            selectBudget: 'اختر الميزانية',
            customBudget: 'الميزانية المخصصة',
            customBudgetPlaceholder: 'مثال: 8,500,000 دج',
            notes: 'ملاحظات إضافية',
            notesPlaceholder: 'أي متطلبات أو ملاحظات خاصة...',
            sending: 'جاري الإرسال...',
            sendRequest: 'إرسال الطلب',
            orderSuccess: 'تم استلام طلبك بنجاح!',
            yourReference: 'رقم المرجع الخاص بك:',
            keepReference: 'احتفظ بهذا الرقم لتتبع طلبك. سنتواصل معك قريباً.',
            newOrder: 'إرسال طلب جديد',
            guarantees: '🔒 ضماناتنا',
            guarantee1: 'تقرير فحص كامل لكل سيارة',
            guarantee2: 'أسعار شفافة بدون رسوم مخفية',
            guarantee3: 'تتبع الشحنة لحظة بلحظة',
            guarantee4: 'دعم فني بعد الشراء',
            contactDirect: 'تواصل معنا مباشرة',
            callUs: 'اتصل بنا',
            whatsapp: 'واتساب',
            messageNow: 'راسلنا الآن',
            emailLabel: 'البريد الإلكتروني',
            location: 'الموقع',
            locationValue: 'الميلية، جيجل، الجزائر',
            carsTag: 'السيارات',
            mostRequested: 'السيارات الأكثر طلباً',
            discoverCars: 'اكتشف تشكيلتنا من أفضل السيارات الكورية',
            seats: 'مقاعد',
            priceRange: 'نطاق السعر',
            viewDetails: 'عرض التفاصيل',
            notFoundCar: 'لم تجد السيارة التي تبحث عنها؟',
            browseAllCars: 'تصفح كل السيارات',
            featuresTag: 'المميزات',
            whyKorean: 'لماذا السيارات الكورية؟',
            whyKoreanDesc: 'أسباب تجعل الاستيراد من كوريا الخيار الأفضل',
            carsAvailable: 'سيارة متاحة',
            avgSavings: 'متوسط التوفير',
            comparison: 'مقارنة: نحن vs الوكلاء التقليديين',
            withUs: 'معنا',
            traditionalDealers: 'الوكلاء التقليديين',
            us1: 'سعر المصنع + عمولة شفافة',
            them1: 'هامش ربح كبير مخفي',
            us2: 'تقرير فحص كامل للسيارة',
            them2: 'لا ضمان على الحالة',
            us3: 'تتبع الشحنة لحظة بلحظة',
            them3: 'لا شفافية في العملية',
            us4: 'خيارات واسعة من السيارات',
            them4: 'مخزون محدود',
            us5: 'دعم فني بعد الشراء',
            them5: 'بيع فقط بدون دعم',
            followTiktok: 'تابعنا على تيك توك',
            tiktokDesc: 'شاهد آخر السيارات والعروض على حسابنا',
            shippingTag: 'الشحن',
            carJourney: 'رحلة سيارتك من كوريا إلى بيتك',
            shippingDesc: 'عملية شفافة وآمنة من البداية للنهاية',
            factory: 'المصنع في كوريا',
            factoryDesc: 'اختيار وشراء السيارة من المصدر',
            shipping: 'الشحن البحري',
            shippingDescDetail: 'نقل آمن عبر البحر (25-35 يوم)',
            arrival: 'الوصول للميناء',
            arrivalDesc: 'وصول السيارة لميناء الجزائر',
            customs: 'الجمارك',
            customsDesc: 'إجراءات التخليص الجمركي',
            delivery: 'التسليم للمنزل',
            deliveryDesc: 'توصيل السيارة لباب منزلك',
            haveOrder: 'هل لديك طلب قيد الشحن؟',
            trackOrder: 'تتبع طلبك الآن',
            currency: 'دج',
            errorSubmit: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
        },
        fr: {
            heroBadge: '🚗 Premier importateur en Algérie',
            heroTitle1: 'Importez votre voiture coréenne d\'occasion directement de',
            heroTitle2: 'Corée',
            heroSubtitle: 'Une grande expérience dans l\'importation de Kia, Hyundai et Renault aux meilleurs prix avec garantie de qualité et support complet de l\'achat à la livraison',
            startOrder: 'Commencez votre commande',
            browseCars: 'Parcourir les voitures',
            guarantee100: 'Garantie 100%',
            save40: 'Économisez 40%',
            bestPrices: 'Meilleurs prix',
            bestPricesDesc: 'Économisez jusqu\'à 40% par rapport aux concessionnaires',
            qualityGuarantee: 'Qualité garantie',
            qualityGuaranteeDesc: 'Inspection complète de chaque voiture avant achat',
            fullSupport: 'Support complet',
            fullSupportDesc: 'Nous vous accompagnons du choix à la livraison',
            carsImported: 'voitures importées',
            customerSatisfaction: 'satisfaction client',
            yearsExperience: 'ans d\'expérience',
            stepsTag: 'Étapes',
            howToOrder: 'Comment commander votre voiture?',
            simpleProcess: 'Un processus simple et transparent du début à la fin',
            chooseCar: 'Choisissez la voiture',
            chooseCarDesc: 'Parcourez notre large collection de voitures coréennes et choisissez celle qui vous convient',
            contactUs: 'Contactez-nous',
            contactUsDesc: 'Envoyez-nous les détails de la voiture souhaitée et nous vous fournirons un devis',
            weHandleEverything: 'Nous gérons tout',
            weHandleEverythingDesc: 'Nous nous occupons de l\'achat, l\'expédition, le dédouanement et la livraison',
            sendOrder: 'Envoyez votre commande',
            formSubtitle: 'Remplissez le formulaire et nous vous contacterons sous 24h',
            fullName: 'Nom complet',
            fullNamePlaceholder: 'Entrez votre nom complet',
            phone: 'Téléphone',
            phonePlaceholder: '0555 XX XX XX',
            email: 'Email',
            wilaya: 'Wilaya',
            selectWilaya: 'Sélectionnez la wilaya',
            brand: 'Marque',
            selectBrand: 'Sélectionnez la marque',
            model: 'Modèle',
            selectModel: 'Sélectionnez le modèle',
            selectBrandFirst: 'Sélectionnez d\'abord la marque',
            budget: 'Budget',
            selectBudget: 'Sélectionnez le budget',
            customBudget: 'Budget personnalisé',
            customBudgetPlaceholder: 'Ex: 8,500,000 DZD',
            notes: 'Notes supplémentaires',
            notesPlaceholder: 'Toute exigence ou note particulière...',
            sending: 'Envoi en cours...',
            sendRequest: 'Envoyer la commande',
            orderSuccess: 'Commande reçue avec succès!',
            yourReference: 'Votre numéro de référence:',
            keepReference: 'Gardez ce numéro pour suivre votre commande. Nous vous contacterons bientôt.',
            newOrder: 'Nouvelle commande',
            guarantees: '🔒 Nos garanties',
            guarantee1: 'Rapport d\'inspection complet pour chaque voiture',
            guarantee2: 'Prix transparents sans frais cachés',
            guarantee3: 'Suivi de l\'expédition en temps réel',
            guarantee4: 'Support technique après achat',
            contactDirect: 'Contactez-nous directement',
            callUs: 'Appelez-nous',
            whatsapp: 'WhatsApp',
            messageNow: 'Écrivez-nous',
            emailLabel: 'Email',
            location: 'Adresse',
            locationValue: 'El Milia, Jijel, Algérie',
            carsTag: 'Voitures',
            mostRequested: 'Voitures les plus demandées',
            discoverCars: 'Découvrez notre sélection des meilleures voitures coréennes',
            seats: 'places',
            priceRange: 'Fourchette de prix',
            viewDetails: 'Voir détails',
            notFoundCar: 'Vous n\'avez pas trouvé la voiture que vous cherchez?',
            browseAllCars: 'Voir toutes les voitures',
            featuresTag: 'Avantages',
            whyKorean: 'Pourquoi les voitures coréennes?',
            whyKoreanDesc: 'Les raisons qui font de la Corée le meilleur choix',
            carsAvailable: 'voitures disponibles',
            avgSavings: 'économie moyenne',
            comparison: 'Comparaison: Nous vs Concessionnaires traditionnels',
            withUs: 'Avec nous',
            traditionalDealers: 'Concessionnaires',
            us1: 'Prix usine + commission transparente',
            them1: 'Grande marge bénéficiaire cachée',
            us2: 'Rapport d\'inspection complet',
            them2: 'Aucune garantie sur l\'état',
            us3: 'Suivi de l\'expédition en temps réel',
            them3: 'Aucune transparence',
            us4: 'Large choix de voitures',
            them4: 'Stock limité',
            us5: 'Support technique après achat',
            them5: 'Vente uniquement, sans support',
            followTiktok: 'Suivez-nous sur TikTok',
            tiktokDesc: 'Découvrez les dernières voitures et offres sur notre compte',
            shippingTag: 'Expédition',
            carJourney: 'Le voyage de votre voiture de Corée à chez vous',
            shippingDesc: 'Un processus transparent et sûr du début à la fin',
            factory: 'Usine en Corée',
            factoryDesc: 'Sélection et achat de la voiture à la source',
            shipping: 'Transport maritime',
            shippingDescDetail: 'Transport sécurisé par mer (25-35 jours)',
            arrival: 'Arrivée au port',
            arrivalDesc: 'Arrivée de la voiture au port d\'Algérie',
            customs: 'Douane',
            customsDesc: 'Procédures de dédouanement',
            delivery: 'Livraison à domicile',
            deliveryDesc: 'Livraison de la voiture à votre porte',
            haveOrder: 'Avez-vous une commande en cours d\'expédition?',
            trackOrder: 'Suivez votre commande',
            currency: 'DZD',
            errorSubmit: 'Une erreur est survenue. Veuillez réessayer.'
        }
    }

    const tx = text[language]
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === 'carBrand') {
            setFormData(prev => ({ ...prev, [name]: value, carModel: '' }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const getAvailableModels = () => {
        const brandKey = carBrands.find(b => b.label === formData.carBrand)?.value || ''
        return carModelsByBrand[brandKey] || []
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const refNumber = generateReferenceNumber()

            const { error } = await supabase.from('orders').insert({
                reference_number: refNumber,
                customer_name: formData.fullName,
                customer_phone: formData.phone,
                customer_email: formData.email || null,
                customer_wilaya: formData.wilaya,
                car_brand: formData.carBrand,
                car_model: formData.carModel,
                car_budget: formData.budget,
                car_custom_budget: formData.customBudget || null,
                notes: formData.notes || null,
                status: 'pending'
            })

            if (error) throw error

            try {
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    {
                        reference: refNumber,
                        from_name: formData.fullName,
                        phone: formData.phone,
                        customer_email: formData.email || 'غير محدد',
                        wilaya: formData.wilaya,
                        car_brand: formData.carBrand,
                        car_model: formData.carModel,
                        budget: formData.budget === 'أخرى (حدد الميزانية)'
                            ? `ميزانية مخصصة: ${formData.customBudget}`
                            : formData.budget,
                        notes: formData.notes || 'لا توجد ملاحظات'
                    },
                    EMAILJS_PUBLIC_KEY
                )
            } catch (emailError) {
                console.error('Email notification failed:', emailError)
            }

            setReferenceNumber(refNumber)
            setSubmitSuccess(true)
            setFormData({
                fullName: '', phone: '', email: '', wilaya: '',
                carBrand: '', carModel: '', budget: '', customBudget: '', notes: ''
            })
        } catch (error) {
            console.error('Error submitting order:', error)
            alert(tx.errorSubmit)
        } finally {
            setIsSubmitting(false)
        }
    }

    const stats = [
        { number: '500+', label: tx.carsImported },
        { number: '98%', label: tx.customerSatisfaction },
        { number: '2', label: tx.yearsExperience }
    ]

    const benefits = [
        { icon: DollarSign, title: tx.bestPrices, desc: tx.bestPricesDesc },
        { icon: Shield, title: tx.qualityGuarantee, desc: tx.qualityGuaranteeDesc },
        { icon: Headphones, title: tx.fullSupport, desc: tx.fullSupportDesc }
    ]

    const processSteps = [
        { step: 1, title: tx.chooseCar, desc: tx.chooseCarDesc, icon: Car },
        { step: 2, title: tx.contactUs, desc: tx.contactUsDesc, icon: Phone },
        { step: 3, title: tx.weHandleEverything, desc: tx.weHandleEverythingDesc, icon: CheckCircle }
    ]

    const timelineSteps = [
        { icon: Factory, title: tx.factory, desc: tx.factoryDesc },
        { icon: Ship, title: tx.shipping, desc: tx.shippingDescDetail },
        { icon: Package, title: tx.arrival, desc: tx.arrivalDesc },
        { icon: FileCheck, title: tx.customs, desc: tx.customsDesc },
        { icon: HomeIcon, title: tx.delivery, desc: tx.deliveryDesc }
    ]

    const advantages = [
        { us: tx.us1, them: tx.them1 },
        { us: tx.us2, them: tx.them2 },
        { us: tx.us3, them: tx.them3 },
        { us: tx.us4, them: tx.them4 },
        { us: tx.us5, them: tx.them5 }
    ]

    return (
        <div className={`home ${!isRTL ? 'home-ltr' : ''}`}>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-overlay"></div>
                    <div className="hero-pattern"></div>
                </div>

                <div className="hero-content container">
                    <div className="hero-text">
                        <div className="hero-badge animate-fadeInDown">
                            <span>{tx.heroBadge}</span>
                        </div>

                        <h1 className="hero-title animate-fadeInUp">
                            {tx.heroTitle1}{' '}
                            <span className="text-gradient">{tx.heroTitle2}</span>
                        </h1>

                        <p className="hero-subtitle animate-fadeInUp stagger-2">
                            {tx.heroSubtitle}
                        </p>

                        <div className="hero-benefits animate-fadeInUp stagger-3">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="hero-benefit">
                                    <div className="benefit-icon">
                                        <benefit.icon size={24} />
                                    </div>
                                    <div>
                                        <h4>{benefit.title}</h4>
                                        <p>{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hero-stats animate-fadeInUp stagger-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="hero-stat">
                                    <span className="stat-number">{stat.number}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="hero-actions animate-fadeInUp stagger-5">
                            <a href="#order-form" className="btn btn-primary btn-lg">
                                {tx.startOrder}
                                <ArrowIcon size={20} />
                            </a>
                            <Link to="/cars" className="btn btn-secondary btn-lg">
                                {tx.browseCars}
                            </Link>
                        </div>
                    </div>

                    {/* Floating Badges */}
                    <div className="hero-floating">
                        <div className="floating-badge badge-1 animate-float">
                            <Shield size={24} />
                            <span>{tx.guarantee100}</span>
                        </div>
                        <div className="floating-badge badge-2 animate-float" style={{ animationDelay: '0.5s' }}>
                            <DollarSign size={24} />
                            <span>{tx.save40}</span>
                        </div>
                    </div>
                </div>

                <div className="blob blob-primary" style={{ top: '10%', right: '-10%', width: '400px', height: '400px' }}></div>
                <div className="blob blob-secondary" style={{ bottom: '10%', left: '-5%', width: '300px', height: '300px' }}></div>
            </section>

            {/* Order Process Section */}
            <section id="order-form" className="order-section section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">{tx.stepsTag}</span>
                        <h2>{tx.howToOrder}</h2>
                        <p>{tx.simpleProcess}</p>
                    </div>

                    <div className="process-steps">
                        {processSteps.map((step, index) => (
                            <div key={index} className="process-step animate-fadeInUp" style={{ animationDelay: `${index * 0.2}s` }}>
                                <div className="step-number">{step.step}</div>
                                <div className="step-icon">
                                    <step.icon size={32} />
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                                {index < processSteps.length - 1 && <div className="step-connector"></div>}
                            </div>
                        ))}
                    </div>

                    <div className="order-grid">
                        {/* Order Form */}
                        <div className="order-form-container">
                            <div className="form-card card">
                                <div className="form-header">
                                    <h3>{tx.sendOrder}</h3>
                                    <p>{tx.formSubtitle}</p>
                                </div>

                                {submitSuccess ? (
                                    <div className="form-success">
                                        <div className="success-icon">
                                            <CheckCircle size={48} />
                                        </div>
                                        <h4>{tx.orderSuccess}</h4>
                                        <p>{tx.yourReference}</p>
                                        <div className="reference-number">{referenceNumber}</div>
                                        <p className="success-note">{tx.keepReference}</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setSubmitSuccess(false)}
                                        >
                                            {tx.newOrder}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="order-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">{tx.fullName} *</label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    className="form-input"
                                                    placeholder={tx.fullNamePlaceholder}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">{tx.phone} *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="form-input"
                                                    placeholder={tx.phonePlaceholder}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">{tx.email}</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="form-input"
                                                    placeholder="example@email.com"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">{tx.wilaya} *</label>
                                                <select
                                                    name="wilaya"
                                                    value={formData.wilaya}
                                                    onChange={handleInputChange}
                                                    className="form-select"
                                                    required
                                                >
                                                    <option value="">{tx.selectWilaya}</option>
                                                    {wilayas.map(wilaya => (
                                                        <option key={wilaya.code} value={wilaya.name}>
                                                            {wilaya.code} - {wilaya.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">{tx.brand} *</label>
                                                <select
                                                    name="carBrand"
                                                    value={formData.carBrand}
                                                    onChange={handleInputChange}
                                                    className="form-select"
                                                    required
                                                >
                                                    <option value="">{tx.selectBrand}</option>
                                                    {carBrands.map(brand => (
                                                        <option key={brand.value} value={brand.label}>
                                                            {brand.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">{tx.model} *</label>
                                                <select
                                                    name="carModel"
                                                    value={formData.carModel}
                                                    onChange={handleInputChange}
                                                    className="form-select"
                                                    required
                                                    disabled={!formData.carBrand}
                                                >
                                                    <option value="">{formData.carBrand ? tx.selectModel : tx.selectBrandFirst}</option>
                                                    {getAvailableModels().map(model => (
                                                        <option key={model.value} value={model.label}>
                                                            {model.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">{tx.budget} *</label>
                                            <select
                                                name="budget"
                                                value={formData.budget}
                                                onChange={handleInputChange}
                                                className="form-select"
                                                required
                                            >
                                                <option value="">{tx.selectBudget}</option>
                                                {budgetRanges.map(range => (
                                                    <option key={range.value} value={range.label}>
                                                        {range.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {formData.budget === 'أخرى (حدد الميزانية)' && (
                                            <div className="form-group">
                                                <label className="form-label">{tx.customBudget} *</label>
                                                <input
                                                    type="text"
                                                    name="customBudget"
                                                    value={formData.customBudget}
                                                    onChange={handleInputChange}
                                                    className="form-input"
                                                    placeholder={tx.customBudgetPlaceholder}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="form-group">
                                            <label className="form-label">{tx.notes}</label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                className="form-textarea"
                                                placeholder={tx.notesPlaceholder}
                                                rows={3}
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg w-full"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner" style={{ width: '20px', height: '20px' }}></span>
                                                    {tx.sending}
                                                </>
                                            ) : (
                                                <>
                                                    {tx.sendRequest}
                                                    <ArrowIcon size={20} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Contact Info & Notes */}
                        <div className="order-info">
                            <div className="info-card card">
                                <h4>{tx.guarantees}</h4>
                                <ul className="guarantee-list">
                                    <li>
                                        <CheckCircle size={18} />
                                        <span>{tx.guarantee1}</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={18} />
                                        <span>{tx.guarantee2}</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={18} />
                                        <span>{tx.guarantee3}</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={18} />
                                        <span>{tx.guarantee4}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="contact-card card">
                                <h4>{tx.contactDirect}</h4>
                                <div className="contact-methods">
                                    <a href="tel:+213557060478" className="contact-method">
                                        <Phone size={20} />
                                        <div>
                                            <span>{tx.callUs}</span>
                                            <strong>0557-06-04-78</strong>
                                        </div>
                                    </a>
                                    <a href="https://wa.me/821080890802" target="_blank" rel="noopener noreferrer" className="contact-method whatsapp-method">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        <div>
                                            <span>{tx.whatsapp}</span>
                                            <strong>{tx.messageNow}</strong>
                                        </div>
                                    </a>
                                    <a href="mailto:contact@wahid-auto.com" className="contact-method">
                                        <Mail size={20} />
                                        <div>
                                            <span>{tx.emailLabel}</span>
                                            <strong>contact@wahid-auto.com</strong>
                                        </div>
                                    </a>
                                    <a href="https://maps.app.goo.gl/mjPVTCHVaAapNcm66" target="_blank" rel="noopener noreferrer" className="contact-method">
                                        <MapPin size={20} />
                                        <div>
                                            <span>{tx.location}</span>
                                            <strong>{tx.locationValue}</strong>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Cars Section */}
            <section className="cars-section section section-dark">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">{tx.carsTag}</span>
                        <h2>{tx.mostRequested}</h2>
                        <p>{tx.discoverCars}</p>
                    </div>

                    <div className="cars-grid">
                        {popularCars.map((car, index) => (
                            <div key={car.id} className="car-card animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="car-image">
                                    <img src={car.image} alt={`${isRTL ? car.brandAr : car.brandFr} ${isRTL ? car.modelAr : car.modelFr}`} />
                                    <div className="car-badge">{car.year}</div>
                                </div>
                                <div className="car-content">
                                    <div className="car-brand">{isRTL ? car.brandAr : car.brandFr}</div>
                                    <h3 className="car-name">{isRTL ? car.modelAr : car.modelFr}</h3>
                                    <p className="car-description">{isRTL ? car.description : car.descriptionFr}</p>
                                    <div className="car-specs">
                                        <span>{isRTL ? car.engine : car.engineFr}</span>
                                        <span>{isRTL ? car.transmission : car.transmissionFr}</span>
                                        <span>{car.seats} {tx.seats}</span>
                                    </div>
                                    <div className="car-footer">
                                        <div className="car-price">
                                            <span>{tx.priceRange}</span>
                                            <strong>{formatPrice(car.priceMin)} - {formatPrice(car.priceMax)} {tx.currency}</strong>
                                        </div>
                                        <Link to={`/cars/${car.id}`} className="btn btn-outline btn-sm">
                                            {tx.viewDetails}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cars-cta">
                        <p>{tx.notFoundCar}</p>
                        <div className="cta-buttons">
                            <Link to="/cars" className="btn btn-primary">
                                {tx.browseAllCars}
                            </Link>
                            <a href="https://wa.me/821080890802" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                {tx.contactUs}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Korean Cars Section */}
            <section className="why-section section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">{tx.featuresTag}</span>
                        <h2>{tx.whyKorean}</h2>
                        <p>{tx.whyKoreanDesc}</p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card card-glass">
                            <span className="stat-value">500+</span>
                            <span className="stat-title">{tx.carsAvailable}</span>
                        </div>
                        <div className="stat-card card-glass">
                            <span className="stat-value">40%</span>
                            <span className="stat-title">{tx.avgSavings}</span>
                        </div>
                        <div className="stat-card card-glass">
                            <span className="stat-value">98%</span>
                            <span className="stat-title">{tx.customerSatisfaction}</span>
                        </div>
                        <div className="stat-card card-glass">
                            <span className="stat-value">2</span>
                            <span className="stat-title">{tx.yearsExperience}</span>
                        </div>
                    </div>

                    <div className="comparison-section">
                        <h3>{tx.comparison}</h3>
                        <div className="comparison-table">
                            <div className="comparison-header">
                                <span>{tx.withUs}</span>
                                <span>{tx.traditionalDealers}</span>
                            </div>
                            {advantages.map((item, index) => (
                                <div key={index} className="comparison-row">
                                    <div className="comparison-us">
                                        <CheckCircle size={18} />
                                        <span>{item.us}</span>
                                    </div>
                                    <div className="comparison-them">
                                        <span>{item.them}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TikTok Integration */}
                    <div className="tiktok-section">
                        <h3>{tx.followTiktok}</h3>
                        <p>{tx.tiktokDesc}</p>
                        <a
                            href="https://www.tiktok.com/@wahidautokr?is_from_webapp=1&sender_device=pc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                            @wahidautokr
                        </a>
                    </div>
                </div>
            </section>

            {/* Shipping Timeline Section */}
            <section className="timeline-section section section-dark">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">{tx.shippingTag}</span>
                        <h2>{tx.carJourney}</h2>
                        <p>{tx.shippingDesc}</p>
                    </div>

                    <div className="timeline">
                        {timelineSteps.map((step, index) => (
                            <div key={index} className="timeline-step animate-fadeInUp" style={{ animationDelay: `${index * 0.15}s` }}>
                                <div className="timeline-icon">
                                    <step.icon size={28} />
                                </div>
                                <div className="timeline-content">
                                    <h4>{step.title}</h4>
                                    <p>{step.desc}</p>
                                </div>
                                {index < timelineSteps.length - 1 && <div className="timeline-connector"></div>}
                            </div>
                        ))}
                    </div>

                    <div className="timeline-cta">
                        <p>{tx.haveOrder}</p>
                        <Link to="/tracking" className="btn btn-primary">
                            {tx.trackOrder}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
