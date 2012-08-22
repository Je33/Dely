
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
$('.modal').valid({
    text: 'none',
    phone: '#forget-form-phone',
    confirmButton: $('#forg-button'),
    phoneText:  'Введите, пожалуйста, ваш номер телефона.',
    showError: false,
    formEnterDisabled: true,
    funct: function(){
        var phone = "+7 " + $('#forget-form-phone').val();
        if (phone.match(/^\+7\s\(\d{3}\)\s\d{3}\-\d{4}$/i)) {
            $('body').loading({
                action: 'show'
            });
        } else {
            $('#reset-errors').text('Телефон указан неверно').slideDown();
        }
    }
});
var blockBtn = false;
$('#forg-button').live('mousedown', function(){
    if(blockBtn == false){
        blockBtn = true;
        var phone = "+7 " + $('#forget-form-phone').val();
        if($(this).hasClass('invalid') == false){
            $.ajax({
                url: "/ajax/reset_password.json",
                type: "POST",
                dataType: 'json',
                data: { phone: phone },
                success: function(data) {
                    $('#forg-button').die();
                    $('body').loading({
                        action: 'hide'
                    });
                    if (data.stat == "ok") {
                        form('login', {phone: data.phone.replace('+7 ', ''), msg_text: data.msg_text});
                    } else {
                        $('#reset-errors').text(data.text).slideDown();
                        blockBtn = false;
                    }
                }
            });
        }
    }
});
$('#forget-form-phone').focus(function(){
    $(this).enter({
        fun: function(){
            $('#forg-button').trigger('mousedown');
        }
    });
});