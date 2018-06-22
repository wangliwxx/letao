// 搜索中心这个页面，相当于一套增删改查系统 查-清空-删-增
//页面一加载，后端获取数据（也就是历史数据）数据是存储在localStorage上
$(function () {
  //----封装函数--获取历史数据---------------------
  //思路： 1. 数据是存储在localStorage上 通过localStorage.getItem获取存储的数据
  //      2.如果history还没有存储值，给一个默认值即空数组，保证得到的数据永远都是一个数组
  //      3.因为只能存储字符串，所以以json字符串形式存储，拿到数据后要JSON.parse转换成数组，方便操作数组
  function getHistory() {
    var result = localStorage.getItem("lt_history") || "[]";
    result = JSON.parse(result);
    // console.log(result);
    return result;
  }


  //----封装函数--把获取到的数据渲染到lt_history的content里------------
  //思路：1.获取到localStory中的数据, key的名字：lt_history   值：input框输入的值
  //     2.结合模板引擎动态渲染数据
  function render() {
    //获取存储的历史数据
    var history = getHistory();
    console.log(history)
    //结合模板引擎渲染出来，template第二个参数必须是对象
    $(".lt_history").html(template("tpl", { rows: history }));
  }
  render();

  //清空数据功能
  //思路：1.点击清空数据按钮(注册委托事件)
  //     2.清空localStory存储的历史数据 localStorage.removeItem()
  //     3.重新渲染
  $(".lt_history").on("click", ".btn-empty", function () {
    mui.confirm("你确定要清空历史记录吗？", "温馨提示", ['是', '否'], function (e) {
      if (e.index === 0) {
        localStorage.removeItem("lt_history");
        render();
      }
    })

  });

  //删除数据功能
  //思路：1.点击×按钮，注册委托事件
  //     2.获取存储的历史数据
  //     3.获取存储在按钮身上的自定义下标index
  //     4.根据下标index，删除对应下标的数组值
  //     5.重新把数组存储到localStorage  通过localStorage.setItem("lt_history",history)
  //     6.重新渲染
  $(".lt_history").on("click", ".btn-delete", function () {
    mui.confirm("你确定要删除这条数据吗？", "温馨提示", ['是', '否'], function (e) {
      var index = $(this).data("index");
      if (e.index === 0) {
        var history = getHistory();

        history.splice(index, 1);
        localStorage.setItem("lt_history", JSON.stringify(history));
        render();
      }
    })


  });


  //增加功能
  //思路：1.给搜索按钮注册点击事件
  //     2.获取input框 输入的value值为txt，再清除input框的value值
  //     3.获取存储的历史数据
  //     4.把txt添加到数组的最前面
  //     4.1 当数组长度大于等于10时，需要删除数组最后面的数据
  //     4.2当txt值与数组中值有重复时，删除数组中的值，再把值添加数组最前面
  //     5.重新把数组存储到localStorage  通过localStorage.setItem("lt_history",history)
  //     6.重新渲染
  $(".lt_search button").on("click", function () {
    var txt = $(".lt_search input").val();
    console.log(txt);
    $(".lt_search input").val('');
    //如果input框没有value值，用户点击搜索，弹出消息框
    if (txt === "") {
      mui.toast("请输入搜索的内容");
      return;
    }
    var history = getHistory();
    //判断
    if (history.length >= 10) {
      history.pop();
    };
    var index = history.indexOf(txt)
    if (index > -1) {
      history.splice(index, 1)
    };
    history.unshift(txt);

    localStorage.setItem("lt_history", JSON.stringify(history));
    // console.log(history);
    render();
    //点击搜索，页面需要跳转到商品列表页
    location.href = "searchList.html?key=" + txt;
    
  })
});
