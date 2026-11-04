import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Monogram } from '../components/Logo'
import { CtaBand, PageHero } from '../components/PageParts'
import { site } from '../config/site'
import { useLanguage } from '../context/LanguageContext'
import { formatStockPrice, useWebsiteStock, type StockCar } from '../lib/stock'

const copy = {
    ar: {
        eyebrow: 'متوفرة الآن',
        title: 'سيارات جاهزة، تقدر تحجزها اليوم.',
        lead: 'هذي القائمة تتحدث مباشرة من مخزوننا. السيارة اللي تشوفها هنا موجودة فعلاً.',
        all: 'الكل',
        priceOnRequest: 'السعر عند الطلب',
        reserve: 'احجزها على واتساب',
        km: 'كم',
        loading: 'جاري تحميل المخزون...',
        emptyTitle: 'المخزون يتجدد كل أسبوع.',
        emptyText: 'حالياً ما كاين حتى سيارة معروضة. قل لنا واش تحوس ونلقاولك سيارة في كوريا أو الصين.',
        emptyCta: 'اطلب سيارتك',
        catalog: 'شوف الكتالوج',
        location: { korea: 'في كوريا', china: 'في الصين', algeria: 'في الجزائر' } as Record<string, string>,
        message: (car: StockCar) => `السلام عليكم، راني مهتم بالسيارة ${car.brand} ${car.model} ${car.year ?? ''} المعروضة في الموقع. واش مازالت متوفرة؟`
    },
    fr: {
        eyebrow: 'Disponibles maintenant',
        title: 'Des voitures prêtes, à réserver aujourd’hui.',
        lead: 'Cette liste est mise à jour directement depuis notre stock. Ce que vous voyez existe vraiment.',
        all: 'Tout',
        priceOnRequest: 'Prix sur demande',
        reserve: 'Réserver sur WhatsApp',
        km: 'km',
        loading: 'Chargement du stock…',
        emptyTitle: 'Le stock change chaque semaine.',
        emptyText: 'Aucune voiture affichée pour le moment. Dites-nous ce que vous cherchez, nous la trouvons en Corée ou en Chine.',
        emptyCta: 'Commander',
        catalog: 'Voir le catalogue',
        location: { korea: 'En Corée', china: 'En Chine', algeria: 'En Algérie' } as Record<string, string>,
        message: (car: StockCar) => `Bonjour, je suis intéressé par la ${car.brand} ${car.model} ${car.year ?? ''} affichée sur le site. Est-elle toujours disponible ?`
    }
}

const whatsappNumber = site.whatsappHref.replace('https://wa.me/', '')

export default function Stock() {
    const { language } = useLanguage()
    const tx = copy[language]
    const stock = useWebsiteStock(60)
    const [brand, setBrand] = useState('all')

    const cars = stock.status === 'ready' ? stock.cars : []
    const brands = useMemo(() => [...new Set(cars.map(c => c.brand))], [cars])
    const visible = brand === 'all' ? cars : cars.filter(c => c.brand === brand)
    const locationLabel = (loc: string | null) => (loc ? tx.location[loc.toLowerCase()] ?? loc : null)

    return (
        <div className="stock-page">
            <PageHero eyebrow={tx.eyebrow} title={tx.title} lead={tx.lead} />

            <section className="section">
                <div className="container">
                    {stock.status === 'loading' && <p className="muted">{tx.loading}</p>}

                    {stock.status !== 'loading' && cars.length === 0 && (
                        <div className="stock-empty">
                            <Monogram size={56} />
                            <h2 className="section-title" style={{ fontSize: '1.6rem' }}>{tx.emptyTitle}</h2>
                            <p>{tx.emptyText}</p>
                            <div className="cta-actions">
                                <Link to="/#order" className="btn btn-primary">{tx.emptyCta}</Link>
                                <Link to="/cars" className="btn btn-secondary">{tx.catalog}</Link>
                            </div>
                        </div>
                    )}

                    {cars.length > 0 && (
                        <>
                            {brands.length > 1 && (
                                <div className="stock-filters">
                                    <button className={`chip ${brand === 'all' ? 'is-active' : ''}`} onClick={() => setBrand('all')}>{tx.all} ({cars.length})</button>
                                    {brands.map(b => (
                                        <button key={b} className={`chip latin ${brand === b ? 'is-active' : ''}`} onClick={() => setBrand(b)}>
                                            {b} ({cars.filter(c => c.brand === b).length})
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="stock-grid">
                                {visible.map(car => {
                                    const photo = car.photos_urls?.[0]
                                    const where = locationLabel(car.location)
                                    const link = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(tx.message(car))}`
                                    return (
                                        <article className="stock-card" key={car.id}>
                                            <div className="stock-media" style={{ position: 'relative' }}>
                                                {photo ? <img src={photo} alt={`${car.brand} ${car.model}`} loading="lazy" decoding="async" /> : <Monogram size={64} />}
                                                {where && <span className="stock-badge">{where}</span>}
                                            </div>
                                            <div className="stock-body">
                                                <h3 className="stock-name latin">{car.brand} {car.model}</h3>
                                                <p className="stock-meta num">
                                                    {[car.year, car.color, car.mileage != null ? `${new Intl.NumberFormat('fr-DZ').format(car.mileage)} ${tx.km}` : null].filter(Boolean).join(' · ')}
                                                </p>
                                                <p className="stock-price num">{formatStockPrice(car, language) ?? tx.priceOnRequest}</p>
                                                <div className="stock-actions">
                                                    <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm">{tx.reserve}</a>
                                                </div>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>
            </section>

            <CtaBand />
        </div>
    )
}
