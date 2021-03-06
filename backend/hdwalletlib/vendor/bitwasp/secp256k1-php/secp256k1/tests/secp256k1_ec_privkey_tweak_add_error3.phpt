--TEST--
secp256k1_ec_privkey_tweak_add returns false if parameter parsing fails
--SKIPIF--
<?php
if (!extension_loaded("secp256k1")) print "skip extension not loaded";
?>
--FILE--
<?php

set_error_handler(function($code, $str) { echo $str . PHP_EOL; });

$key = str_repeat("A", 32);
$keyTweak = str_repeat("A", 32);

$result = secp256k1_ec_privkey_tweak_add();
echo gettype($result) . PHP_EOL;
echo ($result ? "true" : "false") . PHP_EOL;

?>
--EXPECT--
secp256k1_ec_privkey_tweak_add() expects exactly 3 parameters, 0 given
boolean
false