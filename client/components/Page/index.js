import BasePage from '../../pager/components/BasePage'
import Store from '../../store'
import Constants from '../../constants'

export default class Page extends BasePage {
    constructor(props) {
        super(props)
        this.transitionInCompleted = false
    }
    componentWillMount() {
        super.componentWillMount()
    }
    componentDidMount() {
        super.componentDidMount()
    }
    willTransitionIn() {
        super.willTransitionIn()
    }
    willTransitionOut() {
        super.willTransitionOut()
    }
    didTransitionInComplete() {
        super.didTransitionInComplete()
    }
    setupAnimations() {
        super.setupAnimations()
    }
    getImageUrlById(id) {
        const url = this.props.page.type === Constants.PORTRAIT ? 'portrait-' + id : this.props.page.parent + '-' + this.props.page.target + '-' + id
        return Store.Preloader.getImageURL(url)
    }
    getImageSizeById(id) {
        const url = this.props.page.type === Constants.PORTRAIT ? 'portrait-' + id : this.props.page.parent + '-' + this.props.page.target + '-' + id
        return Store.Preloader.getImageSize(url)
    }
    resize() {
        super.resize()
    }
    update() {
    }
    componentWillUnmount() {
        super.componentWillUnmount()
    }
}
