/*
 * blueimp Gallery Fullscreen JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* global define, window, document */

;(function (factory) {
  'use strict'
  if (typeof define === 'function' && define.amd) {
    // Register as an anonymous AMD module:
    define([
      './blueimp-helper',
      './blueimp-gallery'
    ], factory)
  } else {
    // Browser globals:
    factory(
      window.blueimp.helper || window.jQuery,
      window.blueimp.Gallery
    )
  }
}(function ($, Gallery) {
  'use strict'

  $.extend(Gallery.prototype.options, {
    // Defines if the gallery should open in fullscreen mode:
    fullScreen: false
  })

  var initialize = Gallery.prototype.initialize
  var close = Gallery.prototype.close

  $.extend(Gallery.prototype, {
    getFullScreenElement: function () {
      return document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    },

    requestFullScreen: function (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },

    exitFullScreen: function () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    },

    initialize: function () {
      initialize.call(this)
      if (this.options.fullScreen && !this.getFullScreenElement()) {
        this.requestFullScreen(this.container[0])
      }
    },

    close: function () {
      if (this.getFullScreenElement() === this.container[0]) {
        this.exitFullScreen()
      }
      close.call(this)
    }

  })

  return Gallery
}))

/*
 * blueimp Gallery Indicator JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* global define, window, document */

;(function (factory) {
  'use strict'
  if (typeof define === 'function' && define.amd) {
    // Register as an anonymous AMD module:
    define([
      './blueimp-helper',
      './blueimp-gallery'
    ], factory)
  } else {
    // Browser globals:
    factory(
      window.blueimp.helper || window.jQuery,
      window.blueimp.Gallery
    )
  }
}(function ($, Gallery) {
  'use strict'

  $.extend(Gallery.prototype.options, {
    // The tag name, Id, element or querySelector of the indicator container:
    indicatorContainer: 'ol',
    // The class for the active indicator:
    activeIndicatorClass: 'active',
    // The list object property (or data attribute) with the thumbnail URL,
    // used as alternative to a thumbnail child element:
    thumbnailProperty: 'thumbnail',
    // Defines if the gallery indicators should display a thumbnail:
    thumbnailIndicators: true
  })

  var initSlides = Gallery.prototype.initSlides
  var addSlide = Gallery.prototype.addSlide
  var resetSlides = Gallery.prototype.resetSlides
  var handleClick = Gallery.prototype.handleClick
  var handleSlide = Gallery.prototype.handleSlide
  var handleClose = Gallery.prototype.handleClose

  $.extend(Gallery.prototype, {
    createIndicator: function (obj) {
      var indicator = this.indicatorPrototype.cloneNode(false)
      var title = this.getItemProperty(obj, this.options.titleProperty)
      var thumbnailProperty = this.options.thumbnailProperty
      var thumbnailUrl
      var thumbnail
      if (this.options.thumbnailIndicators) {
        if (thumbnailProperty) {
          thumbnailUrl = this.getItemProperty(obj, thumbnailProperty)
        }
        if (thumbnailUrl === undefined) {
          thumbnail = obj.getElementsByTagName && $(obj).find('img')[0]
          if (thumbnail) {
            thumbnailUrl = thumbnail.src
          }
        }
        if (thumbnailUrl) {
          indicator.style.backgroundImage = 'url("' + thumbnailUrl + '")'
        }
      }
      if (title) {
        indicator.title = title
      }
      return indicator
    },

    addIndicator: function (index) {
      if (this.indicatorContainer.length) {
        var indicator = this.createIndicator(this.list[index])
        indicator.setAttribute('data-index', index)
        this.indicatorContainer[0].appendChild(indicator)
        this.indicators.push(indicator)
      }
    },

    setActiveIndicator: function (index) {
      if (this.indicators) {
        if (this.activeIndicator) {
          this.activeIndicator
            .removeClass(this.options.activeIndicatorClass)
        }
        this.activeIndicator = $(this.indicators[index])
        this.activeIndicator
          .addClass(this.options.activeIndicatorClass)
      }
    },

    initSlides: function (reload) {
      if (!reload) {
        this.indicatorContainer = this.container.find(
          this.options.indicatorContainer
        )
        if (this.indicatorContainer.length) {
          this.indicatorPrototype = document.createElement('li')
          this.indicators = this.indicatorContainer[0].children
        }
      }
      initSlides.call(this, reload)
    },

    addSlide: function (index) {
      addSlide.call(this, index)
      this.addIndicator(index)
    },

    resetSlides: function () {
      resetSlides.call(this)
      this.indicatorContainer.empty()
      this.indicators = []
    },

    handleClick: function (event) {
      var target = event.target || event.srcElement
      var parent = target.parentNode
      if (parent === this.indicatorContainer[0]) {
        // Click on indicator element
        this.preventDefault(event)
        this.slide(this.getNodeIndex(target))
      } else if (parent.parentNode === this.indicatorContainer[0]) {
        // Click on indicator child element
        this.preventDefault(event)
        this.slide(this.getNodeIndex(parent))
      } else {
        return handleClick.call(this, event)
      }
    },

    handleSlide: function (index) {
      handleSlide.call(this, index)
      this.setActiveIndicator(index)
    },

    handleClose: function () {
      if (this.activeIndicator) {
        this.activeIndicator
          .removeClass(this.options.activeIndicatorClass)
      }
      handleClose.call(this)
    }

  })

  return Gallery
}))

!function(){"use strict";function t(t,e){var i;for(i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);return t}function e(t){if(!this||this.find!==e.prototype.find)return new e(t);if(this.length=0,t)if("string"==typeof t&&(t=this.find(t)),t.nodeType||t===t.window)this.length=1,this[0]=t;else{var i=t.length;for(this.length=i;i;)i-=1,this[i]=t[i]}}e.extend=t,e.contains=function(t,e){do if(e=e.parentNode,e===t)return!0;while(e);return!1},e.parseJSON=function(t){return window.JSON&&JSON.parse(t)},t(e.prototype,{find:function(t){var i=this[0]||document;return"string"==typeof t&&(t=i.querySelectorAll?i.querySelectorAll(t):"#"===t.charAt(0)?i.getElementById(t.slice(1)):i.getElementsByTagName(t)),new e(t)},hasClass:function(t){return!!this[0]&&new RegExp("(^|\\s+)"+t+"(\\s+|$)").test(this[0].className)},addClass:function(t){for(var e,i=this.length;i;){if(i-=1,e=this[i],!e.className)return e.className=t,this;if(this.hasClass(t))return this;e.className+=" "+t}return this},removeClass:function(t){for(var e,i=new RegExp("(^|\\s+)"+t+"(\\s+|$)"),s=this.length;s;)s-=1,e=this[s],e.className=e.className.replace(i," ");return this},on:function(t,e){for(var i,s,n=t.split(/\s+/);n.length;)for(t=n.shift(),i=this.length;i;)i-=1,s=this[i],s.addEventListener?s.addEventListener(t,e,!1):s.attachEvent&&s.attachEvent("on"+t,e);return this},off:function(t,e){for(var i,s,n=t.split(/\s+/);n.length;)for(t=n.shift(),i=this.length;i;)i-=1,s=this[i],s.removeEventListener?s.removeEventListener(t,e,!1):s.detachEvent&&s.detachEvent("on"+t,e);return this},empty:function(){for(var t,e=this.length;e;)for(e-=1,t=this[e];t.hasChildNodes();)t.removeChild(t.lastChild);return this},first:function(){return new e(this[0])}}),"function"==typeof define&&define.amd?define(function(){return e}):(window.blueimp=window.blueimp||{},window.blueimp.helper=e)}(),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper"],t):(window.blueimp=window.blueimp||{},window.blueimp.Gallery=t(window.blueimp.helper||window.jQuery))}(function(t){"use strict";function e(t,i){return void 0===document.body.style.maxHeight?null:this&&this.options===e.prototype.options?t&&t.length?(this.list=t,this.num=t.length,this.initOptions(i),void this.initialize()):void this.console.log("blueimp Gallery: No or empty list provided as first argument.",t):new e(t,i)}return t.extend(e.prototype,{options:{container:"#blueimp-gallery",slidesContainer:"div",titleElement:"h3",displayClass:"blueimp-gallery-display",controlsClass:"blueimp-gallery-controls",singleClass:"blueimp-gallery-single",leftEdgeClass:"blueimp-gallery-left",rightEdgeClass:"blueimp-gallery-right",playingClass:"blueimp-gallery-playing",slideClass:"slide",slideLoadingClass:"slide-loading",slideErrorClass:"slide-error",slideContentClass:"slide-content",toggleClass:"toggle",prevClass:"prev",nextClass:"next",closeClass:"close",playPauseClass:"play-pause",typeProperty:"type",titleProperty:"title",urlProperty:"href",srcsetProperty:"urlset",displayTransition:!0,clearSlides:!0,stretchImages:!1,toggleControlsOnReturn:!0,toggleControlsOnSlideClick:!0,toggleSlideshowOnSpace:!0,enableKeyboardNavigation:!0,closeOnEscape:!0,closeOnSlideClick:!0,closeOnSwipeUpOrDown:!0,emulateTouchEvents:!0,stopTouchEventsPropagation:!1,hidePageScrollbars:!0,disableScroll:!0,carousel:!1,continuous:!0,unloadElements:!0,startSlideshow:!1,slideshowInterval:5e3,index:0,preloadRange:2,transitionSpeed:400,slideshowTransitionSpeed:void 0,event:void 0,onopen:void 0,onopened:void 0,onslide:void 0,onslideend:void 0,onslidecomplete:void 0,onclose:void 0,onclosed:void 0},carouselOptions:{hidePageScrollbars:!1,toggleControlsOnReturn:!1,toggleSlideshowOnSpace:!1,enableKeyboardNavigation:!1,closeOnEscape:!1,closeOnSlideClick:!1,closeOnSwipeUpOrDown:!1,disableScroll:!1,startSlideshow:!0},console:window.console&&"function"==typeof window.console.log?window.console:{log:function(){}},support:function(e){function i(){var t,i,s=n.transition;document.body.appendChild(e),s&&(t=s.name.slice(0,-9)+"ransform",void 0!==e.style[t]&&(e.style[t]="translateZ(0)",i=window.getComputedStyle(e).getPropertyValue(s.prefix+"transform"),n.transform={prefix:s.prefix,name:t,translate:!0,translateZ:!!i&&"none"!==i})),void 0!==e.style.backgroundSize&&(n.backgroundSize={},e.style.backgroundSize="contain",n.backgroundSize.contain="contain"===window.getComputedStyle(e).getPropertyValue("background-size"),e.style.backgroundSize="cover",n.backgroundSize.cover="cover"===window.getComputedStyle(e).getPropertyValue("background-size")),document.body.removeChild(e)}var s,n={touch:void 0!==window.ontouchstart||window.DocumentTouch&&document instanceof DocumentTouch},o={webkitTransition:{end:"webkitTransitionEnd",prefix:"-webkit-"},MozTransition:{end:"transitionend",prefix:"-moz-"},OTransition:{end:"otransitionend",prefix:"-o-"},transition:{end:"transitionend",prefix:""}};for(s in o)if(o.hasOwnProperty(s)&&void 0!==e.style[s]){n.transition=o[s],n.transition.name=s;break}return document.body?i():t(document).on("DOMContentLoaded",i),n}(document.createElement("div")),requestAnimationFrame:window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame,initialize:function(){return this.initStartIndex(),this.initWidget()!==!1&&(this.initEventListeners(),this.onslide(this.index),this.ontransitionend(),void(this.options.startSlideshow&&this.play()))},slide:function(t,e){window.clearTimeout(this.timeout);var i,s,n,o=this.index;if(o!==t&&1!==this.num){if(e||(e=this.options.transitionSpeed),this.support.transform){for(this.options.continuous||(t=this.circle(t)),i=Math.abs(o-t)/(o-t),this.options.continuous&&(s=i,i=-this.positions[this.circle(t)]/this.slideWidth,i!==s&&(t=-i*this.num+t)),n=Math.abs(o-t)-1;n;)n-=1,this.move(this.circle((t>o?t:o)-n-1),this.slideWidth*i,0);t=this.circle(t),this.move(o,this.slideWidth*i,e),this.move(t,0,e),this.options.continuous&&this.move(this.circle(t-i),-(this.slideWidth*i),0)}else t=this.circle(t),this.animate(o*-this.slideWidth,t*-this.slideWidth,e);this.onslide(t)}},getIndex:function(){return this.index},getNumber:function(){return this.num},prev:function(){(this.options.continuous||this.index)&&this.slide(this.index-1)},next:function(){(this.options.continuous||this.index<this.num-1)&&this.slide(this.index+1)},play:function(t){var e=this;window.clearTimeout(this.timeout),this.interval=t||this.options.slideshowInterval,this.elements[this.index]>1&&(this.timeout=this.setTimeout(!this.requestAnimationFrame&&this.slide||function(t,i){e.animationFrameId=e.requestAnimationFrame.call(window,function(){e.slide(t,i)})},[this.index+1,this.options.slideshowTransitionSpeed],this.interval)),this.container.addClass(this.options.playingClass)},pause:function(){window.clearTimeout(this.timeout),this.interval=null,this.container.removeClass(this.options.playingClass)},add:function(t){var e;for(t.concat||(t=Array.prototype.slice.call(t)),this.list.concat||(this.list=Array.prototype.slice.call(this.list)),this.list=this.list.concat(t),this.num=this.list.length,this.num>2&&null===this.options.continuous&&(this.options.continuous=!0,this.container.removeClass(this.options.leftEdgeClass)),this.container.removeClass(this.options.rightEdgeClass).removeClass(this.options.singleClass),e=this.num-t.length;e<this.num;e+=1)this.addSlide(e),this.positionSlide(e);this.positions.length=this.num,this.initSlides(!0)},resetSlides:function(){this.slidesContainer.empty(),this.unloadAllSlides(),this.slides=[]},handleClose:function(){var t=this.options;this.destroyEventListeners(),this.pause(),this.container[0].style.display="none",this.container.removeClass(t.displayClass).removeClass(t.singleClass).removeClass(t.leftEdgeClass).removeClass(t.rightEdgeClass),t.hidePageScrollbars&&(document.body.style.overflow=this.bodyOverflowStyle),this.options.clearSlides&&this.resetSlides(),this.options.onclosed&&this.options.onclosed.call(this)},close:function(){function t(i){i.target===e.container[0]&&(e.container.off(e.support.transition.end,t),e.handleClose())}var e=this;this.options.onclose&&this.options.onclose.call(this),this.support.transition&&this.options.displayTransition?(this.container.on(this.support.transition.end,t),this.container.removeClass(this.options.displayClass)):this.handleClose()},circle:function(t){return(this.num+t%this.num)%this.num},move:function(t,e,i){this.translateX(t,e,i),this.positions[t]=e},translate:function(t,e,i,s){var n=this.slides[t].style,o=this.support.transition,r=this.support.transform;n[o.name+"Duration"]=s+"ms",n[r.name]="translate("+e+"px, "+i+"px)"+(r.translateZ?" translateZ(0)":"")},translateX:function(t,e,i){this.translate(t,e,0,i)},translateY:function(t,e,i){this.translate(t,0,e,i)},animate:function(t,e,i){if(!i)return void(this.slidesContainer[0].style.left=e+"px");var s=this,n=(new Date).getTime(),o=window.setInterval(function(){var r=(new Date).getTime()-n;return r>i?(s.slidesContainer[0].style.left=e+"px",s.ontransitionend(),void window.clearInterval(o)):void(s.slidesContainer[0].style.left=(e-t)*(Math.floor(r/i*100)/100)+t+"px")},4)},preventDefault:function(t){t.preventDefault?t.preventDefault():t.returnValue=!1},stopPropagation:function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0},onresize:function(){this.initSlides(!0)},onmousedown:function(t){t.which&&1===t.which&&"VIDEO"!==t.target.nodeName&&(t.preventDefault(),(t.originalEvent||t).touches=[{pageX:t.pageX,pageY:t.pageY}],this.ontouchstart(t))},onmousemove:function(t){this.touchStart&&((t.originalEvent||t).touches=[{pageX:t.pageX,pageY:t.pageY}],this.ontouchmove(t))},onmouseup:function(t){this.touchStart&&(this.ontouchend(t),delete this.touchStart)},onmouseout:function(e){if(this.touchStart){var i=e.target,s=e.relatedTarget;s&&(s===i||t.contains(i,s))||this.onmouseup(e)}},ontouchstart:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);var e=(t.originalEvent||t).touches[0];this.touchStart={x:e.pageX,y:e.pageY,time:Date.now()},this.isScrolling=void 0,this.touchDelta={}},ontouchmove:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);var e,i,s=(t.originalEvent||t).touches[0],n=(t.originalEvent||t).scale,o=this.index;if(!(s.length>1||n&&1!==n))if(this.options.disableScroll&&t.preventDefault(),this.touchDelta={x:s.pageX-this.touchStart.x,y:s.pageY-this.touchStart.y},e=this.touchDelta.x,void 0===this.isScrolling&&(this.isScrolling=this.isScrolling||Math.abs(e)<Math.abs(this.touchDelta.y)),this.isScrolling)this.options.closeOnSwipeUpOrDown&&this.translateY(o,this.touchDelta.y+this.positions[o],0);else for(t.preventDefault(),window.clearTimeout(this.timeout),this.options.continuous?i=[this.circle(o+1),o,this.circle(o-1)]:(this.touchDelta.x=e/=!o&&e>0||o===this.num-1&&e<0?Math.abs(e)/this.slideWidth+1:1,i=[o],o&&i.push(o-1),o<this.num-1&&i.unshift(o+1));i.length;)o=i.pop(),this.translateX(o,e+this.positions[o],0)},ontouchend:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);var e,i,s,n,o,r=this.index,l=this.options.transitionSpeed,a=this.slideWidth,h=Number(Date.now()-this.touchStart.time)<250,d=h&&Math.abs(this.touchDelta.x)>20||Math.abs(this.touchDelta.x)>a/2,c=!r&&this.touchDelta.x>0||r===this.num-1&&this.touchDelta.x<0,u=!d&&this.options.closeOnSwipeUpOrDown&&(h&&Math.abs(this.touchDelta.y)>20||Math.abs(this.touchDelta.y)>this.slideHeight/2);this.options.continuous&&(c=!1),e=this.touchDelta.x<0?-1:1,this.isScrolling?u?this.close():this.translateY(r,0,l):d&&!c?(i=r+e,s=r-e,n=a*e,o=-a*e,this.options.continuous?(this.move(this.circle(i),n,0),this.move(this.circle(r-2*e),o,0)):i>=0&&i<this.num&&this.move(i,n,0),this.move(r,this.positions[r]+n,l),this.move(this.circle(s),this.positions[this.circle(s)]+n,l),r=this.circle(s),this.onslide(r)):this.options.continuous?(this.move(this.circle(r-1),-a,l),this.move(r,0,l),this.move(this.circle(r+1),a,l)):(r&&this.move(r-1,-a,l),this.move(r,0,l),r<this.num-1&&this.move(r+1,a,l))},ontouchcancel:function(t){this.touchStart&&(this.ontouchend(t),delete this.touchStart)},ontransitionend:function(t){var e=this.slides[this.index];t&&e!==t.target||(this.interval&&this.play(),this.setTimeout(this.options.onslideend,[this.index,e]))},oncomplete:function(e){var i,s=e.target||e.srcElement,n=s&&s.parentNode;s&&n&&(i=this.getNodeIndex(n),t(n).removeClass(this.options.slideLoadingClass),"error"===e.type?(t(n).addClass(this.options.slideErrorClass),this.elements[i]=3):this.elements[i]=2,s.clientHeight>this.container[0].clientHeight&&(s.style.maxHeight=this.container[0].clientHeight),this.interval&&this.slides[this.index]===n&&this.play(),this.setTimeout(this.options.onslidecomplete,[i,n]))},onload:function(t){this.oncomplete(t)},onerror:function(t){this.oncomplete(t)},onkeydown:function(t){switch(t.which||t.keyCode){case 13:this.options.toggleControlsOnReturn&&(this.preventDefault(t),this.toggleControls());break;case 27:this.options.closeOnEscape&&(this.close(),t.stopImmediatePropagation());break;case 32:this.options.toggleSlideshowOnSpace&&(this.preventDefault(t),this.toggleSlideshow());break;case 37:this.options.enableKeyboardNavigation&&(this.preventDefault(t),this.prev());break;case 39:this.options.enableKeyboardNavigation&&(this.preventDefault(t),this.next())}},handleClick:function(e){function i(e){return t(n).hasClass(e)||t(o).hasClass(e)}var s=this.options,n=e.target||e.srcElement,o=n.parentNode;i(s.toggleClass)?(this.preventDefault(e),this.toggleControls()):i(s.prevClass)?(this.preventDefault(e),this.prev()):i(s.nextClass)?(this.preventDefault(e),this.next()):i(s.closeClass)?(this.preventDefault(e),this.close()):i(s.playPauseClass)?(this.preventDefault(e),this.toggleSlideshow()):o===this.slidesContainer[0]?s.closeOnSlideClick?(this.preventDefault(e),this.close()):s.toggleControlsOnSlideClick&&(this.preventDefault(e),this.toggleControls()):o.parentNode&&o.parentNode===this.slidesContainer[0]&&s.toggleControlsOnSlideClick&&(this.preventDefault(e),this.toggleControls())},onclick:function(t){return this.options.emulateTouchEvents&&this.touchDelta&&(Math.abs(this.touchDelta.x)>20||Math.abs(this.touchDelta.y)>20)?void delete this.touchDelta:this.handleClick(t)},updateEdgeClasses:function(t){t?this.container.removeClass(this.options.leftEdgeClass):this.container.addClass(this.options.leftEdgeClass),t===this.num-1?this.container.addClass(this.options.rightEdgeClass):this.container.removeClass(this.options.rightEdgeClass)},handleSlide:function(t){this.options.continuous||this.updateEdgeClasses(t),this.loadElements(t),this.options.unloadElements&&this.unloadElements(t),this.setTitle(t)},onslide:function(t){this.index=t,this.handleSlide(t),this.setTimeout(this.options.onslide,[t,this.slides[t]])},setTitle:function(t){var e=this.slides[t].firstChild.title,i=this.titleElement;i.length&&(this.titleElement.empty(),e&&i[0].appendChild(document.createTextNode(e)))},setTimeout:function(t,e,i){var s=this;return t&&window.setTimeout(function(){t.apply(s,e||[])},i||0)},imageFactory:function(e,i){function s(e){if(!n){if(e={type:e.type,target:o},!o.parentNode)return l.setTimeout(s,[e]);n=!0,t(a).off("load error",s),d&&"load"===e.type&&(o.style.background='url("'+h+'") center no-repeat',o.style.backgroundSize=d),i(e)}}var n,o,r,l=this,a=this.imagePrototype.cloneNode(!1),h=e,d=this.options.stretchImages;return"string"!=typeof h&&(h=this.getItemProperty(e,this.options.urlProperty),r=this.getItemProperty(e,this.options.titleProperty)),d===!0&&(d="contain"),d=this.support.backgroundSize&&this.support.backgroundSize[d]&&d,d?o=this.elementPrototype.cloneNode(!1):(o=a,a.draggable=!1),r&&(o.title=r),t(a).on("load error",s),a.src=h,o},createElement:function(e,i){var s=e&&this.getItemProperty(e,this.options.typeProperty),n=s&&this[s.split("/")[0]+"Factory"]||this.imageFactory,o=e&&n.call(this,e,i),r=this.getItemProperty(e,this.options.srcsetProperty);return o||(o=this.elementPrototype.cloneNode(!1),this.setTimeout(i,[{type:"error",target:o}])),r&&o.setAttribute("srcset",r),t(o).addClass(this.options.slideContentClass),o},loadElement:function(e){this.elements[e]||(this.slides[e].firstChild?this.elements[e]=t(this.slides[e]).hasClass(this.options.slideErrorClass)?3:2:(this.elements[e]=1,t(this.slides[e]).addClass(this.options.slideLoadingClass),this.slides[e].appendChild(this.createElement(this.list[e],this.proxyListener))))},loadElements:function(t){var e,i=Math.min(this.num,2*this.options.preloadRange+1),s=t;for(e=0;e<i;e+=1)s+=e*(e%2===0?-1:1),s=this.circle(s),this.loadElement(s)},unloadElements:function(t){var e,i;for(e in this.elements)this.elements.hasOwnProperty(e)&&(i=Math.abs(t-e),i>this.options.preloadRange&&i+this.options.preloadRange<this.num&&(this.unloadSlide(e),delete this.elements[e]))},addSlide:function(t){var e=this.slidePrototype.cloneNode(!1);e.setAttribute("data-index",t),this.slidesContainer[0].appendChild(e),this.slides.push(e)},positionSlide:function(t){var e=this.slides[t];e.style.width=this.slideWidth+"px",this.support.transform&&(e.style.left=t*-this.slideWidth+"px",this.move(t,this.index>t?-this.slideWidth:this.index<t?this.slideWidth:0,0))},initSlides:function(e){var i,s;for(e||(this.positions=[],this.positions.length=this.num,this.elements={},this.imagePrototype=document.createElement("img"),this.elementPrototype=document.createElement("div"),this.slidePrototype=document.createElement("div"),t(this.slidePrototype).addClass(this.options.slideClass),this.slides=this.slidesContainer[0].children,i=this.options.clearSlides||this.slides.length!==this.num),this.slideWidth=this.container[0].offsetWidth,this.slideHeight=this.container[0].offsetHeight,this.slidesContainer[0].style.width=this.num*this.slideWidth+"px",i&&this.resetSlides(),s=0;s<this.num;s+=1)i&&this.addSlide(s),this.positionSlide(s);this.options.continuous&&this.support.transform&&(this.move(this.circle(this.index-1),-this.slideWidth,0),this.move(this.circle(this.index+1),this.slideWidth,0)),this.support.transform||(this.slidesContainer[0].style.left=this.index*-this.slideWidth+"px")},unloadSlide:function(t){var e,i;e=this.slides[t],i=e.firstChild,null!==i&&e.removeChild(i)},unloadAllSlides:function(){var t,e;for(t=0,e=this.slides.length;t<e;t++)this.unloadSlide(t)},toggleControls:function(){var t=this.options.controlsClass;this.container.hasClass(t)?this.container.removeClass(t):this.container.addClass(t)},toggleSlideshow:function(){this.interval?this.pause():this.play()},getNodeIndex:function(t){return parseInt(t.getAttribute("data-index"),10)},getNestedProperty:function(t,e){return e.replace(/\[(?:'([^']+)'|"([^"]+)"|(\d+))\]|(?:(?:^|\.)([^\.\[]+))/g,function(e,i,s,n,o){var r=o||i||s||n&&parseInt(n,10);e&&t&&(t=t[r])}),t},getDataProperty:function(e,i){if(e.getAttribute){var s=e.getAttribute("data-"+i.replace(/([A-Z])/g,"-$1").toLowerCase());if("string"==typeof s){if(/^(true|false|null|-?\d+(\.\d+)?|\{[\s\S]*\}|\[[\s\S]*\])$/.test(s))try{return t.parseJSON(s)}catch(t){}return s}}},getItemProperty:function(t,e){var i=t[e];return void 0===i&&(i=this.getDataProperty(t,e),void 0===i&&(i=this.getNestedProperty(t,e))),i},initStartIndex:function(){var t,e=this.options.index,i=this.options.urlProperty;if(e&&"number"!=typeof e)for(t=0;t<this.num;t+=1)if(this.list[t]===e||this.getItemProperty(this.list[t],i)===this.getItemProperty(e,i)){e=t;break}this.index=this.circle(parseInt(e,10)||0)},initEventListeners:function(){function e(t){var e=i.support.transition&&i.support.transition.end===t.type?"transitionend":t.type;i["on"+e](t)}var i=this,s=this.slidesContainer;t(window).on("resize",e),t(document.body).on("keydown",e),this.container.on("click",e),this.support.touch?s.on("touchstart touchmove touchend touchcancel",e):this.options.emulateTouchEvents&&this.support.transition&&s.on("mousedown mousemove mouseup mouseout",e),this.support.transition&&s.on(this.support.transition.end,e),this.proxyListener=e},destroyEventListeners:function(){var e=this.slidesContainer,i=this.proxyListener;t(window).off("resize",i),t(document.body).off("keydown",i),this.container.off("click",i),this.support.touch?e.off("touchstart touchmove touchend touchcancel",i):this.options.emulateTouchEvents&&this.support.transition&&e.off("mousedown mousemove mouseup mouseout",i),this.support.transition&&e.off(this.support.transition.end,i)},handleOpen:function(){this.options.onopened&&this.options.onopened.call(this)},initWidget:function(){function e(t){t.target===i.container[0]&&(i.container.off(i.support.transition.end,e),i.handleOpen())}var i=this;return this.container=t(this.options.container),this.container.length?(this.slidesContainer=this.container.find(this.options.slidesContainer).first(),this.slidesContainer.length?(this.titleElement=this.container.find(this.options.titleElement).first(),1===this.num&&this.container.addClass(this.options.singleClass),this.options.onopen&&this.options.onopen.call(this),this.support.transition&&this.options.displayTransition?this.container.on(this.support.transition.end,e):this.handleOpen(),this.options.hidePageScrollbars&&(this.bodyOverflowStyle=document.body.style.overflow,document.body.style.overflow="hidden"),this.container[0].style.display="block",this.initSlides(),void this.container.addClass(this.options.displayClass)):(this.console.log("blueimp Gallery: Slides container not found.",this.options.slidesContainer),!1)):(this.console.log("blueimp Gallery: Widget container not found.",this.options.container),!1)},initOptions:function(e){this.options=t.extend({},this.options),(e&&e.carousel||this.options.carousel&&(!e||e.carousel!==!1))&&t.extend(this.options,this.carouselOptions),t.extend(this.options,e),this.num<3&&(this.options.continuous=!!this.options.continuous&&null),this.support.transition||(this.options.emulateTouchEvents=!1),this.options.event&&this.preventDefault(this.options.event)}}),e}),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper","./blueimp-gallery"],t):t(window.blueimp.helper||window.jQuery,window.blueimp.Gallery)}(function(t,e){"use strict";t.extend(e.prototype.options,{fullScreen:!1});var i=e.prototype.initialize,s=e.prototype.close;return t.extend(e.prototype,{getFullScreenElement:function(){return document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement},requestFullScreen:function(t){t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():t.mozRequestFullScreen?t.mozRequestFullScreen():t.msRequestFullscreen&&t.msRequestFullscreen()},exitFullScreen:function(){document.exitFullscreen?document.exitFullscreen():document.webkitCancelFullScreen?document.webkitCancelFullScreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.msExitFullscreen&&document.msExitFullscreen()},initialize:function(){i.call(this),this.options.fullScreen&&!this.getFullScreenElement()&&this.requestFullScreen(this.container[0])},close:function(){this.getFullScreenElement()===this.container[0]&&this.exitFullScreen(),s.call(this)}}),e}),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper","./blueimp-gallery"],t):t(window.blueimp.helper||window.jQuery,window.blueimp.Gallery)}(function(t,e){"use strict";t.extend(e.prototype.options,{indicatorContainer:"ol",activeIndicatorClass:"active",thumbnailProperty:"thumbnail",thumbnailIndicators:!0});var i=e.prototype.initSlides,s=e.prototype.addSlide,n=e.prototype.resetSlides,o=e.prototype.handleClick,r=e.prototype.handleSlide,l=e.prototype.handleClose;return t.extend(e.prototype,{createIndicator:function(e){var i,s,n=this.indicatorPrototype.cloneNode(!1),o=this.getItemProperty(e,this.options.titleProperty),r=this.options.thumbnailProperty;return this.options.thumbnailIndicators&&(r&&(i=this.getItemProperty(e,r)),void 0===i&&(s=e.getElementsByTagName&&t(e).find("img")[0],s&&(i=s.src)),i&&(n.style.backgroundImage='url("'+i+'")')),o&&(n.title=o),n},addIndicator:function(t){if(this.indicatorContainer.length){var e=this.createIndicator(this.list[t]);e.setAttribute("data-index",t),this.indicatorContainer[0].appendChild(e),this.indicators.push(e)}},setActiveIndicator:function(e){this.indicators&&(this.activeIndicator&&this.activeIndicator.removeClass(this.options.activeIndicatorClass),this.activeIndicator=t(this.indicators[e]),this.activeIndicator.addClass(this.options.activeIndicatorClass))},initSlides:function(t){t||(this.indicatorContainer=this.container.find(this.options.indicatorContainer),this.indicatorContainer.length&&(this.indicatorPrototype=document.createElement("li"),this.indicators=this.indicatorContainer[0].children)),i.call(this,t)},addSlide:function(t){s.call(this,t),this.addIndicator(t)},resetSlides:function(){n.call(this),this.indicatorContainer.empty(),this.indicators=[]},handleClick:function(t){var e=t.target||t.srcElement,i=e.parentNode;if(i===this.indicatorContainer[0])this.preventDefault(t),this.slide(this.getNodeIndex(e));else{if(i.parentNode!==this.indicatorContainer[0])return o.call(this,t);this.preventDefault(t),this.slide(this.getNodeIndex(i))}},handleSlide:function(t){r.call(this,t),this.setActiveIndicator(t)},handleClose:function(){this.activeIndicator&&this.activeIndicator.removeClass(this.options.activeIndicatorClass),l.call(this)}}),e}),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper","./blueimp-gallery"],t):t(window.blueimp.helper||window.jQuery,window.blueimp.Gallery)}(function(t,e){"use strict";t.extend(e.prototype.options,{videoContentClass:"video-content",videoLoadingClass:"video-loading",videoPlayingClass:"video-playing",videoPosterProperty:"poster",videoSourcesProperty:"sources"});var i=e.prototype.handleSlide;return t.extend(e.prototype,{handleSlide:function(t){i.call(this,t),this.playingVideo&&this.playingVideo.pause()},videoFactory:function(e,i,s){var n,o,r,l,a,h=this,d=this.options,c=this.elementPrototype.cloneNode(!1),u=t(c),p=[{type:"error",target:c}],m=s||document.createElement("video"),y=this.getItemProperty(e,d.urlProperty),f=this.getItemProperty(e,d.typeProperty),g=this.getItemProperty(e,d.titleProperty),v=this.getItemProperty(e,d.videoPosterProperty),C=this.getItemProperty(e,d.videoSourcesProperty);if(u.addClass(d.videoContentClass),g&&(c.title=g),m.canPlayType)if(y&&f&&m.canPlayType(f))m.src=y;else if(C)for(;C.length;)if(o=C.shift(),y=this.getItemProperty(o,d.urlProperty),f=this.getItemProperty(o,d.typeProperty),y&&f&&m.canPlayType(f)){m.src=y;break}return v&&(m.poster=v,n=this.imagePrototype.cloneNode(!1),t(n).addClass(d.toggleClass),n.src=v,n.draggable=!1,c.appendChild(n)),r=document.createElement("a"),r.setAttribute("target","_blank"),s||r.setAttribute("download",g),r.href=y,m.src&&(m.controls=!0,(s||t(m)).on("error",function(){h.setTimeout(i,p)}).on("pause",function(){m.seeking||(l=!1,u.removeClass(h.options.videoLoadingClass).removeClass(h.options.videoPlayingClass),a&&h.container.addClass(h.options.controlsClass),delete h.playingVideo,h.interval&&h.play())}).on("playing",function(){l=!1,u.removeClass(h.options.videoLoadingClass).addClass(h.options.videoPlayingClass),h.container.hasClass(h.options.controlsClass)?(a=!0,h.container.removeClass(h.options.controlsClass)):a=!1}).on("play",function(){window.clearTimeout(h.timeout),l=!0,u.addClass(h.options.videoLoadingClass),h.playingVideo=m}),t(r).on("click",function(t){h.preventDefault(t),l?m.pause():m.play()}),c.appendChild(s&&s.element||m)),c.appendChild(r),this.setTimeout(i,[{type:"load",target:c}]),c}}),e}),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper","./blueimp-gallery-video"],t):t(window.blueimp.helper||window.jQuery,window.blueimp.Gallery)}(function(t,e){"use strict";if(!window.postMessage)return e;t.extend(e.prototype.options,{vimeoVideoIdProperty:"vimeo",vimeoPlayerUrl:"//player.vimeo.com/video/VIDEO_ID?api=1&player_id=PLAYER_ID",vimeoPlayerIdPrefix:"vimeo-player-",vimeoClickToPlay:!0});var i=e.prototype.textFactory||e.prototype.imageFactory,s=function(t,e,i,s){this.url=t,this.videoId=e,this.playerId=i,this.clickToPlay=s,this.element=document.createElement("div"),this.listeners={}},n=0;return t.extend(s.prototype,{canPlayType:function(){return!0},on:function(t,e){return this.listeners[t]=e,this},loadAPI:function(){function e(){!s&&n.playOnReady&&n.play(),s=!0}for(var i,s,n=this,o="//f.vimeocdn.com/js/froogaloop2.min.js",r=document.getElementsByTagName("script"),l=r.length;l;)if(l-=1,r[l].src===o){i=r[l];break}i||(i=document.createElement("script"),i.src=o),t(i).on("load",e),r[0].parentNode.insertBefore(i,r[0]),/loaded|complete/.test(i.readyState)&&e()},onReady:function(){var t=this;this.ready=!0,this.player.addEvent("play",function(){t.hasPlayed=!0,t.onPlaying()}),this.player.addEvent("pause",function(){t.onPause()}),this.player.addEvent("finish",function(){t.onPause()}),this.playOnReady&&this.play()},onPlaying:function(){this.playStatus<2&&(this.listeners.playing(),this.playStatus=2)},onPause:function(){this.listeners.pause(),delete this.playStatus},insertIframe:function(){var t=document.createElement("iframe");t.src=this.url.replace("VIDEO_ID",this.videoId).replace("PLAYER_ID",this.playerId),t.id=this.playerId,this.element.parentNode.replaceChild(t,this.element),this.element=t},play:function(){var t=this;this.playStatus||(this.listeners.play(),this.playStatus=1),this.ready?!this.hasPlayed&&(this.clickToPlay||window.navigator&&/iP(hone|od|ad)/.test(window.navigator.platform))?this.onPlaying():this.player.api("play"):(this.playOnReady=!0,window.$f?this.player||(this.insertIframe(),this.player=$f(this.element),this.player.addEvent("ready",function(){t.onReady()})):this.loadAPI())},pause:function(){this.ready?this.player.api("pause"):this.playStatus&&(delete this.playOnReady,this.listeners.pause(),delete this.playStatus)}}),t.extend(e.prototype,{VimeoPlayer:s,textFactory:function(t,e){var o=this.options,r=this.getItemProperty(t,o.vimeoVideoIdProperty);return r?(void 0===this.getItemProperty(t,o.urlProperty)&&(t[o.urlProperty]="//vimeo.com/"+r),n+=1,this.videoFactory(t,e,new s(o.vimeoPlayerUrl,r,o.vimeoPlayerIdPrefix+n,o.vimeoClickToPlay))):i.call(this,t,e)}}),e}),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper","./blueimp-gallery-video"],t):t(window.blueimp.helper||window.jQuery,window.blueimp.Gallery)}(function(t,e){"use strict";if(!window.postMessage)return e;t.extend(e.prototype.options,{youTubeVideoIdProperty:"youtube",youTubePlayerVars:{wmode:"transparent"},youTubeClickToPlay:!0});var i=e.prototype.textFactory||e.prototype.imageFactory,s=function(t,e,i){this.videoId=t,this.playerVars=e,this.clickToPlay=i,this.element=document.createElement("div"),this.listeners={}};return t.extend(s.prototype,{canPlayType:function(){return!0},on:function(t,e){return this.listeners[t]=e,this},loadAPI:function(){var t,e=this,i=window.onYouTubeIframeAPIReady,s="//www.youtube.com/iframe_api",n=document.getElementsByTagName("script"),o=n.length;for(window.onYouTubeIframeAPIReady=function(){i&&i.apply(this),e.playOnReady&&e.play()};o;)if(o-=1,n[o].src===s)return;t=document.createElement("script"),t.src=s,n[0].parentNode.insertBefore(t,n[0])},onReady:function(){this.ready=!0,this.playOnReady&&this.play()},onPlaying:function(){this.playStatus<2&&(this.listeners.playing(),this.playStatus=2)},onPause:function(){e.prototype.setTimeout.call(this,this.checkSeek,null,2e3)},checkSeek:function(){this.stateChange!==YT.PlayerState.PAUSED&&this.stateChange!==YT.PlayerState.ENDED||(this.listeners.pause(),delete this.playStatus)},onStateChange:function(t){switch(t.data){case YT.PlayerState.PLAYING:this.hasPlayed=!0,this.onPlaying();break;case YT.PlayerState.PAUSED:case YT.PlayerState.ENDED:this.onPause()}this.stateChange=t.data},onError:function(t){this.listeners.error(t)},play:function(){var t=this;this.playStatus||(this.listeners.play(),this.playStatus=1),this.ready?!this.hasPlayed&&(this.clickToPlay||window.navigator&&/iP(hone|od|ad)/.test(window.navigator.platform))?this.onPlaying():this.player.playVideo():(this.playOnReady=!0,
window.YT&&YT.Player?this.player||(this.player=new YT.Player(this.element,{videoId:this.videoId,playerVars:this.playerVars,events:{onReady:function(){t.onReady()},onStateChange:function(e){t.onStateChange(e)},onError:function(e){t.onError(e)}}})):this.loadAPI())},pause:function(){this.ready?this.player.pauseVideo():this.playStatus&&(delete this.playOnReady,this.listeners.pause(),delete this.playStatus)}}),t.extend(e.prototype,{YouTubePlayer:s,textFactory:function(t,e){var n=this.options,o=this.getItemProperty(t,n.youTubeVideoIdProperty);return o?(void 0===this.getItemProperty(t,n.urlProperty)&&(t[n.urlProperty]="//www.youtube.com/watch?v="+o),void 0===this.getItemProperty(t,n.videoPosterProperty)&&(t[n.videoPosterProperty]="//img.youtube.com/vi/"+o+"/maxresdefault.jpg"),this.videoFactory(t,e,new s(o,n.youTubePlayerVars,n.youTubeClickToPlay))):i.call(this,t,e)}}),e});
//# sourceMappingURL=blueimp-gallery.min.js.map
/*!
 * jquery.okayNav.js 2.0.4 (https://github.com/VPenkov/okayNav)
 * Author: Vergil Penkov (http://vergilpenkov.com/)
 * MIT license: https://opensource.org/licenses/MIT
 */

