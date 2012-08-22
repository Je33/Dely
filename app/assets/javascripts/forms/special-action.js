$.fn.pop = function (){
    return this.each(function(){
        $('a.left, a.right').mouseenter(function(){
            if($(this).hasClass('left')){
                $('.popover').css('left', '14.5%');
                $('.popover').css('top', '17%');
            }
            if($(this).hasClass('right')){
                $('.popover').css('left', '63.5%');
                $('.popover').css('top', '17%');
            }
        });

    });
}

$('a.left, a.right').popover({
    placement: 'top',
    trigger: 'hover',
    delay: { show: 0, hide: 0 }
})
$('body').pop();
$('a.left, a.right').live('mouseleave', function(){
    $('.popover').remove();
});
$('a.left, a.right').live('click', function(){
    $('.popover').remove();
});

$('.close, #closeallmodal, .modal-backdrop').click(function(){
    var s_pos = location.hash.indexOf('/');
    location.hash = location.hash.substr(0, s_pos);
});