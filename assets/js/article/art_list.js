$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义美化事件的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)
            var y = dt.getFullYear()
            var m = padzero(dt.getMonth() + 1)
            var d = padzero(dt.getDate())
            var hh = padzero(dt.getHours())
            var mm = padzero(dt.getMinutes())
            var ss = padzero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义事件补零的函数
    function padzero(n) {
        return n > 9 ? n : '0' + n;
    }



    // 定义一个查询的参数对象
    // 需要将请求参数对象上传至服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条
        cate_id: '',
        state: ''
    }
    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: q,
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败！')
                }
                //使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)

                //调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    //获取文章分类的方法
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败');
                }
                // 调用模板引擎渲染分类
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //为表单绑定提交事件
    $('#form-search').on('submit', (e) => {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        // 重新渲染表单数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            //分页发生切换出发jump回调
            jump: function(obj, first) {
                //通过first的值判断是通过那种方式调用的jump
                // console.log(obj.curr);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //根据最新的q获取数据列表
                if (!first) {
                    initTable()
                }
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10]
        });
    }

    //为删除按钮绑定点击事件
    $('body').on('click', '#btn-delete', function() {
        //获取删除按钮的个数
        var len = $('#btn-delete').length;
        //获取当前文章的id
        var id = $(this).attr('data-id');
        console.log(id);
        //询问用户是否删除文章
        layer.confirm('确认删除当前文章?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + id,
                method: 'GET',
                success: (res) => {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除成功！')

                    //当数据删除完成之后判断当前页是否还有数据
                    //没有数据的话页码-1
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})