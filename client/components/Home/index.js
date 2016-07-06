import Page from '../Page'
import Store from '../../store'
import Utils from '../../utils'
import Constants from '../../constants'
import slideshow from './slideshow'
import dom from 'dom-hand'
import scrolltop from 'simple-scrolltop'

export default class Home extends Page {
    constructor(props) {
        super(props)
        this.onScroll = this.onScroll.bind(this)
    }
    componentDidMount() {
        const slideshowsEl = dom.select.all('.slideshow')
        this.slideshows = []
        slideshowsEl.forEach((el, i) => {
            const slide = slideshow(el)
            slide.id = i
            this.slideshows[i] = slide
        })
        dom.event.on(document, 'scroll', this.onScroll)
        super.componentDidMount()
    }
    onScroll(e) {
        e.preventDefault()
        const windowH = Store.Window.h
        const top = scrolltop()
        this.slideshows.forEach((slide) => {
            if (top + (windowH >> 1) > slide.position[1] && top < slide.position[1] + windowH) {
                slide.activate()
            } else {
                slide.deactivate()
            }
        })
    }
    setupAnimations() {
        super.setupAnimations()
    }
    didTransitionInComplete() {
        super.didTransitionInComplete()
    }
    willTransitionIn() {
        super.willTransitionIn()
    }
    willTransitionOut() {
        super.willTransitionOut()
    }
    resize() {
        const windowW = Store.Window.w
        const windowH = Store.Window.h
        let slideYPos = 0
        this.slideshows.forEach((slide, i) => {
            slide.resize()
            slide.el.style.top = slideYPos + 'px'
            slide.size[0] = windowW
            slide.size[1] = windowH
            slide.position[0] = 0
            slide.position[1] = slideYPos
            slideYPos += windowH
        })
        super.resize()
    }
    componentWillUnmount() {
        super.componentWillUnmount()
    }
}

