import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Header.css'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const location = useLocation()
    const { language, setLanguage, t, isRTL } = useLanguage()

    const navLinks = [
        { path: '/', labelKey: 'nav.home' },
        { path: '/cars', labelKey: 'nav.cars' },
        { path: '/about', labelKey: 'nav.about' },
        { path: '/process', labelKey: 'nav.process' },
        { path: '/tracking', labelKey: 'nav.tracking' },
        { path: '/contact', labelKey: 'nav.contact' }
    ]

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => { setIsMenuOpen(false) }, [location])

    const handleLanguageSwitch = () => {
        setLanguage(language === 'ar' ? 'fr' : 'ar')
    }

    const isHomePage = location.pathname === '/'
    const showBackground = isScrolled || !isHomePage

    return (
        <header className={`header ${showBackground ? 'header-scrolled' : ''} ${!isRTL ? 'header-ltr' : ''}`}>
            <div className="header-container">
                <Link to="/" className="logo">
                    <img src="/logo.png" alt="Wahid Auto" className="logo-image" />
                </Link>

                <nav className="nav-desktop">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
                        >
                            {t(link.labelKey)}
                        </Link>
                    ))}
                </nav>

                <div className="header-actions">
                    <div className="language-switcher">
                        <button className="language-btn" onClick={handleLanguageSwitch}>
                            {language === 'ar' ? 'FR' : 'عربي'}
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    <a href="tel:+213557060478" className="header-cta btn btn-primary">
                        <Phone size={18} />
                        <span>{t('header.callUs')}</span>
                    </a>

                    <button
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <div className={`nav-mobile ${isMenuOpen ? 'nav-mobile-open' : ''}`}>
                <nav className="nav-mobile-links">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-mobile-link ${location.pathname === link.path ? 'nav-mobile-link-active' : ''}`}
                        >
                            {t(link.labelKey)}
                        </Link>
                    ))}
                </nav>
                <div className="nav-mobile-footer">
                    <a href="tel:+213557060478" className="btn btn-primary w-full">
                        <Phone size={18} />
                        {language === 'ar' ? 'اتصل بنا الآن' : 'Appelez maintenant'}
                    </a>
                </div>
            </div>
        </header>
    )
}
