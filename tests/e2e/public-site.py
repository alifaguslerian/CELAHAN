"""W3 public discovery checks against a local production server; no account mutation."""

import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:3100'
ARTIFACTS = Path('test-results/w3-correction')
ARTIFACTS.mkdir(parents=True, exist_ok=True)
WIDTHS = [320, 360, 390, 768, 1024, 1440]
PACKAGES = ['scout', 'warden', 'nexus', 'atlas']
ROUTES = ['', 'services/', *[f'services/{p}/' for p in PACKAGES], 'process/', 'report/', 'about/', 'privacy/']
errors, external, measurements = [], [], []


def guard(route):
    if urlsplit(route.request.url).netloc != '127.0.0.1:3100':
        external.append('outside-origin request')
        route.abort()
    else:
        route.continue_()


def no_overflow(page, label):
    assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'), label


with sync_playwright() as p:
    browser = p.chromium.launch()
    print('Chromium:', browser.version, flush=True)
    context = browser.new_context(service_workers='block')
    context.route('**/*', guard)
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    for locale in ['id', 'en']:
        for path in ROUTES:
            response = page.goto(f'{BASE}/{locale}/{path}')
            assert response.status == 200, (locale, path, response.status)
            page.wait_for_load_state('networkidle')
            assert page.locator('html').get_attribute('lang') == locale
            assert page.locator('main h1').count() == 1
            assert page.locator('.site-header').count() == page.locator('.site-footer').count() == 1
            assert page.locator('header a[href*="/tickets/"], header a[href*="/projects/"]').count() == 0
            assert page.locator('main form, main input').count() == 0
            assert page.locator('meta[name="description"]').get_attribute('content')
            for width in WIDTHS:
                page.set_viewport_size({'width': width, 'height': 900})
                no_overflow(page, (locale, path, width))
            if path.startswith('services/'):
                text = page.locator('main').inner_text()
                assert not any(token in text for token in ['Rp', '25.000', '2.500', 'days', 'hari', '%'])
                if path != 'services/':
                    assert page.locator('#package-heading').inner_text() == path.split('/')[1].upper()
                    assert page.locator('main h1').count() == 1
                    assert page.locator('.service-stage h1').count() == 0
                    assert page.locator('.package-sheet > p').count() == 1
                    assert page.locator('.package-sheet dl, .service-name').count() == 0
                    assert page.locator('.service-stage').evaluate("el => getComputedStyle(el, '::before').content") == 'none'
                    assert page.locator('.package-sheet').evaluate('el => getComputedStyle(el).backgroundColor') == 'rgba(0, 0, 0, 0)'
                    for width, height in [(1366, 640), (1366, 768), (1536, 704), (1920, 1080)]:
                        page.set_viewport_size({'width': width, 'height': height})
                        assert page.locator('.package-sheet').bounding_box()['width'] <= 430
                        assert page.locator('.selected-pet').bounding_box()['height'] >= 280
                        assert all(img.bounding_box()['height'] <= 48 for img in page.locator('.package-tabs img').all())
                        for selector in ['.package-sheet', '.package-tabs']:
                            box = page.locator(selector).bounding_box()
                            assert box['y'] + box['height'] <= height - 16, (locale, path, width, height, selector, 'first-screen fit')
                        assert page.evaluate('document.documentElement.scrollHeight <= innerHeight * 2'), (locale, path, width, height, 'compact second screen')
                    assert page.locator('.comparison-grid article').count() == 4
                    assert page.locator('.comparison-grid article > p').count() == 4
                    assert page.locator('main .primary-action').count() == 1
                    assert page.locator('.standard-section, main .consultation-invitation').count() == 0
                    for policy in page.locator('.service-policies details').all():
                        policy.locator('summary').focus()
                        page.keyboard.press('Enter')
                        expect(policy).to_have_attribute('open', '')
                        assert policy.locator('p').first.is_visible()
                        page.keyboard.press('Enter')
                        expect(policy).not_to_have_attribute('open', '')
            print('Routes/reflow:', locale, path or 'home', flush=True)

        page.goto(f'{BASE}/{locale}/')
        assert page.evaluate('getComputedStyle(document.documentElement).scrollbarWidth') == 'none'
        assert page.evaluate('document.documentElement.clientWidth === innerWidth')
        page.keyboard.press('PageDown')
        page.wait_for_function('scrollY > 0')
        page.keyboard.press('Home')
        page.wait_for_function('scrollY === 0')
        page.mouse.wheel(0, 400)
        page.wait_for_function('scrollY > 0')
        page.keyboard.press('Home')
        page.wait_for_function('scrollY === 0')
        assert page.locator('.finding-id').all_inner_texts() == ['F-02', 'F-04', 'F-03']
        assert page.locator('.preview-risk-summary dd').all_inner_texts() == ['1', '2', '0']
        assert page.locator('.preview-finding-meta code').all_inner_texts() == ['/admin', 'Seluruh halaman' if locale == 'id' else 'All pages', '/static/lib.js']
        assert page.locator('.preview-score').all_text_contents() == (['Skor: 7,5 High', 'Skor: 4,3 Medium', 'Skor: 5,3 Medium'] if locale == 'id' else ['Score: 7.5 High', 'Score: 4.3 Medium', 'Score: 5.3 Medium'])
        for width, height in [(1024, 768), (1366, 640), (1536, 704), (1920, 880)]:
            page.set_viewport_size({'width': width, 'height': height})
            page.locator('#report').evaluate("el => el.scrollIntoView({block: 'start'})")
            box = page.locator('#report').bounding_box()
            assert box['y'] >= 0 and box['y'] + box['height'] <= height - 16, (locale, width, height, 'report preview must fit one screen', box)
            assert page.locator('#report').evaluate('el => getComputedStyle(el).backgroundImage') == 'none'
        link = page.locator('.preview-finding h4 a').first
        link.focus()
        page.keyboard.press('Enter')
        page.wait_for_url(f'**/{locale}/report/#finding-f-02')
        assert page.locator('#finding-f-02 .finding-title').inner_text().startswith('F-02')
        page.goto(f'{BASE}/{locale}/')
        assert page.locator('.process-grid > li').count() == 8
        for package in PACKAGES:
            link = page.locator(f'.pet-{package}')
            page.mouse.move(0, 0)
            expect(link.locator('.pet-name')).to_be_hidden()
            link.focus()
            expect(link.locator('.pet-name')).to_be_visible()
            assert link.bounding_box()['width'] >= 44 and link.bounding_box()['height'] >= 44
            page.keyboard.press('Enter')
            page.wait_for_url(f'**/{locale}/services/{package}/')
            assert page.locator('#package-heading').inner_text() == package.upper()
            page.goto(f'{BASE}/{locale}/')
        faq = page.locator('.faq-list details').first
        faq.locator('summary').focus()
        page.keyboard.press('Enter')
        expect(faq).to_have_attribute('open', '')

        page.goto(f'{BASE}/{locale}/report/')
        assert page.locator('.finding-id').all_inner_texts() == ['F-01', 'F-02', 'F-03', 'F-04', 'F-05']
        assert page.locator('.finding-row code').all_inner_texts() == ['/cari (parameter q)', '/admin', '/static/lib.js', 'Seluruh halaman' if locale == 'id' else 'All pages', '/api/error']
        assert page.locator('.findings a, .findings input, .findings button').count() == 0
        for summary in page.locator('.finding-row').all():
            summary.focus()
            page.keyboard.press('Enter')
            expect(summary.locator('..')).to_have_attribute('open', '')
        page.get_by_role('link', name='English' if locale == 'id' else 'Bahasa Indonesia', exact=True).click()
        other = 'en' if locale == 'id' else 'id'
        page.wait_for_url(f'**/{other}/report/')

        rejected = context.request.get(f'{BASE}/{locale}/request/?package=https%3A%2F%2Fvisitor.invalid', max_redirects=0)
        assert rejected.status == 307
        assert rejected.headers['location'] == f'/{locale}/login/?next=request'
        page.goto(f'{BASE}/{locale}/request/?package=warden')
        page.wait_for_url(f'**/{locale}/login/?next=request&package=warden')
        page.get_by_role('link', name='English' if locale == 'id' else 'Bahasa Indonesia', exact=True).click()
        page.wait_for_url(f'**/{other}/login/?next=request&package=warden')
        page.locator('.account-navigation a[href*="register"]').click()
        page.wait_for_url(f'**/{other}/register/?next=request&package=warden')
        page.locator('header .account-links a[href*="login"]').click()
        page.wait_for_url(f'**/{other}/login/?next=request&package=warden')
        page.locator('header .account-links a[href*="register"]').click()
        page.wait_for_url(f'**/{other}/register/?next=request&package=warden')
        page.locator('.account-navigation a[href*="recovery"]').click()
        page.wait_for_url(f'**/{other}/account/recovery/?next=request&package=warden')
        page.get_by_role('link', name='English' if other == 'id' else 'Bahasa Indonesia', exact=True).click()
        page.wait_for_url(f'**/{locale}/account/recovery/?next=request&package=warden')
        page.locator('.account-navigation a[href*="verify-email"]').click()
        page.wait_for_url(f'**/{locale}/account/verify-email/?next=request&package=warden')
        page.locator('.account-navigation a[href*="login"]').click()
        page.wait_for_url(f'**/{locale}/login/?next=request&package=warden')

        for path in ['missing/', 'services/unknown/']:
            response = page.goto(f'{BASE}/{locale}/{path}')
            assert response.status == 404
            assert page.locator('main a').first.get_attribute('href') == f'/{locale}/'
        assert page.evaluate('localStorage.length + sessionStorage.length') == 0

    assert context.request.get(BASE + '/api/account/').status == 401
    assert context.request.get(BASE + '/api/admin/access/').status == 403
    assert context.request.get(BASE + '/api/projects/unknown/').status == 401
    context.close()

    touch = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    touch.route('**/*', guard)
    page = touch.new_page()
    page.goto(BASE + '/id/')
    page.locator('.pet-nexus').tap()
    page.wait_for_url('**/id/services/nexus/')
    page.goto(BASE + '/id/report/')
    page.locator('.finding-row').first.tap()
    expect(page.locator('#finding-f-01')).to_have_attribute('open', '')
    touch.close()

    reduced = browser.new_context(reduced_motion='reduce')
    reduced.route('**/*',guard)
    probe = reduced.new_page()
    probe.goto(BASE+'/id/')
    probe.locator('.pet-scout').focus()
    assert probe.locator('.pet-scout img').evaluate("el=>getComputedStyle(el).transform") == 'none'
    probe.keyboard.press('Enter')
    probe.wait_for_url('**/id/services/scout/')
    reduced.close()

    for locale in ['id', 'en']:
        nojs = browser.new_context(java_script_enabled=False, viewport={'width': 320, 'height': 850})
        nojs.route('**/*', guard)
        page = nojs.new_page()
        page.goto(f'{BASE}/{locale}/')
        assert page.locator('main h1').is_visible()
        page.locator('.preview-finding h4 a').first.click()
        assert page.url.endswith(f'/{locale}/report/#finding-f-02')
        page.goto(f'{BASE}/{locale}/')
        page.locator('.pet-atlas').click()
        assert page.url.endswith(f'/{locale}/services/atlas/')
        policy = page.locator('.service-policies details').last
        policy.locator('summary').click()
        expect(policy).to_have_attribute('open', '')
        assert policy.locator('p').is_visible()
        page.goto(f'{BASE}/{locale}/report/')
        page.locator('.finding-row').first.click()
        expect(page.locator('#finding-f-01')).to_have_attribute('open', '')
        nojs.close()

    blocked = browser.new_context()
    blocked.route('**/*', guard)
    blocked.route('**/artwork/*', lambda route: route.abort())
    page = blocked.new_page()
    page.goto(BASE + '/id/services/scout/')
    expect(page.locator('.selected-pet .pet-fallback')).to_have_text('SCOUT')
    assert page.locator('#package-heading').inner_text() == 'SCOUT'
    blocked.close()

    for locale in ['id', 'en']:
        for run in range(3):
            cold = browser.new_context(viewport={'width': 1672, 'height': 941}, service_workers='block')
            cold.route('**/*', guard)
            page = cold.new_page()
            page.add_init_script("""window.w3Vitals={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.w3Vitals.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.w3Vitals.cls+=e.value}).observe({type:'layout-shift',buffered:true});""")
            page.goto(f'{BASE}/{locale}/')
            page.wait_for_load_state('networkidle')
            measurement = page.evaluate("""() => {const r=performance.getEntriesByType('resource'),sum=entries=>entries.reduce((n,e)=>n+e.encodedBodySize,0);return {js:sum(r.filter(e=>new URL(e.name).pathname.endsWith('.js'))),fonts:sum(r.filter(e=>e.name.endsWith('.woff2'))),hero:sum(r.filter(e=>e.name.includes('hero-'))),total:sum(r)+performance.getEntriesByType('navigation')[0].encodedBodySize,...window.w3Vitals}}""")
            assert measurement['js'] <= 250*1024, measurement
            assert measurement['fonts'] <= 160*1024, measurement
            assert measurement['hero'] <= 250*1024, measurement
            assert measurement['total'] <= 1024*1024, measurement
            measurements.append({'locale':locale, 'run':run+1, **measurement})
            if run == 0:
                page.screenshot(path=str(ARTIFACTS / f'{locale}-home-desktop.png'))
                for width,height in [(1366,768),(1536,704),(1920,880),(2560,1440)]:
                    page.set_viewport_size({'width':width,'height':height})
                    no_overflow(page,(locale,width,height))
                    scene=page.locator('.hero-art').bounding_box()
                    assert abs(scene['x']) < 1 and abs(scene['width']-width) < 1
                    assert page.locator('.hero-disclaimer, .package-preview').count() == 0
                    assert page.locator('#packages > .section-heading').count() == 0
                    assert page.locator('.site-header').evaluate("el=>getComputedStyle(el).position") == 'absolute'
                    assert page.locator('body').evaluate("el=>getComputedStyle(el).backgroundImage") == 'none'
                    page.screenshot(path=str(ARTIFACTS / f'{locale}-home-{width}.png'))
                page.set_viewport_size({'width':390, 'height':844})
                page.wait_for_load_state('networkidle')
                page.evaluate('document.fonts.ready')
                page.locator('.hero-art img').evaluate('img => img.decode()')
                for number in page.locator('.strengths .editorial-number').all():
                    assert number.evaluate('el => el.scrollWidth <= el.clientWidth'), 'strength number must fit on one line'
                page.screenshot(path=str(ARTIFACTS / f'{locale}-home-phone.png'), full_page=True)
                page.set_viewport_size({'width':1536, 'height':704})
                page.locator('.hero-art img').evaluate('img => img.decode()')
                page.locator('#about').screenshot(path=str(ARTIFACTS / f'{locale}-overview.png'))
                page.locator('#packages').screenshot(path=str(ARTIFACTS / f'{locale}-pets.png'))
                for route in ['services', 'report', 'privacy', 'missing']:
                    page.set_viewport_size({'width':390, 'height':844})
                    page.goto(f'{BASE}/{locale}/{route}/')
                    page.screenshot(path=str(ARTIFACTS / f'{locale}-{route}-phone.png'), full_page=True)
            cold.close()
    browser.close()

assert not errors, errors
assert not external, external
print(json.dumps({'result':'PASS','public_routes':20,'widths':WIDTHS,'touch':'passed','no_js':'passed','images_unavailable':'passed','outside_requests':len(external),'page_errors':len(errors),'cold_loads':measurements}), flush=True)
