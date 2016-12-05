<?php
namespace Lgck\CoreBundle\EntityMap;

class DocumentMap {
    static public function map(){
        return array(
            'field' => array('status', 'path'),
            'object' => array('creator')
        );
    }

}