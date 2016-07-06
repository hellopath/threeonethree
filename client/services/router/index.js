import Actions from '../../actions'
import Store from '../../store'
import data from '../../data'
import Constants from '../../constants'
import page from 'page'
import routerStore from './store'

class Router {
    init() {
        this.onParseUrl = this.onParseUrl.bind(this)
        this.routing = data.routing
        this.baseName = ''
        this.firstPass = true
        this.newRouteFounded = false
        this.setupRoutes()
        this.setupPage()
    }
    beginRouting() {
        page()
    }
    setupPage() {
        let url = this.baseName + '*'
        page(url, this.onParseUrl)
    }
    onParseUrl(ctx) {
        // Swallow the action if we are alredy on that url
        if (routerStore.newRoute !== undefined) { if (this.areSimilarURL(routerStore.newRoute.path, ctx.path)) return }
        this.newRouteFounded = false
        routerStore.ctx = ctx
        this.newRouteFounded = this.routeValidation()
        // If URL don't match a pattern, send to default
        if (!this.newRouteFounded) {
            this.onDefaultURLHandler()
            return
        }
        this.assignRoute()
    }
    areSimilarURL(previous, next) {
        let bool = false
        if (previous === next) bool = true
        return bool
    }
    routeValidation() {
        for (let i = 0; i < routerStore.pageRoutes.length; i++) {
            let path = routerStore.pageRoutes[i].path
            if (path === routerStore.ctx.path) {
                return true
            }
        }
        return false
    }
    onDefaultURLHandler() {
        this.sendToDefault()
    }
    assignRoute() {
        const path = routerStore.ctx.path
        this.updatePageRoute(path)
    }
    createRoute(path) {
        const parts = this.getURLParts(path)
        const type = (parts.length === 3) ? Constants.PRODUCT : Constants.PORTRAIT
        return {
            path: path,
            parts: parts,
            parent: parts[0],
            target: (parts[1] === undefined) ? '' : parts[1],
            type: type
        }
    }
    getRouteByPath(path) {
        const routes = routerStore.pageRoutes
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i]
            if (route.path === path) { return route }
        }
        return undefined
    }
    getURLParts(url) {
        const path = url
        const split = path.split('/')
        let parts = []
        split.forEach((part) => { if (part.length > 1) parts.push(part) })
        return parts
    }
    updatePageRoute(path) {
        routerStore.oldRoute = routerStore.newRoute
        routerStore.newRoute = this.getRouteByPath(path)
        // If first pass send the action from App.js when all assets are ready
        if (this.firstPass) {
            this.firstPass = false
        } else {
            Actions.routeChanged()
        }
    }
    sendToDefault() {
        page(Store.defaultRoute())
    }
    setupRoutes() {
        routerStore.portraitRoutes = []
        routerStore.productRoutes = []
        routerStore.pageRoutes = []
        let i = 0, k
        const baseName = this.baseName
        for (k in this.routing) {
            if ({}.hasOwnProperty.call(this.routing, k)) {
                const portraitUrl = baseName + k
                const productUrl = baseName + k + '/product'
                const portraitRoute = this.createRoute(portraitUrl)
                const productRoute = this.createRoute(productUrl)
                routerStore.portraitRoutes.push(portraitRoute)
                routerStore.productRoutes.push(productRoute)
                routerStore.pageRoutes.push(portraitRoute, productRoute)
                i++
            }
        }
    }
    static getBaseURL() {
        return document.URL.split('#')[0]
    }
    static getRoute() {
        return routerStore.ctx.path
    }
    static getPageRoutes() {
        return routerStore.pageRoutes
    }
    static getPortraitRoutes() {
        return routerStore.portraitRoutes
    }
    static getProductRoutes() {
        return routerStore.productRoutes
    }
    static getNewRoute() {
        return routerStore.newRoute
    }
    static getOldRoute() {
        return routerStore.oldRoute
    }
    static setRoute(path) {
        page(path)
    }
}

export default Router
