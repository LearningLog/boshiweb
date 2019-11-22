/**
 * Created by cdvcloud on 2018/7/5.
 */
//转换音频时长显示
(function($){
    $.transTime = function transTime(time) {
        var duration = parseInt(time);
        var hour = parseInt(duration/60/60);
        var minute = parseInt((duration%3600)/60);
        var sec = duration%60%60+'';
        var isM0 = ':';
        if(hour == 0){
            hour = '';
        }else if(hour < 10 ){
            hour = '0'+hour;
        }
        if(minute == 0){
            minute = '00';
        }else if(minute < 10 ){
            minute ='0'+ minute;
        }
        if(sec.length == 1){
            sec = '0'+sec;
        }

        if(hour == 0){
            return minute+isM0+sec;
        }else{
            return hour+isM0+minute+isM0+sec;
        }

    }
})(jQuery);
var videoPlayCallBack;//s视频回调方法
var audioPlayCallBack;//音频回调方法
var spyVideoPlayerShootingFlag;
$(function () {
    // 避免视频重复初始化bug：Player "myVideo" is already initialised. Options will not be applied.
      // 销毁video实例，避免出现节点不存在 但是flash一直在执行,也避免重新进入页面video未重新声明
      $.fn.dispose = function(option){
        videojs(option.id).dispose()
      }
    /*
     * 初始化*/
    $.fn.videoPlayer = function(option){
        var setting = {
            id:"myVideo",
            width:640,
            height:376,
            control:true,
            autoPlay:false,
            title:"",
            thumbnailUrl:"",
            clarityArr:[],
            timeFlag:false,
            curTime:"0",
            flvAudio:false,
            hasFlash:true,
            muted:false,
            bigPlayButton:true,
            fullscreenToggle:true,
            shootingFlag:false,//是否打点
            vjsShootImgSrc:"",//打点缩略图
            vjsShootText:"",//打点文本
            shootOperFlag:"",
            vjsThumbnailOriginal:"",
            currentTime:function(a){
                a=""
                return a;
            },
            shootingCallback:function (t) {
                t="";
                return t;
            },
            screenshotsCallback:function (obj) {
                obj="";
                return obj;
            }

        }
        setting = $.extend(setting,option);
        spyVideoPlayerShootingFlag = setting;
        var ele = $.fn.creatVideoPlayerFn(setting);
        $(this).append(ele);

        if(setting.playType == "video"){
            $(this).css({
                width:setting.width,
                height:setting.height
            });
            $(this).find(".video-js").css({
                width:setting.width,
                height:setting.height
            })

        }else if(setting.playType == "audio"){
            $(this).css({
                width:setting.width,
            });
        }


        //谷歌浏览器版本判断
        if(getChromeVersion()) {
            var version = getChromeVersion();
            if(version >=66) {
                setting.muted = true
            }
        }

        if(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)){
            setting.muted = true
        }

        $.fn.videoSetFn(setting);
    }
    /*添加对象*/
    $.fn.creatVideoPlayerFn = function(setting){
        if(setting.playType == "video"){
            if(setting.flvAudio == true) {
                setting.height = 66;
                setting.bigPlayButton =false;
                setting.fullscreenToggle = false;
            }
            var type =  $.fn.videoSourceFn(setting);
            // var html = '<video crossOrigin="Anonymous"  id="'+setting.id+'" style="object-fit:contain" class="video-js vjs-sublime-skin2 vjs-big-play-centered"' +
            //     ' poster="'+setting.thumbnailUrl+'"  width="'+setting.width+'"  height="'+setting.height+'"' +
            //     'controls preload="none" poster="">' +
            //     '<source src="'+setting.source+'" '+type.typeName+'="'+type.types+'"/>' +
            //     '</video>';
            // crossOrigin="Anonymous" 去掉这个属性 加上有时会报跨域问题
                var html = '<video id="'+setting.id+'" style="object-fit:contain" class="video-js vjs-sublime-skin2 vjs-big-play-centered"' +
                ' poster="'+setting.thumbnailUrl+'"  width="'+setting.width+'"  height="'+setting.height+'"' +
                'controls preload="none" poster="">' +
                '<source src="'+setting.source+'" '+type.typeName+'="'+type.types+'"/>' +
                '</video>';
            return html;
        }else if(setting.playType == "audio"){
            html = '<div id="'+setting.id+'"></div>';
            return html;
        }


    }
    /*设置*/
    $.fn.videoSetFn = function(setting){
        var playType = setting.playType;
        var setObj = setting;
        var id = setting.id;
        if(playType=="video"){
            /*video.js初始化*/
            videoIntFn(setObj);
        }else if(playType=="audio"){
            /*音频初始化*/
            audioIntFn(setting)
        }
    }

    /*判断源类型*/
    $.fn.videoSourceFn = function(setting){
        var source = setting.source;
        if(source.indexOf("rtmp")>=0){
            if(hasFlash){
                hasFlash();
                hasFlash = false;
            }
            return  {typeName:"types",types:"rtmp/flv",techOrder:['html5','flash']};
        }
        var type = source.substr(source.lastIndexOf(".")).toLowerCase();
        if(type.indexOf("flv")>=0){
            //调用flash时判断是否安装flash
            /*if(hasFlash){
             hasFlash();
             hasFlash = false;
             }
             //flv改成flash
             return  {typeName:"types",types:"rtmp/flv",techOrder:['html5','flash']};*/

            if(setting.flvAudio == true){
                //setting.typeName = "types";
                //调用flash时判断是否安装flash
                if(hasFlash){
                    hasFlash();
                    hasFlash = false;
                }
                return  {typeName:"types",types:"rtmp/flv",techOrder:['html5','flash']};
            }else{
                //setting.typeName = "type";
                return  {typeName:"type",types:"video/x-flv",techOrder:['html5','flvjs']};
            }
        }else if(type.indexOf("m3u8")>=0){
            setting.typeName = "type";
            return  {typeName:"type",types:"application/x-mpegURL",techOrder:['html5']};
        }else if(type.indexOf("mp4")>=0){
            setting.typeName = "type";
            return  {typeName:"type",types:"video/mp4",techOrder:['html5']};
        }
    }
    /*当前时间*/
    var videoTimer;
    $.fn.currentTimeFn = function(setting){
        clearInterval(videoTimer);
        videoTimer = setInterval(function(){
            var time =   setting.currentTime(setting.curTime)
            return time;
        },1000)

    }

    /*打点时间*/
    $.fn.shootingCallback = function(t){
        var time = t;
        return time
    }

    /*截屏回调*/
    $.fn.screenshotsCallback = function (t) {
        var obj = t;
        return obj
    }

    //视频打点操作
    //var vjsShootImgSrc;
    function videojsShootOper(setting){
        //打点返回的对象 包括 打点时间和截图
        var shootObj={};
        var shootInputVal;
        var duration;
        var durationLen;
        var targetTime;
        var shootTime;
        var targetLeft;
        var editShootIndex;
        var shootDivWid;
        var arrHtml = []

        //控制条一直显示
        $(".vjs-sublime-skin2 .vjs-control-bar").css("opacity","1");


        $("#"+setting.id).find(".vjs-mouse-display").click(function () {
            $("#"+setting.id).find(".shootPop").hide();
        })

        //点击打点
        $("#"+setting.id).find(".shootBtn").click(function () {
            var onceFlag = true;
            videojs(setting.id).pause();
            //shootInputVal = "";
            duration = videojs(setting.id).duration();
            durationLen =  $("#"+setting.id).find(".vjs-progress-control").width();
            targetTime = videojs(setting.id).currentTime();
            shootTime = $.transTime(targetTime);
            $("#"+setting.id).find(".vjs-shoot-div .vjs-shoot").each(function () {
                var dataTime = $(this).find(".vjs-shoot-dot-html .vjs-shoottime").html();
                if(shootTime == dataTime){
                    onceFlag = false;
                }
            })
            if(onceFlag){
                $("#"+setting.id).find(".shootPop").fadeIn();
                $("#"+setting.id).find(".shootPop .shootInput").val("");

                $("#"+setting.id).find(".shootTime").html(shootTime)
                targetLeft = (targetTime/duration)*durationLen-2;
                $("#"+setting.id).find(".vjs-screenshot span").click();
                setTimeout(function () {
                    $("#"+setting.id).find(".shootImg").attr("src",setting.vjsShootImgSrc);
                },150);
            }



        })

        //打点点击确定
        $("#"+setting.id).find(".confirm").unbind().click(function () {
            var string = [];

            shootInputVal = $(this).parents(".shootPop").find(".shootInput").val();
            //追加确定的打点
            //新建
            if(!$(this).parents(".shootPop").find(".shootPopTitle").hasClass("editH2")){
                string.push('<div class="vjs-shoot">');
                string.push('<div class="vjs-shoot-dot" style="left:'+targetLeft+'px">');
                string.push('<i></i>')
                string.push('<div class="vjs-shoot-dot-html" data-time="'+targetTime+'" data-target-time="'+shootTime+'">');
                string.push('<span class="shootOper"><!--<img class="editShoot" title="编辑" src="images/shootEditIcon.png">-->')
                string.push('<img class="delShoot" title="删除" src="images/shootDelIcon.png"></span>')
                string.push('<img src="'+setting.vjsShootImgSrc+'">')
                string.push( '<div>'+shootInputVal+'</div>');
                string.push( '<p class="vjs-shoottime">'+shootTime+'</p>');
                string.push( '</div>');
                string.push( '</div>');
                string.push( '</div>');
                string.push( '</div>');
                arrHtml.push(string.join(""));
                $("#"+setting.id).find(".vjs-control-bar .vjs-shoot-div").append(string.join(""));

                shootObj={
                    targetTime:targetTime,
                    vjsShootImgSrc:setting.vjsShootImgSrc,
                    vjsShootText:shootInputVal,
                    shootOperFlag:"add",
                    vjsThumbnailOriginal:setting.vjsThumbnailOriginal
                }
                setting.shootingCallback(shootObj);

            }else{
                //编辑
                $("#"+setting.id).find(".vjs-shoot-div .vjs-shoot").eq(editShootIndex).find(".vjs-shoot-dot-html>div").html(shootInputVal)
                $(this).parents(".shootPop").find(".shootPopTitle").removeClass("editH2");
                shootObj={
                    targetTime:targetTime,
                    vjsShootImgSrc:setting.vjsShootImgSrc,
                    vjsShootText:shootInputVal,
                    shootOperFlag:"edit",
                    vjsThumbnailOriginal:setting.vjsThumbnailOriginal
                }
                setting.shootingCallback(shootObj);
            }
            $(".vjs-shoot .delShoot").click(function () {
                var targetTime = $(this).parents(".vjs-shoot-dot-html").attr("data-target-time");
                var vjsShootImgSrc = $(this).parents(".vjs-shoot-dot").find(".vjs-shoot-dot-html>img").attr("src");
                var shootInputVal = $(this).parents(".vjs-shoot-dot").find(".vjs-shoot-dot-html>div").html();
                shootObj={
                    targetTime:targetTime,
                    vjsShootImgSrc:vjsShootImgSrc,
                    vjsShootText:shootInputVal,
                    shootOperFlag:"delete",
                }
                setting.shootingCallback(shootObj);
                $(this).parents(".vjs-shoot").remove();
            })

            shootDivWid = $("#"+setting.id+" video").width()*0.22;
            $(".vjs-shoot-dot-html").width(shootDivWid);
            $(".vjs-shoot-dot-html").height(shootDivWid/1.77);

            //打点编辑
            $("#"+setting.id).find(".vjs-shoot-dot-html .editShoot").click(function (e) {
                videojs(setting.id).pause();
                editShootIndex =  $(this).parents(".vjs-shoot").index();
                //重新赋值
                $("#"+setting.id).find(".shootPop").fadeIn();
                $("#"+setting.id).find(".shootPop .shootPopTitle").addClass("editH2").html("编辑打点");
                var editShootTime = $(this).parents(".vjs-shoot-dot-html").attr("data-target-time");
                var editShootInputVal = $(this).parents(".vjs-shoot-dot-html").find("div").html();
                var editShootImgSrc = $(this).parents(".vjs-shoot").find(".vjs-shoot-dot-html>img").attr("src");
                $("#"+setting.id).find(".shootPop").find(".shootTime").html(editShootTime);
                $("#"+setting.id).find(".shootPop").find(".shootInput").val(editShootInputVal)
                $("#"+setting.id).find(".shootPop").find(".shootImg").attr("src",editShootImgSrc);
                e.stopPropagation();
                e.preventDefault();
                return false;
            })

            $(".vjs-shoot i").css({width:shootDivWid})
            //滑过效果
            $(".vjs-sublime-skin2 .vjs-shoot-dot").hover(function () {
                if(parseInt($(this).css("left"))<parseInt($(this).find(".vjs-shoot-dot-html").width())/2){
                    $(this).find(".vjs-shoot-dot-html,i").css({"left":-parseInt($(this).css("left")),"transform":"translateX(0%)"})

                }else if(parseInt($(this).find(".vjs-shoot-dot-html").width())/2>parseInt($("#"+setting.id).width())-parseInt($(this).css("left"))){
                    $(this).find(".vjs-shoot-dot-html,i").css({
                        "left":-(parseInt($(this).find(".vjs-shoot-dot-html").width())-(parseInt($("#"+setting.id).width())-parseInt($(this).css("left"))))-3,
                        "transform":"translateX(0%)"})

                }
                $(this).find(".vjs-shoot-dot-html").show();
                $(this).find("i").css("display","block");
                $(this).parents(".vjs-progress-holder").find(".vjs-mouse-display .vjs-time-tooltip").hide()
            },function(){
                $(this).find(".vjs-shoot-dot-html").hide();
                $(this).find("i").hide();
                $(this).parents(".vjs-progress-holder").find(".vjs-mouse-display .vjs-time-tooltip").show()
            })

            $(this).parents(".shootPop").hide();

        })
        $("#"+setting.id).find(".cancel").click(function () {
            $(this).parents(".shootPop").hide();
        })

    }


    /*
     视频
     */
    function videoIntFn(obj){
        var videoCurrentTime;
        if(obj.autoPlay=="false"){
            $("#"+obj.id).find(".vjs-big-play-button").show();
        }else{
            $("#"+obj.id).find(".vjs-big-play-button").hide();
        }
        var setting = obj
        var techOrder =  $.fn.videoSourceFn(setting);
        var player = videojs(obj.id, {
            "controls": obj.control,
            "autoplay": obj.autoPlay,
            muted:setting.muted,
            bigPlayButton:obj.bigPlayButton,
            techOrder: techOrder.techOrder,
            controlBar: {
                RemainingTimeDisplay:false,
                FullscreenToggle:false,
                captionsButton:false,
                audioButton:false,
                fullscreenToggle:setting.fullscreenToggle,
                volumePanel: {
                    inline: false //音量控制默认是true,横着的，false，竖着的
                },
            },
            flvjs: {
                mediaDataSource: {
                    isLive: true,
                    cors: true,
                    withCredentials: false,
                },
            }
        },function () {
            if(obj.flvAudio == true){
                $(".vjs-control-bar").css({"display":"flex","opacity":"1"});
                $(".vjs-sublime-skin2 .vjs-volume-panel").css({"right":"12px","min-width":"48px"})
                $(".vjs-sublime-skin2").css("min-width","450px")
            }
            this.on('loadedmetadata',function(){
                //打点设置 初始化调用
                if(obj.shootingFlag){
                    videojsShootOper(setting)
                }
                //部分浏览器不是从0开始显示
                //this.currentTime(0);
                videojs(obj.id).currentTime(videoCurrentTime);
                if(!$("#"+obj.id).find(".vjs-live-control").hasClass("vjs-hidden")){
                    $("#"+obj.id).find(".vjs-reStart span").css({"background":"#9c9c9c","cursor":"default"})
                    $("#"+obj.id).find(".vjs-reStart").css({"cursor":"default"})
                }
            })
            this.on('firstplay',function(){
                //打点的父元素
                if($("#"+obj.id).find(".vjs-shoot-div").length == 0){
                    $("#"+obj.id).find(".vjs-control-bar").append('<div class="vjs-shoot-div"></div>')
                }


                $("#"+obj.id).find(".vjs-big-play-button").hide()
                /*rtmp不显示时间，归零置灰*/
                if(setting.source.indexOf("rtmp")>=0){
                    $("#"+setting.id).find(".vjs-reStart span").css({"background":"#9c9c9c","cursor":"default"})
                    $("#"+setting.id).find(".vjs-reStart").css({"cursor":"default"});
                    $(".vjs-current-time,.vjs-duration,.vjs-time-control").addClass("vjs-hidden");
                    $("#"+obj.id).find(".vjs-loading-spinner").hide();
                }
                //初始加载从0开始
                //this.currentTime(0);
                videojs(obj.id).currentTime(videoCurrentTime);
                //兼容rtmp 一直显示loadding 进度条
                if(obj.source.indexOf("rtmp")>=0){
                    //$("#"+obj.id).find(".vjs-loading-spinner").hide();
                    $("#"+obj.id).find(".vjs-progress-control").hide()
                }
                if(!$("#"+obj.id).find(".vjs-live-control").hasClass("vjs-hidden")){
                    $("#"+obj.id).find(".vjs-reStart span").css({"background":"#9c9c9c","cursor":"default"})
                    $("#"+obj.id).find(".vjs-reStart").css({"cursor":"default"})
                }

                //点击打点的点进度条移动
                $("#"+obj.id).find(".vjs-shoot-div").on("click",".vjs-shoot-dot",function () {
                    var shootTimeNew = $(this).find(".vjs-shoottime").html();
                    var arr = shootTimeNew.split(':');
                    var arrLen = arr.length;
                    if(arrLen == 3){
                        timeSec =  parseInt(arr[0]*3600)+parseInt(arr[1]*60)+parseInt(arr[2]);
                    }else{
                        timeSec =  parseInt(arr[0]*60)+parseInt(arr[1]);
                    }

                    player.currentTime(timeSec)
                })


            })
            this.on('seeked',function(){
                //直播归0按钮置灰
                if(!$("#"+obj.id).find(".vjs-live-control").hasClass("vjs-hidden")){
                    $("#"+obj.id).find(".vjs-reStart span").css({"background":"#9c9c9c","cursor":"default"})
                    $("#"+obj.id).find(".vjs-reStart").css({"cursor":"default"})
                }
            })
            var _this = this;
            $("#"+obj.id).find(".vjs-control-bar .vjs-play-control").after('<span class="vjs-reStart " id="danmu_send_opt"><span></span></span>');
            $("#"+obj.id).find(".vjs-control-bar .vjs-remaining-time").after("<div class='vjs-title'>"+obj.title+"</div>");
            //归零
            $("#"+obj.id).find(".vjs-reStart").unbind().click(function () {
                if(obj.source.indexOf("rtmp")<0){
                    if($("#"+obj.id).find(".vjs-live-control").hasClass("vjs-hidden")){
                        player.pause();
                        player.currentTime(0);
                    }
                }
                if(obj.source.indexOf("flv")>=0){
                    //if(obj.flvAudio == true){
                    $("#"+obj.id).find(".vjs-loading-spinner").hide();
                    //}
                }
            });

            player.on('ended', function () {
                $(".vjs-play-control").removeClass("vjs-ended");
                $("#"+obj.id).find(".vjs-play-control").attr("title","");
            });
            player.on('play',function(){
                
                var $this = this;
                if(setting.source.indexOf("rtmp")>=0){
                    $("#"+obj.id).find(".vjs-loading-spinner").hide();
                }
                //监听当前时间
                if(setting.timeFlag == true ){
                    $.fn.currentTimeFn(setting)
                }
                $("#"+obj.id).get(0).addEventListener('timeupdate',curTimeFn,true);
                $("#"+obj.id).find(".vjs-play-control").attr("title","");
                $("#"+obj.id).find(".vjs-vol-0").attr("title","");

                //截屏
                screenshotFn(obj);
                if(obj.source.indexOf("rtmp")<0){
                    $("#"+obj.id).find(".vjs-screenshot span").removeClass("disabled");
                }

                if(obj.source.indexOf("rtmp")>=0 ||obj.source.indexOf("m3u8")>=0){
                    $("#"+obj.id).find(".shootBtn").hide();
                }


                document.addEventListener("fullscreenchange", function(e) {
                    setTimeout(function(){
                        escKyeup()
                    },100)
                });
                document.addEventListener("mozfullscreenchange", function(e) {
                    setTimeout(function(){
                        escKyeup()
                    },100)
                });
                document.addEventListener("webkitfullscreenchange", function(e) {
                    setTimeout(function(){
                        escKyeup()
                    },200)
                });


                $(window).keydown(function (event) {
                    if (event.keyCode == 27) {
                        if((!!window.ActiveXObject || "ActiveXObject" in window)){

                            if (window.navigator.userAgent.indexOf("MSIE")<1){
                                if($("#"+obj.id).find(".vjs-fullscreen-control .vjs-control-text").html() != 'Fullscreen'){
                                    escKyeup()
                                }

                            }else{
                                escKyeup()
                            }

                        }

                    }
                });

                //点击全屏打点位置重新计算
                var smallWid;
                $(".vjs-fullscreen-control").click(function () {
                    var _this = $(this);
                    if((!!window.ActiveXObject || "ActiveXObject" in window)){
                        escKyeup()
                    }

                })

                function ieFalse(videoWidth){
                    if($("#"+obj.id).find(".vjs-fullscreen-control .vjs-control-text").html() != 'Fullscreen'){
                        videoWidth = screen.width;
                    }else{
                        videoWidth = setting.width;
                    }
                    return videoWidth
                }
                function ieTrue(videoWidth){
                    if($("#"+obj.id).find(".vjs-fullscreen-control .vjs-control-text").html() == 'Fullscreen'){
                        videoWidth = screen.width;
                    }else{
                        videoWidth = setting.width;
                    }
                    return videoWidth
                }
                $(window).resize(function () {
                    var duration = videojs("#"+setting.id).duration();
                    var videoWidth = $("#"+obj.id).find(".vjs-control-bar").width()
                    setTimeout(function () {
                        $("#"+obj.id).find(".vjs-shoot-div .vjs-shoot").each(function () {
                            var shootLeft;
                            if(!$(this).find(".vjs-shoot-dot-html").attr("data-time")){
                                var shootTime = $(this).find(".vjs-shoottime").html();
                                var arr = shootTime.split(':');
                                var arrLen = arr.length;
                                if(arrLen == 3){
                                    timeSec =  parseInt(arr[0]*3600)+parseInt(arr[1]*60)+parseInt(arr[2]);
                                }else{
                                    timeSec =  parseInt(arr[0]*60)+parseInt(arr[1]);
                                }
                                shootLeft =timeSec /duration*videoWidth;
                            }else{
                                shootLeft =$(this).find(".vjs-shoot-dot-html").attr("data-time") /duration*videoWidth;
                            }
                            $(this).find(".vjs-shoot-dot").css("left",shootLeft-2);

                        })

                        if(videoWidth>1000){
                            shootDivWid = videoWidth*.13;
                            $(".vjs-sublime-skin2 .vjs-shoot-dot-html").css({"font-size":"14px"})
                        }else{
                            shootDivWid = videoWidth*0.22;
                            $(".vjs-sublime-skin2 .vjs-shoot-dot-html").css({"font-size":"12px"})
                        }
                        $(".vjs-shoot-dot-html").width(shootDivWid);
                        $(".vjs-shoot-dot-html").height(shootDivWid/1.77);
                    },100)
                })
                function escKyeup(){
                    var timeSec;
                    var videoWidth;
                    var duration = videojs("#"+setting.id).duration();
                    if((!!window.ActiveXObject || "ActiveXObject" in window)){
                        //是ie内核
                        if (window.navigator.userAgent.indexOf("MSIE")>=1){
                            //ie10
                            videoWidth = ieFalse()
                        }else{
                            //ie其他
                            videoWidth = ieTrue()
                        }
                    }else{
                        videoWidth = ieFalse()
                    }


                    setTimeout(function () {
                        $("#"+obj.id).find(".vjs-shoot-div .vjs-shoot").each(function () {
                            var shootLeft;
                            if(!$(this).find(".vjs-shoot-dot-html").attr("data-time")){
                                var shootTime = $(this).find(".vjs-shoottime").html();
                                var arr = shootTime.split(':');
                                var arrLen = arr.length;
                                if(arrLen == 3){
                                    timeSec =  parseInt(arr[0]*3600)+parseInt(arr[1]*60)+parseInt(arr[2]);
                                }else{
                                    timeSec =  parseInt(arr[0]*60)+parseInt(arr[1]);
                                }
                                shootLeft =timeSec /duration*videoWidth;
                            }else{
                                shootLeft =$(this).find(".vjs-shoot-dot-html").attr("data-time") /duration*videoWidth;
                            }
                            $(this).find(".vjs-shoot-dot").css("left",shootLeft-2)

                        })
                    },100)


                    //全屏打点信息改变
                    if(videoWidth>1000){
                        shootDivWid = videoWidth*.13;
                        $(".vjs-sublime-skin2 .vjs-shoot-dot-html").css({"font-size":"14px"})
                    }else{
                        shootDivWid = videoWidth*0.22;
                        $(".vjs-sublime-skin2 .vjs-shoot-dot-html").css({"font-size":"12px"})
                    }
                    $(".vjs-shoot-dot-html").width(shootDivWid);
                    $(".vjs-shoot-dot-html").height(shootDivWid/1.77);
                }


            })
            player.on('pause',function(){
                //清除定时器
                clearInterval(videoTimer);
                if($("#"+obj.id).get(0) != undefined){
                    $("#"+obj.id).get(0).removeEventListener('timeupdate',curTimeFn,true)
                }
                $("#"+obj.id).find(".vjs-play-control").attr("title","");
                if(obj.source.indexOf("flv")>=0) {
                    //flv音视频均用flash
                    //if (obj.flvAudio == true) {
                    $("#"+obj.id).find(".vjs-loading-spinner").hide();
                    //}
                }
            })
            $(".vjs-fullscreen-control").click(function(){
                setTimeout(function(){
                    $(".vjs-fullscreen-control").attr("title","");
                },100)
            })
            $("#"+obj.id).find(".vjs-big-play-button,.vjs-mute-control").attr("title","")
            $("#"+obj.id).find(".vjs-play-control,.vjs-fullscreen-control").attr("title","");

            //截屏
            $("#"+obj.id).find(".vjs-control-bar").append('<div class="vjs-screenshot"><span></span></div>')
            $("#"+obj.id).append('<canvas id="'+obj.id+'canvas"></canvas>');
            $("#"+obj.id).append('<canvas id="'+obj.id+'canvasOriginal"></canvas>');
            if(obj.source.indexOf("rtmp")>=0){
                $("#"+obj.id).find(".vjs-screenshot span").addClass("disabled");
            }
            //判断是否有打点操作功能
            if(obj.shootingFlag){
                //打点
                $("#"+obj.id).find(".vjs-control-bar").append('<div class="shootBtn">打点</div>')
                //打点弹框
                $("#"+obj.id).find(".vjs-control-bar").append('<div class="shootPop">' +
                    '<h2 class="shootPopTitle">添加打点</h2>'+
                    '<div class="shootPopCont">'+
                    '<p>' +
                    '<label>打点时间：</label><span class="shootTime">3:09:12</span>' +
                    '</p>' +
                    '<p>' +
                    '<label>打点文本：</label><input maxlength="20"  type="text" class="shootInput" placeholder="请输入打点文本" />' +
                    '</p>' +
                    '<p><label>打点图片：</label><span class="shootImgDiv"><img src="" class="shootImg" /></span></p>'+
                    '<div class="shootBtnGroup">' +
                    '<a class="confirm">确定</a><a class="cancel">取消</a>'+
                    '</div></div>'+
                    '</div>')
            }


            //监听调当前时间
            function curTimeFn() {
                setting.curTime =$.transTime(parseInt(player.currentTime())+1);
            }
            clarityFn(obj);
        })
        function clarityFn(obj){
            var clarityList=[];
            for(var i=0;i<obj.clarityArr.length;i++){
                clarityList +="<li>"+obj.clarityArr[i].name+"</li>"
            }
            $("#"+obj.id).find(".vjs-control-bar .vjs-remaining-time").before('<ul class="clarity">' +
                '<h2>清晰度</h2>' +
                '<div>'+clarityList+'</div>'+
                '</ul>'
            )

            if(obj.clarityArr.length<1){
                $("#"+obj.id).find(".clarity h2").hide()
                $("#"+obj.id).find(".clarity h2").css({"color":"#9c9c9c","cursor":"default"})
            }else{
                $("#"+obj.id).find(".shootBtn").css("right","185px")
            }
            $("#"+obj.id).find(".clarity li").unbind().click(function () {
                $("#"+obj.id).find("video").attr({"poster":" "});
                $("#"+obj.id).find(".vjs-poster").hide();
                var type = $.fn.videoSourceFn(obj);
                var $index = $(this).index();
                player.pause();
                var curTime = player.currentTime();
                videoCurrentTime = curTime;
                $(this).addClass("active").siblings().removeClass("active")
                $(this).parents("ul").find("h2").html($(this).html());
                obj.source = obj.clarityArr[$index].url;
                player.src([{type:type.types,src:obj.source}])
                /*if(type.types=="video/x-flv"){
                 videojs(obj.id).reset();
                 $("#"+obj.id).find(".vjs-big-play-button").hide();
                 setTimeout(function () {
                 $("#"+obj.id).find(".vjs-big-play-button").show();
                 videojs(obj.id).play();
                 },50)}else*/
                if(type.types == "rtmp/flv" || type.types=="video/x-flv"){
                    $("#"+obj.id).find(".vjs-big-play-button").hide()
                    $("#"+obj.id).find(".vjs-loading-spinner").show();
                    videojs(obj.id).play();
                }else{
                    videojs(obj.id).play();
                }
            })
            for(var i=0;i< obj.clarityArr.length;i++){
                if(obj.source == obj.clarityArr[i].url){
                    $("#"+obj.id).find(".clarity li").eq(i).addClass("active")
                    $("#"+obj.id).find(".clarity h2").html(obj.clarityArr[i].name);
                }
            }
            $(".clarity").mouseenter(function () {
                $(this).find("div").show();
            }).mouseleave(function () {
                $(this).find("div").hide();
            })

        }
        /*截屏*/
        function screenshotFn(obj){
            var $video = $("#"+obj.id).find(".vjs-tech");
            var $canvas = $("#"+obj.id+"canvas");
            var $canvasOriginal = $("#"+obj.id+"canvasOriginal");

            $video[0].onloadstart = function(e) {
            }


            var w;
            var h;
            var wOriginal,hOriginal;
            //不支持rtmp
            if(obj.source.indexOf("rtmp")<0){
                var rate = ($video[0].videoWidth<$video[0].videoHeight ?  $video[0].videoWidth/$video[0].videoHeight :$video[0].videoHeight/$video[0].videoWidth)/4;
                //原有尺寸的1/4
                w = $video[0].videoWidth*rate;//视频缩小尺寸
                h = $video[0].videoHeight*rate;//视频缩小尺寸
                wOriginal = $video[0].videoWidth;//视频原有尺寸
                hOriginal = $video[0].videoHeight;//视频原有尺寸
            }
            $canvas.attr({
                width: w,
                height: h,
            });

            $canvasOriginal.attr({
                width: wOriginal,
                height: hOriginal,
            })

            var ctx = $canvas[0].getContext('2d');
            var ctxOriginal =$canvasOriginal[0].getContext('2d');
            //兼容safari  打点第一次只截第一帧,当canvas先播一段时间可避免这个问题
            var setInterTime =setInterval(function(){
                ctx.drawImage($video[0], 0, 0, w, h);
            },10);
            setTimeout(function(){
                clearInterval(setInterTime);
            },50)


            //var ctx = $canvas[0].getContext('2d');
            $("#"+obj.id).find(".vjs-screenshot span").on('click', function() {
                if(!$(this).hasClass("disabled")){
                    $(this).addClass("disabled");
                    $this = $(this);
                    setTimeout(function(){
                        $this.removeClass("disabled");
                    },1000)
                    videojs(obj.id).pause();

                    //不支持rtmp
                    if(obj.source.indexOf("rtmp")<0){
                        var rate = ($video[0].videoWidth<$video[0].videoHeight ?  $video[0].videoWidth/$video[0].videoHeight :$video[0].videoHeight/$video[0].videoWidth)/4;
                        //原有尺寸的1/4
                        w = $video[0].videoWidth*rate;//视频缩小尺寸
                        h = $video[0].videoHeight*rate;//视频缩小尺寸
                        wOriginal = $video[0].videoWidth;//视频原有尺寸
                        hOriginal = $video[0].videoHeight;//视频原有尺寸
                    }
                    $canvas.attr({
                        width: w,
                        height: h,
                    });

                    $canvasOriginal.attr({
                        width: wOriginal,
                        height: hOriginal,
                    })

                    var image = new Image(); //截图缩小图片
                    var imageOriginal = new Image();//截图原始图片
                    // canvas.toDataURL 返回的是一串Base64编码的URL
                    // 指定格式 PNG

                    $video[0].setAttribute("crossOrigin",'Anonymous')
                    image.crossOrigin = "anonymous";
                    // image.onload = function () {
                    var ctx = $canvas[0].getContext('2d');
                    var ctxOriginal =$canvasOriginal[0].getContext('2d');
                    var getImgSrc=setTimeout(function () {
                        ctx.drawImage($video[0], 0, 0, w, h);
                        ctxOriginal.drawImage($video[0], 0, 0, wOriginal,hOriginal);


                        image.src = $canvas[0].toDataURL("image/jpg");
                        imageOriginal.src = $canvasOriginal[0].toDataURL("image/jpg");

                        obj.vjsShootImgSrc = image.src;
                        obj.vjsThumbnailOriginal = imageOriginal.src;
                        var screenshotsTime = videojs(obj.id).currentTime();
                        var screenshotsObj={
                            targetTime:screenshotsTime,
                            vjsThumbnailOriginal:imageOriginal.src
                        }
                        setting.screenshotsCallback(screenshotsObj);

                    },100)
                }
            });
        }

        //回调方法
        videoPlayCallBack = (function () {

            //视频销毁方法的方法
            function videojsDispose(id){
                videojs(id).dispose()
            }
            //重连m3u8
            function videojsReconnect(id,timeSec,timeOutId){
                //推流判断
                var oldTime = 0;
                var timeout = false; //启动及关闭按钮
                //初始化播放状态0
                var checkstatus=0;
                timeFn();
                function timeFn(){
                    if(timeout) return;
                    var time = videoPlayCallBack.currentTime(id);
                    //如果checkStop为true 表明点击了暂停
                    //判断是否是点击暂停
                    var checkStop = videoPlayCallBack.videojsPause(id);
                    if(time == oldTime){
                        if(checkstatus==0){
                            videojs(id).src($("#"+id).find("video source").attr("src"));
                            videojs(id).load();
                            checkStop = videoPlayCallBack.videojsPause(id);
                        }else{
                            if($("#"+id).hasClass("vjs-error")){
                                videojs(id).src($("#"+id).find("video source").attr("src"));
                                videojs(id).load();
                            }
                            if(checkStop){
                                //点击暂停
                                checkstatus=1;
                            }else{
                                //点击暂停 断流状态
                                checkstatus=0;
                            }

                            //$("#livePlay").css("opacity","1");
                        }
                    }else{
                        if(checkStop){
                            //点击暂停
                            checkstatus=1;
                        }else{
                            checkstatus=0;
                        }

                        //$("#livePlay").css("opacity","1");
                        //$(".videoPlayWrap .videoPlayBg").css("opacity","0");

                        oldTime = time;
                    }
                    var timeoutId = setTimeout(function(){
                        timeFn()
                    },timeSec*1000); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
                    if (id == 'myVideo1') { // 知识库订制
                        videoTimeOutId1 = timeoutId
                    } else if (id == 'myVideo2') {
                        videoTimeOutId2 = timeoutId
                    }
                }
            }

            //视频当前时间
            function videojsCurrnetTime(id,time){
                //确保时间是number类型
                if(typeof(time) == "number"){
                    return videojs(id).currentTime(time);
                }else if(time == null ||time == undefined){
                    return videojs(id).currentTime();
                }

            }
            //load src
            function loadSrc(id){
                videojs(id).src(obj.source);
                videojs(id).load(obj.source);
            }
            //暂停
            function videojsPause(id){
                var _id = $("#"+id).find("video").attr("id");
                return document.getElementById(_id).paused
            }
            //开启
            function videojsPlay(id){
                videojs(id).play()
            }
            //停止
            function videojsStop(id){
                videojs(id).pause()
            }

            //视频打点 展示
            function videojsShooting(id,obj) {
                var obj = obj;
                var shootDivWid;
                var string;
                var duration;
                var durationLen;
                var arrObj;
                var shootTime;
                function initFn(id,obj) {
                    string = " ";
                    //延时获取总时长
                    if (videojs(id).readyState() <1) {

                        player.one("loadedmetadata", function(){
                            duration = videojs(id).duration();
                            waitdurationFn(id,obj)
                        });

                    }else{

                        waitdurationFn(id,obj)
                        duration = videojs(id).duration();
                    }
                    function waitdurationFn(id,obj){
                        duration = videojs(id).duration();
                        durationLen =  $("#"+id).find(".vjs-progress-control").width();
                        //添加打点对象
                        arrObj = [];
                        for(var i=0;i<obj.length;i++){
                            arrObj.push('<div class="vjs-shoot">');
                            arrObj.push('<div class="vjs-shoot-dot" style="left:'+obj[i].targetTime/duration*durationLen+'px">');
                            arrObj.push('<i></i>')
                            arrObj.push('<div class="vjs-shoot-dot-html" data-target-time="'+obj[i].targetTime+'">');
                            if(spyVideoPlayerShootingFlag.shootingFlag){
                                arrObj.push('<span class="shootOper"><!--<img class="editShoot" title="编辑" src="images/shootEditIcon.png">-->')
                                arrObj.push('<img class="delShoot" title="删除" src="images/shootDelIcon.png"></span>')
                            }
                            if(obj[i].vjsShootImgSrc){
                                arrObj.push('<img src="'+obj[i].vjsShootImgSrc+'">')
                            }
                            shootTime = $.transTime(obj[i].targetTime)
                            var shootText = obj[i].vjsShootText;
                            if(undefined == shootText || 'null' == shootText || 'undefined' ==shootText){
                                shootText = '';
                            }
                            arrObj.push( '<div>'+shootText+'</div>');
                            arrObj.push( '<p class="vjs-shoottime">'+shootTime+'</p>');
                            arrObj.push( '</div>');
                            arrObj.push( '</div>');
                            arrObj.push( '</div>');
                            arrObj.push( '</div>');


                        }
                        if($("#"+id).find(".vjs-shoot-div").length == 0){
                            $("#"+id).find(".vjs-control-bar").append('<div class="vjs-shoot-div"></div>')

                            $("#"+id).find(".vjs-shoot-div").html(arrObj.join(""));

                        }else{
                            $("#"+id).find(".vjs-shoot-div").html(arrObj.join(""));
                        }
                        $(".vjs-shoot .delShoot").click(function () {
                            var targetTime = $(this).parents(".vjs-shoot-dot-html").attr("data-target-time");
                            var vjsShootImgSrc = $(this).parents(".vjs-shoot-dot").find(".vjs-shoot-dot-html>img").attr("src");
                            var shootInputVal = $(this).parents(".vjs-shoot-dot").find(".vjs-shoot-dot-html>div").html();
                            shootObj={
                                targetTime:targetTime,
                                vjsShootImgSrc:vjsShootImgSrc,
                                vjsShootText:shootInputVal,
                                shootOperFlag:"delete",
                            }
                            setting.shootingCallback(shootObj);
                            $(this).parents(".vjs-shoot").remove();
                        })


                        if($("#"+setting.id).width()>1000){
                            shootDivWid = $("#"+setting.id).width()*.13;
                            $(".vjs-sublime-skin2 .vjs-shoot-dot-html").css({"font-size":"14px"})
                        }else{
                            shootDivWid = $("#"+setting.id).width()*0.22;
                            $(".vjs-sublime-skin2 .vjs-shoot-dot-html").css({"font-size":"12px"})
                        }
                        $(".vjs-shoot-dot-html").width(shootDivWid)
                        $(".vjs-shoot-dot-html").height(shootDivWid/1.77);
                        $(".vjs-shoot i").css({width:shootDivWid})
                        $(".vjs-sublime-skin2 .vjs-shoot-dot").hover(function () {
                            //判断是否到了边际
                            if(parseInt($(this).css("left"))<parseInt($(this).find(".vjs-shoot-dot-html").width())/2){
                                $(this).find(".vjs-shoot-dot-html,i").css({"left":-parseInt($(this).css("left")),"transform":"translateX(0%)"})
                            }else if(parseInt($(this).find(".vjs-shoot-dot-html").width())/2>parseInt($("#"+setting.id).width())-parseInt($(this).css("left"))){
                                $(this).find(".vjs-shoot-dot-html,i").css({
                                    "left":-(parseInt($(this).find(".vjs-shoot-dot-html").width())-(parseInt($("#"+setting.id).width())-parseInt($(this).css("left"))))-3,
                                    "transform":"translateX(0%)"})

                            }
                            $(this).find(".vjs-shoot-dot-html").show();
                            $(this).find("i").css("display","block");
                            $(this).parents(".vjs-progress-holder").find(".vjs-mouse-display .vjs-time-tooltip").hide()
                        },function(){
                            $(this).find(".vjs-shoot-dot-html").hide();
                            $(this).find("i").hide();
                            $(this).parents(".vjs-progress-holder").find(".vjs-mouse-display .vjs-time-tooltip").show()
                        })



                    }

                }
                videojs(id).off('firstplay',function(){

                });


                videojs(id).on('firstplay',function(){
                    initFn(id,obj);
                })


            }
            return {
                dispose:function (id) {
                    videojsDispose(id)
                },
                currentTime:function(id,time){
                    if(typeof(time) == "number"){
                        videojsCurrnetTime(id,time)
                    }else if(time == null ||time == undefined){
                        return videojsCurrnetTime(id,time)
                    }
                    
                },
                loadSrc:function(id){
                    loadSrc(id)
                },
                videojsPause:function(id){
                    return videojsPause(id);
                },
                videojsReconnect:function (id,timeSec) {
                    videojsReconnect(id,timeSec)
                },
                videojsPlay:function(id){
                    videojsPlay(id)
                },
                videojsStop:function(id){
                    videojsStop(id)
                },
                videojsShooting:function (id,obj) {

                    videojsShooting(id,obj)
                }

            }
        })()
    }

    /*
     音频
     **/
    function audioIntFn(obj){
        var option = obj;
        /*创建audio控件*/
        var htmlString = '<div class="audioWrap">' +
            '<audio  src="'+obj.source+'" class="realAudio" id="'+obj.id+'"></audio>' +
            '<div class="control">' +
            '<div class="icon-btn icon-switch">' +
            '<span class="icon-btn icon-play"></span>' +
            '</div>' +
            '<span class="icon-btn icon-replay"></span>' +
            '<div class="progressBar">' +
            '<div class="barLine">' +
            '<span class="whiteDot"></span>' +
            '</div>' +
            '</div>' +
            '<div class="timeDiv">' +
            '<span class="curT">00:00</span>' +
            '<span class="time-line">/</span>' +
            '<span class="allT">00:00</span>' +
            ' </div>' +
            '<div class="title">'+obj.title+'</div>' +
            '<!--音量-->' +
            '<div class="volumeWrap">' +
            '<span class="volumeDiv"></span>' +
            '<span class="volumeAllLine">' +
            '<span class="volumeLine">' +
            '<span class="whiteDot"></span>' +
            '</span>' +
            '</span>' +
            '</div>' +
            '<div class="fullScreen"></div>' +
            '</div>' +
            '</div>';
        $("#"+obj.id).html(htmlString);
        $("#"+obj.id).find(".audioWrap").css("width",obj.width);
        var audio = $("#"+obj.id).find('.realAudio').get(0);
        var proBarWid = $("#"+obj.id).find(".progressBar").width();

        /*初始音量设置*/
        var _idInt = obj.id;
        audio.volume = .5;
        var curVolInt =audio.volume;
        volunmChange(curVolInt,_idInt);
        var stats = true;
        var first = false;
        //初始加载 获取总时长
        audio.load();
        audio.onloadedmetadata = function(){
            var allTimes = audio.duration;
            var allTime = $.transTime(allTimes);
            $("#"+obj.id).find(".allT").html(allTime);
        }

        //开关
        $("#"+obj.id).find(".icon-switch").unbind().click(function(){
            var _this = $(this);
            //改变暂停/播放icon
            if(audio.paused){
                audio.play();
                if(option.timeFlag == true ){
                    $.fn.currentTimeFn(option)
                }
                first=true;
                _this.find('span').removeClass('icon-play').addClass('icon-pause');
                audio.addEventListener('timeupdate',progressBar,false);
            } else{
                audio.pause();
                //清除定时器
                clearInterval(videoTimer);
                _this.find('span').removeClass('icon-pause').addClass('icon-play');
                audio.removeEventListener('timeupdate',progressBar,false)
            }
        })

        //autoplay播放
        if(obj.autoPlay == true){
            $("#"+obj.id).find(".icon-switch").click();
        }


        //归零
        $("#"+obj.id).find(".icon-replay").click(function(){
            audio.pause();
            audio.currentTime = 0;
            var curTimes = audio.currentTime;
            var curTime = $.transTime(curTimes);
            $("#"+obj.id).find(".curT").html(curTime);
            setTimeout(function () {
                $("#"+obj.id).find(".barLine").width(0);
            },50)
            $("#"+obj.id).find('.icon-switch span').removeClass('icon-pause').addClass('icon-play')
        })
        //进度条
        function progressBar(){
            //监听当前时间
            option.curTime =$.transTime(parseInt(audio.currentTime)+1);
            //获取总时长
            var allTime = audio.duration;
            var curTime = audio.currentTime;
            var ratePro = curTime/allTime;
            $("#"+obj.id).find(".barLine").width(ratePro*proBarWid);

            //显示当前时间和总时间
            var curTimes = audio.currentTime;
            var curTime = $.transTime(curTimes);
            $("#"+obj.id).find(".curT").html(curTime);

            //监听结束 显示关闭按钮
            audio.onended = function(){
                audio.pause();
                $("#"+obj.id).find('.icon-switch span').removeClass('icon-pause').addClass('icon-play')
            }
        }

        //窗口变化时进度条变化
        $(window).resize(function(){
            proBarWid = $("#"+obj.id).find(".progressBar").width();
            progressBar();
        })

//进度条拖拽
        $("#"+obj.id).find(".progressBar").mousedown(function(e){
            var left  = $(this).offset().left;
            //记录拖动时是暂停还是播放
            if($("#"+obj.id).find(".icon-switch span").hasClass("icon-play")){
                stats =false;
            }else{
                stats =true;
            }
            var e = window.event||arguments[0];
            audio.pause();
            $("#"+obj.id).find('.icon-switch span').removeClass('icon-pause').addClass('icon-play')
            var x = e.pageX;
            // $("#"+obj.id).find(".barLine").width(x-left);
            var times = parseInt(((x-left)/proBarWid)*audio.duration);
            var time = $.transTime(times);
            $("#"+obj.id).find(".curT").html(time);
            $("body").css({"cursor":"pointer"});
            moveFn();
            return false;//阻止默认事件或冒泡
        })

        //点击音量图标记住状态
        var w=25;
        var v=.5;
        /*音量控制*/
        $("#"+obj.id).find(".volumeAllLine").mousedown(function(e){
            var _id=obj.id;
            var e = window.event||arguments[0];
            var x = e.pageX;
            var left = $(this).offset().left;
            var volLineWid = $(this).width();
            var curVolPos = $("#"+obj.id).find(".volumeLine").width((x-left));
            var curVol  = ((x-left)/volLineWid).toFixed(1);

            w = $("#"+obj.id).find(".volumeLine").width();
            //判断音量 改变图标
            volunmChange(curVol,_id);
            /*滑动音量*/
            $(document).bind("mousemove",function (e) {
                var e = window.event||arguments[0];
                var x = e.pageX;
                var curVolPos = $("#"+obj.id).find(".volumeLine").width((x-left));
                var curVol  = ((x-left)/volLineWid).toFixed(1);
                volunmChange(curVol,_id);
                w = $("#"+obj.id).find(".volumeLine").width();
            }).mouseup(function (e) {
                $(document).unbind('mouseup');  // 解除按下事件
                $(document).unbind('mousemove');  // 解除按下事件
            })
            return false;//阻止默认事件或冒泡
        })
        //滑过效果
        function moveFn(){
            $(document).bind("mousemove",function(e){
                //改变进度长度和当前时间
                var e = window.event||arguments[0];
                var x = e.pageX;
                var left  = $("#"+obj.id).find(".progressBar").offset().left;
                var curLength = x-left;
                //设置限制
                if(curLength>proBarWid){
                    curLength = proBarWid;
                }
                setTimeout(function () {
                    $("#"+obj.id).find(".barLine").width(curLength);
                },50)

                var times = parseInt(((curLength)/proBarWid)*audio.duration);
                var time = $.transTime(times);
                $("#"+obj.id).find(".curT").html(time);

            }).mouseup(function (e) {
                $(document).unbind('mouseup');  // 解除按下事件
                $(document).unbind('mousemove');  // 解除按下事件
                $("body").css({"cursor":"default"});
                var e = window.event||arguments[0];
                var x = e.pageX;
                var left  = $("#"+obj.id).find(".progressBar").offset().left;
                var curLength = x-left;
                //设置限制
                if(curLength>proBarWid){
                    curLength = proBarWid;
                    if(stats){
                        audio.pause();
                        $("#"+obj.id).find('.icon-switch span').addClass('icon-play').removeClass('icon-pause');
                    }
                }else{
                    if(stats){
                        audio.play();
                        $("#"+obj.id).find('.icon-switch span').removeClass('icon-play').addClass('icon-pause');
                    }
                }

                setTimeout(function () {
                    $("#"+obj.id).find(".barLine").width(curLength)
                },50)

                audio.currentTime = ((x-left)/proBarWid)*audio.duration;

            })
        }
        //音量改变
        function volunmChange(obj,id){
            if(obj>1){
                obj = 1.0;
                $("#"+id).find(".volumeDiv").removeClass("volumeDivStop volumeDivS volumeDivM");
            }else if(0.7<=obj && obj<=1){
                $("#"+id).find(".volumeDiv").removeClass("volumeDivStop volumeDivS volumeDivM");
            }else if(0.3<=obj && obj<=7){
                $("#"+id).find(".volumeDiv").addClass("volumeDivM").removeClass("volumeDivStop volumeDivS");
            }else if(0<obj&&obj<0.3){
                $("#"+id).find(".volumeDiv").addClass("volumeDivS").removeClass("volumeDivStop volumeDivM")
            }else if(obj<0){
                obj=0;
                $("#"+id).find(".volumeDiv").addClass("volumeDivStop").removeClass("volumeDivS volumeDivM")
            }
            audio.volume = obj;
            v = audio.volume;
        }

        //点击音量图标静音
        $("#"+obj.id).find(".volumeDiv").click(function(){
            if(!$(this).hasClass("volumeDivStop")){
                $(this).addClass("volumeDivStop");
                audio.volume =0;
                $("#"+obj.id).find(".volumeLine").width(0)
            }else{
                if(v!=0){
                    $(this).removeClass("volumeDivStop");
                    audio.volume =v;
                    $("#"+obj.id).find(".volumeLine").width(w)
                }else{
                    $(this).removeClass("volumeDivStop").addClass("volumeDivS")
                    v = 0.1;
                    w=5;
                    audio.volume =v;
                    $("#"+obj.id).find(".volumeLine").width(w)
                }
            }
        })

        //音频回调方法
        audioPlayCallBack = (function(){
            function audioDispose(id){
                $("#"+id).remove();
            }
            return {
                dispose:function (id) {
                    audioDispose(id)
                },

            }
        })()
    }
})

function hasFlash(){
    var hasFlash = 0;　　　　 //是否安装了flash
    var flashVersion = 0;　　 //flash版本
    if(document.all) {
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if(swf) {
            hasFlash = 1;
        }
    } else {
        if(navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins["Shockwave Flash"];
            if(swf) {
                hasFlash = 1;
            }
        }
    }
    if(hasFlash == 0){
        alert("检测未安装或禁用flash，确保功能正常使用请先安装启用flash")
    }
    return false;
}

//// 获取谷歌浏览器版本
function getChromeVersion() {
    var arr = navigator.userAgent.split(' ');
    var chromeVersion = '';
    for(var i=0;i < arr.length;i++){
        if(/chrome/i.test(arr[i]))
            chromeVersion = arr[i]
    }
    if(chromeVersion){
        return Number(chromeVersion.split('/')[1].split('.')[0]);
    } else {
        return false;
    }
}





