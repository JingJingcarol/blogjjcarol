
import { createApp } from './app'


export default context => {
    return new Promise((resolve, reject) => {
        const {app, router} = createApp()
        router.push(context.url)
        router.onReady(() => {
            // Promise 应该 resolve 应用程序实例，以便它可以渲染
            resolve(app)
        }, reject)

    })
}