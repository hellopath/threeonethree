import Page from '../Page'
import Store from '../../store'
import Constants from '../../constants'
import Utils from '../../utils'
import slideshow from './slideshow'
import dom from 'dom-hand'
import scrolltop from 'simple-scrolltop'
import inertia from 'wheel-inertia'
import { addWheelListener } from 'wheel'
import raf from 'raf'
import Hammer from 'hammerjs'

export default class Home extends Page {
    constructor(props) {
        props.data.logoUrl = Store.baseMediaPath() + 'media/logo-big.png'
        props.data.bottomImgSrc = Store.baseMediaPath() + 'media/slideshow/g/0.jpg'
        super(props)
        this.didInertia = this.didInertia.bind(this)
        this.didWheel = this.didWheel.bind(this)
        this.animate = this.animate.bind(this)
    }
    componentDidMount() {
        const slideshowsEl = dom.select.all('.slideshow')
        this.slidesHolder = dom.select('.all-slides-holder')
        this.logoWrapper = dom.select('#logo-wrapper')
        this.slideBlockEl = dom.select.all('.slide-block')
        this.bottomSlide = dom.select('.bottom-slide')
        this.bottomImg = dom.select('.bottom-slide .background')
        this.slideshows = []
        this.currentSlideIndex = 0
        this.slideshowIndex = 0
        this.oldSlideshow = undefined
        this.newSlideshow = undefined
        slideshowsEl.forEach((el, i) => {
            const slide = slideshow(el)
            slide.id = i
            this.slideshows[i] = slide
        })

        addWheelListener(document, this.didWheel)
        inertia.addCallback(this.didInertia)

        const hammertime = new Hammer(document)
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
        hammertime.on('swipe', (ev) => {
            if (ev.deltaY < 0) this.changeIndexByDirection(-1)
            else this.changeIndexByDirection(1)
        })

        this.animate()
        super.componentDidMount()
    }
    animate() {
        if (this.newSlideshow) {
            this.newSlideshow.update()
        }
        this.rafId = raf(this.animate)
    }
    didWheel(e) {
        const delta = e.wheelDelta
        inertia.update(delta)
    }
    didInertia(dir) {
        this.changeIndexByDirection(dir)
    }
    changeIndexByDirection(dir) {
        if (dir === 1) this.currentSlideIndex--
        else this.currentSlideIndex++
        if (this.currentSlideIndex < 0) this.currentSlideIndex = 0
        if (this.currentSlideIndex > this.slideshows.length + 1) this.currentSlideIndex = 0
        this.scrollNext()
    }
    scrollNext() {
        const windowH = Store.Window.h
        const pos = this.currentSlideIndex * windowH
        const slideshowItemIndex = this.currentSlideIndex - 1
        TweenMax.set(this.slidesHolder, { y:-pos, force3D:true })


        if (slideshowItemIndex >= 0 && slideshowItemIndex < this.slideshows.length) {
            this.oldSlideshow = this.newSlideshow
            this.newSlideshow = this.slideshows[slideshowItemIndex]
            this.newSlideshow.activate()
            if (this.oldSlideshow) this.oldSlideshow.deactivate()
        }

        if (this.currentSlideIndex === this.slideshows.length + 1) {
            dom.classes.add(this.bottomSlide, 'active')
        } else {
            dom.classes.remove(this.bottomSlide, 'active')
        }
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
        const bottomImgVars = Utils.resizePositionProportionally(windowW, windowH, Constants.MEDIA_GLOBAL_W, Constants.MEDIA_GLOBAL_H)
        this.bottomImg.style.width = bottomImgVars.width + 'px'
        this.bottomImg.style.height = bottomImgVars.height + 'px'
        this.bottomImg.style.top = bottomImgVars.top + 'px'
        this.bottomImg.style.left = bottomImgVars.left + 'px'

        this.scrollNext()
        super.resize()
    }
    componentWillUnmount() {
        super.componentWillUnmount()
    }
}

