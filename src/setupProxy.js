const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api", {
            target: "https://172.17.97.252:6443",
            changeOrigin: true,
            secure: false
        })
    )
}