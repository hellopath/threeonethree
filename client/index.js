if (!window.console) window.console = { log: () => {} }

import Store from './store'
import Utils from './utils'
import App from './app'
import MobileDetect from 'mobile-detect'
import dom from 'dom-hand'

const md = new MobileDetect(window.navigator.userAgent)

Store.Detector.isSafari = (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)
Store.Detector.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1
Store.Detector.isMobile = (md.mobile() || md.tablet()) ? true : false
Store.Parent = dom.select('#app-container')
Store.Detector.oldIE = dom.classes.contains(Store.Parent, 'ie6') || dom.classes.contains(Store.Parent, 'ie7') || dom.classes.contains(Store.Parent, 'ie8')
Store.Detector.isSupportWebGL = Utils.supportWebGL()
if (Store.Detector.oldIE) Store.Detector.isMobile = true

$(() => {
	window.jQuery = window.$ = $
	const app = new App()
	app.init()
})

