<?php
namespace Lgck\CoreBundle\Controller;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AbstractController extends FOSRestController {

    protected $objectClass;
    protected $objectKey;
    protected $entityMap;
    static protected $entityPath = 'Lgck\CoreBundle\Entity\\';
    static protected $userEntityPath = 'Fewnix\UserBundle\Entity\\';
    protected $entityName;

    private function keyForFilter() {
        return array('');
    }

    protected function checkRequestParameters($request, $parameters) {
        return $this->get('fewnix.validator')->checkRequestParameters($request, $parameters);
    }

    private function RecurseArray( $inarray ) {
        foreach ( $inarray as $inkey => $inval )  {
            if ( is_array($inval)) {
                return $this->RecurseArray( $inval );
            } else {
                return $inval;
            }
        }
    }

    private function updateFilterArray($array) {
        $newArray = array();
        $availableKey = $this->keyForFilter();
        $countAvailableKey = sizeof($availableKey);
        for($j = 0; $j < $countAvailableKey; $j++) {
            if(isset($array[$availableKey[$j]])) {
                $newArray[$availableKey[$j]] = $this->RecurseArray($array[$availableKey[$j]]);
            }
        }
        return $newArray;
    }

    private function isMultiArray($array) {
        return (sizeof($array) == sizeof($array,COUNT_RECURSIVE)) ? false : true;
    }

    protected function parseRequest(Request $request) {
        $filter = $request->query->get('filter');
        $find = $filter;
        if($this->isMultiArray($filter)) {
            $find = $this->updateFilterArray($filter);
        }
        $limit = ($request->query->get('count')) ? abs($request->query->get('count')) : 1; //минимально выводим 1ин обьект
        $offset = $limit * ($request->query->get('page') - 1);
        if($offset < 0) $offset = 0;

        return array('find' => $find, 'limit' => $limit, 'offset' => $offset);
    }

    protected function getRequestJson($request) {
        return $this->get('fewnix.validator')->getRequestJson($request);
    }

    protected function getUserParameter() {
        if (!$this->getUser()) {
            throw new AccessDeniedHttpException('You not authorized');
        }
        return $this->getUser();
    }


    protected function getProfile() {
        $user = $this->getUserParameter();
        $role = $user->getRoles()[0];
        $profile = array(
            'fname' => $user->getFname(),
            'sname' => $user->getSname(),
            'pname' => $user->getPname(),
            'email' => $user->getEmail(),
            'course' => $user->getCourse(),
            'avatar' => $user->getUserAvatar(),
            'id' => $user->getId(),
            'role' => $user->getRoles()[0]
        );

        if($role == 'ROLE_TEACHER') {
            if($subdivision = $user->getSubdivision()) {
                $profile['subdivision'] = $subdivision->getName();
            }
        }

        if($role == 'ROLE_STUDENT') {
            if($subdivision = $user->getSubdivision()) {
                $profile['subdivision'] = $subdivision->getName();
                $profile['course'] = $user->getCourse();
            }
        }

        return $profile;
    }
    private function getObjectRepository(){
        $em = $this->getDoctrine()->getManager();
        return $em->getRepository($this->objectClass);
    }

    public function getObjectAction($key, $permission = array()){
        $repository = $this->getObjectRepository();
        $findFunction = 'findOneBy';
        $findArray[$this->objectKey] = $key;
        if ($permission) $findArray[] = $permission;
        $object = $repository->$findFunction($findArray);
        if (!$object) {
            throw new NotFoundHttpException('Object ' . $this->entityName . ' with id = ' . $key . ' not found');
        }
        return $object;
    }

