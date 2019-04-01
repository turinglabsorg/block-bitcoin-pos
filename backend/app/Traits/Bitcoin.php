<?php

namespace App\Traits;

/**
 *
 */
trait Bitcoin{

	function getBTCprice($currency = 'eur'){
		switch($currency){
				case "$":
							$ext_currency='usd';
				break;
				case "€":
							$ext_currency='eur';
				break;
				case "£":
							$ext_currency='gbp';
				break;
				case "BTC":
							$ext_currency='btc';
				break;
				default:
							$ext_currency='eur';
				break;
		}
		$API=json_decode(file_get_contents("https://api.coingecko.com/api/v3/coins/bitcoin"),1);

		$price=$API['market_data']['high_24h'][$ext_currency] + $API['market_data']['low_24h'][$ext_currency] + $API['market_data']['current_price'][$ext_currency];
		$mid=$price/3;

		return $mid;
	}

}
