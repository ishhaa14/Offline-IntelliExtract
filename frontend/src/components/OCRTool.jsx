import React, { useState ,useEffect } from 'react';
import api from '../api';
import { Upload, FileText, Download, Loader2 } from 'lucide-react';

const OCRTool = ({ onNewHistory, restoreItem }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
  if (!restoreItem) return;

  // only restore if this history item is for OCR
  if (restoreItem.type !== "ocr") return;

  setExtractedText(restoreItem.extracted_text || "");

}, [restoreItem]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setError('');
    };

    const handleExtract = async () => {
        if (!selectedFile) {
            setError('Please select an image or PDF file first.');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await api.post('/ocr/extract', formData);

            setExtractedText(response.data.extracted_text);

            if (onNewHistory) onNewHistory();

        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.detail ||
                "Failed to extract text."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!extractedText) return;

        const blob = new Blob([extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `extracted_text_${Date.now()}.txt`;
        a.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                    <FileText size={20} color="var(--accent-primary)" />
                </div>
                <h3 style={{ fontSize: '1.2rem' }}>OCR Text Extractor</h3>
            </div>

            <div
                style={{
                    border: '2px dashed var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '30px',
                    textAlign: 'center',
                    background: 'rgba(15, 23, 42, 0.4)',
                    position: 'relative',
                    marginBottom: '20px'
                }}
            >
                <input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg, application/pdf"
                    onChange={handleFileChange}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                    }}
                />

                <Upload size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />

                <p style={{ fontWeight: 500 }}>
                    {selectedFile ? selectedFile.name : 'Select image or PDF'}
                </p>
            </div>

            {error && (
                <div style={{ color: '#fca5a5', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            <button
                className="btn btn-primary"
                onClick={handleExtract}
                disabled={loading || !selectedFile}
                style={{ padding: '12px', marginBottom: '20px' }}
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" /> Extracting...
                    </>
                ) : (
                    'Run Offline OCR'
                )}
            </button>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Extracted Text</label>

                    {extractedText && (
                        <button
                            className="btn btn-secondary"
                            onClick={handleDownload}
                            style={{ padding: '4px 12px', fontSize: '0.85rem' }}
                        >
                            <Download size={14} /> Download
                        </button>
                    )}
                </div>

                <textarea
                    className="form-input"
                    style={{ flex: 1, minHeight: '150px', resize: 'vertical', fontFamily: 'monospace' }}
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                />
            </div>
        </div>
    );
};

export default OCRTool;