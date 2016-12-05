<?php
namespace Lgck\CoreBundle\EntityMap;

class NoteMap {
    static public function map(){
        return array(
            'field' => array('description'),
            'object' => array('theme', 'user')
        );
    }
}