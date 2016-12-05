<?php
namespace Lgck\CoreBundle\EntityMap;

class CourseworkMap {
    static public function map(){
        return array(
            'field' => array('status', 'name', 'end'),
            'object' => array('group', 'creator')
        );
    }
}