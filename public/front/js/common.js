// 区域滚动初始化
mui('.mui-scroll-wrapper').scroll({
  indicators: false,//不显示滚动条
});



// 初始化轮播图
//获得slider插件对象
mui('.mui-slider').slider({
  interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
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