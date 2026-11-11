"""Paper C acceptance fixture. Review data comes from the pinned source and design."""
from copy import deepcopy
import hashlib
import json
import re
import subprocess
import sys
import unicodedata
from itertools import accumulate
from pathlib import Path

import fitz
from lxml import html
from PIL import Image, ImageDraw
from pypdf import PdfReader

private, design, out = map(Path, sys.argv[1:])
out.mkdir(exist_ok=True)
approved = json.loads(design.read_text())
config = json.loads((private / "paper-c.json").read_text())
concept = config["identity"]["conceptDoi"]
version = config["identity"]["versionDoi"]
note = config["identity"]["printAuthorNote"]
orcid = approved["orcid"]


def norm(text):
    return "".join(c for c in unicodedata.normalize("NFKC", text).casefold() if c.isalnum())


def text(node):
    return " ".join(node.text_content().split())


def assert_metadata(page, manifest):
    canonical = page.xpath('//link[@rel="canonical"]/@href')
    citation = {name: page.xpath(f'//meta[@name="{name}"]/@content')
                for name in ("citation_title", "citation_author", "citation_doi", "citation_pdf_url", "citation_publication_date")}
    url = "https://amulbham.com" + manifest["route"]
    assert page.xpath('//meta[@name="robots"]/@content') == ["noindex, nofollow"]
    assert page.xpath('//a[@href="' + version + '"]') == []
    assert page.xpath('//div[contains(@class,"masthead")]//a[@href="' + concept + '"]')
    if manifest["mode"] == "candidate":
        assert not canonical and not any(citation.values())
        assert not page.xpath('//script[@type="application/ld+json"]')
        assert page.xpath('//p[@class="pdf-link"]/a/@href') == ["./" + manifest["artifact"]]
        assert not page.xpath('//article//time')
        assert page.xpath('//p[@class="candidate-status"]')
    else:
        assert canonical == [url]
        assert all(len(value) == 1 for value in citation.values())
        assert citation["citation_title"] == [text(page.xpath("//h1")[0])]
        assert citation["citation_author"] == ["Amul Bham"]
        assert citation["citation_doi"] == [concept.removeprefix("https://doi.org/")]
        assert citation["citation_publication_date"] == [manifest["previewDate"].replace("-", "/")]
        assert citation["citation_pdf_url"] == [url + manifest["artifact"]]
        assert page.xpath('//p[@class="pdf-link"]/a/@href') == citation["citation_pdf_url"]
        jsonld = [json.loads(node.text) for node in page.xpath('//script[@type="application/ld+json"]')]
        article = next(item for item in jsonld if "ScholarlyArticle" in item["@type"])
        assert article["identifier"]["value"] == citation["citation_doi"][0]
        assert article["encoding"]["contentUrl"] == citation["citation_pdf_url"][0]
        assert article["url"] == article["mainEntityOfPage"]["@id"] == url
        assert article["license"] == "https://creativecommons.org/licenses/by/4.0/"
        assert not page.xpath('//p[@class="candidate-status"]')


def assert_content(page):
    assert len(page.xpath('//*[@id and starts-with(@id,"primitive-")]')) == 25
    assert len(page.xpath('//li[starts-with(@id,"ref-")]')) == 55
    assert len(page.xpath('//article//table[not(caption)]')) == 16
    findings = page.xpath('//section[@class="key-findings"]/ul/li')
    assert [norm(text(item)) for item in findings] == [norm(item) for item in approved["findings"]]
    assert norm("Keywords") in norm(text(findings[0].xpath('ancestor::section/preceding-sibling::p[1]')[0]))
    assert len(page.xpath('//section[contains(@class,"scholarly-pdf-note")]')) == 1
    assert len(page.xpath('//section[@class="author-note"]')) == 1
    assert note in text(page.xpath('//section[contains(@class,"scholarly-pdf-note")]')[0])
    for suffix, number, doi in [("a", 8, "20531589"), ("b", 9, "23068821")]:
        links = page.xpath(f'//a[contains(.,"Bham, 2026{suffix}")]/@href')
        assert links and set(links) == {f"#ref-{number}"}
        assert page.xpath(f'//li[@id="ref-{number}"]//a/@href') == [f"https://doi.org/10.5281/zenodo.{doi}"]
    original = page.xpath('//div[contains(@class,"scholarly-screen-table")]/table')[0]
    assert [text(th) for th in original.xpath('./thead/tr/th')] == approved["table_headers"]
    assert [[text(td) for td in row] for row in original.xpath('./tbody/tr')] == approved["table_rows"]
    panels = page.xpath('//div[contains(@class,"scholarly-print-panel")]/table')
    plans = config["projection"]["printTables"][0]["panels"]
    assert len(panels) == len(plans) == 2
    for panel, plan in zip(panels, plans):
        assert [text(th) for th in panel.xpath('./thead/tr/th')] == [approved["table_headers"][i] for i in plan["columns"]]
        assert [[text(td) for td in row] for row in panel.xpath('./tbody/tr')] == [
            [record[i] for i in plan["columns"]] for record in approved["table_rows"]]


