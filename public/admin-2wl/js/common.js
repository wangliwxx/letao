//1.进度条功能
//注册一个全局的ajax事件，发送ajax时都会触发这个事件
//禁用进度环
NProgress.configure({ showSpinner: false });
$(document).ajaxStart(function () {
  //开启进度条
  NProgress.start();
});

$(document).ajaxStop(function () {
  //完成进度条
  setTimeout(function () {
    NProgress.done();
  }, 500);
});

//2.判断什么时候跳转到登录页
//判断用户有没有登陆过，只要不是在登录页面的都需要跳转到登录页面
if (location.href.indexOf("login.html") == -1) {
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    success: function (info) {
      //console.log(info)
      if(info.error) {
        location.href = "login.html";
      }
    }
  })
}



//3.点击分类管理，显示二级分类
//给a注册点击事件，让child显示与隐藏
$(".child").prev().on("click", function () {
  $(this).next().slideToggle();
});




//4.点击topbar的menu,隐藏侧边栏
//侧边栏显示隐藏功能
$(".icon_menu").on("click", function () {
  $(".lt_aside").toggleClass("now");
  $(".lt_main").toggleClass("now");
  $(".lt_topbar").toggleClass("now");
});


//5.退出功能
//显示退出模态框，
$(".icon_lagout").on("click", function () {
  $("#logoutModal").modal("show");
})
//给模态框的确定按钮注册事件，点击确定，解绑所有事件，发送ajax，退出系统到登录页
$(".btn_logout").on("click", function () {
  //发送ajax
  $.ajax({
    type: "get",
    url: "/employee/employeeLogout",
    success: function (info) {
      //console.log(info);
      if (info.success) {
        location.href = "login.html";
      }
    }
  })


})