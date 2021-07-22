<?php

/* Definition des chemins relatif et absolu */
define("ABSOLUTE_PATH", substr(__DIR__, 0, -7));
define("RELATIVE_PATH", [
    "controllers" => ABSOLUTE_PATH . "controllers/",
    "models" => ABSOLUTE_PATH . "models/",
    "classes" => ABSOLUTE_PATH . "classes/",
    "views" => ABSOLUTE_PATH . "views/",
    "headers" => ABSOLUTE_PATH . "headers/",
    "database" => ABSOLUTE_PATH . "database/",
]);


/* Include des modèles */
include RELATIVE_PATH['models'] . "CaptorModel.php";

/* Include des classes */
include RELATIVE_PATH['classes'] . "Session.php";

/* Fonction pour charger une icône en svg */
function icon($name, $dimensions)
{
    return '<svg class="icons i_' . $dimensions . '" role="img"><use xlink:href="public/icons/fonts-defs.svg#' . $name . '"></use></svg>';
}