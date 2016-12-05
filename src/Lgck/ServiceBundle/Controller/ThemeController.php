<?php
namespace Lgck\ServiceBundle\Controller;
use Lgck\CoreBundle\Controller\AbstractController;
use Lgck\CoreBundle\EntityMap\ThemeMap;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Put;
use FOS\RestBundle\Controller\Annotations\Delete;

class ThemeController extends AbstractController{
    
    public function __construct() {
        $this->entityName = 'Theme';
        $this->objectClass = self::$entityPath . $this->entityName;
        $this->objectKey   = 'id';
        $this->entityMap = ThemeMap::map();
    }
    
    /**
     * @Get("/themes")
     */
    public function getThemesAction(Request $request) {
        $em = $this->getDoctrine()->getManager();
        $data = $this->parseRequest($request);
        $user = $this->getUserParameter();
        if ($this->get('security.authorization_checker')->isGranted('ROLE_STUDENT')) {
            $data['find']['id_student'] = $user->getId();
        }
        $data['find']['status'] = [StatusObject::STATUS_OBJECT_ACTIVE];
        $themes = $em->getRepository('LgckCoreBundle:Theme')->findObjects($data['find'], $data['limit'], $data['offset']);
        if($themes) {
            $count = $em->getRepository('LgckCoreBundle:Theme')->findCountObjects($data['find']);
            return ['items' => $themes, 'count' => $count];
        }
        throw new NotFoundHttpException('Themes not found');
    }

    /**
     * @Get("/themes/{id}", requirements={"id" = "\d+"})
     */
    public function getThemeAction($id) {
        $object = parent::getObjectAction($id);
        $object->host = 'http://estella.local/';
        return $object;
    }

    /**
     * @Post("/themes")
     */
    public function postThemeAction(Request $request) {
        $data = $this->getRequestJson($request);
        $data['id_creator'] = $this->getUserParameter()->getId();
        if(isset($data['student'])) {
            $data['id_user'] = $data['student'];
        }
        return parent::createObjectAction($data);
    }

    /**
     * @Put("/themes/{id}", requirements={"id" = "\d+"})
     */
    public function putThemeAction(Request $request, $id) {
        $data = $this->getRequestJson($request);
        if(isset($data['student'])) {
            $data['id_user'] = $data['student'];
        }
        return parent::updateObjectAction($id,$data);
    }

    /**
     * @Delete("/themes/{id}", requirements={"id" = "\d+"})
     */
    public function deleteThemeAction($id) {
        $data['status'] = StatusObject::STATUS_OBJECT_DELETE;
        return parent::updateObjectAction($id, $data);
    }

}