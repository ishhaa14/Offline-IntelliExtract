import React, { useState, useEffect } from "react";
import api from "../api";
import { Languages, ArrowRightLeft, Download, Loader2, Upload } from "lucide-react";

/* ------------------------------
   Target + normal language list
--------------------------------*/
const LANGUAGES = [
  { code: "eng_Latn", label: "English" },
  { code: "hin_Deva", label: "Hindi" },
  { code: "kan_Knda", label: "Kannada" },
  { code: "tam_Taml", label: "Tamil" },
  { code: "tel_Telu", label: "Telugu" },
  { code: "mal_Mlym", label: "Malayalam" },
  { code: "ben_Beng", label: "Bengali" },
  { code: "guj_Gujr", label: "Gujarati" },
  { code: "pan_Guru", label: "Punjabi" },
  { code: "ory_Orya", label: "Odia" },
  { code: "mar_Deva", label: "Marathi" }
];

/* ------------------------------
   Source languages (Roman only here)
--------------------------------*/
const SOURCE_LANGUAGES = [
  { code: "roman", label: "Roman (Type in English letters)" },
  ...LANGUAGES
];

const TranslationTool = ({ onNewHistory, restoreItem }) => {

  const [inputType, setInputType] = useState("text");
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [file, setFile] = useState(null);

  const [sourceLang, setSourceLang] = useState("eng_Latn");
  const [targetLang, setTargetLang] = useState("hin_Deva");

  const [romanLanguage, setRomanLanguage] = useState("hin_Deva");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!restoreItem) return;

  // only restore if this history item is for translation
  if (restoreItem.type !== "translation") return;

  setSourceText(restoreItem.original_text || "");
  setSourceLang(restoreItem.source_language || "");
  setTargetLang(restoreItem.target_language || "");
  setTargetText(restoreItem.translated_text || "");

}, [restoreItem]);

  /* ------------------------------
      Translate TEXT
  --------------------------------*/
  const handleTranslateText = async () => {

    if (!sourceText.trim()) {
      setError("Please enter text to translate.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const payload = {
        original_text: sourceText,
        source_language: sourceLang,
        target_language: targetLang
      };

      if (sourceLang === "roman") {
        payload.roman_language = romanLanguage;
      }

      const res = await api.post("/translate/execute", payload);

      setTargetText(res.data.translated_text);

      if (onNewHistory) onNewHistory();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Translation failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------
      Translate FILE
  --------------------------------*/
  const handleTranslateFile = async () => {

    if (!file) {
      setError("Please choose a file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const form = new FormData();
form.append("file", file);
form.append("target_lang", targetLang);   // ← must match backend

const res = await api.post("/translate/file", form, {
  headers: { "Content-Type": "multipart/form-data" }
});

      setTargetText(res.data.translated_text);

      if (onNewHistory) onNewHistory();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "File translation failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------ */

  const handleSwap = () => {

    if (sourceLang === "roman") return;

    setSourceLang(targetLang);
    setTargetLang(sourceLang);

    if (inputType === "text") {
      setSourceText(targetText);
    }

    setTargetText("");
  };

  const handleDownload = () => {
    if (!targetText) return;

    const blob = new Blob([targetText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `translation_${Date.now()}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  /* ✅ Roman must be shown only in TEXT mode */
  const sourceLanguageList =
    inputType === "text"
      ? SOURCE_LANGUAGES
      : LANGUAGES;

  return (
    <div className="glass-panel" style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ padding: 8, background: "rgba(236,72,153,0.1)", borderRadius: 8 }}>
          <Languages size={20} />
        </div>
        <h3 style={{ fontSize: "1.2rem" }}>Local Neural Translator</h3>
      </div>

      {/* Mode */}
      <div style={{ marginBottom: 16 }}>
        <label className="form-label">Translate using</label>
        <select
          className="form-input"
          value={inputType}
          onChange={(e) => {

            const newType = e.target.value;

            setInputType(newType);
            setError("");
            setTargetText("");
            setFile(null);

            /* ✅ if switching to file, roman must be removed */
            if (newType === "file" && sourceLang === "roman") {
              setSourceLang("eng_Latn");
            }
          }}
        >
          <option value="text">Text</option>
          <option value="file">PDF / DOC / DOCX / TXT</option>
        </select>
      </div>

      {/* Languages */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>

        {/* SOURCE */}
        <div style={{ flex: 1 }}>

          <label className="form-label">Source</label>

          <select
            className="form-input"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
          >
            {sourceLanguageList.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* ✅ Roman typing language (TEXT only + roman only) */}
          {inputType === "text" && sourceLang === "roman" && (
            <div style={{ marginTop: 8 }}>
              <label className="form-label">Roman typing language</label>

              <select
                className="form-input"
                value={romanLanguage}
                onChange={(e) => setRomanLanguage(e.target.value)}
              >
                {LANGUAGES
                  .filter(l => l.code !== "eng_Latn")
                  .map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
              </select>
            </div>
          )}

        </div>

        <button
          className="btn btn-secondary"
          onClick={handleSwap}
          style={{ padding: 12, marginTop: 24, borderRadius: 999 }}
          disabled={sourceLang === "roman"}
        >
          <ArrowRightLeft size={18} />
        </button>

        {/* TARGET */}
        <div style={{ flex: 1 }}>
          <label className="form-label">Target</label>

          <select
            className="form-input"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Input + Output */}
      <div style={{ display: "flex", gap: 16, flex: 1 }}>

        {/* LEFT SIDE */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {inputType === "text" && (
            <textarea
              className="form-input"
              style={{ flex: 1, minHeight: 220, resize: "none" }}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={
                sourceLang === "roman"
                  ? "Type using English letters (Roman typing)..."
                  : "Type or paste text here..."
              }
            />
          )}

          {inputType === "file" && (
            <div
              style={{
                flex: 1,
                minHeight: 220,
                border: "2px dashed var(--glass-border)",
                borderRadius: "var(--radius-md)",
                padding: 30,
                textAlign: "center",
                background: "rgba(15, 23, 42, 0.4)",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 12
              }}
            >

              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer"
                }}
              />

              <Upload size={36} style={{ margin: "0 auto" }} />

              <div style={{ fontWeight: 500 }}>
                {file ? file.name : "Select a file"}
              </div>

              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Supports PDF, DOC, DOCX, TXT
              </div>
            </div>
          )}

        </div>

        {/* OUTPUT */}
        <textarea
          className="form-input"
          style={{
            flex: 1,
            minHeight: 220,
            resize: "none",
            background: "rgba(30,41,59,0.4)"
          }}
          value={targetText}
          readOnly
          placeholder="Translated output..."
        />

      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>

        {error && <div style={{ color: "#fca5a5" }}>{error}</div>}

        <div style={{ display: "flex", gap: 12, marginLeft: "auto" }}>

          {targetText && (
            <button className="btn btn-secondary" onClick={handleDownload}>
              <Download size={18} /> Save
            </button>
          )}

          {inputType === "text" && (
            <button className="btn btn-primary" onClick={handleTranslateText} disabled={loading}>
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Translating...</>
                : "Translate Text"}
            </button>
          )}

          {inputType === "file" && (
            <button className="btn btn-primary" onClick={handleTranslateFile} disabled={loading}>
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Translating...</>
                : "Translate File"}
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default TranslationTool;