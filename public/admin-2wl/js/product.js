

$(function () {
  //功能1：页面一加载，获取数据，使用模板引擎渲染出来
  var page = 1;
  var pageSize = 5;
  var imgs = [];
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
        $("tbody").html(template("tpl", info));
        //分页功能，初始化分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size: "small",
          itemTexts: function (type, page, current) {
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
          bootstrapTooltipOptions: {
            placement: 'bottom'
          },
          done: function (a, b, c, p) {
            page: p,
              render();
          }
        })

      }
    })
  };
  render();

  //点击添加分类按钮
  $(".btn_add").on("click", function () {
    //显示模态框
    $("#addModal").modal("show");
    //发送ajax请求，获取二级分类的数据
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        $(".dropdown-menu").html(template("tpl2", info))
      }
    })


  })

  //让二级分类能选择
  //给二级分类选择的a注册委托事件，因为a是动态生成的
  $(".dropdown-menu").on("click", "a", function () {
    //获取文本、
    var txt = $(this).text();
    //设置给button
    $(".dropdown-text").text(txt);
    //获取点击的a的id
    var id = $(this).data("id");
    //设置给隐藏域brandId
    $('[name="brandId"]').val(id);
    //手动校验通过
    $("form").data('bootstrapValidator').updateStatus("brandId", "VALID");
  })

  //图片上传功能，借助于插件jquery-fileupload
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，
    //通过data.result.picAddr可以获取上传后的图片地址  图片的名称picName
    done: function (e, data) {
      // console.log(data);
      //1.判断
      if (imgs.length >= 3) {
        return;
      };
      //2.把获取的图片的名称和地址添加到数组里
      imgs.push(data.result);
      console.log(imgs);
      //3.动态创建img,添加给img_box
      $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" alt="">');
      //4.手动校验通过
      if (imgs.length == 3) {
        $("form").data('bootstrapValidator').updateStatus("tips", "VALID");
      } else {
        $("form").data('bootstrapValidator').updateStatus("tips", "INVALID");
      }
    }
  });

  //表单校验功能
  $("form").bootstrapValidator({
    //1.指定不校验类型,为[],表示都校验
    excluded: [],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //3.指定校验的字段
    fields: {
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
            regexp: /^\d{1,4}$/,
            message: '请输入1-9999的数字'
          }

        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品的尺码(xx-xx)"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入xx-xx格式'
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
            message: "请上传三张图片"
          }
        }
      },
    }
  })
  //校验成功事件 success.form.bv
  $("form").on("success.form.bv", function (e) {
    //阻止表单跳转
    e.preventDefault();
    //参数
    var pram = $("form").serialize();
    pram += '&picName1=' + imgs[0].picName1 + '&picAddr1=' + imgs[0].picAddr;
    pram += '&picName2=' + imgs[1].picName1 + '&picAddr2=' + imgs[1].picAddr;
    pram += '&picName3=' + imgs[2].picName1 + '&picAddr3=' + imgs[2].picAddr;
    //发送ajax
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: pram,
      success: function (info) {
        // console.log(info);
        $("#addModal").modal("hide");
        render();
        $("form").data('bootstrapValidator').resetForm(true);
        $(".dropdown-text").text("请选择二级分类");
        $(".img_box img").remove();
        imgs = [];
      }
    })
  })
})
