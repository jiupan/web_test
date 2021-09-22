$(function() {
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章分类的列表
    initArtCateList()
        // 获取文章列表函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: (res) => {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            area: ['500px', '250px']
        });
    })

    // 通过代理的形式为form-add表单添加提交事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('添加失败！')
                }
                initArtCateList()
                layer.msg('添加成功！')
                    // 根据索引关闭对应的弹出层 
                layer.close(indexAdd)
            }
        })
    })

    $('body').on('click', '#form-close', function(e) {
        e.preventDefault();
        layer.close(indexAdd)
    })


    // 通过代理的方式为btn-edit按钮添加点击事件
    var indexEdit = null;
    $('table').on('click', '#btn-edit', function() {
        // 弹出修改文章信息的层
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        });

        var id = $(this).attr('data-id');
        console.log(id);
        $.ajax({
            url: '/my/article/cates/' + id,
            method: 'GET',
            success: (res) => {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    // 监听修改分类表单提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('修改失败！！！')
                }
                initArtCateList()
                layer.msg('修改成功！！！')
                layer.close(indexEdit)
            }
        })
    })

    // 为删除按钮绑定点击事件
    var indexDelate = null;
    $('body').on('click', '#btn-delate', function() {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + id,
                method: 'GET',
                success: (res) => {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！！！')
                    layer.close(index);
                    initArtCateList()
                }
            })
        });
    })
})