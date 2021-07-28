<?php

include_once "../headers/headers.php";


if(!empty($_POST)){
    if($_POST['action']==='readCaptors'){
        $Captor = new CaptorModel();
        header('Content-type: application/json');
        echo json_encode($Captor->getNLastMeasuresDHT11($_POST['id_captor'],$_POST['numberOfMeasures']));
        exit();
    }
}


$menu = "home";
$template = RELATIVE_PATH['views'] . $menu;
include RELATIVE_PATH['views'] . "layout.phtml";