import slug from 'to-slug-case'
import dom from 'dom-hand'

class BaseComponent {
    constructor() {
        this.domIsReady = false
        this.componentDidMount = this.componentDidMount.bind(this)
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.domIsReady = true
        this.resize()
    }
    render(childId, parentId, template, object) {
        this.componentWillMount()
        this.childId = childId
        this.parentId = parentId
        if (dom.isDom(parentId)) {
            this.parent = parentId
        } else {
            const id = this.parentId.indexOf('#') > -1 ? this.parentId.split('#')[1] : this.parentId
            this.parent = document.getElementById(id)
        }
        if (template === undefined) {
            this.element = document.createElement('div')
        } else {
            this.element = document.createElement('div')
            const t = template(object)
            this.element.innerHTML = t
        }
        if (this.element.getAttribute('id') === null) {
            this.element.setAttribute('id', slug(childId))
        }
        dom.tree.add(this.parent, this.element)
        setTimeout(this.componentDidMount, 0)
    }
    remove() {
        this.componentWillUnmount()
        this.element.remove()
    }
    resize() {
    }
    componentWillUnmount() {
    }
}

export default BaseComponent

