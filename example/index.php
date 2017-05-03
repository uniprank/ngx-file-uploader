<?php 

################################################################
#### HEADER CONFIG
################################################################
$http_origin = @$_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://localhost" || $http_origin == "http://localhost:8080" || 
    $http_origin == "http://localhost:8000" || $http_origin == "https://uniprank.github.io") {
    header("Access-Control-Allow-Origin: $http_origin");
    header("Access-Control-Expose-Headers: X-Auth-UID, X-Auth-Token, X-Auth-Expiration");
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }

}

var_dump($_FILES);

