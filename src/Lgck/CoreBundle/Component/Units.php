<?php
namespace Lgck\CoreBundle\Component;

class Units {

    const UNIT_METER_2 = 'м2';

    static public function translateNumberToText($number){
        $array = array($number => self::UNIT_METER_2);
        return $array[$number];
    }

}