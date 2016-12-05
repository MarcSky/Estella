<?php
namespace Fewnix\FastDBFBundle\Services;
use Symfony\Component\DependencyInjection\Container;

class FileParser {

    protected $_dbfFile;
    protected $_container;
    protected $_pathToWebDir;

    public function __constructor(Container $container){
        $this->_container = $container;
        $path = $this->_container->getParameter('kernel.root_dir');
        $pathArray = explode($path, '/');
        $count = sizeof($pathArray);
        $webPath = '';
        for($i = 0; $i < $count; $i++) {
            if($count > $i + 1) {
                $webPath .= $pathArray[$i] . '/';
            }
            $webPath .= $pathArray[$i];
        }
        $this->_pathToWebDir = $webPath;
    }

    public function parse(){
        return $this->_pathToWebDir;
    }
    
}