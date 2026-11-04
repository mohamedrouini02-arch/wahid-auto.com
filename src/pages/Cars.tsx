import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CtaBand, PageHero } from '../components/PageParts'
import { featuredModelIds } from '../config/site'
import { useLanguage } from '../context/LanguageContext'
import { cars, getYearDisplay, type CarData } from '../data/cars'

type Category = CarData['category'] | 'all'

const copy = {
    ar: {
        eyebrow: 'الكتالوج',
        title: 'كل الموديلات اللي نستوردوها.',
        lead: 'الأسعار تقريبية وتتبع سعر الصرف. اضغط على أي موديل للتفاصيل، أو شوف السيارات المتوفرة الآن.',
        stockLink: 'السيارات المتوفرة الآن',
        search: 'ابحث: مورنينغ، سبورتاج...',
        all: 'الكل',
        categories: { city: 'مدينة', hatchback: 'هاتشباك', sedan: 'سيدان', suv: 'SUV', chinese: 'صينية' },
        count: (n: number) => `${n} موديل`,
        from: 'ابتداءً من',
        unit: 'دج',
        popular: 'الأكثر طلباً',
        empty: 'ما لقيناش هذا الموديل في الكتالوج. راسلنا ونجيبوهولك.',
        ask: 'اسأل على واتساب'
    },
    fr: {
        eyebrow: 'Catalogue',
        title: 'Tous les modèles que nous importons.',
        lead: 'Prix indicatifs, ils suivent le taux de change. Touchez un modèle pour le détail, ou voyez les voitures disponibles maintenant.',
        stockLink: 'Voitures disponibles',
        search: 'Rechercher : Morning, Sportage…',
        all: 'Tout',
        categories: { city: 'Citadine', hatchback: 'Compacte', sedan: 'Berline', suv: 'SUV', chinese: 'Chinoises' },
        count: (n: number) => `${n} modèles`,
        from: 'À partir de',
        unit: 'DA',
        popular: 'Populaire',
        empty: 'Ce modèle n’est pas au catalogue. Écrivez-nous, nous le trouvons pour vous.',
        ask: 'Demander sur WhatsApp'
    }
}

export default function Cars() {
    const { language } = useLanguage()
    const tx = copy[language]
    const [query, setQuery] = useState('')
    const [brand, setBrand] = useState('all')
    const [category, setCategory] = useState<Category>('all')

    const brands = useMemo(() => [...new Set(cars.map(c => c.brand))], [])
    const categories = useMemo(() => [...new Set(cars.map(c => c.category))], [])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return cars.filter(car =>
            (brand === 'all' || car.brand === brand) &&
            (category === 'all' || car.category === category) &&
            (!q || [car.brand, car.model, car.brandAr, car.modelAr, car.modelFr].some(v => v.toLowerCase().includes(q)))
        )
    }, [query, brand, category])

    const grouped = useMemo(() => {
        const map = new Map<string, CarData[]>()
        for (const car of filtered) map.set(car.brand, [...(map.get(car.brand) ?? []), car])
        return [...map.entries()]
    }, [filtered])

    const format = (n: number) => new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'fr-DZ').format(n)

    return (
        <div className="cars-page">
            <PageHero eyebrow={tx.eyebrow} title={tx.title} lead={tx.lead}>
                <Link to="/stock" className="btn btn-primary">{tx.stockLink}</Link>
            </PageHero>

            <div className="catalog-toolbar">
                <div className="container catalog-toolbar-inner">
                    <div className="catalog-search">
                        <Search size={18} strokeWidth={1.5} />
                        <input id="catalog-search" className="form-input" placeholder={tx.search} value={query} onChange={e => setQuery(e.target.value)} />
                    </div>
                    <div className="finder-chips">
                        <button className={`chip ${brand === 'all' ? 'is-active' : ''}`} onClick={() => setBrand('all')}>{tx.all}</button>
                        {brands.map(b => (
                            <button key={b} className={`chip latin ${brand === b ? 'is-active' : ''}`} onClick={() => setBrand(b)}>{b}</button>
                        ))}
                    </div>
                    <div className="finder-chips">
                        <button className={`chip ${category === 'all' ? 'is-active' : ''}`} onClick={() => setCategory('all')}>{tx.all}</button>
                        {categories.map(c => (
                            <button key={c} className={`chip ${category === c ? 'is-active' : ''}`} onClick={() => setCategory(c)}>{tx.categories[c]}</button>
                        ))}
                    </div>
                    <span className="catalog-count">{tx.count(filtered.length)}</span>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    {grouped.length === 0 ? (
                        <div className="catalog-empty">
                            <p>{tx.empty}</p>
                            <a href="https://wa.me/213557060478" target="_blank" rel="noopener noreferrer" className="btn btn-accent">{tx.ask}</a>
                        </div>
                    ) : grouped.map(([groupBrand, list]) => (
                        <div className="catalog-group" key={groupBrand}>
                            <div className="catalog-group-title">
                                <h2 className="latin">{groupBrand}</h2>
                                <span>{tx.count(list.length)}</span>
                            </div>
                            <div className="model-grid">
                                {list.map((car, index) => (
                                    <Link to={`/cars/${car.id}`} className="model-card finder-card" key={car.id} style={{ animationDelay: `${index * 40}ms` }}>
                                        <div className="model-media" style={{ position: 'relative' }}>
                                            <img src={car.image} alt={`${car.brand} ${car.model}`} loading="lazy" decoding="async" />
                                            {featuredModelIds.includes(car.id) && <span className="stock-badge">{tx.popular}</span>}
                                        </div>
                                        <div className="model-body">
                                            <div className="model-head">
                                                <h3 className="model-name">{language === 'ar' ? `${car.brandAr} ${car.modelAr}` : `${car.brandFr} ${car.modelFr}`}</h3>
                                                <span className="model-years latin num">{getYearDisplay(car)}</span>
                                            </div>
                                            <p className="model-price num">{tx.from} {format(car.priceMin)} {tx.unit}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <CtaBand />
        </div>
    )
}
