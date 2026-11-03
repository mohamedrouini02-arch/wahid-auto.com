import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { cars, getYearDisplay, type CarData } from '../data/cars'

type Category = CarData['category'] | 'all'

type Props = {
    language: 'ar' | 'fr'
    featuredIds: string[]
}

const MIN = 2_000_000
const MAX = 8_000_000
const STEP = 100_000

const copy = {
    ar: {
        budget: 'ميزانيتك',
        unit: 'دج',
        count: (n: number) => (n === 0 ? 'لا توجد موديلات في هذه الميزانية بعد' : n === 1 ? 'موديل واحد في ميزانيتك' : `${n} موديلات في ميزانيتك`),
        from: 'ابتداءً من',
        empty: 'ارفع الميزانية قليلاً، أو راسلنا وسنبحث لك عن خيار.',
        categories: { all: 'الكل', city: 'مدينة', hatchback: 'هاتشباك', sedan: 'سيدان', suv: 'SUV', chinese: 'صينية' }
    },
    fr: {
        budget: 'Votre budget',
        unit: 'DA',
        count: (n: number) => (n === 0 ? 'Aucun modèle dans ce budget pour l’instant' : n === 1 ? '1 modèle dans votre budget' : `${n} modèles dans votre budget`),
        from: 'À partir de',
        empty: 'Montez un peu le budget, ou écrivez-nous et nous chercherons pour vous.',
        categories: { all: 'Tout', city: 'Citadine', hatchback: 'Compacte', sedan: 'Berline', suv: 'SUV', chinese: 'Chinoises' }
    }
}

const formatDzd = (amount: number, language: 'ar' | 'fr') =>
    new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'fr-DZ').format(amount)

// Interactive model picker: slide the budget, the matching models appear.
export default function BudgetFinder({ language, featuredIds }: Props) {
    const tx = copy[language]
    const [budget, setBudget] = useState(3_000_000)
    const [category, setCategory] = useState<Category>('all')

    const categories = useMemo(() => {
        const present = new Set(cars.map(car => car.category))
        return (['all', 'city', 'hatchback', 'sedan', 'suv', 'chinese'] as Category[])
            .filter(c => c === 'all' || present.has(c as CarData['category']))
    }, [])

    const matches = useMemo(() => {
        const rank = (car: CarData) => {
            const featured = featuredIds.indexOf(car.id)
            return featured === -1 ? 100 : featured
        }
        return cars
            .filter(car => car.priceMin <= budget)
            .filter(car => category === 'all' || car.category === category)
            .sort((a, b) => rank(a) - rank(b) || b.priceMin - a.priceMin)
    }, [budget, category, featuredIds])

    const fill = ((budget - MIN) / (MAX - MIN)) * 100

    return (
        <div className="finder">
            <div className="finder-controls">
                <label className="finder-budget" htmlFor="budget-range">
                    <span className="finder-budget-label">{tx.budget}</span>
                    <span className="finder-budget-value num">
                        {formatDzd(budget, language)} <small>{tx.unit}</small>
                    </span>
                </label>
                <input
                    id="budget-range"
                    type="range"
                    min={MIN}
                    max={MAX}
                    step={STEP}
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="finder-range"
                    style={{ '--fill': `${fill}%` } as React.CSSProperties}
                    aria-valuetext={`${formatDzd(budget, language)} ${tx.unit}`}
                />
                <div className="finder-chips" role="group">
                    {categories.map(c => (
                        <button
                            key={c}
                            type="button"
                            className={`chip ${category === c ? 'is-active' : ''}`}
                            aria-pressed={category === c}
                            onClick={() => setCategory(c)}
                        >
                            {tx.categories[c]}
                        </button>
                    ))}
                </div>
                <p className="finder-count" aria-live="polite">{tx.count(matches.length)}</p>
            </div>

            {matches.length === 0 ? (
                <p className="finder-empty">{tx.empty}</p>
            ) : (
                <div className="model-grid">
                    {matches.slice(0, 6).map((car, index) => (
                        <Link
                            to={`/cars/${car.id}`}
                            className="model-card finder-card"
                            key={car.id}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="model-media">
                                <img src={car.image} alt={`${car.brand} ${car.model}`} loading="lazy" decoding="async" />
                            </div>
                            <div className="model-body">
                                <div className="model-head">
                                    <h3 className="model-name">
                                        {language === 'ar' ? `${car.brandAr} ${car.modelAr}` : `${car.brandFr} ${car.modelFr}`}
                                    </h3>
                                    <span className="model-years latin num">{getYearDisplay(car)}</span>
                                </div>
                                <p className="model-price num">
                                    {tx.from} {formatDzd(car.priceMin, language)} {tx.unit}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
