import Dispatcher from '../dispatcher'
import Constants from '../constants'
import {EventEmitter2} from 'eventemitter2'
import assign from 'object-assign'
import data from '../data'
import Router from '../services/router'
import isRetina from 'is-retina'

function _getContentScope(route) {
    return Store.getRoutePathScopeById(route.path)
}
function _getPageAssetsToLoad(route) {
    const routeObj = (route === undefined) ? Router.getNewRoute() : route
    // const scope = _getContentScope(routeObj)
    const type = _getTypeOfPage()
    const typeId = type.toLowerCase()
    let manifest = []
    if (type !== Constants.PORTRAIT) {
        const filenames = [
            // 'face' + _getImageDeviceExtension() + '.png',
            'face.png',
            'shoe.png',
            'background.jpg'
        ]
        manifest = _addBasePathsToUrls(filenames, routeObj.parent, routeObj.target, type, typeId)
    }
    // // In case of extra assets
    // if (scope.assets !== undefined) {
    //     const assets = scope.assets
    //     let assetsManifest
    //     if (type === Constants.PORTRAIT) {
    //         assetsManifest = _addBasePathsToUrls(assets, 'home', routeObj.target, type)
    //     } else {
    //         assetsManifest = _addBasePathsToUrls(assets, routeObj.parent, routeObj.target, type)
    //     }
    //     manifest = (manifest === undefined) ? assetsManifest : manifest.concat(assetsManifest)
    // }
    return manifest
}
function _addBasePathsToUrls(urls, pageId, targetId, type, typeId) {
    let basePath = Store.baseMediaPath() + 'media/group/'
    basePath += pageId + '/' + targetId + '/' + typeId + '/'
    let manifest = []
    for (let i = 0; i < urls.length; i++) {
        const splitter = urls[i].split('.')
        const fileName = splitter[0]
        const extension = splitter[1]
        let id = typeId + '-' + pageId + '-'
        if (targetId) id += targetId + '-'
        id += fileName
        manifest[i] = {
            id,
            src: basePath + fileName + '.' + extension
        }
    }
    return manifest
}
function _isRetina() {
    return isRetina()
}
function _getAllGroupsTexturesManifest() {
    let manifest = []
    const mainPath = Store.baseMediaPath()
    for (let k in data.groups) {
        if ({}.hasOwnProperty.call(data.groups, k)) {
            const textures = data.groups[k].textures
            textures.forEach((tex) => {
                const id = k + '-texture-' + tex.name
                const src = mainPath + 'media/group/' + k + '/common/' + tex.name + '.' + tex.ext
                manifest.push({ id, src })
            })
        }
    }
    return manifest
}
function _getImageDeviceExtension() {
    const retina = _isRetina()
    let str = '@1x'
    if (retina === true) str = '@2x'
    return str
}
function _getDeviceRatio() {
    const scale = (window.devicePixelRatio === undefined) ? 1 : window.devicePixelRatio
    return (scale > 1) ? 2 : 1
}
function _getTypeOfPage(route) {
    let type
    const h = route || Router.getNewRoute()
    if (h.parts.length === 3) type = Constants.PRODUCT
    else type = Constants.PORTRAIT
    return type
}
function _getPageContent() {
    const route = Router.getNewRoute()
    const path = (route.type === Constants.PRODUCT) ? route.path.replace('/product', '') : route.path
    const content = data.routing[path]
    return content
}
function _getContentByLang(lang) {
    return data.content.lang[lang]
}
function _getGlobalContent() {
    return _getContentByLang(Store.lang())
}
function _getAppData() {
    return data
}
function _getDefaultRoute() {
    return data['default-route']
}
function _windowWidthHeight() {
    return {
        w: window.innerWidth,
        h: window.innerHeight
    }
}

