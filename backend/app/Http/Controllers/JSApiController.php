<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Http\File;
use Illuminate\Support\Str;
use App\Http\Controllers\PaymentsController;

use App\Mail\PrivateKeyRequest;
use Illuminate\Support\Facades\Mail;

class JSApiController extends Controller{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    function init(Request $request){
     $this->validate($request, [
      'pk' => 'required',
      'amount' => 'required'
     ]);

     $checkpk = app("db")->collection('api_keys')->where('pk',$request->input('pk'))->first();

     if(isset($checkpk['_id'])){
       $response='key valid'; 
       $amount = $request->input('amount'); 
       $response = $amount;
       if($amount > 0){
          $loggeduser = app("db")->collection('users')->where('_id',$checkpk['user'])->first();
          $token = app("db")->collection('tokens')->where('user',$loggeduser['_id'])->first();
          $request = new Request();
          $parameters=[
            "token" => $token['token'],
            "amount" => $amount,
            "currency" => $loggeduser['currency']
          ];
          $request->merge($parameters);
          $Payment = new PaymentsController();
          $payment=(array)$Payment->init($request);

          $qr = "https://chart.googleapis.com/chart?cht=qr&chl=".$payment['original']['data']['URI']."?amount=".$payment['original']['data']['amount']."&chs=400x400&chld=H|0";
	        $imageData = base64_encode(file_get_contents($qr));
          $qrimg = 'data:image/png;base64,'.$imageData;
  
          $response=[
            "amount_btc" => floatval($payment['original']['data']['amount']),
            "address" => $payment['original']['data']['address'],
            "URI" => $payment['original']['data']['URI'],
            "qrcode"=> $qrimg,
            "price" => $payment['original']['data']['price'],
            "request" => $payment['original']['data']['request'],
            "currency" => $loggeduser['currency'],
            "request_id" => $payment['original']['data']['rid']
          ];

       }else{
         $error='Amount must be more than 0';
         $status=501;
       }

     }else{
       $error='PrivateKey is invalid, please login again in Block!POS and generate a new private key';
       $status=402;
     }

     if(isset($response)){
      return $this->success($response);
     }elseif(isset($error)){
      return $this->error($error,$status);
     }else{
      return $this->error("Something goes wrong.",404);
     }
    }

    function request(Request $request){
     $this->validate($request, [
      'token' => 'required'
     ]);

     $token = app("db")->collection('tokens')->where('token',$request->input('token'))->first();
     if(isset($token['_id'])){
      $loggeduser = app("db")->collection('users')->where('_id',$token['user'])->first();
      if(isset($loggeduser['_id'])){
       $privatekey=str_replace('/','',app("hash")->make($loggeduser['_id'].'*'.date('Y-m-d H:i:s')));
       app("db")->table('api_keys')->insert(
          [
           'user' => $loggeduser['_id'],
           'created_at' => date('Y-m-d H:i:s'),
           'pk' => $privatekey
          ]
       );
       Mail::to($loggeduser['email'])->send(new PrivateKeyRequest($privatekey));
       $response='Private key sent!';
      }else{
       $error='Token must be valid.';
       $status=401;
      }
     }else{
      $error='Token must be valid.';
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
}
