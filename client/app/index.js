require('./style/app.scss')

import Store from '../store'
import Actions from '../actions'
import Constants from '../constants'
import Template from './app-template'
import Router from '../services/router'
import { initGlobalEvents } from '../services/global-events'
import dom from 'dom-hand'
import Cookies from 'js-cookie'

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
        const legalImg = dom.select('#logo-wrapper', legalEl)
        const titleP = dom.select('p.title', legalEl)
        const btns = dom.select.all('.legal-button', legalEl)
        this.onReverseCompleted = this.onReverseCompleted.bind(this)
        this.legal = {
            el: legalEl,
            tl: new TimelineMax({ onReverseComplete: this.onReverseCompleted }),
            btns: btns,
            legalChild, legalInside, legalImg, titleP
        }

        // this.logoSprite = new Motio(legalImg, {
        //     fps: 30,
        //     frames: 24,
        //     width: 444 * 0.4,
        //     height: 1402 * 0.4
        // })

        

        this.resize = this.resize.bind(this)
        Store.on(Constants.WINDOW_RESIZE, this.resize)

        this.yesClicked = this.yesClicked.bind(this)
        this.noClicked = this.noClicked.bind(this)
        dom.event.on(btns[0], 'click', this.yesClicked)
        dom.event.on(btns[1], 'click', this.noClicked)

        if (Cookies.get('legaluser') === true.toString()) {
            setTimeout(() => {
                this.onReverseCompleted()
            }, 500)
        } else {
            this.addLegalAnimation()
        }
    }
    addLegalAnimation() {
        this.legal.tl.clear()
        this.legal.tl.from(this.legal, 0.1, { opacity:0, ease:Expo.easeOut }, 0)
        this.legal.tl.to(this.legal.legalInside, 0.4, { opacity:1, ease:Expo.easeOut }, 0)
        this.legal.tl.from(this.legal.legalChild, 1, { scaleX:1.1, scaleY:1.1, opacity:0, ease:Expo.easeOut }, 0)
        this.legal.tl.from(this.legal.legalImg, 1, { y:-20, opacity:0, ease:Expo.easeOut }, 0)
        this.legal.tl.from(this.legal.titleP, 1, { y:20, opacity:0, ease:Expo.easeOut }, 0.1)
        this.legal.tl.staggerFrom(this.legal.btns, 1, { y:20, opacity:0, ease:Expo.easeOut }, 0.05, 0.2)
        this.legal.tl.pause(0)
    }
    loadMainAssets() {
        // this.logoSprite.toEnd()
        this.legal.tl.play(0)
    }
    onReverseCompleted() {
        this.legal.tl.clear()
        dom.tree.remove(this.legal.el)
        Store.off(Constants.WINDOW_RESIZE, this.resize)
        // Start routing
        setTimeout(()=>this.router.beginRouting())
        this.onAppReady()
    }
    yesClicked(e) {
        e.preventDefault()
        this.legal.tl.timeScale(2).reverse()
    }
    noClicked(e) {
        e.preventDefault()
        const links = [
            'https://www.youtube.com/watch?v=RJFI6yIgZhY',
            'https://www.youtube.com/watch?v=1JJJtSfAZyE',
            'https://gfycat.com/ParallelMemorableGoat',
            'http://i.imgur.com/0Gh095v.gifv',
            'http://i.imgur.com/nIzk6Um.jpg'
        ]
        const rand = Math.floor(Math.random() * links.length)
        window.open(links[rand])
    }
    resize() {
        const windowW = Store.Window.w
        const windowH = Store.Window.h
        this.legal.el.style.width = windowW + 'px'
        this.legal.el.style.height = windowH + 'px'
    }
    onAppReady() {
        Cookies.set('legaluser', true)
        setTimeout(()=>Actions.appStart())
        setTimeout(()=>Actions.routeChanged())
    }
}

export default App
