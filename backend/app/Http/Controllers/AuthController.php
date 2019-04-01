<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use App\Mail\RegisterConfirmationEmail;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

    }

    public function login(Request $request){
     $this->validate($request, [
         'email' => 'required',
         'password' => 'required'
     ]);
     $check = app("db")->collection('users')->where('email',$request->input('email'))->first();

     if(isset($check['_id'])){
      if($check['email_verified'] == 'Y'){
        if (app("hash")->check($request->input('password'), $check['password'])) {
          $token=str_replace('/','',app("hash")->make($check['_id'].'*'.date('Y-m-d H:i:s')));
          app("db")->table('tokens')->insert(
             [
              'user' => $check['_id'],
              'type' => 'login',
              'created_at' => date('Y-m-d H:i:s'),
              'token' => $token
             ]
          );
          unset($check['password']);
          $check['token']=$token;
          $response=$check;
          $status=200;
        }else{
         $error="Wrong e-mail or password.";
         $status=401;
        }
      }else{
       $error="E-Mail not verified, please access your e-mail and click on confirm link.";
       $status=401;
      }
     }else{
      $error="Wrong e-mail or password.";
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

    public function requestresetpassword(Request $request){
     $this->validate($request, [
         'email' => 'required'
     ]);
     $check = app("db")->collection('users')->where('email',$request->input('email'))->first();

     if(isset($check['_id'])){
      if($check['email_verified'] == 'Y'){

          $user_agent=$request->header('Client-User-Agent');
          $token=str_random(64);

          $checkAgent = app("db")->collection('tokens')->where('user',$check['_id'])->where('type','reset')->first();
          if(!isset($checkAgent['_id'])){
            app("db")->table('tokens')->insert(
               [
                'user' => $check['_id'],
                'type' => 'reset',
                'created_at' => date('Y-m-d H:i:s'),
                'user_agent' => $user_agent,
                'token' => $token
               ]
            );
          }else{
            app("db")->collection('tokens')->where('user',$check['_id'])->where('user_agent',$user_agent)->update(['token' => $token]);
          }
          $response=$token;
          $status=200;
      }else{
       $error="E-Mail not verified, please access your e-mail and click on confirm link.";
       $status=404;
      }
     }else{
      $error="Wrong e-mail or password.";
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

    public function resetpassword(Request $request){
     $this->validate($request, [
         'token' => 'required',
         'password' => 'required'
     ]);

     $check = app("db")->collection('tokens')->where('token',$request->input('token'))->where('type','reset')->first();

     if(isset($check['_id'])){
      $user = app("db")->collection('users')->where('_id',$check['user'])->first();
      if(isset($user['_id'])){
        if(strtotime('now +1 hour') > $check['created_at']){
         app("db")->collection('tokens')->where('token',$request->input('token'))->delete();
         app("db")->collection('users')->where('_id',$check['user'])->update(['password' => app("hash")->make($request->input('password'))]);
         $response='Password resetted.';
         $status=200;
        }else{
         app("db")->collection('tokens')->where('token',$request->input('token'))->delete();
         $status=401;
         $error='Token expired.';
        }
      }else{
       $error="User not found.";
       $status=401;
      }
     }else{
      $error="Wrong token.";
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

    public function register(Request $request){
     $this->validate($request, [
         'service' => 'required',
         'email' => 'required',
         'name' => 'required',
         'password' => 'required'
     ]);

     $check = app("db")->collection('users')->where('email',trim($request->input('email')))->first();

     if(!isset($check['_id'])){
      $expmail=explode('@',$request->input('email'));
      $checkusername = app("db")->collection('users')->where('username',$expmail[0])->first();
      if(!isset($checkusername['_id'])){
       $username=$expmail[0];
      }else{
       $username=$expmail[0].rand();
      }
      if($request->input('openid') != null){
       $openid=$request->input('openid');
      }else{
       $openid='';
      }
      $token=str_replace('/','',app("hash")->make($request->input('email').strtotime('now')));
      app("db")->table('users')->insert(
         [
          'email' => $request->input('email'),
          'email_verified' => 'Y',
          'name' => $request->input('name'),
          'username' => $username,
          'password' => app("hash")->make($request->input('password')),
          'token' => $token,
          'service' => $request->input('service'),
          'openid' => $openid,
          'avatar' => $request->input('avatar'),
          'cover' => '/images/user_background.jpg',
          'visibility' => 'public',
          'registration_date' => date('Y-m-d H:i:s')
         ]
     );
      Mail::to($request->input('email'))->send(new RegisterConfirmationEmail($token));

      $response = 'User registered, now verify your e-mail!';
      $status = 200;

     }else{
      $error="E-Mail already registered.";
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

    public function verify($token){
       $checktoken = app("db")->collection('users')->where('token',$token)->first();
       if(isset($checktoken['_id'])){
        $checktoken = app("db")->collection('users')->where('token',$token)->update(['email_verified'=>'Y']);
        return '<script>window.location="/#/login"</script>';
       }else{
        return 'NOTHING HERE. RETRY.';
       }
    }
}
