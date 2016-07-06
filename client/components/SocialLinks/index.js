import Store from '../../store'
import Constants from '../../constants'
import dom from 'dom-hand'

const socialLinks = (parent)=> {
    let scope
    const wrapper = dom.select('#footer #social-wrapper', parent)
    scope = {
        resize: ()=> {
            const windowW = Store.Window.w
            const windowH = Store.Window.h
            const padding = Constants.PADDING_AROUND * 0.4

            const wrapperSize = dom.size(wrapper)

            const socialCss = {
                left: windowW - padding - wrapperSize[0],
                top: windowH - padding - wrapperSize[1]
            }

            wrapper.style.left = socialCss.left + 'px'
            wrapper.style.top = socialCss.top + 'px'
        },
        show: ()=> {
            setTimeout(()=>dom.classes.remove(wrapper, 'hide'), 1000)
        },
        hide: ()=> {
            setTimeout(()=>dom.classes.add(wrapper, 'hide'), 500)
        }
    }

    return scope
}

export default socialLinks
