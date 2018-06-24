//参数1：依赖项  b模块依赖与a模块  所有的路径都是相对于requirejs文件的
//参数2：模块的内容
define(["js/a"], function(){
  console.log("我是模块b");
});