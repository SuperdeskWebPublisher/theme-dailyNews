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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5va2F5TmF2LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGpxdWVyeS5va2F5TmF2LmpzIDIuMC40IChodHRwczovL2dpdGh1Yi5jb20vVlBlbmtvdi9va2F5TmF2KVxuICogQXV0aG9yOiBWZXJnaWwgUGVua292IChodHRwOi8vdmVyZ2lscGVua292LmNvbS8pXG4gKiBNSVQgbGljZW5zZTogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqL1xuXG47XG4oZnVuY3Rpb24oZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpOyAvLyBBTURcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocm9vdCwgalF1ZXJ5KSB7IC8vIE5vZGUvQ29tbW9uSlNcbiAgICAgICAgICAgIGlmIChqUXVlcnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKShyb290KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmYWN0b3J5KGpRdWVyeSk7XG4gICAgICAgICAgICByZXR1cm4galF1ZXJ5O1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZhY3RvcnkoalF1ZXJ5KTsgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgfVxufShmdW5jdGlvbigkKSB7XG4gICAgLy8gRGVmYXVsdHNcblxuICAgIHZhciBva2F5TmF2ID0gJ29rYXlOYXYnLFxuICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIHBhcmVudDogJycsIC8vIHdpbGwgY2FsbCBuYXYncyBwYXJlbnQoKSBieSBkZWZhdWx0XG4gICAgICAgICAgICB0b2dnbGVfaWNvbl9jbGFzczogJ29rYXlOYXZfX21lbnUtdG9nZ2xlJyxcbiAgICAgICAgICAgIHRvZ2dsZV9pY29uX2NvbnRlbnQ6ICc8c3BhbiAvPjxzcGFuIC8+PHNwYW4gLz4nLFxuICAgICAgICAgICAgYWxpZ25fcmlnaHQ6IHRydWUsIC8vIElmIGZhbHNlLCB0aGUgbWVudSBhbmQgdGhlIGtlYmFiIGljb24gd2lsbCBiZSBvbiB0aGUgbGVmdFxuICAgICAgICAgICAgc3dpcGVfZW5hYmxlZDogdHJ1ZSwgLy8gSWYgdHJ1ZSwgeW91J2xsIGJlIGFibGUgdG8gc3dpcGUgbGVmdC9yaWdodCB0byBvcGVuIHRoZSBuYXZpZ2F0aW9uXG4gICAgICAgICAgICB0aHJlc2hvbGQ6IDUwLCAvLyBOYXYgd2lsbCBhdXRvIG9wZW4vY2xvc2UgaWYgc3dpcGVkID49IHRoaXMgbWFueSBwZXJjZW50XG4gICAgICAgICAgICByZXNpemVfZGVsYXk6IDEwLCAvLyBXaGVuIHJlc2l6aW5nIHRoZSB3aW5kb3csIG9rYXlOYXYgY2FuIHRocm90dGxlIGl0cyByZWNhbGN1bGF0aW9ucyBpZiBlbmFibGVkLiBTZXR0aW5nIHRoaXMgdG8gNTAtMjUwIHdpbGwgaW1wcm92ZSBwZXJmb3JtYW5jZSBidXQgbWFrZSBva2F5TmF2IGxlc3MgYWNjdXJhdGUuXG4gICAgICAgICAgICBiZWZvcmVPcGVuOiBmdW5jdGlvbigpIHt9LCAvLyBXaWxsIHRyaWdnZXIgYmVmb3JlIHRoZSBuYXYgZ2V0cyBvcGVuZWRcbiAgICAgICAgICAgIGFmdGVyT3BlbjogZnVuY3Rpb24oKSB7fSwgLy8gV2lsbCB0cmlnZ2VyIGFmdGVyIHRoZSBuYXYgZ2V0cyBvcGVuZWRcbiAgICAgICAgICAgIGJlZm9yZUNsb3NlOiBmdW5jdGlvbigpIHt9LCAvLyBXaWxsIHRyaWdnZXIgYmVmb3JlIHRoZSBuYXYgZ2V0cyBjbG9zZWRcbiAgICAgICAgICAgIGFmdGVyQ2xvc2U6IGZ1bmN0aW9uKCkge30sIC8vIFdpbGwgdHJpZ2dlciBhZnRlciB0aGUgbmF2IGdldHMgY2xvc2VkXG4gICAgICAgICAgICBpdGVtSGlkZGVuOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICAgICAgaXRlbURpc3BsYXllZDogZnVuY3Rpb24oKSB7fVxuICAgICAgICB9O1xuXG4gICAgLy8gQmVnaW5cbiAgICBmdW5jdGlvbiBQbHVnaW4oZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAgICAgc2VsZi5uYXZpZ2F0aW9uID0gJChlbGVtZW50KTtcbiAgICAgICAgc2VsZi5kb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xuICAgICAgICBzZWxmLndpbmRvdyA9ICQod2luZG93KTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMucGFyZW50ID09ICcnID8gdGhpcy5vcHRpb25zLnBhcmVudCA9IHNlbGYubmF2aWdhdGlvbi5wYXJlbnQoKSA6ICcnO1xuXG4gICAgICAgIHNlbGYubmF2X29wZW4gPSBmYWxzZTsgLy8gU3RvcmUgdGhlIHN0YXRlIG9mIHRoZSBoaWRkZW4gbmF2XG4gICAgICAgIHNlbGYucGFyZW50X2Z1bGxfd2lkdGggPSAwO1xuXG4gICAgICAgIC8vIFN3aXBlIHN0dWZmXG4gICAgICAgIHNlbGYucmFkQ29lZiA9IDE4MCAvIE1hdGguUEk7XG4gICAgICAgIHNlbGYuc1RvdWNoID0ge1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IDBcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZi5jVG91Y2ggPSB7XG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogMFxuICAgICAgICB9O1xuICAgICAgICBzZWxmLnNUaW1lID0gMDtcbiAgICAgICAgc2VsZi5uYXZfcG9zaXRpb24gPSAwO1xuICAgICAgICBzZWxmLnBlcmNlbnRfb3BlbiA9IDA7XG4gICAgICAgIHNlbGYubmF2X21vdmluZyA9IGZhbHNlO1xuXG5cbiAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgfVxuXG4gICAgJC5leHRlbmQoUGx1Z2luLnByb3RvdHlwZSwge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ29rYXlOYXYtbG9hZGVkJyk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBjbGFzc2VzXG4gICAgICAgICAgICBzZWxmLm5hdmlnYXRpb25cbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ29rYXlOYXYgbG9hZGVkJylcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJ3VsJykuYWRkQ2xhc3MoJ29rYXlOYXZfX25hdi0tdmlzaWJsZScpO1xuXG4gICAgICAgICAgICAvLyBBcHBlbmQgZWxlbWVudHNcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuYWxpZ25fcmlnaHQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLm5hdmlnYXRpb25cbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnPHVsIGNsYXNzPVwib2theU5hdl9fbmF2LS1pbnZpc2libGUgdHJhbnNpdGlvbi1lbmFibGVkIG5hdi1yaWdodFwiIC8+JylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnPGEgaHJlZj1cIiNcIiBjbGFzcz1cIicgKyBzZWxmLm9wdGlvbnMudG9nZ2xlX2ljb25fY2xhc3MgKyAnIG9rYXktaW52aXNpYmxlXCI+JyArIHNlbGYub3B0aW9ucy50b2dnbGVfaWNvbl9jb250ZW50ICsgJzwvYT4nKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLm5hdmlnYXRpb25cbiAgICAgICAgICAgICAgICAgICAgLnByZXBlbmQoJzx1bCBjbGFzcz1cIm9rYXlOYXZfX25hdi0taW52aXNpYmxlIHRyYW5zaXRpb24tZW5hYmxlZCBuYXYtbGVmdFwiIC8+JylcbiAgICAgICAgICAgICAgICAgICAgLnByZXBlbmQoJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCInICsgc2VsZi5vcHRpb25zLnRvZ2dsZV9pY29uX2NsYXNzICsgJyBva2F5LWludmlzaWJsZVwiPicgKyBzZWxmLm9wdGlvbnMudG9nZ2xlX2ljb25fY29udGVudCArICc8L2E+JylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2FjaGUgbmV3IGVsZW1lbnRzIGZvciBmdXJ0aGVyIHVzZVxuICAgICAgICAgICAgc2VsZi5uYXZfdmlzaWJsZSA9IHNlbGYubmF2aWdhdGlvbi5jaGlsZHJlbignLm9rYXlOYXZfX25hdi0tdmlzaWJsZScpO1xuICAgICAgICAgICAgc2VsZi5uYXZfaW52aXNpYmxlID0gc2VsZi5uYXZpZ2F0aW9uLmNoaWxkcmVuKCcub2theU5hdl9fbmF2LS1pbnZpc2libGUnKTtcbiAgICAgICAgICAgIHNlbGYudG9nZ2xlX2ljb24gPSBzZWxmLm5hdmlnYXRpb24uY2hpbGRyZW4oJy4nICsgc2VsZi5vcHRpb25zLnRvZ2dsZV9pY29uX2NsYXNzKTtcblxuICAgICAgICAgICAgc2VsZi50b2dnbGVfaWNvbl93aWR0aCA9IHNlbGYudG9nZ2xlX2ljb24ub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICAgICAgICAgIHNlbGYuZGVmYXVsdF93aWR0aCA9IHNlbGYuZ2V0Q2hpbGRyZW5XaWR0aChzZWxmLm5hdmlnYXRpb24pO1xuICAgICAgICAgICAgc2VsZi5wYXJlbnRfZnVsbF93aWR0aCA9ICQoc2VsZi5vcHRpb25zLnBhcmVudCkub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICAgICAgICAgIHNlbGYubGFzdF92aXNpYmxlX2NoaWxkX3dpZHRoID0gMDsgLy8gV2UnbGwgZGVmaW5lIHRoaXMgbGF0ZXJcblxuICAgICAgICAgICAgLy8gRXZlbnRzIGFyZSB1cCBvbmNlIGV2ZXJ5dGhpbmcgaXMgc2V0XG4gICAgICAgICAgICBzZWxmLmluaXRFdmVudHMoKTtcblxuICAgICAgICAgICAgLy8gVHJpbSB3aGl0ZSBzcGFjZXMgYmV0d2VlbiB2aXNpYmxlIG5hdiBlbGVtZW50c1xuICAgICAgICAgICAgc2VsZi5uYXZfdmlzaWJsZS5jb250ZW50cygpLmZpbHRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlVHlwZSA9IE5vZGUuVEVYVF9OT0RFICYmIC9cXFMvLnRlc3QodGhpcy5ub2RlVmFsdWUpID09PSBmYWxzZTtcbiAgICAgICAgICAgIH0pLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5vcHRpb25zLnN3aXBlX2VuYWJsZWQgPT0gdHJ1ZSkgc2VsZi5pbml0U3dpcGVFdmVudHMoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0RXZlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIC8vIFRvZ2dsZSBoaWRkZW4gbmF2IHdoZW4gaGFtYnVyZ2VyIGljb24gaXMgY2xpY2tlZCBhbmRcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIGhpZGRlbiBuYXYgb24gY2xpY2sgb3V0c2lkZSB0aGUgaGVhZGVyXG4gICAgICAgICAgICBzZWxmLmRvY3VtZW50Lm9uKCdjbGljay5va2F5TmF2JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBfdGFyZ2V0ID0gJChlLnRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5uYXZfb3BlbiA9PT0gdHJ1ZSAmJiBfdGFyZ2V0LmNsb3Nlc3QoJy5va2F5TmF2JykubGVuZ3RoID09IDApXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2xvc2VJbnZpc2libGVOYXYoKTtcblxuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gc2VsZi50b2dnbGVfaWNvbi5nZXQoMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnRvZ2dsZUludmlzaWJsZU5hdigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgb3B0aW1pemVSZXNpemUgPSBzZWxmLl9kZWJvdW5jZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlY2FsY05hdigpXG4gICAgICAgICAgICB9LCBzZWxmLm9wdGlvbnMucmVzaXplX2RlbGF5KTtcbiAgICAgICAgICAgIHNlbGYud2luZG93Lm9uKCdsb2FkLm9rYXlOYXYgcmVzaXplLm9rYXlOYXYnLCBvcHRpbWl6ZVJlc2l6ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFN3aXBlRXZlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuZG9jdW1lbnRcbiAgICAgICAgICAgICAgICAub24oJ3RvdWNoc3RhcnQub2theU5hdicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5uYXZfaW52aXNpYmxlLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLWVuYWJsZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAvL1RyaWdnZXIgb25seSBvbiB0b3VjaCB3aXRoIG9uZSBmaW5nZXJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50b3VjaGVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG91Y2ggPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKHRvdWNoLnBhZ2VYIDwgMjUgJiYgc2VsZi5vcHRpb25zLmFsaWduX3JpZ2h0ID09IGZhbHNlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodG91Y2gucGFnZVggPiAoJChzZWxmLm9wdGlvbnMucGFyZW50KS5vdXRlcldpZHRoKHRydWUpIC0gMjUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9wdGlvbnMuYWxpZ25fcmlnaHQgPT0gdHJ1ZSkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5uYXZfb3BlbiA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zVG91Y2gueCA9IHNlbGYuY1RvdWNoLnggPSB0b3VjaC5wYWdlWDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNUb3VjaC55ID0gc2VsZi5jVG91Y2gueSA9IHRvdWNoLnBhZ2VZO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc1RpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vbigndG91Y2htb3ZlLm9rYXlOYXYnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3VjaCA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl90cmlnZ2VyTW92ZSh0b3VjaC5wYWdlWCwgdG91Y2gucGFnZVkpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm5hdl9tb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKCd0b3VjaGVuZC5va2F5TmF2JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNUb3VjaCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiAwXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY1RvdWNoID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IDBcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zVGltZSA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9DbG9zZSBtZW51IGlmIG5vdCBzd2lwZWQgZW5vdWdoXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnBlcmNlbnRfb3BlbiA+ICgxMDAgLSBzZWxmLm9wdGlvbnMudGhyZXNob2xkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5uYXZfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jbG9zZUludmlzaWJsZU5hdigpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5uYXZfbW92aW5nID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubmF2X3Bvc2l0aW9uID0gc2VsZi5uYXZfaW52aXNpYmxlLndpZHRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm9wZW5JbnZpc2libGVOYXYoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubmF2X21vdmluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubmF2X2ludmlzaWJsZS5hZGRDbGFzcygndHJhbnNpdGlvbi1lbmFibGVkJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2dldERpcmVjdGlvbjogZnVuY3Rpb24oZHgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWxpZ25fcmlnaHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGR4ID4gMCkgPyAtMSA6IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAoZHggPCAwKSA/IC0xIDogMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfdHJpZ2dlck1vdmU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgc2VsZi5jVG91Y2gueCA9IHg7XG4gICAgICAgICAgICBzZWxmLmNUb3VjaC55ID0geTtcblxuICAgICAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHZhciBkeCA9IChzZWxmLmNUb3VjaC54IC0gc2VsZi5zVG91Y2gueCk7XG4gICAgICAgICAgICB2YXIgZHkgPSAoc2VsZi5jVG91Y2gueSAtIHNlbGYuc1RvdWNoLnkpO1xuXG4gICAgICAgICAgICB2YXIgb3Bwb3NpbmcgPSBkeSAqIGR5O1xuICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBvcHBvc2luZyk7XG4gICAgICAgICAgICAvL0xlbmd0aCBvZiB0aGUgb3Bwb3Npbmcgc2lkZSBvZiB0aGUgOTBkZWcgdHJpYWdsZVxuICAgICAgICAgICAgdmFyIGRPcHBvc2luZyA9IE1hdGguc3FydChvcHBvc2luZyk7XG5cbiAgICAgICAgICAgIHZhciBhbmdsZSA9IE1hdGguYXNpbihNYXRoLnNpbihkT3Bwb3NpbmcgLyBkaXN0YW5jZSkpICogc2VsZi5yYWRDb2VmO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gZGlzdGFuY2UgLyAoY3VycmVudFRpbWUgLSBzZWxmLnNUaW1lKTtcblxuICAgICAgICAgICAgLy9TZXQgbmV3IHN0YXJ0IHBvc2l0aW9uXG4gICAgICAgICAgICBzZWxmLnNUb3VjaC54ID0geDtcbiAgICAgICAgICAgIHNlbGYuc1RvdWNoLnkgPSB5O1xuXG4gICAgICAgICAgICAvL1JlbW92ZSBmYWxzZSBzd2lwZXNcbiAgICAgICAgICAgIGlmIChhbmdsZSA8IDIwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpciA9IHNlbGYuX2dldERpcmVjdGlvbihkeCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV3UG9zID0gc2VsZi5uYXZfcG9zaXRpb24gKyBkaXIgKiBkaXN0YW5jZTtcbiAgICAgICAgICAgICAgICB2YXIgbWVudVdpZHRoID0gc2VsZi5uYXZfaW52aXNpYmxlLndpZHRoKCk7XG4gICAgICAgICAgICAgICAgdmFyIG92ZXJmbG93ID0gMDtcblxuXG4gICAgICAgICAgICAgICAgaWYgKG5ld1BvcyA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSAtbmV3UG9zO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3UG9zID4gbWVudVdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gbWVudVdpZHRoIC0gbmV3UG9zO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzaXplID0gbWVudVdpZHRoIC0gKHNlbGYubmF2X3Bvc2l0aW9uICsgZGlyICogZGlzdGFuY2UgKyBvdmVyZmxvdyk7XG4gICAgICAgICAgICAgICAgdmFyIHRocmVzaG9sZCA9IChzaXplIC8gbWVudVdpZHRoKSAqIDEwMDtcblxuICAgICAgICAgICAgICAgIC8vU2V0IG5ldyBwb3NpdGlvbiBhbmQgdGhyZXNob2xkXG4gICAgICAgICAgICAgICAgc2VsZi5uYXZfcG9zaXRpb24gKz0gZGlyICogZGlzdGFuY2UgKyBvdmVyZmxvdztcbiAgICAgICAgICAgICAgICBzZWxmLnBlcmNlbnRfb3BlbiA9IHRocmVzaG9sZDtcblxuICAgICAgICAgICAgICAgIHNlbGYubmF2X2ludmlzaWJsZS5jc3MoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGVYKCcgKyAoc2VsZi5vcHRpb25zLmFsaWduX3JpZ2h0ID8gMSA6IC0xKSAqIHRocmVzaG9sZCArICclKScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLypcbiAgICAgICAgICogQSBmZXcgbWV0aG9kcyB0byBhbGxvdyB3b3JraW5nIHdpdGggZWxlbWVudHNcbiAgICAgICAgICovXG4gICAgICAgIGdldFBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnBhcmVudDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRWaXNpYmxlTmF2OiBmdW5jdGlvbigpIHsgLy8gVmlzaWJsZSBuYXZpZ2F0aW9uXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uYXZfdmlzaWJsZTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRJbnZpc2libGVOYXY6IGZ1bmN0aW9uKCkgeyAvLyBIaWRkZW4gYmVoaW5kIHRoZSBrZWJhYiBpY29uXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uYXZfaW52aXNpYmxlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldE5hdlRvZ2dsZUljb246IGZ1bmN0aW9uKCkgeyAvLyBLZWJhYiBpY29uXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b2dnbGVfaWNvbjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKlxuICAgICAgICAgKiBPcGVyYXRpb25zXG4gICAgICAgICAqL1xuICAgICAgICBfZGVib3VuY2U6IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgICAgICAgICAgdmFyIHRpbWVvdXQ7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBvcGVuSW52aXNpYmxlTmF2OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgIXNlbGYub3B0aW9ucy5lbmFibGVfc3dpcGUgPyBzZWxmLm9wdGlvbnMuYmVmb3JlT3Blbi5jYWxsKCkgOiAnJztcblxuICAgICAgICAgICAgc2VsZi50b2dnbGVfaWNvbi5hZGRDbGFzcygnaWNvbi0tYWN0aXZlJyk7XG4gICAgICAgICAgICBzZWxmLm5hdl9pbnZpc2libGUuYWRkQ2xhc3MoJ25hdi1vcGVuJyk7XG4gICAgICAgICAgICBzZWxmLm5hdl9vcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYubmF2X2ludmlzaWJsZS5jc3Moe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5hZnRlck9wZW4uY2FsbCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsb3NlSW52aXNpYmxlTmF2OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICFzZWxmLm9wdGlvbnMuZW5hYmxlX3N3aXBlID8gc2VsZi5vcHRpb25zLmJlZm9yZUNsb3NlLmNhbGwoKSA6ICcnO1xuXG4gICAgICAgICAgICBzZWxmLnRvZ2dsZV9pY29uLnJlbW92ZUNsYXNzKCdpY29uLS1hY3RpdmUnKTtcbiAgICAgICAgICAgIHNlbGYubmF2X2ludmlzaWJsZS5yZW1vdmVDbGFzcygnbmF2LW9wZW4nKTtcblxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5hbGlnbl9yaWdodCkge1xuICAgICAgICAgICAgICAgIHNlbGYubmF2X2ludmlzaWJsZS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5uYXZfaW52aXNpYmxlLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5uYXZfb3BlbiA9IGZhbHNlO1xuXG4gICAgICAgICAgICBzZWxmLm9wdGlvbnMuYWZ0ZXJDbG9zZS5jYWxsKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlSW52aXNpYmxlTmF2OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmICghc2VsZi5uYXZfb3Blbikge1xuICAgICAgICAgICAgICAgIHNlbGYub3BlbkludmlzaWJsZU5hdigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmNsb3NlSW52aXNpYmxlTmF2KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKlxuICAgICAgICAgKiBNYXRoIHN0dWZmXG4gICAgICAgICAqL1xuICAgICAgICBnZXRDaGlsZHJlbldpZHRoOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuX3dpZHRoID0gMDtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9ICQoZWwpLmNoaWxkcmVuKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5fd2lkdGggKz0gJChjaGlsZHJlbltpXSkub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBjaGlsZHJlbl93aWR0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRWaXNpYmxlSXRlbUNvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkKCdsaScsIHRoaXMubmF2X3Zpc2libGUpLmxlbmd0aDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0SGlkZGVuSXRlbUNvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkKCdsaScsIHRoaXMubmF2X2ludmlzaWJsZSkubGVuZ3RoO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlY2FsY05hdjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgd3JhcHBlcl93aWR0aCA9ICQoc2VsZi5vcHRpb25zLnBhcmVudCkub3V0ZXJXaWR0aCh0cnVlKSxcbiAgICAgICAgICAgICAgICBzcGFjZV90YWtlbiA9IHNlbGYuZ2V0Q2hpbGRyZW5XaWR0aChzZWxmLm9wdGlvbnMucGFyZW50KSxcbiAgICAgICAgICAgICAgICBuYXZfZnVsbF93aWR0aCA9IHNlbGYubmF2aWdhdGlvbi5vdXRlcldpZHRoKHRydWUpLFxuICAgICAgICAgICAgICAgIHZpc2libGVfbmF2X2l0ZW1zID0gc2VsZi5nZXRWaXNpYmxlSXRlbUNvdW50KCksXG4gICAgICAgICAgICAgICAgY29sbGFwc2Vfd2lkdGggPSBzZWxmLm5hdl92aXNpYmxlLm91dGVyV2lkdGgodHJ1ZSkgKyBzZWxmLnRvZ2dsZV9pY29uX3dpZHRoLFxuICAgICAgICAgICAgICAgIGV4cGFuZF93aWR0aCA9IHNwYWNlX3Rha2VuICsgc2VsZi5sYXN0X3Zpc2libGVfY2hpbGRfd2lkdGggKyBzZWxmLnRvZ2dsZV9pY29uX3dpZHRoLFxuICAgICAgICAgICAgICAgIGV4cGFuZEFsbF93aWR0aCA9IHNwYWNlX3Rha2VuIC0gbmF2X2Z1bGxfd2lkdGggKyBzZWxmLmRlZmF1bHRfd2lkdGg7XG5cbiAgICAgICAgICAgIGlmICh3cmFwcGVyX3dpZHRoID4gZXhwYW5kQWxsX3dpZHRoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fZXhwYW5kQWxsSXRlbXMoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnRvZ2dsZV9pY29uLmFkZENsYXNzKCdva2F5LWludmlzaWJsZScpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZpc2libGVfbmF2X2l0ZW1zID4gMCAmJlxuICAgICAgICAgICAgICAgIG5hdl9mdWxsX3dpZHRoIDw9IGNvbGxhcHNlX3dpZHRoICYmXG4gICAgICAgICAgICAgICAgd3JhcHBlcl93aWR0aCA8PSBleHBhbmRfd2lkdGgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9jb2xsYXBzZU5hdkl0ZW0oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHdyYXBwZXJfd2lkdGggPiBleHBhbmRfd2lkdGggKyBzZWxmLnRvZ2dsZV9pY29uX3dpZHRoICsgMTUpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9leHBhbmROYXZJdGVtKCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy8gSGlkZSB0aGUga2ViYWIgaWNvbiBpZiBubyBpdGVtcyBhcmUgaGlkZGVuXG4gICAgICAgICAgICBzZWxmLmdldEhpZGRlbkl0ZW1Db3VudCgpID09IDAgP1xuICAgICAgICAgICAgICAgIHNlbGYudG9nZ2xlX2ljb24uYWRkQ2xhc3MoJ29rYXktaW52aXNpYmxlJykgOlxuICAgICAgICAgICAgICAgIHNlbGYudG9nZ2xlX2ljb24ucmVtb3ZlQ2xhc3MoJ29rYXktaW52aXNpYmxlJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NvbGxhcHNlTmF2SXRlbTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgJGxhc3RfY2hpbGQgPSAkKCdsaTpsYXN0LWNoaWxkJywgc2VsZi5uYXZfdmlzaWJsZSk7XG4gICAgICAgICAgICBzZWxmLmxhc3RfdmlzaWJsZV9jaGlsZF93aWR0aCA9ICRsYXN0X2NoaWxkLm91dGVyV2lkdGgodHJ1ZSk7XG4gICAgICAgICAgICBzZWxmLmRvY3VtZW50LnRyaWdnZXIoJ29rYXlOYXY6Y29sbGFwc2VJdGVtJywgJGxhc3RfY2hpbGQpO1xuICAgICAgICAgICAgJGxhc3RfY2hpbGQuZGV0YWNoKCkucHJlcGVuZFRvKHNlbGYubmF2X2ludmlzaWJsZSk7XG4gICAgICAgICAgICBzZWxmLm9wdGlvbnMuaXRlbUhpZGRlbi5jYWxsKCk7XG4gICAgICAgICAgICAvLyBBbGwgbmF2IGl0ZW1zIGFyZSB2aXNpYmxlIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgIC8vIHNvIHdlIG9ubHkgbmVlZCByZWN1cnNpb24gd2hlbiBjb2xsYXBzaW5nXG5cbiAgICAgICAgICAgIHNlbGYucmVjYWxjTmF2KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2V4cGFuZE5hdkl0ZW06IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyICRmaXJzdCA9ICQoJ2xpOmZpcnN0LWNoaWxkJywgc2VsZi5uYXZfaW52aXNpYmxlKTtcbiAgICAgICAgICAgIHNlbGYuZG9jdW1lbnQudHJpZ2dlcignb2theU5hdjpleHBhbmRJdGVtJywgJGZpcnN0KTtcbiAgICAgICAgICAgICRmaXJzdC5kZXRhY2goKS5hcHBlbmRUbyhzZWxmLm5hdl92aXNpYmxlKTtcbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pdGVtRGlzcGxheWVkLmNhbGwoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZXhwYW5kQWxsSXRlbXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgJCgnbGknLCBzZWxmLm5hdl9pbnZpc2libGUpLmRldGFjaCgpLmFwcGVuZFRvKHNlbGYubmF2X3Zpc2libGUpO1xuICAgICAgICAgICAgc2VsZi5vcHRpb25zLml0ZW1EaXNwbGF5ZWQuY2FsbCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9jb2xsYXBzZUFsbEl0ZW1zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICQoJ2xpJywgc2VsZi5uYXZfdmlzaWJsZSkuZGV0YWNoKCkuYXBwZW5kVG8oc2VsZi5uYXZfaW52aXNpYmxlKTtcbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5pdGVtSGlkZGVuLmNhbGwoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICQoJ2xpJywgc2VsZi5uYXZfaW52aXNpYmxlKS5hcHBlbmRUbyhzZWxmLm5hdl92aXNpYmxlKTtcbiAgICAgICAgICAgIHNlbGYubmF2X2ludmlzaWJsZS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHNlbGYubmF2X3Zpc2libGUucmVtb3ZlQ2xhc3MoJ29rYXlOYXZfX25hdi0tdmlzaWJsZScpO1xuICAgICAgICAgICAgc2VsZi50b2dnbGVfaWNvbi5yZW1vdmUoKTtcblxuICAgICAgICAgICAgc2VsZi5kb2N1bWVudC51bmJpbmQoJy5va2F5TmF2Jyk7XG4gICAgICAgICAgICBzZWxmLndpbmRvdy51bmJpbmQoJy5va2F5TmF2Jyk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgLy8gUGx1Z2luIHdyYXBwZXJcbiAgICAkLmZuW29rYXlOYXZdID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQuZGF0YSh0aGlzLCAncGx1Z2luXycgKyBva2F5TmF2KSkge1xuICAgICAgICAgICAgICAgICAgICAkLmRhdGEodGhpcywgJ3BsdWdpbl8nICsgb2theU5hdiwgbmV3IFBsdWdpbih0aGlzLCBvcHRpb25zKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycgJiYgb3B0aW9uc1swXSAhPT0gJ18nICYmIG9wdGlvbnMgIT09ICdpbml0Jykge1xuXG4gICAgICAgICAgICB2YXIgcmV0dXJucztcbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSAkLmRhdGEodGhpcywgJ3BsdWdpbl8nICsgb2theU5hdik7XG4gICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUGx1Z2luICYmIHR5cGVvZiBpbnN0YW5jZVtvcHRpb25zXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5zID0gaW5zdGFuY2Vbb3B0aW9uc10uYXBwbHkoaW5zdGFuY2UsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyA9PT0gJ2Rlc3Ryb3knKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAncGx1Z2luXycgKyBva2F5TmF2LCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJldHVybnMgIT09IHVuZGVmaW5lZCA/IHJldHVybnMgOiB0aGlzO1xuICAgICAgICB9XG4gICAgfTtcbn0pKTtcbiJdfQ==
