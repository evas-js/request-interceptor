/**
 * Класс ответа.
 * @package @evas-js/request-interceptor
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { isObjectOnly } from "../helper-methods/object/object"

export class Response {
    status = 200
    statusText = 'OK'
    ok = true
    body

    constructor(props) {
        if (isObjectOnly(props)) Object.entries(props).forEach(([key, val]) => this[key] = val)
    }

    static ok(body) {
        return new this({ body })
    }

    static notFound(body) {
        return new this({
            status: 404,
            statusText: 'Not Found',
            ok: false,
            body
        })
    }
}
