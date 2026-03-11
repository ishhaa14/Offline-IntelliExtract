from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

MODEL_NAME = "facebook/nllb-200-distilled-600M"

# Lazy-load: model is NOT loaded at startup.
# It loads on the first translation request so uvicorn starts instantly.
_tokenizer = None
_model = None

def _get_model():
    global _tokenizer, _model
    if _tokenizer is None or _model is None:
        print("[translation_service] Loading NLLB-200 model... (first-time only)")
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        _model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
        print("[translation_service] Model loaded successfully.")
    return _tokenizer, _model


def translate_text(text: str, source_lang: str, target_lang: str) -> str:

    if not text.strip():
        return ""

    # NLLB does NOT support auto
    if source_lang == "auto":
        source_lang = "eng_Latn"

    tokenizer, model = _get_model()

    tokenizer.src_lang = source_lang

    inputs = tokenizer(
        text,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=512
    )

    forced_bos_token_id = tokenizer.convert_tokens_to_ids(target_lang)

    generated_tokens = model.generate(
        **inputs,
        forced_bos_token_id=forced_bos_token_id,
        max_new_tokens=512
    )

    return tokenizer.batch_decode(
        generated_tokens,
        skip_special_tokens=True
    )[0]