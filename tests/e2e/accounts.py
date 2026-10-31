"""Production-mode W2 browser checks; use only isolated synthetic accounts."""

import json
import base64
import hashlib
import hmac
import secrets
import time
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright, expect


ROOT = Path(__file__).resolve().parents[2]
ENV = dict(line.split('=', 1) for line in (ROOT / '.env.local').read_text().splitlines() if line and not line.startswith('#'))
BASE = ENV['BETTER_AUTH_URL']
EMAIL = 'disabled@example.invalid'
PASSWORD = secrets.token_urlsafe(24)
ARTIFACTS = ROOT / 'test-results' / 'w2'
ARTIFACTS.mkdir(parents=True, exist_ok=True)
external = []
errors = []
resources = []


def mailbox():
    request = urllib.request.Request(ENV['CELAHAN_MAILBOX_URL'], headers={'Authorization': 'Bearer ' + ENV['CELAHAN_MAILBOX_SECRET']})
    with urllib.request.urlopen(request) as response:
        messages = json.load(response)
    return next(message['otp'] for message in reversed(messages) if message['email'] == EMAIL and message['type'] == 'email-verification')


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    print('Chromium:', browser.version, flush=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 960}, service_workers='block')

    def guard(route):
        if not route.request.url.startswith(BASE + '/'):
            external.append('blocked outside-origin request')
            route.abort()
        else:
            assert 'example.invalid' not in route.request.url
            route.continue_()

    context.route('**/*', guard)
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    for locale in ['id', 'en']:
        for route in ['login', 'register', 'account/recovery', 'account/reset-password', 'account/verify-email', 'account/two-factor']:
            response = page.goto(f'{BASE}/{locale}/{route}/')
            assert response.status == 200
            assert 'no-store' in response.headers['cache-control']
            assert page.locator('header').count() == page.locator('footer').count() == 1
            assert page.locator('html').get_attribute('lang') == locale
            assert page.locator('header a[href*="/tickets/"]').count() == 0
            for width in [320, 360, 390, 768, 1024, 1440]:
                page.set_viewport_size({'width': width, 'height': 960})
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (locale, route, width)
            page.evaluate("document.body.style.zoom = '200%'")
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (locale, route, 'zoom')
            page.evaluate("document.body.style.zoom = ''")
        page.goto(f'{BASE}/{locale}/login/')
        page.set_viewport_size({'width': 390, 'height': 844})
        page.screenshot(path=str(ARTIFACTS / f'{locale}-login-phone.png'), full_page=True)

    nojs = browser.new_context(java_script_enabled=False)
    nojs.route('**/*', guard)
    nojs_page = nojs.new_page()
    nojs_page.goto(BASE + '/en/login/')
    assert nojs_page.locator('form').get_attribute('method') == 'post'
    assert nojs_page.locator('fieldset').get_attribute('disabled') is not None
    assert nojs_page.get_by_role('button', name='Continue', exact=True).is_disabled()
    assert 'Enable JavaScript' in nojs_page.locator('main').inner_text()
    nojs.close()

    page.goto(BASE + '/id/login/?next=account')
    page.get_by_role('link', name='English', exact=True).click()
    page.wait_for_url(BASE + '/en/login/?next=account')

    page.goto(BASE + '/en/register/')
    page.get_by_label('Name', exact=True).fill('Synthetic Browser')
    page.get_by_label('Email', exact=True).fill(EMAIL)
    page.get_by_label('Password', exact=True).fill(PASSWORD)
    page.get_by_role('button', name='Show password').click()
    assert page.locator('#password').get_attribute('type') == 'text'
    page.get_by_role('button', name='Hide password').click()
    page.get_by_role('button', name='Continue', exact=True).click()
    expect(page.get_by_role('heading', name='Verify email', exact=True)).to_be_visible()
    page.get_by_label('Code from email').fill(mailbox())
    page.get_by_role('button', name='Continue', exact=True).click()
    expect(page.get_by_role('heading', name='Log in', exact=True)).to_be_visible()
    page.get_by_label('Password', exact=True).fill(PASSWORD)
    page.get_by_role('button', name='Continue', exact=True).click()
    page.wait_for_url(BASE + '/en/')
    expect(page.get_by_label('Account menu', exact=True)).to_be_visible()
    assert context.cookies() and all(cookie['httpOnly'] for cookie in context.cookies())
    assert all(cookie['sameSite'] == 'Lax' for cookie in context.cookies())
    assert not any('session_data' in cookie['name'] for cookie in context.cookies())
    page.get_by_role('button', name='Menu', exact=True).click()
    expect(page.get_by_role('link', name='Tickets', exact=True)).to_be_visible()
    assert page.get_by_role('link', name='Reports & Progress', exact=True).count() == 0
    page.keyboard.press('Escape')
    expect(page.get_by_role('button', name='Menu', exact=True)).to_be_focused()
    page.get_by_label('Account menu', exact=True).click()
    page.keyboard.press('Escape')
    expect(page.get_by_label('Account menu', exact=True)).to_be_focused()

    page.goto(BASE + '/en/account/')
    expect(page.get_by_label('Name', exact=True)).to_have_value('Synthetic Browser')
    page.get_by_label('Name', exact=True).fill('Discarded Synthetic Name')
    page.once('dialog', lambda dialog: dialog.dismiss())
    page.get_by_role('link', name='Bahasa Indonesia', exact=True).click()
    assert page.url == BASE + '/en/account/'
    page.once('dialog', lambda dialog: dialog.accept())
    page.get_by_role('link', name='Bahasa Indonesia', exact=True).click()
    page.wait_for_url(BASE + '/id/account/')
    expect(page.get_by_label('Nama', exact=True)).to_have_value('Synthetic Browser')
    page.get_by_label('Nama', exact=True).fill('<script>synthetic-canary</script>')
    page.get_by_role('button', name='Simpan nama', exact=True).click()
    expect(page.get_by_role('status')).to_have_text('Nama tersimpan.')
    page.reload()
    expect(page.get_by_label('Nama', exact=True)).to_have_value('<script>synthetic-canary</script>')
    assert page.locator('script:not([src])').evaluate_all("nodes => nodes.every(node => !node.textContent.trim().startsWith('synthetic-canary'))")
    for width in [320, 390, 768, 1440]:
        page.set_viewport_size({'width': width, 'height': 960})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.set_viewport_size({'width': 390, 'height': 844})
    page.get_by_role('button', name='Siapkan autentikator', exact=True).click()
    page.get_by_label('Kata sandi', exact=True).fill(PASSWORD)
    page.get_by_role('button', name='Lanjutkan', exact=True).click()
    expect(page.locator('.auth-secrets')).to_be_visible()
    secret = page.locator('.auth-secrets code').first.inner_text()
    key = base64.b32decode(secret + '=' * ((8 - len(secret) % 8) % 8))
    digest = hmac.new(key, int(time.time() // 30).to_bytes(8, 'big'), hashlib.sha1).digest()
    offset = digest[-1] & 15
    code = str((int.from_bytes(digest[offset:offset+4], 'big') & 0x7fffffff) % 1000000).zfill(6)
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.get_by_label('Kode autentikator', exact=True).fill(code)
    page.get_by_role('button', name='Lanjutkan', exact=True).click()
    expect(page.get_by_text('Autentikator aktif.', exact=True)).to_be_visible()
    page.get_by_label('Menu akun', exact=True).click()
    page.get_by_role('button', name='Keluar', exact=True).click()
    page.wait_for_url(BASE + '/id/')
    assert page.get_by_label('Menu akun', exact=True).count() == 0
    page.go_back()
    page.wait_for_load_state('networkidle')
    assert 'synthetic-canary' not in page.locator('body').inner_text()
    assert page.evaluate('localStorage.length + sessionStorage.length') == 0
    assert context.request.get(BASE + '/api/account/').status == 401

    for locale in ['id', 'en']:
        cold = browser.new_context(service_workers='block')
        cold.route('**/*', guard)
        probe = cold.new_page()
        probe.goto(f'{BASE}/{locale}/login/')
        probe.wait_for_load_state('networkidle')
        measurement = probe.evaluate("""() => { const entries = performance.getEntriesByType('resource'); return { js: entries.filter(x => x.initiatorType === 'script').reduce((sum, x) => sum + x.encodedBodySize, 0), resources: entries.reduce((sum, x) => sum + x.encodedBodySize, 0) }; }""")
        assert measurement['js'] <= 250 * 1024
        resources.append({'locale': locale, **measurement})
        cold.close()
    assert not external, external
    assert not errors, errors
    print(json.dumps({'result': 'PASS', 'locales': 2, 'widths': [320, 360, 390, 768, 1024, 1440], 'external_requests': len(external), 'page_errors': len(errors), 'cold_encoded_bytes': resources}))
    context.close()
    browser.close()
