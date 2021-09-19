$(function() {
    $('#to_reg').on('click', function() {
        $('.log-box').hide();
        $('.reg-box').show();
    })
    $('#to_log').on('click', function() {
        $('.reg-box').hide();
        $('.log-box').show();
    })

    //从layui中获取form
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            $("#to_log").click();
        })
    })

    //监听登陆表单的提交事件
    $('#form_log').on('submit', function(e) {
        e.preventDefault();
        $.post('/api/login', { username: $('#form_log [name=username]').val(), password: $('#form_log [name=password]').val() }, function(res) {
            console.log(res.status);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            //将获取到的tokin保存到localStorag中
            localStorage.setItem('token', res.token)
            location.href = '/index.html'
        })
    })
})