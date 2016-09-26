import BaseComponent from '../../pager/components/BaseComponent'
import template from './template.hbs'
import Store from '../../store'
import Constants from '../../constants'
import dom from 'dom-hand'
import Menu from '../Menu'

class FrontContainer extends BaseComponent {
    constructor() {
        super()
        this.onAppStarted = this.onAppStarted.bind(this)
        this.didRouteChange = this.didRouteChange.bind(this)
    }
    render(parent) {
        let scope = {}
        const menu = [
            { id:0 },
            { id:1 },
            { id:2 },
            { id:3 },
            { id:4 },
            { id:5 },
            { id:6 },
            { id:7 },
        ]
        scope.menu = menu
        super.render('FrontContainer', parent, template, scope)
    }
    componentWillMount() {
        super.componentWillMount()
    }
    componentDidMount() {
        Store.on(Constants.APP_START, this.onAppStarted)
        Store.on(Constants.ROUTE_CHANGED, this.didRouteChange)

        const menuEl = dom.select('.menu', this.element)
        this.menu = Menu(menuEl)

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
