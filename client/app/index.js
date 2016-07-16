require('./style/app.scss')

import Store from '../store'
import Actions from '../actions'
import Constants from '../constants'
import Template from './app-template'
import Router from '../services/router'
import { initGlobalEvents } from '../services/global-events'
import dom from 'dom-hand'

class App {
    constructor() {
        this.onAppReady = this.onAppReady.bind(this)
        this.loadMainAssets = this.loadMainAssets.bind(this)
    }
    init() {
        // Init router
        this.router = new Router()
        this.router.init()
        // Init global events
        initGlobalEvents()
        const appTemplate = new Template()
        appTemplate.isReady = this.loadMainAssets
        appTemplate.render('#app-container')

        dom.select('body', document).style.opacity = 1

        const legalEl = dom.select('#legal-age', document)
        const legalChild = dom.select('.child', legalEl)
        const legalInside = dom.select('.inside-container', legalEl)
        const legalImg = dom.select('img', legalEl)
        const titleP = dom.select('p.title', legalEl)
        const btns = dom.select.all('.legal-button', legalEl)
        this.onReverseCompleted = this.onReverseCompleted.bind(this)
        this.legal = {
            el: legalEl,
            tl: new TimelineMax({ onReverseComplete: this.onReverseCompleted }),
            btns: btns
        }

        this.legal.tl.to(legalInside, 0.4, { opacity:1, ease:Expo.easeOut }, 0)
        this.legal.tl.from(legalChild, 1, { scaleX:1.1, scaleY:1.1, opacity:0, ease:Expo.easeOut }, 0)
        this.legal.tl.from(legalImg, 1, { y:-20, opacity:0, ease:Expo.easeOut }, 0)
        this.legal.tl.from(titleP, 1, { y:20, opacity:0, ease:Expo.easeOut }, 0.1)
        this.legal.tl.staggerFrom(btns, 1, { y:20, opacity:0, ease:Expo.easeOut }, 0.05, 0.2)
        this.legal.tl.pause(0)

        this.resize = this.resize.bind(this)
        Store.on(Constants.WINDOW_RESIZE, this.resize)

        this.yesClicked = this.yesClicked.bind(this)
        this.noClicked = this.noClicked.bind(this)
        dom.event.on(btns[0], 'click', this.yesClicked)
        dom.event.on(btns[1], 'click', this.noClicked)
    }
    loadMainAssets() {
        this.legal.tl.play(0)
    }
    onReverseCompleted() {
        this.legal.tl.clear()
        // Start routing
        setTimeout(()=>this.router.beginRouting())
        this.onAppReady()
    }
    yesClicked(e) {
        e.preventDefault()
        this.legal.tl.timeScale(2).reverse()
    }
    noClicked() {
        e.preventDefault()
    }
    resize() {
        const windowW = Store.Window.w
        const windowH = Store.Window.h
        this.legal.el.style.width = windowW + 'px'
        this.legal.el.style.height = windowH + 'px'
    }
    onAppReady() {
        setTimeout(()=>Actions.appStart())
        setTimeout(()=>Actions.routeChanged())
    }
}

export default App
