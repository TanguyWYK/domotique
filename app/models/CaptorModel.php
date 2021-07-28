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
        $query = $db->prepare("SELECT temperature, humidity, date
                                FROM ".$db_prefix."dht11 
                                WHERE id = (SELECT MAX(id) FROM ".$db_prefix."dht11 WHERE id_captor = ?)");
        $query->execute([
            $id_captor,
        ]);
        return $query->fetch();
    }

    public function getNLastMeasuresDHT11($id_captor,$n){
        include RELATIVE_PATH['database'] . 'connection.php';
        $query = $db->prepare("SELECT temperature, humidity, date
                                FROM ".$db_prefix."dht11
                                WHERE id_captor = ? ORDER BY id DESC LIMIT ".$n);
        $query->execute([
            $id_captor,
        ]);
        return $query->fetchAll();
    }

}