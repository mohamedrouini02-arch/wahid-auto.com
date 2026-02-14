import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'
import WhatsAppButton from './components/WhatsAppButton'
import { LanguageProvider } from './context/LanguageContext'
import About from './pages/About'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import Contact from './pages/Contact'
import DocumentsUpload from './pages/DocumentsUpload'
import Home from './pages/Home'
import OrderTracking from './pages/OrderTracking'
import Process from './pages/Process'
import ShippingForm from './pages/ShippingForm'

function App() {
    return (
        <LanguageProvider>
            <Router>
                <ScrollToTop />
                <div className="app">
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/cars" element={<Cars />} />
                            <Route path="/cars/:id" element={<CarDetails />} />
                            <Route path="/process" element={<Process />} />
                            <Route path="/tracking" element={<OrderTracking />} />
                            <Route path="/shipping-form" element={<ShippingForm />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/documents" element={<DocumentsUpload />} />
                        </Routes>
                    </main>
                    <Footer />
                    <WhatsAppButton />
                </div>
            </Router>
        </LanguageProvider>
    )
}

export default App
