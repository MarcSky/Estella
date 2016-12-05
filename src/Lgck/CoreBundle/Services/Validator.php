<?php
namespace Lgck\CoreBundle\Services;

use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class Validator{
    protected $validator;

    function __construct(\Symfony\Component\Validator\Validator\ValidatorInterface $validator) {
        $this->validator = $validator;
    }

    public function valid($data) {
        $e = $this->validator->validate($data);
        return (count($e) == 0) ? true : false;
    }

    public function checkRequestParameters($request, $parameters) {
        $count = sizeof($parameters);
        for($i = 0; $i < $count; $i++) {
            if (!$request->query->get($parameters[$i])) {
                throw new BadRequestHttpException('Key ' . $parameters[$i] . ' not exist');
            }
        }
        return true;
    }

    public function getRequestJson($request) {
        if ('json' !== $request->getRequestFormat()) {
            throw new BadRequestHttpException('Invalid content type');
        }

        $data = json_decode($request->getContent(),true);
        if (json_last_error() !== JSON_ERROR_NONE || $request->getContent() == '') {
            throw new BadRequestHttpException('Invalid content type - Lenght = ' . strlen($request->getContent()));
        }
        $data = $this->cleanArray($data);
        return $data;
    }

    public function cleanInput($data, $addslashes = false)
    {
        // Fix &entity\n;
        $data = str_replace(array('&amp;','&lt;','&gt;'), array('&amp;amp;','&amp;lt;','&amp;gt;'), $data);
        $data = preg_replace('/(&#*\w+)[\x00-\x20]+;/u', '$1;', $data);
        $data = preg_replace('/(&#x*[0-9A-F]+);*/iu', '$1;', $data);
        $data = html_entity_decode($data, ENT_COMPAT, 'UTF-8');
        // Remove any attribute starting with "on" or xmlns
        $data = preg_replace('#(<[^>]+?[\x00-\x20"\'])(?:on|xmlns)[^>]*+>#iu', '$1>', $data);
        // Remove javascript: and vbscript: protocols
        $data = preg_replace('#([a-z]*)[\x00-\x20]*=[\x00-\x20]*([`\'"]*)[\x00-\x20]*j[\x00-\x20]*a[\x00-\x20]*v[\x00-\x20]*a[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2nojavascript...', $data);
        $data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*v[\x00-\x20]*b[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2novbscript...', $data);
        $data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*-moz-binding[\x00-\x20]*:#u', '$1=$2nomozbinding...', $data);
        // Only works in IE: <span style="width: expression(alert('Ping!'));"></span>
        $data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?expression[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
        $data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?behaviour[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
        $data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:*[^>]*+>#iu', '$1>', $data);
        // Remove namespaced elements (we do not need them)
        $data = preg_replace('#</*\w+:\w[^>]*+>#i', '', $data);
        if($addslashes){
            $data = addslashes($data);
        }
        do
        {
            $old_data = $data;
            $data = preg_replace('#</*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|i(?:frame|layer)|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|title|xml)[^>]*+>#i', '', $data);
        }
        while ($old_data !== $data);
        return $data;
    }

    public function cleanArray($data = array(), $addslashes = false) {
        foreach($data as $key => $value){
            if(is_array($value)){
//                $this->cleanArray($value);
                continue;
            }else{
                $data[$key] = $this->cleanInput($value,$addslashes);
            }
        }
        return $data;
    }

} 