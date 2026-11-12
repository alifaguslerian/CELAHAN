"""Run from the W4 integration harness with short-lived fixtures on stdin."""

import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright

base = sys.argv[1]
assert base == 'http://127.0.0.1:3114'
credentials = json.load(sys.stdin)
artifacts = Path('test-results/w4')
artifacts.mkdir(parents=True, exist_ok=True)
outside = []
errors = []


def guard(route):
    address = urlsplit(route.request.url)
    if (address.scheme, address.netloc) == ('http', '127.0.0.1:3114'):
        route.continue_()
    else:
        outside.append('outside-origin request')
        route.abort()


def context_for(browser, actor, **kwargs):
    context = browser.new_context(viewport={'width': 1440, 'height': 900}, service_workers='block', **kwargs)
    context.route('**/*', guard)
    context.add_cookies([{'name': credentials['cookieName'], 'value': credentials[actor], 'url': base, 'httpOnly': True}])
    return context


def action(page, kind, body=None):
    form = page.locator('#ticket-action')
    form.locator('select').first.select_option(kind)
    if body is not None:
        form.locator('textarea').fill(body)
    form.locator('button[type=submit]').click()
    if kind == 'close':
        expect(form).to_have_count(0)
    else:
        expect(form.get_by_role('status')).to_have_text('Perubahan tersimpan.')


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(channel='chrome')
    owner_context = context_for(browser, 'owner')
    admin_context = context_for(browser, 'admin')
    owner, admin = owner_context.new_page(), admin_context.new_page()
    for page in [owner, admin]:
        page.on('pageerror', lambda error: errors.append(str(error)))

    owner.goto(f'{base}/id/')
    owner.locator('.package-preview .primary-action').nth(1).click()
    owner.wait_for_url(f'{base}/id/packages/#account-data-v1')
    owner.locator('#account-data-v1 .primary-action').click()
    expect(owner.locator('.intake-package')).to_contain_text('Keamanan Akun & Data')
    form = owner.locator('form.consultation-form')
    expect(form.locator('fieldset')).to_be_enabled()
    expect(form.locator('[name=name]')).to_have_value('W4 owner')
    form.locator('[name=website]').fill('https://browser.example.invalid/')
    form.locator('[name=need]').select_option('preventive')
    form.locator('[name=reason]').fill('Persiapan rilis demo')
    form.locator('[name=description]').fill('Membahas batas akses member dan admin pada website contoh.')
    form.locator('[name=authority]').check()
    owner.screenshot(path=str(artifacts / 'request-id.png'), full_page=True)
    attempts = []

    def fail_once(route):
        attempts.append(route.request.post_data_json['requestId'])
        if len(attempts) == 1:
            route.fulfill(status=503, json={'error': 'UNAVAILABLE'})
        else:
            route.continue_()

    owner.route('**/api/tickets/', fail_once)
    form.get_by_role('button', name='Kirim pengajuan').click()
    expect(form.get_by_role('alert')).to_contain_text('Isian masih ada')
    expect(form.locator('[name=reason]')).to_have_value('Persiapan rilis demo')
    form.get_by_role('button', name='Kirim pengajuan').click()
    owner.wait_for_url(f'{base}/id/tickets/*/')
    assert len(attempts) == 2 and attempts[0] == attempts[1]
    owner_path = urlsplit(owner.url).path
    expect(owner.locator('.ticket-summary').filter(has_text='Paket yang dipilih')).to_contain_text('Keamanan Akun & Data')
    expect(owner.locator('.ticket-next')).to_contain_text('menunggu tanggapan admin')
    reference = owner.locator('main h1').inner_text()
    owner.get_by_role('link', name='Kembali ke daftar').click()
    expect(owner.locator('.ticket-list').get_by_text(reference)).to_be_visible()
    owner.locator('.ticket-list').get_by_text(reference).click()

    admin.goto(f'{base}/id/admin/')
    admin.locator('.ticket-list').get_by_text(reference).click()
    action(admin, 'clarify', 'Peran apa saja yang ada di website contoh?')
    expect(admin.locator('.ticket-next')).to_contain_text('Pengguna perlu menjawab')
    owner.reload()
    expect(owner.locator('.ticket-next')).to_contain_text('Admin menunggu informasi tambahan')
    action(owner, 'reply', 'Ada member dan admin.')
    expect(owner.locator('.ticket-next')).to_contain_text('menunggu tanggapan admin')

    admin.reload()
    action(admin, 'outcome', 'Fokus pembahasan adalah login dan batas akses antara member dan admin.')
    expect(admin.get_by_text('Fokus pembahasan adalah login dan batas akses antara member dan admin.').first).to_be_visible()
    action(admin, 'note', 'Internal browser fixture canary')
    expect(admin.locator('.ticket-notes')).to_contain_text('Internal browser fixture canary')
    action_form = admin.locator('#ticket-action')
    action_form.locator('select').first.select_option('propose')
    action_form.locator('[name=wallTime]').fill((datetime.now(timezone.utc) + timedelta(days=5)).strftime('%Y-%m-%dT%H:%M'))
    action_form.locator('[name=zone]').select_option('UTC')
    action_form.get_by_role('button', name='Usulkan waktu').click()
    expect(admin.locator('.ticket-next')).to_contain_text('Pengguna perlu menyetujui')

    owner.goto(f'{base}/id/tickets/')
    inspected = []

    def inspect_flight(route):
        if route.request.headers.get('rsc') != '1':
            route.continue_()
            return
        response = route.fetch(max_redirects=0)
        if response.ok and 'text/x-component' in response.headers.get('content-type', ''):
            inspected.append(('Internal browser fixture canary' in response.text(), response.headers.get('cache-control', '')))
        route.fulfill(response=response)

    owner.route(lambda url: urlsplit(url).netloc == '127.0.0.1:3114' and urlsplit(url).path == owner_path, inspect_flight)
    owner.locator('.ticket-list').get_by_text(reference).click()
    expect(owner.locator('.ticket-next')).to_contain_text('Admin mengusulkan waktu')
    assert inspected and all(not leaked and 'no-store' in cache for leaked, cache in inspected)
    expect(owner.locator('main')).not_to_contain_text('Internal browser fixture canary')
    action(owner, 'agree')
    expect(owner.locator('.ticket-next')).to_contain_text('Tunggu konfirmasi admin')
    admin.reload()
    action(admin, 'confirm')
    expect(admin.locator('.ticket-next')).to_contain_text('Waktu sudah dikonfirmasi')
    admin.screenshot(path=str(artifacts / 'admin-confirmed-id.png'), full_page=True)
    if credentials.get('followUps'):
        owner.goto(f'{base}/id/tickets/#agenda')
        expect(owner.locator('#agenda')).to_contain_text(reference)
        expect(owner.locator('#agenda')).to_contain_text('UTC')
        owner.locator('#agenda').get_by_role('link', name=reference).click()
        expect(owner).to_have_url(f'{base}{owner_path}')

    owner.get_by_role('link', name='EN — English').click()
    expect(owner).to_have_url(f'{base}{owner_path.replace("/id/", "/en/", 1)}')
    expect(owner.locator('.ticket-next')).to_contain_text('The time has been confirmed')
    owner.screenshot(path=str(artifacts / 'owner-confirmed-en.png'), full_page=True)
    if 'other' in credentials:
        admin.get_by_label('Judul proyek').fill('Proyek portal pesanan fiktif')
        admin.get_by_label('Ruang lingkup', exact=True).fill('Skenario ilustratif kepemilikan riwayat pesanan.')
        admin.get_by_label('Ruang lingkup sudah disepakati di percakapan tiket.').check()
        admin.get_by_role('button', name='Buat proyek').click()
        admin.wait_for_url(f'{base}/id/admin/projects/*/')
        admin.get_by_role('button', name='Isi dengan contoh ilustratif').click()
        expect(admin.get_by_label('Ringkasan')).to_have_value(
            'Skenario ilustratif pada portal pesanan fiktif. Contoh ini membahas pemeriksaan kepemilikan data pesanan.')
        admin.get_by_role('button', name='Simpan draf').click()
        publish = admin.get_by_role('button', name='Terbitkan draf tersimpan')
        expect(publish).to_be_enabled()
        owner.reload()
        owner.get_by_role('link', name='View project', exact=True).click()
        expect(owner.get_by_text('A private report is not available yet.')).to_be_visible()
        expect(owner.locator('main')).not_to_contain_text('Dalam skenario, akun A')
        admin.once('dialog', lambda dialog: dialog.accept())
        publish.click()
        expect(admin.get_by_role('button', name='Tarik laporan aktif')).to_be_visible()
        owner.reload()
        expect(owner.locator('main')).to_contain_text('Dalam skenario, akun A')
        expect(owner.locator('main')).not_to_contain_text('Internal browser fixture canary')
        other_context = context_for(browser, 'other')
        other = other_context.new_page()
        denied = other.goto(owner.url)
        assert denied and denied.status == 404 and 'Dalam skenario, akun A' not in denied.text()
        other.goto(f'{base}/id/account/')
        other.get_by_label('Nama', exact=True).fill('Audit profile browser')
        other.get_by_role('button', name='Simpan nama').click()
        expect(other.get_by_role('status')).to_have_text('Nama tersimpan.')
        other.reload()
        expect(other.get_by_label('Nama', exact=True)).to_have_value('Audit profile browser')
        other_context.close()
        owner.screenshot(path=str(artifacts / 'w5a-owner-report-en.png'), full_page=True)
        admin.get_by_role('link', name='Tiket konsultasi', exact=True).click()
        owner.get_by_role('link', name='Consultation ticket', exact=True).click()
        print('W5A Chromium journey passed from reviewed ticket to private publication and second-account denial.')
    action(admin, 'close', 'Ruang lingkup pembahasan telah disepakati.')
    expect(admin.locator('.ticket-next')).to_contain_text('Konsultasi ini telah ditutup')
    owner.reload()
    expect(owner.locator('main')).to_contain_text('Ruang lingkup pembahasan telah disepakati.')
    expect(owner.locator('#ticket-action')).to_have_count(0)
    if credentials.get('followUps'):
        owner.get_by_role('link', name='View project', exact=True).click()
        follow = owner.get_by_role('heading', name='Report follow-up').locator('..')
        follow.get_by_role('radio', name='Request a retest').check()
        project_url = owner.url
        follow.get_by_label('What did your developer change?').fill('The developer updated ownership checks in the fictional project.')
        follow.get_by_role('button', name='Request a retest').click()
        owner.wait_for_url(f'{base}/en/tickets/*/')
        expect(owner.locator('main')).to_contain_text('Awaiting an admin decision')
        follow_path = urlsplit(owner.url).path.replace('/en/tickets/', '/id/admin/tickets/', 1)
        admin.goto(f'{base}{follow_path}')
        owner_form = owner.locator('#ticket-action')
        expect(owner_form.locator('fieldset')).to_be_enabled()
        owner_form.locator('textarea').fill('My draft stays here while an admin replies.')
        action(admin, 'reply', 'Pesan baru muncul otomatis di tiket.')
        owner.bring_to_front()
        expect(owner.locator('.ticket-events')).to_contain_text('Pesan baru muncul otomatis di tiket.', timeout=15000)
        expect(owner_form.locator('textarea')).to_have_value('My draft stays here while an admin replies.')
        owner_form.get_by_role('button', name='Send reply').click()
        expect(owner_form.get_by_role('status')).to_have_text('Changes saved.')
        admin.reload()
        action(admin, 'accept_retest')
        finish = admin.locator('#ticket-action')
        finish.locator('select').first.select_option('finish_retest')
        finish.locator('[name=result]').select_option('resolved_in_example')
        finish.locator('textarea').fill('Skenario fiktif memeriksa pemilik pesanan.')
        finish.get_by_role('button', name='Simpan hasil ilustratif').click()
        expect(finish.get_by_role('status')).to_have_text('Perubahan tersimpan.')
        owner.goto(project_url)
        expect(owner.get_by_text('Resolved in the example')).to_be_visible()
        expect(owner.get_by_role('radio', name='Request a retest')).to_have_count(0)
        owner.screenshot(path=str(artifacts / 'w5b-owner-result-en.png'), full_page=True)
        print('W5B Chromium journey passed follow-up after source closure, live reply with draft preservation, result and agenda.')
    assert owner.evaluate('localStorage.length + sessionStorage.length') == 0

    no_js = context_for(browser, 'owner', java_script_enabled=False)
    plain = no_js.new_page()
    response = plain.goto(f'{base}/id/request/')
    expect(plain.get_by_role('button', name='Kirim pengajuan')).to_be_disabled()
    assert response and '<noscript><p>Aktifkan JavaScript' in response.text()
    browser.close()

assert not outside, outside
assert not errors, errors
print('W4 Chromium journey passed in ID and EN, including admin note separation and confirmed scheduling.')
