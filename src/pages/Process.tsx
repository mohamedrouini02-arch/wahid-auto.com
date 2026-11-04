import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CtaBand, PageHero } from '../components/PageParts'
import { useLanguage } from '../context/LanguageContext'

const copy = {
    ar: {
        eyebrow: 'كيف نعمل',
        title: 'من أول رسالة حتى المفتاح في يدك.',
        lead: 'ست مراحل واضحة. في كل مرحلة تعرف وين راهي سيارتك وشحال باقي.',
        steps: [
            { title: 'تواصل معنا', text: 'قل لنا الموديل، السنة، اللون والميزانية. على واتساب أو من الموقع.', meta: '1 إلى 3 أيام' },
            { title: 'نقترح سيارات حقيقية', text: 'نبعثلك سيارات متوفرة فعلاً في كوريا أو الصين مع الصور والكيلومترات.', meta: '1 إلى 2 أيام' },
            { title: 'الفحص والعرض النهائي', text: 'نفحص السيارة ونبعثلك التقرير، مع السعر النهائي المكتوب.', meta: 'قبل أي دفع' },
            { title: 'العربون والشراء', text: 'تدفع العربون، نشتري السيارة باسمك ونحضر الوثائق.', meta: 'عقد مكتوب' },
            { title: 'الشحن', text: 'السيارة تركب الباخرة (RoRo أو حاوية). نبعثلك التحديثات على واتساب.', meta: '25 إلى 35 يوماً' },
            { title: 'الجمركة والتسليم', text: 'نرافقك في الجمركة والأوراق حتى تستلم السيارة.', meta: 'جاهزة للطريق' }
        ],
        docsTitle: 'الوثائق المطلوبة',
        docsLead: 'جهزها من البداية باش ما تتعطلش.',
        upload: 'ارفع وثائقك',
        docs: ['بطاقة التعريف الوطنية', 'جواز السفر', 'شهادة الإقامة', 'رخصة السياقة'],
        faqTitle: 'أسئلة متكررة',
        faq: [
            { q: 'شحال تاخذ السيارة باش توصل؟', a: 'المدة الإجمالية من 30 إلى 45 يوماً تقريباً: الشراء، الشحن (25 إلى 35 يوماً) والجمركة.' },
            { q: 'واش الرسوم الجمركية داخلة في السعر؟', a: 'نعطيك تقدير واضح للرسوم قبل الطلب. الرسوم الرسمية تدفع للجمارك وتتغير مع قانون المالية.' },
            { q: 'واش نقدر نستورد سيارة ديزل؟', a: 'لا. منذ القوانين الحالية، الخواص يستوردو فقط بنزين، هجين أو كهربائية، وعمرها أقل من 3 سنوات.' },
            { q: 'كيفاش نعرف بلي السيارة في حالة مليحة؟', a: 'نبعثلك صور وفيديو وتقرير فحص قبل الشراء. ما تدفعش حتى تقتنع.' },
            { q: 'واش فلوسي في أمان؟', a: 'كل شيء بعقد مكتوب. إذا ما وصلتش السيارة بسببنا، نرجعولك كامل المبلغ.' }
        ]
    },
    fr: {
        eyebrow: 'Comment ça marche',
        title: 'Du premier message aux clés en main.',
        lead: 'Six étapes claires. À chaque étape, vous savez où est votre voiture et ce qu’il reste.',
        steps: [
            { title: 'Contactez-nous', text: 'Modèle, année, couleur et budget. Par WhatsApp ou sur le site.', meta: '1 à 3 jours' },
            { title: 'De vraies propositions', text: 'Des voitures réellement disponibles en Corée ou en Chine, avec photos et kilométrage.', meta: '1 à 2 jours' },
            { title: 'Inspection et offre finale', text: 'Rapport d’inspection et prix final écrit.', meta: 'Avant tout paiement' },
            { title: 'Acompte et achat', text: 'Vous versez l’acompte, nous achetons et préparons les documents.', meta: 'Contrat écrit' },
            { title: 'Expédition', text: 'La voiture embarque (RoRo ou conteneur). Mises à jour sur WhatsApp.', meta: '25 à 35 jours' },
            { title: 'Douane et livraison', text: 'Nous vous accompagnons pour la douane et les papiers.', meta: 'Prête à rouler' }
        ],
        docsTitle: 'Documents à préparer',
        docsLead: 'Préparez-les dès le départ pour éviter tout retard.',
        upload: 'Envoyer vos documents',
        docs: ['Carte d’identité nationale', 'Passeport', 'Certificat de résidence', 'Permis de conduire'],
        faqTitle: 'Questions fréquentes',
        faq: [
            { q: 'Combien de temps pour la livraison ?', a: 'Environ 30 à 45 jours au total : achat, transport maritime (25 à 35 jours) et dédouanement.' },
            { q: 'Les droits de douane sont-ils inclus ?', a: 'Nous donnons une estimation claire avant la commande. Les droits officiels sont payés à la douane et suivent la loi de finances.' },
            { q: 'Puis-je importer un diesel ?', a: 'Non. Les particuliers importent uniquement essence, hybride ou électrique, de moins de 3 ans.' },
            { q: 'Comment savoir si la voiture est en bon état ?', a: 'Photos, vidéo et rapport d’inspection avant l’achat. Vous ne payez pas avant d’être convaincu.' },
            { q: 'Mon argent est-il protégé ?', a: 'Tout est sous contrat écrit. Si la voiture n’arrive pas par notre faute, remboursement intégral.' }
        ]
    }
}

export default function Process() {
    const { language } = useLanguage()
    const tx = copy[language]

    return (
        <div className="process-page">
            <PageHero eyebrow={tx.eyebrow} title={tx.title} lead={tx.lead} />

            <section className="section">
                <div className="container split" style={{ alignItems: 'start' }}>
                    <ol className="timeline" data-reveal>
                        {tx.steps.map((step, i) => (
                            <li className="timeline-item" key={step.title}>
                                <span className="timeline-dot num">{String(i + 1).padStart(2, '0')}</span>
                                <div>
                                    <h3>{step.title}</h3>
                                    <p>{step.text}</p>
                                    <span className="timeline-meta">{step.meta}</span>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <aside className="form-panel docs-panel" style={{ position: 'sticky', top: 'calc(var(--header-h) + 24px)' }} data-reveal>
                        <h2 className="section-title" style={{ fontSize: '1.6rem' }}>{tx.docsTitle}</h2>
                        <p className="muted">{tx.docsLead}</p>
                        <ul className="check-list">
                            {tx.docs.map(d => <li key={d}><Check size={18} strokeWidth={1.5} />{d}</li>)}
                        </ul>
                        <Link to="/documents" className="btn btn-primary">{tx.upload}</Link>
                    </aside>
                </div>
            </section>

            <section className="section" style={{ background: 'var(--paper-2)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{tx.faqTitle}</h2>
                    </div>
                    <div className="faq" data-reveal>
                        {tx.faq.map(item => (
                            <details key={item.q}>
                                <summary>{item.q}</summary>
                                <p>{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <CtaBand />
        </div>
    )
}
