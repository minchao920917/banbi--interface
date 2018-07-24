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

         //创建Vue实例
        var createVm =function(){
            var vm = new Vue({
                el:'.information',
                data:{
                    article: []
                },
                computed: {
                },
                methods:{
                   
                },
                filters:{
                    formatPassTime(startTime) {
                        var currentTime = Date.parse(new Date()),
                            time = currentTime - Date.parse(new Date(startTime)),
                            day = parseInt(time / (1000 * 60 * 60 * 24)),
                            hour = parseInt(time / (1000 * 60 * 60)),
                            min = parseInt(time / (1000 * 60)),
                            month = parseInt(day / 30),
                            year = parseInt(month / 12);
                        if (year) return year + "年前"
                        if (month) return month + "个月前"
                        if (day) return day + "天前"
                        if (hour) return hour + "小时前"
                        if (min) return min + "分钟前"
                        else return '刚刚'
                    }
                }

            })
            return vm;
        }

        /**
         *  根据id获取文章信息
         * */
        function  initArticle(vm) {
            var id=GetQueryString("id");
            console.log(id);
            $.ajax({
                type: "GET",
                url: "http://api.banbijie.com/?s=Notices.GetNotice",
                data: {
                    id:id
                },
                success: function(data){

                    vm.article = data.data.items[0];
                }
            });

        }

        //初始化函数
        var init = function(){
            var vm = createVm();//创建列表
            initArticle(vm);//初始化文章

        };

        return{
            init: init
        }
    })();

    page.init();
})