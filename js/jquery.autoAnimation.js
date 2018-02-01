function autoAnimation(){
	// 변수 설정
	var _self = this;
	_self.option = {
		delay     : 100,
		timeObj   : [],
		acc       : [],
		before    : 0,
		timer     : null,
		lastTimer : null,
		area      : null,
		st        : null,
		sh        : null,
		sb        : null,
		offsetTop : null,
		offsetBtm : null,
		playing   : 1,
		unsetType : 'default',
		obj       : document,
		type      : 'load',
		reverse   : 'normal',
	}

	// option Set
	option = _self.option;

	// callback function
	_self.callbackfn = function(){

	}

	// option change
	_self.change = function(afterOption){
		for(var key in afterOption){
			_self.option[key] = option[key] = afterOption[key];
		}
		return _self;
	}

	// 애니메이션 플레이 
	_self.play = function(callback){
		option.timer = 0;
		option.timerObj = [];
		_self.clear();
		if(option.type == 'scroll'){
			option.st = $(window).scrollTop();
			option.sh = $(window).height();
			option.sb = option.st+option.sh;
			option.area = [option.st,option.sb];
			$(".animation",option.obj).each(_self.scrollAnimation);
			option.before = option.st;
		} else {
			option.playLen = $(".animation",option.obj).length-1;
			$(".animation",option.obj).each(_self.loadAnimation);
		}
		option.lastTimer = option.timer;
		return _self;
	}

	// timer clear
	_self.clear = function(){
		option.timeObj.forEach(function(element){
			clearTimeout(element);
			element = 0;
		})
		option.timeObj = [];
		return _self;
	}

	// Load
	_self.loadAnimation = function(num){
		var _this = $(this);
		option.timeObj.push(setTimeout(function(){
			if(option.reverse == 'reverse'){
				var parent = $(".animation",option.obj);
				var len = parent.length-1;
				var idx = len-num;
				parent.eq(idx).addClass("animationBefore type2");
			} else {
				_this.removeClass("animationBefore type2");
			}
			if(num == option.playLen){
				setTimeout(_self.callbackfn,option.delay);
				_self.callbackfn = null;
			}
		},option.timer));
		option.timer += option.delay + (_this.data('delay') ? parseInt(_this.data('delay')) : 0);
		return _self;
	}

	// Scroll
	_self.scrollAnimation = function(num){
		var _this = $(this);
		option.offsetTop = _this.offset().top;
		option.offsetBtm = _this.height() + option.offsetTop;
		if(option.offsetTop<option.area[1] && option.area[0] < option.offsetBtm){
			if(option.before == 0 || option.before <= option.st ){
				if(!option.timeObj[num] && parseInt(option.st - option.before)<50){
					option.timeObj[num] = setTimeout(function(){
						_this.removeClass("animationBefore type2");
					},option.timer);
					var addDelay = _this.data('delay') ? parseInt(_this.data('delay')) : 0;
					option.timer+=option.delay+addDelay;
				}
			} else {	
				_this.removeClass("animationBefore type2");
			}
		} else {
			clearTimeout(option.timeObj[num]);
			option.timeObj[num] = 0;
			_this.addClass("animationBefore");
		}
		return _self;
	}

	// 클래스 초기화
	_self.classSetting = function(){
		$(".childAnimation>*:not(.childAnimation,.noneAnimation)",option.obj).addClass('animation');
		$(".allAnimation *:not(.childAnimation,.noneAnimation)",option.obj).addClass('animation');
		$(".animation",option.obj).addClass("animationBefore");
		return _self;
	}

	// 애니메이션 효과 세팅 - 커스텀
	_self.styleSetting = function(){
		var styleText = 
		'<style>'+
		'.animation{opacity:0;transform:scale(0)}'+
		'.animation.effect1{transform:translateX(-100px)}'+
		'.animation.effect2{transform:translateX(100px)}'+
		'.animation.effect3{transform:scale(1,2)}'+
		'.animation.effect4{transform:scale(2,1)}'+
		'.animation.effect5{transform:rotateY(90deg)}'+
		'.animation.animationActive{opacity:1;transform:inherit;transition:0.5s;}'+
		'.animation.section{opacity:1;transform:inherit;}'+
		'.animation.section.animationActive{background:#fee}'+
		'</style>';
		$(styleText).appendTo('head');
	}

	// 스크롤 애니메이션
	$(window).on("scroll",_self.play)
}