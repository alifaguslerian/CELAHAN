"""Read-only checks for source-art greetings and native package-page transitions."""

from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:3100'
OUT = Path('test-results/pet-art-motion')
OUT.mkdir(parents=True, exist_ok=True)
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
        context = browser.new_context(viewport={'width':1366, 'height':640}, service_workers='block')
        context.route('**/*', guard)
        context.add_init_script("""window.petEntryFrames=[];
          const observer=new MutationObserver(()=>{
            const el=document.querySelector('.services-page .pet-motion');if(!el)return;
            observer.disconnect();const started=performance.now();
            const sample=()=>{window.petEntryFrames.push(getComputedStyle(el).transform);
              if(performance.now()-started<700)requestAnimationFrame(sample)};
            requestAnimationFrame(sample);
          });observer.observe(document,{childList:true,subtree:true});""")
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        for pet in ['scout', 'warden', 'nexus', 'atlas']:
            page.goto(f'{BASE}/{locale}/#packages')
            page.wait_for_load_state('networkidle')
            assert page.locator('.pet-link').count() == 4
            assert page.locator('canvas, .inline-package-sheet, .package-back, .pet-rotation-buttons').count() == 0
            assert page.locator('.pet-cluster').bounding_box()['width'] <= 864
            trigger = page.locator(f'.pet-{pet}')
            trigger.focus(); page.keyboard.press('Enter')
            page.wait_for_url(f'**/{locale}/services/{pet}/')
            expect(page.locator('#package-heading')).to_have_text(pet.upper())
            expect(page.locator('.pet-motion')).to_have_attribute('data-ready', 'true')
            page.wait_for_load_state('networkidle')
            assert '0.42s' in page.locator('.pet-motion').evaluate('el=>getComputedStyle(el).transitionDuration')
            for width,height in [(1366,640),(1536,704),(1920,1080)]:
                page.set_viewport_size({'width':width,'height':height})
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                for selector in ['.package-sheet','.package-tabs']:
                    box=page.locator(selector).bounding_box()
                    assert box['y']+box['height'] <= height-12,(locale,pet,width,height,selector,box)
            page.set_viewport_size({'width':1536,'height':704})
            page.wait_for_timeout(1800)
            assert page.evaluate('petEntryFrames.some(frame=>frame!=="none")'), 'package entry must animate'
            page.screenshot(path=str(OUT/f'{locale}-{pet}-rest.png'))
            page.locator('.pet-greet').click()
            expect(page.locator('.pet-motion')).to_have_attribute('data-active','true')
            page.evaluate("""() => {
              const svg=document.querySelector('.pet-art'); svg.pauseAnimations(); window.petPoseTime=svg.getCurrentTime();
              svg.setCurrentTime(window.petPoseTime+.24);
              document.querySelector('.pet-motion').getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=240});
            }""")
            assert page.locator('[data-part=eye]').first.evaluate('el=>new DOMMatrix(getComputedStyle(el).transform).d') < .5
            assert page.locator('feDisplacementMap').evaluate('el=>el.scale.animVal') > 0
            page.screenshot(path=str(OUT/f'{locale}-{pet}-blink.png'))
            page.evaluate("""() => {
              document.querySelector('.pet-art').setCurrentTime(window.petPoseTime+.58);
              document.querySelector('.pet-motion').getAnimations({subtree:true}).forEach(a=>a.currentTime=580);
            }""")
            page.screenshot(path=str(OUT/f'{locale}-{pet}-gesture.png'))
            page.evaluate("""() => {
              document.querySelector('.pet-art').unpauseAnimations();
              document.querySelector('.pet-motion').getAnimations({subtree:true}).forEach(a=>a.finish());
            }""")
            expect(page.locator('.pet-motion')).not_to_have_attribute('data-active','true')
            assert page.locator('feDisplacementMap').evaluate('el=>el.scale.animVal') == 0
            print('Artwork/motion/navigation:', locale, pet, flush=True)
        context.close()

        reduced=browser.new_context(reduced_motion='reduce',viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
        reduced.route('**/*',guard)
        page=reduced.new_page();page.goto(f'{BASE}/{locale}/#packages');page.locator('.pet-nexus').tap();page.wait_for_url(f'**/{locale}/services/nexus/')
        page.locator('.pet-greet').tap();page.wait_for_timeout(200)
        assert page.locator('.pet-motion').get_attribute('data-active') is None
        assert page.locator('.pet-motion').evaluate('el=>el.getAnimations({subtree:true}).length') == 0
        assert page.locator('feDisplacementMap').evaluate('el=>el.scale.animVal') == 0
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.locator('.service-detail').screenshot(path=str(OUT/f'{locale}-phone.png'))
        reduced.close()

        nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
        nojs.route('**/*',guard)
        page=nojs.new_page();page.goto(f'{BASE}/{locale}/#packages');page.locator('.pet-atlas').click();page.wait_for_url(f'**/{locale}/services/atlas/')
        assert page.locator('.pet-still img').is_visible()
        expect(page.locator('#package-heading')).to_have_text('ATLAS')
        nojs.close()
    browser.close()

assert not errors,errors
assert not outside,outside
print({'result':'PASS','locales':['id','en'],'pets':4,'separate_page_entry':'passed','eye_and_hand_motion':'passed','reduced_motion':'passed','touch_and_no_js':'passed','outside_requests':len(outside),'page_errors':len(errors)},flush=True)
