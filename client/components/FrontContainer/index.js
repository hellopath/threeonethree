import BaseComponent from '../../pager/components/BaseComponent'
import template from './template.hbs'
import Store from '../../store'
import Constants from '../../constants'
import headerLinks from '../HeaderLinks'
import dom from 'dom-hand'

class FrontContainer extends BaseComponent {
    constructor() {
        super()
        this.onAppStarted = this.onAppStarted.bind(this)
        this.didRouteChange = this.didRouteChange.bind(this)
    }
    render(parent) {
        let scope = {}
        super.render('FrontContainer', parent, template, scope)
    }
    componentWillMount() {
        super.componentWillMount()
    }
    componentDidMount() {
        Store.on(Constants.APP_START, this.onAppStarted)
        Store.on(Constants.ROUTE_CHANGED, this.didRouteChange)

        this.headerEl = dom.select('header', this.element)
        this.headerLinks = headerLinks(this.element)

        super.componentDidMount()
    }
    didRouteChange() {
    }
    onAppStarted() {
        Store.off(Constants.APP_START, this.onAppStarted)
        dom.classes.add(this.headerEl, 'show')
    }
    resize() {
        if (!this.domIsReady) return
        this.headerLinks.resize()
    }
}

export default FrontContainer
