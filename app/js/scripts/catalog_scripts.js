$(document).ready(function () {
    //проверка на оформление заказа
    if(getCookie('createOrder')==='yes'){
        $('#sucsess').iziModal('open');
        deleteCookie('createOrder');
    }

    //Согласие на 18+
    check18plus();

    $(document).on('click','.plus18__btn_yes',function () {
        setCookie('plus18','yes');
        $('#plus18').iziModal('close');
        checkCookie();
    });

    //Использование куков
    $(document).on('click','.cookies__button',function () {
        setCookie('use_cookie','yes');
        $('#cookies').fadeOut();
    });

    //Подсказки в профиле
    var address = $("#address");
    var suggestionsArr = [];
    address.suggestions({
        token: "86cf75a59cc2b5b4969030989d45a8fdfc5651db",
        type: "ADDRESS",
        onSearchStart: function(){
            $('#address_variant').html('');
        },
        onSuggestionsFetch: function(suggestions){
            try{
                suggestionsArr = suggestions;
                $('.suggestions-wrapper').hide();

                suggestions.forEach(function (item,index) {
                    $('#address_variant').append(
                        `<div class="lk-page__dd-item profile-item" style="cursor: pointer;" index="${index}">${item.unrestricted_value}</div>`
                    );
                });

                $('.lk-page__dd').addClass('open');

            }catch (e) {
                console.log(e.message);
            }

        },

    });

    //Подсказки в табе почта россии оформление заказа
    var createOrderPost = $('#post_delivery_city');
    var suggestionsArr_orderPost = [];
    createOrderPost.suggestions({
        token: "86cf75a59cc2b5b4969030989d45a8fdfc5651db",
        type: "ADDRESS",
        onSearchStart: function(){
            $('#address_variant_post').html('');
        },
        onSuggestionsFetch: function(suggestions){
            try{
                suggestionsArr_orderPost = suggestions;
                $('.suggestions-wrapper').hide();

                suggestions.forEach(function (item,index) {
                    $('#address_variant_post').append(
                        `<div class="lk-page__dd-item order-post-item" style="cursor: pointer;" index="${index}">${item.unrestricted_value}</div>`
                    );
                });

                $('.order-post_variant').addClass('open');
            }catch (e) {
                console.log(e.message);
            }

        },

    });

    //Подсказки в табе курьер оформление заказа
    var suggestionsOrderCourier = $('#courier_delivery_city');
    var suggestionsArr_orderCourier = [];
    suggestionsOrderCourier.suggestions({
        token: "86cf75a59cc2b5b4969030989d45a8fdfc5651db",
        type: "ADDRESS",
        onSearchStart: function(){
            $('#address_variant_courier').html('');
        },
        onSuggestionsFetch: function(suggestions){
            try{
                suggestionsArr_orderCourier = suggestions;
                $('.suggestions-wrapper').hide();

                suggestions.forEach(function (item,index) {
                    $('#address_variant_courier').append(
                        `<div class="lk-page__dd-item order-courier-item" style="cursor: pointer;" index="${index}">${item.unrestricted_value}</div>`
                    );
                });

                $('.order-courier_variants').addClass('open');
            }catch (e) {
                console.log(e.message);
            }

        },

    });

    //Клик на подсказку в профиле
    $(document).on('click','.profile-item',function () {
       address.suggestions().setSuggestion(
           suggestionsArr[$(this).attr('index')]
       );
        suggestionEvent(address.suggestions().selection);
        changeAddress();
        $('.lk-page__dd').removeClass('open');
    });

    //Клик на подсказаку оформление заказа почта
    $(document).on('click','.order-post-item',function () {
        createOrderPost.suggestions().setSuggestion(
            suggestionsArr_orderPost[$(this).attr('index')]
        );
        changeAddressOrderPost(createOrderPost.suggestions().selection);
        $('.order-post_variant').removeClass('open');
    });

    //Клик на подсказаку оформление заказа почта
    $(document).on('click','.order-courier-item',function () {
        suggestionsOrderCourier.suggestions().setSuggestion(
            suggestionsArr_orderCourier[$(this).attr('index')]
        );
        changeAddressOrderCourier(suggestionsOrderCourier.suggestions().selection);
        $('.order-courier_variants').removeClass('open');
    });


    //ДОбавить товар в корзину
    $(document).on('click','.addToBasket',function () {
        addToBasket($(this).attr('productId'));
    });

    //Добавить товар в избранное
    $(document).on('click','.addToFavorites',function () {
        console.log('add to Favorite');
        var controller = this;
        var productId = $(this).attr('productId');
        if(productId==''){
            console.log('Пустой id товара');
            return;
        }


        $.post('/ajax/catalog.php',{
            addFavorites:'addFavorites',
            PRODUCT_ID:productId

        }).done(function (response) {
            try{
                response = JSON.parse(response);
                if(response['status']==true){
                    $(document).find('.addToFavorites').each(function () {
                        if($(this).attr('productId')==productId){
                            $(this).toggleClass('active');
                        }
                    });
                    updateSmalFavContent();
                }else{
                    console.log('Ошибка обновления избранного');
                }
            }catch (e) {
                console.log(response);
                console.info(e.message);
            }

        });
    });

    //Удалить товар из корзины
    $(document).on('click','.removeToBasket',function () {
        let productId = $(this).attr('productId');
        if(productId==false || productId=='' || productId==0){
            console.log('Товар не установлен');
            return;
        }
        let root = $(this);
        $.post("/ajax/basket.php",{
            removeToBasket:'removeToBasket',
            PRODUCT_ID:productId
        }).done(function (response) {
            try{
                response = JSON.parse(response);
                if(response['status']==true){
                    let item_count = $(root).parents('.prev-line__swiper').find('.prev-line__item').length;
                    $(document).find('.order__items-count .order__prev-val').text(item_count-1);
                    $(root).parents('.prev-line__item').remove();

                    $(document).find('.order__items-sum .order__prev-val').text(response['data']+' руб.');

                }else{
                    console.log('Error');
                    console.log(response);

                }
            }catch (e) {
                console.log(e.message);
                console.log(response);
            }

            preloader('stop');
        });


    });

    //Очистить корзину
    $(document).on('click','.clearBasket',function () {
        preloader('start');
        $.post("/ajax/basket.php",{
            clearBasket:'clearBasket',
        }).done(function (response) {
            response = JSON.parse(response);
            if(response==true){
                console.log(response);
                window.location.reload();
            }else{
                console.log('Error');
                console.log(response);
                preloader('stop');
            }

        });
    });

    //Живой поиск (шапка)
    $(document).on('input','.header-search-line__input',function () {
       let query = $(this).val();
       liveSearch(query);
    });
    $(document).on('click','.header-search-line__submit',function () {
        let query = $(document).find('.header-search-line__input').val();
        liveSearch(query);
    });

    //Применить купон (Малая корзина)
    $(document).on('click','#addPromocode_smallBasket',function () {
        let promo = $(this).parent().find('input[type="text"]').val();
        if(promo=='') return;
        let control = $(this);
        $.post(
            '/ajax/basket.php',{
                setCoupon:'setCoupon',
                COUPON:promo
            }
        ).done(function (response) {
            response = JSON.parse(response);
            if(response==true){
                updateSmallBasketContent(false);
            }else{
                $(control).parent().find('.popup-bl__promo-input ').addClass('error');
            }
        });
    });

    //Применить купон (основная корзина)
    $(document).on('click','#addPromocode_basket',function () {
        let promo = $(this).parent().find('input[type="text"]').val();
        if(promo=='') return;
        let control = $(this);
        $.post(
            '/ajax/basket.php',{
                setCoupon:'setCoupon',
                COUPON:promo
            }
        ).done(function (response) {
            response = JSON.parse(response);
            if(response==true){
                window.location.reload();
            }else{
               $(control).parent().find('.order__prev-input').addClass('error');
            }
        });
    });

    //Оплата наличными
    $(document).on('click','.payCard',function () {
        createOrder(true);
    });

    //Оплата картой
    $(document).on('click','.payCash',function () {
        createOrder(false);
    });

    //купить в 1 клик
    $(document).on('click','.card__one-click',function () {
        $('#oneclick').find('.buyInOneClick').attr('productId',$(this).attr('productId'));
    });
    $(document).on('click','.catalog-detail__one-click',function () {
        $('#oneclick').find('.buyInOneClick').attr('productId',$(this).attr('productId'));
    });
    $(document).on('click','.buyInOneClick',function () {

        $('#oneclick').find('.mess-fail').hide();
        $('#oneclick').find('.mess-success').hide();


        let product_id = $(this).attr('productId');
        let name = $('#oneclick_user_name').val();
        let phone = $('#oneclick_user_phone').val();

        if(phone=='' || name=='' || product_id==''){
            $('#oneclick').find('.mess-fail').show();
            setTimeout(function () {
                $('#oneclick').find('.mess-fail').hide();
                $('#oneclick').find('.mess-success').hide();
            },5000);
            return;
        }

        $.post(
            '/ajax/catalog.php',{
                byInOneClick:'byInOneClick',
                name:name,
                phone:phone,
                product_id:product_id
            }
        ).done(function (response) {
           if(response == true){
               $('#oneclick').find('.mess-success').show();
               setTimeout(function () {
                   $('#oneclick').iziModal('close');
               },5000);
           }else{
               $('#oneclick').find('.mess-fail').show();
               setTimeout(function () {
                   $('#oneclick').find('.mess-fail').hide();
                   $('#oneclick').find('.mess-success').hide();
               },5000);
           }
        });
    });

    //Поиск по Enter в лайв поиске
    $(document).on('keyup','.header-search-line__input',function (event) {
        if(event.keyCode==13){
            let params = $(this).val();
            window.location.href=`/search/?q=${params}`;
        }

    });

    //Увеличить кол-во товара
    $(document).on('click','.js-plus',function () {
        let productId = $(this).attr('productId');
        let quantity = Number($(this).parents('.js-count-wrap').find('.quantity').val())+1;
        if(productId=='' || quantity==''){
            return;
        }
        if(quantity<1){
            quantity=1;
        }
        updateQuantityProduct(productId,quantity);
        $(this).parents('.js-count-wrap').find('.quantity').val(quantity);

    });

    //Уменьшить кол-во товара
    $(document).on('click','.js-minus',function () {
        let productId = $(this).attr('productId');
        let quantity = Number($(this).parents('.js-count-wrap').find('.quantity').val())-1;
        if(productId=='' || quantity==''){
            return;
        }
        if(quantity<1){
            quantity=1
        }
        updateQuantityProduct(productId,quantity);
        $(this).parents('.js-count-wrap').find('.quantity').val(quantity);

        if(quantity<1){
            $(this).addClass('disabled');
        }
    });
});

