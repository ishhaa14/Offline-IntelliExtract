import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import OCRTool from '../components/OCRTool';
import TranslationTool from '../components/TranslationTool';
import HistoryPanel from '../components/HistoryPanel';

const Dashboard = () => {
    const [ocrHistory, setOcrHistory] = useState([]);
    const [translationHistory, setTranslationHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [activeTab, setActiveTab] = useState('ocr'); // Default tab: OCR

    const fetchHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const token =
                localStorage.getItem("access_token") || localStorage.getItem("token");

            const [ocrRes, transRes] = await Promise.all([
                axios.get("/ocr/history", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("/translate/history", {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setOcrHistory(ocrRes.data.history || []);
            setTranslationHistory(transRes.data.history || []);

        } catch (error) {
            console.error("History error:", error.response?.status, error.response?.data);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return (
        <div style={{
            display: 'flex',
            padding: '24px 40px',
            gap: '30px',
            minHeight: 'calc(100vh - 80px)',
            flexDirection: 'row',
            flexWrap: 'wrap'
        }}>
            {/* Left Main Work Area (70%) */}
            <div style={{ flex: '1 1 70%', minWidth: '600px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Navigation Tabs */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <button
                        style={{
                            padding: '30px 50px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: activeTab === 'ocr' ? '#6366F1' : '#E5E7EB',
                            color: activeTab === 'ocr' ? 'white' : '#374151',
                            cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('ocr')}
                    >
                        OCR Text Extractor
                    </button>
                    <button
                        style={{
                            padding: '30px 50px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: activeTab === 'translator' ? '#EC4899' : '#E5E7EB',
                            color: activeTab === 'translator' ? 'white' : '#374151',
                            cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('translator')}
                    >
                        Local Neural Translator
                    </button>
                </div>

                {/* Render selected tool */}
                {activeTab === 'ocr' && <OCRTool onNewHistory={fetchHistory} />}
                {activeTab === 'translator' && <TranslationTool onNewHistory={fetchHistory} />}
            </div>

            {/* Right Side Activity Panel (30%) */}
            <div style={{ flex: '1 1 25%', minWidth: '350px' }}>
                <HistoryPanel
                    ocrHistory={ocrHistory}
                    translationHistory={translationHistory}
                    loading={loadingHistory}
                />
            </div>
        </div>
    );
};

export default Dashboard;