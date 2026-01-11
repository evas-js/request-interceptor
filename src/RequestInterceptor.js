/**
 * Перехватчик fetch/XHR запросов.
 * @package @evas-js/request-interceptor
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { RoutesGroup } from "./RoutesGroup.js"
import { Request } from "./Request.js"
import { Response } from "./Response.js"
import { implementMocks } from "./help/implementMocks.js"
import { errors, logs } from "./help/messages.js"
import { implementPassthrough } from "./help/implementPassthrough.js"

export class RequestInterceptor extends RoutesGroup {
    static interceptors = []
    // static _passthrough = false
    static XMLHttpRequestArgs
    static isRun = false
    static isOverride = false

    static enabled
    // static mocks = {}
    // mocks = {}

    static get hasInterceptors() {
        return this.interceptors.length > 0
    }

    static init({ enabled = true, init, mocks }) {
        this.enabled = enabled
        this.setMocks(mocks)
        init(this)
        return this
    }

    static override() {
        if (this.isOverride) return this
        console.log(logs.overrideOriginal(['fetch', 'XMLHttpRequest']))
        const { fetch: originalFetch } = window
        window.fetch = (...args) => this.fetchListener(originalFetch, ...args)

        const self = this
        const { 
            open: originalOpen, 
            setRequestHeader: originalSetRequestHeader, 
            send: originalSend,
            // overrideMimeType: originalOverrideMimeType,
        } = XMLHttpRequest.prototype

        XMLHttpRequest.prototype.open = function (...args) {
            const keys = ['method', 'url', 'async', 'user', 'password']
            self.XMLHttpRequestArgs = args.reduce((params, arg, i) => {
                params[keys[i]] = arg
                return params
            }, {})
            // console.log('open', ...args)
            return originalOpen.call(this, ...args)
        }
        XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
            if (!self.XMLHttpRequestArgs?.headers) self.XMLHttpRequestArgs.headers = {}
            self.XMLHttpRequestArgs.headers[name] = value
            return originalSetRequestHeader.call(this, name, value)
        }
        // XMLHttpRequest.prototype.overrideMimeType = function (value) {
        //     return originalOverrideMimeType.call(this, value)
        // }
        XMLHttpRequest.prototype.send = function (body) {
            if (body) self.XMLHttpRequestArgs.body = body
            // console.log('send', self.XMLHttpRequestArgs, this)
            return self.xhrListener(originalSend.bind(this), self.XMLHttpRequestArgs)
        }
        this.isOverride = true
        return this
    }

    static run() {
        console.log(logs.runInterceptors)
        this.isRun = true
        if (!this.isOverride) this.override()
        return this
    }

    static stop() {
        console.log(logs.stopInterceptors)
        this.isRun = false
        return this
    }

    static findInterceptor(url) {
        return this.interceptors.find(
            item => [item.urlPrefix].flat().some((value) => url.startsWith(value))
        )
    }
    static hasInterceptor(urlPrefix) {
        return this.interceptors.some(
            item => [item.urlPrefix].flat().some((value) => urlPrefix === value)
        )
    }

    static listener(original, args) {
        if (!this.isRun) {
            // возвращаем результат оригинального запроса (interceptors not run)
            console.log(logs.callOrigin(args, { isRun: this.isRun }))
            return original(args)
        }
        console.log(logs.newRequest(args))
        let interceptor = this.findInterceptor(args.url)
        if (!interceptor) {
            if (this._passthrough) return original(args)
            else {
                const message = errors.notFoundInterceptor(args)
                console.warn(message)
                return Response.notFound(message)
            }
        }
        
        try {
            const response = interceptor.callHandler(args)
            // есть ответ
            console.log(logs.localResponse(response))
            return response instanceof Response ? response : Response.ok(response)
        } catch (error) {
            // нет обработчика запроса
            if (this._passthrough) {
                // возвращаем результат оригинального запроса (passthrough enabled)
                console.log(logs.callOrigin(args, { isRun: this.isRun, _passthrough: this._passthrough }))
                return original(args)
            }
            // возвращаем ответ с 404 ошибкой (passthrough not enabled)
            // const message = errors.notFoundRoute(args, interceptor)
            console.warn(error)
            return Response.notFound(error)
        }
    }

    static async fetchListener(originalFetch, resource, config) {
        return await this.listener(
            (args) => originalFetch(args.url, args), 
            Request.fromFetch(resource, config)
        )
    }

    static xhrListener(originalSend, args) {
        return this.listener(
            (args) => originalSend(args.body), 
            Request.fromXHR(args)
        )
    }

    /**
     * Создание перехватчика
     * @param { String|String[] } urlPrefix префикс или массив префиксов адресов перехватчика
     * @param { Function } cb колбэк для настройки перехватчика
     * @returns { this }
     */
    static listen(urlPrefix, cb) {
        new this(urlPrefix, cb)
        return this
    }
    
    // urlPrefix
    _routes = {}

    constructor(urlPrefix, cb) {
        console.log(logs.addInterceptor({ urlPrefix }))
        super(urlPrefix, cb)
        if (this.constructor.hasInterceptor(urlPrefix)) {
            console.error(errors.interceptorAlreadyExists(urlPrefix))
            return
        }
        // this.urlPrefix = urlPrefix
        // if ('function' == typeof cb) cb(this)
        this.constructor.interceptors.push(this)
        this.constructor.run()
    }


    /**
     * Установка маршрута
     * @param { String } method HTTP-метод
     * @param { String } path путь
     * @param { Function } cb обработчик
     */
    // route(method, path, cb) {
    // addRoute(method, path) {
    //     method = method.toUpperCase()
    //     if (!this._routes[method]) this._routes[method] = {}

    //     // const [, key, , pattern] = part.match(/:(?<key>.[^()])(\((?<pattern>.*)\))?/)
    //     // const { key, pattern } = /:(?<key>.[^()])(\((?<pattern>.*)\))?/.exec(part).groups
        
    //     // this._routes[method] = objectAssignRecursive(this._routes[method], route)
    //     console.log(`RequestInterceptor Add [${method}] ${path}`)

    //     return this
    // }

    syncFromApi(api) {
        function deep(items, fullLKey = '') {
            let result = {}
            if (items && typeof items === 'object') Object.entries(items).forEach(([key, item]) => {
                key = `${fullLKey}/${key}`
                if (typeof item === 'function') {
                    result[key] = item
                } else {
                    Object.entries(deep(item, key)).forEach(([key2, item2]) => {
                        result[key2] = item2
                    })
                }
            })
            return result
        }
        if (api) {
            let result = deep(api)
            console.log(result)
        }
    }
}

implementPassthrough(RequestInterceptor)
implementPassthrough(RequestInterceptor.prototype)

implementMocks(RequestInterceptor)
implementMocks(RequestInterceptor.prototype)
