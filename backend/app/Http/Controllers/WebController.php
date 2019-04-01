<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Http\File;
use Illuminate\Support\Str;

class WebController extends Controller{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    function load(Request $request){
     $domain=explode('.',$_SERVER['SERVER_NAME']);
     $language=substr($request->server('HTTP_ACCEPT_LANGUAGE'),0,2);
     if($language=='it' || $language=='en'){
       app("translator")->setLocale($language);
     }else{
       app("translator")->setLocale('en');
     }
     if($domain[0]=='project'){
      $locale = app('translator')->getLocale();
      return view('project');
     }else{
      return view('index');
     }
    }

}
