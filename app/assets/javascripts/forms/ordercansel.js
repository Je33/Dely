$('#order-cancel-button').click(function(){
    var id = $(this).attr("data-id");
    $('body').loading({
        action: 'show'
    });
    $.ajax({
        url: "/ajax/order_cancel",
        type: "post",
        data: {id: id},
        dataType: "json",
        success: function(resp){
            $('body').loading({
                action: 'hide'
            });
            if (location.href.match(/success/)) {
                $('#cancel-notice').html('Заказ отменен. Через <span id="redirect-time">3</span> секунды Вы будете перенаправлены на главную страницу').slideDown();
                var st = 3;
                setInterval(function(){
                    st--;
                    if (st < 0) st = 0;
                    $('#redirect-time').text(st);
                    if (st == 0) location.href = "/";
                }, 1000);
            } else {
                $('#cancel-notice').html('Заказ отменен').slideDown();
                $('#order-cancel-form').remove();
                $('#order-cancel-button').attr("disabled", "disabled");
                $('#cancel-order-' + id).remove();
            }
        }
    });
});
$('form').enter({
    fun: function start(){
        $('#order-cancel-button').trigger('click');
    }
});