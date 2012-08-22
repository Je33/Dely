$('.modal').find('form').each(function(){
    $(this).find('input:last').keydown(function(e){
        if(e.keyCode == 9){
            return false;
        }
    });
});

$('#baskets').removeClass('show');
$('.close, #closeallmodal, .modal-backdrop').click(function(){
    location.hash = '';
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
var iddi = 0,
    order = $('#Checkout'),
    back = $('#popupback'),
    success = $('#order-address'),
    p = $('#gobascket').find('.parent'),
    clear = $('#basket-form-order-del'),
    user = $('#basket-not-auth'),
    hsh = window.location.hash.split('#'),
    block = false;
clear.show();
user.hide();
var e = p.find('.children:eq(0)');
var h = e.height();

p.animate({height: h}, 0, function(){
    $('#gobascket').removeClass('hidden');
});

var s = hsh[1].split('/');
function anim(id){
    iddi = id;
    var e = p.find('.children:eq('+id+')');
    p.find('.children').removeClass('cc');
    e.addClass('cc');
    var h = e.height();
    p.animate({height: h, marginLeft: id*(-573)}, 300, function(){
        hhh = $('.cc').height()
    });
    if(id == 0){
        $('#gobascket').animate({top: '20%'}, 300);
    }
    if(id == 1){
        $('#gobascket').animate({top: '0%'}, 300);
    }
}
var hhh = 0;
window.setInterval( autoHeight, 200);
function autoHeight (){
    if( hhh != $('.cc').height() ){
        anim( iddi )
    }
}
function ajaxBlock(href){
    var hsh = location.hash;
    var g = hsh.split('/');
    $.ajax({
        url: href,
        dataType: "json",
        type: "post",
        data: {id: g[1]},
        success: function(resp){
            var bt = $('.modal').find('#Checkout');
            if(resp.block){
                block = true;
                bt.addClass('disabled');
                bt.text('Не хватает '+ resp.dv +' руб. до минимальной суммы заказа');
                $('.modal-header .breadcolor span:not(.d)').addClass('active').css('cursor', 'default');
            }else{
                bt.removeClass('disabled');
                bt.text('Оформить заказ');
                $('.modal-header .breadcolor span:not(:first)').removeClass('active').css('cursor', 'pointer');
                block = false;
            }
        }
    });
}
ajaxBlock("/ajax/basket_get");
function justBlock(resp) {
    var bt = $('.modal').find('#Checkout');
    if(resp.block){
        $('#ins-basket-' + resp.id).text(resp.dv).parents('.lit').show();
        block = true;
        bt.addClass('disabled');
        bt.text('Не хватает '+ resp.dv +' руб. до минимальной суммы заказа');
        $('.modal-header .breadcolor span:not(.d)').addClass('active').css('cursor', 'default');
    }else{
        $('#ins-basket-' + resp.id).parents('.lit').hide();
        bt.removeClass('disabled');
        bt.text('Оформить заказ');
        $('.modal-header .breadcolor span:not(:first)').removeClass('active').css('cursor', 'pointer');
        block = false;
    }
}

anim(0);

back.live('click', function() {
    if(!block){
        if(iddi == 1){
            anim(0);
            clear.show();
            user.hide();
            $('#Checkout').show();
            $('#order-address').hide();
            $('#order-success').hide();
            $('#popupback').hide();
            $('.breadcolor span').removeClass('active');
            $('.breadcolor span:eq(0)').addClass('active');
        }
        if(iddi == 2){
            anim(1);
            clear.hide();
            user.show();
            $('#Checkout').hide();
            success.show();
            $('#order-success').hide();
            $('.breadcolor span').removeClass('active');
            $('.breadcolor span:eq(2)').addClass('active');
        }
    }
});
order.bind('click', function(){
    if(!block && $(this).hasClass('disabled') == false){
        anim(1);
        order.hide();
        success.show();
        back.show();
        clear.hide();
        user.show();
        $('.breadcolor span').removeClass('active');
        $('.breadcolor span:eq(2)').addClass('active');
    }
});

$('.basket-edit').click(function(){
    var bid = $(this).attr("data-id"),
        cnt = $(this).parent().find('.coll-el').val(),
        ths = $(this);
    if ($(this).hasClass('min')) cnt--;
    else cnt++;
    if (bid > 0 && cnt > 0) {
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: "/ajax/basket_edit",
            type: "post",
            data: {id: bid, cnt: cnt},
            dataType: "json",
            success: function(resp){
                $('body').loading({
                    action: 'hide'
                });
                if (resp.stat == "ok") {
                    var ttt = resp.total + resp.delivery;
                    $('.tottal-cena').text(ttt + " руб.");
                    $('.tottal-cena-base').text(resp.total + " руб.");
                    $('.tottal-cena-delivery').text(resp.delivery + " руб.");
                    ths.parent().find('.coll-el').val(resp.cnt);
                    var cn = ths.parents('tr').find('.cena').text().replace(" руб.", ""),
                        tt = cn * resp.cnt;
                    ths.parents('tr').find('.tottal').text(tt + " руб.");
                    $('#basket-unit-'+resp.id+' span').text(resp.total + " + " + resp.delivery + " руб.");
                    $('#basket-points').text(Math.ceil( ttt / 10 ));

                    justBlock(resp);
                }
            }
        });
        return false;
    }
});
$('.coll-el').change(function(){
    var bid = $(this).attr("data-id"),
        cnt = $(this).val(),
        ths = $(this);
    if (bid > 0 && cnt > 0) {
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: "/ajax/basket_edit",
            type: "post",
            data: {id: bid, cnt: cnt},
            dataType: "json",
            success: function(resp){
                $('body').loading({
                    action: 'hide'
                });
                var ttt = resp.total + resp.delivery;
                $('.tottal-cena').text(ttt + " руб.");
                $('.tottal-cena-base').text(resp.total + " руб.");
                $('.tottal-cena-delivery').text(resp.delivery + " руб.");
                ths.val(resp.cnt);
                var cn = ths.parents('tr').find('.cena').text().replace(" руб.", ""),
                    tt = cn * resp.cnt;
                ths.parents('tr').find('.tottal').text(tt + " руб.");
                $('#basket-unit-'+resp.id+' span').text(resp.total + " + " + resp.delivery + " руб.");
                $('#basket-points').text(Math.ceil( resp.total / 10 ));

                justBlock(resp);
            }
        });
        return false;
    }
});

