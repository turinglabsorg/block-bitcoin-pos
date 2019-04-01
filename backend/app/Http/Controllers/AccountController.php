<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Http\File;
use Illuminate\Support\Str;

use App\Mail\RegisterConfirmationEmail;
use Illuminate\Support\Facades\Mail;

class AccountController extends Controller{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    function balance(Request $request){
     $this->validate($request, [
         'token' => 'required'
     ]);
     $token = app("db")->collection('tokens')->where('token',$request->input('token'))->first();
     if(isset($token['_id'])){
      $loggeduser = app("db")->collection('users')->where('_id',$token['user'])->first();
      if($loggeduser['xpub'] != ''){
        $blockchain = json_decode(file_get_contents('https://blockchain.info/balance?active=' . $loggeduser['xpub']), true);
        $response = $blockchain[$loggeduser['xpub']]['final_balance'] / 100000000;
      }else{
        $blockchain = json_decode(file_get_contents('https://blockchain.info/balance?active=' . $loggeduser['address']),true);
        $response = $blockchain[$loggeduser['address']]['final_balance'] / 100000000;
      }
     }else{
      $error='Token not valid';
      $status=401;
     }

     if(isset($response)){
      return $this->success($response);
     }elseif(isset($error)){
      return $this->error($error,$status);
     }else{
      return $this->error("Something goes wrong.",404);
     }
    }

    function getinfo(Request $request){
     $this->validate($request, [
         'token' => 'required'
     ]);
     $token = app("db")->collection('tokens')->where('token',$request->input('token'))->first();
     if(isset($token['_id'])){
      $loggeduser = app("db")->collection('users')->where('_id',$token['user'])->first();
      $response['address']=$loggeduser['address'] ?? '';
      $response['company']=$loggeduser['name'] ?? '';
      $response['email']=$loggeduser['email'] ?? '';
      $response['currency']=$loggeduser['currency'] ?? '';
      $response['xpub']=$loggeduser['xpub'] ?? '';
     }else{
      $error='Token not valid';
      $status=401;
     }

     if(isset($response)){
      return $this->success($response);
     }elseif(isset($error)){
      return $this->error($error,$status);
     }else{
      return $this->error("Something goes wrong.",404);
     }
    }

    function edit(Request $request){
     $this->validate($request, [
         'token' => 'required',
         'company' => 'required',
         'email' => 'required',
         'currency' => 'required'
     ]);
     $token = app("db")->collection('tokens')->where('token',$request->input('token'))->first();
     if(isset($token['_id'])){
      $loggeduser = app("db")->collection('users')->where('_id',$token['user'])->update([
       "company" => $request->input('company'),
       "address" => $request->input('address'),
       "xpub" => $request->input('xpub'),
       "email" => $request->input('email'),
       "currency" => $request->input('currency')
      ]);
      $response='Profile edited.';
     }else{
      $error='Token not valid';
      $status=401;
     }

     if(isset($response)){
      return $this->success($response);
     }elseif(isset($error)){
      return $this->error($error,$status);
     }else{
      return $this->error("Something goes wrong.",404);
     }
    }

    function requests(Request $request){
     $this->validate($request, [
         'token' => 'required'
     ]);
     $token = app("db")->collection('tokens')->where('token',$request->input('token'))->first();
     if(isset($token['_id'])){
      $loggeduser = app("db")->collection('users')->where('_id',$token['user'])->first();
      $response = app("db")->collection('requests')->where('user',$loggeduser['_id'])->where('status','!=','Canceled')->where('received','>',0)->
        orderBy('timestamp','DESC')->get()->transform(function($request,$key){
             $request['date']=date('d/m/Y H:i',$request['timestamp']);
             return $request;
        });

     }else{
      $error='Token not valid';
      $status=401;
     }

     if(isset($response)){
      return $this->success($response);
     }elseif(isset($error)){
      return $this->error($error,$status);
     }else{
      return $this->error("Something goes wrong.",404);
     }
    }

    function mail(){
     Mail::to('sebastiano.cataudo@gmail.com')->send(new RegisterConfirmationEmail('123456'));
     $response='OK';

     if(isset($response)){
      return $this->success($response);
     }elseif(isset($error)){
      return $this->error($error,$status);
     }else{
      return $this->error("Something goes wrong.",404);
     }
    }
}
