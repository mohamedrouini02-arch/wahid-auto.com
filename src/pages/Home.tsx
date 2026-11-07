import emailjs from '@emailjs/browser'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BudgetFinder from '../components/BudgetFinder'
import { ScrubText, SplitText } from '../components/motion/Shell'
import { Monogram } from '../components/Logo'
import Journey from '../components/Journey'
import PhotoHero from '../components/PhotoHero'
import StockBento from '../components/StockBento'
import { featuredModelIds, site } from '../config/site'
import { useLanguage } from '../context/LanguageContext'
import { budgetRanges, carBrands, carModelsByBrand, wilayas } from '../data/wilayas'
import { useCountUp, useScrollReveal } from '../lib/motion'
import { generateReferenceNumber, supabase } from '../lib/supabase'
import './Home.css'

// EmailJS: notifies the team by email when an order comes in.
const EMAILJS_SERVICE_ID = 'service_u8c498u'
const EMAILJS_TEMPLATE_ID = 'template_iftksee'
const EMAILJS_PUBLIC_KEY = 'jXCdC22u9FmNvH_Yz'
const OTHER_BUDGET = 'أخرى (حدد الميزانية)'

const copy = {
    ar: {
        heroEyebrow: 'من كوريا والصين إلى الجزائر',
        heroTitle: 'سيارتك الجاية من كوريا والصين،\nبسعر واضح من النهار الأول.',
        heroLead: 'نختارو السيارة معاك، نفحصوها، نشحنوها ونتكفلو بالأوراق. تعرف السعر النهائي قبل ما تخلص.',
        heroOrder: 'اطلب سيارتك',
        heroLines: 'من طلبك\nحتى المفاتيح\n*في يدك.*',
        metaLeft: 'من كوريا والصين إلى الجزائر', metaMid: '6 مراحل · كل شيء واضح وموثّق', metaRight: 'وحيد أوتو / 01',
        tagTitle: 'نفحصوها بعينينا.', tagText: 'صور وتقرير قبل ما تخلص.',
        heroNotes: ['كيا', 'هيونداي', 'رينو', 'جيلي'],
        flow: [['buy', 'الشراء'], ['ship', 'الشحن'], ['customs', 'الجمارك'], ['keys', 'المفاتيح']] as [string, string][],
        statement: ['طلب واحد.', 'من الطلب حتى المفاتيح.', 'كل شيء واضح.', 'وكل شيء موثّق.'],
        scrollHint: 'مرّر',
        manifestoEyebrow: 'وحيد أوتو',
        manifesto: 'نجيبولك سيارتك من كوريا ولا الصين كيما لازم: نختاروها معاك، نفحصوها بعينينا، نشحنوها ونخلصو أوراقها. أنت تعرف السعر قبل ما تخلص، وتتبع سيارتك من الميناء حتى لباب دارك.',
        galleryEyebrow: 'الأكثر طلباً',
        galleryTitle: 'السيارات اللي\n*يختاروها الدزيريين.*',
        megaCta: 'نبداو؟',
        heroCars: 'السيارات المتوفرة',
        facts: [
            { value: 270, suffix: '+', label: 'سيارة سلمناها خلال آخر 12 شهراً' },
            { value: 20, suffix: '+', label: 'ولاية فيها زبائن وحيد أوتو' },
            { value: 2, suffix: '', label: 'مصدران: كوريا الجنوبية والصين' }
        ],
        stepsEyebrow: 'كيف نعمل',
        stepsTitle: 'أربع خطوات.\n*لا مفاجآت.*',
        steps: [
            { title: 'اختر', text: 'قل لنا الموديل والميزانية. نقترح عليك سيارات حقيقية متوفرة الآن.' },
            { title: 'نفحص', text: 'نفحص السيارة في كوريا أو الصين ونرسل لك الصور والتقرير قبل الشراء.' },
            { title: 'نشحن', text: 'نشحن السيارة ونرسل لك تحديثات حتى وصولها إلى الميناء.' },
            { title: 'تستلم', text: 'نتكفل بالجمركة والأوراق، وتستلم سيارتك جاهزة.' }
        ],
        modelsEyebrow: 'ابحث عن سيارتك',
        modelsTitle: 'حرّك الميزانية،\n*شاهد ما يناسبك.*',
        map: { korea: 'كوريا', china: 'الصين', algeria: 'الجزائر' },
        roadsEyebrow: 'طريقان، وجهة واحدة',
        roadsTitle: 'من سيول وشنغهاي\n*إلى باب دارك.*',
        roadsLead: 'شركاء على الأرض في كوريا والصين، ومعرض في جيجل. اضغط على أي بلد لترى طريقه.',
        modelsLead: 'الأسعار تقريبية وتتغير مع سعر الصرف. نرسل لك السعر النهائي قبل أي دفع.',
        allCars: 'كل السيارات',
        rulesEyebrow: 'قوانين الاستيراد 2026',
        rulesTitle: 'ما يمكنك استيراده هذا العام.',
        rules: [
            { title: 'أقل من 3 سنوات', text: 'للمقيمين في الجزائر: سيارة واحدة كل 3 سنوات، عمرها أقل من 3 سنوات.' },
            { title: 'بنزين، هجين أو كهربائية', text: 'سيارات الديزل ممنوعة على الخواص.' },
            { title: 'امتيازات للكهربائية والهجينة', text: 'تخفيضات كبيرة في الرسوم الجمركية. نحسبها لك بدقة.' },
            { title: 'العودة النهائية (CCR)', text: 'للجالية: سيارة أقل من 5 سنوات معفاة من الرسوم منذ 2026.' }
        ],
        rulesNote: 'القوانين تتغير كل سنة مع قانون المالية. نتحقق من حالتك قبل الطلب.',
        orderEyebrow: 'اطلب الآن',
        orderTitle: 'أخبرنا بما تريد.',
        orderLead: 'نرد عليك خلال يوم عمل بعرض مفصل: سعر السيارة، الشحن، الجمركة والمصاريف.',
        promises: ['سعر نهائي مكتوب قبل الدفع', 'صور وتقرير فحص لكل سيارة', 'تحديثات الشحن على واتساب', 'الأوراق والجمركة علينا'],
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
        closingTitle: 'تفضل الحديث مباشرة؟',
        closingLead: 'راسلنا على واتساب وسنجيبك بالسعر الحالي لأي موديل.',
        whatsapp: 'راسلنا على واتساب'
    },
    fr: {
        heroEyebrow: 'De Corée et de Chine vers l’Algérie',
        heroTitle: 'Votre prochaine voiture,\nau prix clair dès le premier jour.',
        heroLead: 'Nous choisissons la voiture avec vous, l’inspectons, l’expédions et gérons les papiers. Vous connaissez le prix final avant de payer.',
        heroOrder: 'Commander',
        heroLines: 'De votre commande\naux clés\n*dans votre main.*',
        metaLeft: 'Corée · Chine → Algérie', metaMid: '6 étapes · tout est clair et documenté', metaRight: 'Wahid Auto / 01',
        tagTitle: 'Inspectée sur place.', tagText: 'Photos et rapport avant de payer.',
        heroNotes: ['Kia', 'Hyundai', 'Renault', 'Geely'],
        flow: [['buy', 'Achat'], ['ship', 'Mer'], ['customs', 'Douane'], ['keys', 'Clés']] as [string, string][],
        statement: ['Une commande.', 'De la demande aux clés.', 'Tout est clair.', 'Tout est documenté.'],
        scrollHint: 'Défiler',
        manifestoEyebrow: 'Wahid Auto',
        manifesto: 'Nous ramenons votre voiture de Corée ou de Chine comme il faut : choisie avec vous, inspectée de près, expédiée et dédouanée. Vous connaissez le prix avant de payer et suivez votre voiture du port jusqu’à chez vous.',
        galleryEyebrow: 'Les plus demandées',
        galleryTitle: 'Les voitures que\n*les Algériens choisissent.*',
        megaCta: 'On commence ?',
        heroCars: 'Voitures disponibles',
        facts: [
            { value: 270, suffix: '+', label: 'voitures livrées ces 12 derniers mois' },
            { value: 20, suffix: '+', label: 'wilayas où vivent nos clients' },
            { value: 2, suffix: '', label: 'origines : Corée du Sud et Chine' }
        ],
        stepsEyebrow: 'Comment ça marche',
        stepsTitle: 'Quatre étapes.\n*Aucune surprise.*',
        steps: [
            { title: 'Choisir', text: 'Donnez-nous le modèle et le budget. Nous proposons de vraies voitures disponibles.' },
            { title: 'Inspecter', text: 'Nous inspectons la voiture en Corée ou en Chine et vous envoyons photos et rapport avant l’achat.' },
            { title: 'Expédier', text: 'Nous expédions la voiture et vous tenons informé jusqu’au port.' },
            { title: 'Recevoir', text: 'Nous gérons le dédouanement et les papiers. Vous recevez une voiture prête.' }
        ],
        modelsEyebrow: 'Trouver votre voiture',
        modelsTitle: 'Bougez le budget,\n*voyez ce qui vous va.*',
        map: { korea: 'Corée', china: 'Chine', algeria: 'Algérie' },
        roadsEyebrow: 'Deux routes, une destination',
        roadsTitle: 'De Séoul et Shanghai\n*jusqu’à chez vous.*',
        roadsLead: 'Des partenaires sur place en Corée et en Chine, un showroom à Jijel. Touchez un pays pour voir sa route.',
        modelsLead: 'Prix indicatifs, ils suivent le taux de change. Vous recevez le prix final avant tout paiement.',
        allCars: 'Toutes les voitures',
        rulesEyebrow: 'Règles d’importation 2026',
        rulesTitle: 'Ce que vous pouvez importer cette année.',
        rules: [
            { title: 'Moins de 3 ans', text: 'Résidents en Algérie : une voiture tous les 3 ans, de moins de 3 ans.' },
            { title: 'Essence, hybride ou électrique', text: 'Le diesel est interdit aux particuliers.' },
            { title: 'Avantages électrique et hybride', text: 'Fortes réductions des droits de douane. Nous les calculons pour vous.' },
            { title: 'Retour définitif (CCR)', text: 'Pour la diaspora : moins de 5 ans, en franchise, depuis 2026.' }
        ],
        rulesNote: 'Les règles changent chaque année avec la loi de finances. Nous vérifions votre cas avant la commande.',
        orderEyebrow: 'Commander',
        orderTitle: 'Dites-nous ce que vous cherchez.',
        orderLead: 'Réponse sous un jour ouvré avec une offre détaillée : voiture, transport, dédouanement et frais.',
        promises: ['Prix final écrit avant paiement', 'Photos et rapport d’inspection', 'Suivi d’expédition sur WhatsApp', 'Papiers et douane pris en charge'],
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
        closingTitle: 'Vous préférez parler directement ?',
        closingLead: 'Écrivez-nous sur WhatsApp, nous répondons avec le prix actuel de n’importe quel modèle.',
        whatsapp: 'Écrire sur WhatsApp'
    }
}

