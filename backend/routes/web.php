<?php

use Illuminate\Http\Response;
use Illuminate\Http\Request;
use LaravelQRCode\Facades\QRCode;

$router->get('/',"WebController@load");
$router->get('/verify-account/{token}',"AuthController@verify");
$router->get('/{locale}/homepage', function ($locale) {
				app('translator')->setLocale($locale);
				return view('project');
});

$router->get('/api', function () {
	return view('api');
});

$router->get('/',"WebController@load");

/*USERS*/
$router->post('/users/login', "AuthController@login");
$router->post('/users/register', "AuthController@register");
$router->post('/users/logout', "AuthController@logout");
$router->post('/users/request-reset-password', "AuthController@requestresetpassword");
$router->post('/users/reset-password', "AuthController@resetpassword");
$router->post('/users/edit', "AuthController@edit");
$router->post('/users/get', "AuthController@get");

/*PAYMENTS*/
$router->post('/payments/init', "PaymentsController@init");
$router->post('/payments/fetch', "PaymentsController@fetch");
$router->post('/payments/check', "PaymentsController@check");
$router->get('/payments/updaterequests', "PaymentsController@updaterequests");
$router->post('/payments/cancel', "PaymentsController@cancel");

/*ACCOUNT*/
$router->post('/account/balance', "AccountController@balance");
$router->post('/account/getinfo', "AccountController@getinfo");
$router->post('/account/edit', "AccountController@edit");
$router->post('/account/requests', "AccountController@requests");
$router->post('/account/mail', "AccountController@mail");

/*BACKGROUND*/
$router->get('/background/checkstatus', "BackgroundController@checkstatus");

/*JSAPI*/
$router->post('/api/init', "JSApiController@init");
$router->post('/api/request', "JSApiController@request");
