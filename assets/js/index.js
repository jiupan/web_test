$(function() {
    $('#btnLogout').on('click', function() {
        //eg1
        layer.confirm('是否退出登陆?', { icon: 3, title: '提示' }, function(index) {
            // 清空本地存储的localStorage
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        });
    })

    getUserInfo()
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data);
        }
    })
}
// 渲染用户头像函数
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $("#welcome").html('欢迎&nbsp&nbsp' + name);
    // 判断用户是否有头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        var first = name[0].toUpperCase();
        $('.layui-nav-img').hide();
        $('.text-avatar').html(first).show();
    }
}