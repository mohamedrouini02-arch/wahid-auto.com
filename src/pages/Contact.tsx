import emailjs from '@emailjs/browser'
import { Facebook, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import { Monogram } from '../components/Logo'
import { PageHero } from '../components/PageParts'
import { site } from '../config/site'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

const EMAILJS_SERVICE_ID = 'service_u8c498u'
const EMAILJS_TEMPLATE_ID = 'template_535lqd7'
const EMAILJS_PUBLIC_KEY = 'jXCdC22u9FmNvH_Yz'

const copy = {
    ar: {
        eyebrow: 'تواصل معنا',
        title: 'نجاوبوك بسرعة. وعلى واتساب أسرع.',
        lead: 'سؤال على سيارة، سعر، أو طلب قيد الشحن؟ اختر الطريقة اللي تناسبك.',
        whatsapp: 'واتساب', whatsappHint: 'الأسرع: رد في نفس اليوم',
        phone: 'الهاتف', email: 'البريد الإلكتروني',
        showroom: 'المعرض', showroomValue: 'بازول، الطاهير، جيجل',
        facebook: 'فيسبوك', facebookValue: 'Wahid Auto',
        formTitle: 'أو اترك رسالة',
        name: 'الاسم', phoneLabel: 'رقم الهاتف', emailLabel: 'البريد (اختياري)', subject: 'الموضوع', message: 'رسالتك',
        subjects: ['سعر سيارة', 'طلب قيد الشحن', 'الوثائق والجمركة', 'أخرى'],
        send: 'أرسل', sending: 'جاري الإرسال...',
        success: 'وصلتنا رسالتك. نتصلو بيك قريباً.', again: 'رسالة أخرى',
        error: 'ما تبعثتش الرسالة. حاول مرة أخرى أو راسلنا على واتساب.'
    },
    fr: {
        eyebrow: 'Contact',
        title: 'Nous répondons vite. Sur WhatsApp, encore plus vite.',
        lead: 'Une question sur un modèle, un prix ou une commande en route ? Choisissez votre canal.',
        whatsapp: 'WhatsApp', whatsappHint: 'Le plus rapide : réponse le jour même',
        phone: 'Téléphone', email: 'E-mail',
        showroom: 'Showroom', showroomValue: 'Bazoul, Taher, Jijel',
        facebook: 'Facebook', facebookValue: 'Wahid Auto',
        formTitle: 'Ou laissez un message',
        name: 'Nom', phoneLabel: 'Téléphone', emailLabel: 'E-mail (facultatif)', subject: 'Sujet', message: 'Votre message',
        subjects: ['Prix d’une voiture', 'Commande en cours', 'Documents et douane', 'Autre'],
        send: 'Envoyer', sending: 'Envoi…',
        success: 'Message reçu. Nous vous rappelons bientôt.', again: 'Nouveau message',
        error: 'Le message n’est pas parti. Réessayez ou écrivez-nous sur WhatsApp.'
    }
}

const empty = { name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
    const { language } = useLanguage()
    const tx = copy[language]
    const [form, setForm] = useState(empty)
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [failed, setFailed] = useState(false)

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)
        setFailed(false)
        try {
            const { error } = await supabase.from('contacts').insert({ ...form })
            if (error) throw error
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_name: form.name,
                from_email: form.email || 'غير محدد',
                phone: form.phone,
                subject: form.subject,
                message: form.message
            }, EMAILJS_PUBLIC_KEY).catch(err => console.error('Email notification failed:', err))
            setSent(true)
            setForm(empty)
        } catch (err) {
            console.error('Contact submit failed:', err)
            setFailed(true)
        } finally {
            setSending(false)
        }
    }

    const channels = [
        { icon: MessageCircle, label: tx.whatsapp, value: tx.whatsappHint, href: site.whatsappHref, external: true },
        { icon: Phone, label: tx.phone, value: site.phoneDisplay, href: site.phoneHref, ltr: true },
        { icon: Mail, label: tx.email, value: site.email, href: `mailto:${site.email}`, ltr: true },
        { icon: MapPin, label: tx.showroom, value: tx.showroomValue, href: site.mapsHref, external: true },
        { icon: Facebook, label: tx.facebook, value: tx.facebookValue, href: site.facebookHref, external: true },
    ]

    return (
        <div className="contact-page">
            <PageHero eyebrow={tx.eyebrow} title={tx.title} lead={tx.lead} />

            <section className="section">
                <div className="container contact-grid">
                    <div className="contact-cards" data-reveal>
                        {channels.map(c => (
                            <a key={c.label} className="contact-card" href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                                <c.icon size={22} strokeWidth={1.5} />
                                <span>
                                    <small>{c.label}</small>
                                    <strong className={c.ltr ? 'num' : undefined} dir={c.ltr ? 'ltr' : undefined}>{c.value}</strong>
                                </span>
                            </a>
                        ))}
                    </div>

                    <div className="form-panel" data-reveal>
                        {sent ? (
                            <div className="form-success" role="status">
                                <Monogram size={56} />
                                <p style={{ fontSize: '1.3rem' }}>{tx.success}</p>
                                <button className="btn btn-secondary" onClick={() => setSent(false)}>{tx.again}</button>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 18 }}>
                                <h2 className="section-title" style={{ fontSize: '1.6rem' }}>{tx.formTitle}</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="c-name">{tx.name}</label>
                                        <input id="c-name" name="name" className="form-input" required autoComplete="name" value={form.name} onChange={onChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="c-phone">{tx.phoneLabel}</label>
                                        <input id="c-phone" name="phone" type="tel" dir="ltr" className="form-input num" required autoComplete="tel" placeholder="05XX XX XX XX" value={form.phone} onChange={onChange} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="c-email">{tx.emailLabel}</label>
                                        <input id="c-email" name="email" type="email" dir="ltr" className="form-input" autoComplete="email" value={form.email} onChange={onChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="c-subject">{tx.subject}</label>
                                        <select id="c-subject" name="subject" className="form-select" required value={form.subject} onChange={onChange}>
                                            <option value="" />
                                            {tx.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="c-message">{tx.message}</label>
                                    <textarea id="c-message" name="message" className="form-textarea" required rows={5} value={form.message} onChange={onChange} />
                                </div>
                                {failed && <p className="form-error-message" role="alert">{tx.error}</p>}
                                <button type="submit" className="btn btn-primary btn-lg w-full" disabled={sending}>
                                    {sending ? <><span className="spinner" /> {tx.sending}</> : tx.send}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
