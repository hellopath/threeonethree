import Page from '../Page'
import Store from '../../store'
import Constants from '../../constants'
import Utils from '../../utils'
import Actions from '../../actions'
import slideshow from './slideshow'
import dom from 'dom-hand'
import scrolltop from 'simple-scrolltop'
import inertia from 'wheel-inertia'
import raf from 'raf'
import Hammer from 'hammerjs'
import miniVideo from 'mini-video'

export default class Home extends Page {
    constructor(props) {
        props.data.bottomImgSrc = Store.baseMediaPath() + 'media/slideshow/g/0.jpg'
        super(props)
        this.didInertia = this.didInertia.bind(this)
        this.didWheel = this.didWheel.bind(this)
        this.animate = this.animate.bind(this)
        this.endSlideCallback = this.endSlideCallback.bind(this)
        this.onScroll = this.onScroll.bind(this)
        this.onUpdateSlideshow = this.onUpdateSlideshow.bind(this)
        this.lastSlideshowIndex = undefined
    }
    componentDidMount() {
        this.slidePos = { y:0 }
        this.lastScrollY = 0
        const slideshowsEl = dom.select.all('.slideshow')
        this.slidesHolder = dom.select('.all-slides-holder')
        this.slideBlockEl = dom.select.all('.slide-block')
        this.bottomSlide = dom.select('.bottom-slide')
        this.bottomImg = dom.select('.bottom-slide .background')
        this.arrowBtn = dom.select('.arrow-holder')
        this.blobs = dom.select.all('#blob-container img')
        this.blobsContainer = dom.select('#blob-container')
        this.slideshows = []
        this.slides = []
        this.currentSlideIndex = Store.Detector.isMobile ? 1 : 0
        this.slideshowIndex = 0
        this.oldSlideshow = undefined
        this.newSlideshow = undefined
        this.readyToSlide = true
        const dataSlideshows = Store.pageContent().slideshows
        let slidesNum = 0
        slideshowsEl.forEach((el, i) => {
            const dataSlideshow = dataSlideshows[i].images
            const s = slideshow(el)
            s.id = i
            this.slideshows[i] = s
            dataSlideshow.forEach((dataS, j) => {
                this.slides.push({
                    global: slidesNum,
                    local: j,
                    parent: i,
                    index: i + 1
                })
                slidesNum++
            })
        })

        this.slides.unshift({
            global: -1,
            local: -1,
            parent: -1,
            index: 0
        })

        this.slides.push({
            global: 18,
            local: 0,
            parent: this.slideshows.length,
            index: this.slideshows.length + 1
        })

        $(window).on('mousewheel', this.didWheel)
        inertia.addCallback(this.didInertia)

        const videoEl = dom.select('.top-slide .video-holder')
        const videoUrl = Store.Detector.isMobile ? Store.baseMediaPath() + 'media/Logo_III_01_1_1_mobile.mp4' : Store.baseMediaPath() + 'media/Logo_III_01_1.mp4'
        
        this.mainLoader = dom.select('#main-loader')
        if (!Store.Detector.isMobile) {
            this.mVideo = miniVideo({
                autoplay: Store.Detector.isMobile ? false : true,
                loop: false,
                volume: 1
            })
            this.mVideo.addTo(videoEl)
            this.mVideo.load(videoUrl, ()=>{
                dom.classes.add(this.mainLoader, 'remove')
                dom.classes.add(this.arrowBtn, 'active')
                setTimeout(() => {
                    this.spinnerTween.pause()
                    this.spinnerTween = undefined
                    dom.tree.remove(this.mainLoader)
                }, 2000)
            })
            var $spinner = dom.select('.spinner-wrapper', this.mainLoader)
            var $spinnerSvg = dom.select('svg', $spinner)
            this.spinnerTween = TweenMax.to($spinnerSvg, 0.5, { rotation:'360deg', repeat:-1, ease:Linear.easeNone })
        } else {
            dom.tree.remove(this.mainLoader)
        }

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

        dom.event.on(document, 'scroll', this.onScroll)
        Store.on(Constants.UPDATE_SLIDESHOW, this.onUpdateSlideshow)

        this.animate()
        super.componentDidMount()
    }
    onUpdateSlideshow(id) {
        let currentSlideIndex = undefined
        this.slides.forEach((slide) => {
            if (slide.index === id) {
                const slideshow = this.slideshows[slide.parent]
                if (slideshow) slideshow.slideToFirst()
                this.currentSlideIndex = slide.global - 1
            }
        })
        if (this.currentSlideIndex === 17) this.currentSlideIndex = 19
        if (this.currentSlideIndex < 0) this.currentSlideIndex = 0
        if (Store.Detector.isMobile) {
            if (this.currentSlideIndex <= 1) this.currentSlideIndex = 1
        }
        this.scrollNext(1)
    }
    onScroll(e) {
        e.preventDefault()
    }
    updateParallaxElements() {
        const windowH = Store.Window.h
        const windowW = Store.Window.w
        const relativeY = this.lastScrollY / ((this.slideshows.length + 2) * windowH)
        this.prefix(this.blobs[1].style, "Transform", "translate3d(" + (-40) + "px," + this.pos(windowH * 2.2, -windowH*11, relativeY, 0) + 'px, 0)');
        this.prefix(this.blobs[3].style, "Transform", "translate3d(" + (windowW * 0.85) + "px," + this.pos(windowH * 3.5, -windowH*11, relativeY, 0) + 'px, 0)');
        this.prefix(this.blobs[4].style, "Transform", "translate3d(" + (-40) + "px," + this.pos(windowH * 4.9, -windowH*11, relativeY, 0) + 'px, 0)');
        this.prefix(this.blobs[2].style, "Transform", "translate3d(" + (windowW * 0.75) + "px," + this.pos(windowH * 6.1, -windowH*11, relativeY, 0) + 'px, 0)');
        this.prefix(this.blobs[0].style, "Transform", "translate3d(" + (-40) + "px," + this.pos(windowH * 6.7, -windowH*11, relativeY, 0) + 'px, 0)');
        this.prefix(this.blobs[5].style, "Transform", "translate3d(" + (0) + "px," + this.pos(windowH * 8.2, -windowH*11, relativeY, 0) + 'px, 0)');
    }
    prefix(obj, prop, value) {
        var prefs = ['webkit', 'Moz', 'o', 'ms'];
        for (var pref in prefs) {
            obj[prefs[pref] + prop] = value;
        }
    }
    pos(base, range, relY, offset) {
        return base + this.limit(0, 1, relY - offset) * range;
    }
    limit(min, max, value) {
        return Math.max(min, Math.min(max, value));
    }
    animate() {
        this.updateParallaxElements()
        if (this.newSlideshow) {
            this.newSlideshow.update()
        }
        this.rafId = raf(this.animate)
    }
    didWheel(e) {
        const delta = e.deltaY
        inertia.update(delta)
    }
    didInertia(dir) {
        if (!this.readyToSlide) return
        this.changeIndexByDirection(dir)
        this.readyToSlide = false
        setTimeout(() => { this.readyToSlide = true }, 1200)
    }
    changeIndexByDirection(dir) {
        if (dir === 1) this.currentSlideIndex--
        else this.currentSlideIndex++
        if (this.currentSlideIndex < 0) this.currentSlideIndex = 0
        if (this.currentSlideIndex > this.slides.length - 1) this.currentSlideIndex = 0

        if (Store.Detector.isMobile && this.currentSlideIndex < 1) this.currentSlideIndex = 1 

        this.nextSlideIndex = this.currentSlideIndex + 1
        if (this.nextSlideIndex > this.slides.length - 1) this.nextSlideIndex = 0

        this.previousSlideIndex = this.currentSlideIndex - 1
        if (this.previousSlideIndex < 0) this.previousSlideIndex = this.slides.length - 1
        this.scrollNext(dir)
    }
    scrollNext(dir) {
        const windowH = Store.Window.h
        const slideshowItemIndex = this.currentSlideIndex - 1
        const slide = this.slides[this.currentSlideIndex]
        const groupPosition = slide.index * windowH

        TweenMax.to(this.slidePos, 1.6, { y:-groupPosition, force3D:true, ease:Power4.easeInOut, onUpdate: () => {
            this.prefix(this.slidesHolder.style, "Transform", "translateY(" + this.slidePos.y + 'px )')
            this.lastScrollY = Math.abs(this.slidePos.y)
        }})
        
        setTimeout(() => { Actions.updateMenu(slide.index) }, 0)

        const newSlideshow = this.slideshows[slide.parent]
        
        const nextIndex = slide.parent + 1
        const nextSlideshow = this.slideshows[nextIndex]
        if (nextSlideshow) nextSlideshow.slideToFirst()

        if (newSlideshow !== undefined && this.newSlideshow !== undefined && newSlideshow.id === this.newSlideshow.id) {

            this.newSlideshow.toSlide(slide.local)

        } else {

            this.oldSlideshow = this.newSlideshow
            this.newSlideshow = newSlideshow

            if (this.newSlideshow) {
                setTimeout(() => { this.newSlideshow.activate(dir) }, 750)
                this.newSlideshow.endSlideCallback = this.endSlideCallback

                const previousIndex = slide.parent - 1
                const previousSlideshow = this.slideshows[previousIndex]
                if (previousSlideshow) previousSlideshow.toSlide(2)
            }
            if (this.oldSlideshow) {
                this.oldSlideshow.deactivate()
                this.oldSlideshow.endSlideCallback = undefined
            }

        }

        if (this.currentSlideIndex === this.slides.length - 1) {
            dom.classes.add(this.bottomSlide, 'active')
        } else {
            setTimeout(() => {
                dom.classes.remove(this.bottomSlide, 'active')  
            }, 1200)
        }

        if (this.currentSlideIndex === 0 || this.currentSlideIndex === this.slides.length - 1) {
            dom.classes.remove(this.blobsContainer, 'active')
        } else {
            dom.classes.add(this.blobsContainer, 'active')
        }

        if (this.currentSlideIndex === 0) {
            if (!Store.Detector.isMobile) this.mVideo.play(0)
        }
        
    }
    endSlideCallback()  {
        this.changeIndexByDirection(-1)
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

        if (!Store.Detector.isMobile) {
            this.mVideo.el.style.width = bottomImgVars.width + 'px'
            this.mVideo.el.style.height = bottomImgVars.height + 'px'
            this.mVideo.el.style.top = bottomImgVars.top + 'px'
            this.mVideo.el.style.left = bottomImgVars.left + 'px'
            this.mainLoader.style.left = (windowW >> 1) - (40 / 2) + 'px'
            this.mainLoader.style.top = (windowH >> 1) - (40) + 'px'
        }

        this.scrollNext()
        super.resize()
    }
    componentWillUnmount() {
        super.componentWillUnmount()
    }
}

