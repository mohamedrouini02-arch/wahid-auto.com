import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, X, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './DocumentsUpload.css'

interface UploadedDoc {
    name: string
    type: string
    url: string
    status: 'uploading' | 'success' | 'error'
}

export default function DocumentsUpload() {
    const [referenceNumber, setReferenceNumber] = useState('')
    const [documents, setDocuments] = useState<UploadedDoc[]>([])
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const documentTypes = [
        { id: 'passport', label: 'جواز السفر' },
        { id: 'id_card', label: 'بطاقة التعريف الوطنية' },
        { id: 'residence', label: 'شهادة الإقامة' },
        { id: 'license', label: 'رخصة السياقة' },
        { id: 'other', label: 'وثيقة أخرى' }
    ]

    const [selectedDocType, setSelectedDocType] = useState(documentTypes[0].id)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !referenceNumber.trim()) return

        setUploading(true)
        const file = e.target.files[0]
        const fileName = `${referenceNumber}/${selectedDocType}-${Date.now()}-${file.name}`

        // Add to list with uploading status
        const newDoc: UploadedDoc = {
            name: file.name,
            type: selectedDocType,
            url: '',
            status: 'uploading'
        }
        setDocuments(prev => [...prev, newDoc])

        try {
            const { error } = await supabase.storage
                .from('documents')
                .upload(fileName, file)

            if (error) throw error

            const { data: urlData } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName)

            // Save to database
            await supabase.from('documents').insert({
                order_id: referenceNumber,
                document_type: selectedDocType,
                file_url: urlData.publicUrl,
                file_name: file.name
            })

            // Update status
            setDocuments(prev => prev.map(d =>
                d.name === file.name && d.status === 'uploading'
                    ? { ...d, url: urlData.publicUrl, status: 'success' }
                    : d
            ))
        } catch (error) {
            console.error('Error:', error)
            setDocuments(prev => prev.map(d =>
                d.name === file.name && d.status === 'uploading'
                    ? { ...d, status: 'error' }
                    : d
            ))
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const removeDocument = (docName: string) => {
        setDocuments(prev => prev.filter(d => d.name !== docName))
    }

    return (
        <div className="documents-page">
            {/* Hero */}
            <section className="documents-hero">
                <div className="documents-hero-bg"></div>
                <div className="container">
                    <div className="documents-hero-content">
                        <span className="section-tag">الوثائق</span>
                        <h1>رفع الوثائق المطلوبة</h1>
                        <p>ارفع الوثائق اللازمة لإتمام عملية التخليص الجمركي</p>
                    </div>
                </div>
            </section>

            {/* Upload Section */}
            <section className="upload-section section">
                <div className="container">
                    <div className="upload-container card">
                        {/* Reference Number */}
                        <div className="ref-input-section">
                            <h3>أدخل رقم المرجع الخاص بك</h3>
                            <input
                                type="text"
                                placeholder="مثال: WA-2026-ABC123"
                                value={referenceNumber}
                                onChange={e => setReferenceNumber(e.target.value)}
                                className="form-input ref-input"
                            />
                        </div>

                        {referenceNumber.trim() && (
                            <>
                                {/* Document Type Selector */}
                                <div className="doc-type-section">
                                    <h3>اختر نوع الوثيقة</h3>
                                    <div className="doc-type-grid">
                                        {documentTypes.map(type => (
                                            <button
                                                key={type.id}
                                                className={`doc-type-btn ${selectedDocType === type.id ? 'active' : ''}`}
                                                onClick={() => setSelectedDocType(type.id)}
                                            >
                                                <FileText size={20} />
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Upload Area */}
                                <div className="upload-area-section">
                                    <label className="upload-dropzone">
                                        <Upload size={40} />
                                        <span>اسحب الملفات هنا أو اضغط للرفع</span>
                                        <small>PDF, JPG, PNG - حد أقصى 10MB</small>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                            hidden
                                        />
                                    </label>
                                </div>

                                {/* Uploaded Documents */}
                                {documents.length > 0 && (
                                    <div className="uploaded-docs-section">
                                        <h3>الوثائق المرفوعة</h3>
                                        <div className="uploaded-docs-list">
                                            {documents.map((doc, index) => (
                                                <div key={index} className={`uploaded-doc-item ${doc.status}`}>
                                                    <div className="doc-info">
                                                        <FileText size={20} />
                                                        <div>
                                                            <span className="doc-name">{doc.name}</span>
                                                            <span className="doc-type">
                                                                {documentTypes.find(t => t.id === doc.type)?.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="doc-status">
                                                        {doc.status === 'uploading' && (
                                                            <span className="spinner" style={{ width: '20px', height: '20px' }}></span>
                                                        )}
                                                        {doc.status === 'success' && (
                                                            <CheckCircle size={20} className="status-success" />
                                                        )}
                                                        {doc.status === 'error' && (
                                                            <AlertCircle size={20} className="status-error" />
                                                        )}
                                                        {doc.status !== 'uploading' && (
                                                            <button
                                                                className="remove-doc"
                                                                onClick={() => removeDocument(doc.name)}
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Instructions */}
                        <div className="instructions-section">
                            <h3>الوثائق المطلوبة</h3>
                            <ul>
                                <li>
                                    <CheckCircle size={16} />
                                    <span>نسخة واضحة من جواز السفر</span>
                                </li>
                                <li>
                                    <CheckCircle size={16} />
                                    <span>نسخة من بطاقة التعريف الوطنية (الوجهين)</span>
                                </li>
                                <li>
                                    <CheckCircle size={16} />
                                    <span>شهادة الإقامة حديثة</span>
                                </li>
                                <li>
                                    <CheckCircle size={16} />
                                    <span>نسخة من رخصة السياقة (إن وجدت)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
