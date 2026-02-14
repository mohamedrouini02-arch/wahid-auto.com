import emailjs from '@emailjs/browser'
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'
import './Contact.css'

// EmailJS configuration - Gmail
const EMAILJS_SERVICE_ID = 'service_u8c498u'
const EMAILJS_TEMPLATE_ID = 'template_535lqd7'
const EMAILJS_PUBLIC_KEY = 'v00jNbJkzIBI1HQyE'

export default function Contact() {
    const { language, isRTL } = useLanguage()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const text = {
        ar: {
            heroTag: 'تواصل معنا',
            heroTitle: 'تواصل معنا',
            heroSubtitle: 'نحن هنا لمساعدتك. أرسل لنا رسالة أو تواصل معنا مباشرة',
            formTitle: 'أرسل لنا رسالة',
            nameLabel: 'الاسم الكامل',
            phoneLabel: 'رقم الهاتف',
            emailLabel: 'البريد الإلكتروني',
            subjectLabel: 'الموضوع',
            messageLabel: 'الرسالة',
            submitBtn: 'إرسال الرسالة',
            submitting: 'جاري الإرسال...',
            successTitle: 'تم إرسال رسالتك بنجاح!',
            successDesc: 'شكراً لتواصلك معنا. سنرد عليك قريباً.',
            newMessage: 'إرسال رسالة أخرى',
            errorMsg: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
            subjects: [
                { value: '', label: 'اختر الموضوع' },
                { value: 'inquiry', label: 'استفسار عام' },
                { value: 'quote', label: 'طلب عرض سعر' },
                { value: 'tracking', label: 'تتبع طلب' },
                { value: 'complaint', label: 'شكوى' },
                { value: 'other', label: 'أخرى' }
            ],
            contactInfoPhone: 'الهاتف',
            contactInfoWhatsapp: 'واتساب',
            contactInfoEmail: 'البريد الإلكتروني',
            contactInfoLocation: 'الموقع',
            phoneValue: '0557-06-04-78',
            whatsappValue: '+82 10-8089-0802',
            emailValue: 'contact@wahid-auto.com',
            locationValue: 'بازول، جيجل، الجزائر',
            hoursTitle: 'ساعات العمل',
            weekdays: 'الأحد - الخميس',
            weekdaysTime: '9:00 ص - 6:00 م',
            friday: 'الجمعة',
            fridayTime: 'مغلق',
            saturday: 'السبت',
            saturdayTime: '10:00 ص - 4:00 م',
            mapTitle: 'موقعنا - بازول، جيجل'
        },
        fr: {
            heroTag: 'Contact',
            heroTitle: 'Contactez-nous',
            heroSubtitle: 'Nous sommes là pour vous aider. Envoyez-nous un message ou contactez-nous directement',
            formTitle: 'Envoyez-nous un message',
            nameLabel: 'Nom complet',
            phoneLabel: 'Téléphone',
            emailLabel: 'Email',
            subjectLabel: 'Sujet',
            messageLabel: 'Message',
            submitBtn: 'Envoyer le message',
            submitting: 'Envoi en cours...',
            successTitle: 'Message envoyé avec succès!',
            successDesc: 'Merci de nous avoir contactés. Nous vous répondrons bientôt.',
            newMessage: 'Envoyer un autre message',
            errorMsg: 'Une erreur est survenue. Veuillez réessayer.',
            subjects: [
                { value: '', label: 'Sélectionnez le sujet' },
                { value: 'inquiry', label: 'Demande générale' },
                { value: 'quote', label: 'Demande de devis' },
                { value: 'tracking', label: 'Suivi de commande' },
                { value: 'complaint', label: 'Réclamation' },
                { value: 'other', label: 'Autre' }
            ],
            contactInfoPhone: 'Téléphone',
            contactInfoWhatsapp: 'WhatsApp',
            contactInfoEmail: 'Email',
            contactInfoLocation: 'Adresse',
            phoneValue: '0557-06-04-78',
            whatsappValue: '+82 10-8089-0802',
            emailValue: 'contact@wahid-auto.com',
            locationValue: 'Bazoul, Jijel, Algérie',
            hoursTitle: 'Heures d\'ouverture',
            weekdays: 'Dimanche - Jeudi',
            weekdaysTime: '9h00 - 18h00',
            friday: 'Vendredi',
            fridayTime: 'Fermé',
            saturday: 'Samedi',
            saturdayTime: '10h00 - 16h00',
            mapTitle: 'Notre localisation - Bazoul, Jijel'
        }
    }

    const tx = text[language]

    const contactInfo = [
        { icon: Phone, label: tx.contactInfoPhone, value: tx.phoneValue, link: 'tel:+213557060478' },
        { icon: MessageCircle, label: tx.contactInfoWhatsapp, value: tx.whatsappValue, link: 'https://wa.me/821080890802' },
        { icon: Mail, label: tx.contactInfoEmail, value: tx.emailValue, link: 'mailto:contact@wahid-auto.com' },
        { icon: MapPin, label: tx.contactInfoLocation, value: tx.locationValue, link: 'https://maps.app.goo.gl/mjPVTCHVaAapNcm66' }
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { error } = await supabase.from('contacts').insert({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message
            })

            if (error) throw error

            // Send email notification
            try {
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    {
                        from_name: formData.name,
                        from_email: formData.email || 'غير محدد',
                        phone: formData.phone,
                        subject: formData.subject,
                        message: formData.message
                    },
                    EMAILJS_PUBLIC_KEY
                )
                console.log('Contact email sent successfully')
            } catch (emailError) {
                console.error('Email notification failed:', emailError)
            }

            setSuccess(true)
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        } catch (error) {
            console.error('Error:', error)
            alert(tx.errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={`contact-page ${!isRTL ? 'ltr' : ''}`}>
            {/* Hero */}
            <section className="contact-hero">
                <div className="contact-hero-bg"></div>
                <div className="container">
                    <div className="contact-hero-content">
                        <span className="section-tag">{tx.heroTag}</span>
                        <h1>{tx.heroTitle}</h1>
                        <p>{tx.heroSubtitle}</p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Form */}
                        <div className="contact-form-wrapper">
                            <div className="card contact-form-card">
                                <h2>{tx.formTitle}</h2>

                                {success ? (
                                    <div className="success-message">
                                        <div className="success-icon">
                                            <Send size={32} />
                                        </div>
                                        <h3>{tx.successTitle}</h3>
                                        <p>{tx.successDesc}</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setSuccess(false)}
                                        >
                                            {tx.newMessage}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">{tx.nameLabel} *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">{tx.phoneLabel} *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">{tx.emailLabel}</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-input"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">{tx.subjectLabel} *</label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="form-select"
                                                required
                                            >
                                                {tx.subjects.map(subject => (
                                                    <option key={subject.value} value={subject.value}>
                                                        {subject.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">{tx.messageLabel} *</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="form-textarea"
                                                rows={5}
                                                required
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg w-full"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? tx.submitting : tx.submitBtn}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="contact-info-wrapper">
                            <div className="contact-info-cards">
                                {contactInfo.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.link}
                                        target={item.link.startsWith('http') ? '_blank' : undefined}
                                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="contact-info-card card"
                                    >
                                        <div className="info-icon">
                                            <item.icon size={24} />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">{item.label}</span>
                                            <strong className="info-value">{item.value}</strong>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div className="business-hours card">
                                <h3>
                                    <Clock size={20} />
                                    {tx.hoursTitle}
                                </h3>
                                <ul>
                                    <li>
                                        <span>{tx.weekdays}</span>
                                        <strong>{tx.weekdaysTime}</strong>
                                    </li>
                                    <li>
                                        <span>{tx.friday}</span>
                                        <strong>{tx.fridayTime}</strong>
                                    </li>
                                    <li>
                                        <span>{tx.saturday}</span>
                                        <strong>{tx.saturdayTime}</strong>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map - Bazoul, Jijel, Algeria */}
            <section className="map-section">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25726.12!2d5.85!3d36.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f3058e2c792c8d%3A0x5e8f2e3c4e4d8a6b!2sBazoul%2C%20Jijel%2C%20Algeria!5e0!3m2!1sen!2sdz!4v1707400000000!5m2!1sen!2sdz"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={tx.mapTitle}
                ></iframe>
            </section>
        </div>
    )
}
