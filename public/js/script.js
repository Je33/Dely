
/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */

var expires = 7; // cookies expires days

$.cookie = function(key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
        options = $.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path    ? '; path=' + options.path : '',
            options.domain  ? '; domain=' + options.domain : '',
            options.secure  ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

    var pairs = document.cookie.split('; ');
    for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
        if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
    }
    return null;
};
$.fn.operatorOrderStatusUpdate = function(){
    var o = $.extend({

    }, o);
    return this.each(function(){
        var _t = $(this);
        var orderId = _t.find('#current_url').attr('cur').split('/')[3]
        $.ajax({
            url: '/ajax/order_status',
            data: {
                order_id: orderId
            },
            success: function(data){
                if(_t.find('#current_url').attr('old_status_id') != data ){
                    window.location.reload();
                }
            }
        });
    });
};

$.fn.loading = function(o){
    var o = $.extend({
        action: 'show'
    }, o);
    return this.each(function(){
        if(o.action == 'show'){
            var e = '<div id="loader"><img src="/img/loader.gif" alt="in work" width="11" height="11" />Секундочку...</div>';
            $('#loader').remove();
            $('body').append(e);
            $('#loader').show();
        }
        if(o.action == 'hide'){
            $('#loader').hide();
        }
    });
};
$.fn.enter = function(o){
    var o = $.extend({
        fun: function(){}
    },o);
    return this.each(function(){
        function controlKey(event){
            event = event || window.event;
            var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : null;
            if (keyCode == 13) {
                function start(p){
                    p();
                    $(this).die();
                    return false;

                }
                start(o.fun);
            }

        }
        $(this).live('keyup', function(event){ controlKey(event); });
        $(this).live('keydown', function(event){ controlKey(event); });
        $(this).live('keypress', function(event){ controlKey(event); });
        $(this).live('submit', function(event){ controlKey(event); });
        $(this).submit(function(event){ controlKey(event); });
        return false;
    });
};
var timer;
$.fn.slide = function(o){
    return this.each(function(){

        var p = $(this),
            l = p.find('.le'),
            r = p.find('.ri');
        l.css('visibility', 'hidden');
        r.css('visibility', 'hidden');

        if($(this).find('ul').size() > 1){
            l.css('visibility', 'visible');
            r.css('visibility', 'visible');
            function rr(pos){
                l.unbind('mousedown');
                r.unbind('mousedown');
                if(!pos){
                    pos = 'top';
                }
                if(pos == 'bottom'){
                    var e = p.find('ul:first');
                    p.parent().find('ul').removeClass('this')
                    var c = e.clone();
                    e.stop().animate({marginTop: -63}, 600, function(){
                        c.css('margin-top', 0);
                        e.parents('li').append(c.addClass('this'));
                        e.remove();
                        l.bind('mousedown', function(){
                            rr('top');
                        });
                        r.bind('mousedown', function(){
                            rr('bottom');
                        });
                    });
                }
                if(pos == 'top'){
                    var e = p.find('ul:last');
                    p.parent().find('ul').removeClass('this')
                    var c = e.clone().css('margin-top', '-63px');
                    e.parents('li').prepend(c.addClass('this'));

                    p.find('ul:first').stop().animate({marginTop: 0}, 600, function(){
                        e.remove();
                        l.bind('mousedown', function(){
                            rr('top');
                        });
                        r.bind('mousedown', function(){
                            rr('bottom');
                        });
                    });
                }

            }
            clearInterval(timer);
            timer = setInterval(rr, 4000);
            l.unbind('mousedown');
            r.unbind('mousedown');
            p
                .unbind('mousedown')
                .unbind('mouseleave');
            l.bind('mousedown', function(){
                rr('top');
            });
            r.bind('mousedown', function(){
                rr('bottom');
            });

            p.bind('mouseenter', function(){
                clearInterval(timer);
            });

            p.bind('mouseleave', function(){
              timer = setInterval(rr, 4000);
            });

        }else{
            l.css('visibility', 'hidden');
            r.css('visibility', 'hidden');
        }

    });
};
$.fn.valid = function(o){
    var o = $.extend({
        text: 'none',
        phone: 'none',
        confirmButton: 'none',
        password: 'none',
        repassword: 'none',
        textLength: 2,
        passwordLength: 6,
        error: 'error',
        success: 'success',
        showError: false,
        nameText:  'name',
        textText: 'text',
        phoneText:  'phone',
        passwordText: 'password',
        repasswordText: 're-password',
        select: 'none',
        selectText: 'none',
        selectErrorText: 'select',
        formEnterDisabled: false,
        funct: function(){}
    }, o);
    return this.each(function(){
        window.err = o.showError;
        var form = $(this);
        if(o.text != 'none'){
            var t = form.find(o.text);
        }
        if(o.phone != 'none'){
            var p = form.find(o.phone);
        }
        if(o.confirmButton != 'none'){
            var cb =  o.confirmButton;
        }
        if(o.password != 'none'){
            var pp =  form.find(o.password);
        }
        if(o.repassword != 'none'){
            var rpp =  form.find(o.repassword);
        }
        if(o.select != 'none'){
            var select =  form.find(o.select);
        }
        if(p.get(0)){
            p.mask("(999) 999-9999", {
                submit: cb
            });
        }
        if($.cookie('phone') && o.phone != 'none' && p.hasClass('cookie')==true){
            p.val($.cookie('phone'));
            p.removeClass('not-valid');
        }
        if($.cookie('name') && o.text != 'none' && p.hasClass('cookie')==true){
            if(t.hasClass('street') == false){
                if(t.hasClass('street') == false){
                    t.val($.cookie('name'));
                    t.removeClass('not-valid');
                }
            }
        }
        function vali(){
            if(o.showError){
                if(p.hasClass('not-valid') == true){
                    if(!p.parents('.control-group').hasClass(o.error)){
                        p.parents('.control-group').addClass(o.error);
                        p.parents('.control-group').removeClass(o.success);
                        p.parents('.controls').find('.help-inline').remove();
                        p.parents('.controls').append('<span class="help-inline">'+o.phoneText+'</span>');
                    }
                }else{
                    if(!p.parents('.control-group').hasClass(o.success)){
                        p.parents('.control-group').removeClass(o.error);
                        p.parents('.control-group').addClass(o.success);
                        p.parents('.controls').find('.help-inline').remove();
                    }
                }
            }
            if(p.parents('.control-group').hasClass(o.success)){
                if(p.parents('.controls').find('.help-inline').get(0)){
                    p.parents('.controls').find('.help-inline').fadeOut(200, function(){
                        $(this).remove();
                    });
                }
                $.cookie('phone', p.val(), {path: "/"});
            }

            if(o.text != 'none'){
                t.each(function(){
                    if($(this).val().length >= o.textLength){
                        if(!$(this).parents('.control-group').hasClass(o.success)){
                            if($(this).hasClass('street') == false){
                                $.cookie('name', $(this).val(), {path: '/'});
                            }
                            $(this).removeClass('not-valid');
                            if(o.showError){
                                $(this).parents('.control-group').removeClass(o.error);
                                $(this).parents('.control-group').addClass(o.success);
                                $(this).parents('.controls').find('.help-inline').remove();
                            }
                        }
                    }else{
                        if(!$(this).parents('.control-group').hasClass(o.error)){
                            $(this).addClass('not-valid');
                            if(o.showError){
                                $(this).parents('.control-group').addClass(o.error);
                                $(this).parents('.control-group').removeClass(o.success);
                                $(this).parents('.controls').find('.help-inline').remove();
                                if($(this).hasClass('street') == true){
                                    $(this).parents('.controls').append('<span class="help-inline">'+o.textText+'</span>');
                                }else{
                                    $(this).parents('.controls').append('<span class="help-inline">'+o.nameText+'</span>');
                                }
                            }
                        }
                    }
                });
            }

            if(o.password != 'none'){

                if(pp.val().length >= o.passwordLength){
                    if(!pp.parents('.control-group').hasClass(o.success)){
                        pp.removeClass('not-valid');
                        if(o.showError){
                            pp.parents('.control-group').removeClass(o.error);
                            pp.parents('.control-group').addClass(o.success);
                            pp.parents('.controls').find('.help-inline').remove();
                        }
                    }
                }else{
                    if(!pp.parents('.control-group').hasClass(o.error)){
                        pp.addClass('not-valid');
                        if(o.showError){
                            pp.parents('.control-group').addClass(o.error);
                            pp.parents('.control-group').removeClass(o.success);
                            pp.parents('.controls').find('.help-inline').remove();
                            pp.parents('.controls').append('<span class="help-inline">'+o.passwordText+'</span>');
                        }
                    }
                }
            }
            if(o.repassword != 'none'){
                if(rpp.val().length >= o.passwordLength && pp.val() === rpp.val()){
                    rpp.removeClass('not-valid');
                    if(o.showError){
                        rpp.parents('.control-group').removeClass(o.error);
                        rpp.parents('.control-group').addClass(o.success);
                        rpp.parents('.controls').find('.help-inline').remove();
                    }
                    pp.removeClass('not-valid');
                    if(o.showError){
                        pp.parents('.control-group').removeClass(o.error);
                        pp.parents('.control-group').addClass(o.success);
                        pp.parents('.controls').find('.help-inline').remove();
                    }
                }else{
                    rpp.addClass('not-valid');
                    if(o.showError){
                        rpp.parents('.control-group').addClass(o.error);
                        rpp.parents('.control-group').removeClass(o.success);
                        rpp.parents('.controls').find('.help-inline').remove();
                        if(pp.val() != rpp.val()){
                            rpp.parents('.controls').append('<span class="help-inline">Введённые пароли не совпадают.</span>');
                        }else{
                            rpp.parents('.controls').append('<span class="help-inline">'+o.repasswordText+'</span>');
                        }
                    }
                    pp.addClass('not-valid');
                    if(o.showError){
                        pp.parents('.control-group').addClass(o.error);
                        pp.parents('.control-group').removeClass(o.success);
                        pp.parents('.controls').find('.help-inline').remove();
                        if(pp.val() != rpp.val()){
                            pp.parents('.controls').append('<span class="help-inline">Введённые пароли не совпадают.</span>');
                        }else{
                            pp.parents('.controls').append('<span class="help-inline">'+o.passwordText+'</span>');
                        }
                    }
                }
            }
            if(o.select != 'none'){
                function ch(){
                    if(select.val() != o.selectText){
                        if(!select.parents('.control-group').hasClass(o.success)){
                            select.removeClass('not-valid');
                            if(o.showError){
                                select.parents('.control-group').removeClass(o.error);
                                select.parents('.control-group').addClass(o.success);
                                select.parents('.controls').find('.help-inline').remove();
                            }
                        }
                    }else{
                        if(!select.parents('.control-group').hasClass(o.error)){
                            select.addClass('not-valid');
                            if(o.showError){
                                select.parents('.control-group').addClass(o.error);
                                select.parents('.control-group').removeClass(o.success);
                                select.parents('.controls').find('.help-inline').remove();
                                select.parents('.controls').append('<span class="help-inline">'+o.selectErrorText+'</span>');
                            }
                        }
                    }
                }
                if(select.hasClass('selec') == false){ch();}
                select.focus(function(){
                    select.addClass('selec');
                    select.unbind('focus');
                });
                select.blur(function(){
                    select.removeClass('selec');
                });
                select.change(function(){
                    select.removeClass('selec');
                    select.blur();
                    ch();
                });
            }
            if(o.confirmButton != 'none'){
                if(form.find('.not-valid').get(0)){
                    if(!cb.hasClass('invalid')){
                        cb.addClass('invalid');
                    }
                }else{
                    if(cb.hasClass('invalid')){
                        cb.removeClass('invalid');
                    }
                }
            }
        }

        var timer = window.setInterval(function(){
            vali();
        }, 200);
        if(o.confirmButton != 'none'){
            cb.die();
            cb.live('mousedown', function(){

                vali();

                if(form.find('.not-valid').get(0)){
                    cb.addClass('invalid');
                    o.showError = true;

                }else{
                    cb.removeClass('invalid');
                    function start(s){
                        s();
                    }
                    start(o.funct);
                }
                vali();
                return false;
            });
        }
        if(o.formEnterDisabled == false){
            form.enter({
                fun: function (){
                    o.confirmButton.trigger('mousedown');
			o.confirmButton.parent().parent().submit(function(){
				return false;			
			});
                }
            });


        }
    });
};

