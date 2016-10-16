import BaseComponent from '../BaseComponent'
import {PagerStore, PagerActions, PagerConstants} from '../../Pager'
import Utils from '../../../utils'
import template from './template.hbs'
import Store from '../../../store'
import Actions from '../../../actions'

class BasePager extends BaseComponent {
    constructor() {
        super()
        this.currentPageDivRef = 'page-b'
        this.willPageTransitionIn = this.willPageTransitionIn.bind(this)
        this.willPageTransitionOut = this.willPageTransitionOut.bind(this)
        this.didPageTransitionInComplete = this.didPageTransitionInComplete.bind(this)
        this.didPageTransitionOutComplete = this.didPageTransitionOutComplete.bind(this)
        this.pageTransitionDidFinish = this.pageTransitionDidFinish.bind(this)
        this.components = {
            'new-component': undefined,
            'old-component': undefined
        }
    }
    render(parent) {
        super.render('BasePager', parent, template, undefined)
    }
    componentWillMount() {
        PagerStore.on(PagerConstants.PAGE_TRANSITION_IN, this.willPageTransitionIn)
        PagerStore.on(PagerConstants.PAGE_TRANSITION_OUT, this.willPageTransitionOut)
        PagerStore.on(PagerConstants.PAGE_TRANSITION_DID_FINISH, this.pageTransitionDidFinish)
        super.componentWillMount()
    }
    willPageTransitionIn() {
        this.switchPagesDivIndex()
        if (this.components['new-component'] !== undefined) this.components['new-component'].willTransitionIn()
    }
    willPageTransitionOut() {
        setTimeout(Actions.loadPageAssets, 0)
    }
    pageAssetsLoaded() {
        if (this.components['new-component'] !== undefined) this.components['new-component'].willTransitionOut()
    }
    didPageTransitionInComplete() {
        Store.Parent.style.cursor = 'auto'
        PagerActions.onTransitionInComplete()
        PagerActions.pageTransitionDidFinish()
    }
    didPageTransitionOutComplete() {
        PagerActions.onTransitionOutComplete()
    }
    pageTransitionDidFinish() {
        // Actions.loadNextPreviousPageAssets()
        this.unmountComponent('old-component')
    }
    switchPagesDivIndex() {
        const newComponent = this.components['new-component']
        const oldComponent = this.components['old-component']
        if (newComponent !== undefined) newComponent.parent.style['z-index'] = 2
        if (oldComponent !== undefined) oldComponent.parent.style['z-index'] = 1
    }
    setupNewComponent(route, Type, tmpl) {
        const id = 'home'
        this.oldPageDivRef = this.currentPageDivRef
        this.currentPageDivRef = (this.currentPageDivRef === 'page-a') ? 'page-b' : 'page-a'
        const el = document.getElementById(this.currentPageDivRef)
        Store.pageContent().slideshows.forEach((slide) => {
            slide.isMobile = Store.Detector.isMobile
        })
        const props = {
            id: this.currentPageDivRef,
            isReady: this.onPageReady,
            route: route,
            didTransitionInComplete: this.didPageTransitionInComplete,
            didTransitionOutComplete: this.didPageTransitionOutComplete,
            data: Store.pageContent()
        }
        const page = new Type(props)
        page.render(id, el, tmpl, props.data)
        this.components['old-component'] = this.components['new-component']
        this.components['new-component'] = page

        if (PagerStore.pageTransitionState === PagerConstants.PAGE_TRANSITION_IN_PROGRESS) {
            this.components['old-component'].forceUnmount()
        }
    }
    onPageReady(route) {
        PagerActions.onPageReady(route)
    }
    componentDidMount() {
        super.componentDidMount()
    }
    unmountComponent(ref) {
        if (this.components[ref] !== undefined) {
            this.components[ref].remove()
        }
    }
}

export default BasePager

