var p = $('#ord-list');
var s = p.find('li').size();
var w = p.find('li').width() + 35
//console.log(p, s, w, '000');



p.find('ul').width( s * w );