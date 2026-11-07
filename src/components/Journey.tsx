import { Check, FileText } from 'lucide-react'
import { SplitText } from './motion/Shell'

// "From your order to the keys in your hand": six chapters, one per step of the process.
// Each chapter is a full section: its copy card on one side and a framed live view of the
// background scene on the other (the camera frames the step inside [data-anchor]).
// Then the file: every step leaves a document with the client.

type Lang = 'ar' | 'fr'
type Step = { key: string; name: string; title: string; text: string; docs: string[]; live: string }

const copy: Record<Lang, { eyebrow: string; of: string; youGet: string; live: string; steps: Step[]; dossier: { eyebrow: string; title: string; lead: string; file: string; note: string } }> = {
    ar: {
        eyebrow: 'المراحل', of: '06', youGet: 'واش يوصلك', live: 'مباشر',
        steps: [
            { key: 'order', name: 'الطلب', title: 'تقول لنا واش تحب.\n*نردّو بسعر واضح.*', text: 'الموديل، الميزانية والولاية. نقترحو عليك سيارات حقيقية متوفرة الآن، مع السعر النهائي مكتوب قبل أي دفع.', docs: ['عرض سعر مكتوب', 'رقم ملفك'], live: 'الجزائر ← كوريا · الصين' },
            { key: 'inspect', name: 'الفحص', title: 'نفحصوها\n*بعينينا.*', text: 'شركاؤنا في الساحة يفحصو المحرك، الصبغة، الشاسي والكيلومترات الحقيقية. توصلك الصور والفيديو قبل ما تقرر.', docs: ['تقرير الفحص', 'صور وفيديو'], live: 'الساحة · كوريا' },
            { key: 'buy', name: 'الشراء', title: 'تشري بثقة.\n*والأوراق واضحة.*', text: 'بعد موافقتك نشريو السيارة ونحضّرو أوراق التصدير. كل دينار تدفعو عندو وصل.', docs: ['فاتورة الشراء', 'وثائق التصدير', 'وصولات الدفع'], live: 'ميناء التصدير' },
            { key: 'ship', name: 'الشحن', title: 'في البحر،\n*وأنت تتبعها.*', text: 'نحجزو المكان في الباخرة، نصورو التحميل ونبعثولك رقم الشحنة. تتبع سيارتك من صفحة التتبع في الموقع.', docs: ['بوليصة الشحن', 'رقم التتبع', 'صور التحميل'], live: 'في البحر' },
            { key: 'customs', name: 'الجمارك', title: 'نخلّصو الجمارك.\n*بلا ما تتعب.*', text: 'التفريغ في الميناء، التصريح الجمركي والحقوق حسب القانون. نتابعو الملف حتى تخرج السيارة.', docs: ['التصريح الجمركي', 'وصل الحقوق'], live: 'ميناء الجزائر · الجمارك' },
            { key: 'keys', name: 'المفاتيح', title: 'المفاتيح\n*في يدك.*', text: 'تستلم سيارتك في معرضنا بجيجل ولا نوصلوهالك لولايتك، مع الملف الكامل تاعها.', docs: ['ملف السيارة الكامل', 'المفاتيح'], live: 'جيجل · دارك' },
        ],
        dossier: { eyebrow: 'كل شيء موثّق', title: 'ملف واحد.\n*كل خطوة فيه.*', lead: 'من أول رسالة حتى المفاتيح، كل مرحلة تخلي عندك وثيقة. تعرف وين راهي سيارتك، وشحال خلصت، وواش باقي.', file: 'ملف السيارة · رقم WA-2026', note: 'مثال توضيحي' },
    },
    fr: {
        eyebrow: 'Les étapes', of: '06', youGet: 'Ce que vous recevez', live: 'En direct',
        steps: [
            { key: 'order', name: 'Commande', title: 'Dites-nous ce que vous voulez.\n*On répond avec un prix clair.*', text: 'Modèle, budget, wilaya. Nous proposons de vraies voitures disponibles, avec le prix final écrit avant tout paiement.', docs: ['Devis écrit', 'Numéro de dossier'], live: 'Algérie → Corée · Chine' },
            { key: 'inspect', name: 'Inspection', title: 'Inspectée\n*sur place.*', text: 'Nos partenaires vérifient moteur, peinture, châssis et kilométrage réel. Vous recevez photos et vidéo avant de décider.', docs: ['Rapport d’inspection', 'Photos et vidéo'], live: 'Parc · Corée' },
            { key: 'buy', name: 'Achat', title: 'Vous achetez en confiance.\n*Papiers en règle.*', text: 'Après votre accord, nous achetons la voiture et préparons les documents d’export. Chaque paiement a son reçu.', docs: ['Facture d’achat', 'Documents d’export', 'Reçus de paiement'], live: 'Port d’export' },
            { key: 'ship', name: 'Expédition', title: 'En mer,\n*et vous suivez.*', text: 'Nous réservons la place, photographions le chargement et vous envoyons le numéro d’expédition. Suivez-la depuis la page de suivi.', docs: ['Connaissement (B/L)', 'Numéro de suivi', 'Photos du chargement'], live: 'En mer' },
            { key: 'customs', name: 'Douane', title: 'Le dédouanement.\n*Sans vous fatiguer.*', text: 'Déchargement au port, déclaration en douane et droits selon la loi. Nous suivons le dossier jusqu’à la sortie.', docs: ['Déclaration en douane', 'Quittance des droits'], live: 'Port · Douane' },
            { key: 'keys', name: 'Les clés', title: 'Les clés\n*dans votre main.*', text: 'Vous récupérez votre voiture à notre showroom de Jijel, ou nous la livrons dans votre wilaya, avec son dossier complet.', docs: ['Dossier complet du véhicule', 'Les clés'], live: 'Jijel · Chez vous' },
        ],
        dossier: { eyebrow: 'Tout est documenté', title: 'Un seul dossier.\n*Chaque étape dedans.*', lead: 'Du premier message aux clés, chaque étape vous laisse un document. Vous savez où est votre voiture, ce que vous avez payé et ce qui reste.', file: 'Dossier véhicule · N° WA-2026', note: 'Exemple illustratif' },
    },
}

