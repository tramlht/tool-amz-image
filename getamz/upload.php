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


$dataProductPost = $rawdata;
$data_product = json_decode($dataProductPost, true);
error_log(var_dump($data_product));

$path='images/download/';

if(!empty($data_product)){
    foreach($data_product as $key => $product) {
        $title = $data_product[$key];
    }

    if($data_product['product_Title']){

        $title = $data_product['product_Title'];
        error_log( print_r($title, TRUE) );

        $product_Title = strtolower($title);
        $nameImg = str_replace(' ', '-',$product_Title);
    }
    
   
    //Save Image by url
    if($data_product['img_url']){
        $imgUrl = $data_product['img_url'];
        $file = $path . $nameImg . '.png';
        $data = file_get_contents($imgUrl);
        $success = file_put_contents($file, $data);
        var_dump($success);
        
        //Save Product Mockup
        if($data_product['mockup_img_url']){
            $mockupUrl = $data_product['mockup_img_url'];
            $fileMockup = $path . $nameImg;
            mergeImages($mockupUrl, $imgUrl, $fileMockup);

        }
    }
    
    //Save design
    if($data_product['product_final_img']) {
        $imgDesign = $data_product['product_final_img'];
        $file = $path . $nameImg.'-mockup' . '.jpeg';

        base64ToImage($imgDesign,$file);
        //$data = base64_decode($imgDesign);
        //$file = UPLOAD_DIR . uniqid() . '.png';
        //$success = file_put_contents($file, $imgDesign);
    }

    
}

function getContentToImage($image_url, $output_file) {
    $file = basename($image_url); 

    //Get the file
    $content= file_get_contents($image_url);

    //Store in the filesystem.
    $fp = fopen($output_file, "w");


    fwrite($fp, $content);
    fclose($fp);
}

function base64ToImage($base64_string, $output_file) {
    $file = fopen($output_file, "wb");

    $data = explode(',', $base64_string);

    fwrite($file, base64_decode($data[1]));
    fclose($file);

    return $output_file;
}

function mergeImages($mockupUrl, $imgUrl, $nameImg) {
    var_dump($mockupUrl);
    var_dump($imgUrl);
    /*$dest = imagecreatefrompng($imgUrl);
    $src = imagecreatefromjpeg($mockupUrl);
    $file = $nameImg.'-mockup' . '.png'
    
    imagealphablending($dest, false);
    imagesavealpha($dest, true);

    $imageFinal = imagecopymerge($dest, $src, 10, 9, 0, 0, 181, 180, 100); //have to play with these numbers for it to work for you, etc.
    var_dump($imageFinal);
    $data = file_get_contents($imageFinal);
    var_dump($data);
    $success = file_put_contents($file, $data);*/
    return $success;
}

//Response To Client

// if you are doing ajax with application-json headers
if (empty($_POST)) {
    $_POST = json_decode(file_get_contents("php://input"), true) ? : [];
}

// usage
echo json_response(200, 'working'); // {"status":true,"message":"working"}

// array usage
echo json_response(200, array(
  'data' => array(1,2,3)
  ));
// {"status":true,"message":{"data":[1,2,3]}}

// usage with error
echo json_response(500, 'Server Error! Please Try Again!'); // {"status":false,"message":"Server Error! Please Try Again!"}

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
    header('Status: '.$status[$code]);
    // return the encoded json
    return json_encode(array(
        'status' => $code < 300 ? 1 : 0, // success or not?
        'message' => 'Send done'
        ));
}


return $data_product;

?>