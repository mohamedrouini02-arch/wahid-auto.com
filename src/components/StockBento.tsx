import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCarById, getPriceRangeDisplay, type CarData } from '../data/cars'
import { SplitText } from './motion/Shell'

// The most-asked models as a bento grid: each car cut out of its photo, sitting on a soft card.
// One big card leads; the last tile goes to the full catalogue.

type Lang = 'ar' | 'fr'
const TILES: { id: string; size: 'xl' | 'wide' | 'sq' }[] = [
    { id: 'kia-sportage', size: 'xl' },
    { id: 'kia-k5', size: 'wide' },
    { id: 'kia-seltos', size: 'sq' },
    { id: 'kia-k3', size: 'sq' },
    { id: 'hyundai-tucson', size: 'wide' },
]

const copy = {
    ar: { eyebrow: 'الأكثر طلباً', title: 'السيارات اللي\n*يختاروها الدزيريين.*', all: 'كل السيارات', allSub: 'أكثر من 20 موديل من كوريا والصين', from: 'من كوريا' },
    fr: { eyebrow: 'Les plus demandées', title: 'Les voitures que\n*les Algériens choisissent.*', all: 'Toutes les voitures', allSub: 'Plus de 20 modèles de Corée et de Chine', from: 'De Corée' },
}

export default function StockBento({ language, isRTL }: { language: Lang; isRTL: boolean }) {
    const tx = copy[language]
    const Arrow = isRTL ? ArrowLeft : ArrowRight
    const cars = TILES.map(t => ({ ...t, car: getCarById(t.id) })).filter((t): t is typeof t & { car: CarData } => Boolean(t.car))

    return (
        <section className="section bento-sec" data-tone="light" data-scene="photo">
            <div className="container">
                <div className="bento-head">
                    <p className="eyebrow">{tx.eyebrow}</p>
                    <SplitText className="section-title" text={tx.title} />
                </div>
                <div className="bento" data-reveal>
                    {cars.map(({ id, size, car }, i) => (
                        <Link to={`/cars/${id}`} className={`bento-card bento-${size}`} key={id}>
                            <div className="bento-top">
                                <span className="bento-index latin num">{String(i + 1).padStart(2, '0')}</span>
                                <span className="bento-from">{tx.from}</span>
                            </div>
                            <img src={`/cars/cutouts/${id}.webp`} alt={`${car.brand} ${car.model}`} loading="lazy" decoding="async" />
                            <div className="bento-body">
                                <h3>{language === 'ar' ? `${car.brandAr} ${car.modelAr}` : `${car.brandFr} ${car.modelFr}`}</h3>
                                <p className="num">{getPriceRangeDisplay(car, language)}</p>
                            </div>
                            <span className="bento-go" aria-hidden="true"><Arrow size={18} strokeWidth={1.5} /></span>
                        </Link>
                    ))}
                    <Link to="/cars" className="bento-card bento-all bento-wide">
                        <strong>{tx.all}</strong>
                        <small>{tx.allSub}</small>
                        <span className="bento-go" aria-hidden="true"><Arrow size={22} strokeWidth={1.5} /></span>
                    </Link>
                </div>
            </div>
        </section>
    )
}
