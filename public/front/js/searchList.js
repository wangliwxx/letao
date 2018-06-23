
// console.log($("div"));
// var btn=document.querySelector(".lt_search button");
// console.log(btn);





$(function () {
  //获取地址栏key的值 
  var key = getSearch().key;
  //把key的值设置给input输入框
  $(".lt_search input").val(key);
  //初始page,pageSize
  var page = 1;
  var pageSize = 3;



  //功能1.页面一加载，初始化上拉加载，下拉刷新
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次      
        callback: function () {
          page = 1;
          render(function (info) {
            //1.渲染数据
            $(".lt_product").html(template("tpl", info));
            //2.数据加载成功，结束下拉刷新
            mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
            //3.重置上拉加载
            mui(".mui-scroll-wrapper").pullRefresh().refresh(true);
          });
        }
      },
      up: {
        callback: function () {
          page++;
          render(function (info) {
            //1.渲染数据
            $(".lt_product").append(template("tpl", info));
            //2.数据加载成功，结束上拉加载,并且判断没有数据时，要显示没有更多数据
            if (info.data.length > 0) {
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh();
            } else {
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(true);
            }

          });
        }
      }
    }
  });
  //功能2.点击搜索按钮，下拉刷新
  $(".lt_search button").on("tap", function () {
    // console.log(1)
    //重置所有的now和箭头的方向
    $(".lt_sort li").removeClass("now");
    $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
    //获取input框的value值，设置给key
    key = $(".lt_search input").val();
    //重新渲染，再下拉刷新
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
  })

  //3.点击排序按钮，下拉刷新 （什么时候需要排序，）
  //思路：1.没有now添加now
  //     2.有now，让span的箭头切换
// console.log($(".lt_sort li[data-type]"));
  $(".lt_sort li[data-type]").on("tap", function () {
    if (!$(this).hasClass("now")) {
      $(this).addClass("now").siblings().removeClass("now");
    } else {
      $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    //重新渲染，再下拉刷新
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
  })





  //----封装函数--用于发送ajax结合模板引擎渲染数据---------------------
  function render(callback) {

    //参数
    var obj = {
      proName: key,
      page: page,
      pageSize: pageSize
    };
    //判断什么时候添加num和price  判断排序的li有没有now这个类
    var $select = $(".lt_sort li.now")
    var type = $select.data("type");
    var value=$select.find("span").hasClass("fa-angle-up") ? 1 : 2;
    if ($select.length > 0) {
      obj[type] = value;
    }
    //发送ajax
    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: obj,
      success: function (info) {
        // console.log(info);
        setTimeout(function () {
          // 回调函数
          callback(info);

        }, 1000)

      }
    })
  }




})