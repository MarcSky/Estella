<?php
namespace Lgck\AuthBundle\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class PasswordController extends Controller{

    //Изменить пароль админа/пользователя, изменить email админа
    //Сбросить пароль пользователя
    private function changeProfile($user = array()) {
        $this->get('fewnix.security')->changeProfile($user);
        return array('ms' => 'ok');
    }

    //админ может менять логин и пароль
    public function putProfileAdminAction(Request $request) {
        $data = $this->get('fewnix.validator')->getRequestJson($request);
        if(!isset($data['password']) || !isset($data['prev_password'])) {
            throw new BadRequestHttpException('bad password value');
        }
        $user = array('password' => $data['password'], 'prev_password' => $data['prev_password']);
        if(isset($data['email'])) {
            $user['email'] = $data['email'];
        }
        return new JsonResponse($this->changeProfile($request));
    }

    //пользователь может менять только свой пароль
    public function putProfileUserAction(Request $request){
        $data = $this->get('fewnix.validator')->getRequestJson($request);
        if(!isset($data['password']) || !isset($data['prev_password'])) {
            throw new BadRequestHttpException('bad password value');
        }
        $user = array('password' => $data['password'], 'prev_password' => $data['prev_password']);
        return new JsonResponse($this->changeProfile($user));
    }

    //при сбросе пароль == лицевому счету
    public function putResetUserAction(Request $request){
        $data = $this->get('fewnix.validator')->getRequestJson($request);
        if(!isset($data['personal'])) {
            throw new BadRequestHttpException('bad personal value');
        }

        $this->get('fewnix.security')->resetPassword($data['personal']);
        return new JsonResponse(array('ms' => 'ok'));
    }

}