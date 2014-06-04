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

  $.fn.unveil = function(threshold,el,callback) {

    var /*$w = $(window),*/
        $w = el || $(window),
        th = threshold || 0,
        retina = isRetina(),
        attrib = retina ? "data-src-retina" : "data-src",
        images = this,
        loaded;
        //alert("I am retina : "+retina);

    this.one("unveil", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top + $w.scrollTop() -$w.offset().top,
          eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }
    function isRetina() {
       var query = '(-webkit-min-device-pixel-ratio: 1.5),\
                    (min--moz-device-pixel-ratio: 1.5),\
                    (-o-min-device-pixel-ratio: 3/2),\
                    (min-device-pixel-ratio: 1.5),\
                    (min-resolution: 144dpi),\
                    (min-resolution: 1.5dppx)';
       if (window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia(query).matches)) {
          return true;
       }
       return false;
      }

    $w.scroll(unveil);
    $w.resize(unveil);

    unveil();
    return this;

  };

})(window.jQuery || window.Zepto);
