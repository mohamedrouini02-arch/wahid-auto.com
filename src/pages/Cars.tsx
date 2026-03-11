import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { cars, CarData, formatPrice, getYearDisplay } from '../data/cars'
import { useLanguage } from '../context/LanguageContext'
import './Cars.css'

export default function Cars() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedBrand, setSelectedBrand] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [showFilters, setShowFilters] = useState(false)
    const [collapsedBrands, setCollapsedBrands] = useState<Set<string>>(new Set())
    const { language, isRTL } = useLanguage()

    const brands = [...new Set(cars.map(car => car.brand))]
    const categories = [...new Set(cars.map(car => car.category))]

    const categoryLabels: Record<string, Record<string, string>> = {
        ar: {
            city: 'سيارات المدينة',
            suv: 'SUV',
            sedan: 'سيدان',
            hatchback: 'هاتشباك'
        },
        fr: {
            city: 'Citadines',
            suv: 'SUV',
            sedan: 'Berlines',
            hatchback: 'Compactes'
        }
    }

    const brandLogos: Record<string, string> = {
        'Kia': '🚗',
        'Hyundai': '🚙',
        'Chevrolet': '🚘',
        'Renault': '🚗'
    }

    const filteredCars = cars.filter(car => {
        const searchFields = language === 'ar'
            ? [car.modelAr, car.brandAr, car.model]
            : [car.modelFr, car.brandFr, car.model]
        const matchesSearch = searchFields.some(field =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
        const matchesBrand = !selectedBrand || car.brand === selectedBrand
        const matchesCategory = !selectedCategory || car.category === selectedCategory
        return matchesSearch && matchesBrand && matchesCategory
    })

    // Group cars by brand
    const carsByBrand = filteredCars.reduce((acc, car) => {
        if (!acc[car.brand]) {
            acc[car.brand] = []
        }
        acc[car.brand].push(car)
        return acc
    }, {} as Record<string, CarData[]>)

    // Sort brands alphabetically
    const sortedBrands = Object.keys(carsByBrand).sort()

    const toggleBrandCollapse = (brand: string) => {
        setCollapsedBrands(prev => {
            const newSet = new Set(prev)
            if (newSet.has(brand)) {
                newSet.delete(brand)
            } else {
                newSet.add(brand)
            }
            return newSet
        })
    }

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedBrand('')
        setSelectedCategory('')
    }

    const t = {
        ar: {
            title: 'السيارات',
            headline: 'اكتشف تشكيلتنا من السيارات',
            subtitle: 'أفضل السيارات الصينية والكورية الجديدة والمستعملة بأسعار منافسة',
            search: 'ابحث عن سيارة...',
            filters: 'الفلاتر',
            allBrands: 'كل العلامات',
            allCategories: 'كل الفئات',
            clearFilters: 'مسح الفلاتر',
            available: 'سيارة متاحة',
            priceRange: 'نطاق السعر',
            viewDetails: 'عرض التفاصيل',
            mostRequested: 'الأكثر طلباً',
            noResults: 'لم نجد نتائج',
            noResultsDesc: 'جرب تغيير معايير البحث أو تواصل معنا للمساعدة',
            notFound: 'لم تجد السيارة المناسبة؟',
            notFoundDesc: 'أخبرنا بمواصفات السيارة التي تبحث عنها وسنوفرها لك',
            contactUs: 'تواصل معنا',
            currency: 'دج',
            models: 'موديلات'
        },
        fr: {
            title: 'Voitures',
            headline: 'Découvrez notre collection',
            subtitle: 'Les meilleures voitures chinoises et coréennes neuves et d\'occasion à prix compétitifs',
            search: 'Rechercher une voiture...',
            filters: 'Filtres',
            allBrands: 'Toutes les marques',
            allCategories: 'Toutes catégories',
            clearFilters: 'Effacer filtres',
            available: 'voitures disponibles',
            priceRange: 'Fourchette de prix',
            viewDetails: 'Voir détails',
            mostRequested: 'Plus demandée',
            noResults: 'Aucun résultat',
            noResultsDesc: 'Essayez de modifier vos critères ou contactez-nous',
            notFound: 'Vous n\'avez pas trouvé?',
            notFoundDesc: 'Dites-nous ce que vous cherchez et nous le trouverons',
            contactUs: 'Contactez-nous',
            currency: 'DZD',
            models: 'modèles'
        }
    }

    const text = t[language]

    return (
        <div className={`cars-page ${!isRTL ? 'cars-page-ltr' : ''}`}>
            {/* Hero */}
            <section className="cars-hero">
                <div className="cars-hero-bg"></div>
                <div className="container">
                    <div className="cars-hero-content">
                        <span className="section-tag">{text.title}</span>
                        <h1>{text.headline}</h1>
                        <p>{text.subtitle}</p>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="filters-section">
                <div className="container">
                    <div className="filters-bar">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder={text.search}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            className="filter-toggle btn btn-secondary"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={20} />
                            {text.filters}
                        </button>

                        <div className="desktop-filters">
                            <select
                                value={selectedBrand}
                                onChange={e => setSelectedBrand(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">{text.allBrands}</option>
                                {brands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>

                            <select
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">{text.allCategories}</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {categoryLabels[language][category] || category}
                                    </option>
                                ))}
                            </select>

                            {(selectedBrand || selectedCategory || searchTerm) && (
                                <button className="clear-filters" onClick={clearFilters}>
                                    <X size={16} />
                                    {text.clearFilters}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    {showFilters && (
                        <div className="mobile-filters">
                            <select
                                value={selectedBrand}
                                onChange={e => setSelectedBrand(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">{text.allBrands}</option>
                                {brands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>

                            <select
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">{text.allCategories}</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {categoryLabels[language][category] || category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </section>

            {/* Results - Grouped by Brand */}
            <section className="results-section section">
                <div className="container">
                    <div className="results-header">
                        <p>{filteredCars.length} {text.available}</p>
                    </div>

                    {filteredCars.length > 0 ? (
                        <div className="brands-container">
                            {sortedBrands.map(brand => (
                                <div key={brand} className="brand-section">
                                    <div
                                        className="brand-header"
                                        onClick={() => toggleBrandCollapse(brand)}
                                    >
                                        <div className="brand-info">
                                            <span className="brand-logo">{brandLogos[brand] || '🚗'}</span>
                                            <h2 className="brand-name">{brand}</h2>
                                            <span className="brand-count">
                                                {carsByBrand[brand].length} {text.models}
                                            </span>
                                        </div>
                                        <button className="brand-toggle">
                                            {collapsedBrands.has(brand) ? (
                                                <ChevronDown size={24} />
                                            ) : (
                                                <ChevronUp size={24} />
                                            )}
                                        </button>
                                    </div>

                                    {!collapsedBrands.has(brand) && (
                                        <div className="cars-results-grid">
                                            {carsByBrand[brand].map((car: CarData) => (
                                                <div key={car.id} className="car-result-card card">
                                                    <div className="car-result-image">
                                                        <img src={car.image} alt={`${language === 'ar' ? car.brandAr : car.brandFr} ${language === 'ar' ? car.modelAr : car.modelFr}`} />
                                                        <div className="car-year-badge">{getYearDisplay(car)}</div>
                                                        {car.isPopular && <div className="popular-badge">{text.mostRequested}</div>}
                                                    </div>
                                                    <div className="car-result-content">
                                                        <div className="car-result-brand">
                                                            {language === 'ar' ? car.brandAr : car.brandFr}
                                                        </div>
                                                        <h3 className="car-result-name">
                                                            {language === 'ar' ? car.modelAr : car.modelFr}
                                                        </h3>
                                                        <p className="car-result-desc">
                                                            {language === 'ar' ? car.description : car.descriptionFr}
                                                        </p>
                                                        <div className="car-result-specs">
                                                            <span>{language === 'ar' ? car.engine : car.engineFr}</span>
                                                            <span>{language === 'ar' ? car.transmission : car.transmissionFr}</span>
                                                            <span>{language === 'ar' ? car.fuelType : car.fuelTypeFr}</span>
                                                        </div>
                                                        <div className="car-result-footer">
                                                            <div className="car-result-price">
                                                                <span>{text.priceRange}</span>
                                                                <strong>{formatPrice(car.priceMin)} - {formatPrice(car.priceMax)} {text.currency}</strong>
                                                            </div>
                                                            <Link to={`/cars/${car.id}`} className="btn btn-primary btn-sm">
                                                                {text.viewDetails}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <h3>{text.noResults}</h3>
                            <p>{text.noResultsDesc}</p>
                            <button className="btn btn-primary" onClick={clearFilters}>
                                {text.clearFilters}
                            </button>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="cars-page-cta">
                        <h3>{text.notFound}</h3>
                        <p>{text.notFoundDesc}</p>
                        <a href="https://wa.me/821080890802" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                            {text.contactUs}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
