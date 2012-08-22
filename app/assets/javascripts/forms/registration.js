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
    text: '.name-in',
    phone: '.telephone-code',
    confirmButton: $('#reg-button'),
    password: '#reg-user-pass',
    repassword: '#reg-user-repass',
    nameText:  'Обязательно заполните поле Имя.',
    phoneText:  'Проверьте поле с номером телефона.',
    passwordText: 'Придумайте пароль и повторите его.',
    repasswordText: 'Введите пароль ещё раз.',
    showError: false,
    funct: function(){
        var th = $('#reg-button'),
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
                form('registrationsuccess');
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
