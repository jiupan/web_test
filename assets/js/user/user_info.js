$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6字符之间'
            }
        }
    })
    initUserInfo();
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res.data);
                form.val('forUserInfo', res.data)
            }
        })
    }
    //为重置按钮设置点击事件
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    //监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败')
                }
                layer.msg('修改信息成功')
                    // 调用父页面的方法重置用户信息
                window.parent.getUserInfo();
            }
        })
    })
})