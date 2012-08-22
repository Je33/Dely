$('#specialpop').each(function(){
    var ul = $(this).find('.thumbnails');
    var li = ul.find('li');
    ul.width( li.size() * (parseInt(li.width() + parseInt(li.css('margin-left')) ) ));
});