;
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory); // AMD
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function(root, jQuery) { // Node/CommonJS
            if (jQuery === undefined) {
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        factory(jQuery); // Browser globals
    }
}(function($) {
    // Defaults

    var okayNav = 'okayNav',
        defaults = {
            parent: '', // will call nav's parent() by default
            toggle_icon_class: 'okayNav__menu-toggle',
            toggle_icon_content: '<span /><span /><span />',
            align_right: true, // If false, the menu and the kebab icon will be on the left
            swipe_enabled: true, // If true, you'll be able to swipe left/right to open the navigation
            threshold: 50, // Nav will auto open/close if swiped >= this many percent
            resize_delay: 10, // When resizing the window, okayNav can throttle its recalculations if enabled. Setting this to 50-250 will improve performance but make okayNav less accurate.
            beforeOpen: function() {}, // Will trigger before the nav gets opened
            afterOpen: function() {}, // Will trigger after the nav gets opened
            beforeClose: function() {}, // Will trigger before the nav gets closed
            afterClose: function() {}, // Will trigger after the nav gets closed
            itemHidden: function() {},
            itemDisplayed: function() {}
        };

    // Begin
    function Plugin(element, options) {
        var self = this;
        this.options = $.extend({}, defaults, options);

        self.navigation = $(element);
        self.document = $(document);
        self.window = $(window);

        this.options.parent == '' ? this.options.parent = self.navigation.parent() : '';

        self.nav_open = false; // Store the state of the hidden nav
        self.parent_full_width = 0;

        // Swipe stuff
        self.radCoef = 180 / Math.PI;
        self.sTouch = {
            x: 0,
            y: 0
        };
        self.cTouch = {
            x: 0,
            y: 0
        };
        self.sTime = 0;
        self.nav_position = 0;
        self.percent_open = 0;
        self.nav_moving = false;


        self.init();
    }

    $.extend(Plugin.prototype, {

        init: function() {
            var self = this;

            $('body').addClass('okayNav-loaded');

            // Add classes
            self.navigation
                .addClass('okayNav loaded')
                .children('ul').addClass('okayNav__nav--visible');

            // Append elements
            if (self.options.align_right) {
                self.navigation
                    .append('<ul class="okayNav__nav--invisible transition-enabled nav-right" />')
                    .append('<a href="#" class="' + self.options.toggle_icon_class + ' okay-invisible">' + self.options.toggle_icon_content + '</a>')
            } else {
                self.navigation
                    .prepend('<ul class="okayNav__nav--invisible transition-enabled nav-left" />')
                    .prepend('<a href="#" class="' + self.options.toggle_icon_class + ' okay-invisible">' + self.options.toggle_icon_content + '</a>')
            }

            // Cache new elements for further use
            self.nav_visible = self.navigation.children('.okayNav__nav--visible');
            self.nav_invisible = self.navigation.children('.okayNav__nav--invisible');
            self.toggle_icon = self.navigation.children('.' + self.options.toggle_icon_class);

            self.toggle_icon_width = self.toggle_icon.outerWidth(true);
            self.default_width = self.getChildrenWidth(self.navigation);
            self.parent_full_width = $(self.options.parent).outerWidth(true);
            self.last_visible_child_width = 0; // We'll define this later

            // Events are up once everything is set
            self.initEvents();

            // Trim white spaces between visible nav elements
            self.nav_visible.contents().filter(function() {
                return this.nodeType = Node.TEXT_NODE && /\S/.test(this.nodeValue) === false;
            }).remove();

            if (self.options.swipe_enabled == true) self.initSwipeEvents();
        },

        initEvents: function() {
            var self = this;
            // Toggle hidden nav when hamburger icon is clicked and
            // Collapse hidden nav on click outside the header
            self.document.on('click.okayNav', function(e) {
                var _target = $(e.target);

                if (self.nav_open === true && _target.closest('.okayNav').length == 0)
                    self.closeInvisibleNav();

                if (e.target === self.toggle_icon.get(0)) {
                    e.preventDefault();
                    self.toggleInvisibleNav();
                }
            });

            var optimizeResize = self._debounce(function() {
                self.recalcNav()
            }, self.options.resize_delay);
            self.window.on('load.okayNav resize.okayNav', optimizeResize);
        },

        initSwipeEvents: function() {
            var self = this;
            self.document
                .on('touchstart.okayNav', function(e) {
                    self.nav_invisible.removeClass('transition-enabled');

                    //Trigger only on touch with one finger
                    if (e.originalEvent.touches.length == 1) {
                        var touch = e.originalEvent.touches[0];
                        if (
                            ((touch.pageX < 25 && self.options.align_right == false) ||
                                (touch.pageX > ($(self.options.parent).outerWidth(true) - 25) &&
                                    self.options.align_right == true)) ||
                            self.nav_open === true) {

                            self.sTouch.x = self.cTouch.x = touch.pageX;
                            self.sTouch.y = self.cTouch.y = touch.pageY;
                            self.sTime = Date.now();
                        }

                    }
                })
                .on('touchmove.okayNav', function(e) {
                    var touch = e.originalEvent.touches[0];
                    self._triggerMove(touch.pageX, touch.pageY);
                    self.nav_moving = true;
                })
                .on('touchend.okayNav', function(e) {
                    self.sTouch = {
                        x: 0,
                        y: 0
                    };
                    self.cTouch = {
                        x: 0,
                        y: 0
                    };
                    self.sTime = 0;

                    //Close menu if not swiped enough
                    if (self.percent_open > (100 - self.options.threshold)) {
                        self.nav_position = 0;
                        self.closeInvisibleNav();

                    } else if (self.nav_moving == true) {
                        self.nav_position = self.nav_invisible.width();
                        self.openInvisibleNav();
                    }

                    self.nav_moving = false;

                    self.nav_invisible.addClass('transition-enabled');
                });
        },

        _getDirection: function(dx) {
            if (this.options.align_right) {
                return (dx > 0) ? -1 : 1;
            } else {
                return (dx < 0) ? -1 : 1;
            }
        },

        _triggerMove: function(x, y) {
            var self = this;

            self.cTouch.x = x;
            self.cTouch.y = y;

            var currentTime = Date.now();
            var dx = (self.cTouch.x - self.sTouch.x);
            var dy = (self.cTouch.y - self.sTouch.y);

            var opposing = dy * dy;
            var distance = Math.sqrt(dx * dx + opposing);
            //Length of the opposing side of the 90deg triagle
            var dOpposing = Math.sqrt(opposing);

            var angle = Math.asin(Math.sin(dOpposing / distance)) * self.radCoef;
            var speed = distance / (currentTime - self.sTime);

            //Set new start position
            self.sTouch.x = x;
            self.sTouch.y = y;

            //Remove false swipes
            if (angle < 20) {
                var dir = self._getDirection(dx);

                var newPos = self.nav_position + dir * distance;
                var menuWidth = self.nav_invisible.width();
                var overflow = 0;


                if (newPos < 0) {
                    overflow = -newPos;
                } else if (newPos > menuWidth) {
                    overflow = menuWidth - newPos;
                }

                var size = menuWidth - (self.nav_position + dir * distance + overflow);
                var threshold = (size / menuWidth) * 100;

                //Set new position and threshold
                self.nav_position += dir * distance + overflow;
                self.percent_open = threshold;

                self.nav_invisible.css('transform', 'translateX(' + (self.options.align_right ? 1 : -1) * threshold + '%)');
            }

        },

        /*
         * A few methods to allow working with elements
         */
        getParent: function() {
            return this.options.parent;
        },

        getVisibleNav: function() { // Visible navigation
            return this.nav_visible;
        },

        getInvisibleNav: function() { // Hidden behind the kebab icon
            return this.nav_invisible;
        },

        getNavToggleIcon: function() { // Kebab icon
            return this.toggle_icon;
        },

        /*
         * Operations
         */
        _debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        openInvisibleNav: function() {
            var self = this;

            !self.options.enable_swipe ? self.options.beforeOpen.call() : '';

            self.toggle_icon.addClass('icon--active');
            self.nav_invisible.addClass('nav-open');
            self.nav_open = true;
            self.nav_invisible.css({
                
            });

            self.options.afterOpen.call();
        },

        closeInvisibleNav: function() {
            var self = this;
            !self.options.enable_swipe ? self.options.beforeClose.call() : '';

            self.toggle_icon.removeClass('icon--active');
            self.nav_invisible.removeClass('nav-open');

            if (self.options.align_right) {
                self.nav_invisible.css({
                    
                });
            } else {
                self.nav_invisible.css({
                    
                });
            }
            self.nav_open = false;

            self.options.afterClose.call();
        },

        toggleInvisibleNav: function() {
            var self = this;
            if (!self.nav_open) {
                self.openInvisibleNav();
            } else {
                self.closeInvisibleNav();
            }
        },


        /*
         * Math stuff
         */
        getChildrenWidth: function(el) {
            var children_width = 0;
            var children = $(el).children();
            for (var i = 0; i < children.length; i++) {
                children_width += $(children[i]).outerWidth(true);
            };

            return children_width;
        },

        getVisibleItemCount: function() {
            return $('li', this.nav_visible).length;
        },
        getHiddenItemCount: function() {
            return $('li', this.nav_invisible).length;
        },

        recalcNav: function() {
            var self = this;
            var wrapper_width = $(self.options.parent).outerWidth(true),
                space_taken = self.getChildrenWidth(self.options.parent),
                nav_full_width = self.navigation.outerWidth(true),
                visible_nav_items = self.getVisibleItemCount(),
                collapse_width = self.nav_visible.outerWidth(true) + self.toggle_icon_width,
                expand_width = space_taken + self.last_visible_child_width + self.toggle_icon_width,
                expandAll_width = space_taken - nav_full_width + self.default_width;

            if (wrapper_width > expandAll_width) {
                self._expandAllItems();
                self.toggle_icon.addClass('okay-invisible');
                return;
            }

            if (visible_nav_items > 0 &&
                nav_full_width <= collapse_width &&
                wrapper_width <= expand_width) {
                self._collapseNavItem();
            }

            if (wrapper_width > expand_width + self.toggle_icon_width + 15) {
                self._expandNavItem();
            }


            // Hide the kebab icon if no items are hidden
            self.getHiddenItemCount() == 0 ?
                self.toggle_icon.addClass('okay-invisible') :
                self.toggle_icon.removeClass('okay-invisible');
        },

        _collapseNavItem: function() {
            var self = this;
            var $last_child = $('li:last-child', self.nav_visible);
            self.last_visible_child_width = $last_child.outerWidth(true);
            self.document.trigger('okayNav:collapseItem', $last_child);
            $last_child.detach().prependTo(self.nav_invisible);
            self.options.itemHidden.call();
            // All nav items are visible by default
            // so we only need recursion when collapsing

            self.recalcNav();
        },

        _expandNavItem: function() {
            var self = this;
            var $first = $('li:first-child', self.nav_invisible);
            self.document.trigger('okayNav:expandItem', $first);
            $first.detach().appendTo(self.nav_visible);
            self.options.itemDisplayed.call();
        },

        _expandAllItems: function() {
            var self = this;
            $('li', self.nav_invisible).detach().appendTo(self.nav_visible);
            self.options.itemDisplayed.call();
        },

        _collapseAllItems: function() {
            var self = this;
            $('li', self.nav_visible).detach().appendTo(self.nav_invisible);
            self.options.itemHidden.call();
        },

        destroy: function() {
            var self = this;
            $('li', self.nav_invisible).appendTo(self.nav_visible);
            self.nav_invisible.remove();
            self.nav_visible.removeClass('okayNav__nav--visible');
            self.toggle_icon.remove();

            self.document.unbind('.okayNav');
            self.window.unbind('.okayNav');
        }

    });

    // Plugin wrapper
    $.fn[okayNav] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + okayNav)) {
                    $.data(this, 'plugin_' + okayNav, new Plugin(this, options));
                }
            });

        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            var returns;
            this.each(function() {
                var instance = $.data(this, 'plugin_' + okayNav);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }

                if (options === 'destroy') {
                    $.data(this, 'plugin_' + okayNav, null);
                }
            });

            return returns !== undefined ? returns : this;
        }
    };
}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsdWVpbXAtZ2FsbGVyeS1mdWxsc2NyZWVuLmpzIiwiYmx1ZWltcC1nYWxsZXJ5LWluZGljYXRvci5qcyIsImJsdWVpbXAtZ2FsbGVyeS5taW4uanMiLCJqcXVlcnkub2theU5hdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0pBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogYmx1ZWltcCBHYWxsZXJ5IEZ1bGxzY3JlZW4gSlNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9ibHVlaW1wL0dhbGxlcnlcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMywgU2ViYXN0aWFuIFRzY2hhblxuICogaHR0cHM6Ly9ibHVlaW1wLm5ldFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKi9cblxuLyogZ2xvYmFsIGRlZmluZSwgd2luZG93LCBkb2N1bWVudCAqL1xuXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICd1c2Ugc3RyaWN0J1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIEFNRCBtb2R1bGU6XG4gICAgZGVmaW5lKFtcbiAgICAgICcuL2JsdWVpbXAtaGVscGVyJyxcbiAgICAgICcuL2JsdWVpbXAtZ2FsbGVyeSdcbiAgICBdLCBmYWN0b3J5KVxuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsczpcbiAgICBmYWN0b3J5KFxuICAgICAgd2luZG93LmJsdWVpbXAuaGVscGVyIHx8IHdpbmRvdy5qUXVlcnksXG4gICAgICB3aW5kb3cuYmx1ZWltcC5HYWxsZXJ5XG4gICAgKVxuICB9XG59KGZ1bmN0aW9uICgkLCBHYWxsZXJ5KSB7XG4gICd1c2Ugc3RyaWN0J1xuXG4gICQuZXh0ZW5kKEdhbGxlcnkucHJvdG90eXBlLm9wdGlvbnMsIHtcbiAgICAvLyBEZWZpbmVzIGlmIHRoZSBnYWxsZXJ5IHNob3VsZCBvcGVuIGluIGZ1bGxzY3JlZW4gbW9kZTpcbiAgICBmdWxsU2NyZWVuOiBmYWxzZVxuICB9KVxuXG4gIHZhciBpbml0aWFsaXplID0gR2FsbGVyeS5wcm90b3R5cGUuaW5pdGlhbGl6ZVxuICB2YXIgY2xvc2UgPSBHYWxsZXJ5LnByb3RvdHlwZS5jbG9zZVxuXG4gICQuZXh0ZW5kKEdhbGxlcnkucHJvdG90eXBlLCB7XG4gICAgZ2V0RnVsbFNjcmVlbkVsZW1lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fFxuICAgICAgZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQgfHxcbiAgICAgIGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8XG4gICAgICBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbGVtZW50XG4gICAgfSxcblxuICAgIHJlcXVlc3RGdWxsU2NyZWVuOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgaWYgKGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbigpXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgICBlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4oKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBleGl0RnVsbFNjcmVlbjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKSB7XG4gICAgICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKClcbiAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICBkb2N1bWVudC53ZWJraXRDYW5jZWxGdWxsU2NyZWVuKClcbiAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICBkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKClcbiAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbikge1xuICAgICAgICBkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKClcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgaW5pdGlhbGl6ZS5jYWxsKHRoaXMpXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmZ1bGxTY3JlZW4gJiYgIXRoaXMuZ2V0RnVsbFNjcmVlbkVsZW1lbnQoKSkge1xuICAgICAgICB0aGlzLnJlcXVlc3RGdWxsU2NyZWVuKHRoaXMuY29udGFpbmVyWzBdKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuZ2V0RnVsbFNjcmVlbkVsZW1lbnQoKSA9PT0gdGhpcy5jb250YWluZXJbMF0pIHtcbiAgICAgICAgdGhpcy5leGl0RnVsbFNjcmVlbigpXG4gICAgICB9XG4gICAgICBjbG9zZS5jYWxsKHRoaXMpXG4gICAgfVxuXG4gIH0pXG5cbiAgcmV0dXJuIEdhbGxlcnlcbn0pKVxuIiwiLypcbiAqIGJsdWVpbXAgR2FsbGVyeSBJbmRpY2F0b3IgSlNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9ibHVlaW1wL0dhbGxlcnlcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMywgU2ViYXN0aWFuIFRzY2hhblxuICogaHR0cHM6Ly9ibHVlaW1wLm5ldFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKi9cblxuLyogZ2xvYmFsIGRlZmluZSwgd2luZG93LCBkb2N1bWVudCAqL1xuXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICd1c2Ugc3RyaWN0J1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIEFNRCBtb2R1bGU6XG4gICAgZGVmaW5lKFtcbiAgICAgICcuL2JsdWVpbXAtaGVscGVyJyxcbiAgICAgICcuL2JsdWVpbXAtZ2FsbGVyeSdcbiAgICBdLCBmYWN0b3J5KVxuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsczpcbiAgICBmYWN0b3J5KFxuICAgICAgd2luZG93LmJsdWVpbXAuaGVscGVyIHx8IHdpbmRvdy5qUXVlcnksXG4gICAgICB3aW5kb3cuYmx1ZWltcC5HYWxsZXJ5XG4gICAgKVxuICB9XG59KGZ1bmN0aW9uICgkLCBHYWxsZXJ5KSB7XG4gICd1c2Ugc3RyaWN0J1xuXG4gICQuZXh0ZW5kKEdhbGxlcnkucHJvdG90eXBlLm9wdGlvbnMsIHtcbiAgICAvLyBUaGUgdGFnIG5hbWUsIElkLCBlbGVtZW50IG9yIHF1ZXJ5U2VsZWN0b3Igb2YgdGhlIGluZGljYXRvciBjb250YWluZXI6XG4gICAgaW5kaWNhdG9yQ29udGFpbmVyOiAnb2wnLFxuICAgIC8vIFRoZSBjbGFzcyBmb3IgdGhlIGFjdGl2ZSBpbmRpY2F0b3I6XG4gICAgYWN0aXZlSW5kaWNhdG9yQ2xhc3M6ICdhY3RpdmUnLFxuICAgIC8vIFRoZSBsaXN0IG9iamVjdCBwcm9wZXJ0eSAob3IgZGF0YSBhdHRyaWJ1dGUpIHdpdGggdGhlIHRodW1ibmFpbCBVUkwsXG4gICAgLy8gdXNlZCBhcyBhbHRlcm5hdGl2ZSB0byBhIHRodW1ibmFpbCBjaGlsZCBlbGVtZW50OlxuICAgIHRodW1ibmFpbFByb3BlcnR5OiAndGh1bWJuYWlsJyxcbiAgICAvLyBEZWZpbmVzIGlmIHRoZSBnYWxsZXJ5IGluZGljYXRvcnMgc2hvdWxkIGRpc3BsYXkgYSB0aHVtYm5haWw6XG4gICAgdGh1bWJuYWlsSW5kaWNhdG9yczogdHJ1ZVxuICB9KVxuXG4gIHZhciBpbml0U2xpZGVzID0gR2FsbGVyeS5wcm90b3R5cGUuaW5pdFNsaWRlc1xuICB2YXIgYWRkU2xpZGUgPSBHYWxsZXJ5LnByb3RvdHlwZS5hZGRTbGlkZVxuICB2YXIgcmVzZXRTbGlkZXMgPSBHYWxsZXJ5LnByb3RvdHlwZS5yZXNldFNsaWRlc1xuICB2YXIgaGFuZGxlQ2xpY2sgPSBHYWxsZXJ5LnByb3RvdHlwZS5oYW5kbGVDbGlja1xuICB2YXIgaGFuZGxlU2xpZGUgPSBHYWxsZXJ5LnByb3RvdHlwZS5oYW5kbGVTbGlkZVxuICB2YXIgaGFuZGxlQ2xvc2UgPSBHYWxsZXJ5LnByb3RvdHlwZS5oYW5kbGVDbG9zZVxuXG4gICQuZXh0ZW5kKEdhbGxlcnkucHJvdG90eXBlLCB7XG4gICAgY3JlYXRlSW5kaWNhdG9yOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgaW5kaWNhdG9yID0gdGhpcy5pbmRpY2F0b3JQcm90b3R5cGUuY2xvbmVOb2RlKGZhbHNlKVxuICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRJdGVtUHJvcGVydHkob2JqLCB0aGlzLm9wdGlvbnMudGl0bGVQcm9wZXJ0eSlcbiAgICAgIHZhciB0aHVtYm5haWxQcm9wZXJ0eSA9IHRoaXMub3B0aW9ucy50aHVtYm5haWxQcm9wZXJ0eVxuICAgICAgdmFyIHRodW1ibmFpbFVybFxuICAgICAgdmFyIHRodW1ibmFpbFxuICAgICAgaWYgKHRoaXMub3B0aW9ucy50aHVtYm5haWxJbmRpY2F0b3JzKSB7XG4gICAgICAgIGlmICh0aHVtYm5haWxQcm9wZXJ0eSkge1xuICAgICAgICAgIHRodW1ibmFpbFVybCA9IHRoaXMuZ2V0SXRlbVByb3BlcnR5KG9iaiwgdGh1bWJuYWlsUHJvcGVydHkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRodW1ibmFpbFVybCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGh1bWJuYWlsID0gb2JqLmdldEVsZW1lbnRzQnlUYWdOYW1lICYmICQob2JqKS5maW5kKCdpbWcnKVswXVxuICAgICAgICAgIGlmICh0aHVtYm5haWwpIHtcbiAgICAgICAgICAgIHRodW1ibmFpbFVybCA9IHRodW1ibmFpbC5zcmNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRodW1ibmFpbFVybCkge1xuICAgICAgICAgIGluZGljYXRvci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiJyArIHRodW1ibmFpbFVybCArICdcIiknXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aXRsZSkge1xuICAgICAgICBpbmRpY2F0b3IudGl0bGUgPSB0aXRsZVxuICAgICAgfVxuICAgICAgcmV0dXJuIGluZGljYXRvclxuICAgIH0sXG5cbiAgICBhZGRJbmRpY2F0b3I6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgaWYgKHRoaXMuaW5kaWNhdG9yQ29udGFpbmVyLmxlbmd0aCkge1xuICAgICAgICB2YXIgaW5kaWNhdG9yID0gdGhpcy5jcmVhdGVJbmRpY2F0b3IodGhpcy5saXN0W2luZGV4XSlcbiAgICAgICAgaW5kaWNhdG9yLnNldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcsIGluZGV4KVxuICAgICAgICB0aGlzLmluZGljYXRvckNvbnRhaW5lclswXS5hcHBlbmRDaGlsZChpbmRpY2F0b3IpXG4gICAgICAgIHRoaXMuaW5kaWNhdG9ycy5wdXNoKGluZGljYXRvcilcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0QWN0aXZlSW5kaWNhdG9yOiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIGlmICh0aGlzLmluZGljYXRvcnMpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlSW5kaWNhdG9yKSB7XG4gICAgICAgICAgdGhpcy5hY3RpdmVJbmRpY2F0b3JcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuYWN0aXZlSW5kaWNhdG9yQ2xhc3MpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY3RpdmVJbmRpY2F0b3IgPSAkKHRoaXMuaW5kaWNhdG9yc1tpbmRleF0pXG4gICAgICAgIHRoaXMuYWN0aXZlSW5kaWNhdG9yXG4gICAgICAgICAgLmFkZENsYXNzKHRoaXMub3B0aW9ucy5hY3RpdmVJbmRpY2F0b3JDbGFzcylcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdFNsaWRlczogZnVuY3Rpb24gKHJlbG9hZCkge1xuICAgICAgaWYgKCFyZWxvYWQpIHtcbiAgICAgICAgdGhpcy5pbmRpY2F0b3JDb250YWluZXIgPSB0aGlzLmNvbnRhaW5lci5maW5kKFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5pbmRpY2F0b3JDb250YWluZXJcbiAgICAgICAgKVxuICAgICAgICBpZiAodGhpcy5pbmRpY2F0b3JDb250YWluZXIubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5pbmRpY2F0b3JQcm90b3R5cGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgICAgICAgdGhpcy5pbmRpY2F0b3JzID0gdGhpcy5pbmRpY2F0b3JDb250YWluZXJbMF0uY2hpbGRyZW5cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaW5pdFNsaWRlcy5jYWxsKHRoaXMsIHJlbG9hZClcbiAgICB9LFxuXG4gICAgYWRkU2xpZGU6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgYWRkU2xpZGUuY2FsbCh0aGlzLCBpbmRleClcbiAgICAgIHRoaXMuYWRkSW5kaWNhdG9yKGluZGV4KVxuICAgIH0sXG5cbiAgICByZXNldFNsaWRlczogZnVuY3Rpb24gKCkge1xuICAgICAgcmVzZXRTbGlkZXMuY2FsbCh0aGlzKVxuICAgICAgdGhpcy5pbmRpY2F0b3JDb250YWluZXIuZW1wdHkoKVxuICAgICAgdGhpcy5pbmRpY2F0b3JzID0gW11cbiAgICB9LFxuXG4gICAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50XG4gICAgICB2YXIgcGFyZW50ID0gdGFyZ2V0LnBhcmVudE5vZGVcbiAgICAgIGlmIChwYXJlbnQgPT09IHRoaXMuaW5kaWNhdG9yQ29udGFpbmVyWzBdKSB7XG4gICAgICAgIC8vIENsaWNrIG9uIGluZGljYXRvciBlbGVtZW50XG4gICAgICAgIHRoaXMucHJldmVudERlZmF1bHQoZXZlbnQpXG4gICAgICAgIHRoaXMuc2xpZGUodGhpcy5nZXROb2RlSW5kZXgodGFyZ2V0KSlcbiAgICAgIH0gZWxzZSBpZiAocGFyZW50LnBhcmVudE5vZGUgPT09IHRoaXMuaW5kaWNhdG9yQ29udGFpbmVyWzBdKSB7XG4gICAgICAgIC8vIENsaWNrIG9uIGluZGljYXRvciBjaGlsZCBlbGVtZW50XG4gICAgICAgIHRoaXMucHJldmVudERlZmF1bHQoZXZlbnQpXG4gICAgICAgIHRoaXMuc2xpZGUodGhpcy5nZXROb2RlSW5kZXgocGFyZW50KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVDbGljay5jYWxsKHRoaXMsIGV2ZW50KVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBoYW5kbGVTbGlkZTogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICBoYW5kbGVTbGlkZS5jYWxsKHRoaXMsIGluZGV4KVxuICAgICAgdGhpcy5zZXRBY3RpdmVJbmRpY2F0b3IoaW5kZXgpXG4gICAgfSxcblxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmVJbmRpY2F0b3IpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVJbmRpY2F0b3JcbiAgICAgICAgICAucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmFjdGl2ZUluZGljYXRvckNsYXNzKVxuICAgICAgfVxuICAgICAgaGFuZGxlQ2xvc2UuY2FsbCh0aGlzKVxuICAgIH1cblxuICB9KVxuXG4gIHJldHVybiBHYWxsZXJ5XG59KSlcbiIsIiFmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHQodCxlKXt2YXIgaTtmb3IoaSBpbiBlKWUuaGFzT3duUHJvcGVydHkoaSkmJih0W2ldPWVbaV0pO3JldHVybiB0fWZ1bmN0aW9uIGUodCl7aWYoIXRoaXN8fHRoaXMuZmluZCE9PWUucHJvdG90eXBlLmZpbmQpcmV0dXJuIG5ldyBlKHQpO2lmKHRoaXMubGVuZ3RoPTAsdClpZihcInN0cmluZ1wiPT10eXBlb2YgdCYmKHQ9dGhpcy5maW5kKHQpKSx0Lm5vZGVUeXBlfHx0PT09dC53aW5kb3cpdGhpcy5sZW5ndGg9MSx0aGlzWzBdPXQ7ZWxzZXt2YXIgaT10Lmxlbmd0aDtmb3IodGhpcy5sZW5ndGg9aTtpOylpLT0xLHRoaXNbaV09dFtpXX19ZS5leHRlbmQ9dCxlLmNvbnRhaW5zPWZ1bmN0aW9uKHQsZSl7ZG8gaWYoZT1lLnBhcmVudE5vZGUsZT09PXQpcmV0dXJuITA7d2hpbGUoZSk7cmV0dXJuITF9LGUucGFyc2VKU09OPWZ1bmN0aW9uKHQpe3JldHVybiB3aW5kb3cuSlNPTiYmSlNPTi5wYXJzZSh0KX0sdChlLnByb3RvdHlwZSx7ZmluZDpmdW5jdGlvbih0KXt2YXIgaT10aGlzWzBdfHxkb2N1bWVudDtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdCYmKHQ9aS5xdWVyeVNlbGVjdG9yQWxsP2kucXVlcnlTZWxlY3RvckFsbCh0KTpcIiNcIj09PXQuY2hhckF0KDApP2kuZ2V0RWxlbWVudEJ5SWQodC5zbGljZSgxKSk6aS5nZXRFbGVtZW50c0J5VGFnTmFtZSh0KSksbmV3IGUodCl9LGhhc0NsYXNzOmZ1bmN0aW9uKHQpe3JldHVybiEhdGhpc1swXSYmbmV3IFJlZ0V4cChcIihefFxcXFxzKylcIit0K1wiKFxcXFxzK3wkKVwiKS50ZXN0KHRoaXNbMF0uY2xhc3NOYW1lKX0sYWRkQ2xhc3M6ZnVuY3Rpb24odCl7Zm9yKHZhciBlLGk9dGhpcy5sZW5ndGg7aTspe2lmKGktPTEsZT10aGlzW2ldLCFlLmNsYXNzTmFtZSlyZXR1cm4gZS5jbGFzc05hbWU9dCx0aGlzO2lmKHRoaXMuaGFzQ2xhc3ModCkpcmV0dXJuIHRoaXM7ZS5jbGFzc05hbWUrPVwiIFwiK3R9cmV0dXJuIHRoaXN9LHJlbW92ZUNsYXNzOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZSxpPW5ldyBSZWdFeHAoXCIoXnxcXFxccyspXCIrdCtcIihcXFxccyt8JClcIikscz10aGlzLmxlbmd0aDtzOylzLT0xLGU9dGhpc1tzXSxlLmNsYXNzTmFtZT1lLmNsYXNzTmFtZS5yZXBsYWNlKGksXCIgXCIpO3JldHVybiB0aGlzfSxvbjpmdW5jdGlvbih0LGUpe2Zvcih2YXIgaSxzLG49dC5zcGxpdCgvXFxzKy8pO24ubGVuZ3RoOylmb3IodD1uLnNoaWZ0KCksaT10aGlzLmxlbmd0aDtpOylpLT0xLHM9dGhpc1tpXSxzLmFkZEV2ZW50TGlzdGVuZXI/cy5hZGRFdmVudExpc3RlbmVyKHQsZSwhMSk6cy5hdHRhY2hFdmVudCYmcy5hdHRhY2hFdmVudChcIm9uXCIrdCxlKTtyZXR1cm4gdGhpc30sb2ZmOmZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBpLHMsbj10LnNwbGl0KC9cXHMrLyk7bi5sZW5ndGg7KWZvcih0PW4uc2hpZnQoKSxpPXRoaXMubGVuZ3RoO2k7KWktPTEscz10aGlzW2ldLHMucmVtb3ZlRXZlbnRMaXN0ZW5lcj9zLnJlbW92ZUV2ZW50TGlzdGVuZXIodCxlLCExKTpzLmRldGFjaEV2ZW50JiZzLmRldGFjaEV2ZW50KFwib25cIit0LGUpO3JldHVybiB0aGlzfSxlbXB0eTpmdW5jdGlvbigpe2Zvcih2YXIgdCxlPXRoaXMubGVuZ3RoO2U7KWZvcihlLT0xLHQ9dGhpc1tlXTt0Lmhhc0NoaWxkTm9kZXMoKTspdC5yZW1vdmVDaGlsZCh0Lmxhc3RDaGlsZCk7cmV0dXJuIHRoaXN9LGZpcnN0OmZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBlKHRoaXNbMF0pfX0pLFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gZX0pOih3aW5kb3cuYmx1ZWltcD13aW5kb3cuYmx1ZWltcHx8e30sd2luZG93LmJsdWVpbXAuaGVscGVyPWUpfSgpLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiLi9ibHVlaW1wLWhlbHBlclwiXSx0KTood2luZG93LmJsdWVpbXA9d2luZG93LmJsdWVpbXB8fHt9LHdpbmRvdy5ibHVlaW1wLkdhbGxlcnk9dCh3aW5kb3cuYmx1ZWltcC5oZWxwZXJ8fHdpbmRvdy5qUXVlcnkpKX0oZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gZSh0LGkpe3JldHVybiB2b2lkIDA9PT1kb2N1bWVudC5ib2R5LnN0eWxlLm1heEhlaWdodD9udWxsOnRoaXMmJnRoaXMub3B0aW9ucz09PWUucHJvdG90eXBlLm9wdGlvbnM/dCYmdC5sZW5ndGg/KHRoaXMubGlzdD10LHRoaXMubnVtPXQubGVuZ3RoLHRoaXMuaW5pdE9wdGlvbnMoaSksdm9pZCB0aGlzLmluaXRpYWxpemUoKSk6dm9pZCB0aGlzLmNvbnNvbGUubG9nKFwiYmx1ZWltcCBHYWxsZXJ5OiBObyBvciBlbXB0eSBsaXN0IHByb3ZpZGVkIGFzIGZpcnN0IGFyZ3VtZW50LlwiLHQpOm5ldyBlKHQsaSl9cmV0dXJuIHQuZXh0ZW5kKGUucHJvdG90eXBlLHtvcHRpb25zOntjb250YWluZXI6XCIjYmx1ZWltcC1nYWxsZXJ5XCIsc2xpZGVzQ29udGFpbmVyOlwiZGl2XCIsdGl0bGVFbGVtZW50OlwiaDNcIixkaXNwbGF5Q2xhc3M6XCJibHVlaW1wLWdhbGxlcnktZGlzcGxheVwiLGNvbnRyb2xzQ2xhc3M6XCJibHVlaW1wLWdhbGxlcnktY29udHJvbHNcIixzaW5nbGVDbGFzczpcImJsdWVpbXAtZ2FsbGVyeS1zaW5nbGVcIixsZWZ0RWRnZUNsYXNzOlwiYmx1ZWltcC1nYWxsZXJ5LWxlZnRcIixyaWdodEVkZ2VDbGFzczpcImJsdWVpbXAtZ2FsbGVyeS1yaWdodFwiLHBsYXlpbmdDbGFzczpcImJsdWVpbXAtZ2FsbGVyeS1wbGF5aW5nXCIsc2xpZGVDbGFzczpcInNsaWRlXCIsc2xpZGVMb2FkaW5nQ2xhc3M6XCJzbGlkZS1sb2FkaW5nXCIsc2xpZGVFcnJvckNsYXNzOlwic2xpZGUtZXJyb3JcIixzbGlkZUNvbnRlbnRDbGFzczpcInNsaWRlLWNvbnRlbnRcIix0b2dnbGVDbGFzczpcInRvZ2dsZVwiLHByZXZDbGFzczpcInByZXZcIixuZXh0Q2xhc3M6XCJuZXh0XCIsY2xvc2VDbGFzczpcImNsb3NlXCIscGxheVBhdXNlQ2xhc3M6XCJwbGF5LXBhdXNlXCIsdHlwZVByb3BlcnR5OlwidHlwZVwiLHRpdGxlUHJvcGVydHk6XCJ0aXRsZVwiLHVybFByb3BlcnR5OlwiaHJlZlwiLHNyY3NldFByb3BlcnR5OlwidXJsc2V0XCIsZGlzcGxheVRyYW5zaXRpb246ITAsY2xlYXJTbGlkZXM6ITAsc3RyZXRjaEltYWdlczohMSx0b2dnbGVDb250cm9sc09uUmV0dXJuOiEwLHRvZ2dsZUNvbnRyb2xzT25TbGlkZUNsaWNrOiEwLHRvZ2dsZVNsaWRlc2hvd09uU3BhY2U6ITAsZW5hYmxlS2V5Ym9hcmROYXZpZ2F0aW9uOiEwLGNsb3NlT25Fc2NhcGU6ITAsY2xvc2VPblNsaWRlQ2xpY2s6ITAsY2xvc2VPblN3aXBlVXBPckRvd246ITAsZW11bGF0ZVRvdWNoRXZlbnRzOiEwLHN0b3BUb3VjaEV2ZW50c1Byb3BhZ2F0aW9uOiExLGhpZGVQYWdlU2Nyb2xsYmFyczohMCxkaXNhYmxlU2Nyb2xsOiEwLGNhcm91c2VsOiExLGNvbnRpbnVvdXM6ITAsdW5sb2FkRWxlbWVudHM6ITAsc3RhcnRTbGlkZXNob3c6ITEsc2xpZGVzaG93SW50ZXJ2YWw6NWUzLGluZGV4OjAscHJlbG9hZFJhbmdlOjIsdHJhbnNpdGlvblNwZWVkOjQwMCxzbGlkZXNob3dUcmFuc2l0aW9uU3BlZWQ6dm9pZCAwLGV2ZW50OnZvaWQgMCxvbm9wZW46dm9pZCAwLG9ub3BlbmVkOnZvaWQgMCxvbnNsaWRlOnZvaWQgMCxvbnNsaWRlZW5kOnZvaWQgMCxvbnNsaWRlY29tcGxldGU6dm9pZCAwLG9uY2xvc2U6dm9pZCAwLG9uY2xvc2VkOnZvaWQgMH0sY2Fyb3VzZWxPcHRpb25zOntoaWRlUGFnZVNjcm9sbGJhcnM6ITEsdG9nZ2xlQ29udHJvbHNPblJldHVybjohMSx0b2dnbGVTbGlkZXNob3dPblNwYWNlOiExLGVuYWJsZUtleWJvYXJkTmF2aWdhdGlvbjohMSxjbG9zZU9uRXNjYXBlOiExLGNsb3NlT25TbGlkZUNsaWNrOiExLGNsb3NlT25Td2lwZVVwT3JEb3duOiExLGRpc2FibGVTY3JvbGw6ITEsc3RhcnRTbGlkZXNob3c6ITB9LGNvbnNvbGU6d2luZG93LmNvbnNvbGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHdpbmRvdy5jb25zb2xlLmxvZz93aW5kb3cuY29uc29sZTp7bG9nOmZ1bmN0aW9uKCl7fX0sc3VwcG9ydDpmdW5jdGlvbihlKXtmdW5jdGlvbiBpKCl7dmFyIHQsaSxzPW4udHJhbnNpdGlvbjtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGUpLHMmJih0PXMubmFtZS5zbGljZSgwLC05KStcInJhbnNmb3JtXCIsdm9pZCAwIT09ZS5zdHlsZVt0XSYmKGUuc3R5bGVbdF09XCJ0cmFuc2xhdGVaKDApXCIsaT13aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlKS5nZXRQcm9wZXJ0eVZhbHVlKHMucHJlZml4K1widHJhbnNmb3JtXCIpLG4udHJhbnNmb3JtPXtwcmVmaXg6cy5wcmVmaXgsbmFtZTp0LHRyYW5zbGF0ZTohMCx0cmFuc2xhdGVaOiEhaSYmXCJub25lXCIhPT1pfSkpLHZvaWQgMCE9PWUuc3R5bGUuYmFja2dyb3VuZFNpemUmJihuLmJhY2tncm91bmRTaXplPXt9LGUuc3R5bGUuYmFja2dyb3VuZFNpemU9XCJjb250YWluXCIsbi5iYWNrZ3JvdW5kU2l6ZS5jb250YWluPVwiY29udGFpblwiPT09d2luZG93LmdldENvbXB1dGVkU3R5bGUoZSkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtc2l6ZVwiKSxlLnN0eWxlLmJhY2tncm91bmRTaXplPVwiY292ZXJcIixuLmJhY2tncm91bmRTaXplLmNvdmVyPVwiY292ZXJcIj09PXdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGUpLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLXNpemVcIikpLGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZSl9dmFyIHMsbj17dG91Y2g6dm9pZCAwIT09d2luZG93Lm9udG91Y2hzdGFydHx8d2luZG93LkRvY3VtZW50VG91Y2gmJmRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaH0sbz17d2Via2l0VHJhbnNpdGlvbjp7ZW5kOlwid2Via2l0VHJhbnNpdGlvbkVuZFwiLHByZWZpeDpcIi13ZWJraXQtXCJ9LE1velRyYW5zaXRpb246e2VuZDpcInRyYW5zaXRpb25lbmRcIixwcmVmaXg6XCItbW96LVwifSxPVHJhbnNpdGlvbjp7ZW5kOlwib3RyYW5zaXRpb25lbmRcIixwcmVmaXg6XCItby1cIn0sdHJhbnNpdGlvbjp7ZW5kOlwidHJhbnNpdGlvbmVuZFwiLHByZWZpeDpcIlwifX07Zm9yKHMgaW4gbylpZihvLmhhc093blByb3BlcnR5KHMpJiZ2b2lkIDAhPT1lLnN0eWxlW3NdKXtuLnRyYW5zaXRpb249b1tzXSxuLnRyYW5zaXRpb24ubmFtZT1zO2JyZWFrfXJldHVybiBkb2N1bWVudC5ib2R5P2koKTp0KGRvY3VtZW50KS5vbihcIkRPTUNvbnRlbnRMb2FkZWRcIixpKSxufShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSxyZXF1ZXN0QW5pbWF0aW9uRnJhbWU6d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSxpbml0aWFsaXplOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaW5pdFN0YXJ0SW5kZXgoKSx0aGlzLmluaXRXaWRnZXQoKSE9PSExJiYodGhpcy5pbml0RXZlbnRMaXN0ZW5lcnMoKSx0aGlzLm9uc2xpZGUodGhpcy5pbmRleCksdGhpcy5vbnRyYW5zaXRpb25lbmQoKSx2b2lkKHRoaXMub3B0aW9ucy5zdGFydFNsaWRlc2hvdyYmdGhpcy5wbGF5KCkpKX0sc2xpZGU6ZnVuY3Rpb24odCxlKXt3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7dmFyIGkscyxuLG89dGhpcy5pbmRleDtpZihvIT09dCYmMSE9PXRoaXMubnVtKXtpZihlfHwoZT10aGlzLm9wdGlvbnMudHJhbnNpdGlvblNwZWVkKSx0aGlzLnN1cHBvcnQudHJhbnNmb3JtKXtmb3IodGhpcy5vcHRpb25zLmNvbnRpbnVvdXN8fCh0PXRoaXMuY2lyY2xlKHQpKSxpPU1hdGguYWJzKG8tdCkvKG8tdCksdGhpcy5vcHRpb25zLmNvbnRpbnVvdXMmJihzPWksaT0tdGhpcy5wb3NpdGlvbnNbdGhpcy5jaXJjbGUodCldL3RoaXMuc2xpZGVXaWR0aCxpIT09cyYmKHQ9LWkqdGhpcy5udW0rdCkpLG49TWF0aC5hYnMoby10KS0xO247KW4tPTEsdGhpcy5tb3ZlKHRoaXMuY2lyY2xlKCh0Pm8/dDpvKS1uLTEpLHRoaXMuc2xpZGVXaWR0aCppLDApO3Q9dGhpcy5jaXJjbGUodCksdGhpcy5tb3ZlKG8sdGhpcy5zbGlkZVdpZHRoKmksZSksdGhpcy5tb3ZlKHQsMCxlKSx0aGlzLm9wdGlvbnMuY29udGludW91cyYmdGhpcy5tb3ZlKHRoaXMuY2lyY2xlKHQtaSksLSh0aGlzLnNsaWRlV2lkdGgqaSksMCl9ZWxzZSB0PXRoaXMuY2lyY2xlKHQpLHRoaXMuYW5pbWF0ZShvKi10aGlzLnNsaWRlV2lkdGgsdCotdGhpcy5zbGlkZVdpZHRoLGUpO3RoaXMub25zbGlkZSh0KX19LGdldEluZGV4OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaW5kZXh9LGdldE51bWJlcjpmdW5jdGlvbigpe3JldHVybiB0aGlzLm51bX0scHJldjpmdW5jdGlvbigpeyh0aGlzLm9wdGlvbnMuY29udGludW91c3x8dGhpcy5pbmRleCkmJnRoaXMuc2xpZGUodGhpcy5pbmRleC0xKX0sbmV4dDpmdW5jdGlvbigpeyh0aGlzLm9wdGlvbnMuY29udGludW91c3x8dGhpcy5pbmRleDx0aGlzLm51bS0xKSYmdGhpcy5zbGlkZSh0aGlzLmluZGV4KzEpfSxwbGF5OmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXM7d2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpLHRoaXMuaW50ZXJ2YWw9dHx8dGhpcy5vcHRpb25zLnNsaWRlc2hvd0ludGVydmFsLHRoaXMuZWxlbWVudHNbdGhpcy5pbmRleF0+MSYmKHRoaXMudGltZW91dD10aGlzLnNldFRpbWVvdXQoIXRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lJiZ0aGlzLnNsaWRlfHxmdW5jdGlvbih0LGkpe2UuYW5pbWF0aW9uRnJhbWVJZD1lLnJlcXVlc3RBbmltYXRpb25GcmFtZS5jYWxsKHdpbmRvdyxmdW5jdGlvbigpe2Uuc2xpZGUodCxpKX0pfSxbdGhpcy5pbmRleCsxLHRoaXMub3B0aW9ucy5zbGlkZXNob3dUcmFuc2l0aW9uU3BlZWRdLHRoaXMuaW50ZXJ2YWwpKSx0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMucGxheWluZ0NsYXNzKX0scGF1c2U6ZnVuY3Rpb24oKXt3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCksdGhpcy5pbnRlcnZhbD1udWxsLHRoaXMuY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5wbGF5aW5nQ2xhc3MpfSxhZGQ6ZnVuY3Rpb24odCl7dmFyIGU7Zm9yKHQuY29uY2F0fHwodD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0KSksdGhpcy5saXN0LmNvbmNhdHx8KHRoaXMubGlzdD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmxpc3QpKSx0aGlzLmxpc3Q9dGhpcy5saXN0LmNvbmNhdCh0KSx0aGlzLm51bT10aGlzLmxpc3QubGVuZ3RoLHRoaXMubnVtPjImJm51bGw9PT10aGlzLm9wdGlvbnMuY29udGludW91cyYmKHRoaXMub3B0aW9ucy5jb250aW51b3VzPSEwLHRoaXMuY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5sZWZ0RWRnZUNsYXNzKSksdGhpcy5jb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLnJpZ2h0RWRnZUNsYXNzKS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuc2luZ2xlQ2xhc3MpLGU9dGhpcy5udW0tdC5sZW5ndGg7ZTx0aGlzLm51bTtlKz0xKXRoaXMuYWRkU2xpZGUoZSksdGhpcy5wb3NpdGlvblNsaWRlKGUpO3RoaXMucG9zaXRpb25zLmxlbmd0aD10aGlzLm51bSx0aGlzLmluaXRTbGlkZXMoITApfSxyZXNldFNsaWRlczpmdW5jdGlvbigpe3RoaXMuc2xpZGVzQ29udGFpbmVyLmVtcHR5KCksdGhpcy51bmxvYWRBbGxTbGlkZXMoKSx0aGlzLnNsaWRlcz1bXX0saGFuZGxlQ2xvc2U6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLm9wdGlvbnM7dGhpcy5kZXN0cm95RXZlbnRMaXN0ZW5lcnMoKSx0aGlzLnBhdXNlKCksdGhpcy5jb250YWluZXJbMF0uc3R5bGUuZGlzcGxheT1cIm5vbmVcIix0aGlzLmNvbnRhaW5lci5yZW1vdmVDbGFzcyh0LmRpc3BsYXlDbGFzcykucmVtb3ZlQ2xhc3ModC5zaW5nbGVDbGFzcykucmVtb3ZlQ2xhc3ModC5sZWZ0RWRnZUNsYXNzKS5yZW1vdmVDbGFzcyh0LnJpZ2h0RWRnZUNsYXNzKSx0LmhpZGVQYWdlU2Nyb2xsYmFycyYmKGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3c9dGhpcy5ib2R5T3ZlcmZsb3dTdHlsZSksdGhpcy5vcHRpb25zLmNsZWFyU2xpZGVzJiZ0aGlzLnJlc2V0U2xpZGVzKCksdGhpcy5vcHRpb25zLm9uY2xvc2VkJiZ0aGlzLm9wdGlvbnMub25jbG9zZWQuY2FsbCh0aGlzKX0sY2xvc2U6ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGkpe2kudGFyZ2V0PT09ZS5jb250YWluZXJbMF0mJihlLmNvbnRhaW5lci5vZmYoZS5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLHQpLGUuaGFuZGxlQ2xvc2UoKSl9dmFyIGU9dGhpczt0aGlzLm9wdGlvbnMub25jbG9zZSYmdGhpcy5vcHRpb25zLm9uY2xvc2UuY2FsbCh0aGlzKSx0aGlzLnN1cHBvcnQudHJhbnNpdGlvbiYmdGhpcy5vcHRpb25zLmRpc3BsYXlUcmFuc2l0aW9uPyh0aGlzLmNvbnRhaW5lci5vbih0aGlzLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsdCksdGhpcy5jb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmRpc3BsYXlDbGFzcykpOnRoaXMuaGFuZGxlQ2xvc2UoKX0sY2lyY2xlOmZ1bmN0aW9uKHQpe3JldHVybih0aGlzLm51bSt0JXRoaXMubnVtKSV0aGlzLm51bX0sbW92ZTpmdW5jdGlvbih0LGUsaSl7dGhpcy50cmFuc2xhdGVYKHQsZSxpKSx0aGlzLnBvc2l0aW9uc1t0XT1lfSx0cmFuc2xhdGU6ZnVuY3Rpb24odCxlLGkscyl7dmFyIG49dGhpcy5zbGlkZXNbdF0uc3R5bGUsbz10aGlzLnN1cHBvcnQudHJhbnNpdGlvbixyPXRoaXMuc3VwcG9ydC50cmFuc2Zvcm07bltvLm5hbWUrXCJEdXJhdGlvblwiXT1zK1wibXNcIixuW3IubmFtZV09XCJ0cmFuc2xhdGUoXCIrZStcInB4LCBcIitpK1wicHgpXCIrKHIudHJhbnNsYXRlWj9cIiB0cmFuc2xhdGVaKDApXCI6XCJcIil9LHRyYW5zbGF0ZVg6ZnVuY3Rpb24odCxlLGkpe3RoaXMudHJhbnNsYXRlKHQsZSwwLGkpfSx0cmFuc2xhdGVZOmZ1bmN0aW9uKHQsZSxpKXt0aGlzLnRyYW5zbGF0ZSh0LDAsZSxpKX0sYW5pbWF0ZTpmdW5jdGlvbih0LGUsaSl7aWYoIWkpcmV0dXJuIHZvaWQodGhpcy5zbGlkZXNDb250YWluZXJbMF0uc3R5bGUubGVmdD1lK1wicHhcIik7dmFyIHM9dGhpcyxuPShuZXcgRGF0ZSkuZ2V0VGltZSgpLG89d2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCl7dmFyIHI9KG5ldyBEYXRlKS5nZXRUaW1lKCktbjtyZXR1cm4gcj5pPyhzLnNsaWRlc0NvbnRhaW5lclswXS5zdHlsZS5sZWZ0PWUrXCJweFwiLHMub250cmFuc2l0aW9uZW5kKCksdm9pZCB3aW5kb3cuY2xlYXJJbnRlcnZhbChvKSk6dm9pZChzLnNsaWRlc0NvbnRhaW5lclswXS5zdHlsZS5sZWZ0PShlLXQpKihNYXRoLmZsb29yKHIvaSoxMDApLzEwMCkrdCtcInB4XCIpfSw0KX0scHJldmVudERlZmF1bHQ6ZnVuY3Rpb24odCl7dC5wcmV2ZW50RGVmYXVsdD90LnByZXZlbnREZWZhdWx0KCk6dC5yZXR1cm5WYWx1ZT0hMX0sc3RvcFByb3BhZ2F0aW9uOmZ1bmN0aW9uKHQpe3Quc3RvcFByb3BhZ2F0aW9uP3Quc3RvcFByb3BhZ2F0aW9uKCk6dC5jYW5jZWxCdWJibGU9ITB9LG9ucmVzaXplOmZ1bmN0aW9uKCl7dGhpcy5pbml0U2xpZGVzKCEwKX0sb25tb3VzZWRvd246ZnVuY3Rpb24odCl7dC53aGljaCYmMT09PXQud2hpY2gmJlwiVklERU9cIiE9PXQudGFyZ2V0Lm5vZGVOYW1lJiYodC5wcmV2ZW50RGVmYXVsdCgpLCh0Lm9yaWdpbmFsRXZlbnR8fHQpLnRvdWNoZXM9W3twYWdlWDp0LnBhZ2VYLHBhZ2VZOnQucGFnZVl9XSx0aGlzLm9udG91Y2hzdGFydCh0KSl9LG9ubW91c2Vtb3ZlOmZ1bmN0aW9uKHQpe3RoaXMudG91Y2hTdGFydCYmKCh0Lm9yaWdpbmFsRXZlbnR8fHQpLnRvdWNoZXM9W3twYWdlWDp0LnBhZ2VYLHBhZ2VZOnQucGFnZVl9XSx0aGlzLm9udG91Y2htb3ZlKHQpKX0sb25tb3VzZXVwOmZ1bmN0aW9uKHQpe3RoaXMudG91Y2hTdGFydCYmKHRoaXMub250b3VjaGVuZCh0KSxkZWxldGUgdGhpcy50b3VjaFN0YXJ0KX0sb25tb3VzZW91dDpmdW5jdGlvbihlKXtpZih0aGlzLnRvdWNoU3RhcnQpe3ZhciBpPWUudGFyZ2V0LHM9ZS5yZWxhdGVkVGFyZ2V0O3MmJihzPT09aXx8dC5jb250YWlucyhpLHMpKXx8dGhpcy5vbm1vdXNldXAoZSl9fSxvbnRvdWNoc3RhcnQ6ZnVuY3Rpb24odCl7dGhpcy5vcHRpb25zLnN0b3BUb3VjaEV2ZW50c1Byb3BhZ2F0aW9uJiZ0aGlzLnN0b3BQcm9wYWdhdGlvbih0KTt2YXIgZT0odC5vcmlnaW5hbEV2ZW50fHx0KS50b3VjaGVzWzBdO3RoaXMudG91Y2hTdGFydD17eDplLnBhZ2VYLHk6ZS5wYWdlWSx0aW1lOkRhdGUubm93KCl9LHRoaXMuaXNTY3JvbGxpbmc9dm9pZCAwLHRoaXMudG91Y2hEZWx0YT17fX0sb250b3VjaG1vdmU6ZnVuY3Rpb24odCl7dGhpcy5vcHRpb25zLnN0b3BUb3VjaEV2ZW50c1Byb3BhZ2F0aW9uJiZ0aGlzLnN0b3BQcm9wYWdhdGlvbih0KTt2YXIgZSxpLHM9KHQub3JpZ2luYWxFdmVudHx8dCkudG91Y2hlc1swXSxuPSh0Lm9yaWdpbmFsRXZlbnR8fHQpLnNjYWxlLG89dGhpcy5pbmRleDtpZighKHMubGVuZ3RoPjF8fG4mJjEhPT1uKSlpZih0aGlzLm9wdGlvbnMuZGlzYWJsZVNjcm9sbCYmdC5wcmV2ZW50RGVmYXVsdCgpLHRoaXMudG91Y2hEZWx0YT17eDpzLnBhZ2VYLXRoaXMudG91Y2hTdGFydC54LHk6cy5wYWdlWS10aGlzLnRvdWNoU3RhcnQueX0sZT10aGlzLnRvdWNoRGVsdGEueCx2b2lkIDA9PT10aGlzLmlzU2Nyb2xsaW5nJiYodGhpcy5pc1Njcm9sbGluZz10aGlzLmlzU2Nyb2xsaW5nfHxNYXRoLmFicyhlKTxNYXRoLmFicyh0aGlzLnRvdWNoRGVsdGEueSkpLHRoaXMuaXNTY3JvbGxpbmcpdGhpcy5vcHRpb25zLmNsb3NlT25Td2lwZVVwT3JEb3duJiZ0aGlzLnRyYW5zbGF0ZVkobyx0aGlzLnRvdWNoRGVsdGEueSt0aGlzLnBvc2l0aW9uc1tvXSwwKTtlbHNlIGZvcih0LnByZXZlbnREZWZhdWx0KCksd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpLHRoaXMub3B0aW9ucy5jb250aW51b3VzP2k9W3RoaXMuY2lyY2xlKG8rMSksbyx0aGlzLmNpcmNsZShvLTEpXToodGhpcy50b3VjaERlbHRhLng9ZS89IW8mJmU+MHx8bz09PXRoaXMubnVtLTEmJmU8MD9NYXRoLmFicyhlKS90aGlzLnNsaWRlV2lkdGgrMToxLGk9W29dLG8mJmkucHVzaChvLTEpLG88dGhpcy5udW0tMSYmaS51bnNoaWZ0KG8rMSkpO2kubGVuZ3RoOylvPWkucG9wKCksdGhpcy50cmFuc2xhdGVYKG8sZSt0aGlzLnBvc2l0aW9uc1tvXSwwKX0sb250b3VjaGVuZDpmdW5jdGlvbih0KXt0aGlzLm9wdGlvbnMuc3RvcFRvdWNoRXZlbnRzUHJvcGFnYXRpb24mJnRoaXMuc3RvcFByb3BhZ2F0aW9uKHQpO3ZhciBlLGkscyxuLG8scj10aGlzLmluZGV4LGw9dGhpcy5vcHRpb25zLnRyYW5zaXRpb25TcGVlZCxhPXRoaXMuc2xpZGVXaWR0aCxoPU51bWJlcihEYXRlLm5vdygpLXRoaXMudG91Y2hTdGFydC50aW1lKTwyNTAsZD1oJiZNYXRoLmFicyh0aGlzLnRvdWNoRGVsdGEueCk+MjB8fE1hdGguYWJzKHRoaXMudG91Y2hEZWx0YS54KT5hLzIsYz0hciYmdGhpcy50b3VjaERlbHRhLng+MHx8cj09PXRoaXMubnVtLTEmJnRoaXMudG91Y2hEZWx0YS54PDAsdT0hZCYmdGhpcy5vcHRpb25zLmNsb3NlT25Td2lwZVVwT3JEb3duJiYoaCYmTWF0aC5hYnModGhpcy50b3VjaERlbHRhLnkpPjIwfHxNYXRoLmFicyh0aGlzLnRvdWNoRGVsdGEueSk+dGhpcy5zbGlkZUhlaWdodC8yKTt0aGlzLm9wdGlvbnMuY29udGludW91cyYmKGM9ITEpLGU9dGhpcy50b3VjaERlbHRhLng8MD8tMToxLHRoaXMuaXNTY3JvbGxpbmc/dT90aGlzLmNsb3NlKCk6dGhpcy50cmFuc2xhdGVZKHIsMCxsKTpkJiYhYz8oaT1yK2Uscz1yLWUsbj1hKmUsbz0tYSplLHRoaXMub3B0aW9ucy5jb250aW51b3VzPyh0aGlzLm1vdmUodGhpcy5jaXJjbGUoaSksbiwwKSx0aGlzLm1vdmUodGhpcy5jaXJjbGUoci0yKmUpLG8sMCkpOmk+PTAmJmk8dGhpcy5udW0mJnRoaXMubW92ZShpLG4sMCksdGhpcy5tb3ZlKHIsdGhpcy5wb3NpdGlvbnNbcl0rbixsKSx0aGlzLm1vdmUodGhpcy5jaXJjbGUocyksdGhpcy5wb3NpdGlvbnNbdGhpcy5jaXJjbGUocyldK24sbCkscj10aGlzLmNpcmNsZShzKSx0aGlzLm9uc2xpZGUocikpOnRoaXMub3B0aW9ucy5jb250aW51b3VzPyh0aGlzLm1vdmUodGhpcy5jaXJjbGUoci0xKSwtYSxsKSx0aGlzLm1vdmUociwwLGwpLHRoaXMubW92ZSh0aGlzLmNpcmNsZShyKzEpLGEsbCkpOihyJiZ0aGlzLm1vdmUoci0xLC1hLGwpLHRoaXMubW92ZShyLDAsbCkscjx0aGlzLm51bS0xJiZ0aGlzLm1vdmUocisxLGEsbCkpfSxvbnRvdWNoY2FuY2VsOmZ1bmN0aW9uKHQpe3RoaXMudG91Y2hTdGFydCYmKHRoaXMub250b3VjaGVuZCh0KSxkZWxldGUgdGhpcy50b3VjaFN0YXJ0KX0sb250cmFuc2l0aW9uZW5kOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuc2xpZGVzW3RoaXMuaW5kZXhdO3QmJmUhPT10LnRhcmdldHx8KHRoaXMuaW50ZXJ2YWwmJnRoaXMucGxheSgpLHRoaXMuc2V0VGltZW91dCh0aGlzLm9wdGlvbnMub25zbGlkZWVuZCxbdGhpcy5pbmRleCxlXSkpfSxvbmNvbXBsZXRlOmZ1bmN0aW9uKGUpe3ZhciBpLHM9ZS50YXJnZXR8fGUuc3JjRWxlbWVudCxuPXMmJnMucGFyZW50Tm9kZTtzJiZuJiYoaT10aGlzLmdldE5vZGVJbmRleChuKSx0KG4pLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5zbGlkZUxvYWRpbmdDbGFzcyksXCJlcnJvclwiPT09ZS50eXBlPyh0KG4pLmFkZENsYXNzKHRoaXMub3B0aW9ucy5zbGlkZUVycm9yQ2xhc3MpLHRoaXMuZWxlbWVudHNbaV09Myk6dGhpcy5lbGVtZW50c1tpXT0yLHMuY2xpZW50SGVpZ2h0PnRoaXMuY29udGFpbmVyWzBdLmNsaWVudEhlaWdodCYmKHMuc3R5bGUubWF4SGVpZ2h0PXRoaXMuY29udGFpbmVyWzBdLmNsaWVudEhlaWdodCksdGhpcy5pbnRlcnZhbCYmdGhpcy5zbGlkZXNbdGhpcy5pbmRleF09PT1uJiZ0aGlzLnBsYXkoKSx0aGlzLnNldFRpbWVvdXQodGhpcy5vcHRpb25zLm9uc2xpZGVjb21wbGV0ZSxbaSxuXSkpfSxvbmxvYWQ6ZnVuY3Rpb24odCl7dGhpcy5vbmNvbXBsZXRlKHQpfSxvbmVycm9yOmZ1bmN0aW9uKHQpe3RoaXMub25jb21wbGV0ZSh0KX0sb25rZXlkb3duOmZ1bmN0aW9uKHQpe3N3aXRjaCh0LndoaWNofHx0LmtleUNvZGUpe2Nhc2UgMTM6dGhpcy5vcHRpb25zLnRvZ2dsZUNvbnRyb2xzT25SZXR1cm4mJih0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMudG9nZ2xlQ29udHJvbHMoKSk7YnJlYWs7Y2FzZSAyNzp0aGlzLm9wdGlvbnMuY2xvc2VPbkVzY2FwZSYmKHRoaXMuY2xvc2UoKSx0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpKTticmVhaztjYXNlIDMyOnRoaXMub3B0aW9ucy50b2dnbGVTbGlkZXNob3dPblNwYWNlJiYodGhpcy5wcmV2ZW50RGVmYXVsdCh0KSx0aGlzLnRvZ2dsZVNsaWRlc2hvdygpKTticmVhaztjYXNlIDM3OnRoaXMub3B0aW9ucy5lbmFibGVLZXlib2FyZE5hdmlnYXRpb24mJih0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMucHJldigpKTticmVhaztjYXNlIDM5OnRoaXMub3B0aW9ucy5lbmFibGVLZXlib2FyZE5hdmlnYXRpb24mJih0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMubmV4dCgpKX19LGhhbmRsZUNsaWNrOmZ1bmN0aW9uKGUpe2Z1bmN0aW9uIGkoZSl7cmV0dXJuIHQobikuaGFzQ2xhc3MoZSl8fHQobykuaGFzQ2xhc3MoZSl9dmFyIHM9dGhpcy5vcHRpb25zLG49ZS50YXJnZXR8fGUuc3JjRWxlbWVudCxvPW4ucGFyZW50Tm9kZTtpKHMudG9nZ2xlQ2xhc3MpPyh0aGlzLnByZXZlbnREZWZhdWx0KGUpLHRoaXMudG9nZ2xlQ29udHJvbHMoKSk6aShzLnByZXZDbGFzcyk/KHRoaXMucHJldmVudERlZmF1bHQoZSksdGhpcy5wcmV2KCkpOmkocy5uZXh0Q2xhc3MpPyh0aGlzLnByZXZlbnREZWZhdWx0KGUpLHRoaXMubmV4dCgpKTppKHMuY2xvc2VDbGFzcyk/KHRoaXMucHJldmVudERlZmF1bHQoZSksdGhpcy5jbG9zZSgpKTppKHMucGxheVBhdXNlQ2xhc3MpPyh0aGlzLnByZXZlbnREZWZhdWx0KGUpLHRoaXMudG9nZ2xlU2xpZGVzaG93KCkpOm89PT10aGlzLnNsaWRlc0NvbnRhaW5lclswXT9zLmNsb3NlT25TbGlkZUNsaWNrPyh0aGlzLnByZXZlbnREZWZhdWx0KGUpLHRoaXMuY2xvc2UoKSk6cy50b2dnbGVDb250cm9sc09uU2xpZGVDbGljayYmKHRoaXMucHJldmVudERlZmF1bHQoZSksdGhpcy50b2dnbGVDb250cm9scygpKTpvLnBhcmVudE5vZGUmJm8ucGFyZW50Tm9kZT09PXRoaXMuc2xpZGVzQ29udGFpbmVyWzBdJiZzLnRvZ2dsZUNvbnRyb2xzT25TbGlkZUNsaWNrJiYodGhpcy5wcmV2ZW50RGVmYXVsdChlKSx0aGlzLnRvZ2dsZUNvbnRyb2xzKCkpfSxvbmNsaWNrOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLm9wdGlvbnMuZW11bGF0ZVRvdWNoRXZlbnRzJiZ0aGlzLnRvdWNoRGVsdGEmJihNYXRoLmFicyh0aGlzLnRvdWNoRGVsdGEueCk+MjB8fE1hdGguYWJzKHRoaXMudG91Y2hEZWx0YS55KT4yMCk/dm9pZCBkZWxldGUgdGhpcy50b3VjaERlbHRhOnRoaXMuaGFuZGxlQ2xpY2sodCl9LHVwZGF0ZUVkZ2VDbGFzc2VzOmZ1bmN0aW9uKHQpe3Q/dGhpcy5jb250YWluZXIucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmxlZnRFZGdlQ2xhc3MpOnRoaXMuY29udGFpbmVyLmFkZENsYXNzKHRoaXMub3B0aW9ucy5sZWZ0RWRnZUNsYXNzKSx0PT09dGhpcy5udW0tMT90aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMucmlnaHRFZGdlQ2xhc3MpOnRoaXMuY29udGFpbmVyLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5yaWdodEVkZ2VDbGFzcyl9LGhhbmRsZVNsaWRlOmZ1bmN0aW9uKHQpe3RoaXMub3B0aW9ucy5jb250aW51b3VzfHx0aGlzLnVwZGF0ZUVkZ2VDbGFzc2VzKHQpLHRoaXMubG9hZEVsZW1lbnRzKHQpLHRoaXMub3B0aW9ucy51bmxvYWRFbGVtZW50cyYmdGhpcy51bmxvYWRFbGVtZW50cyh0KSx0aGlzLnNldFRpdGxlKHQpfSxvbnNsaWRlOmZ1bmN0aW9uKHQpe3RoaXMuaW5kZXg9dCx0aGlzLmhhbmRsZVNsaWRlKHQpLHRoaXMuc2V0VGltZW91dCh0aGlzLm9wdGlvbnMub25zbGlkZSxbdCx0aGlzLnNsaWRlc1t0XV0pfSxzZXRUaXRsZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLnNsaWRlc1t0XS5maXJzdENoaWxkLnRpdGxlLGk9dGhpcy50aXRsZUVsZW1lbnQ7aS5sZW5ndGgmJih0aGlzLnRpdGxlRWxlbWVudC5lbXB0eSgpLGUmJmlbMF0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZSkpKX0sc2V0VGltZW91dDpmdW5jdGlvbih0LGUsaSl7dmFyIHM9dGhpcztyZXR1cm4gdCYmd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXt0LmFwcGx5KHMsZXx8W10pfSxpfHwwKX0saW1hZ2VGYWN0b3J5OmZ1bmN0aW9uKGUsaSl7ZnVuY3Rpb24gcyhlKXtpZighbil7aWYoZT17dHlwZTplLnR5cGUsdGFyZ2V0Om99LCFvLnBhcmVudE5vZGUpcmV0dXJuIGwuc2V0VGltZW91dChzLFtlXSk7bj0hMCx0KGEpLm9mZihcImxvYWQgZXJyb3JcIixzKSxkJiZcImxvYWRcIj09PWUudHlwZSYmKG8uc3R5bGUuYmFja2dyb3VuZD0ndXJsKFwiJytoKydcIikgY2VudGVyIG5vLXJlcGVhdCcsby5zdHlsZS5iYWNrZ3JvdW5kU2l6ZT1kKSxpKGUpfX12YXIgbixvLHIsbD10aGlzLGE9dGhpcy5pbWFnZVByb3RvdHlwZS5jbG9uZU5vZGUoITEpLGg9ZSxkPXRoaXMub3B0aW9ucy5zdHJldGNoSW1hZ2VzO3JldHVyblwic3RyaW5nXCIhPXR5cGVvZiBoJiYoaD10aGlzLmdldEl0ZW1Qcm9wZXJ0eShlLHRoaXMub3B0aW9ucy51cmxQcm9wZXJ0eSkscj10aGlzLmdldEl0ZW1Qcm9wZXJ0eShlLHRoaXMub3B0aW9ucy50aXRsZVByb3BlcnR5KSksZD09PSEwJiYoZD1cImNvbnRhaW5cIiksZD10aGlzLnN1cHBvcnQuYmFja2dyb3VuZFNpemUmJnRoaXMuc3VwcG9ydC5iYWNrZ3JvdW5kU2l6ZVtkXSYmZCxkP289dGhpcy5lbGVtZW50UHJvdG90eXBlLmNsb25lTm9kZSghMSk6KG89YSxhLmRyYWdnYWJsZT0hMSksciYmKG8udGl0bGU9ciksdChhKS5vbihcImxvYWQgZXJyb3JcIixzKSxhLnNyYz1oLG99LGNyZWF0ZUVsZW1lbnQ6ZnVuY3Rpb24oZSxpKXt2YXIgcz1lJiZ0aGlzLmdldEl0ZW1Qcm9wZXJ0eShlLHRoaXMub3B0aW9ucy50eXBlUHJvcGVydHkpLG49cyYmdGhpc1tzLnNwbGl0KFwiL1wiKVswXStcIkZhY3RvcnlcIl18fHRoaXMuaW1hZ2VGYWN0b3J5LG89ZSYmbi5jYWxsKHRoaXMsZSxpKSxyPXRoaXMuZ2V0SXRlbVByb3BlcnR5KGUsdGhpcy5vcHRpb25zLnNyY3NldFByb3BlcnR5KTtyZXR1cm4gb3x8KG89dGhpcy5lbGVtZW50UHJvdG90eXBlLmNsb25lTm9kZSghMSksdGhpcy5zZXRUaW1lb3V0KGksW3t0eXBlOlwiZXJyb3JcIix0YXJnZXQ6b31dKSksciYmby5zZXRBdHRyaWJ1dGUoXCJzcmNzZXRcIixyKSx0KG8pLmFkZENsYXNzKHRoaXMub3B0aW9ucy5zbGlkZUNvbnRlbnRDbGFzcyksb30sbG9hZEVsZW1lbnQ6ZnVuY3Rpb24oZSl7dGhpcy5lbGVtZW50c1tlXXx8KHRoaXMuc2xpZGVzW2VdLmZpcnN0Q2hpbGQ/dGhpcy5lbGVtZW50c1tlXT10KHRoaXMuc2xpZGVzW2VdKS5oYXNDbGFzcyh0aGlzLm9wdGlvbnMuc2xpZGVFcnJvckNsYXNzKT8zOjI6KHRoaXMuZWxlbWVudHNbZV09MSx0KHRoaXMuc2xpZGVzW2VdKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuc2xpZGVMb2FkaW5nQ2xhc3MpLHRoaXMuc2xpZGVzW2VdLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlRWxlbWVudCh0aGlzLmxpc3RbZV0sdGhpcy5wcm94eUxpc3RlbmVyKSkpKX0sbG9hZEVsZW1lbnRzOmZ1bmN0aW9uKHQpe3ZhciBlLGk9TWF0aC5taW4odGhpcy5udW0sMip0aGlzLm9wdGlvbnMucHJlbG9hZFJhbmdlKzEpLHM9dDtmb3IoZT0wO2U8aTtlKz0xKXMrPWUqKGUlMj09PTA/LTE6MSkscz10aGlzLmNpcmNsZShzKSx0aGlzLmxvYWRFbGVtZW50KHMpfSx1bmxvYWRFbGVtZW50czpmdW5jdGlvbih0KXt2YXIgZSxpO2ZvcihlIGluIHRoaXMuZWxlbWVudHMpdGhpcy5lbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShlKSYmKGk9TWF0aC5hYnModC1lKSxpPnRoaXMub3B0aW9ucy5wcmVsb2FkUmFuZ2UmJmkrdGhpcy5vcHRpb25zLnByZWxvYWRSYW5nZTx0aGlzLm51bSYmKHRoaXMudW5sb2FkU2xpZGUoZSksZGVsZXRlIHRoaXMuZWxlbWVudHNbZV0pKX0sYWRkU2xpZGU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5zbGlkZVByb3RvdHlwZS5jbG9uZU5vZGUoITEpO2Uuc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLHQpLHRoaXMuc2xpZGVzQ29udGFpbmVyWzBdLmFwcGVuZENoaWxkKGUpLHRoaXMuc2xpZGVzLnB1c2goZSl9LHBvc2l0aW9uU2xpZGU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5zbGlkZXNbdF07ZS5zdHlsZS53aWR0aD10aGlzLnNsaWRlV2lkdGgrXCJweFwiLHRoaXMuc3VwcG9ydC50cmFuc2Zvcm0mJihlLnN0eWxlLmxlZnQ9dCotdGhpcy5zbGlkZVdpZHRoK1wicHhcIix0aGlzLm1vdmUodCx0aGlzLmluZGV4PnQ/LXRoaXMuc2xpZGVXaWR0aDp0aGlzLmluZGV4PHQ/dGhpcy5zbGlkZVdpZHRoOjAsMCkpfSxpbml0U2xpZGVzOmZ1bmN0aW9uKGUpe3ZhciBpLHM7Zm9yKGV8fCh0aGlzLnBvc2l0aW9ucz1bXSx0aGlzLnBvc2l0aW9ucy5sZW5ndGg9dGhpcy5udW0sdGhpcy5lbGVtZW50cz17fSx0aGlzLmltYWdlUHJvdG90eXBlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiksdGhpcy5lbGVtZW50UHJvdG90eXBlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksdGhpcy5zbGlkZVByb3RvdHlwZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLHQodGhpcy5zbGlkZVByb3RvdHlwZSkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLnNsaWRlQ2xhc3MpLHRoaXMuc2xpZGVzPXRoaXMuc2xpZGVzQ29udGFpbmVyWzBdLmNoaWxkcmVuLGk9dGhpcy5vcHRpb25zLmNsZWFyU2xpZGVzfHx0aGlzLnNsaWRlcy5sZW5ndGghPT10aGlzLm51bSksdGhpcy5zbGlkZVdpZHRoPXRoaXMuY29udGFpbmVyWzBdLm9mZnNldFdpZHRoLHRoaXMuc2xpZGVIZWlnaHQ9dGhpcy5jb250YWluZXJbMF0ub2Zmc2V0SGVpZ2h0LHRoaXMuc2xpZGVzQ29udGFpbmVyWzBdLnN0eWxlLndpZHRoPXRoaXMubnVtKnRoaXMuc2xpZGVXaWR0aCtcInB4XCIsaSYmdGhpcy5yZXNldFNsaWRlcygpLHM9MDtzPHRoaXMubnVtO3MrPTEpaSYmdGhpcy5hZGRTbGlkZShzKSx0aGlzLnBvc2l0aW9uU2xpZGUocyk7dGhpcy5vcHRpb25zLmNvbnRpbnVvdXMmJnRoaXMuc3VwcG9ydC50cmFuc2Zvcm0mJih0aGlzLm1vdmUodGhpcy5jaXJjbGUodGhpcy5pbmRleC0xKSwtdGhpcy5zbGlkZVdpZHRoLDApLHRoaXMubW92ZSh0aGlzLmNpcmNsZSh0aGlzLmluZGV4KzEpLHRoaXMuc2xpZGVXaWR0aCwwKSksdGhpcy5zdXBwb3J0LnRyYW5zZm9ybXx8KHRoaXMuc2xpZGVzQ29udGFpbmVyWzBdLnN0eWxlLmxlZnQ9dGhpcy5pbmRleCotdGhpcy5zbGlkZVdpZHRoK1wicHhcIil9LHVubG9hZFNsaWRlOmZ1bmN0aW9uKHQpe3ZhciBlLGk7ZT10aGlzLnNsaWRlc1t0XSxpPWUuZmlyc3RDaGlsZCxudWxsIT09aSYmZS5yZW1vdmVDaGlsZChpKX0sdW5sb2FkQWxsU2xpZGVzOmZ1bmN0aW9uKCl7dmFyIHQsZTtmb3IodD0wLGU9dGhpcy5zbGlkZXMubGVuZ3RoO3Q8ZTt0KyspdGhpcy51bmxvYWRTbGlkZSh0KX0sdG9nZ2xlQ29udHJvbHM6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLm9wdGlvbnMuY29udHJvbHNDbGFzczt0aGlzLmNvbnRhaW5lci5oYXNDbGFzcyh0KT90aGlzLmNvbnRhaW5lci5yZW1vdmVDbGFzcyh0KTp0aGlzLmNvbnRhaW5lci5hZGRDbGFzcyh0KX0sdG9nZ2xlU2xpZGVzaG93OmZ1bmN0aW9uKCl7dGhpcy5pbnRlcnZhbD90aGlzLnBhdXNlKCk6dGhpcy5wbGF5KCl9LGdldE5vZGVJbmRleDpmdW5jdGlvbih0KXtyZXR1cm4gcGFyc2VJbnQodC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIpLDEwKX0sZ2V0TmVzdGVkUHJvcGVydHk6ZnVuY3Rpb24odCxlKXtyZXR1cm4gZS5yZXBsYWNlKC9cXFsoPzonKFteJ10rKSd8XCIoW15cIl0rKVwifChcXGQrKSlcXF18KD86KD86XnxcXC4pKFteXFwuXFxbXSspKS9nLGZ1bmN0aW9uKGUsaSxzLG4sbyl7dmFyIHI9b3x8aXx8c3x8biYmcGFyc2VJbnQobiwxMCk7ZSYmdCYmKHQ9dFtyXSl9KSx0fSxnZXREYXRhUHJvcGVydHk6ZnVuY3Rpb24oZSxpKXtpZihlLmdldEF0dHJpYnV0ZSl7dmFyIHM9ZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLVwiK2kucmVwbGFjZSgvKFtBLVpdKS9nLFwiLSQxXCIpLnRvTG93ZXJDYXNlKCkpO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBzKXtpZigvXih0cnVlfGZhbHNlfG51bGx8LT9cXGQrKFxcLlxcZCspP3xcXHtbXFxzXFxTXSpcXH18XFxbW1xcc1xcU10qXFxdKSQvLnRlc3QocykpdHJ5e3JldHVybiB0LnBhcnNlSlNPTihzKX1jYXRjaCh0KXt9cmV0dXJuIHN9fX0sZ2V0SXRlbVByb3BlcnR5OmZ1bmN0aW9uKHQsZSl7dmFyIGk9dFtlXTtyZXR1cm4gdm9pZCAwPT09aSYmKGk9dGhpcy5nZXREYXRhUHJvcGVydHkodCxlKSx2b2lkIDA9PT1pJiYoaT10aGlzLmdldE5lc3RlZFByb3BlcnR5KHQsZSkpKSxpfSxpbml0U3RhcnRJbmRleDpmdW5jdGlvbigpe3ZhciB0LGU9dGhpcy5vcHRpb25zLmluZGV4LGk9dGhpcy5vcHRpb25zLnVybFByb3BlcnR5O2lmKGUmJlwibnVtYmVyXCIhPXR5cGVvZiBlKWZvcih0PTA7dDx0aGlzLm51bTt0Kz0xKWlmKHRoaXMubGlzdFt0XT09PWV8fHRoaXMuZ2V0SXRlbVByb3BlcnR5KHRoaXMubGlzdFt0XSxpKT09PXRoaXMuZ2V0SXRlbVByb3BlcnR5KGUsaSkpe2U9dDticmVha310aGlzLmluZGV4PXRoaXMuY2lyY2xlKHBhcnNlSW50KGUsMTApfHwwKX0saW5pdEV2ZW50TGlzdGVuZXJzOmZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXt2YXIgZT1pLnN1cHBvcnQudHJhbnNpdGlvbiYmaS5zdXBwb3J0LnRyYW5zaXRpb24uZW5kPT09dC50eXBlP1widHJhbnNpdGlvbmVuZFwiOnQudHlwZTtpW1wib25cIitlXSh0KX12YXIgaT10aGlzLHM9dGhpcy5zbGlkZXNDb250YWluZXI7dCh3aW5kb3cpLm9uKFwicmVzaXplXCIsZSksdChkb2N1bWVudC5ib2R5KS5vbihcImtleWRvd25cIixlKSx0aGlzLmNvbnRhaW5lci5vbihcImNsaWNrXCIsZSksdGhpcy5zdXBwb3J0LnRvdWNoP3Mub24oXCJ0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbFwiLGUpOnRoaXMub3B0aW9ucy5lbXVsYXRlVG91Y2hFdmVudHMmJnRoaXMuc3VwcG9ydC50cmFuc2l0aW9uJiZzLm9uKFwibW91c2Vkb3duIG1vdXNlbW92ZSBtb3VzZXVwIG1vdXNlb3V0XCIsZSksdGhpcy5zdXBwb3J0LnRyYW5zaXRpb24mJnMub24odGhpcy5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLGUpLHRoaXMucHJveHlMaXN0ZW5lcj1lfSxkZXN0cm95RXZlbnRMaXN0ZW5lcnM6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLnNsaWRlc0NvbnRhaW5lcixpPXRoaXMucHJveHlMaXN0ZW5lcjt0KHdpbmRvdykub2ZmKFwicmVzaXplXCIsaSksdChkb2N1bWVudC5ib2R5KS5vZmYoXCJrZXlkb3duXCIsaSksdGhpcy5jb250YWluZXIub2ZmKFwiY2xpY2tcIixpKSx0aGlzLnN1cHBvcnQudG91Y2g/ZS5vZmYoXCJ0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbFwiLGkpOnRoaXMub3B0aW9ucy5lbXVsYXRlVG91Y2hFdmVudHMmJnRoaXMuc3VwcG9ydC50cmFuc2l0aW9uJiZlLm9mZihcIm1vdXNlZG93biBtb3VzZW1vdmUgbW91c2V1cCBtb3VzZW91dFwiLGkpLHRoaXMuc3VwcG9ydC50cmFuc2l0aW9uJiZlLm9mZih0aGlzLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsaSl9LGhhbmRsZU9wZW46ZnVuY3Rpb24oKXt0aGlzLm9wdGlvbnMub25vcGVuZWQmJnRoaXMub3B0aW9ucy5vbm9wZW5lZC5jYWxsKHRoaXMpfSxpbml0V2lkZ2V0OmZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXt0LnRhcmdldD09PWkuY29udGFpbmVyWzBdJiYoaS5jb250YWluZXIub2ZmKGkuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxlKSxpLmhhbmRsZU9wZW4oKSl9dmFyIGk9dGhpcztyZXR1cm4gdGhpcy5jb250YWluZXI9dCh0aGlzLm9wdGlvbnMuY29udGFpbmVyKSx0aGlzLmNvbnRhaW5lci5sZW5ndGg/KHRoaXMuc2xpZGVzQ29udGFpbmVyPXRoaXMuY29udGFpbmVyLmZpbmQodGhpcy5vcHRpb25zLnNsaWRlc0NvbnRhaW5lcikuZmlyc3QoKSx0aGlzLnNsaWRlc0NvbnRhaW5lci5sZW5ndGg/KHRoaXMudGl0bGVFbGVtZW50PXRoaXMuY29udGFpbmVyLmZpbmQodGhpcy5vcHRpb25zLnRpdGxlRWxlbWVudCkuZmlyc3QoKSwxPT09dGhpcy5udW0mJnRoaXMuY29udGFpbmVyLmFkZENsYXNzKHRoaXMub3B0aW9ucy5zaW5nbGVDbGFzcyksdGhpcy5vcHRpb25zLm9ub3BlbiYmdGhpcy5vcHRpb25zLm9ub3Blbi5jYWxsKHRoaXMpLHRoaXMuc3VwcG9ydC50cmFuc2l0aW9uJiZ0aGlzLm9wdGlvbnMuZGlzcGxheVRyYW5zaXRpb24/dGhpcy5jb250YWluZXIub24odGhpcy5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLGUpOnRoaXMuaGFuZGxlT3BlbigpLHRoaXMub3B0aW9ucy5oaWRlUGFnZVNjcm9sbGJhcnMmJih0aGlzLmJvZHlPdmVyZmxvd1N0eWxlPWRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3csZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiKSx0aGlzLmNvbnRhaW5lclswXS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIix0aGlzLmluaXRTbGlkZXMoKSx2b2lkIHRoaXMuY29udGFpbmVyLmFkZENsYXNzKHRoaXMub3B0aW9ucy5kaXNwbGF5Q2xhc3MpKToodGhpcy5jb25zb2xlLmxvZyhcImJsdWVpbXAgR2FsbGVyeTogU2xpZGVzIGNvbnRhaW5lciBub3QgZm91bmQuXCIsdGhpcy5vcHRpb25zLnNsaWRlc0NvbnRhaW5lciksITEpKToodGhpcy5jb25zb2xlLmxvZyhcImJsdWVpbXAgR2FsbGVyeTogV2lkZ2V0IGNvbnRhaW5lciBub3QgZm91bmQuXCIsdGhpcy5vcHRpb25zLmNvbnRhaW5lciksITEpfSxpbml0T3B0aW9uczpmdW5jdGlvbihlKXt0aGlzLm9wdGlvbnM9dC5leHRlbmQoe30sdGhpcy5vcHRpb25zKSwoZSYmZS5jYXJvdXNlbHx8dGhpcy5vcHRpb25zLmNhcm91c2VsJiYoIWV8fGUuY2Fyb3VzZWwhPT0hMSkpJiZ0LmV4dGVuZCh0aGlzLm9wdGlvbnMsdGhpcy5jYXJvdXNlbE9wdGlvbnMpLHQuZXh0ZW5kKHRoaXMub3B0aW9ucyxlKSx0aGlzLm51bTwzJiYodGhpcy5vcHRpb25zLmNvbnRpbnVvdXM9ISF0aGlzLm9wdGlvbnMuY29udGludW91cyYmbnVsbCksdGhpcy5zdXBwb3J0LnRyYW5zaXRpb258fCh0aGlzLm9wdGlvbnMuZW11bGF0ZVRvdWNoRXZlbnRzPSExKSx0aGlzLm9wdGlvbnMuZXZlbnQmJnRoaXMucHJldmVudERlZmF1bHQodGhpcy5vcHRpb25zLmV2ZW50KX19KSxlfSksZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCIuL2JsdWVpbXAtaGVscGVyXCIsXCIuL2JsdWVpbXAtZ2FsbGVyeVwiXSx0KTp0KHdpbmRvdy5ibHVlaW1wLmhlbHBlcnx8d2luZG93LmpRdWVyeSx3aW5kb3cuYmx1ZWltcC5HYWxsZXJ5KX0oZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjt0LmV4dGVuZChlLnByb3RvdHlwZS5vcHRpb25zLHtmdWxsU2NyZWVuOiExfSk7dmFyIGk9ZS5wcm90b3R5cGUuaW5pdGlhbGl6ZSxzPWUucHJvdG90eXBlLmNsb3NlO3JldHVybiB0LmV4dGVuZChlLnByb3RvdHlwZSx7Z2V0RnVsbFNjcmVlbkVsZW1lbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnR8fGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50fHxkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudHx8ZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudH0scmVxdWVzdEZ1bGxTY3JlZW46ZnVuY3Rpb24odCl7dC5yZXF1ZXN0RnVsbHNjcmVlbj90LnJlcXVlc3RGdWxsc2NyZWVuKCk6dC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbj90LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk6dC5tb3pSZXF1ZXN0RnVsbFNjcmVlbj90Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk6dC5tc1JlcXVlc3RGdWxsc2NyZWVuJiZ0Lm1zUmVxdWVzdEZ1bGxzY3JlZW4oKX0sZXhpdEZ1bGxTY3JlZW46ZnVuY3Rpb24oKXtkb2N1bWVudC5leGl0RnVsbHNjcmVlbj9kb2N1bWVudC5leGl0RnVsbHNjcmVlbigpOmRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4/ZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbigpOmRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4/ZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpOmRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4mJmRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4oKX0saW5pdGlhbGl6ZTpmdW5jdGlvbigpe2kuY2FsbCh0aGlzKSx0aGlzLm9wdGlvbnMuZnVsbFNjcmVlbiYmIXRoaXMuZ2V0RnVsbFNjcmVlbkVsZW1lbnQoKSYmdGhpcy5yZXF1ZXN0RnVsbFNjcmVlbih0aGlzLmNvbnRhaW5lclswXSl9LGNsb3NlOmZ1bmN0aW9uKCl7dGhpcy5nZXRGdWxsU2NyZWVuRWxlbWVudCgpPT09dGhpcy5jb250YWluZXJbMF0mJnRoaXMuZXhpdEZ1bGxTY3JlZW4oKSxzLmNhbGwodGhpcyl9fSksZX0pLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiLi9ibHVlaW1wLWhlbHBlclwiLFwiLi9ibHVlaW1wLWdhbGxlcnlcIl0sdCk6dCh3aW5kb3cuYmx1ZWltcC5oZWxwZXJ8fHdpbmRvdy5qUXVlcnksd2luZG93LmJsdWVpbXAuR2FsbGVyeSl9KGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7dC5leHRlbmQoZS5wcm90b3R5cGUub3B0aW9ucyx7aW5kaWNhdG9yQ29udGFpbmVyOlwib2xcIixhY3RpdmVJbmRpY2F0b3JDbGFzczpcImFjdGl2ZVwiLHRodW1ibmFpbFByb3BlcnR5OlwidGh1bWJuYWlsXCIsdGh1bWJuYWlsSW5kaWNhdG9yczohMH0pO3ZhciBpPWUucHJvdG90eXBlLmluaXRTbGlkZXMscz1lLnByb3RvdHlwZS5hZGRTbGlkZSxuPWUucHJvdG90eXBlLnJlc2V0U2xpZGVzLG89ZS5wcm90b3R5cGUuaGFuZGxlQ2xpY2sscj1lLnByb3RvdHlwZS5oYW5kbGVTbGlkZSxsPWUucHJvdG90eXBlLmhhbmRsZUNsb3NlO3JldHVybiB0LmV4dGVuZChlLnByb3RvdHlwZSx7Y3JlYXRlSW5kaWNhdG9yOmZ1bmN0aW9uKGUpe3ZhciBpLHMsbj10aGlzLmluZGljYXRvclByb3RvdHlwZS5jbG9uZU5vZGUoITEpLG89dGhpcy5nZXRJdGVtUHJvcGVydHkoZSx0aGlzLm9wdGlvbnMudGl0bGVQcm9wZXJ0eSkscj10aGlzLm9wdGlvbnMudGh1bWJuYWlsUHJvcGVydHk7cmV0dXJuIHRoaXMub3B0aW9ucy50aHVtYm5haWxJbmRpY2F0b3JzJiYociYmKGk9dGhpcy5nZXRJdGVtUHJvcGVydHkoZSxyKSksdm9pZCAwPT09aSYmKHM9ZS5nZXRFbGVtZW50c0J5VGFnTmFtZSYmdChlKS5maW5kKFwiaW1nXCIpWzBdLHMmJihpPXMuc3JjKSksaSYmKG4uc3R5bGUuYmFja2dyb3VuZEltYWdlPSd1cmwoXCInK2krJ1wiKScpKSxvJiYobi50aXRsZT1vKSxufSxhZGRJbmRpY2F0b3I6ZnVuY3Rpb24odCl7aWYodGhpcy5pbmRpY2F0b3JDb250YWluZXIubGVuZ3RoKXt2YXIgZT10aGlzLmNyZWF0ZUluZGljYXRvcih0aGlzLmxpc3RbdF0pO2Uuc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLHQpLHRoaXMuaW5kaWNhdG9yQ29udGFpbmVyWzBdLmFwcGVuZENoaWxkKGUpLHRoaXMuaW5kaWNhdG9ycy5wdXNoKGUpfX0sc2V0QWN0aXZlSW5kaWNhdG9yOmZ1bmN0aW9uKGUpe3RoaXMuaW5kaWNhdG9ycyYmKHRoaXMuYWN0aXZlSW5kaWNhdG9yJiZ0aGlzLmFjdGl2ZUluZGljYXRvci5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuYWN0aXZlSW5kaWNhdG9yQ2xhc3MpLHRoaXMuYWN0aXZlSW5kaWNhdG9yPXQodGhpcy5pbmRpY2F0b3JzW2VdKSx0aGlzLmFjdGl2ZUluZGljYXRvci5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuYWN0aXZlSW5kaWNhdG9yQ2xhc3MpKX0saW5pdFNsaWRlczpmdW5jdGlvbih0KXt0fHwodGhpcy5pbmRpY2F0b3JDb250YWluZXI9dGhpcy5jb250YWluZXIuZmluZCh0aGlzLm9wdGlvbnMuaW5kaWNhdG9yQ29udGFpbmVyKSx0aGlzLmluZGljYXRvckNvbnRhaW5lci5sZW5ndGgmJih0aGlzLmluZGljYXRvclByb3RvdHlwZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIiksdGhpcy5pbmRpY2F0b3JzPXRoaXMuaW5kaWNhdG9yQ29udGFpbmVyWzBdLmNoaWxkcmVuKSksaS5jYWxsKHRoaXMsdCl9LGFkZFNsaWRlOmZ1bmN0aW9uKHQpe3MuY2FsbCh0aGlzLHQpLHRoaXMuYWRkSW5kaWNhdG9yKHQpfSxyZXNldFNsaWRlczpmdW5jdGlvbigpe24uY2FsbCh0aGlzKSx0aGlzLmluZGljYXRvckNvbnRhaW5lci5lbXB0eSgpLHRoaXMuaW5kaWNhdG9ycz1bXX0saGFuZGxlQ2xpY2s6ZnVuY3Rpb24odCl7dmFyIGU9dC50YXJnZXR8fHQuc3JjRWxlbWVudCxpPWUucGFyZW50Tm9kZTtpZihpPT09dGhpcy5pbmRpY2F0b3JDb250YWluZXJbMF0pdGhpcy5wcmV2ZW50RGVmYXVsdCh0KSx0aGlzLnNsaWRlKHRoaXMuZ2V0Tm9kZUluZGV4KGUpKTtlbHNle2lmKGkucGFyZW50Tm9kZSE9PXRoaXMuaW5kaWNhdG9yQ29udGFpbmVyWzBdKXJldHVybiBvLmNhbGwodGhpcyx0KTt0aGlzLnByZXZlbnREZWZhdWx0KHQpLHRoaXMuc2xpZGUodGhpcy5nZXROb2RlSW5kZXgoaSkpfX0saGFuZGxlU2xpZGU6ZnVuY3Rpb24odCl7ci5jYWxsKHRoaXMsdCksdGhpcy5zZXRBY3RpdmVJbmRpY2F0b3IodCl9LGhhbmRsZUNsb3NlOmZ1bmN0aW9uKCl7dGhpcy5hY3RpdmVJbmRpY2F0b3ImJnRoaXMuYWN0aXZlSW5kaWNhdG9yLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5hY3RpdmVJbmRpY2F0b3JDbGFzcyksbC5jYWxsKHRoaXMpfX0pLGV9KSxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcIi4vYmx1ZWltcC1oZWxwZXJcIixcIi4vYmx1ZWltcC1nYWxsZXJ5XCJdLHQpOnQod2luZG93LmJsdWVpbXAuaGVscGVyfHx3aW5kb3cualF1ZXJ5LHdpbmRvdy5ibHVlaW1wLkdhbGxlcnkpfShmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO3QuZXh0ZW5kKGUucHJvdG90eXBlLm9wdGlvbnMse3ZpZGVvQ29udGVudENsYXNzOlwidmlkZW8tY29udGVudFwiLHZpZGVvTG9hZGluZ0NsYXNzOlwidmlkZW8tbG9hZGluZ1wiLHZpZGVvUGxheWluZ0NsYXNzOlwidmlkZW8tcGxheWluZ1wiLHZpZGVvUG9zdGVyUHJvcGVydHk6XCJwb3N0ZXJcIix2aWRlb1NvdXJjZXNQcm9wZXJ0eTpcInNvdXJjZXNcIn0pO3ZhciBpPWUucHJvdG90eXBlLmhhbmRsZVNsaWRlO3JldHVybiB0LmV4dGVuZChlLnByb3RvdHlwZSx7aGFuZGxlU2xpZGU6ZnVuY3Rpb24odCl7aS5jYWxsKHRoaXMsdCksdGhpcy5wbGF5aW5nVmlkZW8mJnRoaXMucGxheWluZ1ZpZGVvLnBhdXNlKCl9LHZpZGVvRmFjdG9yeTpmdW5jdGlvbihlLGkscyl7dmFyIG4sbyxyLGwsYSxoPXRoaXMsZD10aGlzLm9wdGlvbnMsYz10aGlzLmVsZW1lbnRQcm90b3R5cGUuY2xvbmVOb2RlKCExKSx1PXQoYykscD1be3R5cGU6XCJlcnJvclwiLHRhcmdldDpjfV0sbT1zfHxkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidmlkZW9cIikseT10aGlzLmdldEl0ZW1Qcm9wZXJ0eShlLGQudXJsUHJvcGVydHkpLGY9dGhpcy5nZXRJdGVtUHJvcGVydHkoZSxkLnR5cGVQcm9wZXJ0eSksZz10aGlzLmdldEl0ZW1Qcm9wZXJ0eShlLGQudGl0bGVQcm9wZXJ0eSksdj10aGlzLmdldEl0ZW1Qcm9wZXJ0eShlLGQudmlkZW9Qb3N0ZXJQcm9wZXJ0eSksQz10aGlzLmdldEl0ZW1Qcm9wZXJ0eShlLGQudmlkZW9Tb3VyY2VzUHJvcGVydHkpO2lmKHUuYWRkQ2xhc3MoZC52aWRlb0NvbnRlbnRDbGFzcyksZyYmKGMudGl0bGU9ZyksbS5jYW5QbGF5VHlwZSlpZih5JiZmJiZtLmNhblBsYXlUeXBlKGYpKW0uc3JjPXk7ZWxzZSBpZihDKWZvcig7Qy5sZW5ndGg7KWlmKG89Qy5zaGlmdCgpLHk9dGhpcy5nZXRJdGVtUHJvcGVydHkobyxkLnVybFByb3BlcnR5KSxmPXRoaXMuZ2V0SXRlbVByb3BlcnR5KG8sZC50eXBlUHJvcGVydHkpLHkmJmYmJm0uY2FuUGxheVR5cGUoZikpe20uc3JjPXk7YnJlYWt9cmV0dXJuIHYmJihtLnBvc3Rlcj12LG49dGhpcy5pbWFnZVByb3RvdHlwZS5jbG9uZU5vZGUoITEpLHQobikuYWRkQ2xhc3MoZC50b2dnbGVDbGFzcyksbi5zcmM9dixuLmRyYWdnYWJsZT0hMSxjLmFwcGVuZENoaWxkKG4pKSxyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpLHIuc2V0QXR0cmlidXRlKFwidGFyZ2V0XCIsXCJfYmxhbmtcIiksc3x8ci5zZXRBdHRyaWJ1dGUoXCJkb3dubG9hZFwiLGcpLHIuaHJlZj15LG0uc3JjJiYobS5jb250cm9scz0hMCwoc3x8dChtKSkub24oXCJlcnJvclwiLGZ1bmN0aW9uKCl7aC5zZXRUaW1lb3V0KGkscCl9KS5vbihcInBhdXNlXCIsZnVuY3Rpb24oKXttLnNlZWtpbmd8fChsPSExLHUucmVtb3ZlQ2xhc3MoaC5vcHRpb25zLnZpZGVvTG9hZGluZ0NsYXNzKS5yZW1vdmVDbGFzcyhoLm9wdGlvbnMudmlkZW9QbGF5aW5nQ2xhc3MpLGEmJmguY29udGFpbmVyLmFkZENsYXNzKGgub3B0aW9ucy5jb250cm9sc0NsYXNzKSxkZWxldGUgaC5wbGF5aW5nVmlkZW8saC5pbnRlcnZhbCYmaC5wbGF5KCkpfSkub24oXCJwbGF5aW5nXCIsZnVuY3Rpb24oKXtsPSExLHUucmVtb3ZlQ2xhc3MoaC5vcHRpb25zLnZpZGVvTG9hZGluZ0NsYXNzKS5hZGRDbGFzcyhoLm9wdGlvbnMudmlkZW9QbGF5aW5nQ2xhc3MpLGguY29udGFpbmVyLmhhc0NsYXNzKGgub3B0aW9ucy5jb250cm9sc0NsYXNzKT8oYT0hMCxoLmNvbnRhaW5lci5yZW1vdmVDbGFzcyhoLm9wdGlvbnMuY29udHJvbHNDbGFzcykpOmE9ITF9KS5vbihcInBsYXlcIixmdW5jdGlvbigpe3dpbmRvdy5jbGVhclRpbWVvdXQoaC50aW1lb3V0KSxsPSEwLHUuYWRkQ2xhc3MoaC5vcHRpb25zLnZpZGVvTG9hZGluZ0NsYXNzKSxoLnBsYXlpbmdWaWRlbz1tfSksdChyKS5vbihcImNsaWNrXCIsZnVuY3Rpb24odCl7aC5wcmV2ZW50RGVmYXVsdCh0KSxsP20ucGF1c2UoKTptLnBsYXkoKX0pLGMuYXBwZW5kQ2hpbGQocyYmcy5lbGVtZW50fHxtKSksYy5hcHBlbmRDaGlsZChyKSx0aGlzLnNldFRpbWVvdXQoaSxbe3R5cGU6XCJsb2FkXCIsdGFyZ2V0OmN9XSksY319KSxlfSksZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCIuL2JsdWVpbXAtaGVscGVyXCIsXCIuL2JsdWVpbXAtZ2FsbGVyeS12aWRlb1wiXSx0KTp0KHdpbmRvdy5ibHVlaW1wLmhlbHBlcnx8d2luZG93LmpRdWVyeSx3aW5kb3cuYmx1ZWltcC5HYWxsZXJ5KX0oZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtpZighd2luZG93LnBvc3RNZXNzYWdlKXJldHVybiBlO3QuZXh0ZW5kKGUucHJvdG90eXBlLm9wdGlvbnMse3ZpbWVvVmlkZW9JZFByb3BlcnR5OlwidmltZW9cIix2aW1lb1BsYXllclVybDpcIi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby9WSURFT19JRD9hcGk9MSZwbGF5ZXJfaWQ9UExBWUVSX0lEXCIsdmltZW9QbGF5ZXJJZFByZWZpeDpcInZpbWVvLXBsYXllci1cIix2aW1lb0NsaWNrVG9QbGF5OiEwfSk7dmFyIGk9ZS5wcm90b3R5cGUudGV4dEZhY3Rvcnl8fGUucHJvdG90eXBlLmltYWdlRmFjdG9yeSxzPWZ1bmN0aW9uKHQsZSxpLHMpe3RoaXMudXJsPXQsdGhpcy52aWRlb0lkPWUsdGhpcy5wbGF5ZXJJZD1pLHRoaXMuY2xpY2tUb1BsYXk9cyx0aGlzLmVsZW1lbnQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSx0aGlzLmxpc3RlbmVycz17fX0sbj0wO3JldHVybiB0LmV4dGVuZChzLnByb3RvdHlwZSx7Y2FuUGxheVR5cGU6ZnVuY3Rpb24oKXtyZXR1cm4hMH0sb246ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5saXN0ZW5lcnNbdF09ZSx0aGlzfSxsb2FkQVBJOmZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpeyFzJiZuLnBsYXlPblJlYWR5JiZuLnBsYXkoKSxzPSEwfWZvcih2YXIgaSxzLG49dGhpcyxvPVwiLy9mLnZpbWVvY2RuLmNvbS9qcy9mcm9vZ2Fsb29wMi5taW4uanNcIixyPWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpLGw9ci5sZW5ndGg7bDspaWYobC09MSxyW2xdLnNyYz09PW8pe2k9cltsXTticmVha31pfHwoaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpLGkuc3JjPW8pLHQoaSkub24oXCJsb2FkXCIsZSksclswXS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShpLHJbMF0pLC9sb2FkZWR8Y29tcGxldGUvLnRlc3QoaS5yZWFkeVN0YXRlKSYmZSgpfSxvblJlYWR5OmZ1bmN0aW9uKCl7dmFyIHQ9dGhpczt0aGlzLnJlYWR5PSEwLHRoaXMucGxheWVyLmFkZEV2ZW50KFwicGxheVwiLGZ1bmN0aW9uKCl7dC5oYXNQbGF5ZWQ9ITAsdC5vblBsYXlpbmcoKX0pLHRoaXMucGxheWVyLmFkZEV2ZW50KFwicGF1c2VcIixmdW5jdGlvbigpe3Qub25QYXVzZSgpfSksdGhpcy5wbGF5ZXIuYWRkRXZlbnQoXCJmaW5pc2hcIixmdW5jdGlvbigpe3Qub25QYXVzZSgpfSksdGhpcy5wbGF5T25SZWFkeSYmdGhpcy5wbGF5KCl9LG9uUGxheWluZzpmdW5jdGlvbigpe3RoaXMucGxheVN0YXR1czwyJiYodGhpcy5saXN0ZW5lcnMucGxheWluZygpLHRoaXMucGxheVN0YXR1cz0yKX0sb25QYXVzZTpmdW5jdGlvbigpe3RoaXMubGlzdGVuZXJzLnBhdXNlKCksZGVsZXRlIHRoaXMucGxheVN0YXR1c30saW5zZXJ0SWZyYW1lOmZ1bmN0aW9uKCl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTt0LnNyYz10aGlzLnVybC5yZXBsYWNlKFwiVklERU9fSURcIix0aGlzLnZpZGVvSWQpLnJlcGxhY2UoXCJQTEFZRVJfSURcIix0aGlzLnBsYXllcklkKSx0LmlkPXRoaXMucGxheWVySWQsdGhpcy5lbGVtZW50LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHQsdGhpcy5lbGVtZW50KSx0aGlzLmVsZW1lbnQ9dH0scGxheTpmdW5jdGlvbigpe3ZhciB0PXRoaXM7dGhpcy5wbGF5U3RhdHVzfHwodGhpcy5saXN0ZW5lcnMucGxheSgpLHRoaXMucGxheVN0YXR1cz0xKSx0aGlzLnJlYWR5PyF0aGlzLmhhc1BsYXllZCYmKHRoaXMuY2xpY2tUb1BsYXl8fHdpbmRvdy5uYXZpZ2F0b3ImJi9pUChob25lfG9kfGFkKS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnBsYXRmb3JtKSk/dGhpcy5vblBsYXlpbmcoKTp0aGlzLnBsYXllci5hcGkoXCJwbGF5XCIpOih0aGlzLnBsYXlPblJlYWR5PSEwLHdpbmRvdy4kZj90aGlzLnBsYXllcnx8KHRoaXMuaW5zZXJ0SWZyYW1lKCksdGhpcy5wbGF5ZXI9JGYodGhpcy5lbGVtZW50KSx0aGlzLnBsYXllci5hZGRFdmVudChcInJlYWR5XCIsZnVuY3Rpb24oKXt0Lm9uUmVhZHkoKX0pKTp0aGlzLmxvYWRBUEkoKSl9LHBhdXNlOmZ1bmN0aW9uKCl7dGhpcy5yZWFkeT90aGlzLnBsYXllci5hcGkoXCJwYXVzZVwiKTp0aGlzLnBsYXlTdGF0dXMmJihkZWxldGUgdGhpcy5wbGF5T25SZWFkeSx0aGlzLmxpc3RlbmVycy5wYXVzZSgpLGRlbGV0ZSB0aGlzLnBsYXlTdGF0dXMpfX0pLHQuZXh0ZW5kKGUucHJvdG90eXBlLHtWaW1lb1BsYXllcjpzLHRleHRGYWN0b3J5OmZ1bmN0aW9uKHQsZSl7dmFyIG89dGhpcy5vcHRpb25zLHI9dGhpcy5nZXRJdGVtUHJvcGVydHkodCxvLnZpbWVvVmlkZW9JZFByb3BlcnR5KTtyZXR1cm4gcj8odm9pZCAwPT09dGhpcy5nZXRJdGVtUHJvcGVydHkodCxvLnVybFByb3BlcnR5KSYmKHRbby51cmxQcm9wZXJ0eV09XCIvL3ZpbWVvLmNvbS9cIityKSxuKz0xLHRoaXMudmlkZW9GYWN0b3J5KHQsZSxuZXcgcyhvLnZpbWVvUGxheWVyVXJsLHIsby52aW1lb1BsYXllcklkUHJlZml4K24sby52aW1lb0NsaWNrVG9QbGF5KSkpOmkuY2FsbCh0aGlzLHQsZSl9fSksZX0pLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiLi9ibHVlaW1wLWhlbHBlclwiLFwiLi9ibHVlaW1wLWdhbGxlcnktdmlkZW9cIl0sdCk6dCh3aW5kb3cuYmx1ZWltcC5oZWxwZXJ8fHdpbmRvdy5qUXVlcnksd2luZG93LmJsdWVpbXAuR2FsbGVyeSl9KGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7aWYoIXdpbmRvdy5wb3N0TWVzc2FnZSlyZXR1cm4gZTt0LmV4dGVuZChlLnByb3RvdHlwZS5vcHRpb25zLHt5b3VUdWJlVmlkZW9JZFByb3BlcnR5OlwieW91dHViZVwiLHlvdVR1YmVQbGF5ZXJWYXJzOnt3bW9kZTpcInRyYW5zcGFyZW50XCJ9LHlvdVR1YmVDbGlja1RvUGxheTohMH0pO3ZhciBpPWUucHJvdG90eXBlLnRleHRGYWN0b3J5fHxlLnByb3RvdHlwZS5pbWFnZUZhY3Rvcnkscz1mdW5jdGlvbih0LGUsaSl7dGhpcy52aWRlb0lkPXQsdGhpcy5wbGF5ZXJWYXJzPWUsdGhpcy5jbGlja1RvUGxheT1pLHRoaXMuZWxlbWVudD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLHRoaXMubGlzdGVuZXJzPXt9fTtyZXR1cm4gdC5leHRlbmQocy5wcm90b3R5cGUse2NhblBsYXlUeXBlOmZ1bmN0aW9uKCl7cmV0dXJuITB9LG9uOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMubGlzdGVuZXJzW3RdPWUsdGhpc30sbG9hZEFQSTpmdW5jdGlvbigpe3ZhciB0LGU9dGhpcyxpPXdpbmRvdy5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSxzPVwiLy93d3cueW91dHViZS5jb20vaWZyYW1lX2FwaVwiLG49ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIiksbz1uLmxlbmd0aDtmb3Iod2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5PWZ1bmN0aW9uKCl7aSYmaS5hcHBseSh0aGlzKSxlLnBsYXlPblJlYWR5JiZlLnBsYXkoKX07bzspaWYoby09MSxuW29dLnNyYz09PXMpcmV0dXJuO3Q9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSx0LnNyYz1zLG5bMF0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodCxuWzBdKX0sb25SZWFkeTpmdW5jdGlvbigpe3RoaXMucmVhZHk9ITAsdGhpcy5wbGF5T25SZWFkeSYmdGhpcy5wbGF5KCl9LG9uUGxheWluZzpmdW5jdGlvbigpe3RoaXMucGxheVN0YXR1czwyJiYodGhpcy5saXN0ZW5lcnMucGxheWluZygpLHRoaXMucGxheVN0YXR1cz0yKX0sb25QYXVzZTpmdW5jdGlvbigpe2UucHJvdG90eXBlLnNldFRpbWVvdXQuY2FsbCh0aGlzLHRoaXMuY2hlY2tTZWVrLG51bGwsMmUzKX0sY2hlY2tTZWVrOmZ1bmN0aW9uKCl7dGhpcy5zdGF0ZUNoYW5nZSE9PVlULlBsYXllclN0YXRlLlBBVVNFRCYmdGhpcy5zdGF0ZUNoYW5nZSE9PVlULlBsYXllclN0YXRlLkVOREVEfHwodGhpcy5saXN0ZW5lcnMucGF1c2UoKSxkZWxldGUgdGhpcy5wbGF5U3RhdHVzKX0sb25TdGF0ZUNoYW5nZTpmdW5jdGlvbih0KXtzd2l0Y2godC5kYXRhKXtjYXNlIFlULlBsYXllclN0YXRlLlBMQVlJTkc6dGhpcy5oYXNQbGF5ZWQ9ITAsdGhpcy5vblBsYXlpbmcoKTticmVhaztjYXNlIFlULlBsYXllclN0YXRlLlBBVVNFRDpjYXNlIFlULlBsYXllclN0YXRlLkVOREVEOnRoaXMub25QYXVzZSgpfXRoaXMuc3RhdGVDaGFuZ2U9dC5kYXRhfSxvbkVycm9yOmZ1bmN0aW9uKHQpe3RoaXMubGlzdGVuZXJzLmVycm9yKHQpfSxwbGF5OmZ1bmN0aW9uKCl7dmFyIHQ9dGhpczt0aGlzLnBsYXlTdGF0dXN8fCh0aGlzLmxpc3RlbmVycy5wbGF5KCksdGhpcy5wbGF5U3RhdHVzPTEpLHRoaXMucmVhZHk/IXRoaXMuaGFzUGxheWVkJiYodGhpcy5jbGlja1RvUGxheXx8d2luZG93Lm5hdmlnYXRvciYmL2lQKGhvbmV8b2R8YWQpLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IucGxhdGZvcm0pKT90aGlzLm9uUGxheWluZygpOnRoaXMucGxheWVyLnBsYXlWaWRlbygpOih0aGlzLnBsYXlPblJlYWR5PSEwLFxud2luZG93LllUJiZZVC5QbGF5ZXI/dGhpcy5wbGF5ZXJ8fCh0aGlzLnBsYXllcj1uZXcgWVQuUGxheWVyKHRoaXMuZWxlbWVudCx7dmlkZW9JZDp0aGlzLnZpZGVvSWQscGxheWVyVmFyczp0aGlzLnBsYXllclZhcnMsZXZlbnRzOntvblJlYWR5OmZ1bmN0aW9uKCl7dC5vblJlYWR5KCl9LG9uU3RhdGVDaGFuZ2U6ZnVuY3Rpb24oZSl7dC5vblN0YXRlQ2hhbmdlKGUpfSxvbkVycm9yOmZ1bmN0aW9uKGUpe3Qub25FcnJvcihlKX19fSkpOnRoaXMubG9hZEFQSSgpKX0scGF1c2U6ZnVuY3Rpb24oKXt0aGlzLnJlYWR5P3RoaXMucGxheWVyLnBhdXNlVmlkZW8oKTp0aGlzLnBsYXlTdGF0dXMmJihkZWxldGUgdGhpcy5wbGF5T25SZWFkeSx0aGlzLmxpc3RlbmVycy5wYXVzZSgpLGRlbGV0ZSB0aGlzLnBsYXlTdGF0dXMpfX0pLHQuZXh0ZW5kKGUucHJvdG90eXBlLHtZb3VUdWJlUGxheWVyOnMsdGV4dEZhY3Rvcnk6ZnVuY3Rpb24odCxlKXt2YXIgbj10aGlzLm9wdGlvbnMsbz10aGlzLmdldEl0ZW1Qcm9wZXJ0eSh0LG4ueW91VHViZVZpZGVvSWRQcm9wZXJ0eSk7cmV0dXJuIG8/KHZvaWQgMD09PXRoaXMuZ2V0SXRlbVByb3BlcnR5KHQsbi51cmxQcm9wZXJ0eSkmJih0W24udXJsUHJvcGVydHldPVwiLy93d3cueW91dHViZS5jb20vd2F0Y2g/dj1cIitvKSx2b2lkIDA9PT10aGlzLmdldEl0ZW1Qcm9wZXJ0eSh0LG4udmlkZW9Qb3N0ZXJQcm9wZXJ0eSkmJih0W24udmlkZW9Qb3N0ZXJQcm9wZXJ0eV09XCIvL2ltZy55b3V0dWJlLmNvbS92aS9cIitvK1wiL21heHJlc2RlZmF1bHQuanBnXCIpLHRoaXMudmlkZW9GYWN0b3J5KHQsZSxuZXcgcyhvLG4ueW91VHViZVBsYXllclZhcnMsbi55b3VUdWJlQ2xpY2tUb1BsYXkpKSk6aS5jYWxsKHRoaXMsdCxlKX19KSxlfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ibHVlaW1wLWdhbGxlcnkubWluLmpzLm1hcCIsIi8qIVxuICoganF1ZXJ5Lm9rYXlOYXYuanMgMi4wLjQgKGh0dHBzOi8vZ2l0aHViLmNvbS9WUGVua292L29rYXlOYXYpXG4gKiBBdXRob3I6IFZlcmdpbCBQZW5rb3YgKGh0dHA6Ly92ZXJnaWxwZW5rb3YuY29tLylcbiAqIE1JVCBsaWNlbnNlOiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICovXG5cbjtcbihmdW5jdGlvbihmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7IC8vIEFNRFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyb290LCBqUXVlcnkpIHsgLy8gTm9kZS9Db21tb25KU1xuICAgICAgICAgICAgaWYgKGpRdWVyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpKHJvb3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZhY3RvcnkoalF1ZXJ5KTtcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnk7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9yeShqUXVlcnkpOyAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICB9XG59KGZ1bmN0aW9uKCQpIHtcbiAgICAvLyBEZWZhdWx0c1xuXG4gICAgdmFyIG9rYXlOYXYgPSAnb2theU5hdicsXG4gICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgcGFyZW50OiAnJywgLy8gd2lsbCBjYWxsIG5hdidzIHBhcmVudCgpIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgIHRvZ2dsZV9pY29uX2NsYXNzOiAnb2theU5hdl9fbWVudS10b2dnbGUnLFxuICAgICAgICAgICAgdG9nZ2xlX2ljb25fY29udGVudDogJzxzcGFuIC8+PHNwYW4gLz48c3BhbiAvPicsXG4gICAgICAgICAgICBhbGlnbl9yaWdodDogdHJ1ZSwgLy8gSWYgZmFsc2UsIHRoZSBtZW51IGFuZCB0aGUga2ViYWIgaWNvbiB3aWxsIGJlIG9uIHRoZSBsZWZ0XG4gICAgICAgICAgICBzd2lwZV9lbmFibGVkOiB0cnVlLCAvLyBJZiB0cnVlLCB5b3UnbGwgYmUgYWJsZSB0byBzd2lwZSBsZWZ0L3JpZ2h0IHRvIG9wZW4gdGhlIG5hdmlnYXRpb25cbiAgICAgICAgICAgIHRocmVzaG9sZDogNTAsIC8vIE5hdiB3aWxsIGF1dG8gb3Blbi9jbG9zZSBpZiBzd2lwZWQgPj0gdGhpcyBtYW55IHBlcmNlbnRcbiAgICAgICAgICAgIHJlc2l6ZV9kZWxheTogMTAsIC8vIFdoZW4gcmVzaXppbmcgdGhlIHdpbmRvdywgb2theU5hdiBjYW4gdGhyb3R0bGUgaXRzIHJlY2FsY3VsYXRpb25zIGlmIGVuYWJsZWQuIFNldHRpbmcgdGhpcyB0byA1MC0yNTAgd2lsbCBpbXByb3ZlIHBlcmZvcm1hbmNlIGJ1dCBtYWtlIG9rYXlOYXYgbGVzcyBhY2N1cmF0ZS5cbiAgICAgICAgICAgIGJlZm9yZU9wZW46IGZ1bmN0aW9uKCkge30sIC8vIFdpbGwgdHJpZ2dlciBiZWZvcmUgdGhlIG5hdiBnZXRzIG9wZW5lZFxuICAgICAgICAgICAgYWZ0ZXJPcGVuOiBmdW5jdGlvbigpIHt9LCAvLyBXaWxsIHRyaWdnZXIgYWZ0ZXIgdGhlIG5hdiBnZXRzIG9wZW5lZFxuICAgICAgICAgICAgYmVmb3JlQ2xvc2U6IGZ1bmN0aW9uKCkge30sIC8vIFdpbGwgdHJpZ2dlciBiZWZvcmUgdGhlIG5hdiBnZXRzIGNsb3NlZFxuICAgICAgICAgICAgYWZ0ZXJDbG9zZTogZnVuY3Rpb24oKSB7fSwgLy8gV2lsbCB0cmlnZ2VyIGFmdGVyIHRoZSBuYXYgZ2V0cyBjbG9zZWRcbiAgICAgICAgICAgIGl0ZW1IaWRkZW46IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICAgICBpdGVtRGlzcGxheWVkOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH07XG5cbiAgICAvLyBCZWdpblxuICAgIGZ1bmN0aW9uIFBsdWdpbihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgICBzZWxmLm5hdmlnYXRpb24gPSAkKGVsZW1lbnQpO1xuICAgICAgICBzZWxmLmRvY3VtZW50ID0gJChkb2N1bWVudCk7XG4gICAgICAgIHNlbGYud2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgICAgIHRoaXMub3B0aW9ucy5wYXJlbnQgPT0gJycgPyB0aGlzLm9wdGlvbnMucGFyZW50ID0gc2VsZi5uYXZpZ2F0aW9uLnBhcmVudCgpIDogJyc7XG5cbiAgICAgICAgc2VsZi5uYXZfb3BlbiA9IGZhbHNlOyAvLyBTdG9yZSB0aGUgc3RhdGUgb2YgdGhlIGhpZGRlbiBuYXZcbiAgICAgICAgc2VsZi5wYXJlbnRfZnVsbF93aWR0aCA9IDA7XG5cbiAgICAgICAgLy8gU3dpcGUgc3R1ZmZcbiAgICAgICAgc2VsZi5yYWRDb2VmID0gMTgwIC8gTWF0aC5QSTtcbiAgICAgICAgc2VsZi5zVG91Y2ggPSB7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogMFxuICAgICAgICB9O1xuICAgICAgICBzZWxmLmNUb3VjaCA9IHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwXG4gICAgICAgIH07XG4gICAgICAgIHNlbGYuc1RpbWUgPSAwO1xuICAgICAgICBzZWxmLm5hdl9wb3NpdGlvbiA9IDA7XG4gICAgICAgIHNlbGYucGVyY2VudF9vcGVuID0gMDtcbiAgICAgICAgc2VsZi5uYXZfbW92aW5nID0gZmFsc2U7XG5cblxuICAgICAgICBzZWxmLmluaXQoKTtcbiAgICB9XG5cbiAgICAkLmV4dGVuZChQbHVnaW4ucHJvdG90eXBlLCB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnb2theU5hdi1sb2FkZWQnKTtcblxuICAgICAgICAgICAgLy8gQWRkIGNsYXNzZXNcbiAgICAgICAgICAgIHNlbGYubmF2aWdhdGlvblxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnb2theU5hdiBsb2FkZWQnKVxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbigndWwnKS5hZGRDbGFzcygnb2theU5hdl9fbmF2LS12aXNpYmxlJyk7XG5cbiAgICAgICAgICAgIC8vIEFwcGVuZCBlbGVtZW50c1xuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5hbGlnbl9yaWdodCkge1xuICAgICAgICAgICAgICAgIHNlbGYubmF2aWdhdGlvblxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCc8dWwgY2xhc3M9XCJva2F5TmF2X19uYXYtLWludmlzaWJsZSB0cmFuc2l0aW9uLWVuYWJsZWQgbmF2LXJpZ2h0XCIgLz4nKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCc8YSBocmVmPVwiI1wiIGNsYXNzPVwiJyArIHNlbGYub3B0aW9ucy50b2dnbGVfaWNvbl9jbGFzcyArICcgb2theS1pbnZpc2libGVcIj4nICsgc2VsZi5vcHRpb25zLnRvZ2dsZV9pY29uX2NvbnRlbnQgKyAnPC9hPicpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYubmF2aWdhdGlvblxuICAgICAgICAgICAgICAgICAgICAucHJlcGVuZCgnPHVsIGNsYXNzPVwib2theU5hdl9fbmF2LS1pbnZpc2libGUgdHJhbnNpdGlvbi1lbmFibGVkIG5hdi1sZWZ0XCIgLz4nKVxuICAgICAgICAgICAgICAgICAgICAucHJlcGVuZCgnPGEgaHJlZj1cIiNcIiBjbGFzcz1cIicgKyBzZWxmLm9wdGlvbnMudG9nZ2xlX2ljb25fY2xhc3MgKyAnIG9rYXktaW52aXNpYmxlXCI+JyArIHNlbGYub3B0aW9ucy50b2dnbGVfaWNvbl9jb250ZW50ICsgJzwvYT4nKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDYWNoZSBuZXcgZWxlbWVudHMgZm9yIGZ1cnRoZXIgdXNlXG4gICAgICAgICAgICBzZWxmLm5hdl92aXNpYmxlID0gc2VsZi5uYXZpZ2F0aW9uLmNoaWxkcmVuKCcub2theU5hdl9fbmF2LS12aXNpYmxlJyk7XG4gICAgICAgICAgICBzZWxmLm5hdl9pbnZpc2libGUgPSBzZWxmLm5hdmlnYXRpb24uY2hpbGRyZW4oJy5va2F5TmF2X19uYXYtLWludmlzaWJsZScpO1xuICAgICAgICAgICAgc2VsZi50b2dnbGVfaWNvbiA9IHNlbGYubmF2aWdhdGlvbi5jaGlsZHJlbignLicgKyBzZWxmLm9wdGlvbnMudG9nZ2xlX2ljb25fY2xhc3MpO1xuXG4gICAgICAgICAgICBzZWxmLnRvZ2dsZV9pY29uX3dpZHRoID0gc2VsZi50b2dnbGVfaWNvbi5vdXRlcldpZHRoKHRydWUpO1xuICAgICAgICAgICAgc2VsZi5kZWZhdWx0X3dpZHRoID0gc2VsZi5nZXRDaGlsZHJlbldpZHRoKHNlbGYubmF2aWdhdGlvbik7XG4gICAgICAgICAgICBzZWxmLnBhcmVudF9mdWxsX3dpZHRoID0gJChzZWxmLm9wdGlvbnMucGFyZW50KS5vdXRlcldpZHRoKHRydWUpO1xuICAgICAgICAgICAgc2VsZi5sYXN0X3Zpc2libGVfY2hpbGRfd2lkdGggPSAwOyAvLyBXZSdsbCBkZWZpbmUgdGhpcyBsYXRlclxuXG4gICAgICAgICAgICAvLyBFdmVudHMgYXJlIHVwIG9uY2UgZXZlcnl0aGluZyBpcyBzZXRcbiAgICAgICAgICAgIHNlbGYuaW5pdEV2ZW50cygpO1xuXG4gICAgICAgICAgICAvLyBUcmltIHdoaXRlIHNwYWNlcyBiZXR3ZWVuIHZpc2libGUgbmF2IGVsZW1lbnRzXG4gICAgICAgICAgICBzZWxmLm5hdl92aXNpYmxlLmNvbnRlbnRzKCkuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGVUeXBlID0gTm9kZS5URVhUX05PREUgJiYgL1xcUy8udGVzdCh0aGlzLm5vZGVWYWx1ZSkgPT09IGZhbHNlO1xuICAgICAgICAgICAgfSkucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuc3dpcGVfZW5hYmxlZCA9PSB0cnVlKSBzZWxmLmluaXRTd2lwZUV2ZW50cygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRFdmVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgLy8gVG9nZ2xlIGhpZGRlbiBuYXYgd2hlbiBoYW1idXJnZXIgaWNvbiBpcyBjbGlja2VkIGFuZFxuICAgICAgICAgICAgLy8gQ29sbGFwc2UgaGlkZGVuIG5hdiBvbiBjbGljayBvdXRzaWRlIHRoZSBoZWFkZXJcbiAgICAgICAgICAgIHNlbGYuZG9jdW1lbnQub24oJ2NsaWNrLm9rYXlOYXYnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90YXJnZXQgPSAkKGUudGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm5hdl9vcGVuID09PSB0cnVlICYmIF90YXJnZXQuY2xvc2VzdCgnLm9rYXlOYXYnKS5sZW5ndGggPT0gMClcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jbG9zZUludmlzaWJsZU5hdigpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBzZWxmLnRvZ2dsZV9pY29uLmdldCgwKSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudG9nZ2xlSW52aXNpYmxlTmF2KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvcHRpbWl6ZVJlc2l6ZSA9IHNlbGYuX2RlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNlbGYucmVjYWxjTmF2KClcbiAgICAgICAgICAgIH0sIHNlbGYub3B0aW9ucy5yZXNpemVfZGVsYXkpO1xuICAgICAgICAgICAgc2VsZi53aW5kb3cub24oJ2xvYWQub2theU5hdiByZXNpemUub2theU5hdicsIG9wdGltaXplUmVzaXplKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0U3dpcGVFdmVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi5kb2N1bWVudFxuICAgICAgICAgICAgICAgIC5vbigndG91Y2hzdGFydC5va2F5TmF2JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm5hdl9pbnZpc2libGUucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tZW5hYmxlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vVHJpZ2dlciBvbmx5IG9uIHRvdWNoIHdpdGggb25lIGZpbmdlclxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b3VjaCA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgodG91Y2gucGFnZVggPCAyNSAmJiBzZWxmLm9wdGlvbnMuYWxpZ25fcmlnaHQgPT0gZmFsc2UpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b3VjaC5wYWdlWCA+ICgkKHNlbGYub3B0aW9ucy5wYXJlbnQpLm91dGVyV2lkdGgodHJ1ZSkgLSAyNSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub3B0aW9ucy5hbGlnbl9yaWdodCA9PSB0cnVlKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm5hdl9vcGVuID09PSB0cnVlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNUb3VjaC54ID0gc2VsZi5jVG91Y2gueCA9IHRvdWNoLnBhZ2VYO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc1RvdWNoLnkgPSBzZWxmLmNUb3VjaC55ID0gdG91Y2gucGFnZVk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zVGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKCd0b3VjaG1vdmUub2theU5hdicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvdWNoID0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF07XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3RyaWdnZXJNb3ZlKHRvdWNoLnBhZ2VYLCB0b3VjaC5wYWdlWSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubmF2X21vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub24oJ3RvdWNoZW5kLm9rYXlOYXYnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc1RvdWNoID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IDBcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jVG91Y2ggPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogMFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNUaW1lID0gMDtcblxuICAgICAgICAgICAgICAgICAgICAvL0Nsb3NlIG1lbnUgaWYgbm90IHN3aXBlZCBlbm91Z2hcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYucGVyY2VudF9vcGVuID4gKDEwMCAtIHNlbGYub3B0aW9ucy50aHJlc2hvbGQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm5hdl9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNsb3NlSW52aXNpYmxlTmF2KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLm5hdl9tb3ZpbmcgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5uYXZfcG9zaXRpb24gPSBzZWxmLm5hdl9pbnZpc2libGUud2lkdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYub3BlbkludmlzaWJsZU5hdigpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5uYXZfbW92aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5uYXZfaW52aXNpYmxlLmFkZENsYXNzKCd0cmFuc2l0aW9uLWVuYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZ2V0RGlyZWN0aW9uOiBmdW5jdGlvbihkeCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbGlnbl9yaWdodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoZHggPiAwKSA/IC0xIDogMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChkeCA8IDApID8gLTEgOiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF90cmlnZ2VyTW92ZTogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICBzZWxmLmNUb3VjaC54ID0geDtcbiAgICAgICAgICAgIHNlbGYuY1RvdWNoLnkgPSB5O1xuXG4gICAgICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgdmFyIGR4ID0gKHNlbGYuY1RvdWNoLnggLSBzZWxmLnNUb3VjaC54KTtcbiAgICAgICAgICAgIHZhciBkeSA9IChzZWxmLmNUb3VjaC55IC0gc2VsZi5zVG91Y2gueSk7XG5cbiAgICAgICAgICAgIHZhciBvcHBvc2luZyA9IGR5ICogZHk7XG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIG9wcG9zaW5nKTtcbiAgICAgICAgICAgIC8vTGVuZ3RoIG9mIHRoZSBvcHBvc2luZyBzaWRlIG9mIHRoZSA5MGRlZyB0cmlhZ2xlXG4gICAgICAgICAgICB2YXIgZE9wcG9zaW5nID0gTWF0aC5zcXJ0KG9wcG9zaW5nKTtcblxuICAgICAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hc2luKE1hdGguc2luKGRPcHBvc2luZyAvIGRpc3RhbmNlKSkgKiBzZWxmLnJhZENvZWY7XG4gICAgICAgICAgICB2YXIgc3BlZWQgPSBkaXN0YW5jZSAvIChjdXJyZW50VGltZSAtIHNlbGYuc1RpbWUpO1xuXG4gICAgICAgICAgICAvL1NldCBuZXcgc3RhcnQgcG9zaXRpb25cbiAgICAgICAgICAgIHNlbGYuc1RvdWNoLnggPSB4O1xuICAgICAgICAgICAgc2VsZi5zVG91Y2gueSA9IHk7XG5cbiAgICAgICAgICAgIC8vUmVtb3ZlIGZhbHNlIHN3aXBlc1xuICAgICAgICAgICAgaWYgKGFuZ2xlIDwgMjApIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlyID0gc2VsZi5fZ2V0RGlyZWN0aW9uKGR4KTtcblxuICAgICAgICAgICAgICAgIHZhciBuZXdQb3MgPSBzZWxmLm5hdl9wb3NpdGlvbiArIGRpciAqIGRpc3RhbmNlO1xuICAgICAgICAgICAgICAgIHZhciBtZW51V2lkdGggPSBzZWxmLm5hdl9pbnZpc2libGUud2lkdGgoKTtcbiAgICAgICAgICAgICAgICB2YXIgb3ZlcmZsb3cgPSAwO1xuXG5cbiAgICAgICAgICAgICAgICBpZiAobmV3UG9zIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IC1uZXdQb3M7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdQb3MgPiBtZW51V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBtZW51V2lkdGggLSBuZXdQb3M7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHNpemUgPSBtZW51V2lkdGggLSAoc2VsZi5uYXZfcG9zaXRpb24gKyBkaXIgKiBkaXN0YW5jZSArIG92ZXJmbG93KTtcbiAgICAgICAgICAgICAgICB2YXIgdGhyZXNob2xkID0gKHNpemUgLyBtZW51V2lkdGgpICogMTAwO1xuXG4gICAgICAgICAgICAgICAgLy9TZXQgbmV3IHBvc2l0aW9uIGFuZCB0aHJlc2hvbGRcbiAgICAgICAgICAgICAgICBzZWxmLm5hdl9wb3NpdGlvbiArPSBkaXIgKiBkaXN0YW5jZSArIG92ZXJmbG93O1xuICAgICAgICAgICAgICAgIHNlbGYucGVyY2VudF9vcGVuID0gdGhyZXNob2xkO1xuXG4gICAgICAgICAgICAgICAgc2VsZi5uYXZfaW52aXNpYmxlLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVgoJyArIChzZWxmLm9wdGlvbnMuYWxpZ25fcmlnaHQgPyAxIDogLTEpICogdGhyZXNob2xkICsgJyUpJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKlxuICAgICAgICAgKiBBIGZldyBtZXRob2RzIHRvIGFsbG93IHdvcmtpbmcgd2l0aCBlbGVtZW50c1xuICAgICAgICAgKi9cbiAgICAgICAgZ2V0UGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucGFyZW50O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFZpc2libGVOYXY6IGZ1bmN0aW9uKCkgeyAvLyBWaXNpYmxlIG5hdmlnYXRpb25cbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5hdl92aXNpYmxlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEludmlzaWJsZU5hdjogZnVuY3Rpb24oKSB7IC8vIEhpZGRlbiBiZWhpbmQgdGhlIGtlYmFiIGljb25cbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5hdl9pbnZpc2libGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0TmF2VG9nZ2xlSWNvbjogZnVuY3Rpb24oKSB7IC8vIEtlYmFiIGljb25cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvZ2dsZV9pY29uO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE9wZXJhdGlvbnNcbiAgICAgICAgICovXG4gICAgICAgIF9kZWJvdW5jZTogZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICB2YXIgdGltZW91dDtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIG9wZW5JbnZpc2libGVOYXY6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAhc2VsZi5vcHRpb25zLmVuYWJsZV9zd2lwZSA/IHNlbGYub3B0aW9ucy5iZWZvcmVPcGVuLmNhbGwoKSA6ICcnO1xuXG4gICAgICAgICAgICBzZWxmLnRvZ2dsZV9pY29uLmFkZENsYXNzKCdpY29uLS1hY3RpdmUnKTtcbiAgICAgICAgICAgIHNlbGYubmF2X2ludmlzaWJsZS5hZGRDbGFzcygnbmF2LW9wZW4nKTtcbiAgICAgICAgICAgIHNlbGYubmF2X29wZW4gPSB0cnVlO1xuICAgICAgICAgICAgc2VsZi5uYXZfaW52aXNpYmxlLmNzcyh7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2VsZi5vcHRpb25zLmFmdGVyT3Blbi5jYWxsKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xvc2VJbnZpc2libGVOYXY6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgIXNlbGYub3B0aW9ucy5lbmFibGVfc3dpcGUgPyBzZWxmLm9wdGlvbnMuYmVmb3JlQ2xvc2UuY2FsbCgpIDogJyc7XG5cbiAgICAgICAgICAgIHNlbGYudG9nZ2xlX2ljb24ucmVtb3ZlQ2xhc3MoJ2ljb24tLWFjdGl2ZScpO1xuICAgICAgICAgICAgc2VsZi5uYXZfaW52aXNpYmxlLnJlbW92ZUNsYXNzKCduYXYtb3BlbicpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmFsaWduX3JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5uYXZfaW52aXNpYmxlLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLm5hdl9pbnZpc2libGUuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLm5hdl9vcGVuID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5hZnRlckNsb3NlLmNhbGwoKTtcbiAgICAgICAgfSxcblxuICAgICAgICB0b2dnbGVJbnZpc2libGVOYXY6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKCFzZWxmLm5hdl9vcGVuKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5vcGVuSW52aXNpYmxlTmF2KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuY2xvc2VJbnZpc2libGVOYXYoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIE1hdGggc3R1ZmZcbiAgICAgICAgICovXG4gICAgICAgIGdldENoaWxkcmVuV2lkdGg6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW5fd2lkdGggPSAwO1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gJChlbCkuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbl93aWR0aCArPSAkKGNoaWxkcmVuW2ldKS5vdXRlcldpZHRoKHRydWUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuX3dpZHRoO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFZpc2libGVJdGVtQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoJ2xpJywgdGhpcy5uYXZfdmlzaWJsZSkubGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICBnZXRIaWRkZW5JdGVtQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoJ2xpJywgdGhpcy5uYXZfaW52aXNpYmxlKS5sZW5ndGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVjYWxjTmF2OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciB3cmFwcGVyX3dpZHRoID0gJChzZWxmLm9wdGlvbnMucGFyZW50KS5vdXRlcldpZHRoKHRydWUpLFxuICAgICAgICAgICAgICAgIHNwYWNlX3Rha2VuID0gc2VsZi5nZXRDaGlsZHJlbldpZHRoKHNlbGYub3B0aW9ucy5wYXJlbnQpLFxuICAgICAgICAgICAgICAgIG5hdl9mdWxsX3dpZHRoID0gc2VsZi5uYXZpZ2F0aW9uLm91dGVyV2lkdGgodHJ1ZSksXG4gICAgICAgICAgICAgICAgdmlzaWJsZV9uYXZfaXRlbXMgPSBzZWxmLmdldFZpc2libGVJdGVtQ291bnQoKSxcbiAgICAgICAgICAgICAgICBjb2xsYXBzZV93aWR0aCA9IHNlbGYubmF2X3Zpc2libGUub3V0ZXJXaWR0aCh0cnVlKSArIHNlbGYudG9nZ2xlX2ljb25fd2lkdGgsXG4gICAgICAgICAgICAgICAgZXhwYW5kX3dpZHRoID0gc3BhY2VfdGFrZW4gKyBzZWxmLmxhc3RfdmlzaWJsZV9jaGlsZF93aWR0aCArIHNlbGYudG9nZ2xlX2ljb25fd2lkdGgsXG4gICAgICAgICAgICAgICAgZXhwYW5kQWxsX3dpZHRoID0gc3BhY2VfdGFrZW4gLSBuYXZfZnVsbF93aWR0aCArIHNlbGYuZGVmYXVsdF93aWR0aDtcblxuICAgICAgICAgICAgaWYgKHdyYXBwZXJfd2lkdGggPiBleHBhbmRBbGxfd2lkdGgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9leHBhbmRBbGxJdGVtcygpO1xuICAgICAgICAgICAgICAgIHNlbGYudG9nZ2xlX2ljb24uYWRkQ2xhc3MoJ29rYXktaW52aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmlzaWJsZV9uYXZfaXRlbXMgPiAwICYmXG4gICAgICAgICAgICAgICAgbmF2X2Z1bGxfd2lkdGggPD0gY29sbGFwc2Vfd2lkdGggJiZcbiAgICAgICAgICAgICAgICB3cmFwcGVyX3dpZHRoIDw9IGV4cGFuZF93aWR0aCkge1xuICAgICAgICAgICAgICAgIHNlbGYuX2NvbGxhcHNlTmF2SXRlbSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAod3JhcHBlcl93aWR0aCA+IGV4cGFuZF93aWR0aCArIHNlbGYudG9nZ2xlX2ljb25fd2lkdGggKyAxNSkge1xuICAgICAgICAgICAgICAgIHNlbGYuX2V4cGFuZE5hdkl0ZW0oKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBrZWJhYiBpY29uIGlmIG5vIGl0ZW1zIGFyZSBoaWRkZW5cbiAgICAgICAgICAgIHNlbGYuZ2V0SGlkZGVuSXRlbUNvdW50KCkgPT0gMCA/XG4gICAgICAgICAgICAgICAgc2VsZi50b2dnbGVfaWNvbi5hZGRDbGFzcygnb2theS1pbnZpc2libGUnKSA6XG4gICAgICAgICAgICAgICAgc2VsZi50b2dnbGVfaWNvbi5yZW1vdmVDbGFzcygnb2theS1pbnZpc2libGUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfY29sbGFwc2VOYXZJdGVtOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciAkbGFzdF9jaGlsZCA9ICQoJ2xpOmxhc3QtY2hpbGQnLCBzZWxmLm5hdl92aXNpYmxlKTtcbiAgICAgICAgICAgIHNlbGYubGFzdF92aXNpYmxlX2NoaWxkX3dpZHRoID0gJGxhc3RfY2hpbGQub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICAgICAgICAgIHNlbGYuZG9jdW1lbnQudHJpZ2dlcignb2theU5hdjpjb2xsYXBzZUl0ZW0nLCAkbGFzdF9jaGlsZCk7XG4gICAgICAgICAgICAkbGFzdF9jaGlsZC5kZXRhY2goKS5wcmVwZW5kVG8oc2VsZi5uYXZfaW52aXNpYmxlKTtcbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pdGVtSGlkZGVuLmNhbGwoKTtcbiAgICAgICAgICAgIC8vIEFsbCBuYXYgaXRlbXMgYXJlIHZpc2libGUgYnkgZGVmYXVsdFxuICAgICAgICAgICAgLy8gc28gd2Ugb25seSBuZWVkIHJlY3Vyc2lvbiB3aGVuIGNvbGxhcHNpbmdcblxuICAgICAgICAgICAgc2VsZi5yZWNhbGNOYXYoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXhwYW5kTmF2SXRlbTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgJGZpcnN0ID0gJCgnbGk6Zmlyc3QtY2hpbGQnLCBzZWxmLm5hdl9pbnZpc2libGUpO1xuICAgICAgICAgICAgc2VsZi5kb2N1bWVudC50cmlnZ2VyKCdva2F5TmF2OmV4cGFuZEl0ZW0nLCAkZmlyc3QpO1xuICAgICAgICAgICAgJGZpcnN0LmRldGFjaCgpLmFwcGVuZFRvKHNlbGYubmF2X3Zpc2libGUpO1xuICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1EaXNwbGF5ZWQuY2FsbCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9leHBhbmRBbGxJdGVtczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAkKCdsaScsIHNlbGYubmF2X2ludmlzaWJsZSkuZGV0YWNoKCkuYXBwZW5kVG8oc2VsZi5uYXZfdmlzaWJsZSk7XG4gICAgICAgICAgICBzZWxmLm9wdGlvbnMuaXRlbURpc3BsYXllZC5jYWxsKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NvbGxhcHNlQWxsSXRlbXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgJCgnbGknLCBzZWxmLm5hdl92aXNpYmxlKS5kZXRhY2goKS5hcHBlbmRUbyhzZWxmLm5hdl9pbnZpc2libGUpO1xuICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1IaWRkZW4uY2FsbCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgJCgnbGknLCBzZWxmLm5hdl9pbnZpc2libGUpLmFwcGVuZFRvKHNlbGYubmF2X3Zpc2libGUpO1xuICAgICAgICAgICAgc2VsZi5uYXZfaW52aXNpYmxlLnJlbW92ZSgpO1xuICAgICAgICAgICAgc2VsZi5uYXZfdmlzaWJsZS5yZW1vdmVDbGFzcygnb2theU5hdl9fbmF2LS12aXNpYmxlJyk7XG4gICAgICAgICAgICBzZWxmLnRvZ2dsZV9pY29uLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBzZWxmLmRvY3VtZW50LnVuYmluZCgnLm9rYXlOYXYnKTtcbiAgICAgICAgICAgIHNlbGYud2luZG93LnVuYmluZCgnLm9rYXlOYXYnKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICAvLyBQbHVnaW4gd3JhcHBlclxuICAgICQuZm5bb2theU5hdl0gPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICghJC5kYXRhKHRoaXMsICdwbHVnaW5fJyArIG9rYXlOYXYpKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAncGx1Z2luXycgKyBva2F5TmF2LCBuZXcgUGx1Z2luKHRoaXMsIG9wdGlvbnMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyAmJiBvcHRpb25zWzBdICE9PSAnXycgJiYgb3B0aW9ucyAhPT0gJ2luaXQnKSB7XG5cbiAgICAgICAgICAgIHZhciByZXR1cm5zO1xuICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9ICQuZGF0YSh0aGlzLCAncGx1Z2luXycgKyBva2F5TmF2KTtcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBQbHVnaW4gJiYgdHlwZW9mIGluc3RhbmNlW29wdGlvbnNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybnMgPSBpbnN0YW5jZVtvcHRpb25zXS5hcHBseShpbnN0YW5jZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncywgMSkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5kYXRhKHRoaXMsICdwbHVnaW5fJyArIG9rYXlOYXYsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmV0dXJucyAhPT0gdW5kZWZpbmVkID8gcmV0dXJucyA6IHRoaXM7XG4gICAgICAgIH1cbiAgICB9O1xufSkpO1xuIl19