$('#basket-form-order-del').click(function(){
    if (window.confirm("Удалить всю корзину?")) {
        var oid = $(this).attr("data-id");
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: "/ajax/order_del",
            data: {id: oid},
            dataType: "json",
            success: function(resp){
                $('body').loading({
                    action: 'hide'
                });
                if (resp.stat == "ok") {
                    var p = $('#basket-bar');
                    if($('.padding-left-fix').find('ul').size() == 1){
                        $('#basket-bar').fadeOut(300, function(){
                            p.find('.padding-left-fix').find('ul').remove();
                            p.find('.dropdown-menu').find('li').remove();
                        });
                        $('.modal').remove();
                        $('.modal-backdrop').remove();
                        ajaxBlock(resp);
                    } else {
                        p.find('.padding-left-fix').find('ul[data-id='+oid+']').remove();
                        $('.padding-left-fix').slide();
                        p.find('#baskets').find('a[data-id='+oid+']').parents('li:first').remove();
                        $('.modal').remove();
                        $('.modal-backdrop').remove();
                    }
                    location.hash = "";
                }
            }
        });
    }
});
$('.basket-del').click(function(){
    //if (window.confirm("Действительно удалить?")) {
        var bid = $(this).attr("data-id"),
            ths = $(this).parents('tr');
        if (bid > 0) {
            $('body').loading({
                action: 'show'
            });
            $.ajax({
                url: "/ajax/basket_del",
                type: "post",
                data: {id: bid},
                dataType: "json",
                success: function(resp){
                    $('body').loading({
                        action: 'hide'
                    });
                    ths.remove();
                    var ttt = resp.total + resp.delivery;
                    $('.tottal-cena').text(ttt + " руб.");
                    $('.tottal-cena-base').text(resp.total + " руб.");
                    $('.tottal-cena-delivery').text(resp.delivery + " руб.");
                    $('#basket-unit-'+resp.id+' span').text(resp.total + " + " + resp.delivery + " руб.");
                    $('#basket-points').text(Math.ceil( resp.total / 10 ));
                    anim(0);

                    justBlock(resp);
                }
            });
        }
    //}
    return false;
});

