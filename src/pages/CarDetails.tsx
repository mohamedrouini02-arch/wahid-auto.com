import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    ArrowRight, ArrowLeft, Phone, Check, Fuel, Settings, Users, Calendar, Palette,
    ChevronLeft, ChevronRight, Monitor, Bluetooth, Camera, Wind, Shield, Key,
    Armchair, Thermometer, FlipVertical, Lightbulb, Sun, Gauge, Eye, Snowflake,
    AlertTriangle, Car, Radio, Navigation, Wifi, Volume2, SunMedium, Lock
} from 'lucide-react'
import { getCarById, getPopularCars, formatPrice, getYearDisplay } from '../data/cars'
import { useLanguage } from '../context/LanguageContext'
import './CarDetails.css'

// Feature to icon mapping
const featureIconMap: { [key: string]: React.ElementType } = {
    // Arabic keys
    'شاشة لمس': Monitor,
    'شاشة لمس 7"': Monitor,
    'شاشة لمس 8"': Monitor,
    'شاشة لمس 10"': Monitor,
    'بلوتوث': Bluetooth,
    'كاميرا خلفية': Camera,
    'مكيف هواء': Wind,
    'وسائد هوائية': Shield,
    'فتح بدون مفتاح': Key,
    'مقاعد جلد': Armchair,
    'مقاعد مدفأة ومهواة': Thermometer,
    'إغلاق أوتوماتيكي للمرايا': FlipVertical,
    'إضاءة LED كاملة': Lightbulb,
    'إضاءة محيطية': Sun,
    'مقود مدفأ': Gauge,
    'حساسات وكاميرا خلفية': Eye,
    'تحذير النقطة العمياء': Eye,
    'تكييف أوتوماتيكي': Snowflake,
    'تحذير التصادم والتوقف التلقائي': AlertTriangle,
    'نظام ABS': Car,
    'راديو': Radio,
    'نظام ملاحة': Navigation,
    'واي فاي': Wifi,
    'نظام صوت': Volume2,
    'فتحة سقف': SunMedium,
    'إغلاق مركزي': Lock,
    // French keys
    'Écran tactile': Monitor,
    'Écran tactile 7"': Monitor,
    'Bluetooth': Bluetooth,
    'Caméra de recul': Camera,
    'Climatisation': Wind,
    'Airbags': Shield,
    'Ouverture mains libres': Key,
    'Sièges en cuir': Armchair,
    'Sièges chauffants et ventilés': Thermometer,
    'Fermeture auto des rétroviseurs': FlipVertical,
    'Éclairage LED complet': Lightbulb,
    "Éclairage d'ambiance": Sun,
    'Volant chauffant': Gauge,
    'Capteurs et caméra arrière': Eye,
    'Alerte angle mort': Eye,
    'Climatisation automatique': Snowflake,
    'Alerte collision et arrêt auto': AlertTriangle,
    'ABS': Car,
}

// Get icon for feature
const getFeatureIcon = (feature: string): React.ElementType => {
    // Try exact match first
    if (featureIconMap[feature]) {
        return featureIconMap[feature]
    }
    // Try partial match
    for (const key in featureIconMap) {
        if (feature.includes(key) || key.includes(feature)) {
            return featureIconMap[key]
        }
    }
    // Default to Check
    return Check
}

