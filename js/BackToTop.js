/**
 * 回到顶部(兼容ie8)
 * jQuery BackToTop
 * Version 1.0
 * Author:minchao 
 * Date:2018-04-09 09:43:21
 *  
 */
(function($) {
	var BackToTop = function(options) {
		this.defaults = {
			setting: { 
				startline:1, 			// 鼠标向下滚动距离，出现#topcontrol图标
				scrollto: 0, 			// 它的值可以是整数，也可以是一个id标记。
				scrollduration:500, 	// 滑动到的scrollto的速度，值越大越慢
				fadeduration:[500, 100]	//#topcontrol这个div的淡入淡出速度，第一个参数为淡入速度，第二个参数为淡出速度
			},
			controlHTML: '<a href="#top" class="top_stick"><img src="images/top.png" style="width:50px; height:50px" /></a>',//控制向上滑动的html源码
			controlattrs: {	//控制#topcontrol这个div距离右下角的像素距离	
				offsetx:20, 
				offsety:30
			},
			anchorkeyword: '#top',//滑动到的id标签
			state: {
				isvisible:false,  	//是否#topcontrol图标这个div为可见
				shouldvisible:false //是否#topcontrol图标这个div该出现
			}
		},
		this.opts = $.extend({}, this.defaults, options)
	}

	/*
	 * 添加渲染和数据的方法
	 */
	BackToTop.prototype = {
		/*
		 *  向上滑动
		 */
		scrollup:function(){
			// 开始滑动图标隐藏
			if (!this.cssfixedsupport) {
				this.$control.css({opacity:0})
			};
			//点击后隐藏#topcontrol这个div
			var dest=isNaN(this.opts.setting.scrollto)? this.opts.setting.scrollto : parseInt(this.opts.setting.scrollto);
			if (typeof dest=="string" && jQuery('#'+dest).length==1) { 
				//检查若scrollto的值是一个id标记的话
				dest=jQuery('#'+dest).offset().top;
			} else { 
				//检查若scrollto的值是一个整数
				dest=this.opts.setting.scrollto;
			};
			this.$body.animate({scrollTop: dest}, this.opts.setting.scrollduration);
		},

		keepfixed:function(){

			//获得浏览器的窗口对象
			var $window=jQuery(window);

			//获得#topcontrol这个div的x轴坐标
			var controlx=$window.scrollLeft() + $window.width() - this.$control.width() - this.opts.controlattrs.offsetx;
			
			//获得#topcontrol这个div的y轴坐标
			var controly=$window.scrollTop() + $window.height() - this.$control.height() - this.opts.controlattrs.offsety;
			
			//随着滑动块的滑动#topcontrol这个div跟随着滑动
			this.$control.css({left:controlx+'px', top:controly+'px'});
		},

		togglecontrol:function(){
			//当前窗口的滑动块的高度
			var scrolltop=jQuery(window).scrollTop();
			if (!this.cssfixedsupport) {
				this.keepfixed();
			};
			//若设置了startline这个参数，则shouldvisible为true
			this.opts.state.shouldvisible=(scrolltop>=this.opts.setting.startline)? true : false;
			//若shouldvisible为true，且!isvisible为true
			if (this.opts.state.shouldvisible && !this.opts.state.isvisible){
				this.$control.stop().animate({opacity:1}, this.opts.setting.fadeduration[0]);
				this.opts.state.isvisible=true;
			} //若shouldvisible为false，且isvisible为false
			else if (this.opts.state.shouldvisible==false && this.opts.state.isvisible){
				this.$control.stop().animate({opacity:0}, this.opts.setting.fadeduration[1]);
				this.opts.state.isvisible=false;
			}
		},

		init:function(){
				var mainobj=this;
				
				var iebrws=document.all;
				mainobj.cssfixedsupport=!iebrws || iebrws && document.compatMode=="CSS1Compat" && window.XMLHttpRequest; //not IE or IE7+ browsers in standards mode
				mainobj.$body=(window.opera)? (document.compatMode=="CSS1Compat"? $('html') : $('body')) : $('html,body');

				//包含#topcontrol这个div 
				mainobj.$control=$('<div id="topcontrol">'+mainobj.opts.controlHTML+'</div>')
					// .css({position:mainobj.cssfixedsupport? 'fixed' : 'absolute', bottom:mainobj.opts.controlattrs.offsety, right:mainobj.opts.controlattrs.offsetx, opacity:0, cursor:'pointer'})
					.css({position:mainobj.cssfixedsupport? 'fixed' : 'absolute', opacity:0, cursor:'pointer'})
					.attr({title:''})
					.click(function(){mainobj.scrollup(); return false;})
					.appendTo('body');

				if (document.all && !window.XMLHttpRequest && mainobj.$control.text()!='') {//loose check for IE6 and below, plus whether control contains any text
					mainobj.$control.css({width:mainobj.$control.width()}); //IE6- seems to require an explicit width on a DIV containing text
				};

				mainobj.togglecontrol();

				//点击控制
				$('a[href="' + mainobj.opts.anchorkeyword +'"]').click(function(){
					mainobj.scrollup();
					return false;
				});

				$(window).bind('scroll resize', function(e){
					mainobj.togglecontrol();
				});
			
		},
		constructor: BackToTop
	}
	$.fn.BackToTop = function(options) {
		var backToTop = new BackToTop(options);
		backToTop.init();
		return this.each(function() {});
	}
})(jQuery)