user.live('click', function(){
    $('#login-user-phone').val($('#prependedInput').val());
    $('#reg-user-phone').val($('#prependedInput').val());
    $('#reg-user-name').val($('#basket-user-name').val());
    anim(2);
    clear.hide();
    user.hide();
    order.hide();
    success.show();
    back.show();
    $('.breadcolor span').removeClass('active');
    $('.breadcolor span:eq(4)').addClass('active');
});
$('.modal-header .breadcolor span:first').bind('click', function(){
    if(!block){
        anim(0);
        clear.show();
        user.hide();
        $('#Checkout').show();
        $('#order-address').hide();
        $('#order-success').hide();
        $('#popupback').hide();
        $('.breadcolor span').removeClass('active');
        $('.breadcolor span:eq(0)').addClass('active');
        $('.breadcolor span').removeClass('active');
        $(this).addClass('active');
    }
});
$('.modal-header .breadcolor span:eq(2)').bind('click', function(){
    if(!block){
        anim(1);
        clear.hide();
        user.show();
        $('#Checkout').hide();
        $('#popupback').show();
        success.show();
        $('.breadcolor span').removeClass('active');
        $('.breadcolor span:eq(2)').addClass('active');
        $('.breadcolor span').removeClass('active');
        $(this).addClass('active');
    }
});
$('.success-login').valid({
    text: 'none',
    phone: '.telephone-code',
    confirmButton: $('.enter'),
    password: '#login-user-password',
    phoneText:  'Введите, пожалуйста, ваш номер телефона.',
    passwordText: 'Введите, пожалуйста, ваш пароль.',
    showError: false,
    funct: function(){
        var th = $('.enter');
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
                var hsh = location.hash;
                var g = hsh.split('/');
                if (g[1] > 0) {
                    form('basket', {id: g[1]});
                }
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
});

$('.success-registr').valid({
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
        var th = $('.enter-reg');
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
                var hsh = location.hash;
                var g = hsh.split('/');
                if (g[1] > 0) {
                    form('basket', {id: g[1]});
                }

            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('body').loading({
                    action: 'hide'
                });
                var resp = $.parseJSON(jqXHR.responseText);
                $('#reg-errors').html('');
                if (resp.errors) {
                    for (var k in resp.errors) errors.push(k + ': ' + resp.errors[k].join(', '));
                    $('#reg-errors').html(errors.join('<br>')).slideDown();
                }
                th.removeAttr("disabled")
            },
            complete: function() {
                $('body').loading({
                    action: 'hide'
                });
                th.removeAttr("disabled")
            }
        });
    }
});
$('.adr').valid({
    text: '.name-bb',
    phone: '.telephone-code',
    confirmButton: $('#order-address'),
    nameText:  'Представьтесь, пожалуйста!',
    textText: 'Заполните, пожалуйста, адрес.',
    phoneText:  'Введите, пожалуйста, ваш номер телефона.',
    select: $('#basket-region-select'),
    selectText: 'select',
    selectErrorText: 'Необходимо выбрать район',
    showError: false,
    funct: function(){
        $('#order-address span').text('Секундочку...');
        $('#order-address').addClass('disabled');
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: "/ajax/new_order",
            type: "post",
            dataType: "json",
            data: $('#basket-order-form').serialize(),
            success: function(resp){
                $('body').loading({
                    action: 'hide'
                });
                if (resp.stat == "ok") {
                    location.href = "/success/" + resp.order
                } else {
                    alert()
                    $('#order-address span').text('Заказать');
                    $('#order-address').removeClass('disabled');
                }
            }
        });
    }
});
$('#basket-address-select').change(function(){
    var aid = this.value;
    if (aid > 0) {
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: "/ajax/get_address_json",
            type: "post",
            dataType: "json",
            data: {id: aid},
            success: function(resp){
                $('body').loading({
                    action: 'hide'
                });
                if (resp) {
                    $('#basket-region-select').val(resp.region_id);
                    $('#basket-metro-select').val(resp.metro_id);
                    $('#basket-address-street').val(resp.street);
                    $('#basket-address-house').val(resp.house);
                    $('#basket-address-building').val(resp.building);
                    $('#basket-address-room').val(resp.room);
                    $('#basket-address-porch').val(resp.porch);
                    $('#basket-address-floor').val(resp.floor);
                    $('#basket-address-intercom').val(resp.intercom);
                } else {
                    $('#basket-region-select').val('');
                    $('#basket-metro-select').val('');
                    $('#basket-address-street').val('');
                    $('#basket-address-house').val('');
                    $('#basket-address-building').val('');
                    $('#basket-address-room').val('');
                    $('#basket-address-porch').val('');
                    $('#basket-address-floor').val('');
                    $('#basket-address-intercom').val('');
                }
            }
        });
    } else {
        $('#basket-region-select').val('');
        $('#basket-metro-select').val('');
        $('#basket-address-street').val('');
        $('#basket-address-house').val('');
        $('#basket-address-building').val('');
        $('#basket-address-room').val('');
        $('#basket-address-porch').val('');
        $('#basket-address-floor').val('');
        $('#basket-address-intercom').val('');
    }
    $.ajax({
        url: "/ajax/order_region",
        type: "post",
        dataType: "json",
        data: {
            order: $('#basket-order-id').val(),
            region: $('#basket-region-select').val()
        },
        success: function(resp){
            if (resp != "error") {
                $('.tottal-cena-base').text(resp.price_base + " руб.");
                $('.tottal-cena-delivery').text(resp.price_delivery + " руб.");
                $('.tottal-cena').text(resp.price + " руб.");
                $('#basket-points').html(Math.ceil(resp.price/10));
            }
        }
    });
});

