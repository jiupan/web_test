$.ajaxPrefilter(function(options) {
    //统一为所有api地址自动添加前缀网址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 统一为有权限的接口设置header请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    //全局统一挂在complate回调函数
    // 无论成功与否都会调用complete函数
    options.complete = function(res) {
        if (res.responseJSON.status !== 0) {
            localStorage.removeItem('token');
            location.href = '/login.html'
        }
    }
})