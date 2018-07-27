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

        var backToTop =function(){
            var options = {
                setting: { 
                    startline:10,          // 鼠标向下滚动距离，出现#topcontrol图标
                    scrollto:0,           // 它的值可以是整数，也可以是一个id标记。
                    scrollduration:100,    // 滑动到的scrollto的速度，值越大越慢
                    fadeduration:[100, 100] //#topcontrol这个div的淡入淡出速度，第一个参数为淡入速度，第二个参数为淡出速度
                },
                controlHTML: '<a href="#top" class="top_stick"><img src="images/top.png" style="width:50px; height:50px" /></a>',//控制向上滑动的html源码
                controlattrs: { //控制#topcontrol这个div距离右下角的像素距离  
                    offsetx:300, 
                    offsety:10
                },
                anchorkeyword: '.header',//滑动到的id标签
                state: {
                    isvisible:true,    //是否#topcontrol图标这个div为可见
                    shouldvisible:false //是否#topcontrol图标这个div该出现
                }
            }
            $(window).BackToTop(options);
        }

        //初始化函数
        var init = function(){
            var vm = createVm();//创建列表
            initArticle(vm);//初始化文章
            backToTop();
        };

        return{
            init: init
        }
    })();

    page.init();
})