<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Accept Bitcoin in your store in less than 3 minutes." />

    <meta property="og:title" content="Block! - The POS for the crypto era." />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Block! - The POS for the crypto era." />
    <meta property="og:description" content="Accept Bitcoin in your store in less than 3 minutes" />
    <meta property="og:url" content="https://project.blockpos.io"/>
    <meta property="og:image" content="https://project.blockpos.io/_project/img/main_banner.jpg"/>

    <!--====== TITLE TAG ======-->
    <title>Block! - The POS for the crypto era.</title>

    <!--====== STYLESHEETS =======-->
    <link rel="stylesheet" href="/_project/css/bootstrap.min.css">
    <link rel="stylesheet" href="/_project/css/animate.css">
    <link rel="stylesheet" href="/_project/css/font-awesome.min.css">
    <link rel="stylesheet" href="/_project/css/icofont.css">
    <link rel="stylesheet" href="/_project/css/modal-video.min.css">

    <!--====== OWL CAROUSEL STYLESHEETS ======-->
    <link rel="stylesheet" href="/_project/css/owl.carousel.min.css">
    <link rel="stylesheet" href="/_project/css/owl.theme.default.min.css">

    <!--====== MAIN STYLESHEETS ======-->
    <link href="/_project/css/style.css" rel="stylesheet">
    <link href="/_project/css/responsive.css" rel="stylesheet">
				<link rel="icon" href="/_project/img/favicon.png" type="image/png" />
    <style>
      body{overflow-x: hidden;}
      @media (max-width: 575.98px){
        section * {text-align: center;}
        #about-carousel{margin-top:-60px; margin-left: 20px}
        .about-block{padding-right: 0; padding-top:20px}
        .about-bg{height: 680px}
        .black-logo{height: 55px!important}
      }
    </style>
</head>

