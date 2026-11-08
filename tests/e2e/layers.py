"""Read-only Layers desktop interaction, layout, motion and resource checks."""

import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base', default='http://127.0.0.1:3100')
parser.add_argument('--channel', choices=['chrome', 'msedge', 'chromium'])
parser.add_argument('--artifacts', type=Path, default=Path('test-results/layers'))
args = parser.parse_args()
origin = urlsplit(args.base)
if origin.scheme != 'http' or origin.hostname != '127.0.0.1' or not origin.port or origin.path or origin.query or origin.fragment:
    parser.error('Use an explicit loopback HTTP origin without a path/query/fragment.')
args.artifacts.mkdir(parents=True, exist_ok=True)
errors, outside, writes, results = [], [], [], []


def guard(route):
    url = urlsplit(route.request.url)
    if (url.scheme, url.netloc) != (origin.scheme, origin.netloc):
        outside.append('outside-origin request')
        route.abort()
    else:
        if route.request.method not in ['GET', 'HEAD']:
            writes.append(route.request.method)
        route.continue_()


with sync_playwright() as p:
    browser = p.chromium.launch(channel=args.channel)
    print('Browser:', browser.version, flush=True)
    for locale in ['id', 'en']:
        context = browser.new_context(viewport={'width': 1440, 'height': 1000}, service_workers='block')
        context.route('**/*', guard)
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.add_init_script("""window.__shifts = 0; window.__lcp = 0;
          new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shifts += e.value; }).observe({type:'layout-shift', buffered:true});
          new PerformanceObserver(l => { window.__lcp = l.getEntries().at(-1).startTime; }).observe({type:'largest-contentful-paint', buffered:true});""")
        page.goto(f'{args.base}/{locale}/')
        page.wait_for_load_state('networkidle')
        artwork = page.locator('.home-page img[src^="/artwork/"]')
        expect(artwork).to_have_count(4)
        page.mouse.move(1000, 450)
        page.mouse.wheel(0, 400)
        expect(page.locator('.hero-scene')).to_be_visible()
        assert artwork.evaluate_all(
            '(images) => images.every(image => getComputedStyle(image).transform === "none" && image.getAnimations().length === 0)'
        )
        page.evaluate('scrollTo(0, 0)')
        page.evaluate('async () => { await Promise.all(document.getAnimations().map(a => a.finished.catch(() => {}))); }')
        page.screenshot(path=str(args.artifacts / f'{locale}-initial.png'), full_page=True)
        expect(page.locator('#context-choice-2')).to_be_checked(timeout=2000)
        for i in range(3):
            page.locator(f'label[for=context-choice-{i}]').click()
            expect(page.locator(f'#context-choice-{i}')).to_be_checked()
            expect(page.locator(f'#context-panel-{i}')).to_be_visible()
            assert page.locator('.context-panel:visible').count() == 1
        page.locator('#context-choice-0').focus()
        page.keyboard.press('ArrowRight')
        expect(page.locator('#context-choice-1')).to_be_checked()
        assert page.locator(':focus').get_attribute('id') == 'context-choice-1'
        for i in range(8):
            page.locator(f'label[for=process-choice-{i}]').click()
            expect(page.locator(f'#process-choice-{i}')).to_be_checked()
            expect(page.locator(f'#process-panel-{i}')).to_be_visible()
            assert page.locator('.process-panel:visible').count() == 1
        page.locator('#process-choice-0').focus()
        page.keyboard.press('ArrowLeft')
        expect(page.locator('#process-choice-7')).to_be_checked()
        question = page.locator('.home-faq details').first
        expect(question).to_have_attribute('open', '')
        question.locator('summary').focus()
        page.keyboard.press('Enter')
        expect(question).not_to_have_attribute('open', '')
        page.keyboard.press('Enter')
        expect(question.locator('.faq-answer')).to_be_visible()
        for width, height in [(1024, 768), (1366, 768), (1440, 1000), (1920, 1080)]:
            page.set_viewport_size({'width': width, 'height': height})
            page.locator('label[for=process-choice-0]').click()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (locale, width)
            assert page.locator('.stage-options').evaluate('(e) => getComputedStyle(e).gridTemplateColumns.split(" ").length') == 4
            assert page.locator('.site-header').bounding_box()['height'] < 120
            page.evaluate('async () => { await Promise.all(document.getAnimations().map(a => a.finished.catch(() => {}))); }')
            page.screenshot(path=str(args.artifacts / f'{locale}-{width}.png'), full_page=True)
        for width, height in [(1520, 700), (1920, 876)]:
            page.set_viewport_size({'width': width, 'height': height})
            page.locator('.hero-actions a[href="#process"]').click()
            expect(page.locator('#process-heading')).to_be_in_viewport(ratio=1)
            expect(page.locator('.process-panels')).to_be_in_viewport(ratio=1)
            expect(page.locator('#context-heading')).not_to_be_in_viewport()
            expect(page.locator('#access-heading')).not_to_be_in_viewport()
            page.screenshot(path=str(args.artifacts / f'{locale}-process-{width}x{height}.png'))

            page.locator('#access-and-faq').evaluate('(section) => section.scrollIntoView()')
            expect(page.locator('.access-copy')).to_be_in_viewport(ratio=1)
            expect(page.locator('.faq-list')).to_be_in_viewport(ratio=1)
            expect(page.locator('.process-panels')).not_to_be_in_viewport()
            expect(page.locator('#closing-heading')).not_to_be_in_viewport()
            button = page.locator('.access-actions .primary-action').bounding_box()
            privacy = page.locator('.access-actions .inline-link').bounding_box()
            assert abs((button['x'] + button['width'] / 2) - (privacy['x'] + privacy['width'] / 2)) < 1
            page.screenshot(path=str(args.artifacts / f'{locale}-access-faq-{width}x{height}.png'))

        for details in page.locator('.faq-list details').all()[1:]:
            details.locator('summary').click()
            expect(details).to_have_attribute('open', '')
        last_answer = page.locator('.faq-answer').last
        last_answer.scroll_into_view_if_needed()
        expect(last_answer).to_be_in_viewport(ratio=1)
        page.set_viewport_size({'width': 1366, 'height': 900})
        page.add_style_tag(content='html { font-size: 200% !important; }')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (locale, 'enlarged text')
        assert page.locator('.stage-options').evaluate('(e) => getComputedStyle(e).gridTemplateColumns.split(" ").length') == 2
        assert page.locator('.context-options').evaluate('(e) => getComputedStyle(e).gridTemplateColumns.split(" ").length') == 1
        expect(page.locator('.hero h1')).to_be_visible()
        page.screenshot(path=str(args.artifacts / f'{locale}-enlarged.png'), full_page=True)
        context.close()

        reduced = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce', service_workers='block')
        reduced.route('**/*', guard)
        rp = reduced.new_page()
        rp.goto(f'{args.base}/{locale}/')
        assert rp.locator('.hero-scene').evaluate('(image) => image.getAnimations().length === 0')
        assert rp.locator('.context-panel').first.evaluate('(e) => getComputedStyle(e).transform') == 'none'
        reduced.close()

        fallback = browser.new_context(java_script_enabled=False, viewport={'width': 1366, 'height': 900}, service_workers='block')
        fallback.route('**/*', guard)
        plain = fallback.new_page()
        plain.goto(f'{args.base}/{locale}/')
        plain.locator('label[for=context-choice-0]').click()
        expect(plain.locator('#context-panel-0')).to_be_visible()
        plain.locator('label[for=process-choice-7]').click()
        expect(plain.locator('#process-panel-7')).to_be_visible()
        plain.locator('.home-faq summary').first.click()
        expect(plain.locator('.home-faq details').first).not_to_have_attribute('open', '')
        fallback.close()

        cold = browser.new_context(viewport={'width': 1440, 'height': 1000}, service_workers='block')
        cold.route('**/*', guard)
        probe = cold.new_page()
        probe.add_init_script("""window.__shifts = 0; window.__lcp = 0;
          new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shifts += e.value; }).observe({type:'layout-shift', buffered:true});
          new PerformanceObserver(l => { window.__lcp = l.getEntries().at(-1).startTime; }).observe({type:'largest-contentful-paint', buffered:true});""")
        probe.goto(f'{args.base}/{locale}/')
        probe.wait_for_load_state('networkidle')
        for selector in ['.process-art', '.account-art']:
            image = probe.locator(selector)
            image.scroll_into_view_if_needed()
            image.evaluate('(image) => image.decode()')
        probe.locator('.site-footer').scroll_into_view_if_needed()
        probe.wait_for_load_state('networkidle')
        metrics = probe.evaluate("""() => { const r=performance.getEntriesByType('resource'); return {
          js:r.filter(x=>new URL(x.name).pathname.endsWith('.js')).reduce((s,x)=>s+x.encodedBodySize,0),
          total:r.reduce((s,x)=>s+x.encodedBodySize,0)+performance.getEntriesByType('navigation')[0].encodedBodySize,
          fonts:r.filter(x=>/\\.woff2/.test(x.name)).length,
          images:r.filter(x=>new URL(x.name).pathname.startsWith('/artwork/')).length,
          storage:localStorage.length+sessionStorage.length, lcp_ms:window.__lcp, cls:window.__shifts,
          incompleteImages:[...document.images].filter(x=>!x.complete||!x.naturalWidth).length }; }""")
        assert metrics['js'] < 250 * 1024 and metrics['total'] < 1024 * 1024, metrics
        assert metrics['fonts'] == 1 and metrics['images'] == 3, metrics
        assert metrics['storage'] == metrics['incompleteImages'] == 0, metrics
        results.append({'locale': locale, **metrics})
        cold.close()

        constrained = browser.new_context(viewport={'width': 1440, 'height': 1000}, service_workers='block')
        constrained.route('**/*', guard)
        slow = constrained.new_page()
        slow.add_init_script("""window.__shifts = 0; window.__lcp = 0;
          new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shifts += e.value; }).observe({type:'layout-shift', buffered:true});
          new PerformanceObserver(l => { window.__lcp = l.getEntries().at(-1).startTime; }).observe({type:'largest-contentful-paint', buffered:true});""")
        cdp = constrained.new_cdp_session(slow)
        cdp.send('Network.enable')
        cdp.send('Network.setCacheDisabled', {'cacheDisabled': True})
        cdp.send('Network.emulateNetworkConditions', {'offline': False, 'latency': 80, 'downloadThroughput': 200000, 'uploadThroughput': 100000, 'connectionType': 'cellular4g'})
        cdp.send('Emulation.setCPUThrottlingRate', {'rate': 4})
        slow.goto(f'{args.base}/{locale}/')
        slow.wait_for_load_state('networkidle')
        slow.evaluate('async () => { await Promise.all(document.getAnimations().map(a => a.finished.catch(() => {}))); }')
        sample = slow.evaluate('({lcp_ms:window.__lcp, cls:window.__shifts})')
        sample['choice_two_frames_ms'] = slow.evaluate("""async () => { const start=performance.now(); document.querySelector('label[for=context-choice-0]').click(); await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))); return performance.now()-start; }""")
        expect(slow.locator('#context-choice-0')).to_be_checked()
        assert sample['cls'] <= .1, sample
        results.append({'locale': locale, 'profile': 'CPU4x;1.6Mbps;80ms;cache-disabled;local-server', **sample})
        constrained.close()
    browser.close()
assert not errors, errors
assert not outside, outside
assert not writes, writes
print(json.dumps({'result': 'PASS', 'interactions': 'native radio/keyboard/FAQ/no-JS/reduced-motion', 'viewports': [1024, 1366, 1440, 1920], 'outside_requests': 0, 'writes': 0, 'page_errors': 0, 'resources': results}))
