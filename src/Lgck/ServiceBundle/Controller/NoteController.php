<?php
namespace Lgck\ServiceBundle\Controller;
use JMS\Serializer\SerializationContext;
use Lgck\CoreBundle\Controller\AbstractController;
use Lgck\CoreBundle\EntityMap\NoteMap;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Put;
use FOS\RestBundle\Controller\Annotations\Delete;

class NoteController extends AbstractController{

    public function __construct() {
        $this->entityName = 'Note';
        $this->objectClass = self::$entityPath . $this->entityName;
        $this->objectKey   = 'id';
        $this->entityMap = NoteMap::map();
    }
    
    /**
     * @Get("/notes")
     */
    public function getNoteListAction(Request $request){
        $data = $this->parseRequest($request);
        $em = $this->getDoctrine()->getManager();
        $notes = $em->getRepository('LgckCoreBundle:Note')->findObjects($data['find'], $data['limit'], $data['offset']);
        if($notes) {
            $count = $em->getRepository('LgckCoreBundle:Note')->findCountObjects($data['find']);
            $view = $this->view();
            $view->setSerializationContext(SerializationContext::create()->setGroups('notes_list'));
            $view->setData(['items' => $notes, 'count' => $count]);
            return $view;
        }
        throw new NotFoundHttpException('Note not found');
    }

    /**
     * @Get("/notes/{id}", requirements={"id" = "\d+"})
     */
    public function getNoteAction($id){
        $view = $this->view();
        $view->setSerializationContext(SerializationContext::create()->setGroups('notes_list'));
        $view->setData(parent::getObjectAction($id));
        return $view;
    }

    /**
     * @Post("/notes")
     */
    public function postNoteAction(Request $request) {
        $data = $this->getRequestJson($request);
        $data['id_user'] = $this->getUserParameter()->getId();
        $object = parent::createObjectAction($data);
        return ['id' => $object->getId()];
    }

    /**
     * @Put("/notes/{id}", requirements={"id" = "\d+"})
     */
    public function putNoteAction(Request $request, $id) {
        $data = $this->getRequestJson($request);
        $object = parent::updateObjectAction($id, $data);
        return ['id' => $object->getId()];
    }
    
    /**
     * @Delete("/notes/{id}", requirements={"id" = "\d+"})
     */
    public function deleteNoteAction($id) {
        $data['status'] = StatusObject::STATUS_OBJECT_DELETE;
        return parent::updateObjectAction($id, $data);
    }
}