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

// Output result
header('Content-Type: application/json');
if ($response = @file_get_contents('http://' . $region . '.battle.net' . $requestUri)) {
    echo $response;
} else {
    outputError("Bad request.");
}
