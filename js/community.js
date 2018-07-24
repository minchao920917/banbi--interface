$(function(){
    var page = (function(){
        var req={
            n:1,
            m:10
        }
        //创建Vue实例
        var createVm =function(){
            var vm = new Vue({
                el:'.information',
                data:{
                    items: []
                },
                computed: {
                },
                methods:{
                    //对一个包含对象的数组的排序，需要提供一个对象键并以此值来进行排序
                    order: function() {
                        getListData(this,req);
                    }
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
            vm.order();
            return vm;
        }

        //初始化推荐
        var initRecommend = function(){
            $.ajax({
                type: "GET",
                url: "http://api.banbijie.com/?s=Notices.Recommend",
                data: {},
                success: function(data){

                    var recommendVM = new Vue({
                        el:'.recommend',
                        data:{
                            recommends: data.data.recommend,
                            picked:data.data.picked[0]
                        },
                        computed: {
                            topics:function(){
                                return this.recommends.filter(function (recommend) {
                                    return recommend.type == 1;
                                })
                            },
                            guides:function(){
                                 return this.recommends.filter(function (recommend) {
                                    return recommend.type == 2;
                                })
                            },
                            ashs:function(){
                                 return this.recommends.filter(function (recommend) {
                                    return recommend.type == 3;
                                })
                            }
                        },
                        methods:{
                            
                        }

                    });
                }
            });

        }

        //初始化列表
        var getListData = function(vm,req){

            $.ajax({
                type: "GET",
                url: "http://api.banbijie.com/?s=Notices.GetList",
                data: req,
                success: function(data){
                    vm.items = data.data.items;
                }
            });

            return vm;
        }

        //瀑布流加载更多
        var getMoreTableData = function(vm,req){
            $.ajax({
                type: "GET",
                url: "http://api.banbijie.com/?s=Notices.GetList",
                data: req,
                success: function(data){

                    if(data.data.items.length>0){
                        vm.items = vm.items.concat( data.data.items);

                    }else{
                        req.n = req.n - req.m;
                        $(".loading").html("到底了 ( ⊙ o ⊙ )！.");
                        setTimeout(function () {
                            $(".loading").addClass("hide");
                        }, 3000);
                    }

                }
            });

            return vm;
        }

        //屏幕滚动监听
        var scroll = function(vm){
            window.onscroll = function(){

                var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
                //滚动条到底部的条件
                if(scrollTop + windowHeight == scrollHeight){
                    //写后台加载数据的函数
                    $(".loading").removeClass("hide");
                    req.n = req.m + req.n;
                    getMoreTableData(vm,req);

                }else{
                    $(".loading").addClass("hide");
                }
            }
        }

        //初始化函数
        var init = function(){
            initRecommend();//推荐初始化
            var vm = createVm();//创建列表
            scroll(vm);//滚动监听
        };

        return{
            init: init
        }
    })();

    page.init();
})