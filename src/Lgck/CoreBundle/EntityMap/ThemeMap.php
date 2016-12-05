<?php
namespace Lgck\CoreBundle\EntityMap;

class ThemeMap {
    static public function map(){
        return array(
            'field' => array('status', 'name', 'text'),
            'object' => array('document', 'user', 'coursework')
        );
    }
}