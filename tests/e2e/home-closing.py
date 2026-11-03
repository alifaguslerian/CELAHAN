"""Read-only FAQ, consultation invitation and shared footer checks."""

from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:3100'
ARTIFACTS = Path('test-results/home-closing')
ARTIFACTS.mkdir(parents=True, exist_ok=True)
DISCLAIMER = 'Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan.'
errors, outside = [], []


def guard(route):
    if urlsplit(route.request.url).netloc != '127.0.0.1:3100':
        outside.append('outside-origin request')
        route.abort()
    else:
        route.continue_()


with sync_playwright() as p:
    browser = p.chromium.launch()
    print('Chromium:', browser.version, flush=True)
    for locale in ['id', 'en']:
        context = browser.new_context(service_workers='block')
        context.route('**/*', guard)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(f'{BASE}/{locale}/')
        page.wait_for_load_state('networkidle')
        questions = page.locator('.faq-list details')
        assert questions.count() == 5
        assert page.locator('.faq-list details[open]').count() == 0
        assert page.locator('.faq-number').all_inner_texts() == ['01', '02', '03', '04', '05']
        assert questions.first.evaluate('el => getComputedStyle(el).backgroundColor') == 'rgba(0, 0, 0, 0)'
        for question in questions.all():
            question.locator('summary').focus()
            if question.get_attribute('open') is not None:
                page.keyboard.press('Enter')
                expect(question).not_to_have_attribute('open', '')
            page.keyboard.press('Enter')
            expect(question).to_have_attribute('open', '')
            assert page.locator('.faq-list details[open]').count() == 1
            expect(question.locator('p')).to_be_visible()
        page.locator('.faq-list details[open] summary').click()
        page.locator('#faq-heading').click()
        for width, height in [(1920, 1080), (1366, 768), (1024, 768), (768, 1024), (390, 844), (320, 740)]:
            page.set_viewport_size({'width': width, 'height': height})
            if width in [1366, 390]:
                packages = page.locator('#packages')
                spacing = packages.evaluate('el => [parseFloat(getComputedStyle(el).paddingTop), parseFloat(getComputedStyle(el).paddingBottom)]')
                assert 16 <= spacing[0] <= 28 and 48 <= spacing[1] <= 56
                packages.scroll_into_view_if_needed()
                page.screenshot(path=str(ARTIFACTS / f'{locale}-{width}-pets.png'))
            page.locator('#faq').scroll_into_view_if_needed()
            page.evaluate("document.querySelector('#faq').scrollIntoView({block:'start'})")
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            assert questions.first.locator('summary').bounding_box()['height'] >= 44
            if width >= 1366:
                assert page.locator('#consultation').bounding_box()['height'] <= 210
                assert page.locator('.site-footer').bounding_box()['height'] <= 200
                assert page.locator('#faq-heading').evaluate('el => parseFloat(getComputedStyle(el).fontSize)') <= 43
                assert page.locator('#consultation-heading').evaluate('el => parseFloat(getComputedStyle(el).fontSize)') <= 32
            page.screenshot(path=str(ARTIFACTS / f'{locale}-{width}.png'))
            page.locator('.site-footer').scroll_into_view_if_needed()
            footer_box = page.locator('.site-footer').bounding_box()
            for anchor in page.locator('.site-footer nav a').all():
                box = anchor.bounding_box()
                assert box['y'] >= footer_box['y'] and box['y'] + box['height'] <= footer_box['y'] + footer_box['height'] + 1
            page.screenshot(path=str(ARTIFACTS / f'{locale}-{width}-footer.png'))
            if width in [1366, 390]:
                page.locator('.site-footer').screenshot(path=str(ARTIFACTS / f'{locale}-{width}-footer-detail.png'))
        assert page.locator('.site-footer .disclaimer[lang=id]').inner_text() == DISCLAIMER
        assert page.locator('.site-footer nav a').count() == 5
        for anchor in page.locator('.site-footer nav a').all():
            assert anchor.get_attribute('href').startswith(f'/{locale}/')
        page.locator('.footer-top-link').focus()
        page.keyboard.press('Enter')
        page.wait_for_function('scrollY < 5')
        page.locator('.consultation-action .primary-action').click()
        page.wait_for_url(f'**/{locale}/login/?next=request')
        assert page.locator('form').count() == 1
        context.close()
        fallback = browser.new_context(java_script_enabled=False, reduced_motion='reduce', viewport={'width': 390, 'height': 844})
        fallback.route('**/*', guard)
        page = fallback.new_page()
        page.goto(f'{BASE}/{locale}/')
        page.locator('.faq-list details').nth(1).locator('summary').click()
        expect(page.locator('.faq-list details').nth(1)).to_have_attribute('open', '')
        assert page.locator('.faq-list details[open]').count() == 1
        page.locator('.consultation-action .primary-action').click()
        page.wait_for_url(f'**/{locale}/login/?next=request')
        fallback.close()
    browser.close()
assert not errors, errors
assert not outside, outside
print({'result': 'PASS', 'locales': ['id', 'en'], 'widths': [320, 390, 768, 1024, 1366, 1920], 'keyboard': 'passed', 'no_js': 'passed', 'outside_requests': 0, 'page_errors': 0})
