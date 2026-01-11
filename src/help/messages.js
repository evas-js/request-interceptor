/**
 * Сообщения для логов.
 * @package @evas-js/request-interceptor
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { Request } from "../Request"
import { RequestInterceptor } from "../RequestInterceptor"

const libraryPrefix = '[@evas-js/request-interceptor]:'
const requestHasBeenStopped = 'Request has been stopped (passthrough not enabled)'
const requestToString = (request) => `Request "[${request?.method}] ${request?.url}"`
const routeToString = (route) => `Route "[${route?.method}] ${route?.path}"`
const responseToString = (response) => `Response ${JSON.stringify(response)}`
const interceptorToString = (interceptor) => `Interceptor "${interceptor?.urlPrefix}"`
const interceptorToStringOrAll = (interceptor) => {
    return interceptor instanceof RequestInterceptor ? interceptorToString(interceptor) : 'all interceptors'
}

const makeMessage = (...args) => [libraryPrefix, args].flat(Infinity).join(' ').replaceAll(' .', '.').trim()

/** @var { Object } errors сообщения ошибок */
export const errors = {
    /**
     * Перехватчик с таким префиксом url уже существует.
     * @param { String } urlPrefix 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Interceptor "https://evas-js.com/" already exists
     */
    interceptorAlreadyExists: (urlPrefix) => makeMessage(`Interceptor "${urlPrefix}" already exists`),
    /**
     * Маршрут уже существует в перехватчике.
     * @param { Object } route 
     * @param { RequestInterceptor } interceptor 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Route "[GET] https://evas-js.com/users" already exists in Interceptor "https://evas-js.com/"
     */
    routeAlreadyExists: (route, interceptor) => makeMessage(
        routeToString(route), 'already exists in', interceptorToString(interceptor)
    ),

    /**
     * Не найден перехватчик для запроса.
     * @param { Request} request 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Interceptor not found (by urlPrefix) for Request "[GET] https://evas-js.com/users". Request has been stopped (passthrough not enabled)
     */
    notFoundInterceptor: (request) => makeMessage(
        'Interceptor not found (by urlPrefix) for', requestToString(request), '.', requestHasBeenStopped
    ),
    /**
     * Не найден маршрут для запроса в перехватчике.
     * @param { Request } request 
     * @param { RequestInterceptor } interceptor 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Not found route for Request "[GET] https://evas-js.com/users" in Interceptor "https://evas-js.com/". Request has been stopped (passthrough not enabled)
     */
    notFoundRoute: (request, interceptor) => makeMessage(
        'Not found route for', requestToString(request), 'in', interceptorToString(interceptor), '.', requestHasBeenStopped
    ),
}

/** @var { Object } logs сообщения логгирования */
export const logs = {
    /**
     * Добавлен перехватчик запросов.
     * @param { RequestInterceptor} interceptor 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Add Interceptor "https://evas-js.com/"
     */
    addInterceptor: (interceptor) => makeMessage('Add', interceptorToString(interceptor)),
    /**
     * Добавлен маршрут в перехватчик запросов.
     * @param { Object } route 
     * @param { RequestInterceptor } interceptor 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Add Route "[GET] https://evas-js.com/users" to Interceptor "https://evas-js.com/"
     */
    addRoute: (route, interceptor) => makeMessage('Add', routeToString(route), 'to', interceptorToString(interceptor)),
    /**
     * Включено/выключено прохождение мимо перехватчика/перехватчиков в случае отсутствия маршрута.
     * @param { Boolean } enabled
     * @param { RequestInterceptor|null } interceptor 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Add passthrough for Interceptor "https://evas-js.com/"
     * @example [@evas-js/request-interceptor]: Add passthrough for all interceptors
     */
    enablePassthrough: (enabled, interceptor) => makeMessage(
        (enabled ? 'Enable' : 'Disable'),
        'passthrough for', interceptorToStringOrAll(interceptor)
    ),
    /**
     * Установлены моки для перехватчика/перехватчиков.
     * @param { RequestInterceptor|null } interceptor 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Set mocks for Interceptor "https://evas-js.com/"
     * @example [@evas-js/request-interceptor]: Set mocks for all interceptors
     */
    setMocks: (interceptor) => makeMessage('Set mocks for', interceptorToStringOrAll(interceptor)),
    /**
     * Добавлены моки для перехватчика/перехватчиков.
     * @param { RequestInterceptor|null } interceptor 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Add mocks for Interceptor "https://evas-js.com/"
     * @example [@evas-js/request-interceptor]: Add mocks for all interceptors
     */
    addMocks: (interceptor) => makeMessage('Add mocks for', interceptorToStringOrAll(interceptor)),
    /**
     * Добавлена модель данных моков для перехватчика/перехватчиков.
     * @param { String } entityName имя модели данных моков
     * @param { RequestInterceptor|null } interceptor 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Add mocks model "User" for Interceptor "https://evas-js.com/"
     * @example [@evas-js/request-interceptor]: Add mocks model "User" for all interceptors
     */
    addMocksModel: (entityName, interceptor) => makeMessage(
        `Add mocks model "${entityName}" for`, interceptorToStringOrAll(interceptor)
    ),

    /**
     * Переопределение оригинальных методов для возможности перехвата.
     * @param { ...String } methodNames имена методов перехвата (например: fetch, XMLHttpRequest)
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Override original fetch, XMLHttpRequest
     */
    overrideOriginal: (...methodNames) => makeMessage('Override original', [methodNames].flat(Infinity).join(', ')),
    /**
     * Запуск перехватчиков.
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Run interceptors
     */
    runInterceptors: makeMessage('Run interceptors'),
    /**
     * Остановка перехватчиков.
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Stop interceptors
     */
    stopInterceptors: makeMessage('Stop interceptors'),

    /**
     * Новый запрос.
     * @param { Request } request 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: New Request "[GET] https://evas-js.com/users"
     */
    newRequest: (request) => makeMessage('New', requestToString(request)),

    /**
     * Обработка запроса обработчиком маршрута.
     * @param { Request } request 
     * @param { Object } route 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Handle Request "[GET] https://evas-js.com/users" by Route "[GET] https://evas-js.com/users"
     */
    handleRequest: (request, route) => makeMessage(
        'Handle', requestToString(request), 'by', routeToString(route)
    ),

    /**
     * Ответ перехваченного запроса.
     * @param { any } response 
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Local Response "something message"
     */
    localResponse: (response) => makeMessage(
        'Local', responseToString(response)
    ),

    /**
     * Вызов оригинального запроса.
     * @param { Request } request
     * @param { Object|null } interceptor
     * @returns { String }
     * @example [@evas-js/request-interceptor]: Call origin Request "[GET] https://evas-js.com/users"
     * @example [@evas-js/request-interceptor]: Call origin Request "[GET] https://evas-js.com/users" (interceptors not run)
     * @example [@evas-js/request-interceptor]: Call origin Request "[GET] https://evas-js.com/users" (passthrough enabled)
     */
    callOrigin: (request, { isRun, _passthrough } = {}) => makeMessage(
        'Call origin', requestToString(request), 
        !isRun ? '(interceptors not run)' : (_passthrough ? '(passthrough enabled)' : '')
    ),
}
