import Constants from '../../constants'
import {PagerActions} from '../../pager/Pager'
import Store from '../../store'
import BasePager from '../../pager/components/BasePager'
import Router from '../../services/router'
import Home from '../Home'
import HomeTemplate from '../Home/template.hbs'

class PagesContainer extends BasePager {
    constructor() {
        super()
        this.didPageChange = this.didPageChange.bind(this)
        this.pageAssetsLoaded = this.pageAssetsLoaded.bind(this)
        Store.on(Constants.ROUTE_CHANGED, this.didPageChange)
        Store.on(Constants.PAGE_ASSETS_LOADED, this.pageAssetsLoaded)
    }
    componentWillMount() {
        super.componentWillMount()
    }
    componentDidMount() {
        super.componentDidMount()
    }
    didPageChange() {
        Store.Parent.style.cursor = 'wait'
        const newRoute = Router.getNewRoute()
        const oldRoute = Router.getOldRoute()
        if (oldRoute === undefined) {
            this.templateSelection(newRoute)
        } else {
            PagerActions.onTransitionOut()
        }
    }
    templateSelection(newRoute) {
        let type = undefined
        let template = undefined
        switch (newRoute.type) {
        case Constants.HOME:
            type = Home
            template = HomeTemplate
            break
        default:
            type = Home
            template = HomeTemplate
        }
        this.setupNewComponent(newRoute, type, template)
        this.currentComponent = this.components['new-component']
    }
    pageAssetsLoaded() {
        const newRoute = Router.getNewRoute()
        this.templateSelection(newRoute)
        super.pageAssetsLoaded()
    }
    update() {
        if (this.currentComponent !== undefined) this.currentComponent.update()
    }
    resize() {
        if (this.currentComponent !== undefined) this.currentComponent.resize()
    }
}

export default PagesContainer
