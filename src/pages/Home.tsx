import emailjs from '@emailjs/browser'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BudgetFinder from '../components/BudgetFinder'
import JourneyHero from '../components/JourneyHero'
import { Monogram } from '../components/Logo'
import { featuredModelIds, site } from '../config/site'
import { useLanguage } from '../context/LanguageContext'
import { cars } from '../data/cars'
import { budgetRanges, carBrands, carModelsByBrand, wilayas } from '../data/wilayas'
import { generateReferenceNumber, supabase } from '../lib/supabase'
import './Home.css'

// EmailJS: notifies the team by email when an order comes in.
const EMAILJS_SERVICE_ID = 'service_u8c498u'
const EMAILJS_TEMPLATE_ID = 'template_iftksee'
const EMAILJS_PUBLIC_KEY = 'jXCdC22u9FmNvH_Yz'
const OTHER_BUDGET = 'أخرى (حدد الميزانية)'

const copy = {
    ar: {
        promise: ['سيارة تختارها أنت.', 'نفحصوها كأنها تاعنا.', 'وتوصلك بالسعر اللي قلناه.'],
        promiseText: 'نجيبولك سيارتك من كوريا ولا الصين كيما لازم. نختاروها معاك، نفحصوها بعينينا، نشحنوها ونخلصو أوراقها. تعرف السعر قبل ما تخلص، وتتبع سيارتك من الميناء حتى للمعرض في جيجل.',
        promiseLink: 'كيف نعمل',
        facts: [
            { value: '270+', label: 'سيارة سلمناها خلال آخر 12 شهراً' },
            { value: '20+', label: 'ولاية فيها زبائن وحيد أوتو' },
            { value: '2', label: 'مصدران: كوريا الجنوبية والصين' },
            { value: '1', label: 'معرض في جيجل تشوف فيه سيارتك' }
        ],
        carsTitle: 'السيارات اللي يختاروها الدزيريين.',
        carsText: 'صور حقيقية لسيارات في كوريا. الأسعار تقريبية وتتبع سعر الصرف، والسعر النهائي يوصلك مكتوب قبل أي دفع.',
        allCars: 'كل السيارات',
        from: 'من',
        unit: 'دج',
        finderTitle: 'حدد ميزانيتك، نوريولك واش يناسبك.',
        rulesTitle: 'واش تقدر تستورد في 2026.',
        rulesNote: 'القوانين تتبدل كل عام مع قانون المالية. نتحققو من حالتك قبل الطلب.',
        rules: [
            { title: 'أقل من 3 سنوات', text: 'للمقيمين في الجزائر: سيارة واحدة كل 3 سنوات، عمرها أقل من 3 سنوات.' },
            { title: 'بنزين، هجين أو كهربائية', text: 'سيارات الديزل ممنوعة على الخواص.' },
            { title: 'امتيازات للكهربائية والهجينة', text: 'تخفيضات كبيرة في الرسوم الجمركية. نحسبوها لك بالدقة.' },
            { title: 'العودة النهائية (CCR)', text: 'للجالية: سيارة أقل من 5 سنوات معفاة من الرسوم منذ 2026.' }
        ],
        orderTitle: 'قول لنا واش تحب.',
        orderLead: 'نردو عليك في يوم عمل بعرض مفصل: سعر السيارة، الشحن، الجمركة والمصاريف.',
        promises: ['سعر نهائي مكتوب قبل الدفع', 'صور وتقرير فحص لكل سيارة', 'أخبار الشحن على الواتساب', 'الأوراق والجمركة علينا'],
        visitTitle: 'تعال شوفها في جيجل.',
        visitText: 'المعرض مفتوح، والقهوة علينا. اتصل بنا قبل ما تجي باش نحضرولك السيارات اللي تهمك.',
        whatsapp: 'راسلنا على الواتساب',
        fullName: 'الاسم الكامل',
        phone: 'رقم الهاتف',
        email: 'البريد الإلكتروني (اختياري)',
        wilaya: 'الولاية',
        selectWilaya: 'اختر الولاية',
        brand: 'العلامة',
        selectBrand: 'اختر العلامة',
        model: 'الموديل',
        selectModel: 'اختر الموديل',
        selectBrandFirst: 'اختر العلامة أولاً',
        budget: 'الميزانية',
        selectBudget: 'اختر الميزانية',
        customBudget: 'ميزانيتك',
        customBudgetPlaceholder: 'مثال: 3,500,000 دج',
        notes: 'ملاحظات (اللون، السنة، الخيارات...)',
        submit: 'أرسل الطلب',
        sending: 'جاري الإرسال...',
        successTitle: 'وصلنا طلبك.',
        successText: 'احتفظ برقم الطلب. سنتصل بك قريباً.',
        reference: 'رقم الطلب',
        trackLink: 'تتبع طلبك',
        newOrder: 'طلب جديد',
        error: 'لم يتم إرسال الطلب. تحقق من الاتصال وحاول مرة أخرى، أو راسلنا على واتساب.',
    },
    fr: {
        promise: ['Une voiture que vous choisissez.', 'Inspectée comme si c’était la nôtre.', 'Livrée au prix annoncé.'],
        promiseText: 'Nous ramenons votre voiture de Corée ou de Chine comme il faut : choisie avec vous, inspectée de près, expédiée et dédouanée. Vous connaissez le prix avant de payer et suivez votre voiture du port jusqu’au showroom de Jijel.',
        promiseLink: 'Comment ça marche',
        facts: [
            { value: '270+', label: 'voitures livrées ces 12 derniers mois' },
            { value: '20+', label: 'wilayas où vivent nos clients' },
            { value: '2', label: 'origines : Corée du Sud et Chine' },
            { value: '1', label: 'showroom à Jijel pour voir votre voiture' }
        ],
        carsTitle: 'Les voitures que les Algériens choisissent.',
        carsText: 'De vraies photos de voitures en Corée. Prix indicatifs qui suivent le taux de change ; le prix final vous arrive par écrit avant tout paiement.',
        allCars: 'Toutes les voitures',
        from: 'dès',
        unit: 'DA',
        finderTitle: 'Fixez votre budget, on vous montre ce qui vous va.',
        rulesTitle: 'Ce que vous pouvez importer en 2026.',
        rulesNote: 'Les règles changent chaque année avec la loi de finances. Nous vérifions votre cas avant la commande.',
        rules: [
            { title: 'Moins de 3 ans', text: 'Résidents en Algérie : une voiture tous les 3 ans, de moins de 3 ans.' },
            { title: 'Essence, hybride ou électrique', text: 'Le diesel est interdit aux particuliers.' },
            { title: 'Avantages électrique et hybride', text: 'Fortes réductions des droits de douane. Nous les calculons pour vous.' },
            { title: 'Retour définitif (CCR)', text: 'Pour la diaspora : moins de 5 ans, en franchise, depuis 2026.' }
        ],
        orderTitle: 'Dites-nous ce que vous cherchez.',
        orderLead: 'Réponse sous un jour ouvré avec une offre détaillée : voiture, transport, dédouanement et frais.',
        promises: ['Prix final écrit avant paiement', 'Photos et rapport d’inspection', 'Suivi d’expédition sur WhatsApp', 'Papiers et douane pris en charge'],
        visitTitle: 'Venez la voir à Jijel.',
        visitText: 'Le showroom est ouvert et le café est offert. Appelez avant de passer, nous préparons les voitures qui vous intéressent.',
        whatsapp: 'Écrire sur WhatsApp',
        fullName: 'Nom complet',
        phone: 'Téléphone',
        email: 'E-mail (facultatif)',
        wilaya: 'Wilaya',
        selectWilaya: 'Choisir la wilaya',
        brand: 'Marque',
        selectBrand: 'Choisir la marque',
        model: 'Modèle',
        selectModel: 'Choisir le modèle',
        selectBrandFirst: 'Choisissez d’abord la marque',
        budget: 'Budget',
        selectBudget: 'Choisir le budget',
        customBudget: 'Votre budget',
        customBudgetPlaceholder: 'Ex. : 3 500 000 DA',
        notes: 'Notes (couleur, année, options…)',
        submit: 'Envoyer la demande',
        sending: 'Envoi…',
        successTitle: 'Demande reçue.',
        successText: 'Gardez votre numéro de demande. Nous vous appelons bientôt.',
        reference: 'Numéro de demande',
        trackLink: 'Suivre ma demande',
        newOrder: 'Nouvelle demande',
        error: 'La demande n’est pas partie. Vérifiez votre connexion et réessayez, ou écrivez-nous sur WhatsApp.',
    }
}

