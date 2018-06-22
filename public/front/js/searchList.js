$(function () {

  //页面一加载，动态加载数据
  var page = 1;
  var pageSize = 5;
  //1.获取地址栏中key的值
  var key = getSearch().key;
  //2.把地址栏中key的值设置给搜索栏中input的value值
  $(".lt_search input").val(key);
  //发送ajax,获取数据，结合模板引擎动态渲染出来
  render();

  //点击搜索按钮，渲染数据
  //思路：给搜索按钮注册点击事件，获取文本框的值，再渲染
  $(".lt_search button").on("click", function () {
    //初始化：把所有li的now类去掉，同时让li下的span的类为fa-angle-down
    $(".lt_sort li").removeClass("now");
    //??????????????removeClass("fa-angle-up")???????已经添加向下，为什么还要删掉向上
    $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
    //key不能var,因为key要改外面变量的值，再重新渲染
    key = $(".lt_search input").val();
    render();
  })

  //点击排序的按钮（价格或者是库存），重新发送ajax请求
  //思路：1.如果点了价格进行排序，需要多传一个参数，price: 1或者是2
  //      2.如果点了库存进行排序，需要多传一个参数，num: 1或者是2

  //     3.如果当前的li没有now这个类，让当前的li有now这个类，并且让其他的li没有now这个类,让所有的span的            箭头都初始向下
  //      4.如果当前li有now这个类，修改当前li下的span的箭头的类
  $(".lt_sort li[data-type]").on("click", function () {
    if (!$(this).hasClass("now")) {
      $(this).addClass("now").siblings().removeClass("now");
      $(".lt_sort span").addClass("fa-angle-down").removeClass("fa-angle-up")
    } else {
      $(this).find("span").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
    }
    //重新渲染
    render();


  });










  //--封装函数--用于获取地址栏中的参数--------------
  function getSearch() {
    //获取地址栏的参数
    var search = location.search;
    //2. 地址栏会对中文进行转码
    search = decodeURI(search);
    //3.去掉问号
    search = search.slice(1);
    //4.去掉&，放进数组里
    var arr = search.split("&")
    //5.遍历数组，转换成对象
    var obj = {};
    arr.forEach(function (e, i) {
      // console.log(e)
      var k = e.split("=")[0];
      var v = e.split("=")[1];
      obj[k] = v;

    })
    return obj;
  }
  // -----发送ajax请求，获取搜索到商品数据-------------------------
  function render() {
    $(".lt_product").html('<div class="loading"></div>');

    //参数
    var obj = {
      proName: key,
      page: page,
      pageSize: pageSize
    };
    //判断什么时候传参数price或者num
    var $select = $(".lt_sort li.now");
    //console.log($select)？？？？？？？？？？？？？、为什么获取到的是数组，而不是对象
    if ($select.length > 0) {
      var type = $select.data("type");//price或者num
      var value = $select.find("span").hasClass("fa-angle-down") ? 2 : 1;
      obj[type] = value;
    };
    console.log(obj);
    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: obj,
      success: function (info) {
        //console.log(info);
        setTimeout(function () {
          $(".lt_product").html(template("tpl", info));
        }, 1000)
      }
    })

  }



})