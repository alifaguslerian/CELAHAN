"""Desktop public/shared-shell regression checks; no account/database writes."""

import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base', default='http://127.0.0.1:3100')
parser.add_argument('--channel', choices=['chrome', 'msedge', 'chromium'])
parser.add_argument('--artifacts', type=Path, default=Path('test-results/content-reset'))
args = parser.parse_args()
origin = urlsplit(args.base)
if origin.scheme != 'http' or origin.hostname != '127.0.0.1' or not origin.port or origin.path or origin.query or origin.fragment:
    parser.error('Use a loopback HTTP origin with an explicit port and no path/query/fragment.')
BASE = args.base
args.artifacts.mkdir(parents=True, exist_ok=True)
ROUTES = ['', 'process/', 'about/', 'privacy/', 'packages/']
ACCOUNT_ROUTES = ['login/', 'register/', 'account/recovery/', 'account/reset-password/', 'account/verify-email/', 'account/two-factor/']
RETIRED = ['services/', 'services/retired/', 'report/']
VIEWPORTS = [(1024, 768), (1366, 768), (1920, 1080)]
DISCLAIMER = 'Proyek konsep untuk portofolio dan tugas kuliah. Bukan layanan sungguhan.'
TRANSLATION = 'A concept project for a portfolio and university coursework. Not a real service.'
errors, outside, measurements = [], [], []


def guard(route):
    url = urlsplit(route.request.url)
    if (url.scheme, url.netloc) != (origin.scheme, origin.netloc):
        outside.append('outside-origin request')
        route.abort()
    else:
        route.continue_()