$.ajax({
    url: "/ajax/order_region",
    type: "post",
    dataType: "json",
    data: {
        order: $('#basket-order-id').val(),
        region: $('#basket-region-select').val()
    },
    success: function(resp){
        if (resp != "error") {
            $('.tottal-cena-base').text(resp.price_base + " руб.");
            $('.tottal-cena-delivery').text(resp.price_delivery + " руб.");
            $('.tottal-cena').text(resp.price + " руб.");
            $('#basket-points').html(Math.ceil(resp.price/10));
        }
    }
});

$('#basket-region-select').change(function(){
    var th = $(this);
    $.ajax({
        url: "/ajax/order_region",
        type: "post",
        dataType: "json",
        data: {
            order: $('#basket-order-id').val(),
            region: th.val()
        },
        success: function(resp){
            if (resp != "error") {
                $('.tottal-cena-base').text(resp.price_base + " руб.");
                $('.tottal-cena-delivery').text(resp.price_delivery + " руб.");
                $('.tottal-cena').text(resp.price + " руб.");
                $('#basket-points').html(Math.ceil(resp.price/10));
            }
        }
    });
});
//$.fn.basket = function(options){
//    var opt = $.extend({
//        childId: 0
//    }, options);
//    return this.each(function(){
//        var parent =  $(this).find('.parent'),
//            children = parent.find('.children'),
//            childrenId = parent.find('.children:eq('+ opt.childId +')');
//            bread =  parent.find('.breadcolor');
//
//        parent
//            .width( children.size() * children.width())
//            .css('margin-left', (-1) * (childrenId.width() * opt.childId ));
//
//
//        $(this).addClass('modal');
//        $(this).fadeIn(200);
//    });
//};
//function dopFunc(){
//    if(!block){
//        if(id == 0){
//            $('#Checkout').text('Оформить заказ');
//
//        }else{
//            $('#Checkout').text('Заказать');
//            $('#popupback').show();
//        }
//    }
//};

