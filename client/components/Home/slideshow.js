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
    const intervalTime = 3000
    const slidesContainerEl = dom.select('.slides-container', el)
    const titleEl = dom.select('.title-container', el)
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

    const activate = () => {
        if (isActive) return
        intervalId = setInterval(nextSlide, intervalTime)
        isActive = true
    }

    const deactivate = () => {
        if (!isActive) return
        clearInterval(intervalId)
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
