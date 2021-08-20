<?php

class CaptorModel
{
    public function setNewMeasureDHT11($id_captor, $temperature, $humidity)
    {
        include RELATIVE_PATH['database'] . 'connection.php';
        $query = $db->prepare("INSERT INTO " . $db_prefix . "dht11(id_captor,temperature,humidity,date)
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
                                FROM " . $db_prefix . "dht11 
                                WHERE id = (SELECT MAX(id) FROM " . $db_prefix . "dht11 WHERE id_captor = ?)");
        $query->execute([
            $id_captor,
        ]);
        return $query->fetch();
    }

    public function getNLastMeasuresDHT11($id_captor, $n)
    {
        include RELATIVE_PATH['database'] . 'connection.php';
        $query = $db->prepare("SELECT temperature, humidity, date
                                FROM " . $db_prefix . "dht11
                                WHERE id_captor = ? ORDER BY id DESC LIMIT " . $n);
        $query->execute([
            $id_captor,
        ]);
        return $query->fetchAll();
    }

    public function getMeasuresBetweenTwoDate($id_captors, $date_start, $date_end)
    {
        $string_request = str_repeat('?,', count($id_captors) - 1);
        $string_request .= '?';
        include RELATIVE_PATH['database'] . 'connection.php';
        $query = $db->prepare("SELECT id_captor,temperature, humidity, date
                                FROM " . $db_prefix . "dht11
                                WHERE id_captor IN (" . $string_request . ") AND date BETWEEN ? AND ? 
                                ORDER by date");
        $query->execute(
            array_merge($id_captors, [$date_start, $date_end])
        );
        return $query->fetchAll();
    }

    public function getDayAverageMeasuresBetweenTwoDate($id_captor, $date_start, $date_end)
    {
        include RELATIVE_PATH['database'] . 'connection.php';
        $query = $db->prepare("SELECT ROUND(AVG(temperature)) as temperature, ROUND(AVG(humidity)) as humidity, CAST(date as date) as date
                                FROM " . $db_prefix . "dht11
                                WHERE id_captor = ? AND date BETWEEN ? AND ? 
                                GROUP BY CAST(date as date)
                                ORDER BY date");
        $query->execute([
            $id_captor,
            $date_start,
            $date_end,
        ]);
        return $query->fetchAll();
    }

}