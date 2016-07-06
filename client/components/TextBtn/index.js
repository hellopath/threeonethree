import textBtnTemplate from './template.hbs'
import dom from 'dom-hand'
import Constants from '../../constants'

export default (container)=> {
    let scope
    let title = container.innerHTML.toUpperCase()
    let btnScope = { title: title }
    let template = textBtnTemplate(btnScope)
    container.innerHTML = template
    let textTitle = dom.select('.text-title', container)
    let size = dom.size(textTitle)
    let currentTl, tlLeft, tlRight
    let isActivated = false
    let tweenIn = ()=> {
        // if (direction === Constants.LEFT) {
        //     currentTl = tlLeft
        //     tlLeft.timeScale(2).tweenFromTo(0, 'in')
        // } else {
        //     currentTl = tlRight
        //     tlRight.timeScale(2).tweenFromTo(0, 'in')
        // }
    }
    let tweenOut = ()=> {
        // currentTl.timeScale(2.6).tweenTo('out')
    }
    let mouseEnter = (e)=> {
        e.preventDefault()
        if (isActivated) return
        let rect = e.currentTarget.getBoundingClientRect()
        let xMousePos = e.clientX
        let xPos = xMousePos - rect.left
        let w = rect.right - rect.left
        if (xPos > w / 2) {
            tweenIn(Constants.RIGHT)
        } else {
            tweenIn(Constants.LEFT)
        }
    }
    let mouseLeave = (e)=> {
        e.preventDefault()
        if (isActivated) return
        tweenOut()
    }
    let activate = ()=> {
        isActivated = true
        currentTl.timeScale(3).tweenTo('in')
    }
    let disactivate = ()=> {
        isActivated = false
        tlLeft.timeScale(3).tweenTo('out')
        tlRight.timeScale(3).tweenTo('out')
    }

    // dom.event.on(container, 'mouseenter', mouseEnter)
    // dom.event.on(container, 'mouseleave', mouseLeave)

    scope = {
        size: size,
        el: container,
        activate: activate,
        disactivate: disactivate,
        clear: ()=> {
            dom.event.off(container, 'mouseenter', mouseEnter)
            dom.event.off(container, 'mouseleave', mouseLeave)
            currentTl = null
            rectContainers = null
            bgLinesLeft = null
            bgLinesRight = null
        }
    }

    return scope
}
