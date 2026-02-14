import { AlertCircle, CheckCircle, Clock, Package, Search, Ship, Truck } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './OrderTracking.css'

interface OrderData {
    id: string
    reference_number: string
    customer_name: string
    customer_phone: string
    car_brand: string
    car_model: string
    status: string
    created_at: string
}

interface TrackingStep {
    status: string
    label: string
    icon: typeof Package
    completed: boolean
    current: boolean
}

export default function OrderTracking() {
    const [referenceNumber, setReferenceNumber] = useState('')
    const [order, setOrder] = useState<OrderData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const statusMap: Record<string, { label: string; color: string }> = {
        pending: { label: 'في الانتظار', color: '#f59e0b' },
        confirmed: { label: 'مؤكد', color: '#3b82f6' },
        purchased: { label: 'تم الشراء', color: '#8b5cf6' },
        shipped: { label: 'تم الشحن', color: '#06b6d4' },
        customs: { label: 'في الجمارك', color: '#f97316' },
        ready: { label: 'جاهز للاستلام', color: '#10b981' },
        delivered: { label: 'تم التسليم', color: '#22c55e' }
    }

    const getTrackingSteps = (currentStatus: string): TrackingStep[] => {
        const allStatuses = ['pending', 'confirmed', 'purchased', 'shipped', 'customs', 'ready', 'delivered']
        const currentIndex = allStatuses.indexOf(currentStatus)

        return [
            { status: 'pending', label: 'في الانتظار', icon: Clock, completed: currentIndex > 0, current: currentStatus === 'pending' },
            { status: 'confirmed', label: 'مؤكد', icon: CheckCircle, completed: currentIndex > 1, current: currentStatus === 'confirmed' },
            { status: 'purchased', label: 'تم الشراء', icon: Package, completed: currentIndex > 2, current: currentStatus === 'purchased' },
            { status: 'shipped', label: 'تم الشحن', icon: Ship, completed: currentIndex > 3, current: currentStatus === 'shipped' },
            { status: 'customs', label: 'في الجمارك', icon: AlertCircle, completed: currentIndex > 4, current: currentStatus === 'customs' },
            { status: 'ready', label: 'جاهز للاستلام', icon: Truck, completed: currentIndex > 5, current: currentStatus === 'ready' },
            { status: 'delivered', label: 'تم التسليم', icon: CheckCircle, completed: currentStatus === 'delivered', current: currentStatus === 'delivered' }
        ]
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!referenceNumber.trim()) return

        setLoading(true)
        setError('')
        setOrder(null)

        try {
            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*')
                .eq('reference_number', referenceNumber.trim().toUpperCase())
                .single()

            if (fetchError || !data) {
                setError('لم نتمكن من العثور على طلب بهذا الرقم. تأكد من صحة رقم المرجع.')
            } else {
                setOrder(data)
            }
        } catch {
            setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="tracking-page">
            {/* Hero */}
            <section className="tracking-hero">
                <div className="tracking-hero-bg"></div>
                <div className="container">
                    <div className="tracking-hero-content">
                        <span className="section-tag">تتبع الطلب</span>
                        <h1>تتبع حالة طلبك</h1>
                        <p>أدخل رقم المرجع للاطلاع على حالة طلبك</p>
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <section className="tracking-search section">
                <div className="container">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrapper">
                            <Search size={24} />
                            <input
                                type="text"
                                placeholder="أدخل رقم المرجع (مثال: WA-2026-ABC123)"
                                value={referenceNumber}
                                onChange={e => setReferenceNumber(e.target.value)}
                                className="tracking-input"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? 'جاري البحث...' : 'بحث'}
                        </button>
                    </form>

                    {error && (
                        <div className="tracking-error">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}
                </div>
            </section>

            {/* Results */}
            {order && (
                <section className="tracking-results section">
                    <div className="container">
                        <div className="results-grid">
                            {/* Order Info */}
                            <div className="order-info-card card">
                                <h3>معلومات الطلب</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span>رقم المرجع</span>
                                        <strong>{order.reference_number}</strong>
                                    </div>
                                    <div className="info-item">
                                        <span>الاسم</span>
                                        <strong>{order.customer_name}</strong>
                                    </div>
                                    <div className="info-item">
                                        <span>السيارة</span>
                                        <strong>{order.car_brand} {order.car_model}</strong>
                                    </div>
                                    <div className="info-item">
                                        <span>تاريخ الطلب</span>
                                        <strong>{new Date(order.created_at).toLocaleDateString('ar-DZ')}</strong>
                                    </div>
                                </div>
                                <div className="current-status">
                                    <span>الحالة الحالية</span>
                                    <div
                                        className="status-badge"
                                        style={{ background: statusMap[order.status]?.color || '#6b7280' }}
                                    >
                                        {statusMap[order.status]?.label || order.status}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Timeline */}
                            <div className="progress-card card">
                                <h3>مراحل الطلب</h3>
                                <div className="tracking-timeline">
                                    {getTrackingSteps(order.status).map((step, index) => (
                                        <div
                                            key={index}
                                            className={`timeline-item ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                                        >
                                            <div className="timeline-marker">
                                                <step.icon size={20} />
                                            </div>
                                            <div className="timeline-label">{step.label}</div>
                                            {index < 6 && <div className="timeline-line"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <div className="tracking-cta">
                            <p>هل لديك استفسار؟</p>
                            <a
                                href={`https://wa.me/821080890802?text=مرحباً، لدي سؤال حول طلبي رقم ${order.reference_number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                تواصل معنا
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* No Search Yet */}
            {!order && !error && (
                <section className="tracking-placeholder section">
                    <div className="container">
                        <div className="placeholder-content">
                            <Package size={64} />
                            <h3>أدخل رقم المرجع للبحث</h3>
                            <p>ستجد رقم المرجع في رسالة التأكيد التي استلمتها عند تقديم الطلب</p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}
