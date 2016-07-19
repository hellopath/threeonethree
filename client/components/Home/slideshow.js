import Store from '../../store'
import Utils from '../../utils'
import Constants from '../../constants'
import dom from 'dom-hand'
import counter from 'ccounter'

export default (el)=> {
    let scope
    let isActive = false
    let intervalId
    let fromTopTimeout, toTopTimeout
    let pos = { x:0, y:0 }
    const slides = []
    const intervalTime = 2500
    const slidesContainerEl = dom.select('.slides-container', el)
    const titleEl = dom.select('.title-container', el)
    const titleInside = dom.select('.vertical-center-child', titleEl)
    const fromTopTween = TweenMax.fromTo(titleEl, 1, { y:-10, scale:1.1, opacity:0, transformOrigin:'50% 50%', force3D:true }, { y:0, scale:1, opacity:1, force3D:true, transformOrigin:'50% 50%', ease:Expo.easeOut })
    fromTopTween.pause(0)
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

    const update = () => {
        const x = Math.sin(Store.Mouse.nX) * 30
        const y = Math.sin(Store.Mouse.nY) * 20
        pos.x += (x - pos.x) * 0.08
        pos.y += (y - pos.y) * 0.08
        Utils.translate(titleInside, pos.x, pos.y, 1)
    }

    const activate = (direction) => {
        if (isActive) return
        intervalId = setInterval(nextSlide, intervalTime)
        clearTimeout(fromTopTimeout)
        fromTopTimeout = setTimeout(() => { fromTopTween.timeScale(1).play(0) }, 300)
        isActive = true
    }

    const deactivate = (direction) => {
        if (!isActive) return
        clearInterval(intervalId)
        clearTimeout(toTopTimeout)
        toTopTimeout = setTimeout(() => { fromTopTween.timeScale(3.6).reverse() }, 300)
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
        update,
        id: undefined,
        position: [0, 0],
        size: [0, 0]
    }
    return scope
}
