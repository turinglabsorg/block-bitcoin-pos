<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use App\Traits\Bitcoin;
use App\Traits\ApiResponse;

class Controller extends BaseController
{
	use Bitcoin;
	use ApiResponse;
    //
}