with sync_playwright() as p:
    browser = p.chromium.launch(channel=args.channel)
    print('Chromium:', browser.version, flush=True)
    context = browser.new_context(viewport={'width': 1366, 'height': 768}, service_workers='block')
    context.route('**/*', guard)
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    for locale in ['id', 'en']:
        for path in ROUTES + ACCOUNT_ROUTES:
            response = page.goto(f'{BASE}/{locale}/{path}')
            expect(page.locator('main h1')).to_be_visible()
            assert response.status == 200, (locale, path, response.status)
            assert response.headers['x-content-type-options'] == 'nosniff'
            assert response.headers['referrer-policy'] == 'no-referrer'
            csp = response.headers['content-security-policy']
            assert "frame-ancestors 'none'" in csp
            assert "default-src 'self'" in csp
            assert "script-src 'self' 'unsafe-inline'" in csp
            assert "script-src-attr 'none'" in csp
            assert "'unsafe-eval'" not in csp
            cache = response.headers['cache-control']
            if path in ACCOUNT_ROUTES:
                assert 'no-store' in cache
            else:
                assert 's-maxage=' in cache and 'no-store' not in cache
            assert 'x-powered-by' not in response.headers
            assert page.locator('html').get_attribute('lang') == locale
            assert page.locator('main h1').count() == 1
            assert page.locator('.site-header').count() == page.locator('.site-footer').count() == 1
            assert page.locator('footer p[lang=id]').inner_text() == DISCLAIMER
            if locale == 'en':
                assert page.locator('footer p[lang=en]').inner_text() == TRANSLATION
            assert page.locator('header a[href*="/tickets/"], header a[href*="/projects/"], header a[href*="/admin/"]').count() == 0
            assert page.locator('a[href*="/services/"], a[href*="/report/"], #packages, #report, .finding-list').count() == 0
            assert page.locator('main canvas, .menu-trigger').count() == 0
            for image in page.locator('main img').all():
                assert image.get_attribute('src') in ['/artwork/glacier-steel-hero.webp', '/artwork/glacier-steel-detail.webp', '/artwork/glacier-steel-account.webp']
            assert page.locator('meta[name=description]').get_attribute('content')
            for width, height in VIEWPORTS:
                page.set_viewport_size({'width': width, 'height': height})
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (locale, path, width)
                expect(page.locator('#site-navigation')).to_be_visible()
            if path == 'process/':
                assert page.locator('.process-grid li').count() == 8
            if path in ACCOUNT_ROUTES:
                assert page.locator('meta[name=robots]').get_attribute('content') == 'noindex, nofollow'
                for form in page.locator('form').all():
                    assert form.get_attribute('method') == 'post'
            print('Current route:', locale, path or 'home', flush=True)

        page.set_viewport_size({'width': 1366, 'height': 768})
        page.goto(f'{BASE}/{locale}/')
        page.keyboard.press('Tab')
        assert page.locator(':focus').get_attribute('href') == '#main-content'
        page.keyboard.press('Enter')
        assert page.locator(':focus').get_attribute('id') == 'main-content'
        question = page.locator('.faq-list details').first
        expect(question).to_have_attribute('open', '')
        question.locator('summary').focus()
        page.keyboard.press('Enter')
        expect(question).not_to_have_attribute('open', '')
        page.keyboard.press('Enter')
        expect(question).to_have_attribute('open', '')
        expect(question.locator('p')).to_be_visible()
        page.screenshot(path=str(args.artifacts / f'{locale}-home.png'), full_page=True)
        preview = page.locator('.package-preview')
        assert preview.evaluate("(section) => section.previousElementSibling.id === 'process' && section.nextElementSibling.id === 'access-and-faq'")
        expect(preview.locator('.package-card a')).to_have_text(['Lihat paket' if locale == 'id' else 'View package'] * 3)
        preview.locator('.package-card a').nth(1).click()
        page.wait_for_url(f'{BASE}/{locale}/packages/#account-data-v1')
        expect(page.locator('.package-price')).to_have_text(
            ['Rp2.500.000', 'Rp5.000.000', 'Rp8.000.000'] if locale == 'id' else ['IDR 2,500,000', 'IDR 5,000,000', 'IDR 8,000,000'])
        expect(page.locator('.package-card .package-scope li')).to_have_count(9)
        page.goto(f'{BASE}/{locale}/packages/')
        page.screenshot(path=str(args.artifacts / f'{locale}-packages.png'), full_page=True)
        page.locator('#account-data-v1 .primary-action').click()
        page.wait_for_url(f'{BASE}/{locale}/login/?next=request&package=account-data-v1')
        other = 'en' if locale == 'id' else 'id'
        page.get_by_role('link', name='EN — English' if locale == 'id' else 'ID — Bahasa Indonesia', exact=True).click()
        page.wait_for_url(f'{BASE}/{other}/login/?next=request&package=account-data-v1')
        page.goto(f'{BASE}/{locale}/')
        consultation = page.locator(f'#context a[href="/{locale}/login/?next=request"]:visible')
        expect(consultation).to_have_count(1)
        consultation.click()
        page.wait_for_url(f'{BASE}/{locale}/login/?next=request')
        page.goto(f'{BASE}/{locale}/')
        page.locator('.access-actions .primary-action').click()
        page.wait_for_url(f'**/{locale}/login/')
        for task in ['request', 'tickets', 'projects', 'admin']:
            page.goto(f'{BASE}/{locale}/{task}/')
            assert urlsplit(page.url).path == f'/{locale}/login/'
        page.goto(f'{BASE}/{locale}/request/?package=retired&website=private-value')
        assert page.url == f'{BASE}/{locale}/login/?next=request'
        for path in ['login', 'register', 'account/verify-email', 'account/recovery', 'account/reset-password', 'account/two-factor']:
            page.goto(f'{BASE}/{locale}/{path}/?next=request&package=retired&email=private-value')
            for anchor in page.locator('.account-links a, .account-navigation a').all():
                assert 'package=' not in anchor.get_attribute('href')
                assert 'private-value' not in anchor.get_attribute('href')
            page.get_by_role('link', name='EN — English' if locale == 'id' else 'ID — Bahasa Indonesia', exact=True).click()
            other = 'en' if locale == 'id' else 'id'
            page.wait_for_url(f'**/{other}/{path}/?next=request')
        for path in RETIRED + ['unknown-reset/']:
            response = page.goto(f'{BASE}/{locale}/{path}')
            assert response.status == 404, (locale, path, response.status)
            assert page.locator('a[href*="/services/"], a[href*="/report/"]').count() == 0
            expect(page.locator('main .primary-action')).to_have_attribute('href', f'/{locale}/')
        assert page.evaluate('localStorage.length + sessionStorage.length') == 0

        fallback = browser.new_context(java_script_enabled=False, viewport={'width': 1366, 'height': 768}, service_workers='block')
        fallback.route('**/*', guard)
        plain = fallback.new_page()
        plain.goto(f'{BASE}/{locale}/')
        plain.locator('.faq-list summary').first.click()
        expect(plain.locator('.faq-list details').first).not_to_have_attribute('open', '')
        plain.get_by_role('navigation', name='Navigasi utama' if locale == 'id' else 'Main navigation', exact=True).get_by_role('link', name='Alur' if locale == 'id' else 'Process', exact=True).click()
        assert urlsplit(plain.url).path == f'/{locale}/process/'
        assert plain.locator('.process-grid li').count() == 8
        plain.goto(f'{BASE}/{locale}/')
        plain.locator('.package-preview .primary-action').first.click()
        assert plain.url == f'{BASE}/{locale}/packages/#website-public-v1'
        plain.locator('#website-public-v1 .primary-action').click()
        assert plain.url == f'{BASE}/{locale}/login/?next=request&package=website-public-v1'
        plain.goto(f'{BASE}/{locale}/')
        plain.locator('.access-actions .primary-action').click()
        assert plain.url == f'{BASE}/{locale}/login/'
        fallback.close()

        cold = browser.new_context(viewport={'width': 1366, 'height': 768}, service_workers='block')
        cold.route('**/*', guard)
        probe = cold.new_page()
        probe.goto(f'{BASE}/{locale}/')
        probe.evaluate('document.fonts.ready')
        result = probe.evaluate("""() => { const r = performance.getEntriesByType('resource'); return { js: r.filter(x => new URL(x.name).pathname.endsWith('.js')).reduce((s,x) => s+x.encodedBodySize,0), total: r.reduce((s,x) => s+x.encodedBodySize,0)+performance.getEntriesByType('navigation')[0].encodedBodySize, fonts: r.filter(x => /\\.(woff2?|ttf|otf)/.test(x.name)).length, artwork: r.filter(x => /artwork/.test(x.name)).length }; }""")
        assert result['js'] <= 250 * 1024 and result['total'] <= 1024 * 1024
        assert result['fonts'] == 1 and 1 <= result['artwork'] <= 3, result
        measurements.append({'locale': locale, **result})
        for artwork in probe.locator('main img').all():
            artwork.scroll_into_view_if_needed()
            expect(artwork).to_have_js_property('complete', True)
            assert artwork.evaluate('(img) => img.naturalWidth > 0')
        cold.close()

    root = context.request.get(BASE + '/', max_redirects=0)
    assert root.status == 307 and root.headers['location'] == '/id/'
    assert context.request.get(BASE + '/fr/').status == 404
    for path, status in [('/api/account/', 401), ('/api/projects/00000000-0000-0000-0000-000000000000/', 401), ('/api/admin/access/', 403)]:
        response = context.request.get(BASE + path)
        assert response.status == status
        assert 'no-store' in response.headers['cache-control']
        assert 'noindex' in response.headers['x-robots-tag']
    assert context.request.get(BASE + '/_next/image?url=%2Fartwork%2Fglacier-steel-hero.webp&w=640&q=75').status == 404
    robots = context.request.get(BASE + '/robots.txt')
    assert robots.ok and 'User-agent: *' in robots.text()
    context.close()
    browser.close()
assert not errors, errors
assert not outside, outside
print(json.dumps({'result': 'PASS', 'public_routes': 2 * len(ROUTES), 'account_routes': 12, 'retired_route_checks': 6, 'desktop_viewports': VIEWPORTS, 'keyboard': 'passed', 'no_js': 'passed', 'outside_requests': 0, 'page_errors': 0, 'cold_encoded_bytes': measurements}))
