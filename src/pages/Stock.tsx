import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Monogram } from '../components/Logo'
import StockGallery from '../components/StockGallery'
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
        details: 'كل التفاصيل والصور',
        close: 'إغلاق',
        specs: { year: 'السنة', mileage: 'العداد', color: 'اللون', location: 'مكانها', price: 'السعر' },
        notes: 'ملاحظات',
        photos: (n: number) => `${n} صورة`,
        video: 'شوف الفيديو',
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
        details: 'Détails et toutes les photos',
        close: 'Fermer',
        specs: { year: 'Année', mileage: 'Kilométrage', color: 'Couleur', location: 'Emplacement', price: 'Prix' },
        notes: 'Notes',
        photos: (n: number) => `${n} photos`,
        video: 'Voir la vidéo',
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
    const [open, setOpen] = useState<{ car: StockCar; photo: number } | null>(null)

    const cars = stock.status === 'ready' ? stock.cars : []
    const brands = useMemo(() => [...new Set(cars.map(c => c.brand))], [cars])
    const visible = brand === 'all' ? cars : cars.filter(c => c.brand === brand)
    const locationLabel = (loc: string | null) => (loc ? tx.location[loc.toLowerCase()] ?? loc : null)
    const km = (n: number | null) => (n != null ? `${new Intl.NumberFormat('fr-DZ').format(n)} ${tx.km}` : null)
    const waLink = (car: StockCar) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(tx.message(car))}`
    const specRows = (car: StockCar) => ([
        [tx.specs.year, car.year ? String(car.year) : null],
        [tx.specs.mileage, km(car.mileage)],
        [tx.specs.color, car.color],
        [tx.specs.location, locationLabel(car.location)],
    ] as const).filter((r): r is readonly [string, string] => Boolean(r[1]))

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
                            <div className="stock-grid stock-grid-full">
                                {visible.map(car => {
                                    const photos = car.photos_urls ?? []
                                    return (
                                        <article className="stock-card" key={car.id}>
                                            <StockGallery photos={photos} alt={`${car.brand} ${car.model}`} badge={locationLabel(car.location)} onOpen={i => setOpen({ car, photo: i })} />
                                            <div className="stock-body">
                                                <h3 className="stock-name latin">{car.brand.trim()} {car.model.trim()}</h3>
                                                <p className="stock-price num">{formatStockPrice(car, language) ?? tx.priceOnRequest}</p>
                                                <dl className="stock-specs">
                                                    {specRows(car).map(([label, value]) => (
                                                        <div key={label}><dt>{label}</dt><dd className="num">{value}</dd></div>
                                                    ))}
                                                </dl>
                                                {car.notes && <p className="stock-notes">{car.notes}</p>}
                                                <div className="stock-actions">
                                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen({ car, photo: 0 })}>
                                                        {tx.details}{photos.length > 1 ? ` · ${tx.photos(photos.length)}` : ''}
                                                    </button>
                                                    <a href={waLink(car)} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm">{tx.reserve}</a>
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

            {open && (
                <CarSheet
                    car={open.car}
                    startPhoto={open.photo}
                    onClose={() => setOpen(null)}
                    title={`${open.car.brand.trim()} ${open.car.model.trim()}`}
                    price={formatStockPrice(open.car, language) ?? tx.priceOnRequest}
                    specs={specRows(open.car)}
                    tx={tx}
                    whatsapp={waLink(open.car)}
                />
            )}

            <CtaBand />
        </div>
    )
}

type SheetProps = {
    car: StockCar
    startPhoto: number
    onClose: () => void
    title: string
    price: string
    specs: (readonly [string, string])[]
    tx: (typeof copy)['fr'] | (typeof copy)['ar']
    whatsapp: string
}

function CarSheet({ car, startPhoto, onClose, title, price, specs, tx, whatsapp }: SheetProps) {
    const photos = car.photos_urls ?? []
    const [jump, setJump] = useState(startPhoto)

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKey)
        return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey) }
    }, [onClose])

    return (
        <div className="car-sheet" role="dialog" aria-modal="true" aria-label={title} data-native-scroll onClick={onClose}>
            <div className="car-sheet-panel" onClick={e => e.stopPropagation()}>
                <button type="button" className="car-sheet-close" onClick={onClose} aria-label={tx.close}>×</button>
                <StockGallery key={jump} photos={photos} alt={title} large startIndex={jump} />
                {photos.length > 1 && (
                    <div className="car-sheet-thumbs">
                        {photos.map((src, i) => (
                            <button type="button" key={src + i} className={i === jump ? 'is-active' : ''} onClick={() => setJump(i)} aria-label={`${i + 1}`}>
                                <img src={src} alt="" loading="lazy" decoding="async" />
                            </button>
                        ))}
                    </div>
                )}
                <div className="car-sheet-body">
                    <div className="car-sheet-head">
                        <h2 className="latin">{title}</h2>
                        <p className="stock-price num">{price}</p>
                    </div>
                    <dl className="stock-specs stock-specs-lg">
                        {specs.map(([label, value]) => (
                            <div key={label}><dt>{label}</dt><dd className="num">{value}</dd></div>
                        ))}
                    </dl>
                    {car.notes && (
                        <div className="car-sheet-notes">
                            <h3>{tx.notes}</h3>
                            <p>{car.notes}</p>
                        </div>
                    )}
                    <div className="stock-actions">
                        {car.video_url && <a href={car.video_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{tx.video}</a>}
                        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-accent">{tx.reserve}</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
