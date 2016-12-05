<?php
namespace Lgck\ServiceBundle\Controller;
use Lgck\CoreBundle\Controller\AbstractController;
use FOS\RestBundle\Controller\Annotations\Get;
use Symfony\Component\HttpFoundation\Request;

class BootstrapController extends AbstractController {

    /**
     * @Get("/bootstrap")
     */
    public function getBootstrapAction(Request $request){
        $user = $this->getProfile();
        if(isset($user['avatar'])) {
            $user['avatar'] = $request->getScheme() . '://' . $request->getHttpHost() . '/' . $user['avatar'];
        }
        return $user;
    }

}