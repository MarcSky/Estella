<?php
namespace Lgck\CoreBundle\EntityMap;

class SubdivisionMap {
    static public function map(){
        return array(
            'field' => array('name'),
            'object' => array('parent')
        );
    }
}