//Обновить текст на значеке Избранное в шапке
function updateTextSmallFav() {
    let favProductCount = $('#favProductCount').val();
    if(favProductCount=='' || favProductCount==undefined) favProductCount=0;
    if(favProductCount>9){
        favProductCount = "9+";
    }
    $('.header-fav__counter').html(`<span>Товаров: </span> ${favProductCount}`);
}

//Обновить контент в блоке Избранное в Шапке
function updateSmalFavContent() {
    $.post(
        '/ajax/catalog.php',{
            getFavorities:'getFavorities'
        }
    ).done(function (response) {
        let updateHtml=$(`<div>${response}</div>`).find('#fav_smal_product .prepareData').text();
        $(document).find('#fav_smal_product .prepareData').text(updateHtml);
        fav_smal_product_vue.update();
        initProductSlider();
    });
}

//Обновит текст на значке Малой корзины
function updateTextSmallBasket() {
    let smallBasketCount = $('#smallBasketCount').val();
    if(smallBasketCount=='' || smallBasketCount==undefined) smallBasketCount=0;
    if(smallBasketCount>9){
        smallBasketCount = "9+";
    }
    $('.header-backet__counter').html(`<span>Товаров: </span> ${smallBasketCount}`);
}

//Обновить контент малой корзины
function updateSmallBasketContent(showAddNot=true) {
    $.post(
        '/ajax/catalog.php',{
            getSmallBasketContent:'getSmallBasketContent'
        }
    ).done(function (response) {
        let updateHtml=$(`<div>${response}</div>`).find('.popup-basket').html();
        $(document).find('.popup-basket').html(updateHtml);
        updateTextSmallBasket();
        initProductSlider();
        preloader('stop');
        if(showAddNot){
            $('#notification').iziModal('open');
        }
    });
}

