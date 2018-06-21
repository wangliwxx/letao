// 1.动态渲染数据
//2.分页功能
//3.启用与禁用功能，注册点击事件
//3.1显示模态框，获取到启用或者禁用的id
//3.2点击确定按钮，发送ajax请求，请用或者禁用按钮
//3.3成功的时候，隐藏模态框，重新渲染

//发送ajax请求获取数据，动态渲染数据
$(function () {
  var page = 1;
  var pageSize = 8;
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
       // console.log(info);
        //结合模板引擎，把数据渲染出来
        var html = template("tpl", info);
        $("tbody").html(html);

        //2.分页功能
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //指定bootstrap的版本
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size: "small",
          //当点击分页的按钮的时候，会触发
          onPageClicked: function (a, b, c, p) {
            page = p;
            //重新渲染
            render();
          }
        });
      }
    })
  }
  render();

  //启用与禁用的功能
  //需要注册委托事件，因为启用与禁用都是动态生成的
  $("tbody").on("click", ".btn", function () {
    //显示模态框
    $("#userModal").modal("show")
    //获取点击按钮的id，取决于点的是启用按钮还是禁用按钮
    var id = $(this).parent().data("id");
    var isDelete = $(this).hasClass("btn-success") ? 1 : 0;

    //给模态框确定按钮注册事件
    $(".btn_update").off().on("click", function () {
      //发送ajax
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id:id,
          isDelete:isDelete
        },
        success:function(info){
          // console.log(info);
          if(info.success){
            //隐藏模态框，重新渲染
            $("#userModal").modal("hide");
            //重新渲染
            render();
          }
        }
      })
    })





  })


});


