import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { useLanguage } from '../context/LanguageContext'
import { Logo } from './Logo'
import './Footer.css'

const copy = {
    ar: {
        tagline: 'سيارتك من كوريا والصين، بسعر واضح وأوراق كاملة، حتى باب دارك.',
        explore: 'تصفح',
        follow: 'تابعنا',
        contact: 'تواصل',
        links: [
            { path: '/stock', label: 'متوفرة الآن' },
            { path: '/cars', label: 'السيارات' },
            { path: '/process', label: 'كيف نعمل' },
            { path: '/about', label: 'من نحن' },
            { path: '/tracking', label: 'تتبع طلبك' },
            { path: '/shipping-form', label: 'استمارة الشحن' },
            { path: '/documents', label: 'رفع الوثائق' }
        ],
        place: 'جيجل، الجزائر',
        rights: 'جميع الحقوق محفوظة'
    },
    fr: {
        tagline: 'Votre voiture de Corée et de Chine, prix clair et papiers complets, livrée chez vous.',
        explore: 'Explorer',
        follow: 'Suivez-nous',
        contact: 'Contact',
        links: [
            { path: '/stock', label: 'Disponibles maintenant' },
            { path: '/cars', label: 'Voitures' },
            { path: '/process', label: 'Comment ça marche' },
            { path: '/about', label: 'À propos' },
            { path: '/tracking', label: 'Suivi de commande' },
            { path: '/shipping-form', label: "Formulaire d'expédition" },
            { path: '/documents', label: 'Envoyer vos documents' }
        ],
        place: 'Jijel, Algérie',
        rights: 'Tous droits réservés'
    }
}

export default function Footer() {
    const { language } = useLanguage()
    const tx = copy[language]

    return (
        <footer className="footer section-dark">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <Logo size={40} />
                    <p className="footer-tagline">{tx.tagline}</p>
                </div>

                <div className="footer-col">
                    <h3 className="footer-heading">{tx.explore}</h3>
                    <ul>
                        {tx.links.map(link => (
                            <li key={link.path}><Link to={link.path}>{link.label}</Link></li>
                        ))}
                    </ul>
                </div>

                <div className="footer-col">
                    <h3 className="footer-heading">{tx.contact}</h3>
                    <ul>
                        <li><a href={site.phoneHref} className="num" dir="ltr">{site.phoneDisplay}</a></li>
                        <li><a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                        <li><a href={`mailto:${site.email}`} className="latin">{site.email}</a></li>
                        <li><a href={site.mapsHref} target="_blank" rel="noopener noreferrer">{tx.place}</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h3 className="footer-heading">{tx.follow}</h3>
                    <ul>
                        <li><a href={site.tiktokHref} target="_blank" rel="noopener noreferrer" className="latin">TikTok</a></li>
                        <li><a href={site.facebookHref} target="_blank" rel="noopener noreferrer" className="latin">Facebook</a></li>
                    </ul>
                </div>
            </div>

            <div className="container footer-bottom">
                <span className="latin num">© {new Date().getFullYear()} Wahid Auto</span>
                <span>{tx.rights}</span>
            </div>
        </footer>
    )
}
