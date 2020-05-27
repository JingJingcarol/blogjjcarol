const fs = require("fs")
const path = require('path')
const Koa = require('koa');
const Router = require('koa-router')
const { createBundleRenderer } = require('vue-server-renderer')

const template = fs.readFileSync(path.join(__dirname,"../index.html"), "utf-8")
const bundle = require('../dist/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/vue-ssr-client-manifest.json')

// global.fetch = require('node-fetch');


const app = new Koa();
const router = new Router();
const serverStatic = require("koa-static")
// app.use("/dist", express.static("dist"))

app.use(serverStatic(path.join(__dirname, '../dist')));

const renderer = createBundleRenderer(bundle, {
    template,
    clientManifest
})

const renderData = (ctx, renderer) => {
    const context = {
        url: ctx.url,
        title: 'Vue Koa2 SSR',
        cookies: ctx.request.headers.cookie
    }
    return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
        if (err) {
            return reject(err)
        }
        resolve(html)
        })
    })
}

router.get('*',async ctx => {
    let html, status
    try {
      status = 200
      html = await renderData(ctx, renderer)
    } catch (e) {
      console.log('\ne', e)
      if (e.code === 404) {
        status = 404
        html = '404 | Not Found'
      } else {
        status = 500
        html = '500 | Internal Server Error'
      }
    }
    ctx.type = 'html'
    ctx.status = status ? status : ctx.status
    ctx.body = html
})

// 启动路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(9000, function () {
    console.log("server start and listen port 9000")
})