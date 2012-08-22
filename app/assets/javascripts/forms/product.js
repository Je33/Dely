/* $.fn.pop = function (){
    return this.each(function(){
        $('a.left, a.right').mouseenter(function(){
            if($(this).hasClass('left')){
                var posX = parseInt($('.popover').css('left')) - 143;
                var posY = $(document).scrollTop();
                $('.popover')
                    .css('top', posY + 100)
                    .css('left', posX);
            }
            if($(this).hasClass('right')){
                var posX = parseInt($('.popover').css('left')) + 138;
                var posY = $(document).scrollTop();
                $('.popover')
                    .css('left', posX)
                    .css('top', posY + 100);
            }
            //console.log(posX);
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
 */
$('.close, #closeallmodal, .modal-backdrop').click(function(){
    var s_pos = location.hash.indexOf('/');
    location.hash = location.hash.substr(0, s_pos);
});
$('.prod-more').popover({
    trigger: 'hover',
    placement: 'top'
});