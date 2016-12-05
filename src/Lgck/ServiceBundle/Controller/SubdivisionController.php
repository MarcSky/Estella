<?php
namespace Lgck\ServiceBundle\Controller;
use Lgck\CoreBundle\Controller\AbstractController;
use Lgck\CoreBundle\EntityMap\SubdivisionMap;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Put;
use FOS\RestBundle\Controller\Annotations\Delete;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SubdivisionController extends AbstractController{

    public function __construct() {
        $this->entityName = 'Subdivision';
        $this->objectClass = self::$entityPath . $this->entityName;
        $this->objectKey   = 'id';
        $this->entityMap = SubdivisionMap::map();
    }

    /**
     * @Get("/subdivision")
     */
    public function getSubdivisionListAction(Request $request){
        $em = $this->getDoctrine()->getManager();
        $data = $this->parseRequest($request);
        $subdivisions = $em->getRepository('LgckCoreBundle:Subdivision')->findObjects($data['find'], $data['limit'], $data['offset']);
        if($subdivisions) {
            $count = $em->getRepository('LgckCoreBundle:Subdivision')->findCountObjects($data['find']);
            return ['items' => $subdivisions, 'count' => $count];
        }
        throw new NotFoundHttpException('Not found subdivisions');
    }

    /**
     * @Get("/subdivision/{id}", requirements={"id" = "\d+"})
     */
    public function getSubdivisionOneAction($id){
        return parent::getObjectAction($id);
    }

    /**
     * @Post("/subdivision")
     */
    public function postSubdivisionOneAction(Request $request){
        $data = $this->parseRequest($request);
        return parent::createObjectAction($data);
    }


    /**
     * @Put("/subdivision/{id}", requirements={"id" = "\d+"})
     */
    public function putSubdivisionOneAction(Request $request, $id){
        $data = $this->parseRequest($request);
        return parent::updateObjectAction($id, $data);
    }

    /**
     * @Delete("/subdivision/{id}", requirements={"id" = "\d+"})
     */
    public function deleteSubdivisionOneAction(){
        return [];
    }

}