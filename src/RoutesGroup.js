/**
 * Группировка роутов перехватчика запросов.
 * @package @evas-js/request-interceptor
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { errors, logs } from "./help/messages"

export class RoutesGroup {
    // urlPrefix
    // _routes = {}
    _routesSimple = {}
    _routesComputed = {}

    constructor(urlPrefix, cb) {
        this.urlPrefix = urlPrefix
        if ('function' === typeof cb) cb.call(this, this)
    }

    /**
     * Установка маршрута
     * @param { String } method HTTP-метод
     * @param { String } path путь
     * @param { Function } cb обработчик
     */
    route(method, path, cb) {
        method = method.toUpperCase()

        const regexp = /:(?<key>[a-zA-Z_\\$][a-zA-Z0-9_\\$]*)(\((?<pattern>.*)\))?/g
        let find, paramsCount = 0
        let newPath = path
        while (!!(find = regexp.exec(path)) && paramsCount++ < 10) {
            const origin = path.substring(find.index, regexp.lastIndex)
            const { key, pattern } = find.groups
            const replacement = `(?<${key}>${pattern ?? '[^\\/]+'})`
            if (paramsCount < 2) newPath = newPath.replaceAll('/', '\\/')
            newPath = newPath.replace(origin, replacement)
        }

        function addRoute(list, method, path) {
            if (!list[method]) list[method] = {}
            list[method][path] = cb
            // console.log(`[@evas-js/request-interceptor]: route added "[${method}] ${path}"`)
        }
        
        addRoute(paramsCount ? this._routesComputed : this._routesSimple, method, newPath)
        console.log(logs.addRoute({ method, path: newPath }, this))
        return this
    }
    
    get(path, cb) {
        return this.route('GET', path, cb)
    }

    post(path, cb) {
        return this.route('POST', path, cb)
    }

    group(path, cb) {
        return this.route('ALL', path, (resource, urlPrefix) => {
            let group = new this.constructor(path, cb)
            return group.callHandler(resource, urlPrefix)
        })
    }

    callHandler(request, urlPrefix) {
        if (!urlPrefix) urlPrefix = [this.urlPrefix].flat().find(item => request?.url?.startsWith(item))

        this.checkpoints = []

        let method = (request?.method || 'GET').toUpperCase()
        let path = request?.url?.replace(urlPrefix, '')

        // console.log(`[@evas-js/request-interceptor]: callHandler "[${method}] ${path}"`)
        console.log(logs.handleRequest(request, { method, path }))

        const withAll = (list) => Object.assign({}, list['ALL'], method === 'ALL' ? {} : (list[method] ?? {}))

        let cb = withAll(this._routesSimple)?.[path]
        if ('function' === typeof cb) {
            console.log('!!!!! IS func')
            return cb(request, urlPrefix + path)
        }
        
        for (let [pattern, cb] of Object.entries(withAll(this._routesComputed))) {
            const params = new RegExp(`^${pattern}$`).exec(path)?.groups
            console.log('!!!!!', pattern, path, urlPrefix, this.urlPrefix)
            if (params) {
                request.addParams(params)
                if ('function' === typeof cb) {
                    return cb(request, urlPrefix + pattern)
                }
            }
        }
        throw errors.notFoundRoute(request, this)
    }
}