//Прелоадер
function preloader(event) {
    if(event=='start'){
        $('.preloader').show();
    }
    if(event=='stop'){
        $('.preloader').hide();
    }

}

//Живой поиск
function liveSearch(query) {
    if(query.length==0){
        $(document).find('.header-search-result').removeClass('open');
    }
    if(query.length<=3){
        return;
    }
    $(document).find('.header-search-result').removeClass('open');

    $.get(
        '/ajax/catalog.php',{
            getSearchResult:'getSearchResult',
            q:query
        }

    ).done(function (response) {
        let content = $(`<div>${response}</div>`).find('.header-search-result').html();
        $(document).find('.header-search-line__wrapper').find('.header-search-result').html(content);
        $(document).find('.header-search-line__wrapper').find('.header-search-result').addClass('open');
    });
}

//Обработчик подсказок
function suggestionEvent(data) {
    let city    = data.data.city;
    let region  = data.data.region;
    let street  = data.data.street
    let house   = data.data.house;
    let room    = data.data.flat;

    if(data.data.block_type!=null){
        house+=' '+data.data.block_type;
    }
    if(data.data.block!=null){
        house+=' '+data.data.block;
    }

    if(city!=null){
        $('#address').val(city);
    }

    if(street!=null){
        $('#personal_street').val(street);
    }

    if(house!=null){
        $('#personal_house').val(house);
    }

    if(room!=null){
        $('#personal_room').val(room);
    }

}

