$(function(){
    var page = (function(){
        var req={
            n:1,
            m:10,
            order:0,
            keyword:""
        }
        //创建表格
        var createVm =function(){
            var vm = new Vue({
                    el:'.left',
                    data:{
                        searchContent:"",
                        total:0,
                        nameNum:0,
                        trPairNum:0,
                        items: [],
                    },
                    computed: {
                    },
                    methods:{
                        //对一个包含对象的数组的排序，需要提供一个对象键并以此值来进行排序
                        order: function(key,order) {
                            $(".tabs li,.thead th").removeClass("cur");
                            $("."+ key).addClass("cur");
                            req.n = 1;
                            req.order = order;  
                            getTableData(this,req);                           
                        },
                        //焦点
                        focus: function() {
                            document.getElementById("search-query").classList.add("focus");
                        },
                        blur:function(){
                            document.getElementById("search-query").classList.remove("focus");
                        }
                    }
                    
                })
            vm.order("id",0);
            return vm;
        }

        //初始化广告
        var initAdv = function(){
            $.ajax({
                 type: "GET",
                 url: "http://api.banbijie.com/?s=Advertisements.getList&id=1",
                 data: {},
                 success: function(data){
                    $("#adv").css("background",
                        "url("+data.data.items[0].img_url+") center no-repeat")
                    .css("background-size","contain");
                }
            });
    
        }
        //初始化二维码
        var initQrCode = function(){
            $.ajax({
                 type: "GET",
                 url: "http://api.banbijie.com/?s=Advertisements.getList&id=2",
                 data: {},
                 success: function(data){
                    $("#qrcode").attr("src",data.data.items[0].img_url)
                }
            });
         }

        //初始化公告
        var initNotices = function(){
            $.ajax({
                 type: "GET",
                 url: "http://api.banbijie.com/?s=Notices.getList&n=1&m=3",
                 data: {},
                 success: function(data){
                     var noticesVM =  new Vue({
                        el:'#notice',
                        data:{
                            notices:data.data.items
                        },
                        computed: {
                        },
                        methods:{
                            
                        }
                    })
                }
            });
    
        }

        //初始化表格
        var getTableData = function(vm,req){
            
            $.ajax({
                 type: "GET",
                 url: "http://api.banbijie.com/?s=Currency.search",
                 data: req,
                 success: function(data){
                    if(req.keyword === ""){
                        vm.total = 0;
                        vm.nameNum =0;
                        vm.trPairNum = 0;   
                    }else{
                        vm.total = data.data.total;
                        vm.nameNum = data.data.currencyTotal;
                        vm.trPairNum = data.data.platformTotal
                    }
                   
                    vm.items = data.data.items;
                    vm.$nextTick(function(){
                        hightLight();
                    })
                }
            });

            return vm;
        }

        //瀑布流加载更多
        var getMoreTableData = function(vm,req){
            $.ajax({
                 type: "GET",
                 url: "http://api.banbijie.com/?s=Currency.search",
                 data: req,
                 success: function(data){
                    if(req.keyword === ""){
                        vm.total = 0;
                        vm.nameNum =0;
                        vm.trPairNum = 0   
                    }else{
                        vm.total = data.data.total;
                        vm.nameNum = data.data.currencyTotal;
                        vm.trPairNum = data.data.platformTotal
                    }
                    vm.nameNum = data.data.currencyTotal;
                    vm.trPairNum = data.data.platformTotal
                    
                    if(data.data.items.length > 0){
                        vm.items = vm.items.concat( data.data.items);
                        $(".loading").addClass("hide");
                        vm.$nextTick(function(){
                            hightLight();
                        })
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

        //关键字搜索
        var searchContent = function(vm){
            $('#searchContent').bind('input propertychange', function(){
                vm.items =[];
                req.keyword = $(this).val().trim();
                req.n = 1;
                var regEn = /[`~!@#$%^&*()_+<>?:"{},.\;'[\]]/im,
                    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
                if(regEn.test(req.keyword) || regCn.test(req.keyword)){
                    vm.items =[];
                }else{
                     getTableData(vm,req);
                }
                // console.log(req.keyword);
               
            })
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
        //高亮
        var hightLight =function(){
            // console.log($('#searchContent').val().trim());
                $("table").highlight($('#searchContent').val().trim());
                $(".highlight").css({ fontWeight: "600",color:"red" });
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
                
                anchorkeyword: '',//滑动到的id标签
                state: {
                    isvisible:false,    //是否#topcontrol图标这个div为可见
                    shouldvisible:false //是否#topcontrol图标这个div该出现
                }
            }
            $(window).BackToTop(options);
        }
        //初始化函数
        var init = function(){
            initAdv();//广告初始化
            initQrCode();//初始化二维码
            initNotices();//公告初始化
            var vm = createVm();//创建表格
            scroll(vm);//滚动监听
            searchContent(vm);
            backToTop();
        };

        return{
            init: init
        }
    })();

    page.init();
})