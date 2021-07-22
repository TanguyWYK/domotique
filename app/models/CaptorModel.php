<?php

class CaptorModel
{
    public function setNewMeasureDHT11($id_captor,$temperature,$humidity)
    {
        include RELATIVE_PATH['database'] . 'connection.php';
        $query = $db->prepare("INSERT INTO ".$db_prefix."dht11(id_captor,temperature,humidity,date)
                                VALUE (?,?,?,NOW())");
        $query->execute([
            $id_captor,
            $temperature,
            $humidity,
        ]);
    }

    public function getLastMeasureDHT11($id_captor)
    {
        include RELATIVE_PATH['database'] . 'connection.php';
        $query = $db->prepare("SELECT temperature,humidity FROM ".$db_prefix."dht11
                                WHERE id_captor = ?
                                ORDER by id DESC LIMIT 1");
        $query->execute([
            $id_captor,
        ]);
        return $query->fetch();
    }
}