//Автозаполнение адреса из формы (профиль)
function changeAddress() {
    let street  = $('#personal_street').val();
    let house   = $('#personal_house').val();
    let rooom   = $('#personal_room').val();

    let addres = `${street}, ${house}, ${rooom}`;
    $('#PERSONAL_STREET_MAIN').val(addres);
}

//Автозаполнение оформление заказа почта россии
function changeAddressOrderPost(data) {
    let city    = data.data.city;
    let region  = data.data.region;
    let street  = data.data.street
    let house   = data.data.house;
    let room    = data.data.flat;

    if(city!=null){
        $('#post_delivery_city').val(city);
    }

    if(street!=null){
        $('#post_delivery_street').val(street);
    }

    if(house!=null){
        $('#post_delivery_house').val(house);
    }

    if(room!=null){
        $('#post_delivery_room').val(room);
    }

}

//Автозаполнение оформление заказа доставка курьером
function changeAddressOrderCourier(data) {
    let city    = data.data.city;
    let region  = data.data.region;
    let street  = data.data.street
    let house   = data.data.house;
    let room    = data.data.flat;

    if(city!=null){
        $('#courier_delivery_city').val(city);
    }

    if(street!=null){
        $('#courier_delivery_street').val(street);
    }

    if(house!=null){
        $('#courier_delivery_house').val(house);
    }

    if(room!=null){
        $('#courier_delivery_room').val(room);
    }
}

//Создать заказ
function createOrder(card=false) {
    $('#createOrder').find('.mess-fail').hide();

    let email = $('#email').val();

    const regex = /\S*@\S*[.]\S{2,4}/ui;
    const str = email;
    let m;
    if ((m = regex.exec(str)) === null) {
        $("#createOrder").find('.order__input').map(function (){
            if($(this).val()==''){
                $(this).addClass('error');
            }
        });
        $('#createOrder').find('.mess-fail').show();
        setTimeout(function () {
            $('#createOrder').find('.mess-fail').hide();
        },5000);

        return;
    }

    let phone = $('#phone').val();
    let delivery = null;

     if($('.order__tag').length>0){
         $('.order__tag').each(function () {
             if($(this).hasClass('selected')){
                 delivery = $(this).attr('data-tag');
             }
         });
     }

    switch (delivery){
        case 'd1': delivery = 3;   break;
        case 'd2': delivery = 4;   break;
        case 'd3': delivery = 5;   break;
        default: delivery=3; break;
    }

    let pickup_fio = $('#pickup_FIO').val();
    let delivery_city = null;
    if($('#pickCity1').is(':checked')){
        delivery_city = 'ARH';
    }
    if($('#pickCity2').is(':checked')){
        delivery_city = 'SEVSK';
    }

    let param = {
        createOrder:'createOrder',
        email:email,
        phone:phone,
        delivery_service: delivery,
        delivery_location:delivery_city,
    };
    if(delivery===3){
        param.fio = pickup_fio;
    }
    if(delivery===4){
        let post_delivery_city      = $('#post_delivery_city').val();
        let post_delivery_street    = $('#post_delivery_street').val();
        let post_delivery_house     = $('#post_delivery_house').val();
        let post_delivery_room      = $('#post_delivery_room').val();
        let post_delivery_zip       = $('#post_delivery_zip').val();
        let post_delivery_FIO       = $('#post_delivery_FIO').val();

        param.fio = post_delivery_FIO;
        param.address = `${post_delivery_city}, ${post_delivery_house}, ${post_delivery_street}, ${post_delivery_room}, ${post_delivery_zip}`;
    }
    if(delivery===5){
        let courier_delivery_city      = $('#courier_delivery_city').val();
        let courier_delivery_street    = $('#courier_delivery_street').val();
        let courier_delivery_house     = $('#courier_delivery_house').val();
        let courier_delivery_room      = $('#courier_delivery_room').val();
        let courier_delivery_FIO       = $('#courier_delivery_FIO').val();

        param.fio = courier_delivery_FIO;
        param.address = `${courier_delivery_city}, ${courier_delivery_house}, ${courier_delivery_street}, ${courier_delivery_room}`;

    }
    if(card===false){
        param.paySysCode = 'cash';
    }else{
        param.paySysCode = 'yandexcheckout';
    }

    for(let key in param){
        let item = param[key];
        if(item==''){
            $("#createOrder").find('.order__input').map(function (){
                if($(this).val()==''){
                    $(this).addClass('error');
                }
            });
            $('#createOrder').find('.mess-fail').show();
            setTimeout(function () {
                $('#createOrder').find('.mess-fail').hide();
            },5000);
            return;
        }
    }

    $.post('/ajax/basket.php',param).done(function (response) {
        console.log(response);
        try{
            response = JSON.parse(response);
            let result = response['result'];
            if(result===true){
                setCookie('createOrder','yes');
                if(param.paySysCode=='yandexcheckout'){
                    window.open(`/basket/payment/?ORDER_ID=${response['order']}`);
                }
               window.location.reload();
            }else{

                if(response['productNotFound']!=undefined){

                    let productnotFound = response['productNotFound'];
                    let productList='';
                    productnotFound.forEach(function (item) {
                        productList+=`<li>${item}</li>`;
                    });
                    productList = `<ul>${productList}</ul>`
                    $('#productNotFound').find('.product-list_list').html(productList);
                    $('#productNotFound').iziModal('open');
                }
                console.log(response);
            }
        }catch (e) {
            console.log(e.message);
            console.log(response);
        }

    });

}

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// устанавливает cookie с именем name и значением value
// options - объект с свойствами cookie (expires, path, domain, secure)
function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

