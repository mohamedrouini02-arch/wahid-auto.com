import type { ReactNode } from 'react'
import { site } from '../config/site'
import { useLanguage } from '../context/LanguageContext'
import { useScrollReveal } from '../lib/motion'
import '../pages/Pages.css'

export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: ReactNode }) {
    useScrollReveal()
    return (
        <section className="page-hero section-dark">
            <div className="container page-hero-inner">
                <p className="eyebrow animate-fadeInUp">{eyebrow}</p>
                <h1 className="page-hero-title animate-fadeInUp stagger-1">{title}</h1>
                {lead && <p className="lead animate-fadeInUp stagger-2">{lead}</p>}
                {children && <div className="page-hero-extra animate-fadeInUp stagger-3">{children}</div>}
            </div>
        </section>
    )
}

export function CtaBand() {
    const { language } = useLanguage()
    const tx = language === 'ar'
        ? { title: 'جاهز تبدأ؟', lead: 'راسلنا على واتساب، نجاوبك بالسعر الحالي ونبعثلك صور السيارة.', wa: 'واتساب', call: 'اتصل بنا' }
        : { title: 'Prêt à commencer ?', lead: 'Écrivez-nous sur WhatsApp : prix actuel et photos de la voiture.', wa: 'WhatsApp', call: 'Appeler' }
    return (
        <section className="cta-band">
            <div className="container cta-inner" data-reveal>
                <div>
                    <h2 className="section-title">{tx.title}</h2>
                    <p className="section-subtitle">{tx.lead}</p>
                </div>
                <div className="cta-actions">
                    <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">{tx.wa}</a>
                    <a href={site.phoneHref} className="btn btn-secondary btn-lg"><span className="num" dir="ltr">{site.phoneDisplay}</span></a>
                </div>
            </div>
        </section>
    )
}
