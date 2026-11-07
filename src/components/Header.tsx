import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../config/site'
import { useLanguage } from '../context/LanguageContext'
import { Logo } from './Logo'
import './Header.css'

const links = [
    { path: '/', labelKey: 'nav.home' },
    { path: '/stock', labelKey: 'nav.stock' },
    { path: '/cars', labelKey: 'nav.cars' },
    { path: '/process', labelKey: 'nav.process' },
    { path: '/about', labelKey: 'nav.about' },
    { path: '/tracking', labelKey: 'nav.tracking' },
    { path: '/contact', labelKey: 'nav.contact' },
]

export default function Header() {
    const [open, setOpen] = useState(false)
    const [hidden, setHidden] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const { language, setLanguage, t } = useLanguage()

    // Hide the bar while scrolling down, bring it back when scrolling up
    useEffect(() => {
        let last = window.scrollY
        const onScroll = () => {
            const y = window.scrollY
            setScrolled(y > 8)
            setHidden(y > 160 && y > last)
            last = y
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => { setOpen(false) }, [location])
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
        window.addEventListener('keydown', onKey)
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
    }, [open])

    const menuLabel = language === 'ar' ? (open ? 'إغلاق' : 'القائمة') : (open ? 'Fermer' : 'Menu')
    const orderLabel = language === 'ar' ? 'اطلب سيارتك' : 'Commander'

    return (
        <>
            <header className={`header ${scrolled ? 'is-scrolled' : ''} ${hidden && !open ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}>
                <div className="header-bar container">
                    <Link to="/" className="header-logo" aria-label="Wahid Auto"><Logo size={34} /></Link>
                    <nav className="pill-nav" aria-label={language === 'ar' ? 'التنقل الرئيسي' : 'Navigation principale'}>
                        {links.slice(1, 6).map(link => (
                            <Link key={link.path} to={link.path} className={location.pathname === link.path ? 'is-active' : ''}>{t(link.labelKey)}</Link>
                        ))}
                    </nav>
                    <div className="header-actions">
                        <button className="lang-btn" onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')} aria-label={language === 'ar' ? 'Passer en français' : 'التبديل إلى العربية'}>
                            {language === 'ar' ? 'FR' : 'ع'}
                        </button>
                        <Link to="/#order" className="btn btn-primary btn-sm header-cta">{orderLabel}</Link>
                        <button className="menu-btn" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls="site-menu">
                            <span className="menu-btn-label">{menuLabel}</span>
                            <span className={`menu-btn-icon ${open ? 'is-open' : ''}`} aria-hidden="true"><i /><i /></span>
                        </button>
                    </div>
                </div>
            </header>

            <div id="site-menu" className={`menu-overlay ${open ? 'is-open' : ''}`} aria-hidden={!open} data-native-scroll>
                <nav className="container menu-inner" aria-label={language === 'ar' ? 'القائمة' : 'Menu'}>
                    <ol className="menu-links">
                        {links.map((link, i) => (
                            <li key={link.path} style={{ transitionDelay: `${80 + i * 50}ms` }}>
                                <Link to={link.path} className={location.pathname === link.path ? 'is-active' : ''}>
                                    <span className="menu-index latin num">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="menu-label">{t(link.labelKey)}</span>
                                </Link>
                            </li>
                        ))}
                    </ol>
                    <div className="menu-side">
                        <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                        <a href={site.phoneHref} className="num" dir="ltr">{site.phoneDisplay}</a>
                        <a href={site.tiktokHref} target="_blank" rel="noopener noreferrer" className="latin">TikTok</a>
                        <a href={site.facebookHref} target="_blank" rel="noopener noreferrer" className="latin">Facebook</a>
                        <a href={site.mapsHref} target="_blank" rel="noopener noreferrer">{language === 'ar' ? 'بازول، الطاهير، جيجل' : 'Bazoul, Taher, Jijel'}</a>
                    </div>
                </nav>
            </div>
        </>
    )
}
