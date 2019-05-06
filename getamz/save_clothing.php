<?php
/**
 * Created by PhpStorm.
 * User: lhttram
 * Date: 5/4/19
 * Time: 12:06 PM
 */
$imagePath = $_POST['inPath'];
return true;

function save_image($inPath,$outPath)
{ //Download images from remote server
    $in=    fopen($inPath, "rb");
    $out=   fopen($outPath, "wb");
    while ($chunk = fread($in,8192))
    {
        fwrite($out, $chunk, 8192);
    }
    fclose($in);
    fclose($out);
}
