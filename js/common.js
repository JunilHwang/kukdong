//Variable Setting
var am = new autoAnimation();

//Document Event;
$(pageLoadEvent)
.on("click",".sub_view",subPageChange)
.on("click",".main_view",mainView)
.on('click','.sub-default .left, .sub-default .right',changePage)

//pageLoadEvent
function pageLoadEvent(){

	//Product Slide
	//productSlide();

	//animation Class Setting and play
	//am.classSetting().change({obj:$('.main')}).play();
	//am.classSetting().change({obj:$('.sub')}).play();

	if(opener) opener.close();
}

//main Page Slide
function productSlide(){
	var
		pos = 0,
		width = 1080,
		len = $('>ul>li',$('.product .slide')).length-1,
		obj = $('.product .slide');

	//btn Click Event
	$('.slide-arrow').click(arrow);
	$('.slide-pos a').click(positionSet);
	$('.slide-category a').click(categorySet);

	function arrow(){
		$(this).hasClass('left') && (pos-=2);
		play();
	}

	function positionSet(){
		if(pos == $(this).index()) return false;
		pos = $(this).index()-1;
		play();
	}

	function categorySet(){
		pos = $(this).data('pos');
		play('none');
	}

	//slide Play
	function play(type){
		if(++pos>len)
			pos = 0;
		else if(pos<0)
			pos=len;
		if(pos < 8){
			$('.slide-category a').removeClass('active').eq(0).addClass('active');
			$('.sub-title>.active:not(.title1)').removeClass('active');
			$('.sub-title>.title1:not(.active)').addClass('active')
		} else if(pos < 11){
			$('.slide-category a').removeClass('active').eq(1).addClass('active');
			$('.sub-title>.active:not(.title2)').removeClass('active');
			$('.sub-title>.title2:not(.active)').addClass('active')
		} else {
			$('.slide-category a').removeClass('active').eq(2).addClass('active');
			$('.sub-title>.active:not(.title3)').removeClass('active');
			$('.sub-title>.title3:not(.active)').addClass('active')
		}
		$(">ul>li.active",obj).removeClass("active");
		if(type){
			$('>ul',obj).css('margin-left',-pos*100+"%");
			$(">ul>li",obj).eq(pos).addClass("active");
		} else {
			$('>ul',obj).stop().animate({
				'marginLeft':-pos*100+"%"
			},1000,function(){
				$(">ul>li",obj).eq(pos).addClass("active");
			});
		}
		$(".slide-pos a.active").removeClass("active");
		$(".slide-pos a").eq(pos).addClass("active")
	}
}

//subPageChange
function subPageChange(){
	subView($(this).data('menu'));
}

//mainView
function mainView(){
	if($('.main').hasClass('active')) return false;
	am.callbackfn = function(){
		callbackAnimation({type:'main'});
	}
	am.change({obj:$('.sub>nav, .sub>.active, .sub_footer'),reverse:'reverse'}).play();
}

//subView
function subView(menu){
	var callback, before;
	if($('.sub').hasClass('active')){
		before = $(".sub>.active");
		callback = function(){
			callbackAnimation({type:'subPart',menu:menu});
		};
	} else {
		before = $('.main');
		callback = function(){
			callbackAnimation({type:'sub',menu:menu});
		};
	}
	if(typeof menu == "string" && !$('.nav '+menu).hasClass('active')){
		$('.nav .active').removeClass('active');
		$('.nav '+menu).addClass('active');
	}
	am.callbackfn = callback;
	am.change({obj:before,reverse:'reverse'}).play();
}

//callback
function callbackAnimation(option){
	var before,after,afterPart;
	switch(option.type){
		case 'main' :
			before = $('.sub');
			after  = $('.main');
		break;
		case 'sub' :
			before = $('.main');
			after  = $('.sub');
		break;
		case 'subPart' :
			before = $('.sub>.active');                        
			after  = $(option.menu);
		break;
	}
	before.fadeOut(300,function(){
		before.removeClass('active');
		$(this).removeAttr('style');
		after.fadeIn(300,function(){
			$(this).attr('style','');
			if(option.type == 'sub'){
				$('.sub>.active').removeClass('active');
				$('.sub,'+option.menu).addClass('active');
				am.change({obj:$('.sub-default,'+option.menu),reverse:'normal'}).play();
			} else {
				after.addClass('active');
				am.change({obj:after,reverse:'normal'}).play();
			}
		})
	})
}

//footerBtnClick
function changePage(){
	var
		obj = $('.sub>.page.active'),
		idx = $('.sub>.page.active').index()-1,
		min = 0,
		max = $('.sub>.page').length-1,
		newObj;
	if($(this).hasClass('left')){
		if(--idx < min) idx = max;
	} else {
		if(++idx > max) idx = min;
	}
	newObj = $('.sub>.page').eq(idx)
	subView(newObj);
	$('.nav .active').removeClass('active')
	$('.nav li').eq(idx).addClass('active');
}