//@author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
/* $(this).touchwipe({
 wipeLeft: function() { alert("left"); },
 wipeRight: function() { alert("right"); },
 wipeUp: function() { alert("up"); },
 wipeDown: function() { alert("down"); },
 min_move_x: 20,
 min_move_y: 20,
 preventDefaultEvents: true
 });
 */
(function($) {
    $.fn.touchwipe = function(settings) {
        var config = {
            min_move_x: 50,
            min_move_y: 50,
            wipeLeft: function() { },
            wipeRight: function() { },
            wipeUp: function() { },
            wipeDown: function() { },
            preventDefaultEvents: true
        };
        if (settings) $.extend(config, settings);
        this.each(function() {
            var startX;
            var startY;
            var isMoving = false;

            function cancelTouch() {
                this.removeEventListener('touchmove', onTouchMove);
                startX = null;
                isMoving = false;
            }
            function onTouchMove(e) {
                if(config.preventDefaultEvents) {
                    e.preventDefault();
                }
                if(isMoving) {
                    var x = e.touches[0].pageX;
                    var y = e.touches[0].pageY;
                    var dx = startX - x;
                    var dy = startY - y;
                    if(Math.abs(dx) >= config.min_move_x) {
                        cancelTouch();
                        if(dx > 0) {
                            config.wipeLeft();
                        }
                        else {
                            config.wipeRight();
                        }
                    }
                    else if(Math.abs(dy) >= config.min_move_y) {
                        cancelTouch();
                        if(dy > 0) {
                            config.wipeDown();
                        }
                        else {
                            config.wipeUp();
                        }
                    }
                }
            }
            function onTouchStart(e)
            {
                if (e.touches.length == 1) {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                    isMoving = true;
                    this.addEventListener('touchmove', onTouchMove, false);
                }
            }
            if ('ontouchstart' in document.documentElement) {
                this.addEventListener('touchstart', onTouchStart, false);
            }
        });
        return this;
    };
})(jQuery);
//slider
$.fn.jaSlider = function(el){
    var el = $.extend({
        l: $(this).find('.left'),
        r: $(this).find('.right'),
        v: $(this).find('.view'),
        s: $(this).find('.anim'),
        e: $(this).find('.box'),
        cur: 0,
        size: $(this).find('.box').size(),
        coll: 4,
        posLe: 'next',
        posRi: 'stop',
        w: 0,
        mr: 0,
        autoSlide: true
    }, el);
    return this.each(function(){
        function ypr(){
            if(el.size <= el.coll){
                el.l.css('visibility', 'hidden');
                el.r.css('visibility', 'hidden');
            }
        }
        ypr();
        function a(){
            ypr();
            el.s.stop().animate({marginLeft: -(el.cur * (el.w + el.mr) )}, 300);
        }
        el.l.click(function(){
            if(el.cur - el.coll <= 0){
                if(el.posLe == 'stop'){
                    el.cur = 0;
                    el.posLe = 'next';
                }else{
                    el.cur = el.size -el.coll;
                    el.posLe = 'stop';
                }
            }else{
                el.cur-=el.coll;
            }
            a();
            return false;
        });
        el.r.click(function(){
            if(el.cur+el.coll >= el.size-el.coll){
                if(el.posRi == 'stop'){
                    el.cur = el.size -el.coll;
                    el.posRi = 'next';
                }else{
                    el.cur = 0;
                    el.posRi = 'stop';
                }
            }else{
                el.cur+=el.coll;
            }
            a();
            return false;
        });
        if(el.size > el.coll){
            el.v.touchwipe({
                wipeLeft: function() {
                    el.r.trigger('click');
                },
                wipeRight: function() {
                    el.l.trigger('click');
                }
            });
        }else{
            el.l.css('visibility', 'hidden');
            el.r.css('visibility', 'hidden');
        }
        if(el.autoSlide && el.size > el.coll){
            function autoClick(){
                el.r.trigger('click');
            }
            console.log($(this))
            var t = setInterval( autoClick, 7000 );
            $(this).mouseenter(function(){
             clearInterval(t);
            }).mouseleave(function(){
                    t = setInterval( autoClick, 7000 );
                });
        }
    });
};
// tab
$.fn.tabs = function(o){
    var o = $.extend({
        t: '.nav',
        ts: 'li:not(".not-tab")',
        b: '.tab-content',
        bs: '.tab-pane',
        a: '.active',
        id: 0,
        elements: {},
        funct: function(){}
    }, o);
    return this.each(function(){
        o.elements.parent = $(this),
            o.elements.tabPanel = $(this).find(o.t),
            o.elements.tab = o.elements.tabPanel.find(o.ts),
            o.elements.boxPanel = $(this).find(o.bs),
            o.elements.box = o.elements.boxPanel.find(o.bs),
            o.elements.active = o.elements.tabPanel.find(o.a);
        function changeTab (){
            o.elements.boxPanel.removeClass(o.a.replace('.', ''));
            o.elements.boxPanel.eq(o.id).addClass(o.a.replace('.', ''));
            function start(s){
                s();
            }
            start(o.funct);
        };
        o.elements.tab.live('click', function(){
            o.elements.tab.removeClass(o.a.replace('.', ''));
            $(this).addClass(o.a.replace('.', ''));
            o.id = $(this).index();
            changeTab();
            return false;
        });
    });
};
$.fn.tottal = function(options){
    var options = $.extend({
        pos: 'new',
        tottalCost: 0,
        tottalPrizeCost: 0
    }, options);
    return this.each(function(){
        var el = $('.tottal');
            options.tottalCost = 0;
            options.tottalPrizeCost = 0;
            el.each(function(){
                var priceEl = $(this).text().split(' ');
                var dostavka = parseInt($('.delivery-price').attr('data-num'));
                options.tottalCost += parseInt(priceEl[0]);

                $('.tottal-cena-bez-dst').html(options.tottalCost +' руб.');

                $('.tottal-cena').html(options.tottalCost + dostavka + ' руб.');
                var pp = Math.ceil((options.tottalCost + dostavka) / 10);
                $('.tottal-prize').html(pp +' ');
            });
    });
};