const Store = assign({}, EventEmitter2.prototype, {
    emitChange: (type, item) => {
        Store.emit(type, item)
    },
    pageContent: () => {
        return _getPageContent()
    },
    appData: () => {
        return _getAppData()
    },
    defaultRoute: () => {
        return _getDefaultRoute()
    },
    globalContent: () => {
        return _getGlobalContent()
    },
    pageAssetsToLoad: (route) => {
        return _getPageAssetsToLoad(route)
    },
    getRoutePathScopeById: (id) => {
        let key = id.length < 1 ? '/' : id
        if (key.indexOf('product')) key = key.replace('/product', '')
        return data.routing[key]
    },
    pagePreloaderId: () => {
        const route = Router.getNewRoute()
        return route.type.toLowerCase() + '-' + route.parts[0] + '-' + route.parts[1] + '-'
    },
    getImgSrcById: (name) => {
        const route = Router.getNewRoute()
        const type = route.type.toLowerCase()
        const id = type + '-' + route.parent + '-' + route.target + '-' + name
        return Store.Preloader.getImageURL(id)
    },
    getImgById: (name) => {
        const route = Router.getNewRoute()
        const type = route.type.toLowerCase()
        const id = type + '-' + route.parent + '-' + route.target + '-' + name
        return Store.Preloader.getContentById(id)
    },
    getTextureSrc: (group, name) => {
        return Store.Preloader.getImageURL(group + '-texture-' + name)
    },
    getTexture: (group, name) => {
        const img = Store.getTextureImg(group, name)
        const texture = new THREE.Texture()
        texture.image = img
        texture.needsUpdate = true
        return texture
    },
    getTextureImg: (group, name) => {
        return Store.Preloader.getContentById(group + '-texture-' + name)
    },
    baseMediaPath: () => {
        return Store.getEnvironment().static
    },
    getCurrentGroup: () => {
        return Router.getNewRoute().parent
    },
    getAllTexturesManifest: () => {
        return _getAllGroupsTexturesManifest()
    },
    getEnvironment: () => {
        return Constants.ENVIRONMENTS[ENV]
    },
    generalInfos: () => {
        return data.content
    },
    devicePixelRatio: () => {
        return _getDeviceRatio()
    },
    getNextRoute: () => {
        const newRoute = Router.getNewRoute()
        const routes = Router.getPortraitRoutes()
        const current = (newRoute.type === Constants.PORTRAIT) ? newRoute.path : newRoute.path.replace('/product', '')
        let nextRoute = undefined
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i]
            if (route.path === current) {
                const index = (i + 1) > routes.length - 1 ? 0 : (i + 1)
                nextRoute = routes[index]
                break
            }
        }
        return nextRoute
    },
    getPreviousRoute: () => {
        const newRoute = Router.getNewRoute()
        const routes = Router.getPortraitRoutes()
        const current = (newRoute.type === Constants.PORTRAIT) ? newRoute.path : newRoute.path.replace('/product', '')
        let previousRoute = undefined
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i]
            if (route.path === current) {
                const index = (i - 1) < 0 ? routes.length - 1 : (i - 1)
                previousRoute = routes[index]
                break
            }
        }
        return previousRoute
    },
    getNextPath: () => {
        return Store.getNextRoute().path
    },
    getPreviousPath: () => {
        return Store.getPreviousRoute().path
    },
    getImageDeviceExtension: _getImageDeviceExtension,
    lang: () => {
        let defaultLang = true
        for (let i = 0; i < data.langs.length; i++) {
            const lang = data.langs[i]
            if (lang === JSLang) {
                defaultLang = false
            }
        }
        return (defaultLang === true) ? 'en' : JSLang
    },
    Window: () => {
        return _windowWidthHeight()
    },
    Mouse: { x:0, y:0, nX:0, nY:0 },
    Parent: undefined,
    Canvas: undefined,
    Orientation: Constants.ORIENTATION.LANDSCAPE,
    Detector: {},
    dispatcherIndex: Dispatcher.register((payload) => {
        const action = payload.action
        switch (action.actionType) {
        case Constants.WINDOW_RESIZE:
            Store.Window.w = action.item.windowW
            Store.Window.h = action.item.windowH
            Store.Orientation = (Store.Window.w > Store.Window.h) ? Constants.ORIENTATION.LANDSCAPE : Constants.ORIENTATION.PORTRAIT
            Store.emitChange(action.actionType)
            break
        default:
            Store.emitChange(action.actionType, action.item)
            break
        }
        return true
    })
})

export default Store
