$(function(){
    var page = (function(){
        /**
         * 获取url中的参数分解
         * */
        function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
            var context = "";
            if (r != null)
                context = r[2];
            reg = null;
            r = null;
            return context == null || context == "" || context == "undefined" ? "" : context;
        }
        /**
         *  根据id获取文章信息
         * */
        function  initArticle() {
            var id=GetQueryString("id");
            console.log(id);
        }

        //初始化函数
        var init = function(){
            initArticle();//初始化文章

        };

        return{
            init: init
        }
    })();

    page.init();
})