/**
 * [Ajax Construction Function]
 * By ZeroLing.com
 */
function Ajax () {
    "use strict";
    var aja = {};
    aja.tarUrl = '';
    aja.postString = '';
    aja.createAjax = function () {
        var xmlhttp;
        if (window.XMLHttpRequest) {                      // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {                                            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xmlhttp;
    }

    aja.xhr = aja.createAjax();
    aja.processHandler = function () {
        if(aja.xhr.readyState == 4) {
            if(aja.xhr.status == 200) {
                aja.resultHandler(aja.xhr.responseText);
            }
        }
    }

    aja.get = function (tarUrl, callbackHandler) {
        aja.tarUrl = tarUrl;
        aja.resultHandler = callbackHandler;
        aja.xhr.onreadystatechange = aja.processHandler;
        aja.xhr.open('get', aja.tarUrl, true);
        aja.xhr.send();

    }

    aja.post = function (tarUrl, postString, callbackHandler) {
        aja.tarUrl = tarUrl;
        aja.postString = postString;
        aja.resultHandler = callbackHandler;
        aja.xhr.onreadystatechange = aja.processHandler;
        aja.xhr.open('post', aja.tarUrl, true);
        aja.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        aja.xhr.send(aja.postString);
    }
    return aja;
}

/**
 * Tool Function: Selector
 * @param str
 * @returns {*}
 */
function $ (str) {
    if(!str)return "false";
    if(str[0]=="#"){return document.getElementById(str.split("#")[1]);}
    if(str[0]=="."){return document.getElementsByClassName(str.split(".")[1]);}
    return document.getElementsByTagName(str);
}

var Scroller = {};
/**
 * 获取页面当前Scroll位置
 * @returns {{t: *, l: *, w: *, h: *}}
 */
Scroller.getScroll = function () {
    var t, l, w, h;

    if (document.documentElement && document.documentElement.scrollTop) {
        t = document.documentElement.scrollTop;
        l = document.documentElement.scrollLeft;
        w = document.documentElement.scrollWidth;
        h = document.documentElement.scrollHeight;
    } else if (document.body) {
        t = document.body.scrollTop;
        l = document.body.scrollLeft;
        w = document.body.scrollWidth;
        h = document.body.scrollHeight;
    }
    this.t = t;
    this.l = l;
    this.w = w;
    this.h = h;
    return { t: t, l: l, w: w, h: h};
}

/**
 * 滚动到offsetTop位置
 * @param pos
 */
Scroller.scrollTo = function (pos) {
    if (document.documentElement && document.documentElement.scrollTop) {
        document.documentElement.scrollTop = pos;
    }else if(document.body) {
        document.body.scrollTop = pos;
    }
}

/**
 * 滚到某个元素的位置
 * @param ele
 */
Scroller.goTo = function (ele) {
    this.getScroll();
    var that = this,
        pos = ele.offsetTop + ele.offsetParent.offsetTop;
    if(!pos){return console.log("%cScroller: NO ELE TO SCROLL TO!", "color:red");}
    this.pos = pos;
    if(this.t == pos || this.h - this.t == window.innerHeight) {
        this.bezierT = 0;
        this.bezier = 0;
        return
    }
    this.scrollTo(this.curve());
    setTimeout(function(){that.goTo(ele)}, 20);
}

/**
 * 贝塞尔曲线
 * @returns {*}
 */
Scroller.curve = function () {
    if(!this.bezierT)this.bezierT = 0;
    if(this.bezierT >= 0.9){
        if(this.bezierT >=0.95)
            this.bezierT += 0.005;
        else this.bezierT += 0.01;
    }else this.bezierT += 0.05;

    var p0 = this.t,
        p1 = this.t,
        p2 = this.pos,
        t = this.bezierT,
        bezier = (1-t)*(1-t)*p0 + 2*t*(1-t)*p1 + t*t*p2;
    this.bezier = bezier;
    return bezier;
}

/**
 * 光标定位
 * @param pos1 int
 * @param pos2 int
 */
function locatePoint(pos1, pos2){
    var aCtrl = $('textarea')[0];
    if (aCtrl.setSelectionRange) {
        setTimeout(function() {
            aCtrl.setSelectionRange(pos1, pos2);
            aCtrl.focus();
        }, 0);
    }else if (aCtrl.createTextRange) {
        var textArea=$('textarea')[0];
        var tempText=textArea.createTextRange();
        tempText.moveEnd("character",0-tempText.text.length);
        tempText.select();
    }
}