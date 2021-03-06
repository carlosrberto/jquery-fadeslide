/*
* jQuery fadeslide
* http://carlosrberto.github.com/jquery-fadeslide/
*
* Copyright (c) 2013 Carlos Roberto Gomes Junior
* http://carlosroberto.name/
*
* Licensed under a Creative Commons Attribution 3.0 License
* http://creativecommons.org/licenses/by-sa/3.0/
*
* Version: 0.2.1
*/

(function() {
    var defaults = {
        fx: {
            duration: 500
        },
        nextButton: '.fadeslide-next',
        prevButton: '.fadeslide-prev',
        paginationEl: '.fadeslide-pagination',
        paginationItem: function(index) {
            return '<li>'+ index +'</li>';
        },
        loader: '.fadeslide-loader',
        duration: 5000,
        itemsSelector: '.fadeslide-list li',
        index: 0,
        auto: true
    };

    var ImageLoader = function(images) {
        this.images = $.makeArray(images);
    };

    ImageLoader.prototype = {
        preloadImage: function(img, complete) {
            var src = img.attr('data-src');
            if ( src ) {
                img.on('load', function(){
                    img.removeAttr('data-src');
                    if ( typeof complete === 'function' ) {
                        complete();
                    }
                });
                img.attr('src', src);
            } else {
                if ( typeof complete === 'function' ) {
                    complete();
                }
            }
        },

        removeItem: function( item ) {
            this.images.splice($.inArray(item, this.images), 1);
        },

        preloadImages: function(complete) {
            var that = this;
            if( this.images.length ) {
                this.preloadImage($(this.images[0]), function(){
                    that.removeItem(that.images[0]);
                    that.preloadImages(complete);
                });
            } else {
                if ( typeof complete === 'function' ) {
                    complete();
                }
            }
        }
    };

    var FadeSlide = function(el, options) {
        this.el = $(el);
        this.options = $.extend({}, defaults, options);
        this.items = this.el.find(this.options.itemsSelector);
        this.totalItems = this.items.length;
        this.autoPlay = false;
        this.current = null;
        this.timerId = null;
        this.animating = false;
        this._setInitial();
        this._renderPagination();
        this._initEvens();
    };

    FadeSlide.prototype = {

        _initEvens: function() {
            var that = this,
                nextButton = this.el.find(this.options.nextButton),
                prevButton = this.el.find(this.options.prevButton),
                loader = this.el.find(this.options.loader),
                paginationEl = this.el.find(this.options.paginationEl);

            this.auto();

            if ( nextButton.length ) {
                nextButton.on('click', function( event ){
                    event.preventDefault();
                    that.next();
                });
            }

            if ( prevButton.length ) {
                prevButton.on('click', function( event ){
                    event.preventDefault();
                    that.prev();
                });
            }

            if ( loader.length ) {
                that.el.on('beforeload.fadeslide', function(){
                    loader.fadeIn();
                });
                that.el.on('afterload.fadeslide', function(){
                    loader.fadeOut();
                });
            }

            if ( paginationEl.length ) {
                paginationEl.on('click', '> *', $.proxy(function( event ) {
                    var el = $(event.currentTarget);
                    this.showSlide(el.index());
                }, this));

                this.el.on('change.fadeslide', function(event, inSlide, el, index) {
                    paginationEl.find('> *').removeClass('active');
                    paginationEl.find('> *').eq(index).addClass('active');
                });
            }

            if ( this.totalItems <= 1 ) {
                nextButton.hide();
                prevButton.hide();
            }
        },

        _showSlideElement: function(inSlide, outSlide) {
            var dfd = new $.Deferred(), that = this;
            this.items.not(inSlide).not(outSlide).css({
                'z-index': 1,
                'opacity' : 0
            });

            outSlide.css({'z-index' : 2});

            var images = inSlide.find('img[data-src]');

            if ( images.length && !inSlide.data('images-loaded') ) {
                that.el.trigger('beforeload.fadeslide');
                inSlide.data('images-loading', true);
                var loader = new ImageLoader(images);
                loader.preloadImages(function() {
                    inSlide.css({'z-index': 3, 'opacity':0}).stop().fadeTo(that.options.fx.duration, 1, function(){
                        that.el.trigger('afterload.fadeslide');
                        dfd.resolveWith(that);
                    });
                });
            } else {
                inSlide.css({'z-index': 3, 'opacity':0}).stop().fadeTo(this.options.fx.duration, 1, function(){
                    dfd.resolveWith(that);
                });
            }

            return dfd.promise();
        },

        _renderPagination: function() {
            var i = 0, paginationEl = this.el.find(this.options.paginationEl);
            if ( paginationEl.length && this.totalItems > 1 ) {
                for(; i< this.totalItems; i++) {
                    paginationEl.append(this.options.paginationItem(i+1));
                }
            } else {
                paginationEl.hide();
            }
        },

        showSlide: function(index) {
            var that = this,
                s,
                inSlide = this.items.eq(index),
                outSlide = this.items.eq(this.index);

            if ( this.animating ) {
                return;
            }

            if ( this.options.auto ) {
                this.stop();
            }

            this.animating = true;
            that.el.trigger('beforechange.fadeslide');
            this.index = index;
            s = this._showSlideElement(inSlide, outSlide);
            s.done(function(){
                this.animating = false;
                that.el.trigger('change.fadeslide', [inSlide, that.el, index, that]);
                that.auto();
            });
            return s;
        },

        _setInitial: function() {
            this.showSlide(this.options.index);
        },

        auto: function() {
            var that = this;
            console.log(this.totalItems <= 1 || !this.options.auto);
            if (this.totalItems <= 1 || !this.options.auto) {
                return;
            }

            this.autoPlay = true;
            this.timerId = setTimeout(function(){
                that.next().done(function(){
                    if ( that.autoPlay ) {
                        clearTimeout(that.timerId);
                        that.auto();
                    }
                });
            }, this.options.duration);
        },

        stop: function() {
            this.autoPlay = false;
            clearTimeout(this.timerId);
        },

        next: function() {
            var that = this, next = this.index  + 1 < this.totalItems ? this.index  + 1 : 0;
            return this.showSlide(next);
        },

        prev: function() {
            var that = this, prev = this.index  - 1 >= 0 ? this.index  - 1 : this.totalItems - 1;
            return this.showSlide(prev);
        }
    };

    $.fn.fadeslide = function( method ) {
        var args = arguments;

        return this.each(function() {

            if ( !$.data(this, 'fadeslide') ) {
                $.data(this, 'fadeslide', new FadeSlide(this, method));
                return;
            }

            var api = $.data(this, 'fadeslide');

            if ( typeof method === 'string' && method.charAt(0) !== '_' && api[ method ] ) {
                api[ method ].apply( api, Array.prototype.slice.call( args, 1 ) );
            } else {
                $.error( 'Method ' +  method + ' does not exist on jQuery.fadeslide' );
            }
        });
    };
})();