def check_print_table(page, plan):
    words = page.get_text("words")
    caption = page.search_for(plan["caption"])[0]
    indices = sorted([w for w in words if 65 < w[0] < 82 and w[1] > caption.y1
                      and re.fullmatch("[1-7]", w[4])], key=lambda w: w[1])
    assert [w[4] for w in indices] == list("1234567")
    boundaries = [64.8 + pct * 4.824 for pct in accumulate((0, *plan["widths"]))]
    reading_note = page.search_for("Reading note:")
    y = [caption.y1, *(word[1] - 3 for word in indices), reading_note[0].y0 if reading_note else 730]
    for row, values in enumerate((approved["table_headers"], *approved["table_rows"])):
        for col, original in enumerate(plan["columns"]):
            left, right = boundaries[col:col + 2]
            selected = sorted([word for word in words if left <= (word[0] + word[2]) / 2 < right
                               and y[row] <= (word[1] + word[3]) / 2 < y[row + 1]],
                              key=lambda word: (word[5], word[6], word[7]))
            actual = " ".join(word[4] for word in selected)
            assert norm(actual) == norm(values[original]), (page.number + 1, row, col, actual, values[original])
            assert actual.count("≠") == values[original].count("≠")
            assert all(left - .5 <= word[0] <= word[2] <= right + .5 for word in selected)


def raster(document, evidence, special):
    for tag, number in special.items():
        document[number - 1].get_pixmap(dpi=120, alpha=False).save(evidence / f"{tag}.png")
    for start in range(0, len(document), 12):
        sheet = Image.new("RGB", (900, 1260), "white")
        for i, page in enumerate(document[start:start + 12]):
            pixels = page.get_pixmap(matrix=fitz.Matrix(.45, .45), alpha=False)
            image = Image.frombytes("RGB", (pixels.width, pixels.height), pixels.samples)
            image.thumbnail((286, 290))
            x, y = i % 3 * 300 + 8, i // 3 * 315 + 5
            sheet.paste(image, (x, y))
            ImageDraw.Draw(sheet).text((x, y + 292), str(start + i + 1), fill="black")
        sheet.save(evidence / f"contact-{start + 1:02d}.jpg", quality=90)


def expect_rejection(check, original, change):
    mutated = deepcopy(original)
    change(mutated)
    try:
        check(mutated)
    except AssertionError:
        return
    raise AssertionError("Mutated scholarly page passed validation")


