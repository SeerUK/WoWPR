<?php

/**
 * Filter and sanitise a request variable
 *
 * @param  string $var
 * @return string
 */
function prepareRequestVar($var)
{
    return strtolower(filter_var(urldecode($var), FILTER_SANITIZE_STRING));
}

/**
 * Output an error message
 *
 * @param  string $message
 * @return void
 */
function outputError($message)
{
    header('HTTP/1.1 400 Bad Request', true, 400);
    echo json_encode(array(
        "errors" => array(
            array(
                "message" => $message
            )
        )
    ));
}

if (isset($_GET['region']) && isset($_GET['uri'])) {
    $region     = prepareRequestVar($_GET['region']);
    $requestUri = prepareRequestVar($_GET['uri']);
} else {
    outputError("Bad request.");
    exit;
}

$cc      = curl_init();
$timeout = 10;
$url     = 'http://' . $region . '.battle.net' . $requestUri;

curl_setopt($cc, CURLOPT_CONNECTTIMEOUT, $timeout);
curl_setopt($cc, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($cc, CURLOPT_URL, $url);

$data = curl_exec($cc);

// Output result
header('Content-Type: application/json');
if ( ! curl_errno($cc)) {
    http_response_code(curl_getinfo($cc, CURLINFO_HTTP_CODE));
    echo $data;
} else {
    outputError('Battle.net API has gone away.');
}

curl_close($cc);
