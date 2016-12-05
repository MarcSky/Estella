<?php
namespace Lgck\ServiceBundle\Controller;
use JMS\Serializer\SerializationContext;
use Lgck\CoreBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use FOS\RestBundle\Controller\Annotations\Get;

class TeacherController extends AbstractController{

    /**
     * @Get("/teachers")
     */
    public function getTeacherListAction(Request $request) {
        $data = $this->parseRequest($request);
        $em = $this->getDoctrine()->getManager();
        $data['find']['roles'] = array('ROLE_TEACHER');
        $teachers = $em->getRepository('FewnixUserBundle:User')->findObjects($data['find'], $data['limit'], $data['offset']);
        if($teachers) {
            $view = $this->view();
            $view->setSerializationContext(SerializationContext::create()->setGroups('users_list'));
            $count = $em->getRepository('FewnixUserBundle:User')->findCountObjects($data['find']);
            $view->setData(['items' => $teachers, 'count' => $count]);
            return $view;
        }
        throw new NotFoundHttpException('Teachers not found');
    }

    /**
     * @Get("/teachers/{id}")
     */
    public function getTeacherOneAction($id) {
        $em = $this->getDoctrine()->getManager();
        return $em->getRepository('FewnixUserBundle:User')->find($id);
    }

}