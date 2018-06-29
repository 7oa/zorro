// js jquery
var isDesktop = window.matchMedia('(min-width: 1200px)').matches;
$(window).on('load resize', function(){
    isDesktop = window.matchMedia('(min-width: 1200px)').matches;
});
$(document).ready(function() {
    //toggle моблильное меню
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
    $('.header-search').click(function(){
        if (isDesktop) {
            $('.header-search-line').fadeIn();
        }
    });

    //слайдер на главной
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

    //слайдер товаров
    var prevSliders = [];
    $('.prev-slider').each(function(index, element){
        $(this).addClass('s'+index);
        $(this).parent().find('.prev-line__next').addClass('next'+index);
        $(this).parent().find('.prev-line__prev').addClass('prev'+index);
        var slider = new Swiper('.s'+index, {
            slidesPerView: 5,
            spaceBetween: 0,
            watchOverflow: true,
            navigation: {
                nextEl: '.next'+index,
                prevEl: '.prev'+index
            },
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
        prevSliders.push(slider);
    });

    //слайдер новостей
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

    //слайдер картинок на детальной
    var detailSlider = new Swiper('.catalog-detail-gallery', {
        slidesPerView: 'auto',
        spaceBetween: 5,
        preventClicks: false,
        preventClicksPropagation: false
    });

    //выбор размеров
    $('.js-tobasket').click(function(){
        $(this).parent().fadeOut()
            .next('.js-props').fadeIn();
    });
    $('.card').mouseleave(function(){
        $(this).children('.js-hover').css('display', '');
        $(this).children('.js-props').css('display', '');
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
            $(this).next().slideToggle();
        }
    });

    //фильтр
    $('.js-open-filtr-btn').click(function(){
        $(this).toggleClass('open')
            .next().slideToggle();
    });
    $('.js-open-filtr').click(function(){
        $(this).parents('.catalog-filter__item-body').next().slideToggle();
    });

    //сортировка
    $('.js-sort-open').click(function(){
        $(this).next().slideToggle();
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

    //смена картинки в детальной каталога
    $(document).on('click', '.js-small-img', function(){
        var smImg = $(this).data('image');
        var zoomImg = $(this).data('zoom-image');
        $(this).addClass('active').siblings().removeClass('active');
        $('.js-big-img').attr('src',smImg).attr('data-zoom-image',zoomImg);
        $('.zoomWindow').css('background-image','url('+zoomImg+')');
    });
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

});
//скроем строку поиска при клике вне элемента
$(document).mouseup(function (e){
    if (isDesktop) {
        var div = $('.header-search-line');
        if (!div.is(e.target)
            && div.has(e.target).length === 0) {
            div.fadeOut();
        }
    }
});