import BaseComponent from '../../pager/components/BaseComponent'
import template from './template.hbs'
import Store from '../../store'
import Constants from '../../constants'
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
        super.componentDidMount()
    }
    didRouteChange() {
    }
    onAppStarted() {
        Store.off(Constants.APP_START, this.onAppStarted)
    }
    resize() {
        if (!this.domIsReady) return
    }
}

export default FrontContainer
