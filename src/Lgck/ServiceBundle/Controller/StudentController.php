<?php
namespace Lgck\ServiceBundle\Controller;
use JMS\Serializer\SerializationContext;
use Lgck\CoreBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use FOS\RestBundle\Controller\Annotations\Get;

class StudentController extends AbstractController{

    /**
     * @Get("/students")
     */
    public function getStudentListAction(Request $request) {
        $data = $this->parseRequest($request);
        $em = $this->getDoctrine()->getManager();
        $data['find']['roles'] = array('ROLE_STUDENT');
        $teachers = $em->getRepository('FewnixUserBundle:User')->findObjects($data['find'], $data['limit'], $data['offset']);
        if($teachers) {
            $view = $this->view();
            $view->setSerializationContext(SerializationContext::create()->setGroups(['users_list', 'users_list_with_themes']));
            $count = $em->getRepository('FewnixUserBundle:User')->findCountObjects($data['find']);
            $view->setData(['items' => $teachers, 'count' => $count]);
            return $view;
        }
        throw new NotFoundHttpException('Teachers not found');
    }

    /**
     * @Get("/students/{id}")
     */
    public function getStudentOneAction($id) {
        $em = $this->getDoctrine()->getManager();
        $student = $em->getRepository('FewnixUserBundle:User')->find($id);
        $view = $this->view();
        $view->setSerializationContext(SerializationContext::create()->setGroups('user_detail'));
        $view->setData($student);
        return $view;
    }

}