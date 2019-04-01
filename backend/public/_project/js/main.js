jQuery(function ($) {
    "use strict";

    var footerHeight = $(".main-wrapper").height();
    $(".main-wrapper").css('margin-bottom', footerHeight + 'px');

    /*------------------------------------
        SCROLL NAV BACKGROUND ACTIVE
    ------------------------------------*/

    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 70) {
            $('.site-navigation').addClass('header-white');
        } else {
            $('.site-navigation').removeClass('header-white');
        }
    });

    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 70) {
            $(' .top-nav').addClass('header-white-top');
        } else {
            $(' .top-nav').removeClass('header-white-top');
        }
    });

    $(".gallery-item").owlCarousel({
        items: 4,
        margin: 10,
        loop: true,
        autoplay: false,
        nav: false,
        dots: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        mouseDrag: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 4,
            }
        }
    });

    // Collapse navbar on click

    $(document).on('click.nav', '.navbar-collapse.in', function (e) {
        if ($(e.target).is('a')) {
            $(this).removeClass('in').addClass('collapse');
        }
    });

    jQuery(document).on('ready', function () {
        /* Closes the Responsive Menu on Menu Item Click*/
        $('.navbar-collapse ul li a').on('click', function () {
            $('.navbar-toggler:visible').click();
        });
    });


    //    Main slider

    $('.carousel').carousel({
        interval: 4000
    })

    /*---------------------------
        VIdeo PLAY
    -----------------------------*/
    $(".promo-video").modalVideo();



    /*---------------------------
        MENU SMOOTH SCROLL
      -----------------------------*/
    // scrollIt
    $.scrollIt({
        upKey: 38, // key code to navigate to the next section
        downKey: 40, // key code to navigate to the previous section
        easing: 'easing', // the easing function for animation
        scrollTime: 600, // how long (in ms) the animation takes
        activeClass: 'active', // class given to the active nav element
        onPageChange: null, // function(pageIndex) that is called when page is changed
        topOffset: -40 // offste (in px) for fixed top navigation
    });


    /* Testimonial Box Carousel */


});
