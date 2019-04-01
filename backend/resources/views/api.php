<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="icon" href="/_project/img/favicon.png" type="image/png" />
    <title>Block! - A JS library for Bitcoin payment buttons</title>
    <meta name="description" content="Accept Bitcoin in your website in less than 3 minutes." />

    <meta property="og:title" content="Block! - A JS library for Bitcoin payment buttons." />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Block! - A JS library for Bitcoin payment buttons." />
    <meta property="og:description" content="Accept Bitcoin in your website in less than 3 minutes" />
    <meta property="og:url" content="https://project.blockpos.io/api"/>
    <meta property="og:image" content="https://project.blockpos.io/_project/img/main_banner.jpg"/>
</head>
<body> 
    <style>
        *{font-family: 'Work Sans';}
        body{padding:40px; text-align:center}
        .pre{background:#eee; border:1px solid #eee; max-width:768px; display:inline-block; width:80%; text-align:left; border-radius:5px; font-family: 'Courier New', Courier, monospace; font-size:12px; padding:10px; color:#000}
        .blockJS-QRCode{width:200px!important; height:200px!important;}
        .blockJS-Wrapper{padding:20px 0!important;}
    </style>
    <img src="https://project.blockpos.io/_project/img/logo-b.png" width="300"><br><br>
    <h1>This is how BlockJS library works!</h1>
    <p>1) <a href="/blockJS/block-js.min.js" download>Download</a> and include BlockJS library in your project</p>
    <div class="pre">&lt;script src="block-js.js"></script></div class="pre">
    <p>2) Add BlockJS element where you want to render the button, include the data-amount parameter</p>
    <div class="pre">&lt;div id="blockJS" data-amount="3.50"></div></div class="pre">
    <p>3) Get your Private Key on <a href="https://blockpos.io/#/api" target="_blank">BlockPOS</a> and set it</p>
    <div class="pre">BlockJS.setPk('YOUR_PK_HERE')</div class="pre">
    <p>4) Handle response with javascript and do whatever you want!</p>
    <div class="pre">BlockJS.onPaymentReceipt( (success) => { alert(success) })</div class="pre"><br><br>
    <div class="pre">BlockJS.onPaymentFailure( (error) => { console.log(error) })</div class="pre">
    <h1>Test it now!</h1>
    <p>Every BTC sent here will be intended as a donation to the project!</p>

    <div id="blockJS" data-amount="3.50"></div>
    <script src="blockJS/block-js.min.js"></script>

    <script>
        BlockJS.setPk('$2y$10$34vxL.SImk1iVgXAaV65qe2hH2E7yMEJY.wMMbcTJJh.K5LCYUO')
        BlockJS.onPaymentReceipt( (success) => {
          alert(success)
        })
        BlockJS.onPaymentFailure( (error) => {
          console.log(error)
        })
    </script>
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