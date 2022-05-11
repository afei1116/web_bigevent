$(function () {
    layer = layui.layer
    form = layui.form
    //  获取文章分类数据 方法
    initCate()
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
    // 获取文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                // 渲染模板结构
                var htmlStr = template('tpl-cate', res)

                // 把模板结构填充到 cate_id 里面
                $('[name=cate_id]').html(htmlStr)

                // 重新渲染 ui 结构
                form.render()

            }
        })

    }
    //  为选择封面的按钮 绑定单击事件
    $('#imageBtnChoose').on('click', function () {
        $('#coveFile').click()
    })

    // 监听 coveFile 的 change 事件,获取用户选择文件列表
    $('#coveFile').on('change', function (e) {
        //  获取用户文件 数组
        var file = e.target.files
        //  判断用户是否选择了文件
        if (file.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file[0])

        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域




    })

    // 定义文章发布状态
    var art_state = '已发布'
    // 为存为草稿 按钮 绑定 单击 事件
    $('#btnServer2').on('click', function () {
        art_state = '草稿'
    })
    // 为表单 绑定 提交 事件 
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()

        //   基于 form 表单 快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])

        // 将 发布状态  追加到 fd 中
        fd.append('state', art_state)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作


                // 将图片转换的 文件对象 追加到 fd 中
                fd.append('cover_img', blob)

                // 发起 ajax 请求
                publishArticle(fd)
            })


    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //  向服务器 提交 FormData 数据 必须 加两个属性
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布数据失败!')
                }
                layer.msg('发布数据成功!')
                // 发布数据成功后 跳转到文章列表页面
                location.href = '/article/art_list.html'

            }
        })
    }

})