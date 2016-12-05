<?php
namespace Lgck\ServiceBundle\Controller;
use Lgck\CoreBundle\Controller\AbstractController;
use Lgck\CoreBundle\EntityMap\GroupMap;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Put;
use FOS\RestBundle\Controller\Annotations\Delete;

class GroupController extends AbstractController{

    public function __construct() {
        $this->entityName = 'Group';
        $this->objectClass = self::$entityPath . $this->entityName;
        $this->objectKey   = 'id';
        $this->entityMap = GroupMap::map();
    }

    /**
     * @Get("/groups")
     */
    public function getGroupsAction() {
        $em = $this->getDoctrine()->getManager();
        $find = array('status' => [StatusObject::STATUS_OBJECT_ACTIVE]);
        $groups = $em->getRepository('LgckCoreBundle:Group')->findObjects($find);
        if($groups) {
            $count = $em->getRepository('LgckCoreBundle:Group')->findCountObjects($find);
            return ['items' => $groups, 'count' => $count];
        }
        throw new NotFoundHttpException('Groups not found');
    }

    /**
     * @Get("/groups/{id}")
     */
    public function getGroupAction($id) {
        return parent::getObjectAction($id);
    }

    /**
     * @Post("/groups")
     */
    public function postGroupAction(Request $request) {
        $data = $this->getRequestJson($request);
        return parent::createObjectAction($data);
    }

    /**
     * @Put("/groups/{id}")
     */
    public function putGroupAction(Request $request, $id) {
        $data = $this->getRequestJson($request);
        return parent::updateObjectAction($id, $data);
    }

    /**
     * @Delete("/groups/{id}")
     */
    public function deleteGroupAction() {
        return [];
    }
}