    public function getListObjectAction(Request $request, $findArray = array()){
        $repository = $this->getObjectRepository();
        $orderArray = array();
        $limit = null;
        $offset = null;

        foreach ($this->entityMap as $key => $value) {
            foreach ($value as $v) {
                if ($request->query->get($v)) {
                    $findArray[$v] = $request->query->get($v);
                }
                if ($request->query->get("orderby") == $v) {
                    $orderArray[$v] = 'DESC';
                }
            }
        }

        if (ctype_digit($request->query->get("limit"))) {
            $limit = (int)$request->query->get("limit");
        }
        if (ctype_digit($request->query->get("offset")) && ctype_digit($request->query->get("limit"))) {
            $offset = (int)$request->query->get("offset");
        }
        $objects = $repository->findBy($findArray, $orderArray, $limit, $offset);
        if (!$objects) {
            throw new NotFoundHttpException('Objects not found');
        }
        return $objects;
    }

    public function createObjectAction($data){
        $em = $this->getDoctrine()->getManager();
        $object = new $this->objectClass();

        $this->settingEntity($object, $data);

        if (!$this->get('fewnix.validator')->valid($object))
            throw new BadRequestHttpException('Valid bad');
        
        $em->persist($object);
        $this->flush($em);
        return $object;
    }

    public function updateObjectAction($id, $data){
        $repository = $this->getObjectRepository();
        $findFunction = 'findOneBy' . ucfirst($this->objectKey);
        $object = $repository->$findFunction($id);

        if (!$object) {
            throw new NotFoundHttpException('No object this key (' . $id . ').');
        }

        $em = $this->getDoctrine()->getManager();
        $this->settingEntity($object, $data);
    
        if (!$this->get('fewnix.validator')->valid($object))
            throw new BadRequestHttpException('Valid bad');

        $em->persist($object);
        $this->flush($em);

        return $object;
    }

    public function deleteObjectAction($id, $callbacks = array(), $arrayClasses = array()){

        if (sizeof($callbacks) !== sizeof($arrayClasses))
            throw new BadRequestHttpException('Size bad');

        $em = $this->getDoctrine()->getManager();
        $repository = $this->getObjectRepository();
        $findFunction = 'findOneBy' . ucfirst($this->objectKey);
        $object = $repository->$findFunction($id);
        if (!$object)
            throw new NotFoundHttpException('Objects not found');

        $object->deleteFlag = true;
        $count = sizeof($arrayClasses);
        for ($i = 0; $i < $count; $i++) {
            $items = $em->getRepository(self::$entityPath . $arrayClasses[$i])
                ->findBy(array(lcfirst($this->entityName) => $id));

            if ($items) {
                $callBack = $callbacks[$i];
                call_user_func($callBack, $em, $items, $object);
            }
        }

        if ($object->deleteFlag) {
            $em->remove($object);
        }

        $this->flush($em);
        return array('ms' => 'ok');
    }

    private function settingEntity(&$object, $data){
        $mainObjectClass = $this->objectClass;
        while(list($key) = each($this->entityMap)) {
            foreach ($this->entityMap[$key] as $v) {
                $setter = 'set' . ucfirst($v);
                $prevValue = '';
                if ($key == 'object') {
                    $prevValue = $v;
                    $v = 'id_' . $v;
                }
                if (array_key_exists($v, $data)) {
                    if ($key === 'field') {
                        if (isset($data[$v])) {
                            $object->$setter($data[$v]);
                        }
                    } else {
                        if (isset($data[$v])) {
                            if ($v == 'id_parent') {
                                if ($data[$v] == 0) {
                                    $object->$setter(null);
                                } else {
                                    $object->$setter($this->getObjectAction($data[$v]));
                                }
                            } else {
                                if($prevValue == 'user') {
                                    $this->objectClass = self::$userEntityPath . ucfirst($prevValue);
                                } else {
                                    $this->objectClass = self::$entityPath . ucfirst($prevValue);
                                }
                                $object->$setter($this->getObjectAction($data[$v]));
                            }
                        }
                    }
                }
            }
        }
        $this->objectClass = $mainObjectClass;
        unset($object);
    }

    public function flush($em) {
        try {
            $em->flush();
        } catch (\Exception $e) {
            throw new BadRequestHttpException('Error with Database ' . $e->getMessage());
        }
        return true;
    }
}