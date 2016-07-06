import Store from '../../store'
import Constants from '../../constants'
import dom from 'dom-hand'
import textBtn from '../TextBtn'

const headerLinks = (parent)=> {
    let scope

    const onSubMenuMouseEnter = (e)=> {
        e.preventDefault()
        dom.classes.add(e.currentTarget, 'hovered')
    }
    const onSubMenuMouseLeave = (e)=> {
        e.preventDefault()
        dom.classes.remove(e.currentTarget, 'hovered')
    }

    const changeColor = (color) => {
        const btns = dom.select.all('a', parent)
        const logoSvg = dom.select('.logo svg', parent)
        const textTitle = dom.select('.shop-title .text-title', parent)
        btns.forEach((btn) => {
            btn.style.color = color
        })
        textTitle.style.color = color
        logoSvg.setAttribute('fill', color)
    }

    const simpleTextBtnsEl = dom.select.all('.text-btn', parent)
    let simpleBtns = []
    let i, s, el
    for (i = 0; i < simpleTextBtnsEl.length; i++) {
        el = simpleTextBtnsEl[i]
        s = textBtn(el)
        simpleBtns[i] = s
    }

    const shopWrapper = dom.select('.shop-wrapper', parent)
    shopWrapper.addEventListener('mouseenter', onSubMenuMouseEnter)
    shopWrapper.addEventListener('mouseleave', onSubMenuMouseLeave)

    scope = {
        changeColor,
        resize: ()=> {
            const windowW = Store.Window.w
            const padding = Constants.PADDING_AROUND / 3

            const camperLab = simpleBtns[1]
            const shop = simpleBtns[2]
            const map = simpleBtns[0]
            const shopSize = dom.size(shopWrapper)

            const camperLabCss = {
                left: windowW - (Constants.PADDING_AROUND * 0.6) - padding - camperLab.size[0],
                top: Constants.PADDING_AROUND
            }
            const shopCss = {
                left: camperLabCss.left - shopSize[0] - padding - 20,
                top: Constants.PADDING_AROUND
            }
            const mapCss = {
                left: shopCss.left - map.size[0] - padding - 30,
                top: Constants.PADDING_AROUND
            }

            shop.el.style.left = (shopSize[0] >> 1) - (shop.size[0] >> 1) + 'px'

            camperLab.el.style.left = camperLabCss.left + 'px'
            camperLab.el.style.top = camperLabCss.top + 'px'
            shopWrapper.style.left = shopCss.left + 'px'
            shopWrapper.style.top = shopCss.top + 'px'
            map.el.style.left = mapCss.left + 'px'
            map.el.style.top = mapCss.top + 'px'
        }
    }

    return scope
}

export default headerLinks
