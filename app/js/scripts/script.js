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
    $('.header-auth').clone().appendTo('.header-desktop-r1__auth');
    $('.header-call').clone().appendTo('.header-desktop-r1__call');
    $('.header-fav').clone().appendTo('.header-line2__fav');
    $('.header-backet').clone().appendTo('.header-line2__backet');
    $('.header-tren').clone().appendTo('.header-tren-desktop');
    $('.header-search').clone().appendTo('.header-search-desktop');

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
    $('.big-slider').slick({
        dots: true,
        appendArrows: '.big-slider-pagination',
        appendDots: '.big-slider-pagination',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: false
                }
            }
        ]
    });

    //слайдер товаров
    var prev = new Swiper('.prev-slider', {
        slidesPerView: 5,
        spaceBetween: 0,
        watchOverflow: true,
        navigation: {
            nextEl: '.prev-line__next',
            prevEl: '.prev-line__prev'
        },
        breakpoints: {
            1200: {
                slidesPerView: 'auto'

            },
            425: {
                centeredSlides: true
            }
        }
    });
    /*$('.prev-slider').slick({
        appendArrows: '.prev-line__nav',
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                }
            }
        ]
    });*/


});
//скроем скроку поиска при клике вне элемента
$(document).mouseup(function (e){
    if (isDesktop) {
        var div = $('.header-search-line');
        if (!div.is(e.target)
            && div.has(e.target).length === 0) {
            div.fadeOut();
        }
    }
});