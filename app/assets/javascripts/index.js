$(function(){

    if (navigator.userAgent.match(/iPhone/i)) {
        $('.modal').css('position', 'absolute !important');
    }
    if (navigator.userAgent.match(/iPad/i)) {
        $('.modal').css('position', 'absolute !important');
    }
    // tabs
    $('.tabbable').tabs();

    $('.cont').css('min-height', $(window).height() - 174);
    $('.padding-left-fix').slide();


    $.fn.cardfly = function(o){
        var o = $.extend({
            basket: 'none',
            animspeed: 1000,
            sdv: '30px'
        }, o);
        return this.each(function(){
            ////console.log($(this))
            var btn = $(this).parents('.fly').find('.fly-el');
            var clone = btn.clone().addClass('clone-block');
            var posX = btn.offset().left;
            var posY = btn.offset().top;
            var posXb = o.basket.get(0) ? o.basket.offset().left : 0
            var posYb = o.basket.get(0) ? o.basket.offset().top : $(window).height() + $(window).scrollTop()
            clone.css('position', 'absolute')
                 .css('top', posY)
                 .css('left', posX)
                 .css('z-index', '2000')
                 .css('border', '1px solid #999999');
            $('body').append(clone)
            $('.clone-block').animate({
                left: posXb + parseInt( o.sdv ),
                top: posYb + parseInt( o.sdv ),
                width: '50px',
                height: '50px',
                opacity: 0.2
            }, o.animspeed, function(){
                $(this).remove();
            });
        });
    };

    var ajaxParams = {
        city: $('#current-city').attr('data-id'),
        sorting: $.cookie('index_sorting') ? $.cookie('index_sorting') : 'rating',
        min_order: $.cookie('index_min_order') ? $.cookie('index_min_order') : 1000,
        delivery: $.cookie('index_delivery') ? $.cookie('index_delivery') : 0,
        special: $.cookie('index_special') ? $.cookie('index_special') : 0,
        rating: $.cookie('index_rating') ? $.cookie('index_rating') : 0,
        newest: $.cookie('index_newest') ? $.cookie('index_newest') : 0,
        kitchens: $.cookie('index_kitchens') ? $.cookie('index_kitchens').split(',') : [] ,
        view: $.cookie('index_view') ? $.cookie('index_view') : 1
    };
    /*$("#SliderSingle").slider({
        from: 500,
        to: 2000,
        step: 100,
        round: 1,
        format: { format: '##', locale: 'RU' },
        dimension: '&nbsp;руб.',
        scale: [500, 1000, 1500, 2000],
        skin: 'blue',
        callback: function( value ){
            ajaxParams.min_order = value;
            initAjax(ajaxParams);
        }
       }
    ); */
    //$("#SliderSingle").slider("value", $.cookie('index_min_order') > 0 ? $.cookie('index_min_order') : 1000);
    /*$("#slider").kendoSlider({
        value: $.cookie('index_min_order') ? $.cookie('index_min_order') : 2000,

        smallStep: 100,
        largeStep: 500,
        change: function(val){
            ajaxParams.min_order = val.value;
            initAjax(ajaxParams);
        }
    });*/

    $('#sorting li a').click(function(){
        var s = $(this).attr('data-sort');
        $(this).parents('.nav-pills').find('li').removeClass('active');
        $(this).parent('li').addClass('active');
        ajaxParams.sorting = s;
        initAjax(ajaxParams);
    });

    $('.cret a label input').change(function(){
        var p = $(this).parent().attr('id');
        if (this.checked) {
            ajaxParams[p] = 1;
            initAjax(ajaxParams);
        } else {
            ajaxParams[p] = 0;
            initAjax(ajaxParams);
        }
    });

    $('.kitchen a label input').change(function(){
        var id = $(this).attr('data-id');
        if (this.checked) {
            ajaxParams.kitchens.push(id);
            initAjax(ajaxParams);
        } else {
            var n = [];
            for (k in ajaxParams.kitchens) {
                if (id != ajaxParams.kitchens[k]) n.push(ajaxParams.kitchens[k]);
            }
            ajaxParams.kitchens = n;
            initAjax(ajaxParams);
        }
    });

    function initAjax(ajaxParams) {
        for (var p in ajaxParams) {
            if (p != 'city')
                $.cookie('index_' + p, ajaxParams[p], {path: '/', expires: expires});
        }
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: '/ajax/index',
            type: 'post',
            data: ajaxParams,
            success: function(data){
                $('body').loading({
                    action: 'hide'
                });
                $('#view-detail').remove();
                $('.slider-box.list').append(data);
            }
        });
    }
    $('#pop li a').click(function(){
        var t = $(this).attr('data-type');
        $(this).parents('.nav-pills').find('li').removeClass('active');
        $(this).parent('li').addClass('active');
        $.cookie('index_pop', t, {path: '/', expires: expires});
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: '/ajax/index_pop',
            type: 'post',
            data: { type: t },
            success: function(data){
                $('body').loading({
                    action: 'hide'
                });
                $('#pop-slider').html(data);
                sliderColl();
            }
        });
    });

    var form = function(form, params){
        //$('.modal, .modal-backdrop').remove();
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: "/forms/" + form,
            type: "POST",
            data: params,
            success: function(resp){
                $('body').loading({
                    action: 'hide'
                });
                $('.popover').remove();
                if ($('.modal').get(0)) {
                    $('.modal').remove();
                    $('body').append(resp);
                    $('.modal').show();
                } else {
                    $('.modal').remove();
                    $('body').append(resp);
                    $('body').append('<div class="modal-backdrop hide"></div>');
                    $('.modal-backdrop').fadeIn(200);
                    $('.modal').fadeIn(200);

                }
                $.getScript("/forms/asset.js?n=" + form);
            },
            complete: function(){
                $('body').loading({
                    action: 'hide'
                });
            }
        });
    };

    var close_form = function(){
        $('.modal').remove();
        $('.modal-backdrop').remove();
    };

    $('.close, .closeallmodal, .modal-backdrop').live('click', function(){
        close_form();
    });

    $('#city li a').click(function(){
        var c = $(this).attr('data-id');
        $.cookie('city', c, {path: '/', expires: expires});
        location.href = '/';
    });

    var hsh = location.hash;
    var check_hash = function(hsh){
        if (hsh.match(/\#s\d+\/p\d+/)) {
            var p = hsh.split('/');
            if (p[0]) {
                //var ps = $(p[0]).offset().top;
                //if (ps !== undefined) {
                    //$('html,body').animate({scrollTop: ps}, 200);
                    //$('#left-menu').animate({'margin-top': ps-50 > 0 ? ps-50 : 0}, 200);
                //}
            }
            if (p[1] != "") {
                var p_id = p[1].replace('p', '');
                form('product', {id: p_id});
            }
        } else if (hsh.match(/\#basket\/\d+(\/?.+)?/)) {
            var g = hsh.split('/');
            if (g[1] > 0) {
               form('basket', {id: g[1]});
            }
        } else {
            $('.modal, .modal-backdrop').remove();
        }
    };
    check_hash(hsh);
    var check_hash_timer = setInterval(function(){
        var new_hsh = location.hash;
        if (hsh != new_hsh) check_hash(new_hsh);
        hsh = new_hsh;
    }, 300);

    var blockScroll = false;
    $('#all-menu a').click(function(){
        blockScroll = true;
        $(window).scrollTop($(window).scrollTop());
        var tid = $(this).attr('href');
        $('#all-menu li').removeClass('active');
        $(this).parents('li').addClass('active');
        var hsh = tid;
        var p = hsh.split('/');

        if (p[0]) {
            var ps = $(p[0]).offset().top;
            if (ps !== undefined) {
                $('html,body').animate({scrollTop: ps }, 200, 'linear', function(){
                    blockScroll = false;
                });
            }
        }
    });
    $(window).scroll(function(){
        if(!blockScroll){
            for(var i=0; i<pos.length; i++) {
                var vp = pos[i];
                if(checkN(vp[1], $(window).scrollTop(), 70)){
                    elMenu.removeClass('active');
                    elMenu.find('a[href=#'+vp[0]+']').parent().addClass('active');
                }
            }
        }
    });
    var pos = [];
    var elMenu = $('#all-menu').find('li');
    $('.slider-box:not(.one)').each(function(){
        pos.push([$(this).attr('id'), $(this).offset().top]);
    });


    function checkN(a,b,x){
        var c
        if((a>b&&a-x<=b)||(b>a&&b-x<=a)){
            c=true
        }
        if(c===true){
            return true
        }
    }

    // left scroll block

    function autoFixScroll(e){
        if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
        }else{
            var ps = $(window).scrollTop();
            var h = $('#left-menu .fix-ed').innerHeight();
            var bo = $('body').innerHeight() - $('.footer').innerHeight()
            if (ps !== undefined && ps >= $('.well-top').innerHeight() + 60 && (ps + h +20 ) < bo ){
                $('#left-menu .fix-ed').css('left', $('#left-menu').offset().left);
                $('#left-menu .fix-ed').css('top', '20px');
                $('#left-menu .fix-ed').css('position', 'fixed');
            }else{
                $('#left-menu .fix-ed').css('top', (bo - ($('.well-top').innerHeight() + 20 )) - ($('#left-menu .fix-ed').innerHeight()) );
                $('#left-menu .fix-ed').css('position', 'absolute');
                $('#left-menu .fix-ed').css('left', 0);
            }
            if (ps !== undefined && ps <= $('.well-top').innerHeight() + 60  && ps >= 0 ) {
                $('#left-menu .fix-ed').css('position', 'absolute');
                $('#left-menu .fix-ed').css('left', 0);
                $('#left-menu .fix-ed').css('top', ( $('.well-top').innerHeight() + 20 ));
            }
        }



    }
    if($('#left-menu').get(0)){
        var rr = $('#left-menu').width();
        $('#left-menu .fix-ed').width(rr - 40);
        $(window).resize(function(e){
            var rr = $('#left-menu').width();
            $('#left-menu .fix-ed').width(rr - 40);
            autoFixScroll(e);
        });
        $(window).scroll(function(e){
            var rr = $('#left-menu').width();
            $('#left-menu .fix-ed').width(rr - 40);
            autoFixScroll(e);
        });
    }

    // Ajax forms

    var cur_city = $('#current-city').attr('data-id');

    $('#add-address-button').live('click', function(){
        form('address', {id: 0, city: cur_city});
    });

    $('.edit-address-button').live('click', function(){
        var id = $(this).attr('data-id');
        form('address', {id: id, city: cur_city});
    });

    $('.del-address-button').live('click', function(){
        if (window.confirm('Вы действительно хотите удалить адрес?')) {
            var id = $(this).attr('data-id');
            $('body').loading({
                action: 'show'
            });
            $.ajax({
                url: "/ajax/del_address",
                type: "post",
                dataType: 'json',
                data: {id: id},
                success: function(resp){
                    $('body').loading({
                        action: 'hide'
                    });
                    if (resp.stat == "ok") {
                        $('#adr-' + id).fadeOut(300, function(){
                            $(this).remove();
                        });
                        location.reload();
                    }
                }
            });
        }
    });

    $('#login-button').live('click', function(){
        form('login');
    });

    $('#registration-button').live('click', function(){
        form('registration');
    });

    $('#forget-button').live('click', function(){
        form('forget');
    });

    $('#what').live('click', function(){
        form('what-pop');
    });

    $('#tele').live('click', function(){
        form('tele-pop');
    });

    $('#gift-coin').live('click', function(){
        form('gift');
    });

    $('.text-block .name, .best-button ').live('click', function(){
        location.hash = $(this).attr('href');
    });

    $('.special-button').live('click', function(){
        var id = $(this).attr("data-id");
        form("special", {id: id});
    });

    $('.product-button').live('click', function(){
        location.hash = $(this).attr('href');
    });

    $('.popular-button').live('click', function(){
        var id = $(this).attr('data-id');
        form('product', {id: id});
    });

    $('#cansel-order, .cancel-order-button').live('click', function(){
        var id = $(this).attr('data-id');
        form('ordercansel', {id: id});
    });

    $('.replay-order-button').click(function(){
        if (window.confirm("Вы действительно хотите повторить заказ?")) {
            var order = $(this).attr('data-id');
            $.ajax({
                url: "/ajax/replay",
                type: "post",
                dataType: "json",
                data: {id: order},
                success: function(resp) {
                    if (resp.stat == "ok") {
                        location.hash = 'basket/' + resp.order
                    }
                }
            });
        }
    });

    // Add to order
    var block_btn = false;
    $('#add-order').live('click', function(){
        var _th = $(this);
        if(!block_btn){
            block_btn = true;
            var th = $(this),
                p = {};
            p.id = th.attr('data-id');
            p.cnt = th.parent().parent().find('.coll-el').get(0) ? th.parent().parent().find('.coll-el').val() : 1;
            $('body').loading({
                action: 'show'
            });
            $.ajax({
                url: '/ajax/basket_add',
                type: 'post',
                data: p,
                success: function(data){
                    $('.padding-left-fix').slide({
                        startStop: false
                    });
                    $('body').loading({
                        action: 'hide'
                    });
                    $('#basket-bar').fadeIn(200, function(){
                        _th.cardfly({
                            basket: $('.buscket')
                        });
                        if(data){
                            var id = data.match(/data\-id\='(\d+)'/);
                            var p = $('.padding-left-fix');
                            p.find('ul[data-id='+id[1]+']').remove();
                            p.find('li:first').prepend(data).find('ul').addClass('this');
                        }
                        $('.popover').remove();
                        addBascket('.bascket-text', '');
                        $('.padding-left-fix').slide({
                            startStop: true
                        });
                        block_btn = false;
                    });
                }
            });
        }
        return false;
    });

    // Baskets

    function addBascket( _thisEl, _left){
        $('.popover').remove();
        $( _thisEl ).popover({
            placement: 'top',
            trigger: 'manual',
            delay: { show: 300, hide: 0 }
        }).popover('show');

        if(_left){
            $('.popover').css('left',  parseInt($('.popover').css('left')) - _left);
        }
        $('span.tooltip-green').parents('.popover').addClass('tooltip-green');
        $('span.tooltip-red').parents('.popover').addClass('tooltip-red');

        $('.popover').delay(3000).fadeOut('300', function(){
            $(this).remove();
        });

        $(document).scroll(function(){
            $('.popover').remove();
        });
    }
    $(document).scroll(function(){
        $('.popover').remove();
    });
    $('#baskets').find('a').live('click', function(){
        location.hash = $(this).attr('lin');
        check_hash(hsh);
        return false;
    })
    $('#baskets-button, .get-basket-button, #went ').live('click', function(){
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: "/ajax/baskets_get",
            dataType: "json",
            type: "post",
            success: function(resp){
                $('body').loading({
                    action: 'hide'
                });
                if (resp.stat == "ok") {
                    if (resp.type == "one"){
                        location.hash = 'basket/' + resp.id + '';
                        check_hash(hsh);
                    }
                    if (resp.type == "list") {
                        $('#baskets').html('');
                        for (var i in resp.orders) {
                            $('#baskets').append('<li><a href="javascript:;" lin="#basket/' + resp.orders[i].id + '/" data-id="' + resp.orders[i].id + '">' + resp.orders[i].text + '</a></li>').addClass('show');
                            $('#baskets').mouseenter(function(){
                                $(document).unbind('mousedown');
                            });
                            $('#baskets').mouseleave(function(){
                                $(document).bind('mousedown', function(){
                                    $('#baskets').removeClass('show');
                                });
                            });
                            $('#baskets').click(function(){
                                $(document).bind('mousedown', function(){
                                    $('#baskets').removeClass('show');
                                });
                            });
                            $(document).bind('mousedown', function(){
                                $('#baskets').removeClass('show');
                                $(this).unbind('mousedown');
                            });
                        }
                    }

                }

//                if (resp.stat == "ins") {
//                    $('#to-order').attr('data-content', '<span class="tooltip-red"><h4>Минимальная сумма заказа ' + resp.min + ' руб</h4>Добавьте еще что-нибудь в корзину</span>');
//                    //$('#basket-error').popover('show');
//                    addBascket('#to-order', 130);
//                }
//                if (resp.stat == "error") {
//
//                }
            }
        });
        return false;
    });
    $('.padding-left-fix li ul').live('click', function(){
        var id = $(this).attr('data-id');
        location.hash = 'basket/' + id;
    });
    $('#basketImgClick').live('click', function(){
        var id = $('#basket-info').attr('data-id');
        location.hash = 'basket/' + id;
    });
    //bask hover
    $('.padding-left-fix').mouseenter(function(){
        $(this).addClass('hover-block');
    });
    $('.padding-left-fix').mouseleave(function(){
        $(this).removeClass('hover-block');
    });
    //next input phone
    $('.co').live('keyup', function(){
        if($(this).val().length == 3){
            $('.nu').focus();
        }
    });
    $('.nu').live('keyup', function(){
        if($(this).val().length == 7){
            $(this).parents('.input-prepend').next('input').focus();
        }
    });
    $('#change-profile').live('click', function(){
        var _this = $(this).parents('form');
        $('#user-form').find('input[disabled], select[disabled]').each(function(){
            $(this).removeAttr('disabled');
            $(this).removeClass('disabled');
        });
        _this.find('#btn-control-first').fadeOut(function(){
            _this.find('#btn-control').fadeIn();
        });
        return false;
    });
    $('#cansel').live('click', function(){
        var _this = $(this).parents('form');
        $('#user-form').find('input[type=text], select').each(function(){
            $(this).attr('disabled', 'disabled');
            $(this).addClass('disabled');
        });
        _this.find('#btn-control').fadeOut(function(){
            _this.find('#btn-control-first').fadeIn();
        });
        return false;
    });
    $('#change-password').live('click', function(){
        $('#user-form').fadeOut(function(){
            $('#pass-form').fadeIn();
        });
        return false;
    });
    $('#cansel-pass').live('click', function(){
        $('#pass-form').find('input[type=text], select').each(function(){
            $(this).val(' ');
        });
        $('#pass-form').fadeOut(function(){
            $('#user-form').fadeIn();
        });
        return false;
    });

    // init slider
    $('.one, .two').each(function(){
        $(this).jaSlider({
            w: 141,
            mr: 20,
            coll: 4
        });
    });
    // tooltip (menu list block)
    $('.product-button, .spis').popover({
        placement: function(th, el){
            var diff_top = $(el).offset().top > $(window).scrollTop() + 60,
                diff_bottom = ($(el).offset().top + $(th).height()) < ($(window).scrollTop() + $(window).height()),
                diff_right =  ($(el).offset().left + $(el).width() + 280) > $(window).width();
            if (diff_top) return 'top';
            else if (diff_bottom) return 'bottom';
            else if (diff_right) return 'left';
            else return 'right';
        },
        trigger: 'hover'
    });
    $('#element').popover('hide');

    // plus minus
    $('.btn-group button').live('click', function(){
        var el = $(this).parents('.btn-group').find('input');
        var elCost = el.parents('tr').find('td.cena').text().split(' ');
        var elTottal = el.parents('tr').find('td.tottal');
        var znach =  el.val();
        if($(this).hasClass('min') && znach >= 2){
            znach--;
            elTottal.text(parseInt(elCost[0]) * parseInt(znach) + ' руб.');
            el.val(znach);
            allTottal('min');
        }
        if($(this).hasClass('plus') && znach <= 98){
            znach++;
            elTottal.text(parseInt(elCost[0]) * parseInt(znach) + ' руб.');
            el.val(znach);
            allTottal('plus');
        }
    });

    $('.btn-group input').live('change', function () {
        var el = $(this).parents('tr');
        var elCost = el.find('td.cena').text().split(' ');
        var elTottal = el.find('td.tottal');
        var znach = $(this).val();
        if ($(this).val() <= 1) {
            $(this).val(1);
        } else {
            elTottal.text(parseInt(elCost[0]) * parseInt(znach) + ' руб.');
            allTottal('new');
        }
        if ($(this).val() >= 99) {
            $(this).val(99);
        } else {
            elTottal.text(parseInt(elCost[0]) * parseInt(znach) + ' руб.');
            allTottal('new');
        }
    });

    var tottalCost = 0;
    function allTottal (pov) {
        var el = $('.tottal');
        if(pov = 'new'){
            tottalCost = 0;
            el.each(function(){
                var cena = $(this).text().split(' ');
                tottalCost += parseInt(cena[0]);
                $('.tottal-cena').html(tottalCost +' руб.')
            });
        }
        if(pov = 'min'){
            el.each(function(){
                var cena = $(this).text().split(' ');
                tottalCost -= parseInt(cena[0]);
                $('.tottal-cena').html(tottalCost +' руб.')
            });
        }
        if(pov = 'plus'){
            el.each(function(){
                var cena = $(this).text().split(' ');
                tottalCost += parseInt(cena[0]);
                $('.tottal-cena').html(tottalCost +' руб.')
            });
        }
    }
    allTottal ('new');

    //menu list
    $('.dropdown-toggle').dropdown();


    // popup slider
    $('#prese').each(function() {
        var elLi = $(this).find('li'),
            elLiSize = elLi.size(),
            elLiWidth = elLi.width(),
            elLiMarginLeft = elLi.css('margin-left');
        $(this).find('ul.thumbnails').width(((elLiSize) * (parseInt(elLiWidth) + parseInt(elLiMarginLeft))) + parseInt(elLiMarginLeft));
    });

    // user-order
    $('.estimate-button').live('click', function(){
        var place_id = $(this).attr("data-place"),
            order_id = $(this).attr("data-order");
        form("estimate", {place: place_id, order: order_id});
        return false;
    });

    $('.confirm-button').live('click', function() {
        close_form();
        return false;
    });

    var link_order = function(order_id){
        $.ajax({
            url: "/ajax/order_link",
            type: "post",
            data: {id: order_id}
        });
    };

    // valid
    $('.success-login').valid({
        text: 'none',
        phone: '.telephone-code',
        confirmButton: $('.enter'),
        password: '#login-user-password',
        phoneText:  'Введите, пожалуйста, ваш номер телефона.',
        passwordText: 'Введите, пожалуйста, ваш пароль.',
        repassword: 'none',
        showError: false,
        funct: function(){
            var el = $('#log-button');
            if(!el.hasClass('invalid')){
                var th = el;
                th.attr("disabled", true);
                $('body').loading({
                    action: 'show'
                });
                $.ajax({
                    url: '/users/sign_in.json',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        user: {
                            phone: "+7 " + $('#login-user-phone').val(),
                            password: $('#login-user-password').val()
                        }
                    },
                    success: function(data, textStatus, xhr) {
                        $('body').loading({
                            action: 'hide'
                        });
                        a = $('#cansel-order').attr('data-id');
                        if (a > 0) {
                            link_order(a);
                        }
                        location.href = '/';
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $('body').loading({
                            action: 'hide'
                        });
                        $('#login-errors').text('Неверно введен телефон или пароль').slideDown();
                    },
                    complete: function() {
                        $('body').loading({
                            action: 'hide'
                        });
                        th.removeAttr("disabled")
                    }
                });
            }
        }
    });
    $('.success-r').valid({
        text: '#reg-user-name',
        phone: '#reg-user-phone',
        confirmButton: $('.enter-reg'),
        password: '#reg-user-pass',
        repassword: '#reg-user-repass',
        nameText:  'Обязательно заполните поле Имя.',
        phoneText:  'Проверьте поле с номером телефона.',
        passwordText: 'Придумайте пароль и повторите его.',
        repasswordText: 'Введите пароль ещё раз.',
        showError: false,
        funct: function(){
            var th = $('#reg-button');
                errors = [];
            th.attr("disabled", true);
            $('body').loading({
                action: 'show'
            });
            $.ajax({
                url: '/users.json',
                type: 'POST',
                dataType: 'json',
                data: {
                    user: {
                        first_name: $('#reg-user-name').val(),
                        phone: "+7 " + $('#reg-user-phone').val(),
                        email: $('#reg-user-email').val(),
                        password: $('#reg-user-pass').val(),
                        password_confirmation: $('#reg-user-repass').val()
                    }
                },
                success: function(data, textStatus, xhr) {
                    $('body').loading({
                        action: 'hide'
                    });
                    a = $('#cansel-order').attr('data-id');
                    if (a > 0) {
                        link_order(a);
                    }
                    location.href = '/';
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('body').loading({
                        action: 'hide'
                    });
                    var resp = $.parseJSON(jqXHR.responseText);
                    //console.log(resp);
                    $('#reg-errors').html('');
                    if (resp.errors) {
                        for (var k in resp.errors) errors.push(k + ': ' + resp.errors[k].join(', '));
                        $('#reg-errors').html(errors.join('<br>').replace('phone: has already been taken', 'Этот номер уже зарегистрирован, <a id="forget-button" class="ajax" href="javascript:;" title="" >забыли пароль</a>?')).delay(500).slideDown();
                    }
                    th.removeAttr("disabled")
                    $('body').loading({
                        action: 'hide'
                    });
                },
                complete: function() {
                    $('body').loading({
                        action: 'hide'
                    });
                    th.removeAttr("disabled")
                    $('body').loading({
                        action: 'hide'
                    });
                }
            });
        }
    });
    /*$("form").enter({
        fun: function start(){
            $('#log-button').trigger('mousedown');
        }
    });
     */
    //profile
    $('.delete-gift').live('click', function(){
        if(window.confirm('Вы действительно хотите удалить приз?')){
            var gift_id = $(this).attr("data-id"),
                th = $(this);
            $.ajax({
                url: "/ajax/cancel_gift_order",
                type: "post",
                data: {id: gift_id},
                dataType: "json",
                success: function(resp) {
                    if (resp.stat == "ok") {
                        th.parents('tr').fadeOut(function(){
                            $(this).remove();
                            location.reload();
                        });
                    }
                }
            });
        }
    });


    //list view
    $.cookie('index_view', 1, {path: '/', expires: expires});
    function list(){
        $('.view-style button').removeClass('active');
        $('#view-detail').removeClass('box-view');
        $('#v-list').addClass('active');
        ajaxParams.view = 1;
        $.cookie('index_view', 1, {path: '/', expires: expires});
    }
    function block(){
        $('.view-style button').removeClass('active');
        $('#view-detail').addClass('box-view');
        $('#v-block').addClass('active');
        ajaxParams.view = 0;
        $.cookie('index_view', 0, {path: '/', expires: expires});
    }
    if(ajaxParams.view == 1){
        list();
    }
    if(ajaxParams.view == 0){
        block();
    }
    $('#v-list').click(function(){
        list();
    });
    $('#v-block').click(function(){
        block();
    });


   $('.order-gift-button').live('click', function(){
       var gift_id = $(this).attr("data-id");
       $.ajax({
           url: "/ajax/order_gift",
           type: "post",
           dataType: "json",
           data: {id: gift_id},
           success: function(resp){
               if (resp.stat == "ok") {
                   form('gift-text');
               } else {
                   alert(resp.text);
               }
           }
       });
   });

    $('#ord-det').live('mousedown', function(){
        form('ord_det', {id: $(this).text()})
    });

    $('#usr-inf-subm').live('click', function(){
        $(this).addClass('disabled').text('Сохранение...').submit();
    });
});
