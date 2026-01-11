import { describe, expect, it } from "vitest"
import { errors, logs } from "../help/messages"
import { RequestInterceptor } from "../RequestInterceptor"

const libraryPrefix = '[@evas-js/request-interceptor]:'
const urlPrefix = 'https://evas-js.com/'
const url = 'https://evas-js.com/users'
const method = 'GET'

const makeMessage = (...args) => [libraryPrefix, args].flat(Infinity).join(' ').replaceAll(' .', '.')
const interceptor = { urlPrefix }
const realInterceptor = new RequestInterceptor(urlPrefix)
const route = { path: url, method }
const request = { url, method }

describe('error messages', () => {
    it('interceptorAlreadyExists(urlPrefix)', () => {
        expect(errors.interceptorAlreadyExists(urlPrefix)).toBe(makeMessage(
            'Interceptor "https://evas-js.com/" already exists'
        ))
    })
    it('routeAlreadyExists(route, interceptor)', () => {
        expect(errors.routeAlreadyExists(route, interceptor)).toBe(makeMessage(
            'Route "[GET] https://evas-js.com/users" already exists',
            'in Interceptor "https://evas-js.com/"'
        ))
    })
    it('notFoundInterceptor(request)', () => {
        expect(errors.notFoundInterceptor(request)).toBe(makeMessage(
            'Interceptor not found (by urlPrefix)',
            'for Request "[GET] https://evas-js.com/users".',
            'Request has been stopped (passthrough not enabled)'
        ))
    })
    it('notFoundRoute(request, interceptor)', () => {
        expect(errors.notFoundRoute(request, interceptor)).toBe(makeMessage(
            'Not found route for Request "[GET] https://evas-js.com/users"',
            'in Interceptor "https://evas-js.com/".',
            'Request has been stopped (passthrough not enabled)'
        ))
    })
})

describe('log messages', () => {
    it ('addInterceptor(interceptor)', () => {
        expect(logs.addInterceptor(interceptor)).toBe(makeMessage(
            'Add Interceptor "https://evas-js.com/"'
        ))
    })
    it ('addRoute(route, interceptor)', () => {
        expect(logs.addRoute(route, interceptor)).toBe(makeMessage(
            'Add Route "[GET] https://evas-js.com/users" to Interceptor "https://evas-js.com/"'
        ))
    })

    it ('enablePassthrough()', () => {
        expect(logs.enablePassthrough(true)).toBe(makeMessage(
            'Enable passthrough for all interceptors'
        ))
        expect(logs.enablePassthrough(true, interceptor)).toBe(makeMessage(
            'Enable passthrough for all interceptors'
        ))
        expect(logs.enablePassthrough(true, realInterceptor)).toBe(makeMessage(
            'Enable passthrough for Interceptor "https://evas-js.com/"'
        ))
        expect(logs.enablePassthrough(false)).toBe(makeMessage(
            'Disable passthrough for all interceptors'
        ))
        expect(logs.enablePassthrough(false, interceptor)).toBe(makeMessage(
            'Disable passthrough for all interceptors'
        ))
        expect(logs.enablePassthrough(false, realInterceptor)).toBe(makeMessage(
            'Disable passthrough for Interceptor "https://evas-js.com/"'
        ))
        expect(logs.enablePassthrough()).toBe(makeMessage(
            'Disable passthrough for all interceptors'
        ))
    })
    it ('setMocks()', () => {
        expect(logs.setMocks()).toBe(makeMessage(
            'Set mocks for all interceptors'
        ))
        expect(logs.setMocks(interceptor)).toBe(makeMessage(
            'Set mocks for all interceptors'
        ))
        expect(logs.setMocks(realInterceptor)).toBe(makeMessage(
            'Set mocks for Interceptor "https://evas-js.com/"'
        ))
    })
    it ('addMocks()', () => {
        expect(logs.addMocks()).toBe(makeMessage(
            'Add mocks for all interceptors'
        ))
        expect(logs.addMocks(interceptor)).toBe(makeMessage(
            'Add mocks for all interceptors'
        ))
        expect(logs.addMocks(realInterceptor)).toBe(makeMessage(
            'Add mocks for Interceptor "https://evas-js.com/"'
        ))
    })
    it ('addMocksModel()', () => {
        expect(logs.addMocksModel('User')).toBe(makeMessage(
            'Add mocks model "User" for all interceptors'
        ))
        expect(logs.addMocksModel('User', interceptor)).toBe(makeMessage(
            'Add mocks model "User" for all interceptors'
        ))
        expect(logs.addMocksModel('User', realInterceptor)).toBe(makeMessage(
            'Add mocks model "User" for Interceptor "https://evas-js.com/"'
        ))
    })
    
    it ('overrideOriginal()', () => {
        expect(logs.overrideOriginal()).toBe(makeMessage(
            'Override original'
        ))
        expect(logs.overrideOriginal('fetch', 'XMLHttpRequest')).toBe(makeMessage(
            'Override original fetch, XMLHttpRequest'
        ))
    })
    it ('runInterceptors', () => {
        expect(logs.runInterceptors).toBe(makeMessage('Run interceptors'))
    })
    it ('stopInterceptors', () => {
        expect(logs.stopInterceptors).toBe(makeMessage('Stop interceptors'))
    })

    it ('newRequest(request)', () => {
        expect(logs.newRequest(request)).toBe(makeMessage('New Request "[GET] https://evas-js.com/users"'))
    })
    it ('handleRequest(request, route)', () => {
        expect(logs.handleRequest(request, route)).toBe(makeMessage(
            'Handle Request "[GET] https://evas-js.com/users" by Route "[GET] https://evas-js.com/users"'
        ))
    })
    it ('localResponse()', () => {
        expect(logs.localResponse('something message')).toBe(makeMessage('Local Response "something message"'))
    })
    it ('callOrigin()', () => {
        const interceptorsNotRun = 'Call origin Request "[GET] https://evas-js.com/users" (interceptors not run)'
        expect(logs.callOrigin(request, { isRun: false, _passthrough: true })).toBe(makeMessage(interceptorsNotRun))
        expect(logs.callOrigin(request, { isRun: false, _passthrough: false })).toBe(makeMessage(interceptorsNotRun))
        expect(logs.callOrigin(request, { isRun: false })).toBe(makeMessage(interceptorsNotRun))
        expect(logs.callOrigin(request, { _passthrough: true })).toBe(makeMessage(interceptorsNotRun))
        expect(logs.callOrigin(request, { _passthrough: false })).toBe(makeMessage(interceptorsNotRun))
        expect(logs.callOrigin(request)).toBe(makeMessage(interceptorsNotRun))
        
        expect(logs.callOrigin(request, { isRun: true, _passthrough: true })).toBe(makeMessage(
            'Call origin Request "[GET] https://evas-js.com/users" (passthrough enabled)'
        ))
        expect(logs.callOrigin(request, { isRun: true, _passthrough: false })).toBe(makeMessage(
            'Call origin Request "[GET] https://evas-js.com/users"'
        ))
        expect(logs.callOrigin(request, { isRun: true })).toBe(makeMessage(
            'Call origin Request "[GET] https://evas-js.com/users"'
        ))
    })
})
