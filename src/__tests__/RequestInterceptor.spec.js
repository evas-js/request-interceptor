import { describe, expect, it } from "vitest"
import { RequestInterceptor } from "../RequestInterceptor"
import { Response } from "../Response"

const urlPrefix = 'https://evas-js.com/'

const callFetch = async (url, options = {}, dataCb, dataType = 'json') => {
    console.log('__fetch__', url)
    await fetch(url, options)
    .then(response => {
        console.log('__fetched__', url, response)
        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`)
            console.error(`HTTP error! status: ${response.status}`)
        }
        if (response instanceof Response) return response.body
        const isExpectJson = dataType === 'json' || response.headers?.['content-type'] === 'application/json'
        return isExpectJson ? response.json() : response.text()
    })
    .then(data => {
        console.log('DATA', data) // Process the fetched data
        if (typeof dataCb === 'function') dataCb()
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error)
    })
}

describe('RequestInterceptor', () => {
    it('listen', async () => {
        RequestInterceptor.listen(
            urlPrefix, 
            // 'https://evas-php.com/',
            // (interceptor) => {
            //     interceptor.get('/', (request) => {
            //         console.log('Home handler', request)
            //     })
            //     interceptor.get('/users/list', () => {
            //         const users = requestInterceptor.mocks.User?.all()
            //         console.log('User LIST', users)
            //         return users
            //     })
            //     interceptor.get('/users/:id', (request) => {
            //         // console.log('User id handler', request)
            //         console.log('User with id', request.params.id, RequestInterceptor.mocks.User?.find(request.params.id))
            //     })
            //     interceptor.get('/users/:id([a-zA-Z0-9_-]{1,10})', (request) => {
            //         console.log('User id handler', request)
            //     })
            //     interceptor.get('/users/:id/company/:company_id', (request) => {
            //         console.log('User with company', request)
            //     })
            //     interceptor.group('/admin', (request) => {
            //         console.log('Admin handler', request)
            //     })
            // }
            (interceptor) => {
                interceptor.get('home', (request) => {
                    console.log('Home handler', request)
                    return 'Home handler'
                })
                interceptor.group('users', (group) => {
                    group.get('home', (request) => {
                        console.log('User LIST', request)
                        return 'users list'
                    })
                    group.get('/:id', (request) => {
                        console.log('User with id', request)
                        return 'User with id'
                    })
                })
            }
        )
        // RequestInterceptor.passthrough()


        // expect('hello').toBe('hello')
        // console.log(RequestInterceptor)

        // const url = urlPrefix
        // const url = urlPrefix + 'home'
        const url = urlPrefix + 'users/home'
        await callFetch(url, null, null, 'text')
       
    })
})
