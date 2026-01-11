/**
 * Расширение перехватчика/перехватчиков запросов поддержкой моков.
 * @package @evas-js/request-interceptor
 * @author Egor Vasyakin <egor@evas-php.com>
 * @license CC-BY-4.0
 */

import { logs } from "./messages"

export function implementMocks(target) {
    /** @var { Object } mocks моки */
    target.mocks = {}
    /**
     * Установка моков.
     * @param { Object|null } mocks моки
     * @returns this
     */
    target.setMocks = function (mocks = {}) {
        console.log(logs.setMocks(this))
        this.mocks = mocks
        return this
    }
    /**
     * Добавление моков.
     * @param { Object|null } mocks моки
     * @returns this
     */
    target.addMocks = function (mocks) {
        console.log(logs.addMocks(this))
        this.mocks = Object.assign(this.mocks, mocks)
        return this
    }
    /**
     * Добавление моков модели данных.
     * @param { Object } mocksModel модель данных из \@evas-js/vue-orm
     * @returns this
     */
    target.addMocksModel = function (mocksModel) {
        console.log(logs.addMocksModel(mocksModel.entityName, this))
        this.mocks[mocksModel.entityName] = mocksModel
        return this
    }
}
