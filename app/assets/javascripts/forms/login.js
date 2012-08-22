$('#enter').find('#log-button').live('mousedown', function(){
    $('#enter').find('#login-success').remove();
});
$('.modal').valid({
    text: 'none',
    phone: '.telephone-code',
    confirmButton: $('#enter').find('#log-button'),
    password: '#login-user-password',
    repassword: 'none',
    phoneText:  'Введите, пожалуйста, ваш номер телефона.',
    passwordText: 'Введите, пожалуйста, ваш пароль.',
    showError: false,
    funct: function(){
        var th = $('#enter').find('#log-button');
        th.addClass('disabled');
        th.attr('disabled');
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: '/users/sign_in.json',
            type: 'POST',
            dataType: 'json',
            data: {
                user: {
                    phone: "+7 " + $('#enter').find('#login-user-phone').val(),
                    password: $('#enter').find('#login-user-password').val()
                }
            },

            success: function(data, textStatus, xhr) {
                $('#enter').find('#login-errors').remove();
                $('body').loading({
                    action: 'hide'
                });
                location.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('body').loading({
                    action: 'hide'
                });
                th.removeClass('disabled');
                th.attr('disabled');
                $('#enter').find('#login-errors').text('Неверно введен телефон или пароль').slideDown();
            },
            complete: function() {
                $('body').loading({
                    action: 'hide'
                });
                th.removeClass('disabled');
                th.removeAttr("disabled")
            }
        });
    }
});
