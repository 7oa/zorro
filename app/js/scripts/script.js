// js jquery
var isDesktop = window.matchMedia('(min-width: 1200px)').matches;
$(window).on('load resize', function(){
    isDesktop = window.matchMedia('(min-width: 1200px)').matches;
});
/*$(window).on('resize', function(){
    window.setTimeout('location.reload()', 500);
});*/


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
            setTimeout(function(){
                $('.header-search-line__input').focus()
            }, 1000);
            return false;
        }
    });
    $(document).on('click','.js-search-close', function(){
        var div = $('.header-search-line');
        div.find('.header-search-result').removeClass('open');
        div.find('.header-search-line__input').val('');
        div.animate({"width": "15%"}).fadeOut(100);
    });



    //слайдер на главной
    initIndexSlider();

    //слайдер товаров
    initProductSlider();

    //слайдер новостей
    initNewsSlider();

    //слайдер картинок на детальной каталога
    initCatalogDetaileSlider();

    //слайдер картинок на детальной новостей
    initNewsDetaileSlider();


    //выбор размеров
    $(document).on('click','.js-tobasket',function(){
        var props = $(this).parents('.card__hover').find('.js-props').length;
        if(props>0){
            $(this).parent().fadeOut()
                .next('.js-props').fadeIn();
        }

    });
    $(document).on('mouseleave','.card',function () {
        $(this).find('.js-hover').css('display', '');
        $(this).find('.js-props').css('display', '');
    });

    //popup куки
    // var cookiesModal =  $('#cookies').iziModal({
    //     radius: 0,
    //     width: '100%',
    //     bottom: 0,
    //     overlay: false,
    //     transitionIn: 'fadeInUp',
    //     transitionOut: 'fadeOutDown',
    //     transitionInOverlay: 'fadeIn',
    //     transitionOutOverlay: 'fadeOut'
    // });
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

    //18 plus
    var plus18 =  $('#plus18').iziModal({
        radius: 0,
        width: 700,
        overlayColor: 'rgba(255, 255, 255, 1)',
        overlayClose: false,
        closeOnEscape: false,
        bodyOverflow: true
    });

    //feedback
    var formModal =  $('.modal-form').iziModal({
        radius: 0,
        overlayColor: 'rgba(0, 0, 0, 0.8)',
        transitionIn: 'fadeInUp',
        transitionOut: 'fadeOutDown',
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
    $(document).on('click','.js-header-popup',function(){
        var link = $(this).data('open');
        var popup = $('.popup-'+link);
        var display = popup.css('display');
        if(!popup.hasClass('open')){
            popup.siblings('.popup-bl').removeClass('open').slideUp();
            popup.slideDown().addClass('open');
            $('.wrapper').addClass('dark');
        }
        return false;
    });
    //закрыть Корзина/Избранное
    $(document).on('click','.js-popup-close',function(){
        $(this).parents('.popup-bl').removeClass('open').slideUp();
        if(!$('.popup-bl').hasClass('open')){
            $('.wrapper').removeClass('dark');
        }
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
            $(this).addClass('open');
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
    initZoomer();

    //тэги
    initTags();

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
    $('.js-change-pass-reset').click(function(){
        $('.js-change-pass-form').slideToggle();
        $(this).hide();
        $('.js-change-pass').show();
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

    $(document).on('click focus','.phone-mask', function(){
        this.focus();
        this.setSelectionRange(4,4);
    });

});
//при клике вне элементов
$(document).mouseup(function (e){
    if (isDesktop) {
        var div = $('.header-search-line');
        if (!div.is(e.target)
            && div.has(e.target).length === 0) {
            div.find('.header-search-result').removeClass('open');
            div.find('.header-search-line__input').val('');
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
            filtr.prev().find('.js-open-filtr').removeClass('open');
        }, 50);
    }

    var sort = $('.catalog-filter__sort-dd.open');
    if (!sort.is(e.target)
        && sort.has(e.target).length === 0) {
        setTimeout(function () {
            sort.removeClass('open').slideUp();
        }, 50);
    }

    var basket = $('.popup-basket.open');
    if (!basket.is(e.target)
        && basket.has(e.target).length === 0) {
            setTimeout(function () {
                basket.find('.js-popup-close').click();
                //basket.removeClass('open').slideUp();
            }, 50);
            //$('.wrapper').removeClass('dark');
    }

    var favorites = $('.popup-favorites.open');
    if (!favorites.is(e.target)
        && favorites.has(e.target).length === 0) {
            setTimeout(function () {
                favorites.find('.js-popup-close').click();
                //favorites.removeClass('open').slideUp();
            }, 50);
            //$('.wrapper').removeClass('dark');
    }
});


//Инициализация слайдеров

//Слайдер на детальной товара
function initCatalogDetaileSlider() {
    if($('.catalog-detail-gallery1').length>0){
        var galleryTop = new Swiper('.catalog-detail-gallery1', {
            slidesPerView: 1,
            spaceBetween: 5,
            loop: false,
            loopedSlides: 4,
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
            loop: false,
            loopedSlides: 4,
            touchRatio: 0.2
        });
        galleryTop.controller.control = galleryThumbs;
        galleryThumbs.controller.control = galleryTop;
    }
}


//Слайдер на детальной новостей
function initNewsDetaileSlider() {
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
}

//Слайдер на главной
function initIndexSlider() {
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
}

//Слайдер товаров
function initProductSlider() {
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
                    resize: function(){
                        this.update();
                    }
                }
            });
            prevSliders.push(slider);
        });
    }
}

//Слайдер новостей
function initNewsSlider() {
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
}

//Теги
function initTags() {
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
}

//Зумер
function initZoomer() {
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
}