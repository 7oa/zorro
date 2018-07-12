// js jquery
var isDesktop = window.matchMedia('(min-width: 1200px)').matches;
$(window).on('load resize', function(){
    isDesktop = window.matchMedia('(min-width: 1200px)').matches;
});
$(document).ready(function() {
    //toggle мобильное меню
    $('.js-menu').click(function () {
        $(this).toggleClass('open');
        $('.js-dd').slideToggle();
    });

    //клонируем элементы из мобильной для десктопа
    $('.header-menu').clone().appendTo('.header-menu-desktop');
    $('.header-reg').clone().appendTo('.header-desktop-r1__auth');
    $('.header-call').clone().appendTo('.header-desktop-r1__call');
    $('.header-fav').clone().appendTo('.header-line2__fav');
    $('.header-backet').clone().appendTo('.header-line2__backet');
    $('.header-tren').clone().appendTo('.header-tren-desktop');
    $('.header-search').clone().appendTo('.header-search-desktop');
    $('.catalog-menu').clone().appendTo('.desktop-catalog-menu');
    $('.catalog-detail__h').clone().appendTo('.catalog-detail__desktop-h');
    $('.catalog-detail__fav').clone().appendTo('.catalog-detail__desktop-fav');

    //закрепляем меню
    $(window).scroll(function () {
        if (isDesktop) {
            var headerHeight = $('.header__r1').height() + $('.header__r2').height();
            if ($(this).scrollTop() > headerHeight) {
                $('.header').addClass('fixed');
            } else {
                $('.header').removeClass('fixed');
            }
        }
    });

    //покажем строку поиска для десктопа
    $(document).on('click','.js-search', function(){
        if (isDesktop) {
            $('.header-search-line').fadeIn(100).animate({"width": "100%"});
            $('.header-search-line__input').focus();
            return false;
        }
    });



    //слайдер на главной
    if($('.big-slider').length>0) {
        var newsSlider = new Swiper('.big-slider', {
            slidesPerView: 1,
            spaceBetween: 0,
            watchOverflow: true,
            speed: 500,
            loop: true,
            effect: 'fade',
            autoplay: {
                delay: 7000
            },
            navigation: {
                nextEl: '.big-slider__next',
                prevEl: '.big-slider__prev'
            },
            pagination: {
                el: '.big-slider__bull',
                clickable: true
            }
        });
    }

    //слайдер товаров
    if($('.prev-slider').length>0) {
        var prevSliders = [];
        $('.prev-slider').each(function (index, element) {
            $(this).addClass('s' + index);
            $(this).parent().find('.prev-line__next').addClass('next' + index);
            $(this).parent().find('.prev-line__prev').addClass('prev' + index);
            var slider = new Swiper('.s' + index, {
                slidesPerView: 5,
                spaceBetween: 0,
                watchOverflow: true,
                observer: true,
                observeParents: true,
                navigation: {
                    nextEl: '.next' + index,
                    prevEl: '.prev' + index
                },
                breakpoints: {
                    1200: {
                        slidesPerView: 'auto'

                    },
                    320: {
                        slidesPerView: 1,
                        centeredSlides: true
                    }
                },
                on: {
                    resize: function () {
                        this.update();
                    }
                }
            });
            prevSliders.push(slider);
        });
    }

    //слайдер новостей
    if($('.news-prev-slider').length>0) {
        var newsSlider = new Swiper('.news-prev-slider', {
            slidesPerView: 3,
            spaceBetween: 20,
            watchOverflow: true,
            breakpoints: {
                1200: {
                    slidesPerView: 'auto'
                },
                425: {
                    slidesPerView: 1,
                    centeredSlides: true
                }
            }
        });
    }

    //слайдер картинок на детальной каталога
    if($('.catalog-detail-gallery1').length>0){
        var galleryTop = new Swiper('.catalog-detail-gallery1', {
            slidesPerView: 1,
            spaceBetween: 0,
            on: {
                slideChange: function(){
                    var zoomImg = $(".js-small-img:nth-child(" + (this.activeIndex + 1) + ")").data("zoom-image");
                    $('.js-big-img').attr('data-zoom-image',zoomImg);
                    $('.zoomWindow').css('background-image','url('+zoomImg+')');
                }
            }
        });
    }
    if($('.catalog-detail-gallery').length>0) {
        var galleryThumbs = new Swiper('.catalog-detail-gallery', {
            slidesPerView: 'auto',
            spaceBetween: 5,
            centeredSlides: true,
            slideToClickedSlide: true,
            touchRatio: 0.2
        });
        galleryTop.controller.control = galleryThumbs;
        galleryThumbs.controller.control = galleryTop;
    }

    //слайдер картинок на детальной новостей
    if($('.detail-slider').length>0) {
        var detailNews = new Swiper('.detail-slider', {
            slidesPerView: 1,
            spaceBetween: 0,
            navigation: {
                nextEl: '.detail-slider__next',
                prevEl: '.detail-slider__prev'
            }
        });
    }


    //выбор размеров
    $('.js-tobasket').click(function(){
        $(this).parent().fadeOut()
            .next('.js-props').fadeIn();
    });
    $('.card').mouseleave(function(){
        $(this).find('.js-hover').css('display', '');
        $(this).find('.js-props').css('display', '');
    });

    //popup куки
    var cookiesModal =  $('#cookies').iziModal({
        radius: 0,
        width: '100%',
        bottom: 0,
        overlayColor: 'rgba(0, 0, 0, 0.8)',
        transitionIn: 'fadeInUp',
        transitionOut: 'fadeOutDown',
        transitionInOverlay: 'fadeIn',
        transitionOutOverlay: 'fadeOut'
    });
    //cookiesModal.iziModal('open');

    //popup -диалоги
    var notificationModal =  $('#notification').iziModal({
        radius: 0,
        width: '100%',
        bottom: 0,
        overlayColor: 'rgba(0, 0, 0, 0.8)',
        transitionIn: 'fadeInUp',
        transitionOut: 'fadeOutDown',
        transitionInOverlay: 'fadeIn',
        transitionOutOverlay: 'fadeOut'
    });
    //notificationModal.iziModal('open');

    //feedback
    var formModal =  $('.modal-form').iziModal({
        radius: 0,
        overlayColor: 'rgba(0, 0, 0, 0.8)',
        transitionIn: 'comingIn',
        transitionOut: 'comingOut',
        transitionInOverlay: 'fadeIn',
        transitionOutOverlay: 'fadeOut',
        onOpening: function(){
            if(isDesktop) {
                formModal.iziModal('setWidth', 700);
            }
            else formModal.iziModal('setWidth', '100%');
        }
    });

    //popup Корзина/Избранное
    $('.js-header-popup').click(function(){
        /*if(!isDesktop){
            $('.js-menu').removeClass('open');
            $('.js-dd').slideUp();
        }*/
        var link = $(this).data('open');
        var popup = $('.popup-'+link);
        var display = popup.css('display');
        popup.siblings('.popup-bl').slideUp();
        popup.slideToggle();
        if (display=='none') $('.wrapper').addClass('dark');
        if (display=='block') $('.wrapper').removeClass('dark');

        return false;
    });

    $('.js-popup-close').click(function(){
        $(this).parents('.popup-bl').slideUp();
        $('.wrapper').removeClass('dark')
    });

    //
    $('.js-plus').click(function(){
        var countEl = $(this).siblings().children('.js-count');
        var count = parseInt(countEl.text());
        countEl.text(++count);
        if(count>1) $(this).siblings('.js-minus').removeClass('disabled');
    });
    $('.js-minus').click(function(){
        var countEl = $(this).siblings().children('.js-count');
        var count = parseInt(countEl.text());
        if(count>1) countEl.text(--count);
        if(count==1) $(this).addClass('disabled');
    });

    //меню каталог
    $('.js-catalog-menu').click(function(){
        if (!isDesktop) {
            $(this).toggleClass('open')
                .next().slideToggle();
        }
    });

    //фильтр
    $('.js-open-filtr-btn').click(function(){
        $(this).toggleClass('open')
            .next().slideToggle();
    });
    $('.js-open-filtr').click(function(){
        var filtrDD = $(this).parents('.catalog-filter__item-body').next();
        if(!filtrDD.hasClass('open')){
            filtrDD.addClass('open').slideDown();
        }
    });

    //сортировка
    $('.js-sort-open').click(function(){
        var sortDD = $(this).next();
        if(!sortDD.hasClass('open')) {
            sortDD.addClass('open').slideDown();
        }
    });

    //input type="range"
    var range1 = $("#slider-range-diam");
    var range2 = $("#slider-range-length");

    range1.slider({
        range: "min",
        min: range1.data('min'),
        max: range1.data('max'),
        value: range1.data('val'),
        create: function(){
            changeVal("range-diam",false);
        },
        slide: function(){
            changeVal("range-diam",false);
        }
    });

    range2.slider({
        range: true,
        min: range2.data('min'),
        max: range2.data('max'),
        values: [ range2.data('val1'), range2.data('val2') ],
        create: function(){
            changeVal("range-length",true);
        },
        slide: function() {
            changeVal("range-length",true);
        }
    });
    function changeVal(param,multiple){
        var value;
        if (multiple){
            value = $("#slider-"+param).slider("values", 0) + " - " + $("#slider-"+param).slider( "values", 1 )
        }
        else{
            value = $("#slider-"+param).slider("value");
        }
        $("#"+param).val( value );
        $("label[for="+param+"] span").text(value);
    }
    //зумер
    if (isDesktop) {
        $('.js-big-img').elevateZoom({
            zoomWindowFadeIn: 500,
            zoomWindowFadeOut: 500,
            lensFadeIn: 500,
            lensFadeOut: 500,
            zoomWindowWidth: 640,
            zoomWindowHeight: 460,
            zoomWindowOffetx: 100,
            zoomWindowOffety: 0,
            borderSize: 0,
            lensColour: '#f259a9',
            lensOpacity: 0.2,
            lensBorderSize: 0
        });
    }

    //тэги
    $('.js-tag').click(function(){
        var tag = $(this);
        var tagID = tag.data("tag");
        $('#'+tagID).show().siblings().hide();
        $(tag).addClass('selected').siblings().removeClass('selected');
        if (!isDesktop) {
            tag.parent().slideUp().removeClass('open');
            $('.js-description-tag span').text(tag.text());
        }
    });
    $('.js-description-tag').click(function(){
        $(this).toggleClass('open')
            .next().slideToggle();
    });

    //лк меню
    $('.js-lk-menu').click(function(){
        $(this).toggleClass('open')
            .next().slideToggle();
    });
    //лк изменить пароль
    $('.js-change-pass').click(function(){
        $('.js-change-pass-form').slideToggle();
        $(this).hide();
        $('.js-change-pass-reset').show();
        return false;
    });

    //аккордеон
    $('.js-accordeon').click(function(){
        $(this).toggleClass('open')
            .next().slideToggle();
    });

    //лк заказ
    $('.js-show-order').click(function(){
        $(this).toggleClass('open')
            .next().slideToggle();
    });

    //маска
    $(".phone-mask").mask("+7 (999) 999-99-99", {placeholder: "+7 (___) ___-__-__" });

});
//скроем строку поиска при клике вне элемента
$(document).mouseup(function (e){
    if (isDesktop) {
        var div = $('.header-search-line');
        if (!div.is(e.target)
            && div.has(e.target).length === 0) {
            div.animate({"width": "15%"}).fadeOut(100);
        }
    }
    if(!isDesktop){
        var mobMenu = $('.js-dd');
        var mobMenuBtn = $('.js-menu');
        if (!mobMenu.is(e.target) &&
            !mobMenuBtn.is(e.target) &&
            mobMenu.has(e.target).length === 0 &&
            mobMenuBtn.has(e.target).length === 0) {
            mobMenu.slideUp();
            mobMenuBtn.removeClass('open');
        }
    }
    var filtr = $('.catalog-filter__item-dd.open');
    if (!filtr.is(e.target)
        && filtr.has(e.target).length === 0) {
        setTimeout(function () {
            filtr.removeClass('open').slideUp();
        }, 50);
    }

    var sort = $('.catalog-filter__sort-dd.open');
    if (!sort.is(e.target)
        && sort.has(e.target).length === 0) {
        setTimeout(function () {
            sort.removeClass('open').slideUp();
        }, 50);
    }
});