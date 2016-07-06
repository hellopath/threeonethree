require('./style/app.scss')

import Store from '../store'
import Actions from '../actions'
import Template from './app-template'
import Router from '../services/router'
import { initGlobalEvents } from '../services/global-events'

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
        // Start routing
        setTimeout(()=>this.router.beginRouting())
    }
    loadMainAssets() {
        this.onAppReady()
    }
    onAppReady() {
        setTimeout(()=>Actions.appStart())
        setTimeout(()=>Actions.routeChanged())
    }
}

export default App