export default function Journey({ language }: { language: Lang }) {
    const tx = copy[language]
    return (
        <>
            {tx.steps.map((step, i) => (
                <section key={step.key} className={`journey-step ${i % 2 ? 'is-flipped' : ''}`} data-tone={i % 2 ? 'light' : 'dark'} data-scene={step.key} id={`step-${step.key}`}>
                    <div className="journey-grid">
                        <div className="journey-copy" data-reveal>
                            <div className="journey-num"><span className="latin num">{String(i + 1).padStart(2, '0')}</span><i /><span className="latin num">{tx.of}</span></div>
                            <p className="eyebrow">{tx.eyebrow} · {step.name}</p>
                            <SplitText className="journey-title" text={step.title} />
                            <p className="journey-text">{step.text}</p>
                            <div className="journey-docs">
                                <span className="journey-docs-label">{tx.youGet}</span>
                                <ul>{step.docs.map(d => <li key={d}><Check size={14} strokeWidth={2.5} /> {d}</li>)}</ul>
                            </div>
                        </div>
                        <div className="scene-window" data-anchor aria-hidden="true">
                            <span className="sw-corner tl" /><span className="sw-corner tr" /><span className="sw-corner bl" /><span className="sw-corner br" />
                            <span className="sw-label"><span className="live-dot" /> {tx.live} · <b>{step.live}</b></span>
                        </div>
                    </div>
                </section>
            ))}

            <section className="journey-dossier" data-tone="dark" data-scene="all">
                <div className="journey-grid">
                    <div className="journey-copy is-plain" data-reveal>
                        <p className="eyebrow"><span className="live-dot" /> {tx.dossier.eyebrow}</p>
                        <SplitText className="journey-title" text={tx.dossier.title} />
                        <p className="journey-text">{tx.dossier.lead}</p>
                    </div>
                    <div className="dossier-card" data-reveal>
                        <div className="dossier-head"><FileText size={18} /><span>{tx.dossier.file}</span><small>{tx.dossier.note}</small></div>
                        <ol>
                            {tx.steps.map((step, i) => (
                                <li key={step.key} style={{ transitionDelay: `${i * 90}ms` }}>
                                    <span className="latin num">{String(i + 1).padStart(2, '0')}</span>
                                    <div><b>{step.name}</b><small>{step.docs.join(' · ')}</small></div>
                                    <i><Check size={14} strokeWidth={3} /></i>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>
        </>
    )
}
