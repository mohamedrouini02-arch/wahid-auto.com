import { BadgeCheck, Eye, HandCoins, MessageCircle } from 'lucide-react'
import { CtaBand, PageHero } from '../components/PageParts'
import { site } from '../config/site'
import { useLanguage } from '../context/LanguageContext'

const copy = {
    ar: {
        eyebrow: 'من نحن',
        title: 'وحيد أوتو، من جيجل إلى كل الجزائر.',
        lead: 'معرض حقيقي، فريق حقيقي، وسيارات تصل فعلاً. نستورد من كوريا الجنوبية والصين منذ سنوات، ونسلّم لزبائن في أكثر من 20 ولاية.',
        storyTitle: 'القصة',
        story: [
            'بدأنا بفكرة بسيطة: الجزائري يستحق يشري سيارة مستوردة بلا خوف، بلا مفاجآت في السعر، وبلا تعب في الأوراق.',
            'اليوم عندنا معرض في بازول، الطاهير، جيجل، وشركاء على الأرض في كوريا والصين. نختار السيارة، نفحصها، نشحنها، ونتابعها حتى تستلمها.',
            'أغلب زبائننا جاونا من توصية صديق أو من فيديوهاتنا على تيك توك. هذا أكبر دليل على الثقة.'
        ],
        photoCaption: 'افتتاح معرض وحيد أوتو، بازول، الطاهير، جيجل',
        stats: [
            { value: '270+', label: 'سيارة مسلّمة في 12 شهراً' },
            { value: '20+', label: 'ولاية' },
            { value: '45K', label: 'متابع على تيك توك' },
            { value: '2', label: 'بلدان مصدر' }
        ],
        valuesTitle: 'وعدنا لك',
        values: [
            { title: 'سعر واضح', text: 'السعر النهائي مكتوب قبل أي دفع. لا رسوم مخفية.' },
            { title: 'فحص حقيقي', text: 'صور وتقرير لكل سيارة قبل الشراء.' },
            { title: 'متابعة على واتساب', text: 'تعرف وين راهي سيارتك في كل مرحلة.' },
            { title: 'أموالك في أمان', text: 'إذا ما وصلتش السيارة بسببنا، نرجعولك كامل المبلغ.' }
        ],
        socialTitle: 'شوف بعينك',
        socialLead: 'كل أسبوع نصور السيارات الواصلة وتسليمها للزبائن.',
        tiktok: 'متابع على تيك توك',
        facebook: 'صفحة فيسبوك',
        visit: 'زورنا في المعرض',
        visitText: 'بازول، الطاهير، جيجل'
    },
    fr: {
        eyebrow: 'À propos',
        title: 'Wahid Auto, de Jijel à toute l’Algérie.',
        lead: 'Un vrai showroom, une vraie équipe, des voitures qui arrivent vraiment. Nous importons de Corée du Sud et de Chine et livrons des clients dans plus de 20 wilayas.',
        storyTitle: 'Notre histoire',
        story: [
            'Une idée simple : acheter une voiture importée sans crainte, sans surprise sur le prix et sans casse-tête administratif.',
            'Aujourd’hui, notre showroom est à Bazoul, Taher, Jijel, avec des partenaires sur place en Corée et en Chine. Nous choisissons, inspectons, expédions et suivons la voiture jusqu’à vous.',
            'La plupart de nos clients viennent par recommandation ou par nos vidéos TikTok. C’est notre meilleure preuve de confiance.'
        ],
        photoCaption: 'Inauguration du showroom Wahid Auto, Bazoul, Taher, Jijel',
        stats: [
            { value: '270+', label: 'voitures livrées en 12 mois' },
            { value: '20+', label: 'wilayas' },
            { value: '45K', label: 'abonnés TikTok' },
            { value: '2', label: 'pays d’origine' }
        ],
        valuesTitle: 'Notre promesse',
        values: [
            { title: 'Prix clair', text: 'Prix final écrit avant tout paiement. Aucun frais caché.' },
            { title: 'Vraie inspection', text: 'Photos et rapport pour chaque voiture avant l’achat.' },
            { title: 'Suivi WhatsApp', text: 'Vous savez où est votre voiture à chaque étape.' },
            { title: 'Fonds protégés', text: 'Si la voiture n’arrive pas par notre faute, remboursement intégral.' }
        ],
        socialTitle: 'Voyez par vous-même',
        socialLead: 'Chaque semaine, nous filmons les arrivages et les remises de clés.',
        tiktok: 'abonnés TikTok',
        facebook: 'Page Facebook',
        visit: 'Visitez le showroom',
        visitText: 'Bazoul, Taher, Jijel'
    }
}

const icons = [HandCoins, Eye, MessageCircle, BadgeCheck]

export default function About() {
    const { language } = useLanguage()
    const tx = copy[language]

    return (
        <div className="about">
            <PageHero eyebrow={tx.eyebrow} title={tx.title} lead={tx.lead} />

            <section className="section">
                <div className="container split">
                    <div className="prose" data-reveal>
                        <p className="eyebrow">{tx.storyTitle}</p>
                        {tx.story.map(p => <p key={p}>{p}</p>)}
                    </div>
                    <figure className="split-media" style={{ margin: 0, aspectRatio: '4 / 5' }} data-reveal>
                        <img src="/brand/showroom-aerial.jpg" alt={tx.photoCaption} loading="lazy" decoding="async" />
                        <figcaption>{tx.photoCaption}</figcaption>
                    </figure>
                </div>
            </section>

            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="stat-row" data-reveal>
                        {tx.stats.map(s => (
                            <div className="stat" key={s.label}>
                                <span className="stat-value num">{s.value}</span>
                                <span className="stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" style={{ background: 'var(--paper-2)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{tx.valuesTitle}</h2>
                    </div>
                    <div className="value-grid" data-reveal>
                        {tx.values.map((v, i) => {
                            const Icon = icons[i]
                            return (
                                <div className="value-card" key={v.title}>
                                    <Icon size={22} strokeWidth={1.5} />
                                    <h3>{v.title}</h3>
                                    <p>{v.text}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{tx.socialTitle}</h2>
                        <p className="section-subtitle">{tx.socialLead}</p>
                    </div>
                    <div className="social-proof" data-reveal>
                        <a className="social-tile" href={site.tiktokHref} target="_blank" rel="noopener noreferrer">
                            <strong>45K</strong><span>{tx.tiktok} · @wahidautokr</span>
                        </a>
                        <a className="social-tile" href={site.facebookHref} target="_blank" rel="noopener noreferrer">
                            <strong>5K</strong><span>{tx.facebook}</span>
                        </a>
                        <a className="social-tile" href={site.mapsHref} target="_blank" rel="noopener noreferrer">
                            <strong className="latin" style={{ fontSize: '1.4rem' }}>{tx.visit}</strong><span>{tx.visitText}</span>
                        </a>
                    </div>
                </div>
            </section>

            <CtaBand />
        </div>
    )
}
