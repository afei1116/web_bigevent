$(function () {
    layer = layui.layer
    form = layui.form

    initArtCateList()

    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var index = null
    // 为添加类别的按钮 绑定点击事件
    $('#btnAddCate').on('click', function () {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 获取script 标签内容
            content: $('#dialog').html()
        })
    })

    // #formAdd 表单 是我们动态添加到页面的元素↑ 需要通过代理的
    // 形式 给它绑定 事件 通过页面 故有的元素代理body, 给#formAdd
    // 表单 代理 提交事件
    $('body').on('submit', '#formAdd', function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        // console.log(11);
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                layer.msg('新增文章分类成功!')
                initArtCateList()
                layer.close(index)
            }
        })
    })

    // 为编辑按钮代理  单击事件
    $('tbody').on('click', '.btn_edit', function () {
        // console.log(11);
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 获取script 标签内容
            content: $('#diaEdit').html()
        })

        // 根据 id 获取文章 列表 当前项 信息 填充
        var id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            // data: id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }
                // console.log(res.data);
                // 给 表单填充数据
                form.val('formEdit', res.data)
            }
        })
    })


    // 给 formEdit 表单 通过 body 委托 提交事件

    $('body').on('submit', '#formEdit', function (e) {
        //   阻止默认 提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败！')
                }
                layer.msg('更新数据成功!')
                initArtCateList()
                layer.close(index)
            }
        })
    })

    // 通过父元素 tbody 给  btn-delete 删除按钮 委托 单击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // console.log(id);
        layer.confirm('是否要删除?', { icon: 3, title: '提示' }, function (index) {
            //do something

            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {

                    if (res.status !== 0) {
                        return layer.msg('删除数据失败！')
                    }
                    layer.msg('删除数据成功!')

                    initArtCateList()
                }

            })
            layer.close(index)


        })
    })

})