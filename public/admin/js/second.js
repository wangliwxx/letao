
$(function () {


  //1.开分支
  //2.写静态页面
  //3. 动态渲染+分页
  //3.1发送ajax获取数据，使用模板引擎，渲染出来
  //3.2ajax发送成功，使用分页插件，初始化分页
  var page = 1;
  var pageSize = 5;
  function render() {
    //发送ajax请求
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        var html = template("tpl", info);
        $("tbody").html(html);
        //分页功能
        //分页功能
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size: "small",
          onPageClicked: function (a, b, c, p) {
            // console.log(11)
            page = p;
            render();
          }

        })
      }
    })
  };
  render();
  //点击添加分类按钮，显示模态框,并且发送ajax获取一级分类数据
  $(".btn_add").on("click", function () {
    $("#addModal").modal("show");
    // 动态的渲染一级分类，能够选择
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        var html = template("tpl2", info);
        $(".dropdown-menu").html(html);
      }
    })
  })
  //让一级分类能够选择 
  // 1.让一级分类显示 2.获取到选择的那个一级分类的id 
  // 3.把获取到id，设置给categoryId这个隐藏域 4.让隐藏的categoryIde的校验通过
  //注册委托事件 
  $(".dropdown-menu").on("click", "a", function () {
    //获取到选中的a的值
    var txt = $(this).text();
    //把txt的值设置给buttondd下面的span
    $(".dropdown-text").text(txt);
    //获取到选择的那个一级分类的id
    var id = $(this).data("id");
    console.log(id);
    //获取到id，设置给categoryId这个隐藏域
    $("[name='categoryId']").val(id);
    // 让隐藏的categoryIde的校验通过 ?????? 先找到$("form").data("bootstrapValidator")实例，再调方法
    $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });

  //图片的异步上传 功能  使用fileupload插件
  //获取图片上传的结果
  $("#fileupload").fileupload({
    dataType: 'json',
    //图片上传后的回调函数 done
    //e :事件对象  data: 上传后的结果
    done: function (e, data) {
      //  console.log(data);  发现图片的地址存在data.result.picAddr
      //1.修改img_box下的img的src
      $(".img_box img").attr("src", data.result.picAddr);
      //2.给隐藏域brandLogo赋值
      $("[name='brandLogo']").val(data.result.picAddr)
      //3.让brandLogo校验通过??????????????
      $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");

    }
  })

  //表单校验功能
  $("form").bootstrapValidator({
    //excluded:指定不校验的类型，[]所有的类型都校验
    excluded: [],
    //指定校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //指定校验字段  brandName brandLogo categoryId
    fields: {
      //对应了表单中的name属性
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类名称"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请选择二级分类名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传二级分类的图片"
          }
        }
      }
    }
  })
  //给表单注册校验成功的事件，阻止表单的提交，使用ajax提交
  $("form").on("success.form.bv", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $("form").serialize(),
      success: function (info) {
        // console.log(info);
        if (info.success) {
          //隐藏模态框，重新渲染,重置表单
          $("#addModal").modal("hide");
          render();
          $("form").data("bootstrapValidator").resetForm(true);
          $(".dropdown-text").text("请选择一级分类");
          $(".img_box img").attr("src", "images/none.png")
        }
      }
    })
  })
})