import Store from '../../store'
import Utils from '../../utils'
import Constants from '../../constants'
import dom from 'dom-hand'

export default (el)=> {
    let scope
    const slides = dom.select.all('.slide', el)
    let isActive = false

    const resize = () => {
        const windowW = Store.Window.w
        const windowH = Store.Window.h
        const slideResizeVars = Utils.resizePositionProportionally(windowW, windowH, Constants.MEDIA_GLOBAL_W, Constants.MEDIA_GLOBAL_H)
        slides.forEach((slide) => {
            slide.style.width = slideResizeVars.width + 'px'
            slide.style.height = slideResizeVars.height + 'px'
            slide.style.left = slideResizeVars.left + 'px'
            slide.style.top = slideResizeVars.top + 'px'
        })
        el.style.width = windowW + 'px'
        el.style.height = windowH + 'px'
    }

    const activate = () => {
        if (isActive) return
        isActive = true
    }

    const deactivate = () => {
        if (!isActive) return
        isActive = false
    }

    scope = {
        el,
        resize,
        activate,
        deactivate,
        id: undefined,
        position: [0, 0],
        size: [0, 0]
    }
    return scope
}
