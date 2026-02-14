import { useState } from 'react'
import { Upload, FileText, CheckCircle, Download } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { jsPDF } from 'jspdf'
import './ShippingForm.css'

export default function ShippingForm() {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        passportNumber: '',
        fullAddress: '',
        postalCode: '',
        zipCode: '',
        vehicleModel: '',
        vinNumber: ''
    })
    const [photos, setPhotos] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPhotos(Array.from(e.target.files))
        }
    }

    const generatePDF = () => {
        const doc = new jsPDF()

        doc.setFont('helvetica')
        doc.setFontSize(20)
        doc.text('Shipping Form - Wahid Auto', 105, 20, { align: 'center' })

        doc.setFontSize(12)
        let y = 40

        doc.text(`Customer Name: ${formData.customerName}`, 20, y)
        y += 10
        doc.text(`Email: ${formData.customerEmail}`, 20, y)
        y += 10
        doc.text(`Phone: ${formData.customerPhone}`, 20, y)
        y += 10
        doc.text(`Passport Number: ${formData.passportNumber}`, 20, y)
        y += 15

        doc.text('Address:', 20, y)
        y += 10
        doc.text(`${formData.fullAddress}`, 20, y)
        y += 10
        doc.text(`Postal Code: ${formData.postalCode}`, 20, y)
        y += 10
        doc.text(`ZIP: ${formData.zipCode}`, 20, y)
        y += 15

        doc.text('Vehicle Information:', 20, y)
        y += 10
        doc.text(`Model: ${formData.vehicleModel}`, 20, y)
        y += 10
        doc.text(`VIN Number: ${formData.vinNumber}`, 20, y)
        y += 20

        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y)

        doc.save(`shipping-form-${formData.customerName.replace(/\s+/g, '-')}.pdf`)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Upload photos to Supabase Storage
            const photoUrls: string[] = []
            for (const photo of photos) {
                const fileName = `${Date.now()}-${photo.name}`
                const { data, error } = await supabase.storage
                    .from('shipping-photos')
                    .upload(fileName, photo)

                if (!error && data) {
                    const { data: urlData } = supabase.storage
                        .from('shipping-photos')
                        .getPublicUrl(fileName)
                    photoUrls.push(urlData.publicUrl)
                }
            }

            // Save form data
            const { error } = await supabase.from('shipping_forms').insert({
                customer_name: formData.customerName,
                customer_email: formData.customerEmail,
                customer_phone: formData.customerPhone,
                passport_number: formData.passportNumber,
                full_address: formData.fullAddress,
                postal_code: formData.postalCode,
                zip_code: formData.zipCode,
                vehicle_model: formData.vehicleModel,
                vin_number: formData.vinNumber,
                photos: photoUrls,
                status: 'pending'
            })

            if (error) throw error

            setSuccess(true)
        } catch (error) {
            console.error('Error:', error)
            alert('حدث خطأ. يرجى المحاولة مرة أخرى.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="shipping-page">
            {/* Hero */}
            <section className="shipping-hero">
                <div className="shipping-hero-bg"></div>
                <div className="container">
                    <div className="shipping-hero-content">
                        <span className="section-tag">نموذج الشحن</span>
                        <h1>معلومات الشحن</h1>
                        <p>أكمل المعلومات المطلوبة لإتمام عملية الشحن</p>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="shipping-form-section section">
                <div className="container">
                    {success ? (
                        <div className="success-card card">
                            <div className="success-icon">
                                <CheckCircle size={64} />
                            </div>
                            <h2>تم إرسال النموذج بنجاح!</h2>
                            <p>سنراجع معلوماتك ونتواصل معك قريباً</p>
                            <div className="success-actions">
                                <button className="btn btn-primary" onClick={generatePDF}>
                                    <Download size={20} />
                                    تحميل PDF
                                </button>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => {
                                        setSuccess(false)
                                        setFormData({
                                            customerName: '', customerEmail: '', customerPhone: '',
                                            passportNumber: '', fullAddress: '', postalCode: '',
                                            zipCode: '', vehicleModel: '', vinNumber: ''
                                        })
                                        setPhotos([])
                                    }}
                                >
                                    إرسال نموذج جديد
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="shipping-form card">
                            <h2>معلومات العميل</h2>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">الاسم الكامل *</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">البريد الإلكتروني *</label>
                                    <input
                                        type="email"
                                        name="customerEmail"
                                        value={formData.customerEmail}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">رقم الهاتف *</label>
                                    <input
                                        type="tel"
                                        name="customerPhone"
                                        value={formData.customerPhone}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">رقم جواز السفر *</label>
                                    <input
                                        type="text"
                                        name="passportNumber"
                                        value={formData.passportNumber}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <h3>عنوان التسليم</h3>

                            <div className="form-group">
                                <label className="form-label">العنوان الكامل *</label>
                                <textarea
                                    name="fullAddress"
                                    value={formData.fullAddress}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    rows={3}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">الرمز البريدي</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <h3>معلومات السيارة</h3>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">موديل السيارة *</label>
                                    <input
                                        type="text"
                                        name="vehicleModel"
                                        value={formData.vehicleModel}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">رقم الهيكل (VIN) *</label>
                                    <input
                                        type="text"
                                        name="vinNumber"
                                        value={formData.vinNumber}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <h3>صور السيارة</h3>

                            <div className="photo-upload">
                                <label className="upload-area">
                                    <Upload size={32} />
                                    <span>اضغط لرفع الصور</span>
                                    <small>يمكنك رفع عدة صور</small>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotoUpload}
                                        hidden
                                    />
                                </label>
                                {photos.length > 0 && (
                                    <div className="uploaded-files">
                                        {photos.map((photo, index) => (
                                            <div key={index} className="uploaded-file">
                                                <FileText size={16} />
                                                <span>{photo.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'جاري الإرسال...' : 'إرسال النموذج'}
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    )
}
