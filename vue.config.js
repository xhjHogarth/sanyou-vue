module.exports = {
    devServer: { 
        // sockHost: '192.168.1.107',
        // sockHost: '192.168.1.6',
        // sockHost:'192.168.1.4',
        // sockHost: '192.168.1.112',
        // sockHost: '192.168.0.44',
        sockHost: '60.191.72.227',
        proxy: {
            '/api': {
                // target: 'http://192.168.1.107:8081', // 对应自己的接口
                // target: 'http://192.168.1.6:8081',
                // target: 'http:192.168.1.4:8081',
                // target: 'http:192.168.1.112:8081',
                // target: 'http:192.168.0.44:8081',
                target: 'http:60.191.72.227:8081',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '',
                },
            },
        },
    },
    publicPath: './',
}