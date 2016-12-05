<?php
namespace Lgck\ServiceBundle\Controller;
use Fewnix\UserBundle\Entity\User;
use Lgck\CoreBundle\Controller\AbstractController;
use Lgck\CoreBundle\Entity\Coursework;
use Lgck\CoreBundle\EntityMap\CourseworkMap;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Put;
use FOS\RestBundle\Controller\Annotations\Delete;

class CourseworkController extends AbstractController {

    public function __construct() {
        $this->entityName = 'Coursework';
        $this->objectClass = self::$entityPath . $this->entityName;
        $this->objectKey   = 'id';
        $this->entityMap = CourseworkMap::map();
    }
    
    /**
     * @Get("/coursework")
     */
    public function getCourseworkListAction(Request $request){
        //название курсовой работа, преподаватели, дата сдачи курсовой работы
        $data = $this->parseRequest($request);
        $em = $this->getDoctrine()->getManager();
        $coursework = $em->getRepository('LgckCoreBundle:Coursework')->findObjects($data['find'], $data['limit'], $data['offset']);
        if($coursework) {
            $count = $em->getRepository('LgckCoreBundle:Coursework')->findCountObjects($data['find']);
            return array('items' => $coursework, 'count' => $count);
        }
        throw new NotFoundHttpException('CourseWork not found');
    }

    /**
     * @Get("/coursework/{id}", requirements={"id" = "\d+"})
     */
    public function getCourseworkAction($id){
        return parent::getObjectAction($id);
    }

    /**
     * @Post("/coursework")
     */
    public function postCourseworkListAction(Request $request) {
        $data = $this->getRequestJson($request);
        if(!isset($data['end'])) $data['end'] = time();
        if(isset($data['group'])) {
            $data['id_group'] = $data['group'];
        }
        $object = parent::createObjectAction($data);
        $this->createOrUpdateObjects($this->getDoctrine()->getManager(), $object, $data);
        return ['id' => $object->getId()];
    }

    /**
     * @Put("/coursework/{id}", requirements={"id" = "\d+"})
     */
    public function putCourseworkListAction(Request $request, $id) {
        $data = $this->getRequestJson($request);
        if(!isset($data['end'])) $data['end'] = time();
        if(isset($data['group'])) {
            $data['id_group'] = $data['group'];
        }
        $object = parent::updateObjectAction($id, $data);
        $this->createOrUpdateObjects($this->getDoctrine()->getManager(), $object, $data); //преподаватели
        return ['id' => $object->getId()];
    }

    private function createOrUpdateObjects($em, Coursework $coursework, $data) {
        if(isset($data['teachers'])) {
            $this->changeObjects($em, $coursework, $data['teachers']);
            $this->flush($em);
        }
    }

    private function changeObjects($em, $coursework, &$idArray, $entityName = 'CourseworkTeacher') {
        $objectName = substr($entityName, 10, strlen($entityName));
        $getObject = 'get' . $objectName;
        $obj = self::$entityPath . $entityName;
        $arrayObjects = $em->getRepository($obj)
            ->findObjects([
                    'id_coursework' => $coursework->getId(),
                    'status' => [StatusObject::STATUS_OBJECT_ACTIVE, StatusObject::STATUS_OBJECT_NOACTIVE]
            ]);

        if ($arrayObjects) {
            $count = sizeof($arrayObjects);
            for ($i = 0; $i < $count; $i++) {
                $id_object = $arrayObjects[$i]->$getObject()->getId();
                if ($arrayObjects[$i]->getStatus() == StatusObject::STATUS_OBJECT_ACTIVE) {
                    if (!in_array($id_object, $idArray)) {
                        $arrayObjects[$i]->setStatus(StatusObject::STATUS_OBJECT_NOACTIVE);
                        $em->persist($arrayObjects[$i]);
                    } else {
                        unset($idArray[array_search($id_object, $idArray)]);
                    }
                } else if ($arrayObjects[$i]->getStatus() == StatusObject::STATUS_OBJECT_NOACTIVE) {
                    if (in_array($id_object, $idArray)) {
                        $arrayObjects[$i]->setStatus(StatusObject::STATUS_OBJECT_ACTIVE);
                        unset($idArray[array_search($id_object, $idArray)]);
                        $em->persist($arrayObjects[$i]);
                    }
                }
            }
        }
        if(count($idArray) > 0) {
            foreach($idArray as $id) {
                $courseworkTeacher = new $obj();
                $courseworkTeacher->setCoursework($coursework);
                $newObject = $em->getRepository('FewnixUserBundle:User')->find($id);
                if(!$newObject instanceof User) continue;
                $courseworkTeacher->setTeacher($newObject);
                $em->persist($courseworkTeacher);
            }
        }
        unset($idArray);
        return true;
    }
    /**
     * @Delete("/coursework/{id}", requirements={"id" = "\d+"})
     */
    public function deleteCourseworkAction($id) {
        $data['status'] = StatusObject::STATUS_OBJECT_DELETE;
        return parent::updateObjectAction($id, $data);
    }
}