<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Http\File;
use Illuminate\Support\Str;

class PaymentsController extends Controller{

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
      'token' => 'required',
      'amount' => 'required'
     ]);

     $token = app("db")->collection('tokens')->where('token',$request->input('token'))->first();
     if(isset($token['_id'])){
      $loggeduser = app("db")->collection('users')->where('_id',$token['user'])->first();
      $currency = $request->input('currency') ?? '';
      $price = round($this->getBTCprice($currency));
      if(strtoupper($currency) == 'BTC'){
        $amountBTC = $request->input('amount');
      }else{
        $amountBTC = round($request->input('amount')/$price,6);
      }
      if($loggeduser['xpub'] !== ''){
        $addressJSON = json_decode(exec('../hdwalletlib/hd-wallet-addrs.php -g --xpub='.$loggeduser['xpub'].' --only-unused --gen-only=1 --format=json'));
        $address = $addressJSON[0]->addr;
      }else{
        $address = $loggeduser['address'];
      }

      $uuidgen = \Webpatser\Uuid\Uuid::generate(4);
      $uuid = $uuidgen->string;
      $uri = 'btc:'.$address.'?amount='.$amountBTC;

      app("db")->table("requests")->insert(
       [
        "user" => $loggeduser['_id'],
        "amount_eur" => $request->input('amount'),
        "address" => $address,
        "amount_btc" => $amountBTC,
        "rid" => $uuid,
        "uri" => $uri,
        "status" => "Pending",
        "timestamp" => strtotime("now"),
        "price_btc" => $price,
        "currency" => $currency
       ]
      );

      $response['amount'] = $amountBTC;
      $response['request'] = $request->input('amount');
      $response['URI'] = $uri;
      $response['address'] = $address;
      $response['rid'] = $uuid;
      $response['price'] = $price;

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

    function fetch(Request $request){
     $this->validate($request, [
      'id' => 'required'
     ]);

      $request = app("db")->collection("requests")->where('rid',$request->input('id'))->first();

      if(isset($request['rid'])){
       $response['amount'] = $request['amount_btc'];
       $response['URI'] = $request['uri'];
       $response['address'] = $request['address'];
       $response['rid'] = $request['rid'];
       $response['price'] = $request['price_btc'];
       $response['currency'] = $request['currency'] ?? '€';
      }else{
       $error="Request not found";
       $status=404;
      }
     if(isset($response)){
      return $this->success($response);
     }elseif(isset($error)){
      return $this->error($error,$status);
     }else{
      return $this->error("Something goes wrong.",404);
     }
    }

    function check(Request $request){
      $this->validate($request, [
       'rid' => 'required'
      ]);

      $request = app("db")->collection('requests')->where('rid',$request->input('rid'))->first();

      if(isset($request['_id'])){
       unset($request['user']);
       unset($request['_id']);
       $response = $request;
      }else{
       $error='Request doesn\'t exist.';
       $status=404;
      }

      if(isset($response)){
       return $this->success($response);
      }elseif(isset($error)){
       return $this->error($error,$status);
      }else{
       return $this->error("Something goes wrong.",404);
      }
   }

   function cancel(Request $request){
     $this->validate($request, [
      'token' => 'required',
      'rid' => 'required'

     ]);
     $token = app("db")->collection('tokens')->where('token',$request->input('token'))->first();
     if(isset($token['_id'])){
      $loggeduser = app("db")->collection('users')->where('_id',$token['user'])->first();
      $request = app("db")->collection('requests')->where('rid',$request->input('rid'))->where('user',$loggeduser['_id'])->update(["status"=>"Canceled"]);
      $response='OK';
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

   function updaterequests(){
     for($i=1;$i<=4;$i++){
        $requests = app("db")->collection('requests')->where('status','Pending')->orderBy('timestamp','desc')->get();
        foreach($requests as $request){
          $limit=$request['timestamp'] + 7200;
          if(strtotime("now") < $limit){
            if($request['address']!=''){
              $address = json_decode(file_get_contents('https://api.blockcypher.com/v1/btc/main/addrs/'.$request["address"]));
              if($address->unconfirmed_balance > 0){
                $status='Paid';
                $amount=$address->unconfirmed_balance;
                $amount = $amount / 100000000;
              }else{
                $status='Pending';
                $amount=0;
              }
              app("db")->collection('requests')->where('rid',$request['rid'])->update([
                "status" => $status,
                "received" => $amount
              ]);
            }else{
              app("db")->collection('requests')->where('rid',$request['rid'])->update([
                "status" => "Invalid"
              ]);
            }
          }else{
            app("db")->collection('requests')->where('rid',$request['rid'])->update([
             "status" => "Expired"
            ]);
          }
        }
        sleep(15);
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
