// 注意:每次调用 $.post() 或 $.get() 或 $.ajax() 
// 向服务器发起请求的时候的时候
// 会先调用 $.ajaxPrefilter([type],fn) 这个函数
// 在这个函数中，可以拿到我们给 ajax 提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // console.log(options.url);
})