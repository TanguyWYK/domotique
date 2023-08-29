<?php

include_once "../headers/headers.php";


if(isset($_GET)){
    $Captor = new CaptorModel();
    $temperatures = explode(",",$_GET["t"]);
    $humidities = explode(",",$_GET["h"]);
    for ($i = 0; $i < count($temperatures); $i++) {
        if($temperatures[$i]!== "-9999" && $humidities[$i]!= "-9999"){
            $Captor->setNewMeasureDHT22($i, $temperatures[$i], $humidities[$i]);
        }
    }
    //$queryString = "?t=".$_GET['t']."&h=".$_GET['h'];
    //file_get_contents("http://www.twest.fr/domotique/save".$queryString);// Attention ne pas copier cette ligne sur twest.fr
}

exit;

/*if (isset($_POST) && !empty($_POST['t']) && !empty($_POST['h'])) {
    $Captor = new CaptorModel();
    var_dump($_POST['t']);
    var_dump($_POST['h']);
    $temperatures = json_decode($_POST['t']);
    $humidities = json_decode($_POST['h']);
    for ($i = 0; $i < count($temperatures); $i++) {
        $Captor->setNewMeasureDHT22($i, $temperatures[$i], $humidities[$i]);
    }
}

exit;*/