export default function CarDetails() {
    const { id } = useParams<{ id: string }>()
    const car = getCarById(id || '')
    const similarCars = getPopularCars().filter(c => c.id !== id).slice(0, 3)
    const { language, isRTL } = useLanguage()

    // Carousel state
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Scroll to top when page loads or car changes
    useEffect(() => {
        window.scrollTo(0, 0)
        setCurrentImageIndex(0)
    }, [id])

    // Combine main image with additional images for carousel
    const allImages = car ? [car.image, ...(car.images || [])] : []

    const t = {
        ar: {
            notFound: 'السيارة غير موجودة',
            notFoundDesc: 'عذراً، لم نتمكن من العثور على هذه السيارة',
            backToCars: 'العودة للسيارات',
            priceRange: 'نطاق السعر',
            currency: 'دج',
            specs: 'المواصفات الأساسية',
            engine: 'المحرك',
            transmission: 'ناقل الحركة',
            fuel: 'نوع الوقود',
            seats: 'عدد المقاعد',
            seatsUnit: 'مقاعد',
            year: 'سنة الصنع',
            colors: 'الألوان المتاحة',
            colorUnit: 'لون',
            features: 'المميزات والتجهيزات',
            availableColors: 'الألوان المتاحة',
            interested: 'مهتم بهذه السيارة؟',
            interestedDesc: 'تواصل معنا الآن للحصول على عرض سعر مفصل',
            whatsapp: 'تواصل عبر واتساب',
            call: 'اتصل بنا',
            similar: 'سيارات مشابهة',
            gallery: 'معرض الصور'
        },
        fr: {
            notFound: 'Voiture non trouvée',
            notFoundDesc: 'Désolé, nous n\'avons pas trouvé cette voiture',
            backToCars: 'Retour aux voitures',
            priceRange: 'Fourchette de prix',
            currency: 'DZD',
            specs: 'Spécifications techniques',
            engine: 'Moteur',
            transmission: 'Transmission',
            fuel: 'Carburant',
            seats: 'Places',
            seatsUnit: 'places',
            year: 'Année',
            colors: 'Couleurs disponibles',
            colorUnit: 'couleurs',
            features: 'Équipements',
            availableColors: 'Couleurs disponibles',
            interested: 'Intéressé par cette voiture?',
            interestedDesc: 'Contactez-nous pour un devis détaillé',
            whatsapp: 'Contact WhatsApp',
            call: 'Appelez-nous',
            similar: 'Voitures similaires',
            gallery: 'Galerie photos'
        }
    }

    const text = t[language]

    // Carousel navigation functions
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    if (!car) {
        return (
            <div className="car-details-page">
                <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                    <h1>{text.notFound}</h1>
                    <p>{text.notFoundDesc}</p>
                    <Link to="/cars" className="btn btn-primary" style={{ marginTop: '20px' }}>
                        {text.backToCars}
                    </Link>
                </div>
            </div>
        )
    }

    const carName = language === 'ar' ? car.modelAr : car.modelFr
    const carBrand = language === 'ar' ? car.brandAr : car.brandFr
    const carDesc = language === 'ar' ? car.description : car.descriptionFr
    const carFeatures = language === 'ar' ? car.features : car.featuresFr
    const carColors = language === 'ar' ? car.colors : car.colorsFr

    const specs = [
        { icon: Settings, label: text.engine, value: language === 'ar' ? car.engine : car.engineFr },
        { icon: Settings, label: text.transmission, value: language === 'ar' ? car.transmission : car.transmissionFr },
        { icon: Fuel, label: text.fuel, value: language === 'ar' ? car.fuelType : car.fuelTypeFr },
        { icon: Users, label: text.seats, value: `${car.seats} ${text.seatsUnit}` },
        { icon: Calendar, label: text.year, value: getYearDisplay(car) },
        { icon: Palette, label: text.colors, value: `${car.colors.length} ${text.colorUnit}` }
    ]

    const BackArrow = isRTL ? ArrowRight : ArrowLeft

    return (
        <div className={`car-details-page ${!isRTL ? 'car-details-ltr' : ''}`}>
            {/* Hero */}
            <section className="car-details-hero">
                <div className="car-details-hero-bg">
                    <img src={car.image} alt={`${carBrand} ${carName}`} />
                    <div className="hero-overlay"></div>
                </div>
                <div className="container">
                    <div className="car-details-hero-content">
                        <Link to="/cars" className="back-link">
                            <BackArrow size={20} />
                            {text.backToCars}
                        </Link>
                        <div className="car-brand-badge">{carBrand}</div>
                        <h1>{carName} {getYearDisplay(car)}</h1>
                        <p>{carDesc}</p>
                        <div className="price-box">
                            <span>{text.priceRange}</span>
                            <strong>{formatPrice(car.priceMin)} - {formatPrice(car.priceMax)} {text.currency}</strong>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery Carousel */}
            {allImages.length > 1 && (
                <section className="gallery-section section">
                    <div className="container">
                        <h2>{text.gallery}</h2>
                        <div className="gallery-carousel">
                            <button
                                className="carousel-nav carousel-prev"
                                onClick={prevImage}
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div className="carousel-main">
                                <img
                                    src={allImages[currentImageIndex]}
                                    alt={`${carBrand} ${carName} - ${currentImageIndex + 1}`}
                                    className="carousel-image"
                                />
                                <div className="carousel-counter">
                                    {currentImageIndex + 1} / {allImages.length}
                                </div>
                            </div>

                            <button
                                className="carousel-nav carousel-next"
                                onClick={nextImage}
                                aria-label="Next image"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="gallery-thumbnails">
                            {allImages.map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${index === currentImageIndex ? 'thumbnail-active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Specifications */}
            <section className="specs-section section">
                <div className="container">
                    <h2>{text.specs}</h2>
                    <div className="specs-grid">
                        {specs.map((spec, index) => (
                            <div key={index} className="spec-card card">
                                <div className="spec-icon">
                                    <spec.icon size={24} />
                                </div>
                                <div className="spec-info">
                                    <span className="spec-label">{spec.label}</span>
                                    <strong className="spec-value">{spec.value}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section section section-dark">
                <div className="container">
                    <h2>{text.features}</h2>
                    <div className="features-grid">
                        {carFeatures.map((feature, index) => {
                            const FeatureIcon = getFeatureIcon(feature)
                            return (
                                <div key={index} className="feature-item">
                                    <FeatureIcon size={20} />
                                    <span>{feature}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Colors */}
            <section className="colors-section section">
                <div className="container">
                    <h2>{text.availableColors}</h2>
                    <div className="colors-list">
                        {carColors.map((color, index) => (
                            <div key={index} className="color-item">
                                <span>{color}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="contact-cta section">
                <div className="container">
                    <div className="cta-card card">
                        <h2>{text.interested}</h2>
                        <p>{text.interestedDesc}</p>
                        <div className="cta-actions">
                            <a
                                href={`https://wa.me/821080890802?text=${encodeURIComponent(language === 'ar' ? `مرحباً، أريد الاستفسار عن سيارة ${carBrand} ${carName}` : `Bonjour, je suis intéressé par ${carBrand} ${carName}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-lg"
                            >
                                {text.whatsapp}
                            </a>
                            <a href="tel:+213782769427" className="btn btn-outline btn-lg">
                                <Phone size={20} />
                                {text.call}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Similar Cars */}
            <section className="similar-section section section-dark">
                <div className="container">
                    <h2>{text.similar}</h2>
                    <div className="similar-grid">
                        {similarCars.map(similarCar => (
                            <Link key={similarCar.id} to={`/cars/${similarCar.id}`} className="similar-card">
                                <div className="similar-image">
                                    <img src={similarCar.image} alt={`${language === 'ar' ? similarCar.brandAr : similarCar.brandFr} ${language === 'ar' ? similarCar.modelAr : similarCar.modelFr}`} />
                                </div>
                                <div className="similar-info">
                                    <span className="similar-brand">{language === 'ar' ? similarCar.brandAr : similarCar.brandFr}</span>
                                    <h4>{language === 'ar' ? similarCar.modelAr : similarCar.modelFr}</h4>
                                    <strong>{formatPrice(similarCar.priceMin)} {text.currency}</strong>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