const emptyForm = {
    fullName: '', phone: '', email: '', wilaya: '',
    carBrand: '', carModel: '', budget: '', customBudget: '', notes: ''
}

const PHONES = ['0557 06 04 78', '0781 66 32 01', '0672 14 73 90']
const formatDzd = (amount: number, language: 'ar' | 'fr') => new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : 'fr-DZ').format(amount)

export default function Home() {
    const { language } = useLanguage()
    const tx = copy[language]
    const location = useLocation()
    const featured = featuredModelIds.map(id => cars.find(c => c.id === id)!).filter(Boolean)

    const [formData, setFormData] = useState(emptyForm)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(false)
    const [referenceNumber, setReferenceNumber] = useState('')

    // Header links point to /#order; scroll there once the page is rendered.
    useEffect(() => {
        if (!location.hash) return
        const target = document.querySelector(location.hash)
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [location.hash])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => name === 'carBrand' ? { ...prev, carBrand: value, carModel: '' } : { ...prev, [name]: value })
    }

    const availableModels = carModelsByBrand[carBrands.find(b => b.label === formData.carBrand)?.value ?? ''] ?? []

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError(false)
        const refNumber = generateReferenceNumber()

        try {
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

            // Email to the team is a bonus; a failure here must not lose the order.
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                reference: refNumber,
                from_name: formData.fullName,
                phone: formData.phone,
                customer_email: formData.email || 'غير محدد',
                wilaya: formData.wilaya,
                car_brand: formData.carBrand,
                car_model: formData.carModel,
                budget: formData.budget === OTHER_BUDGET ? `ميزانية مخصصة: ${formData.customBudget}` : formData.budget,
                notes: formData.notes || 'لا توجد ملاحظات'
            }, EMAILJS_PUBLIC_KEY).catch(err => console.error('Email notification failed:', err))

            setReferenceNumber(refNumber)
            setFormData(emptyForm)
        } catch (err) {
            console.error('Order submission failed:', err)
            setSubmitError(true)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="home">
            <JourneyHero language={language} />

            <section className="h-sec h-promise">
                <div className="h-wrap">
                    <div className="h-promise-grid">
                        <h2>{tx.promise.map(line => <span key={line}>{line}</span>)}</h2>
                        <div className="h-promise-copy">
                            <p>{tx.promiseText}</p>
                            <Link to="/process" className="h-link">{tx.promiseLink}</Link>
                        </div>
                    </div>
                    <dl className="h-facts">
                        {tx.facts.map(f => (
                            <div key={f.label}>
                                <dt className="latin num" dir="ltr">{f.value}</dt>
                                <dd>{f.label}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section className="h-sec h-cars" style={{ paddingTop: 0 }}>
                <div className="h-wrap">
                    <div className="h-head">
                        <h2>{tx.carsTitle}</h2>
                        <p>{tx.carsText}</p>
                    </div>
                    <ul className="h-cars-grid">
                        {featured.map(car => (
                            <li key={car.id}>
                                <Link to={`/cars/${car.id}`} className="h-car">
                                    <div className="h-car-photo">
                                        <img src={`/cars/feature/${car.id}.webp`} alt={`${car.brand} ${car.model}`} loading="lazy" width={1500} height={1000} />
                                    </div>
                                    <div className="h-car-row">
                                        <span className="h-car-name"><span className="h-car-brand">{language === 'ar' ? car.brandAr : car.brand}</span> {language === 'ar' ? car.modelAr : car.model}</span>
                                        <span className="h-car-price">{tx.from} <b className="num">{formatDzd(car.priceMin, language)}</b> {tx.unit}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div style={{ marginTop: 44 }}><Link to="/cars" className="h-link">{tx.allCars}</Link></div>
                </div>
            </section>

            <section className="h-sec h-finder" style={{ paddingTop: 0 }}>
                <div className="h-wrap">
                    <div className="h-panel">
                        <div className="h-head"><h2>{tx.finderTitle}</h2></div>
                        <BudgetFinder language={language} featuredIds={featuredModelIds} />
                    </div>
                </div>
            </section>

            <section className="h-sec h-rules" style={{ paddingTop: 0 }}>
                <div className="h-wrap h-rules-grid">
                    <div>
                        <h2>{tx.rulesTitle}</h2>
                        <p>{tx.rulesNote}</p>
                    </div>
                    <ul className="h-rules-list">
                        {tx.rules.map(rule => (
                            <li key={rule.title}>
                                <h3>{rule.title}</h3>
                                <p>{rule.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ---------- ORDER ---------- */}
            <section className="h-sec h-order" id="order" style={{ paddingTop: 0 }}>
                <div className="h-wrap h-order-grid">
                    <div>
                        <h2>{tx.orderTitle}</h2>
                        <p className="lead">{tx.orderLead}</p>
                        <ul className="h-promises">
                            {tx.promises.map(promise => (
                                <li key={promise}><Check size={18} strokeWidth={1.5} /> {promise}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="order-panel">
                        {referenceNumber ? (
                            <div className="order-success" role="status">
                                <Monogram size={56} />
                                <h3>{tx.successTitle}</h3>
                                <p className="order-ref-label">{tx.reference}</p>
                                <p className="order-ref latin num" dir="ltr">{referenceNumber}</p>
                                <p className="muted">{tx.successText}</p>
                                <div className="order-success-actions">
                                    <Link to="/tracking" className="btn btn-primary">{tx.trackLink}</Link>
                                    <button className="btn btn-secondary" onClick={() => setReferenceNumber('')}>{tx.newOrder}</button>
                                </div>
                            </div>
                        ) : (
                            <form className="order-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="fullName">{tx.fullName}</label>
                                        <input id="fullName" name="fullName" className="form-input" autoComplete="name" required value={formData.fullName} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="phone">{tx.phone}</label>
                                        <input id="phone" name="phone" type="tel" dir="ltr" inputMode="tel" autoComplete="tel" className="form-input num" placeholder="05XX XX XX XX" required value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="wilaya">{tx.wilaya}</label>
                                        <select id="wilaya" name="wilaya" className="form-select" required value={formData.wilaya} onChange={handleInputChange}>
                                            <option value="">{tx.selectWilaya}</option>
                                            {wilayas.map(w => <option key={w.code} value={w.name}>{w.code} · {w.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email">{tx.email}</label>
                                        <input id="email" name="email" type="email" dir="ltr" autoComplete="email" className="form-input" value={formData.email} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="carBrand">{tx.brand}</label>
                                        <select id="carBrand" name="carBrand" className="form-select" required value={formData.carBrand} onChange={handleInputChange}>
                                            <option value="">{tx.selectBrand}</option>
                                            {carBrands.map(b => <option key={b.value} value={b.label}>{b.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="carModel">{tx.model}</label>
                                        <select id="carModel" name="carModel" className="form-select" required disabled={!formData.carBrand} value={formData.carModel} onChange={handleInputChange}>
                                            <option value="">{formData.carBrand ? tx.selectModel : tx.selectBrandFirst}</option>
                                            {availableModels.map(m => <option key={m.value} value={m.label}>{m.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="budget">{tx.budget}</label>
                                    <select id="budget" name="budget" className="form-select" required value={formData.budget} onChange={handleInputChange}>
                                        <option value="">{tx.selectBudget}</option>
                                        {budgetRanges.map(r => <option key={r.value} value={r.label}>{r.label}</option>)}
                                    </select>
                                </div>
                                {formData.budget === OTHER_BUDGET && (
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="customBudget">{tx.customBudget}</label>
                                        <input id="customBudget" name="customBudget" className="form-input" required placeholder={tx.customBudgetPlaceholder} value={formData.customBudget} onChange={handleInputChange} />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="notes">{tx.notes}</label>
                                    <textarea id="notes" name="notes" className="form-textarea" rows={3} value={formData.notes} onChange={handleInputChange} />
                                </div>
                                {submitError && <p className="form-error-message" role="alert">{tx.error}</p>}
                                <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isSubmitting}>
                                    {isSubmitting ? <><span className="spinner" /> {tx.sending}</> : tx.submit}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <section className="h-sec h-visit" style={{ paddingTop: 0 }}>
                <div className="h-wrap">
                    <div className="h-visit-grid">
                        <div className="h-visit-photo">
                            <img src="/brand/showroom-aerial.jpg" alt={language === 'ar' ? 'معرض وحيد أوتو في جيجل' : 'Le showroom Wahid Auto à Jijel'} loading="lazy" />
                        </div>
                        <div className="h-visit-copy">
                            <h2>{tx.visitTitle}</h2>
                            <p>{tx.visitText}</p>
                            <ul className="h-phones">
                                {PHONES.map(n => <li key={n}><a href={`tel:+213${n.replace(/\s/g, '').slice(1)}`}>{n}</a></li>)}
                            </ul>
                            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="h-btn">{tx.whatsapp}</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
