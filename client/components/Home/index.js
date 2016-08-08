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
        props.data.logoUrl = Store.baseMediaPath() + 'media/logo.png'
        props.data.bottomImgSrc = Store.baseMediaPath() + 'media/slideshow/g/0.jpg'
        super(props)
        this.didInertia = this.didInertia.bind(this)
        this.didWheel = this.didWheel.bind(this)
        this.animate = this.animate.bind(this)
        this.endSlideCallback = this.endSlideCallback.bind(this)
    }
    componentDidMount() {
        const slideshowsEl = dom.select.all('.slideshow')
        this.slidesHolder = dom.select('.all-slides-holder')
        this.logoWrapper = dom.select('#logo-wrapper')
        this.slideBlockEl = dom.select.all('.slide-block')
        this.bottomSlide = dom.select('.bottom-slide')
        this.bottomImg = dom.select('.bottom-slide .background')
        this.arrowBtn = dom.select('.arrow-holder')
        this.slideshows = []
        this.currentSlideIndex = 0
        this.slideshowIndex = 0
        this.oldSlideshow = undefined
        this.newSlideshow = undefined
        this.readyToSlide = true
        slideshowsEl.forEach((el, i) => {
            const slide = slideshow(el)
            slide.id = i
            this.slideshows[i] = slide
        })

        addWheelListener(document, this.didWheel)
        inertia.addCallback(this.didInertia)

        const logoTopEl = dom.select('#logo-wrapper')
        const logoBottomEl = dom.select('.bottom-slide #logo-wrapper')
        this.logoTopSprite = new Motio(logoTopEl, {
            fps: 30,
            frames: 24,
            width: Constants.LOGO_W * 0.4,
            height: Constants.LOGO_H * 0.4
        })
        this.logoBottomSprite = new Motio(logoBottomEl, {
            fps: 30,
            frames: 24,
            width: Constants.LOGO_W * 0.4,
            height: Constants.LOGO_H * 0.4
        })

        const hammertime = new Hammer(document)
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
        hammertime.on('swipe', (ev) => {
            if (ev.deltaY < 0) this.changeIndexByDirection(-1)
            else this.changeIndexByDirection(1)
        })

        dom.event.on(this.arrowBtn, 'click', (e) => {
            e.preventDefault()
            this.changeIndexByDirection(-1)
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
        if (!this.readyToSlide) return
        this.changeIndexByDirection(dir)
        this.readyToSlide = false
        setTimeout(() => {
            this.readyToSlide = true
        }, 500)
    }
    changeIndexByDirection(dir) {
        if (dir === 1) this.currentSlideIndex--
        else this.currentSlideIndex++
        if (this.currentSlideIndex < 0) this.currentSlideIndex = 0
        if (this.currentSlideIndex > this.slideshows.length + 1) this.currentSlideIndex = 0
        this.scrollNext(dir)
    }
    scrollNext(dir) {
        const windowH = Store.Window.h
        const pos = this.currentSlideIndex * windowH
        const slideshowItemIndex = this.currentSlideIndex - 1
        TweenMax.set(this.slidesHolder, { y:-pos, force3D:true })

        this.oldSlideshow = this.newSlideshow
        this.newSlideshow = this.slideshows[slideshowItemIndex]
        if (this.newSlideshow) {
            this.newSlideshow.activate(dir)
            this.newSlideshow.endSlideCallback = this.endSlideCallback
        }
        if (this.oldSlideshow) {
            this.oldSlideshow.deactivate()
            this.oldSlideshow.slideToFirst()
            this.oldSlideshow.endSlideCallback = undefined
        }

        if (this.currentSlideIndex === this.slideshows.length + 1) {
            dom.classes.add(this.bottomSlide, 'active')
        } else {
            dom.classes.remove(this.bottomSlide, 'active')
        }

        if (this.currentSlideIndex === 7) {
            this.logoBottomSprite.toEnd()
        }
    }
    endSlideCallback()  {
        this.changeIndexByDirection(-1)
    }
    setupAnimations() {
        super.setupAnimations()
    }
    didTransitionInComplete() {
        this.logoWrapper.style.opacity = 1
        super.didTransitionInComplete()
    }
    willTransitionIn() {
        this.logoTopSprite.toEnd()
        super.willTransitionIn()
    }
    willTransitionOut() {
        super.willTransitionOut()
    }
    resize() {
        const windowW = Store.Window.w
        const windowH = Store.Window.h
        let slideYPos = windowH
        if (this.slideshows) {
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
        }
        const bottomImgVars = Utils.resizePositionProportionally(windowW, windowH, Constants.MEDIA_GLOBAL_W, Constants.MEDIA_GLOBAL_H)
        this.bottomImg.style.width = bottomImgVars.width + 'px'
        this.bottomImg.style.height = bottomImgVars.height + 'px'
        this.bottomImg.style.top = bottomImgVars.top + 'px'
        this.bottomImg.style.left = bottomImgVars.left + 'px'

        this.logoTopSprite.element.style.left = (windowW >> 1) - (this.logoTopSprite.width >> 1) + 'px'
        this.logoTopSprite.element.style.top = ((windowH * 0.9) >> 1) - (this.logoTopSprite.height >> 1) + 'px'

        this.scrollNext()
        super.resize()
    }
    componentWillUnmount() {
        super.componentWillUnmount()
    }
}

