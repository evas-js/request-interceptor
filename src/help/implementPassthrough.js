/**
 * Расширение перехватчика/перехватчиков запросов 
 * прохождением мимо перехватчика/перехватчиков в случае отсутствия маршрута.
 * @package @evas-js/request-interceptor
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { logs } from "./messages"

export function implementPassthrough(target) {
    /** @var { Boolean } _passthrough */

    /**
     * Включить/выключить прохождение мимо перехватчика/перехватчиков в случае отсутствия маршрута.
     * @param { Boolean|true } enabled Включить/выключить
     * @returns { this }
     */
    target.passthrough = function(enabled = true) {
        console.log(logs.enablePassthrough(enabled, this))
        this._passthrough = enabled
        return this
    }
}
