import Store from '../../store'
import Utils from '../../utils'
import Constants from '../../constants'
import dom from 'dom-hand'
import counter from 'ccounter'

export default (el)=> {
    let scope
    let isActive = false
    let intervalId
    const slides = []
    const intervalTime = 2500
    const slidesContainerEl = dom.select('.slides-container', el)
    const titleEl = dom.select('.title-container', el)
    const fromTopTween = TweenMax.fromTo(titleEl, 1, { y:-10, scale:1.1, opacity:0, transformOrigin:'50% 50%', force3D:true }, { y:0, scale:1, opacity:1, force3D:true, transformOrigin:'50% 50%', ease:Expo.easeOut })
    const toTopTween = TweenMax.to(titleEl, 1, { y:0, scale:1.1, opacity:0, transformOrigin:'50% 50%', ease:Expo.easeOut, force3D:true })
    fromTopTween.pause(0)
    toTopTween.pause(0)
    dom.select.all('.slide', el).forEach((slide, i) => {
        const img = dom.select('img', slide)
        slides[i] = {
            container: slide,
            img
        }
    })
    let cc = counter(slides.length)

    const resize = () => {
        const windowW = Store.Window.w
        const windowH = Store.Window.h
        const slideResizeVars = Utils.resizePositionProportionally(windowW, windowH, Constants.MEDIA_GLOBAL_W, Constants.MEDIA_GLOBAL_H)
        slides.forEach((slide, i) => {
            slide.container.style.left = (windowW * i) + 'px'
            slide.img.style.width = slideResizeVars.width + 'px'
            slide.img.style.height = slideResizeVars.height + 'px'
            slide.img.style.left = slideResizeVars.left + 'px'
            slide.img.style.top = slideResizeVars.top + 'px'
        })
        scope.slideToCurrent()
    }

    const activate = (direction) => {
        if (isActive) return
        intervalId = setInterval(nextSlide, intervalTime)
        setTimeout(() => { fromTopTween.timeScale(1).play(0) }, 300)
        isActive = true
    }

    const deactivate = (direction) => {
        if (!isActive) return
        clearInterval(intervalId)
        setTimeout(() => { toTopTween.timeScale(3.6).play(0) }, 300)
        isActive = false
    }

    const nextSlide = () => {
        cc.inc()
        scope.slideToCurrent()
    }

    const slideToCurrent = () => {
        const windowW = Store.Window.w
        const xPos = windowW * cc.props.index
        Utils.translate(slidesContainerEl, -xPos, 0, 0)
    }

    scope = {
        el,
        resize,
        activate,
        deactivate,
        nextSlide,
        slideToCurrent,
        id: undefined,
        position: [0, 0],
        size: [0, 0]
    }
    return scope
}
