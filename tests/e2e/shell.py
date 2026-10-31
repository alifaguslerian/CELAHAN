"""Run against an already running production-mode W1 server."""

import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright, expect


DISCLAIMER = "Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan."
TRANSLATION = "A concept project for a portfolio and university coursework. Not a real service."
WIDTHS = [320, 360, 390, 768, 1024, 1440]


def run(base, artifacts, engines):
    origin = urlsplit(base)
    results = []
    external = []
    errors = []

    def guard(route):
        url = urlsplit(route.request.url)
        if (url.scheme, url.netloc) != (origin.scheme, origin.netloc):
            external.append(route.request.url)
            route.abort()
        else:
            route.continue_()

    with sync_playwright() as playwright:
        for engine in engines:
            browser = getattr(playwright, engine).launch(headless=True)
            print(f"Browser: {engine} {browser.version}", flush=True)
            for locale in ["id", "en"]:
                context = browser.new_context(viewport={"width": 1440, "height": 960}, service_workers="block")
                context.route("**/*", guard)
                page = context.new_page()
                page.on("pageerror", lambda error: errors.append(str(error)))
                response = page.goto(f"{base}/{locale}/")
                page.wait_for_load_state("networkidle")
                assert response.status == 200
                assert response.headers["x-content-type-options"] == "nosniff"
                assert response.headers["referrer-policy"] == "no-referrer"
                assert "frame-ancestors 'none'" in response.headers["content-security-policy"]
                assert "x-powered-by" not in response.headers
                assert page.locator("html").get_attribute("lang") == locale
                assert ("Kenali celah" if locale == "id" else "Recognize gaps") in page.title()
                assert page.locator("header").count() == page.locator("footer").count() == 1
                assert page.locator("main h1").count() == 1
                assert page.locator("footer p[lang='id']").inner_text() == DISCLAIMER
                if locale == "en":
                    assert page.locator("footer p[lang='en']").inner_text() == TRANSLATION
                assert page.locator("a[href*='/tickets'], a[href*='/projects'], input, form").count() == 0
                assert page.evaluate("localStorage.length + sessionStorage.length") == 0
                assert context.cookies() == []

                page.keyboard.press("Tab")
                assert page.locator(":focus").get_attribute("href") == "#main-content"
                page.keyboard.press("Enter")
                assert page.locator(":focus").get_attribute("id") == "main-content"

                for width in WIDTHS:
                    page.set_viewport_size({"width": width, "height": 960})
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), (engine, locale, width, "overflow")
                    for label in ["Bahasa Indonesia", "English"]:
                        box = page.get_by_role("link", name=label, exact=True).bounding_box()
                        assert box["height"] >= 44 and box["width"] >= 44
                    links = page.locator("header .account-links a")
                    for link in links.all():
                        assert link.bounding_box()["height"] >= 44
                    controls = [page.locator(".language-switch"), page.locator(".account-links")]
                    a, b = [control.bounding_box() for control in controls]
                    assert a["x"] + a["width"] <= b["x"] + 1, (locale, width, "account placement")
                    if width < 1024:
                        button = page.locator("button[aria-controls='site-navigation']")
                        expect(button).to_be_visible()
                        button.click()
                        expect(button).to_have_attribute("aria-expanded", "true")
                        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), (locale, width, "open-menu overflow")
                        page.keyboard.press("Tab")
                        assert page.locator(":focus").get_attribute("href") == f"/{locale}/"
                        page.keyboard.press("Escape")
                        expect(button).to_be_focused()
                        expect(button).to_have_attribute("aria-expanded", "false")
                        button.click()
                        nav = page.get_by_role("navigation", name="Navigasi utama" if locale == "id" else "Main navigation", exact=True)
                        nav.get_by_role("link").last.click()
                        expect(button).to_have_attribute("aria-expanded", "false")
                    else:
                        expect(page.get_by_role("button", name="Menu", exact=True)).to_be_hidden()

                page.set_viewport_size({"width": 1440, "height": 960})
                page.goto(f"{base}/{locale}/#about")
                other = "en" if locale == "id" else "id"
                page.get_by_role("link", name="English" if other == "en" else "Bahasa Indonesia", exact=True).click()
                page.wait_for_url(f"**/{other}/#about")
                page.wait_for_load_state("networkidle")
                for mode in ["login", "register"]:
                    page.goto(f"{base}/{locale}/{mode}/")
                    page.wait_for_load_state("networkidle")
                    assert page.locator("form, input").count() == 0
                    assert page.locator("meta[name='robots']").get_attribute("content") == "noindex, nofollow"
                    assert page.locator("header").count() == page.locator("footer").count() == 1
                    page.get_by_role("link", name="English" if other == "en" else "Bahasa Indonesia", exact=True).click()
                    page.wait_for_url(f"**/{other}/{mode}/")

                for path in [f"/{locale}/unknown-w1/", "/fr/"]:
                    response = page.goto(base + path)
                    assert response.status == 404, (path, response.status)
                response = context.request.get(base + "/", max_redirects=0)
                assert response.status == 307
                assert response.headers["location"] == "/id/"

                page.goto(f"{base}/{locale}/")
                page.wait_for_load_state("networkidle")
                page.set_viewport_size({"width": 320, "height": 640})
                page.emulate_media(reduced_motion="reduce")
                assert page.locator(".primary-action").first.evaluate("el => getComputedStyle(el).transitionDuration") == "0s"
                if engine == "chromium":
                    for size, width in [("desktop", 1440), ("phone", 320)]:
                        page.set_viewport_size({"width": width, "height": 960})
                        page.screenshot(path=str(artifacts / f"{locale}-{size}.png"), full_page=True)
                    page.set_viewport_size({"width": 720, "height": 480})
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                    page.evaluate("document.documentElement.style.zoom = '2'")
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), "200% CSS zoom overflow"
                results.append({"browser": engine, "locale": locale, "widths": WIDTHS, "result": "passed"})
                print(f"Passed: {engine} {locale} at {WIDTHS}", flush=True)
                context.close()

            for locale in ["id", "en"]:
                context = browser.new_context(java_script_enabled=False, viewport={"width": 320, "height": 850})
                context.route("**/*", guard)
                page = context.new_page()
                page.goto(f"{base}/{locale}/")
                assert page.locator("main h1").is_visible()
                assert page.locator("footer").is_visible()
                page.get_by_role("link", name="English" if locale == "id" else "Bahasa Indonesia", exact=True).click()
                assert page.locator("html").get_attribute("lang") != locale
                context.close()
            browser.close()

        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
        context.route("**/*", guard)
        page = context.new_page()
        page.goto(base + "/id/")
        page.get_by_role("button", name="Menu", exact=True).tap()
        page.get_by_role("navigation", name="Navigasi utama", exact=True).get_by_role("link", name="Tentang konsep").tap()
        page.wait_for_url("**/id/#about")
        context.close()
        for locale in ["id", "en"]:
            context = browser.new_context(viewport={"width": 1440, "height": 960})
            context.route("**/*", guard)
            page = context.new_page()
            page.goto(f"{base}/{locale}/")
            page.wait_for_load_state("networkidle")
            measurements = page.evaluate("""() => {
              const resources = performance.getEntriesByType('resource');
              return {
                jsBytes: resources.filter(r => new URL(r.name).pathname.endsWith('.js')).reduce((sum, r) => sum + r.encodedBodySize, 0),
                totalResourceBytes: resources.reduce((sum, r) => sum + r.encodedBodySize, 0),
                navigationBytes: performance.getEntriesByType('navigation')[0].encodedBodySize,
                fontRequests: resources.filter(r => /\\.(woff2?|ttf|otf)(?:$|\\?)/.test(r.name)).length
              };
            }""")
            assert measurements["fontRequests"] == 0
            assert measurements["jsBytes"] <= 250 * 1024, measurements
            assert measurements["totalResourceBytes"] + measurements["navigationBytes"] <= 1024 * 1024, measurements
            print(json.dumps({"locale": locale, "cold_load": measurements}), flush=True)
            context.close()
        browser.close()

    assert not external, f"Blocked external requests: {external}"
    assert not errors, f"Browser errors: {errors}"
    print(json.dumps({"checks": results, "external_requests": external, "page_errors": errors, "touch": "passed", "no_js": "passed", "zoom": "CSS 200%; native zoom not tested"}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", default="http://127.0.0.1:3100")
    parser.add_argument("--artifacts", type=Path, default=Path("test-results/w1"))
    parser.add_argument("--browsers", nargs="+", choices=["chromium", "firefox", "webkit"], default=["chromium", "firefox", "webkit"])
    args = parser.parse_args()
    url = urlsplit(args.base)
    if url.scheme != "http" or url.hostname not in ["127.0.0.1", "localhost"] or url.path:
        parser.error("Use a local HTTP origin without a path.")
    args.artifacts.mkdir(parents=True, exist_ok=True)
    run(args.base.rstrip("/"), args.artifacts, args.browsers)
