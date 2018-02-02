//Variable Setting
var am = new autoAnimation();

//Document Event;
$(pageLoadEvent)
.on("click",".sub_view",subPageChange)
.on("click",".main_view",mainView)
.on('click','.sub-default .left, .sub-default .right',changePage)
.on("wheel",".history",historyScroll)
.on("wheel",".cable",cableScroll)
.on("click",".cable .list li",cableOpen)

$(window).on("keyup",function(e){
	var keycode = e.keyCode;
	if($(".layer_type2").length){
		if(keycode == '27') $(".layer_type2").stop().fadeOut(300,function(){
			$(this).removeClass("active")
		})
	}
})

//pageLoadEvent
function pageLoadEvent(){

	//Product Slide

	//animation Class Setting and play
	am.classSetting().change({obj:$('.main')}).play();
	// am.classSetting().change({obj:$('.sub')}).play();
	// subView(".sub09");

	if(opener) opener.close();
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
	if(typeof menu == "string" && !$('.gnb '+menu).hasClass('active')){
		$('.gnb .active').removeClass('active');
		$('.gnb '+menu).addClass('active');
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
	$(".page-title").addClass("ani");
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
			$(".page-title").removeClass("ani").html($(".sub>.page.active").data("title"));
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
	$('.gnb .active').removeClass('active')
	if(idx < 7){
		$('.gnb li').eq(0).addClass('active');
	} else if(idx < 10){
		$('.gnb li').eq(1).addClass('active');
	} else {
		$('.gnb li').eq(2).addClass('active');
	}
	$(".page-title").addClass("ani");
	// $(".sub>.page.active").removeClass("active");
	// newObj.addClass("active");
	// setTimeout(function(){
	// 	$(".page-title").html($(".sub>.page.active").data("title")).removeClass("ani");
	// },100);
}

//history scroll
function historyScroll(e){
	var event = e.originalEvent;
	var pos = $(".history-pos:checked").index();
	$(".history-pos:checked")[0].checked = false;
	if(event.deltaY > 0){
		if(pos != 7) pos++;
	} else {
		if(pos != 0) pos--;
	}
	$(".history-pos").eq(pos).prop("checked",true);
}

//cable scroll
function cableScroll(e){
	var event = e.originalEvent;
	var pos = $("input:checked",this).index();
	$("input:checked",this).prop("checked",false);
	if(event.deltaY > 0){
		if(pos != 1) pos++;
	} else {
		if(pos != 0) pos--;
	}
	$("input",this).eq(pos).prop("checked",true);
}

//cableOpen
function cableOpen(){
	var key = $(".subject",this).html();
	var img = $(".img_wrap",this).data("src");
	var obj = product[key];
	var characteristic = "";
	var appfield = "";
	for(var i=0,len=obj.characteristic.length;i<len;i++){
		characteristic += '<p>- '+obj.characteristic[i]+'</p>';
	}
	for(var i=0,len=obj.app.length;i<len;i++){
		appfield += '<p>- '+obj.app[i]+'</p>';
	}
	$(".layer_type2 .img_wrap img").attr("src",img);
	$(".layer_type2 .layer_title").html(key);
	$(".layer_type2 .char").html(characteristic);
	$(".layer_type2 .app").html(appfield);
	$(".layer_type2").addClass("active");
	$(".layer_type2 .close").on("click",function(){
		$(".layer_type2").stop().fadeOut(300,function(){
			$(this).removeClass("active");
		})
	})
}