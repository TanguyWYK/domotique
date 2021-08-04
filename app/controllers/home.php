<?php

include_once "../headers/headers.php";


if (!empty($_POST)) {
    if ($_POST['action'] === 'readCaptors') {
        $Captor = new CaptorModel();
        header('Content-type: application/json');
        echo json_encode($Captor->getMeasuresBetweenTwoDate($_POST['id_captor'], $_POST['date_start'], $_POST['date_end']));
        exit();
    } elseif ($_POST['action'] === 'readLastMeasures') {
        $Captor = new CaptorModel();
        header('Content-type: application/json');
        echo json_encode([$Captor->getLastMeasureDHT11($_POST['id_captor'])]);
        exit();
    } elseif ($_POST['action'] === 'readCaptorsDayAverage') {
        $Captor = new CaptorModel();
        header('Content-type: application/json');
        echo json_encode($Captor->getDayAverageMeasuresBetweenTwoDate($_POST['id_captor'], $_POST['date_start'], $_POST['date_end']));
        exit();
    }
}


$menu = "home";
$template = RELATIVE_PATH['views'] . $menu;
include RELATIVE_PATH['views'] . "layout.phtml";