results = {}
for mode in ("candidate", "final-form"):
    root = private / f"checked-{mode}"
    target = out / mode
    target.mkdir(exist_ok=True)
    manifest = json.loads((root / "manifest.json").read_text())
    artifact = root / manifest["artifact"]
    page = html.fromstring((root / "html" / manifest["route"].strip("/") / "index.html").read_text(encoding="utf-8"))
    assert hashlib.sha256(artifact.read_bytes()).hexdigest() == manifest["sha256"]
    assert_metadata(page, manifest)
    assert_content(page)
    if mode == "candidate":
        expect_rejection(lambda p: assert_metadata(p, manifest), page,
                         lambda p: p.xpath('//meta[@name="robots"]')[0].set("content", "index, follow"))
        expect_rejection(lambda p: assert_metadata(p, manifest), page,
                         lambda p: p.xpath('//p[@class="pdf-link"]/a')[0].set("href", "https://amulbham.com" + manifest["route"] + manifest["artifact"]))
    else:
        expect_rejection(lambda p: assert_metadata(p, manifest), page,
                         lambda p: p.xpath('//meta[@name="citation_doi"]')[0].set("content", version.removeprefix("https://doi.org/")))
        expect_rejection(lambda p: assert_metadata(p, manifest), page,
                         lambda p: p.xpath('//meta[@name="citation_publication_date"]')[0].drop_tree())
        expect_rejection(assert_content, page,
                         lambda p: p.xpath('//article//table[not(caption)]')[0].drop_tree())
    for sitemap in (root / "html").glob("sitemap*.xml"):
        assert manifest["route"] not in sitemap.read_text()
    reader = PdfReader(artifact)
    annotations = [link.get_object() for p in reader.pages for link in p.get("/Annots", [])]
    destinations = {str(link["/Dest"]) for link in annotations if isinstance(link.get("/Dest"), str)}
    pdf_refs = {re.search(r"ref-(\d+)$", d).group(1) for d in destinations if re.search(r"ref-(\d+)$", d)}
    assert {"8", "9"} <= pdf_refs
    for n, phrase in ((8, "The invariants of self-organizing systems"), (9, "Cognition as a self-organizing system")):
        destination = next(d for name, d in reader.named_destinations.items() if name.endswith(f"ref-{n}"))
        assert norm(phrase) in norm(reader.pages[reader.get_destination_page_number(destination)].extract_text())
    uris = {str(link["/A"]["/URI"]) for link in annotations if "/A" in link and "/URI" in link["/A"]}
    assert {concept, orcid, "https://doi.org/10.5281/zenodo.20531589", "https://doi.org/10.5281/zenodo.23068821"} <= uris
    with fitz.open(artifact) as doc:
        texts = [p.get_text() for p in doc]
        assert all(tuple(p.rect)[2:] == (612, 792) and len(texts[i].split()) > 10 for i, p in enumerate(doc))
        for p in doc:
            assert all(fitz.Rect(word[:4]) in p.rect for word in p.get_text("words"))
        opening = texts[0]
        assert "v4.6" not in opening
        if mode == "final-form":
            assert f"DOI: {concept}" in opening
            assert not any("Candidate specimen" in t or "public verification pending" in t for t in texts)
        else:
            assert "Candidate specimen" in opening
        table_pages = {}
        for plan in config["projection"]["printTables"][0]["panels"]:
            index = next(i for i, t in enumerate(texts) if plan["caption"] in t)
            check_print_table(doc[index], plan)
            table_pages[plan["caption"]] = index + 1
        findings = next(i for i, t in enumerate(texts) if "Key findings" in t)
        assert texts[findings].index("Keywords:") < texts[findings].index("Key findings")
        for item in approved["findings"]:
            assert norm(item) in norm(texts[findings])
        closing = next(i for i, t in enumerate(texts) if "About the Author" in t)
        assert norm(note) in norm(texts[closing])
        assert orcid in {link.get("uri") for link in doc[closing].get_links()}
        assert sum(t.count("About the Author") for t in texts) == 1
        raster(doc, target, {"opening": 1, "findings": findings + 1, "table-1": min(table_pages.values()),
                            "table-2": max(table_pages.values()), "closing": closing + 1})
    errors = target / "poppler-warnings.txt"
    with errors.open("w") as stderr:
        poppler = subprocess.check_output(["pdftotext", str(artifact), "-"], stderr=stderr, text=True)
        fonts = subprocess.check_output(["pdffonts", str(artifact)], stderr=stderr, text=True)
    (target / "fonts.txt").write_text(fonts)
    assert all(re.search(r'\byes\s+yes\s+yes\s+\d+\s+\d+\s*$', line) for line in fonts.splitlines()[2:])
    for extracted in (poppler, "\n".join(texts)):
        assert norm(note) in norm(extracted)
        assert "≠" in extracted and "×" in extracted
    results[mode] = dict(sha256=manifest["sha256"], pages=len(texts), appendix=table_pages, findings=findings + 1,
                         closing=closing + 1, htmlRefs=55, pdfLinkedRefCount=len(pdf_refs),
                         tagged=bool(reader.trailer["/Root"].get("/StructTreeRoot")),
                         popplerWarnings=len(errors.read_text().splitlines()), extraction=["MuPDF", "Poppler"], rejectedHtmlMutations=2 if mode == "candidate" else 3)
(out / "paper-qa.json").write_text(json.dumps(results, indent=2) + "\n")
print(json.dumps(results, indent=2))
