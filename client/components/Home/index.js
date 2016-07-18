import Page from '../Page'
import Store from '../../store'
import Utils from '../../utils'
import slideshow from './slideshow'
import dom from 'dom-hand'
import scrolltop from 'simple-scrolltop'

export default class Home extends Page {
    constructor(props) {
        props.data.logoUrl = Store.baseMediaPath() + 'media/logo-big.png'
        super(props)
        this.onScroll = this.onScroll.bind(this)
    }
    componentDidMount() {
        const slideshowsEl = dom.select.all('.slideshow')
        this.logoWrapper = dom.select('#logo-wrapper')
        this.currentScroll = 0
        this.bottomInside = dom.select('.bottom-slide .inside-container')
        this.slideBlockEl = dom.select.all('.slide-block')
        this.slideshows = []
        slideshowsEl.forEach((el, i) => {
            const slide = slideshow(el)
            slide.id = i
            this.slideshows[i] = slide
        })
        dom.event.on(document, 'scroll', this.onScroll)
        super.componentDidMount()
        this.checkScrollPosition()
    }
    onScroll(e) {
        e.preventDefault()
        this.checkScrollPosition()
    }
    checkScrollPosition() {
        const windowH = Store.Window.h
        const top = scrolltop()
        const direction = (this.currentScroll > top) ? -1 : 1
        this.currentScroll = top
        this.slideshows.forEach((slide) => {
            if (top + (windowH * 0.3) > slide.position[1]) {
                // console.log(slide.id, 'active')
                slide.activate(direction)
            } else {
                // console.log(slide.id, 'deactive')
                slide.deactivate(direction)
            }
        })
    }
    setupAnimations() {
        super.setupAnimations()
    }
    didTransitionInComplete() {
        this.logoWrapper.style.opacity = 1
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
        const bottomSize = dom.size(this.bottomInside)
        let slideYPos = windowH
        this.slideshows.forEach((slide, i) => {
            slide.resize()
            slide.size[0] = windowW
            slide.size[1] = windowH
            slide.position[0] = 0
            slide.position[1] = slideYPos
            slideYPos += windowH
        })
        this.slideBlockEl.forEach((block) => {
            block.style.width = windowW + 'px'
            block.style.height = windowH + 'px'
        })
        this.bottomInside.style.top = (windowH >> 1) - (bottomSize[1] >> 1) + 'px'
        super.resize()
    }
    componentWillUnmount() {
        super.componentWillUnmount()
    }
}

