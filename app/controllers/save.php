<?php

include_once "../headers/headers.php";

if(isset($_GET)){
    $Captor = new CaptorModel();
    $Captor->setNewMeasureDHT11($_GET['id_captor'],$_GET['temperature'],$_GET['humidity']);
    $queryString = "?id_captor=".$_GET['id_captor']."&temperature=".$_GET['temperature']."&humidity=".$_GET['humidity'];
    //file_get_contents("https://www.twest.fr/domotique/save".$queryString);// Attention ne pas copier cette ligne sur twest.fr
}

exit;