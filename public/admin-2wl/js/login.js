//功能1：登录的表单校验功能
$(function () {
  //表单校验的功能
  //1. 用户名不能为空
  //2. 用户密码不能为空
  //3. 用户密码的长度是6-12位
  var $form = $("form");
  $form.bootstrapValidator({
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //3. 指定校验字段
    fields: {
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: "用户名不能为空"
          },
          callback: {
            message: "用户名不存在"
          }


        }
      },
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: "用户密码不能为空"
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '用户密码长度必须在6到12之间'
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  });
  //需要给表单注册一个校验成功的事件  success.form.bv
  //阻止表单跳转，因为要使用ajax进行表单的提交，判断用户名和密码是否正确
  $form.on("success.form.bv", function (e) {
    //阻止浏览器的默认行为
    e.preventDefault();
    //发送ajax进行表单校验
    // $form.data("bootstrapValidator") 这是获取到表单实例
    // var rel= $form.data("bootstrapValidator");
    // console.log(rel);
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $form.serialize(),
      success: function (info) {
        // console.log(info);
        if (info.success) {
          location.href = "index.html";
        }
        if (info.error === 1000) {
          $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback")
        }
        if (info.error === 1001) {
          $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback")
        }
      }
    })
  });
  //点击重置按钮，重置表单，重置样式
  //找到重置按钮
  $("[type='reset']").on("click", function () {
    //重置样式
    $form.data("bootstrapValidator").resetForm();
  })
  
});