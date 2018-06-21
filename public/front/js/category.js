
$(function () {
  // 页面一加载，发送ajax，动态获取数据并显示在左侧一级分类栏里
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    success: function (info) {
      console.log(info);
      $(".category_left ul").html(template("tpl", info))
      render(info.rows[0].id)
    }
  });

  //给一级分类里的a注册点击事件，发ajax，动态获取数据，并显示在右边对应的二级分类里
  //a是后来动态生成的，所以需要注册委托事件
  $(".category_left").on("click", "li", function () {
    //1.让当前的li有now这个类
    $(this).addClass("now").siblings().removeClass("now");
    //2.获取id
    var id = $(this).data("id");
    //3.发送ajax渲染
    render(id);
     //4. 让右边的滚动容器滚到0，0的位置
     mui('.category_right .mui-scroll-wrapper').scroll().scrollTo(0,0,1000);//100毫秒滚动到顶
  })




  //------二级分类发送ajax获取数据--------------------------------
  function render(id) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      success: function (info) {
        console.log(info);
        $(".category_right ul").html(template("tpl2", info))
      }
    })
  }

})
