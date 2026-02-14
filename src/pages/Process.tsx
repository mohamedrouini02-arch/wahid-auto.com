import {
    CheckCircle,
    ChevronDown,
    CreditCard,
    FileCheck,
    HelpCircle,
    Phone,
    Search,
    Ship,
    Truck
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Process.css'

export default function Process() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const { language, isRTL } = useLanguage()

    const text = {
        ar: {
            heroTag: 'كيف نعمل',
            heroTitle: 'عملية الاستيراد',
            heroSubtitle: 'خطوات بسيطة وشفافة من الاختيار حتى التسليم',
            step1Title: 'اختيار السيارة',
            step1Desc: 'تصفح مجموعتنا الواسعة أو أخبرنا بالسيارة التي تريدها. نوفر لك صور حقيقية وتقرير فحص كامل.',
            step1Duration: '1-3 أيام',
            step1Detail1: 'تصفح الكتالوج أو طلب سيارة محددة',
            step1Detail2: 'نرسل لك صور حقيقية للسيارة',
            step1Detail3: 'تقرير فحص كامل قبل الشراء',
            step2Title: 'عرض السعر والاتفاق',
            step2Desc: 'نقدم لك عرض سعر شامل يتضمن سعر السيارة والشحن والجمارك بدون رسوم مخفية.',
            step2Duration: '1-2 أيام',
            step2Detail1: 'عرض سعر شامل وشفاف',
            step2Detail2: 'يشمل سعر السيارة + الشحن + الجمارك',
            step2Detail3: 'بدون رسوم مخفية',
            step3Title: 'الشحن البحري',
            step3Desc: 'شحن السيارة عبر البحر من كوريا (25-35 يوم) مع إمكانية تتبع الشحنة.',
            step3Duration: '25-35 يوم',
            step3Detail1: 'شحن بحري مؤمن',
            step3Detail2: 'تتبع الشحنة لحظة بلحظة',
            step3Detail3: 'تأمين شامل أثناء النقل',
            step4Title: 'التخليص الجمركي',
            step4Desc: 'نتولى جميع إجراءات التخليص الجمركي نيابة عنك.',
            step4Duration: '5-7 أيام',
            step4Detail1: 'نتولى جميع الإجراءات الجمركية',
            step4Detail2: 'تسوية الرسوم والضرائب',
            step4Detail3: 'استخراج كل الوثائق المطلوبة',
            step5Title: 'التسليم',
            step5Desc: 'توصيل السيارة لباب منزلك مع جميع الوثائق الرسمية.',
            step5Duration: '1-3 أيام',
            step5Detail1: 'توصيل السيارة لباب المنزل',
            step5Detail2: 'تسليم جميع الوثائق الرسمية',
            step5Detail3: 'فحص نهائي مع العميل',
            paymentTag: 'الدفع',
            paymentTitle: 'طرق الدفع المتاحة',
            bankName: 'تحويل بنكي',
            bankDesc: 'تحويل مباشر إلى حسابنا البنكي',
            ccpName: 'CCP / بريد الجزائر',
            ccpDesc: 'دفع عبر الحساب البريدي',
            cashName: 'نقداً',
            cashDesc: 'دفع نقدي عند الاتفاق',
            docsTag: 'الوثائق',
            docsTitle: 'الوثائق المطلوبة',
            docsSubtitle: 'جهز هذه الوثائق لتسريع عملية الاستيراد',
            doc1: 'بطاقة التعريف الوطنية',
            doc2: 'جواز السفر',
            doc3: 'شهادة الإقامة',
            doc4: 'رخصة السياقة',
            doc5: 'شهادة الميلاد',
            docsUpload: 'رفع الوثائق',
            faqTag: 'أسئلة شائعة',
            faqTitle: 'الأسئلة الشائعة',
            faq1Q: 'ما هي تكلفة الاستيراد الإجمالية؟',
            faq1A: 'التكلفة تشمل سعر السيارة + الشحن + الجمارك + التوصيل. نقدم عرض سعر شامل بدون رسوم مخفية.',
            faq2Q: 'كم من الوقت يستغرق الاستيراد؟',
            faq2A: 'المدة الإجمالية من 30 إلى 45 يوم تقريباً، تشمل الشراء والشحن والتخليص الجمركي.',
            faq3Q: 'هل يمكنني اختيار أي سيارة؟',
            faq3A: 'نعم، يمكنك اختيار أي سيارة متاحة في السوق الكوري أو الصيني. كما يمكننا البحث عن سيارة محددة حسب طلبك.',
            faq4Q: 'ما هي الضمانات المقدمة؟',
            faq4A: 'نقدم تقرير فحص كامل لكل سيارة + ضمان على الحالة الميكانيكية + تأمين الشحن.',
            faq5Q: 'هل يمكنني تتبع شحنتي؟',
            faq5A: 'نعم، نوفر خدمة تتبع الشحنة لحظة بلحظة عبر موقعنا. يمكنك استخدام رقم المرجع الخاص بك.',
            ctaTitle: 'جاهز للبدء؟',
            ctaSubtitle: 'تواصل معنا اليوم وابدأ رحلة استيراد سيارة أحلامك',
            ctaWhatsapp: 'تواصل عبر واتساب',
            ctaCall: 'اتصل بنا'
        },
        fr: {
            heroTag: 'Comment ça marche',
            heroTitle: 'Processus d\'importation',
            heroSubtitle: 'Des étapes simples et transparentes du choix à la livraison',
            step1Title: 'Choix du véhicule',
            step1Desc: 'Parcourez notre large collection ou dites-nous quelle voiture vous souhaitez. Nous vous fournissons des photos réelles et un rapport d\'inspection complet.',
            step1Duration: '1-3 jours',
            step1Detail1: 'Parcourir le catalogue ou demander un véhicule spécifique',
            step1Detail2: 'Nous vous envoyons des photos réelles',
            step1Detail3: 'Rapport d\'inspection complet avant achat',
            step2Title: 'Devis et accord',
            step2Desc: 'Nous vous fournissons un devis complet incluant le prix de la voiture, l\'expédition et les douanes sans frais cachés.',
            step2Duration: '1-2 jours',
            step2Detail1: 'Devis complet et transparent',
            step2Detail2: 'Inclut prix voiture + expédition + douane',
            step2Detail3: 'Sans frais cachés',
            step3Title: 'Transport maritime',
            step3Desc: 'Expédition de la voiture par mer depuis la Corée (25-35 jours) avec suivi en temps réel.',
            step3Duration: '25-35 jours',
            step3Detail1: 'Transport maritime assuré',
            step3Detail2: 'Suivi en temps réel',
            step3Detail3: 'Assurance complète pendant le transport',
            step4Title: 'Dédouanement',
            step4Desc: 'Nous prenons en charge toutes les procédures de dédouanement pour vous.',
            step4Duration: '5-7 jours',
            step4Detail1: 'Nous gérons toutes les procédures douanières',
            step4Detail2: 'Règlement des droits et taxes',
            step4Detail3: 'Obtention de tous les documents requis',
            step5Title: 'Livraison',
            step5Desc: 'Livraison de la voiture à votre porte avec tous les documents officiels.',
            step5Duration: '1-3 jours',
            step5Detail1: 'Livraison à domicile',
            step5Detail2: 'Remise de tous les documents officiels',
            step5Detail3: 'Inspection finale avec le client',
            paymentTag: 'Paiement',
            paymentTitle: 'Modes de paiement disponibles',
            bankName: 'Virement bancaire',
            bankDesc: 'Virement direct sur notre compte bancaire',
            ccpName: 'CCP / Algérie Poste',
            ccpDesc: 'Paiement via compte postal',
            cashName: 'Espèces',
            cashDesc: 'Paiement en espèces à l\'accord',
            docsTag: 'Documents',
            docsTitle: 'Documents requis',
            docsSubtitle: 'Préparez ces documents pour accélérer l\'importation',
            doc1: 'Carte d\'identité nationale',
            doc2: 'Passeport',
            doc3: 'Certificat de résidence',
            doc4: 'Permis de conduire',
            doc5: 'Acte de naissance',
            docsUpload: 'Télécharger les documents',
            faqTag: 'FAQ',
            faqTitle: 'Questions fréquentes',
            faq1Q: 'Quel est le coût total d\'importation?',
            faq1A: 'Le coût comprend le prix de la voiture + expédition + douane + livraison. Nous fournissons un devis complet sans frais cachés.',
            faq2Q: 'Combien de temps prend l\'importation?',
            faq2A: 'La durée totale est d\'environ 30 à 45 jours, incluant l\'achat, l\'expédition et le dédouanement.',
            faq3Q: 'Puis-je choisir n\'importe quelle voiture?',
            faq3A: 'Oui, vous pouvez choisir toute voiture disponible sur le marché coréen ou chinois. Nous pouvons aussi rechercher un modèle spécifique.',
            faq4Q: 'Quelles sont les garanties offertes?',
            faq4A: 'Nous offrons un rapport d\'inspection complet + garantie mécanique + assurance d\'expédition.',
            faq5Q: 'Puis-je suivre mon envoi?',
            faq5A: 'Oui, nous offrons un suivi en temps réel via notre site. Vous pouvez utiliser votre numéro de référence.',
            ctaTitle: 'Prêt à commencer?',
            ctaSubtitle: 'Contactez-nous aujourd\'hui et commencez le voyage vers la voiture de vos rêves',
            ctaWhatsapp: 'Contactez via WhatsApp',
            ctaCall: 'Appelez-nous'
        }
    }

    const tx = text[language]

    const steps = [
        { step: 1, icon: Search, title: tx.step1Title, desc: tx.step1Desc, duration: tx.step1Duration, details: [tx.step1Detail1, tx.step1Detail2, tx.step1Detail3] },
        { step: 2, icon: CreditCard, title: tx.step2Title, desc: tx.step2Desc, duration: tx.step2Duration, details: [tx.step2Detail1, tx.step2Detail2, tx.step2Detail3] },
        { step: 3, icon: Ship, title: tx.step3Title, desc: tx.step3Desc, duration: tx.step3Duration, details: [tx.step3Detail1, tx.step3Detail2, tx.step3Detail3] },
        { step: 4, icon: FileCheck, title: tx.step4Title, desc: tx.step4Desc, duration: tx.step4Duration, details: [tx.step4Detail1, tx.step4Detail2, tx.step4Detail3] },
        { step: 5, icon: Truck, title: tx.step5Title, desc: tx.step5Desc, duration: tx.step5Duration, details: [tx.step5Detail1, tx.step5Detail2, tx.step5Detail3] }
    ]

    const paymentMethods = [
        { name: tx.bankName, desc: tx.bankDesc },
        { name: tx.ccpName, desc: tx.ccpDesc },
        { name: tx.cashName, desc: tx.cashDesc }
    ]

    const documents = [tx.doc1, tx.doc2, tx.doc3, tx.doc4, tx.doc5]

    const faqs = [
        { question: tx.faq1Q, answer: tx.faq1A },
        { question: tx.faq2Q, answer: tx.faq2A },
        { question: tx.faq3Q, answer: tx.faq3A },
        { question: tx.faq4Q, answer: tx.faq4A },
        { question: tx.faq5Q, answer: tx.faq5A }
    ]

    return (
        <div className={`process-page ${!isRTL ? 'ltr' : ''}`}>
            {/* Hero */}
            <section className="process-hero">
                <div className="process-hero-bg"></div>
                <div className="container">
                    <div className="process-hero-content">
                        <span className="section-tag">{tx.heroTag}</span>
                        <h1>{tx.heroTitle}</h1>
                        <p>{tx.heroSubtitle}</p>
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="steps-section section">
                <div className="container">
                    <div className="steps-timeline">
                        {steps.map((step, index) => (
                            <div key={index} className="step-item">
                                <div className="step-marker">
                                    <div className="step-number">{step.step}</div>
                                    <div className="step-icon-wrapper">
                                        <step.icon size={28} />
                                    </div>
                                    {index < steps.length - 1 && <div className="step-line"></div>}
                                </div>
                                <div className="step-content">
                                    <div className="step-header">
                                        <h3>{step.title}</h3>
                                        <span className="step-duration">{step.duration}</span>
                                    </div>
                                    <p>{step.desc}</p>
                                    <ul className="step-details">
                                        {step.details.map((detail, i) => (
                                            <li key={i}>
                                                <CheckCircle size={16} />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment Methods */}
            <section className="payment-section section section-dark">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">{tx.paymentTag}</span>
                        <h2>{tx.paymentTitle}</h2>
                    </div>
                    <div className="payment-grid">
                        {paymentMethods.map((method, index) => (
                            <div key={index} className="payment-card">
                                <CreditCard size={32} />
                                <h4>{method.name}</h4>
                                <p>{method.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Documents */}
            <section className="documents-section section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">{tx.docsTag}</span>
                        <h2>{tx.docsTitle}</h2>
                        <p>{tx.docsSubtitle}</p>
                    </div>
                    <div className="documents-list">
                        {documents.map((doc, index) => (
                            <div key={index} className="document-item card">
                                <FileCheck size={24} />
                                <span>{doc}</span>
                            </div>
                        ))}
                    </div>
                    <div className="documents-cta">
                        <Link to="/documents" className="btn btn-primary">
                            {tx.docsUpload}
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="faq-section section section-dark">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">{tx.faqTag}</span>
                        <h2>{tx.faqTitle}</h2>
                    </div>
                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${openFaq === index ? 'faq-open' : ''}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <HelpCircle size={20} />
                                    <span>{faq.question}</span>
                                    <ChevronDown size={20} className="faq-arrow" />
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="process-cta section">
                <div className="container">
                    <div className="cta-box">
                        <h2>{tx.ctaTitle}</h2>
                        <p>{tx.ctaSubtitle}</p>
                        <div className="cta-buttons">
                            <a href="https://wa.me/821080890802" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                                {tx.ctaWhatsapp}
                            </a>
                            <a href="tel:+213557060478" className="btn btn-outline btn-lg">
                                <Phone size={20} />
                                {tx.ctaCall}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
