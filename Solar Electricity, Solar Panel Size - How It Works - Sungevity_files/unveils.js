/* jslint browser: true */
/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var wW, loaded,
		e = window,
		$w = $(e),
		a = 'inner',
		th = threshold || 0,
        retina = window.devicePixelRatio > 1 || /iPad|iPhone|iPod/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent),
        attrib = "data-src",
        images = this;

	if (!('innerWidth' in e )) {
		a = 'client';
		e = document.documentElement || document.body;
	}
	wW = e[ a+'Width' ];	  
	  
	if (retina) {
		if (wW >= 768) {
			attrib = "data-src-retina";
		} else {
			attrib = "data-src-small-retina";
		}
    } else {
		if (wW < 768) {
			attrib = "data-src-small";
		}
	} 

    this.one("unveil", function() {
		var source = this.getAttribute(attrib);
		source = source || this.getAttribute("data-src");
			
		if (source && source !== 'no-bg') {
			if (this.tagName === "IMG") {
				this.setAttribute("src", source);
			} else {
				this.style.backgroundImage = "url('" + source + "')";
			}
			if (typeof callback === "function") callback.call(this);		  
		} else {
			this.style.backgroundImage = "";
		}
    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.scroll(unveil);
    $w.resize(unveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);