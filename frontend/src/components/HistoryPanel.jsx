import { useEffect, useState } from "react";
import api from "../api";
import "./ActivityHistory.css";

export default function ActivityHistory() {

  const [ocr, setOcr] = useState([]);
  const [tr, setTr] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
const [confirmDownload, setConfirmDownload] = useState(null);

  const load = () => {
    api.get("/ocr/history").then(r => setOcr(r.data));
    api.get("/translate/history").then(r => setTr(r.data));
  };

  useEffect(() => {
    load();
  }, []);

  const all = [
    ...ocr.map(i => ({ ...i, type: "ocr" })),
    ...tr.map(i => ({ ...i, type: "translate" }))
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));


  async function deleteItem(item, e) {
    e.stopPropagation();

    if (item.type === "ocr") {
      await api.delete(`/ocr/history/${item.id}`);
    } else {
      await api.delete(`/translate/history/${item.id}`);
    }

    load();
  }


  return (
    <div className="history-page">

      <h3>Activity History</h3>

      <div className="history-scroll">

        {all.map(item => (
          <div
            key={`${item.type}-${item.id}`}
            className="history-card"
            onClick={() => setSelected(item)}
          >

            <span
              className="delete-btn"
              onClick={(e) => deleteItem(item, e)}
            >
              ✕
            </span>

            <div className="title">
              {item.type === "ocr" ? "OCR" : "Translation"}
            </div>

            <div className="sub">
              {item.type === "ocr"
                ? item.filename || "File"
                : `${item.source_language} → ${item.target_language}`
              }
            </div>

            <div className="preview">
              {item.type === "ocr"
                ? item.extracted_text?.slice(0, 80)
                : item.original_text?.slice(0, 80)
              }
              <div className="time">
  {new Date(item.created_at).toLocaleString()}
</div>
            </div>

          </div>
        ))}

      </div>

      {selected && (
        <Popup
          item={selected}
          onClose={() => setSelected(null)}
        />
      )}

    </div>
  );
}



/* ---------------- popup ---------------- */

function Popup({ item, onClose }) {

  function downloadFile() {

    let content = "";
    let filename = "";

    if (item.type === "ocr") {
      content = item.extracted_text || "";
      filename = (item.filename || "ocr_output") + ".txt";
    } else {

      content =
`Source language : ${item.source_language}
Target language : ${item.target_language}

----- Original -----
${item.original_text}

----- Translated -----
${item.translated_text}
`;

      filename = "translation_output.txt";
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="popup-bg">
      <div className="popup">

        <h4>{item.type === "ocr" ? "OCR Activity" : "Translation Activity"}</h4>

        {item.type === "ocr" && (
          <>
            <b>File</b>
            <div>{item.filename}</div>

            <b>Extracted Text</b>
            <pre>{item.extracted_text}</pre>
          </>
        )}

        {item.type === "translate" && (
          <>
            <b>From</b> {item.source_language}<br />
            <b>To</b> {item.target_language}

            <b>Original</b>
            <pre>{item.original_text}</pre>

            <b>Translated</b>
            <pre>{item.translated_text}</pre>
          </>
        )}

        <div className="actions">
          <button onClick={downloadFile}>
            Download output file
          </button>
          <button onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}