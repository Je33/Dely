(function($) {
    function fixTitle($ele) {
        if ($ele.attr('title') || typeof($ele.attr('original-title')) != 'string') {
            $ele.attr('original-title', $ele.attr('title') || '').removeAttr('title');
        }
    }
    function Tipsy(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        fixTitle(this.$element);
    }
    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();

                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);

                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });

                var actualWidth = $tip[0].offsetWidth, actualHeight = $tip[0].offsetHeight;
                var gravity = (typeof this.options.gravity == 'function')
                    ? this.options.gravity.call(this.$element[0])
                    : this.options.gravity;
                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }
                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }
                $tip.css(tp).addClass('tipsy-' + gravity);

                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },
        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { $(this).remove(); });
            } else {
                this.tip().remove();
            }
        },
        getTitle: function() {
            var title, $e = this.$element, o = this.options;
            fixTitle($e);
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },
        tip: function() {
            if (!this.$tip) {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"/></div>');
            }
            return this.$tip;
        },
        validate: function() {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },
        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
    };
    $.fn.tipsy = function(options) {
        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            return this.data('tipsy')[options]();
        }
        options = $.extend({}, $.fn.tipsy.defaults, options);
        function get(ele) {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }
        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
            }
        };
        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
            }
        };
        if (!options.live) this.each(function() { get(this); });
        if (options.trigger != 'manual') {
            var binder   = options.live ? 'live' : 'bind',
                eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }
        return this;
    };
    $.fn.tipsy.defaults = {
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'w',
        html: false,
        live: true,
        offset: 0,
        opacity: 0.8,
        title: 'text',
        trigger: 'hover'
    };
    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };
    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };
    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };
})(jQuery);
///////////////////////////////////////////////////////////////////////////////////////////////////////////
(function($) {
    $.fn.validate = function(optionsUser) {
        var options = {
            form: $(this),
            inputError: 'background: red;',
            block: 'opacity: 0.5;',
            help: true,
            variantPass: false,
            textarea: '3',
            text: '3',
            password: '3',
            phone: '6',
            tips: {
                delayIn: 0,
                delayOut: 0,
                fade: false,
                fallback: '',
                gravity: 'w',
                html: false,
                live: true,
                offset: 0,
                opacity: 0.8,
                title: 'text',
                trigger: 'focus'
            },
            validateAll: function  () {},
            optionsData: {}
        };
        var dataCont = {};
        $.extend(options, optionsUser);
        $('head').append("<style>.inputError{"+options.inputError+"} .block{"+options.block+"} .tipsy { padding: 5px; font-size: 14px; position: absolute; z-index: 100000; }  .tipsy-inner { padding: 5px 8px 4px 8px; background-color: black; color: white; max-width: 200px; text-align: center; }   .tipsy-inner { border-radius: 3px; -moz-border-radius:3px; -webkit-border-radius:3px; }     .tipsy-arrow { position: absolute; background: url('tipsy.gif') no-repeat top left; width: 9px; height: 5px; }   .tipsy-n .tipsy-arrow { top: 0; left: 50%; margin-left: -4px; }      .tipsy-nw .tipsy-arrow { top: 0; left: 10px; }      .tipsy-ne .tipsy-arrow { top: 0; right: 10px; }    .tipsy-s .tipsy-arrow { bottom: 0; left: 50%; margin-left: -4px; background-position: bottom left; }      .tipsy-sw .tipsy-arrow { bottom: 0; left: 10px; background-position: bottom left; }      .tipsy-se .tipsy-arrow { bottom: 0; right: 10px; background-position: bottom left; }    .tipsy-e .tipsy-arrow { top: 50%; margin-top: -4px; right: 0; width: 5px; height: 9px; background-position: top right; } .tipsy-w .tipsy-arrow { top: 50%; margin-top: -4px; left: 0; width: 5px; height: 9px; }</style>");
        return $(this).each(function() {

            dataCont.form = $(this);
            options.optionsData.form = $(this);
            dataCont.el = $(this).find("input[type=text]")
                .add(dataCont.form.find("input[type=password]"))
                .add(dataCont.form.find("input[type=file]"))
                .add(dataCont.form.find("input[type=select]"))
                .add(dataCont.form.find("input[type=submit]"))
                .add(dataCont.form.find("textarea"))

            ////////////////////////////////////////////
            //                 NEW ELEMET
            ////////////////////////////////////////////
            //                  DEMO

            // .add(dataCont.form.find("input[type= yoer code]"))

            ////////////////////////////////////////////

            validateForm();

//            	CopyRight by:
//            		Lebedenko Nikolay Nikolayevich (Lebnik)

            function getFocusPos(e){
                var pos = 0;
                if($.browser.msie){
                    var r = e.document.selection.createRange();
                    r.moveStart('textedit', -1);
                    pos = r.text.length;
                }else{
                    pos = e.selectionEnd;
                }
                return pos;
            }
            function setFocusPos(e, pos){
                if($.browser.msie){
                    var r = e.createTextRange();
                    r.collapse(true);
                    r.moveEnd('character', pos);
                    r.moveStart('character', pos);
                    r.select();
                }else{
                    e.setSelectionRange(pos,pos);
                }
            }
            function phoneValid(e, event_, endfocus){
                if(typeof(e.value)!="string" || event_.ctrlKey
                    || event_.keyCode=="13"
                    || event_.keyCode=="37"
                    || event_.keyCode=="38"
                    || event_.keyCode=="39"
                    || event_.keyCode=="40"
                    || event_.keyCode=="8"
                    || event_.keyCode=="16"){
                    return false;
                }
                var numberFocusPos = getFocusPos(e);
                var numberFocusPosSet = 0;
                var numberFocusPosI = 0;
                var numberFocusPosRealNumber = 0;
                var str = e.value;
                var newstr = "";
                var number_badge = 0;
                var symbol = "";
                var clear_number = "";
                if(str.substr(0,1)==" "){ str = str.substr(1,100); }
                if(str.substr(str.length,1)==" "){ str = str.substr(0,(str.length-1)); }
                for(var i=0; i<str.length; i++){
                    symbol = str.substr(i,1);
                    if(symbol!=" " && isNaN(symbol)==false){
                        clear_number += symbol;
                        numberFocusPosI += 1;
                    }
                    if((i+1)==numberFocusPos && !numberFocusPosRealNumber){ numberFocusPosRealNumber = numberFocusPosI; }
                }
                if(str.substr(0,1)=="+"){ newstr = "+"+newstr; }
                for(var i=0; i<clear_number.length; i++){
                    symbol = clear_number.substr(i,1);
                    newstr += symbol;
                    if((str.substr(0,1)=="8" || str.substr(0,2)=="+7") && clear_number.length<12){
                        if(i==0){ newstr += " ("; }
                        if(i==3){ newstr += ") "; }
                        if(i==6){ newstr += "-"; }
                    }else if(clear_number.substr(0,6)=="810380"){
                        if(i==0 || i==2 || i==12){ newstr += "-"; }
                        if(i==9){ newstr += ")"; }
                        if(i==5 || i==9){ newstr += " "; }
                        if(i==5){ newstr += "("; }
                    }else if(clear_number.substr(0,3)=="380"){
                        if(i==7){ newstr += "-"; }
                        if(i==4){ newstr += ")"; }
                        if(i==2 || i==4){ newstr += " "; }
                        if(i==2){ newstr += "("; }
                    }else if(clear_number.substr(0,1)=="9" && clear_number.length=="10"){
                        if(i==0){ newstr = "+7 (9"; }
                        if(i==2){ newstr += ") "; }
                        if(i==5){ newstr += "-"; }
                    }else if(clear_number.substr(0,1)=="7" && clear_number.length=="11"){
                        if(i==0){ newstr = "+7 ("; }
                        if(i==3){ newstr += ") "; }
                        if(i==6){ newstr += "-"; }
                    }else{
                        if(i==2 || (i==5 && clear_number.length>7) || i==9 || i==13 || i==17){ newstr += "-"; }
                    }
                    if((i+1) == numberFocusPosRealNumber && !numberFocusPosSet){
                        numberFocusPosSet = newstr.length;
                    }
                }
                if(endfocus && newstr.substr((newstr.length-1),1)=="-"){ newstr = newstr.substr(0,(newstr.length-1)); }
                e.value = newstr;
                if(numberFocusPosRealNumber==0 && str.substr(0,1)=="+"){ numberFocusPosSet += 1; }
                if(numberFocusPosSet){ setFocusPos(e, numberFocusPosSet); }
                return false;
            }
//            	end CopyRight by:
//            		Lebedenko Nikolay Nikolayevich (Lebnik)
            function validateForm() {
                dataCont.el.each(function() {
                    var elem = $(this);
                    //////////////////////////////////////////////////////////
                    //                  YOUR VALIDATE
                    //////////////////////////////////////////////////////////

                    //  if(elem.hasClass('validate- YOUR TEXT ')){ // text

                    //	  var length = $.trim(elem.attr('value')).length;

                    //	  if(length < options.text){

                    //	    	elem.addClass('inputError');

                    //	 }else{

                    //	    	elem.removeClass('inputError');

                    //	 }

                    //  }

                    //////////////////////////////////////////////////////////
                    if(elem.hasClass('validate-text')){ // text
                        var length = $.trim(elem.attr('value')).length;
                        if(length < options.text){
                            elem.addClass('inputError');
                        }else{
                            elem.removeClass('inputError');
                        }
                    }
                    if(options.variantPass){
                        if(elem.hasClass('validate-password')){ //password
                            var length = $.trim(elem.attr('value')).length;
                            if(length <= options.password || elem.val().length === 0){
                                elem.addClass('inputError');
                            }else{
                                elem.removeClass('inputError');
                            }
                        }
                    }else{
                        if(elem.hasClass('validate-password')){ //password
                            var length = $.trim(elem.attr('value')).length;
                            if(length <= options.password || elem.val().length === 0 || dataCont.form.find('.validate-re-password').val() != elem.val()){
                                elem.addClass('inputError');
                            }else{
                                elem.removeClass('inputError');
                            }
                        }
                        if(elem.hasClass('validate-re-password')){ // re-password
                            var length = $.trim(elem.attr('value')).length;
                            if(length <= options.password || elem.val().length === 0 || dataCont.form.find('.validate-password').val() != elem.val()){

                                elem.addClass('inputError');
                            }else{
                                elem.removeClass('inputError');
                            }
                        }
                    }
                    if(elem.hasClass('validate-email')){ // email
                        var emailRe = new RegExp("^[^\\s()<>@,;:\\/]+@\\w[\\w\\.-]+\\.[a-z]{2,}$", "i");
                        if(emailRe.test(elem.val()) == false){
                            elem.addClass('inputError');
                        }else{
                            elem.removeClass('inputError');
                        }
                    }
                    if(elem.hasClass('validate-phone')){
                        var phoneRe = /[0-9]{1}/i;
                        var length = elem.val().length;
                        if(phoneRe.test(elem.val()) == false || length < options.phone){
                            elem.addClass('inputError');
                        }else{
                            elem.removeClass('inputError');
                        }
                    }
                    if(elem.hasClass('validate-textarea')){ //textarea
                        var length = elem.attr('value').length;
                        if(length < options.textarea){
                            elem.addClass('inputError');
                        }else{
                            elem.removeClass('inputError');
                        }

                    }
                    if(elem.hasClass('submit')){
                        if(dataCont.form.find('.inputError').size() !== 0){
                            $(this).addClass('block');
                            elem.unbind('click');
                            elem.bind('click', function() {
                                return false;
                            });
                        }else{
                            $(this).removeClass('block');
                            elem.unbind('click');
                            elem.bind('click', function() {
                                return true;
                            });
                        }
                    }
                });
            }

            dataCont.el.each(function() {
                $(this).keyup(function(event) {
                    if ($(this).hasClass('validate-phone')) {
                        phoneValid(this, event, true);
                    }
                    validateAll: validateForm();
                });
            });
            if (options.help == true){

                dataCont.form.find('input[text]').tipsy({
                    delayIn: options.tips.delayIn,
                    delayOut: options.tips.delayOut,
                    fade: options.tips.fade,
                    fallback: options.tips.fallback,
                    gravity: options.tips.gravity,
                    html: options.tips.html,
                    live: options.tips.live,
                    offset: options.tips.offset,
                    opacity: options.tips.opacity,
                    title: options.tips.title,
                    trigger: options.tips.trigger
                });
                dataCont.form.find('textarea[text]').tipsy({
                    delayIn: options.tips.delayIn,
                    delayOut: options.tips.delayOut,
                    fade: options.tips.fade,
                    fallback: options.tips.fallback,
                    gravity: options.tips.gravity,
                    html: options.tips.html,
                    live: options.tips.live,
                    offset: options.tips.offset,
                    opacity: options.tips.opacity,
                    title: options.tips.title,
                    trigger: options.tips.trigger
                });
            }
        });
    };
})(jQuery);