const emptyForm = {
    fullName: '', phone: '', email: '', wilaya: '',
    carBrand: '', carModel: '', budget: '', customBudget: '', notes: ''
}

const brands = ['KIA', 'HYUNDAI', 'RENAULT', 'CHEVROLET', 'GEELY', 'MG', 'CHERY', 'BYD', 'LIVAN', 'GAC']

const Fact = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
    const { ref, value: shown } = useCountUp(value)
    return (
        <div className="fact">
            <dt className="fact-value latin num" ref={ref}>{shown}{suffix}</dt>
            <dd className="fact-label">{label}</dd>
        </div>
    )
}

export default function Home() {
    const { language, isRTL } = useLanguage()
    const tx = copy[language]
    const location = useLocation()
    useScrollReveal()

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
            <PhotoHero language={language} isRTL={isRTL} />

            <StockBento language={language} isRTL={isRTL} />

            <section className="statement" data-tone="dark" data-scene="sea" aria-label={tx.statement.join(' ')}>
                <div className="marquee-track" aria-hidden="true">
                    {[0, 1].map(k => (
                        <div className="marquee-group" key={k}>
                            <span>{tx.statement[0]}</span><i className="orb" />
                            <strong>{tx.statement[1]}</strong><i className="orb" />
                            <span>{tx.statement[2]}</span><i className="orb" />
                            <em>{tx.statement[3]}</em><i className="orb" />
                        </div>
                    ))}
                </div>
            </section>

            <Journey language={language} />

            {/* ---------- MANIFESTO ---------- */}
            <section className="section manifesto" data-tone="dark" data-scene="quiet">
                <div className="container">
                    <p className="eyebrow">{tx.manifestoEyebrow}</p>
                    <ScrubText text={tx.manifesto} />
                    <dl className="facts">
                        {tx.facts.map(fact => <Fact key={fact.label} {...fact} />)}
                    </dl>
                </div>
            </section>

            <div className="marquee" aria-hidden="true">
                <div className="marquee-track latin">
                    {[...brands, ...brands].map((brand, i) => <span key={i}>{brand}</span>)}
                </div>
            </div>

            {/* ---------- BUDGET FINDER ---------- */}
            <section className="section models" data-tone="light" data-scene="quiet">
                <div className="container">
                    <div className="section-header">
                        <p className="eyebrow">{tx.modelsEyebrow}</p>
                        <SplitText className="section-title" text={tx.modelsTitle} />
                        <p className="section-subtitle">{tx.modelsLead}</p>
                    </div>
                    <BudgetFinder language={language} featuredIds={featuredModelIds} />
                </div>
            </section>

            {/* ---------- RULES ---------- */}
            <section className="section rules" data-tone="light" data-scene="quiet">
                <div className="container rules-grid">
                    <div className="section-header">
                        <p className="eyebrow">{tx.rulesEyebrow}</p>
                        <h2 className="section-title">{tx.rulesTitle}</h2>
                        <p className="section-subtitle">{tx.rulesNote}</p>
                    </div>
                    <ul className="rules-list" data-reveal>
                        {tx.rules.map(rule => (
                            <li key={rule.title}>
                                <h3 className="rule-title">{rule.title}</h3>
                                <p className="rule-text">{rule.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ---------- ORDER ---------- */}
            <section className="section order" id="order" data-tone="dark" data-scene="order">
                <div className="container order-grid">
                    <div className="order-intro">
                        <div className="section-header">
                            <p className="eyebrow">{tx.orderEyebrow}</p>
                            <h2 className="section-title" data-speed="-0.05">{tx.orderTitle}</h2>
                            <p className="section-subtitle">{tx.orderLead}</p>
                        </div>
                        <ul className="promises">
                            {tx.promises.map(promise => (
                                <li key={promise}><Check size={18} strokeWidth={1.5} /> {promise}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="order-panel" data-reveal>
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

            {/* ---------- MEGA CTA ---------- */}
            <section className="closing" data-tone="dark" data-scene="all">
                <div className="container">
                    <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="mega-cta">
                        <span className="mega-cta-label">{tx.megaCta}</span>
                        <span className="mega-cta-sub">{tx.closingLead}</span>
                    </a>
                </div>
            </section>
        </div>
    )
}
