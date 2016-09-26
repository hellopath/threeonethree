import Store from '../../store'
import Constants from '../../constants'
import Utils from '../../utils'
import Actions from '../../actions'
import dom from 'dom-hand'

export default (el)=> {
    let scope
    const li = dom.select.all('li', el)
    let dots = []

    const onClick = (e) => {
    	e.preventDefault()
    	const id = parseInt(e.currentTarget.getAttribute('id'), 10)
        Actions.updateSlideshowById(id)
    }

    const onMouseEnter = (e) => {
    	e.preventDefault()
    	dom.classes.add(e.currentTarget, 'highlight')
    }

    const onMouseLeave = (e) => {
    	e.preventDefault()
    	dom.classes.remove(e.currentTarget, 'highlight')
    }

    const updateDots = (id) => {
        if (id === 0) dom.classes.remove(el, 'active')
        else dom.classes.add(el, 'active')
            
        dots.forEach((item) => {
            dom.classes.remove(item.el, 'active')
        })
        const dot = dots[id]
        dom.classes.add(dot.el, 'active')
    }

    li.forEach((item) => {
    	const id = parseInt(item.getAttribute('id'), 10)
    	dom.event.on(item, 'click', onClick)
    	dom.event.on(item, 'mouseenter', onMouseEnter)
    	dom.event.on(item, 'mouseleave', onMouseLeave)
    	dots.push({
    		id,
    		el: item
    	})
    })

    Store.on(Constants.UPDATE_MENU, updateDots)

    scope = {
    	el
    }
    return scope
}
