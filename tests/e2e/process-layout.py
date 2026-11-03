"""Read-only checks for both conceptual process presentations on the local server."""

from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

BASE = 'http://127.0.0.1:3100'
ARTIFACTS = Path('test-results/process-revision')
ARTIFACTS.mkdir(parents=True, exist_ok=True)
DESKTOPS = [(1024, 768), (1366, 640), (1366, 768), (1536, 704), (1920, 1080)]
errors, external, fits = [], [], []


def guard(route):
    if urlsplit(route.request.url).netloc != '127.0.0.1:3100':
        external.append('outside-origin request')
        route.abort()
    else:
        route.continue_()


def readable(page):
    assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth')
    for text in page.locator('.process-grid h2, .process-grid h3, .process-grid p').all():
        assert text.evaluate('el => el.scrollWidth <= el.clientWidth && el.scrollHeight <= el.clientHeight')


with sync_playwright() as p:
    browser = p.chromium.launch()
    print('Chromium:', browser.version, flush=True)
    for locale in ['id', 'en']:
        context = browser.new_context(service_workers='block', reduced_motion='reduce')
        context.route('**/*', guard)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(f'{BASE}/{locale}/process/')
        page.wait_for_load_state('networkidle')
        page.evaluate('document.fonts.ready')
        assert page.get_by_role('banner').count() == 1
        assert page.locator('.process-grid h2').count() == 8
        assert page.locator('.process-grid li').evaluate_all('(els) => els.map(el => el.id)') == [f'stage-{n}' for n in range(1, 9)]
        stages = page.locator('.process-grid li').all_inner_texts()
        for width, height in DESKTOPS:
            page.set_viewport_size({'width': width, 'height': height})
            readable(page)
            end = page.locator('.process-endnote').bounding_box()
            assert end['y'] + end['height'] <= height - 12, (locale, width, height, end)
            assert page.locator('.page-intro').bounding_box()['y'] >= page.locator('.site-header').bounding_box()['height']
            page.screenshot(path=str(ARTIFACTS / f'{locale}-process-{width}x{height}.png'))
            fits.append((locale, width, height))
        for width in [320, 390, 768]:
            page.set_viewport_size({'width': width, 'height': 844})
            readable(page)
        page.screenshot(path=str(ARTIFACTS / f'{locale}-process-tablet.png'), full_page=True)
        page.set_viewport_size({'width': 390, 'height': 844})
        page.screenshot(path=str(ARTIFACTS / f'{locale}-process-phone.png'), full_page=True)
        page.add_style_tag(content='html { font-size: 200%; }')
        readable(page)
        assert page.locator('.process-grid li').count() == 8
        page.locator('.process-endnote a').focus()
        assert page.locator('.process-endnote a').evaluate('el => getComputedStyle(el).outlineStyle') != 'none'
        page.keyboard.press('Enter')
        page.wait_for_url(f'**/{locale}/report/')
        page.goto(f'{BASE}/{locale}/')
        page.wait_for_load_state('networkidle')
        assert page.locator('#process .process-grid li').all_inner_texts() == stages
        assert page.locator('#process .process-grid h3').count() == 8
        for width, height in DESKTOPS:
            page.set_viewport_size({'width': width, 'height': height})
            readable(page)
            page.locator('#process').evaluate("el => el.scrollIntoView({block: 'start'})")
            box = page.locator('#process').bounding_box()
            assert box['y'] >= 0 and box['y'] + box['height'] <= height, (locale, width, height, box)
            page.screenshot(path=str(ARTIFACTS / f'{locale}-home-process-{width}x{height}.png'))
        for width in [320, 390, 768]:
            page.set_viewport_size({'width': width, 'height': 844})
            readable(page)
        page.locator('#process .text-link').focus()
        page.keyboard.press('Enter')
        page.wait_for_url(f'**/{locale}/process/')
        context.close()

        nojs = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
        nojs.route('**/*', guard)
        page = nojs.new_page()
        page.goto(f'{BASE}/{locale}/')
        page.locator('#process .text-link').click()
        assert page.url.endswith(f'/{locale}/process/')
        assert page.locator('.process-grid li').all_inner_texts() == stages
        page.locator('.process-endnote a').click()
        assert page.url.endswith(f'/{locale}/report/')
        nojs.close()
    browser.close()

assert not errors, errors
assert not external, external
print({'result': 'PASS', 'desktop_fits_per_view': fits, 'reflow': [320, 390, 768], 'css_text_enlargement': '200%', 'no_js': 'passed', 'page_errors': len(errors), 'outside_requests': len(external)}, flush=True)
