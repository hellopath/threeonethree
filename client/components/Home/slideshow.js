import Store from '../../store'
import Utils from '../../utils'
import Constants from '../../constants'
import dom from 'dom-hand'
import counter from 'ccounter'

export default (el)=> {
    let scope
    let isActive = false
    let isDeactive = true
    let intervalId
    let fromTopTimeout, toTopTimeout, toBottomTimeout
    let pos = { x:0, y:0 }
    const slides = []
    const intervalTime = 2500
    const slidesContainerEl = dom.select('.slides-container', el)
    const titleEl = dom.select('.title-container', el)
    const titleInside = dom.select('.vertical-center-child div', titleEl)
    const descriptionInside = dom.select('.vertical-center-child p', titleEl)
    const fromTopTween = new TimelineMax()
    const fromBottomTween = new TimelineMax()
    fromTopTween.clear()
    fromBottomTween.clear()
    fromTopTween.fromTo(titleInside, 1, { y:200, opacity:0, force3D:true }, { y:0, opacity:1, force3D:true, ease:Expo.easeOut }, 0)
    fromTopTween.fromTo(descriptionInside, 1, { y:240, opacity:0, force3D:true }, { y:0, opacity:1, force3D:true, ease:Expo.easeOut }, 0.1)
    fromBottomTween.fromTo(titleInside, 1, { y:-240, opacity:0, force3D:true }, { y:0, opacity:1, force3D:true, ease:Expo.easeOut }, 0.1)
    fromBottomTween.fromTo(descriptionInside, 1, { y:-200, opacity:0, force3D:true }, { y:0, opacity:1, force3D:true, ease:Expo.easeOut }, 0)
    fromTopTween.pause(0)
    fromBottomTween.pause(0)
    
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
            if (!Store.Detector.isMobile) slide.container.style.top = (windowH * i) + 'px'
            slide.img.style.width = slideResizeVars.width + 'px'
            slide.img.style.height = slideResizeVars.height + 'px'
            slide.img.style.left = slideResizeVars.left + 'px'
            slide.img.style.top = slideResizeVars.top + 'px'
        })
        scope.slideToCurrent()
    }

    const update = () => {
        // const x = Math.sin(Store.Mouse.nX) * 30
        // const y = Math.sin(Store.Mouse.nY) * 20
        // pos.x += (x - pos.x) * 0.08
        // pos.y += (y - pos.y) * 0.08
        // Utils.translate(titleInside, pos.x, pos.y, 1)
    }

    const activate = (direction) => {
        isDeactive = false
        if (isActive) return
        // intervalId = setTimeout(scope.nextSlide, intervalTime)
        clearTimeout(fromTopTimeout)
        if (direction === 1) fromBottomTween.timeScale(1).play(0)
        else fromTopTween.timeScale(1).play(0)
        isActive = true
    }

    const deactivate = (direction) => {
        isActive = false
        if (isDeactive) return
        clearTimeout(intervalId)
        clearTimeout(toTopTimeout)
        clearTimeout(toBottomTimeout)
        toTopTimeout = setTimeout(() => { fromTopTween.timeScale(4).reverse() }, 1000)
        toBottomTimeout = setTimeout(() => { fromBottomTween.timeScale(4).reverse() }, 1000)
        isDeactive = true
    }

    const nextSlide = () => {
        cc.inc()
        const timeoutTime = (cc.props.index === 2) ? intervalTime + 3000 : intervalTime
        intervalId = setTimeout(scope.nextSlide, timeoutTime)
        scope.slideToCurrent()
        if (cc.props.index === 0) scope.endSlideCallback()
    }

    const toSlide = (val) => {
        cc.set(val)
        scope.slideToCurrent()
    }

    const slideToFirst = () => {
        cc.set(0)
        scope.slideToCurrent()
    }

    const slideToCurrent = () => {
        const windowW = Store.Window.w
        const windowH = Store.Window.h
        const yPos = windowH * cc.props.index
        if (!Store.Detector.isMobile) Utils.translate(slidesContainerEl, 0, -yPos, 0)
    }

    scope = {
        el,
        resize,
        activate,
        deactivate,
        nextSlide,
        toSlide,
        slideToCurrent,
        update,
        slideToFirst,
        endSlideCallback: undefined,
        id: undefined,
        position: [0, 0],
        size: [0, 0]
    }
    return scope
}
