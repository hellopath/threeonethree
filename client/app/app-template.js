import BaseComponent from '../pager/components/BaseComponent'
import FrontContainer from '../components/FrontContainer'
import PagesContainer from '../components/PagesContainer'
import Store from '../store'
import Constants from '../constants'
import { resize as globalResize } from '../services/global-events'

class AppTemplate extends BaseComponent {
    constructor() {
        super()
        this.resize = this.resize.bind(this)
    }
    render(parent) {
        super.render('AppTemplate', parent, undefined)
    }
    componentWillMount() {
        super.componentWillMount()
    }
    componentDidMount() {
        this.frontContainer = new FrontContainer()
        this.frontContainer.render('#app-template')

        this.pagesContainer = new PagesContainer()
        this.pagesContainer.render('#app-template')

        setTimeout(()=>{
            this.isReady()
            this.onReady()
        }, 0)

        globalResize()

        super.componentDidMount()
    }
    onReady() {
        Store.on(Constants.WINDOW_RESIZE, this.resize)
    }
    resize() {
        this.frontContainer.resize()
        this.pagesContainer.resize()
        super.resize()
    }
}

export default AppTemplate

