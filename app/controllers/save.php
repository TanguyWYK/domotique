<?php

include_once "../headers/headers.php";

if (isset($_POST) && !empty($_POST['t']) && !empty($_POST['h'])) {
    $Captor = new CaptorModel();
    $temperatures = json_decode($_POST['t']);
    $humidities = json_decode($_POST['h']);
    for ($i = 0; $i < count($temperatures); $i++) {
        $Captor->setNewMeasureDHT22($i, $temperatures[$i], $humidities[$i]);
    }
}

exit;