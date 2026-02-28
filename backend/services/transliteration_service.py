from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate


LANG_MAP = {
    "hin_Deva": sanscript.DEVANAGARI,
    "kan_Knda": sanscript.KANNADA,
    "tam_Taml": sanscript.TAMIL,
    "tel_Telu": sanscript.TELUGU,
    "mal_Mlym": sanscript.MALAYALAM,
    "ben_Beng": sanscript.BENGALI,
    "guj_Gujr": sanscript.GUJARATI,
    "pan_Guru": sanscript.GURMUKHI,
    "ory_Orya": sanscript.ORIYA,
    "mar_Deva": sanscript.DEVANAGARI,
}


def transliterate_roman_to_native(text: str, target_lang: str):

    if target_lang not in LANG_MAP:
        return text

    return transliterate(
        text,
        sanscript.ITRANS,
        LANG_MAP[target_lang]
    )