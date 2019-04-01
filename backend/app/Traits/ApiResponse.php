<?php

namespace App\Traits;
/**
 *
 */
trait ApiResponse{
	function success($array){
			return response()->json(["data"=>$array, "status"=>200], 200);
	}
	function error($array, $status = 500){
		return response()->json(["error"=>$array, "status"=>$status], $status);
	}
}
