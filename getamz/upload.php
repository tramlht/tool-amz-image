<?php
/**
 * Created by PhpStorm.
 * User: lhttram
 * Date: 5/4/19
 * Time: 12:06 PM
 */
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 01 Jan 1996 00:00:00 GMT');
header('Content-type: application/json; charset=UTF-8');
$rawdata = file_get_contents('php://input');
error_log(print_r('after load content', TRUE));


$dataProductPost = $rawdata;
$data_product    = json_decode($dataProductPost, true);
error_log(print_r('after json_decode ', TRUE));

if (!empty($data_product)) {
    $title = $data_product->product_Title;
    error_log(print_r($title, TRUE));

    $product_Title = strtolower($title);
    $nameImg       = str_replace(' ', '-', $product_Title);
    //Save design
    if ($data_product->design_img) {
        $imgDesign = $data_product->design_img;
        $file      = $nameImg . '.png';
        error_log(print_r($file, TRUE));

        base64ToImage($imgDesign, $file);
        //$success = file_put_contents($file, $imgDesign);
    }

    //Save Product Mockup

}

function base64ToImage($base64_string, $output_file)
{
    $file = fopen($output_file, "wb");

    $data = explode(',', $base64_string);

    fwrite($file, base64_decode($data[1]));
    fclose($file);

    return $output_file;
}


//Response To Client
function json_response($message = null, $code = 200)
{
    // clear the old headers
    header_remove();
    // set the actual code
    http_response_code($code);
    // set the header to make sure cache is forced
    header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
    // treat this as json
    header('Content-Type: application/json');
    $status = array(
        200 => '200 OK',
        400 => '400 Bad Request',
        422 => 'Unprocessable Entity',
        500 => '500 Internal Server Error'
    );
    // ok, validation error, or failure
    header('Status: ' . $status[$code]);

    // return the encoded json
    return json_encode(array(
        'status'  => $code < 300 ? 1 : 0, // success or not?
        'message' => $rawdata
    ));
}

// if you are doing ajax with application-json headers
if (empty($_POST)) {
    $_POST = json_decode(file_get_contents("php://input"), true) ?: [];
}

// usage
echo json_response(200, 'working'); // {"status":true,"message":"working"}

// array usage
echo json_response(200, array(
    'data' => array(1, 2, 3)
));
// {"status":true,"message":{"data":[1,2,3]}}

// usage with error
echo json_response(500, 'Server Error! Please Try Again!'); // {"status":false,"message":"Server Error! Please Try Again!"}
return $data_product;

?>