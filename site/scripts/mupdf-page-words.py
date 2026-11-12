"""Emit every page's words (with boxes, in PDF points from the top-left) as JSON.

Used by verify-scholarly-header.mjs as its MuPDF extractor. Needs PyMuPDF
(`pip install pymupdf`); exits 2 with a clear message when it is unavailable.
"""
import json
import sys

try:
    import pymupdf as mupdf
except ImportError:
    try:
        import warnings
        warnings.filterwarnings("ignore")
        import fitz as mupdf
    except ImportError:
        sys.stderr.write("PyMuPDF (MuPDF) is not installed: pip install pymupdf\n")
        sys.exit(2)

doc = mupdf.open(sys.argv[1])
pages = []
for number, page in enumerate(doc, 1):
    words = [[round(w[0], 2), round(w[1], 2), round(w[2], 2), round(w[3], 2), w[4]] for w in page.get_text("words")]
    pages.append({"page": number, "width": page.rect.width, "height": page.rect.height, "words": words})
json.dump({"mupdf": getattr(mupdf, "mupdf_version", None) or getattr(mupdf, "VersionBind", "unknown"),
           "pymupdf": getattr(mupdf, "__version__", None) or getattr(mupdf, "VersionBind", "unknown"),
           "pages": pages}, sys.stdout)