<body data-spy="scroll" data-target="#main-nav" data-offset="60">

    <!--START TOP AREA-->
    <nav class="navbar navbar-expand-lg fixed-top site-navigation white">
        <div class="container">
            <a class="navbar-brand page-scroll" href="#">
                    <img src="/_project/img/logo-w.png" alt="Bensen" class="img-fluid white-logo" style="height:80px">
                    <img src="/_project/img/logo-b.png" alt="Bensen" class="img-fluid black-logo" style="height:80px">
                </a>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"><i class="fa fa-bars"></i></span>
            </button>

            <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item first-item">
                        <a class="nav-link" href="#feature" data-scroll-nav="2"><?php echo __("messages.features"); ?></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " href="#features" data-scroll-nav="3"><?php echo __("messages.how_works"); ?></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " href="#footer-area" data-scroll-nav="5"><?php echo __("messages.pricing"); ?></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " href="/api">API</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " href="https://help.blockpos.io" target="_blank"><?php echo __("messages.help"); ?></a>
                    </li>
                </ul>
            </div>

            <ul class="list-inline top-social d-md-none d-lg-block">
																<a href="https://blockpos.io/#/login"><div class="btn btn-primary btn-xs">LOGIN</div></a>
            </ul>
        </div>
    </nav>
    <!--END TOP AREA-->

    <!--BANNER AREA START-->
    <div class="banner-bg-2 p-3 p-md-5" data-scroll-index="0">
        <div class="dark-overlay"></div>
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-sm-12">
                    <div class="main-banner-coontent white banner-padding">
                        <h1 class="lg-title"><?php echo __('messages.welcome'); ?></h1>
                        <p><?php echo __('messages.subtitle'); ?></p>
                        <!--<a href="" class="video-play promo-video" data-video-id="QoSGMKKqghQ" id="promo-video"><i class="icofont icofont-play"></i><?php echo __("messages.visualizza_video"); ?></a>-->
                        <a href="https://blockpos.io/#/register"><div class="btn btn-primary"><?php echo __('messages.iscriviti_subito_block'); ?></div></a>
                    </div>
                </div>

                <div class="col-lg-6 text-center col-sm-12 d-sm-none d-lg-block">
                    <div class="banner-img banner-padding">
                        <img src="/_project/img/banner/item-06.png" alt="" style="height:550px!important; margin-top:-50px" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--BANNER AREA END-->


    <!--ABOUT AREA START-->
    <section id="features" data-scroll-index="2" class="bg-dark">
        <div class="feature-bg-img d-none d-lg-block"></div>
        <div class="container">
            <div class="row">
                <div class="col-lg-8">
                    <div class="row">
                        <div class="col-lg-6 col-sm-6">
                            <div class="features-block">
                                <div class="features-icon">
                                    <i class="fa fa-bitcoin"></i>
                                </div>
                                <h3><?php echo __("messages.accetta_bitcoin"); ?></h3>
                                <p><?php echo __("messages.instant_settlement"); ?></p>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="features-block">
                                <div class="features-icon">
                                    <i class="fa fa-credit-card"></i>
                                </div>
                                <h3><?php echo __("messages.abbinalo_wirex"); ?></h3>
                                <p><?php echo __("messages.credit_card"); ?></p>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="features-block">
                                <div class="features-icon">
                                    <i class="fa fa-file"></i>
                                </div>
                                <h3><?php echo __("messages.organizza_business"); ?></h3>
                                <p><?php echo __("messages.accounting_made_easy"); ?></p>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="features-block">
                                <div class="features-icon">
                                    <i class="fa fa-lock"></i>
                                </div>
                                <h3><?php echo __("messages.veloce_sicuro"); ?></h3>
                                <p><?php echo __("messages.secure_and_fast"); ?></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--ABOUT AREA 	END-->

    <!--ABOUT AREA START-->
    <section id="about" data-scroll-index="3">
        <div class="about-bg "></div>
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-sm-12">
                    <div class="about-block">
                        <h5 class="subtitle"><?php echo __("messages.da_sapere"); ?></h5>
                        <h3 class="md-title"><?php echo __("messages.come_funziona"); ?></h3>
                        <p><?php echo __("messages.come_funziona_testo"); ?></p>
                    </div>
                </div>
                <div class="col-lg-6 col-sm-12">
                    <div class="carousel slide" id="about-carousel">
                        <ol class="carousel-indicators">
                            <li data-target="#about-carousel" data-slide-to="0" class="active"></li>
                            <li data-target="#about-carousel" data-slide-to="1"></li>
                            <li data-target="#about-carousel" data-slide-to="2"></li>
                        </ol>
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="about-box">
                                            <h2><?php echo __("messages.richiesta"); ?></h2>
                                            <p><?php echo __("messages.richiesta_testo"); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="about-box">
                                            <h2><?php echo __("messages.attesa"); ?></h2>
                                            <p><?php echo __("messages.attesa_testo"); ?></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="about-box">
                                            <h2><?php echo __("messages.conferma"); ?></h2>
                                            <p><?php echo __("messages.conferma_testo"); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="about-box">
                                            <h2><?php echo __("messages.preleva"); ?></h2>
                                            <p><?php echo __("messages.preleva_testo"); ?></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a class="carousel-control-prev" href="#about-carousel" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                      </a>
                        <a class="carousel-control-next" href="#about-carousel" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                      </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--ABOUT AREA 	END-->

    <!-- PROCESS AREA START-->
    <section id="process" style="overflow:hidden;">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-4 col-sm-4 col-md-4">
                    <div class="process-box">
                        <h3><?php echo __("messages.bitcoin"); ?></h3><br>
                        <div class="line"></div>
                        <p><?php echo __("messages.multilevel_technology"); ?></p>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-4 col-md-4">
                    <div class="process-box">
                        <h3><?php echo __("messages.al_passo"); ?></h3><br>
                        <div class="line"></div>
                        <p><?php echo __("messages.simple_way"); ?></p>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-4 col-md-4">
                    <div class="process-box">
                        <h3><?php echo __("messages.su_misura"); ?></h3><br>
                        <div class="line"></div>
                        <p><?php echo __("messages.for_your_business"); ?></p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- PROCESS AREA END-->

    <!-- PARALLAX VIDEO AREA START-->
    <section id="parallax" class="bg-feature">
        <div class="container">
            <div class="row">
                <div class="col-lg-5 col-sm-5 col-md-6">
                    <div class="parallax-content">
                        <h4 class="md-title"><?php echo __("messages.perfetto_wirex"); ?></h4>
                        <a href="https://links.wirexapp.com/MpmB/4bTIQcutbK?action=affiliate-register&code=XZtHvOL6eEuNox0aZISPYg" target="_blank" class="btn btn-dark btn-circled"><?php echo __("messages.iscriviti_subito"); ?></a>
                    </div>
                </div>
                <div class="col-lg-6 col-sm-7 offset-lg-1 col-md-6">
                    <div class="video-bg">
                        <img src="/_project/img/video-bg.jpg" alt="" style="margin-top:8px" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- PARALLAX VIDEO AREA END-->

    <!--PRICING AREA START-->
    <section id="pricing" data-scroll-index="5">
        <div class="container">
            <div class="row" style="margin-bottom:-80px">
                <div class="col-lg-8 m-auto">
                    <div class="heading text-center">
                        <h3 class="md-title"><?php echo __("messages.i_prezzi"); ?></h3><br>
                        <h5><?php echo __("messages.i_prezzi_testo"); ?></h5>
                        <br><br>
                        <img src="/_project/img/Bitcoin_QR_code.png" width="200"><br><br>
                        <?php echo __("messages.dona"); ?>
                    </div>
                </div>
            </div>

            <div class="row" style="display:none">
                <div class="col-lg-4 col-sm-12">
                    <div class="pricing-block">
                        <span class="price-title">Software POS</span>
                        <h5 class="price-sub">it's free, really!</h5>
                        <h3 class="pricing">0<small>€</small></h3>
                        <p>Use our software for free, no ads, no fees, nothing.</p>
                        <ul>
                            <li> <i class="icofont icofont-tick-mark"></i>iOS Ready</li>
                            <li><i class="icofont icofont-tick-mark"></i>Android Ready</li>
                            <li><i class="icofont icofont-tick-mark"></i>Installable like an app</li>
                        </ul>
                        <a href="https://blockpos.io/#/register" class="btn btn-dark btn-circled">REGISTER</a>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-12">
                    <div class="pricing-block">
                        <span class="price-title">Premium POS</span>
                        <h5 class="price-sub">best for start</h5>
                        <h3 class="pricing">149<small>€</small></h3>
                        <p>Store your Bitcoin in your local wallet or wallet app, suggested for advanced users.</p>
                        <ul>
                            <li> <i class="icofont icofont-tick-mark"></i>Android Phone</li>
                            <li><i class="icofont icofont-tick-mark"></i>Premium metal stand</li>
                            <li><i class="icofont icofont-tick-mark"></i>Device pre-check</li>
                        </ul>
                        <a href="#" class="btn btn-dark btn-circled">Purchase</a>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-12">
                    <div class="pricing-block active">
                        <span class="price-title">Premium POS + Ledger</span>
                        <h5 class="price-sub">Maximum of security</h5>
                        <h3 class="pricing">249<small>€</small></h3>
                        <p>Store securely your Bitcoin in a Ledger device, suggested for all users.</p>
                        <ul>
                            <li> <i class="icofont icofont-tick-mark"></i>All include in Premium</li>
                            <li><i class="icofont icofont-tick-mark"></i>Ledger Nano S</li>
                            <li><i class="icofont icofont-tick-mark"></i>Premium support</li>
                        </ul>
                        <a href="#" class="btn btn-dark btn-circled">Purchase</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--PRICING AREA END-->

    <!--FOOTER AREA-->
    <footer id="footer-area" class="" data-scroll-index="6">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="footer-top-area">
                        <div class="row">
                            <div class="col-lg-4 col-sm-4 text-center">
                               <div class="footer-logo">
                                   <img src="/_project/img/logo-w.png" alt="Footer logo" class="img-fluid" style="height:70px"><br>
                                   <?php echo __("messages.turinglabs"); ?>
                               </div>
                            </div>

                            <div class="col-lg-4 col-sm-4">
                                <div class="footer-contact">
                                    <div class="footer-icon">
                                        <i class="icofont icofont-mobile-phone"></i>
                                    </div>
                                    <h4><?php echo __("messages.contattaci"); ?></h4>
                                    <p>‭+39 320 6979967‬</p>
                                </div>
                            </div>

                            <div class="col-lg-4 col-sm-4">
                                <div class="footer-contact">
                                    <div class="footer-icon">
                                        <i class="icofont icofont-envelope"></i>
                                    </div>
                                    <h4><?php echo __("messages.scrivici"); ?></h4>
                                    <p><a style="color:#fff!important; text-decoration:underline" href="mailto:info@turinglabs.org">info@turinglabs.org</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </footer>
    <!--FOOTER AREA END-->


    <!--====== SCRIPTS JS ======-->
    <script src="/_project/js/jquery.min.js"></script>
    <script src="/_project/js/vendor/popper.min.js"></script>
    <script src="/_project/js/vendor/bootstrap.min.js"></script>

    <!--====== PLUGINS JS ======-->

    <script src="/_project/js/waypoints.min.js"></script>
    <script src="/_project/js/scrollit.js"></script>
    <script src="/_project/js/owl-carousel.2.3.0.min.js"></script>
    <script src="/_project/js/jquery-modal-video.min.js"></script>

    <!--===== Custom ACTIVE JS=====-->
    <script src="/_project/js/main.js"></script>
    <!-- Fathom - simple website analytics - https://github.com/usefathom/fathom -->
    <script>
    (function(f, a, t, h, o, m){
        a[h]=a[h]||function(){
            (a[h].q=a[h].q||[]).push(arguments)
        };
        o=f.createElement('script'),
        m=f.getElementsByTagName('script')[0];
        o.async=1; o.src=t; o.id='fathom-script';
        m.parentNode.insertBefore(o,m)
    })(document, window, '//hub.usesfathom.com/tracker.js', 'fathom');
    fathom('set', 'siteId', 'TOOXY');
    fathom('trackPageview');
    </script>
    <!-- / Fathom -->
</body>

</html>
