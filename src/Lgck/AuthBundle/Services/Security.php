<?php

namespace Lgck\AuthBundle\Services;

use Doctrine\ORM\EntityManager;
use Fewnix\UserBundle\Component\UserRoles;
use Fewnix\UserBundle\Entity\User;
use Lgck\CoreBundle\Services\Validator;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Encoder\MessageDigestPasswordEncoder;

class Security {

    const HASH_ALGORITHM = 'sha512';
    const MIN_LENGTH_PASSWORD = 7;

    private $em;
    private $validator;

    public function __construct(EntityManager $entityManager, Validator $validator) {
        $this->em        = $entityManager;
        $this->validator = $validator;
    }

    private function passwordValid($password, $length = self::MIN_LENGTH_PASSWORD) {
        if(strlen($password) < $length) {
            throw new BadRequestHttpException('too small password');
        }
        return true;
    }

    private function getMessageDigitPasswordEncoder() {
        return new MessageDigestPasswordEncoder(self::HASH_ALGORITHM, false, 10);
    }

    public function changeProfile($data){
        $this->passwordValid($data['password']);
        $user = $this->em->getRepository('FewnixUserBundle:User')->findObjects(array('email' => $data['email']));
        if(!$user instanceof User) {
            throw new NotFoundHttpException('User not found');
        }

        $pwd = $this->getMessageDigitPasswordEncoder();
        $prev_password_hash = $pwd->encodePassword($data['prev_password'], $user->getSalt());
        if($prev_password_hash != $user->getPassword()) {
            throw new BadRequestHttpException('Prev password incorrect');
        }

        $user->setSalt($user->generateRandom());
        $password = $pwd->encodePassword($data['password'], $user->getSalt());
        $user->setPassword($password);

        if(isset($data['email'])) {
            $user->setEmail($data['email']);
        }

        if(!$this->validator->valid($user)){
            throw new BadRequestHttpException('Validator error');
        }

        $this->em->persist($user);
        $this->flush($this->em);
        return $user;
    }

    public function resetPassword($personal){
        $user = $this->em->getRepository('FewnixUserBundle:User')->findObjects(array('email' => $personal));

        if(!$user instanceof User)
            throw new NotFoundHttpException('User not found');

        $pwd = $this->getMessageDigitPasswordEncoder();
        $user->setSalt($user->generateRandom());
        $hashPassword = $pwd->encodePassword($personal, $user->getSalt());
        $user->setPassword($hashPassword);

        if(!$this->validator->valid($user)){
            throw new BadRequestHttpException('Validator error');
        }

        $this->em->persist($user);
        $this->flush($this->em);
        return $personal;
    }

    public function forgotPassword($email){
        $user = $this->em->getRepository('FewnixUserBundle:User')->findObjects(array('email' => $email));

        if(!$user instanceof User)
            throw new NotFoundHttpException('User not found');

        $pwd = $this->getMessageDigitPasswordEncoder();
        $user->setSalt($user->generateRandom());
        $password = $user->generatePassword();
        $hashPassword = $pwd->encodePassword($password, $user->getSalt());
        $user->setPassword($hashPassword);

        if(!$this->validator->valid($user)){
            throw new BadRequestHttpException('Validator error');
        }

        $this->em->persist($user);
        $this->flush($this->em);
        return $password;
    }

    public function registration($data) {
        $this->passwordValid($data['password']);
        $user = new User();
        $pwd = $this->getMessageDigitPasswordEncoder();
        $password = $pwd->encodePassword($data['password'], $user->getSalt());
        $user->setPassword($password);

        if(isset($data['email'])) {
            $user->setEmail($data['email']);
        } else {
            throw new BadRequestHttpException('Email error');
        }

        if(isset($data['role']) && $data['role'] > 0) {
            $user->addRole(UserRoles::getRole($data['role']));
        } else {
            throw new BadRequestHttpException('Bad role');
        }

        if(isset($data['fname'])) {
            $user->setFname($data['fname']);
        }

        if(isset($data['sname'])) {
            $user->setSname($data['sname']);
        }

        if(!$this->validator->valid($user)){
            throw new BadRequestHttpException('Validator error');
        }

        $this->em->persist($user);

        $this->flush($this->em);
        return $user;
    }

    protected function flush($em) {
        try {
            $em->flush();
        } catch(\Exception $e) {
            throw new BadRequestHttpException('Error with change password');
        }
    }
} 