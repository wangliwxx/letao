/* 
  common.js中是所有的通过的js功能
*/

//每个页面一加载，就需要发送一个ajax请求，判断当前用户是否登录
//如果当前用户没有登录，需要跳转登录页面
//如果是login页面，是不需要判断有没有登录

//如果不是login页面，需要先发送ajax请求，判断用户是否登录了
if(location.href.indexOf("login.html") == -1) {
  $.ajax({
    type: 'get',
    url: '/employee/checkRootLogin',
    success: function(info) {
      if(info.error) {
        location.href = "login.html";
      }
    }
  });
}


//配置关闭了进度环
//NProgress.configure({ showSpinner: false });
//所有的ajax开始的时候，会触发的事件
$(document).ajaxStart(function () {
  //console.log("开始啦......");
  NProgress.start();
});

$(document).ajaxStop(function () {
  setTimeout(function () {
    NProgress.done();
  }, 500);
});



//二级分类的显示与隐藏
//1. 点击分类管理
//2. 让分类管理下二级菜单显示或者隐藏
$(".child").prev().on("click", function(){
    $(this).next().slideToggle();
});


/* 
  点击切换按钮，显示隐藏侧边栏
  1. 找到切换按钮
  2. 切换
*/
$(".icon_menu").on("click", function() {
  $(".lt_aside").toggleClass("now");
  $(".lt_main").toggleClass("now");
});


/* 
  退出功能
    1. 点击退出按钮 
    2. 显示退出的模态框
    3. 点击退出模态框中确认按钮，退出即可。需要发送ajax请求，告诉服务端，需要退出
*/
$(".icon_logout").on("click", function() {
  $("#logoutModal").modal('show');
});

$(".btn_logout").on("click", function() {
  //退出
  //跳转登录页 q q
  
  $.ajax({
    type:'get',
    url: '/employee/employeeLogout',
    success: function(info) {
      //console.log(info);
      if(info.success) {
        location.href = "login.html";
      }
    }
  });

});

