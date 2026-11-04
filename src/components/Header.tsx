import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../config/site'
import { useLanguage } from '../context/LanguageContext'
import { Logo } from './Logo'
import './Header.css'

const navLinks = [
    { path: '/stock', labelKey: 'nav.stock' },
    { path: '/cars', labelKey: 'nav.cars' },
    { path: '/process', labelKey: 'nav.process' },
    { path: '/about', labelKey: 'nav.about' },
    { path: '/tracking', labelKey: 'nav.tracking' },
    { path: '/contact', labelKey: 'nav.contact' }
]

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const location = useLocation()
    const { language, setLanguage, t } = useLanguage()

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => { setIsMenuOpen(false) }, [location])

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isMenuOpen])

    const nextLanguage = language === 'ar' ? 'fr' : 'ar'
    const orderLabel = language === 'ar' ? 'اطلب سيارتك' : 'Commander'

    return (
        <header className={`header ${isScrolled || isMenuOpen ? 'is-scrolled' : ''}`}>
            <div className="header-bar container">
                <Link to="/" className="header-logo" aria-label="Wahid Auto">
                    <Logo size={34} />
                </Link>

                <nav className="nav-desktop" aria-label={language === 'ar' ? 'القائمة' : 'Menu'}>
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${location.pathname.startsWith(link.path) ? 'is-active' : ''}`}
                        >
                            {t(link.labelKey)}
                        </Link>
                    ))}
                </nav>

                <div className="header-actions">
                    <button
                        className="lang-btn"
                        onClick={() => setLanguage(nextLanguage)}
                        aria-label={language === 'ar' ? 'Passer en français' : 'التبديل إلى العربية'}
                    >
                        {language === 'ar' ? 'FR' : 'ع'}
                    </button>
                    <Link to="/#order" className="btn btn-primary btn-sm header-cta">{orderLabel}</Link>
                    <button
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(open => !open)}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
                    </button>
                </div>
            </div>

            <div className={`nav-mobile ${isMenuOpen ? 'is-open' : ''}`} hidden={!isMenuOpen}>
                <nav className="nav-mobile-links container">
                    <Link to="/" className="nav-mobile-link">{t('nav.home')}</Link>
                    {navLinks.map(link => (
                        <Link key={link.path} to={link.path} className="nav-mobile-link">
                            {t(link.labelKey)}
                        </Link>
                    ))}
                </nav>
                <div className="nav-mobile-footer container">
                    <Link to="/#order" className="btn btn-primary w-full">{orderLabel}</Link>
                    <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full">WhatsApp</a>
                    <a href={site.phoneHref} className="nav-mobile-phone num" dir="ltr">{site.phoneDisplay}</a>
                </div>
            </div>
        </header>
    )
}
