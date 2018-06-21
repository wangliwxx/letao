//思路：添加功能
//1.点击添加按钮，显示模态框，表单校验功能
//2.点击确定按钮，发送ajax请求，分页功能
//2.1隐藏模态框，显示分页
//2.2使用模板引擎，动态渲染数据

$(function () {

  var page = 1;
  var pageSize = 5;
  function render() {
    //发送ajax获取数据
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        //console.log(info);
        var html = template("tpl", info);
        $("tbody").html(html);

        //分页功能
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size: "small",
          onPageClicked: function (a, b, c, p) {
            console.log(11)
            page = p;
            render();
          }

        })
      }
    })
  };
  render();

  //添加功能
  $(".btn_add").on("click", function () {
    //显示模态框
    $("#addModal").modal("show");
  })


  //表单校验功能
  $("form").bootstrapValidator({
    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //设置校验规则
    fields: {  //易出错
      categoryName: {
        validators: {
          notEmpty: {
            message: "请输入一级分类的名称"
          }
        }
      }
    }
    
  })

  //注册表单校验成功事件 success.form.bv   阻止跳转，发送ajax
  $("form").on("success.form.bv", function (e) {
    e.preventDefault();
    //发送ajax
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $("form").serialize(),
      success: function (info) {
        // console.log(info);
        if(info.success){
          //隐藏模态框，重新渲染
          $("#addModal").modal("hide");
          render();
          //重置表单样式和内容
          $("form").data("bootstrapValidator").resetForm(true);
          // $("form").data("bootstrapValidator").resetForm(true);
        }
      }
    })
  })










});