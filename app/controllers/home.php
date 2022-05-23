<?php

include_once "../headers/headers.php";


if (!empty($_POST)) {
    $Captor = new CaptorModel();
    if ($_POST['action'] === 'readCaptors') {
        header('Content-type: application/json');
        $id_captors = json_decode($_POST['id_captors']);
        $response = new stdClass();
        foreach ($id_captors as $id_captor) {
            $Measure = new stdClass();
            $Measure->captorName = $Captor->getCaptorNameById($id_captor);
            $Measure->data = $Captor->getMeasuresBetweenTwoDate($id_captor, $_POST['date_start'], $_POST['date_end']);
            $response->$id_captor = $Measure;
        }
        echo json_encode($response);
        exit();
    } elseif ($_POST['action'] === 'readLastMeasures') {
        header('Content-type: application/json');
        $id_captors = json_decode($_POST['id_captors']);
        $response = new stdClass();
        foreach ($id_captors as $id_captor) {
            $Measure = new stdClass();
            $Measure->captorName = $Captor->getCaptorNameById($id_captor);
            $Measure->data = [$Captor->getLastMeasureDHT22($id_captor)];
            $response->$id_captor = $Measure;
        }
        echo json_encode($response);
        exit();
    } elseif ($_POST['action'] === 'readCaptorsDayAverage') {
        header('Content-type: application/json');
        echo json_encode($Captor->getDayAverageMeasuresBetweenTwoDate($_POST['id_captor'], $_POST['date_start'], $_POST['date_end']));
        exit();
    }
}


$menu = "home";
$template = RELATIVE_PATH['views'] . $menu;
include RELATIVE_PATH['views'] . "layout.phtml";