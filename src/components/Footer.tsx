import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../i18n'
import './Footer.css'

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const { language, isRTL, t } = useLanguage()

    const quickLinksAr = [
        { path: '/', label: 'الرئيسية' },
        { path: '/cars', label: 'السيارات المتاحة' },
        { path: '/about', label: 'من نحن' },
        { path: '/process', label: 'كيف نعمل' },
        { path: '/tracking', label: 'تتبع طلبك' },
        { path: '/contact', label: 'تواصل معنا' }
    ]

    const quickLinksFr = [
        { path: '/', label: 'Accueil' },
        { path: '/cars', label: 'Voitures disponibles' },
        { path: '/about', label: 'À propos' },
        { path: '/process', label: 'Comment ça marche' },
        { path: '/tracking', label: 'Suivi commande' },
        { path: '/contact', label: 'Contact' }
    ]

    const quickLinks = language === 'ar' ? quickLinksAr : quickLinksFr

    const socialLinks = [
        {
            href: 'https://www.tiktok.com/@wahidautokr?is_from_webapp=1&sender_device=pc',
            label: 'TikTok',
            icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
            )
        },
        {
            href: 'https://www.facebook.com/p/Wahid-auto-61578165476261/',
            label: 'Facebook',
            icon: (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            )
        }
    ]

    return (
        <footer className={`footer ${!isRTL ? 'footer-ltr' : ''}`}>
            <div className="footer-wave">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="currentColor" />
                </svg>
            </div>

            <div className="footer-content">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-section footer-about">
                            <img src="/logo.png" alt="Wahid Auto" className="footer-logo" />
                            <p className="footer-description">{t('footer.description')}</p>
                            <div className="footer-social">
                                {socialLinks.map((link, index) => (
                                    <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={link.label} title={link.label}>
                                        {link.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">{t('footer.quickLinks')}</h4>
                            <ul className="footer-links">
                                {quickLinks.map(link => (
                                    <li key={link.path}>
                                        <Link to={link.path} className="footer-link">{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">{t('footer.services')}</h4>
                            <ul className="footer-links">
                                {translations[language].footer.servicesList.map((service: string, index: number) => (
                                    <li key={index}>
                                        <span className="footer-link">{service}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">{t('footer.contactUs')}</h4>
                            <ul className="footer-contact">
                                <li>
                                    <Phone size={18} />
                                    <div>
                                        <span>{t('footer.callUs')}</span>
                                        <a href="tel:+213557060478">0557-06-04-78</a>
                                    </div>
                                </li>
                                <li>
                                    <Mail size={18} />
                                    <div>
                                        <span>{t('footer.writeUs')}</span>
                                        <a href="mailto:contact@wahid-auto.com">contact@wahid-auto.com</a>
                                    </div>
                                </li>
                                <li>
                                    <MapPin size={18} />
                                    <div>
                                        <a href="https://maps.app.goo.gl/mjPVTCHVaAapNcm66" target="_blank" rel="noopener noreferrer">
                                            {language === 'ar' ? 'بازول، جيجل، الجزائر' : 'Bazoul, Jijel, Algérie'}
                                        </a>
                                    </div>
                                </li>
                            </ul>

                            <div className="footer-newsletter">
                                <h5>{t('footer.newsletter')}</h5>
                                <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                                    <input type="email" placeholder={t('footer.emailPlaceholder')} className="newsletter-input" />
                                    <button type="submit" className="newsletter-btn"><Send size={18} /></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p>© {currentYear} {t('footer.copyright')}</p>
                        <div className="footer-legal">
                            <Link to="/privacy">{t('footer.privacy')}</Link>
                            <Link to="/terms">{t('footer.terms')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
