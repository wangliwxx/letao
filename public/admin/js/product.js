$(function () {
  //页面一加载，获取数据，动态渲染出来
  var page = 1;
  var pageSize = 2;
  var imgs = [];//用于存放上传的图片的名称，地址

  function render() {

    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        //使用模板引擎把数据动态的显示到页面中
        $("tbody").html(template("tpl", info));
        //分页功能
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size: "small",
          itemTexts: function (type, page, current) {
            // console.log(type,page,current)
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          useBootstrapTooltip: true,
          bootstrapTooltipOptions: {
            placement: "bottom"
          },
          onPageClicked: function (a, b, c, p) {
            //把点击的当前页p,给当前页page，再重新渲染
            page = p,
              render()
          }

        })
      }
    })
  };
  render();

  //点击添加商品按钮，显示模态框
  $(".btn_add").on("click", function () {
    //显示模态框
    $("#addModal").modal("show");
    //发送ajax，获取请选择二级分类的数据
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        // console.log(info);
        $(".dropdown-menu").html(template("tpl2", info))
      }
    })
  })

  //点击二级菜单，让二级菜单能选择  给二级菜单下面动态生成的a注册点击事件
  $(".dropdown-menu").on("click", "a", function () {
    //1.获取文本内容
    var txt = $(this).text();
    $(".dropdown-text").text(txt);
    //2.获取点击的那个a的id  这是二级分类品牌的id 设置给brandId
    var id = $(this).data("id");
    //console.log(txt,id)
    $("[name=brandId]").val(id);
    //3.手动校验  找到表单校验的实例再调updateStatus方法   这个实例是什么？？？？
    console.log($("form").data('bootstrapValidator'));
    $("form").data('bootstrapValidator').updateStatus("brandId", "VALID");


  })

  //图片上传功能  借助于jquery-fileupload插件，它依赖与jquery
  $("#fileupload").fileupload({
    dataType: "json",
    done: function (e, data) {
      //一来就判断如果删除的图片超过3张，就直接return
      if (imgs.length >= 3) {
        return;
      }
      //console.log(data.result);//可以获取到图片的名称和地址
      //1.把上传的图片显示出来
      $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" alt="">');
      //2.把上传的图片的名称地址，存放到数组里
      imgs.push(data.result);
      console.log(imgs)
      //3..手动校验通过 图片只能上传3张 判断imgs.length=3,校验才通过
      if (imgs.length === 3) {
        $("form").data('bootstrapValidator').updateStatus("tips", "VALID");
      } else {
        $("form").data('bootstrapValidator').updateStatus("tips", "INVALID");
      }
    }
  })

  //表单校验功能 表单校验插件bootstrap-validator
  $("form").bootstrapValidator({
    //1.指定不校验类型
    excluded: [],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //3.指定校验的字段
    fields: {
      //校验brandId，对应input表单的name属性
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品的名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品的描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品的库存"
          },
          regexp: {
            regexp: /^\d{0,4}$/,
            message: '请输入正确的库存数(0-9999)'
          }

        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品的尺码"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入正确的尺码范围（xx-xx）'
          }

        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品的原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品的现价"
          }
        }
      },
      tips: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      },


    }

  })

  //校验通过事件 当表单校验成功时，会触发success.form.bv事件
  $("form").on("success.form.bv", function (e) {
    //阻止表单跳转
    e.preventDefault();
    //获取参数
    var parm = $("form").serialize();
    parm += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    parm += "&picName2=" + imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    parm += "&picName3=" + imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;

    //发ajax
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: parm,
      success: function (info) {
        //  console.log(info);
        //隐藏模态框
        $("#addModal").modal("hide");
        //重新渲染
        render();
        //重置表单
        $("form").data("bootstrapValidator").resetForm(true);
        //手动改
        $(".dropdown-text").text("请选择二级分类");
        $(".img_box img").remove();
        //数组重置
        imgs = [];

      }
    })
  })








});
