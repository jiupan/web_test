$(function() {
    var form = layui.form;
    var layer = layui.layer;
    initCate()

    //定义加载文章类别的方法
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                //调用模板引擎渲染分类下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                //一定要记得调用form.render
                form.render();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮绑定点击事件
    $('#btnChooseImg').on('click', () => {
        $('#coverFile').click();
    })

    //监听coverFile的change事件
    $('#coverFile').on('change', (e) => {
        //获取到文件的数组列表
        var files = e.target.files;
        console.log(files);
        if (files.length === 0) {
            return layer.msg('请选择文件！')
        }
        var newImgURL = URL.createObjectURL(files[0]);
        //为裁剪区域中心设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //定义文章的发布状态
    var art_state = "已发布";

    //为存为草稿按钮绑定事件
    $('#btnSave2').on('click', () => {
        art_state = "草稿"
    })

    //为表单绑定submit事件
    $('#form-pub').on('submit', (e) => {
        e.preventDefault();
        // 基于表单快速创建Fromdata对象
        var fd = new FormData(document.getElementById('form-pub'));

        //将文章的发布状态存到fd中
        fd.append('state', art_state)

        //将裁剪过后的文件输出
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                fd.append('cover_img', blob)
                publishArticle(fd)
            })


        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            method: 'POST',
            data: fd,
            //注意如果提交的是formdata数据，必须添加以下两个配置项目
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！！！')
                }
                layer.msg('发布成功')
                    //发布文章成功后跳转到文章列表
                location.href = '/article/art_list.html'
            }
        })
    }
})