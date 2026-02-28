import React from 'react';
import { History, FileText, Languages } from 'lucide-react';

const HistoryPanel = ({ ocrHistory, translationHistory, loading }) => {
    // Combine, sort by date descending
    const history = [
        ...ocrHistory.map(item => ({ ...item, type: 'ocr' })),
        ...translationHistory.map(item => ({ ...item, type: 'trans' }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className="glass-panel animate-fade-in" style={{
            width: '100%',
            height: 'calc(100vh - 100px)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: '90px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ padding: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                    <History size={20} color="var(--text-main)" />
                </div>
                <h3 style={{ fontSize: '1.2rem' }}>Activity History</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>Loading history...</div>
                ) : history.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                        <History size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto' }} />
                        <p>No past activities found.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {history.map((item, index) => (
                            <div
                                key={`${item.type}-${item.id}-${index}`}
                                style={{
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    padding: '16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--glass-border)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {item.type === 'ocr' ? (
                                            <><FileText size={16} color="var(--accent-primary)" /><span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--accent-primary)' }}>OCR Scan</span></>
                                        ) : (
                                            <><Languages size={16} color="var(--accent-secondary)" /><span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--accent-secondary)' }}>Translation</span></>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {item.type === 'ocr' ? item.extracted_text : `"${item.original_text}" → "${item.translated_text}"`}
                                </div>

                                {item.type === 'ocr' && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                                        Document: {item.filename}
                                    </div>
                                )}
                                {item.type === 'trans' && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{item.source_language}</span>
                                        <span>→</span>
                                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{item.target_language}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;