// удаляет cookie с именем namepayCard
function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    });
}

//Добавить товар в корзину
function addToBasket(product_id) {
    if(product_id=='' || product_id==undefined || product_id==null){
        console.log('Продукт не установлен');
        return;
    }
    $.post('/ajax/basket.php',{
        addToBasket:'addToBasket',
        PRODUCT_ID:product_id
    }).done(function (response) {
        try{
            response = JSON.parse(response);
            if(Number.isInteger(response)){
                $(this).addClass('selected');
                updateSmallBasketContent();
            }else{
                console.log('Ошибка добавления товара в корзину');
                console.log('PRODUCT_ID:'+product_id);
                console.log(response);
            }
        }catch (e) {
            console.log(e.message);
            console.log(response);
            $('#oneclick').iziModal('open');
        }
    });
}

//Обновить кол-во товара в корзине
function updateQuantityProduct(productId,quantity) {
    $.post(
        '/ajax/basket.php',{
            updateCountProduct:'updateCountProduct',
            QUANTITY:quantity,
            PRODUCT_ID:productId
        }
    ).done(function (response) {
        try{
            response = JSON.parse(response);
            if(response['status']===true){
                $(document).find('.popup-bl__itog-sum').each(function () {
                    $(this).text(`${response.data} руб.`);
                });
                $(document).find('.order__items-sum .order__prev-val').each(function () {
                    $(this).text(`${response.data} руб.`);
                });

            }
        }catch (e) {
            console.log(response);
            console.log(e.message);
        }

    })
}

//Декодирование html символов
function htmlspecialchars(str) {
    var map =
        {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#039;': "'",

        };
    let parse = str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});
    parse = parse.replace(/(?:\r\n|\r|\n)/g, '');
    parse = parse.replace(/(?:\t)/g,' ');
    return parse;
}

//установить фильтр для кого
function setForWhom(forWhom='') {
    if(forWhom=='') return;
    switch (forWhom){
        case 'man': setCookie('for_whom','man'); break;
        case 'woman': setCookie('for_whom','woman'); break;
        case 'couples': setCookie('for_whom','couples'); break;
        default: setCookie('for_whom','man'); break;
    }
    window.location.reload();
}

//Проверка на 18+
function check18plus() {
    if(getCookie('plus18')!='yes'){
        $('#plus18').iziModal('open');
    }else{
        checkCookie();
    }
}

//Проверка на куки
function checkCookie() {
    if(getCookie('use_cookie')!='yes'){
        $('#cookies').show();
    }
}