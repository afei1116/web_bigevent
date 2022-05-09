$(function () {
    // console.log(11);
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()

    })
    // 点击去登陆的页面
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从 Layui 中获取 form对象
    var form = layui.form
    var layer = layui.layer
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个 pwd的 校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function (value) {
            //    通过形参拿到的是确认密码框的内容
            // 还需要拿到密码框的内容
            // 然后进行一次等于的判断
            // 如果判断失败，return一个错误的消息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        // 发起Ajax请求 POST
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }

            layer.msg('注册成功，请登录！')
            // 模拟人的点击行为
            $('#link_login').click()
        })

    })

    //    监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        // 发起Ajax post 请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // serialize()获取当前对象表单的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功!')
                // console.log(res.token);

                // 将登陆成功得到的toke字符串,保存到本地存储localStorage中
                // 后面请求有权限的接口时,需要把token字符串添加到请求头部Authorization
                // 进而和服务器进行身份验证
                localStorage.setItem('token', res.token)

                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })










})