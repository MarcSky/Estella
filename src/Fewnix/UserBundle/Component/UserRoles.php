<?php
namespace Fewnix\UserBundle\Component;

class UserRoles {
    const ROLE_ADMIN = "ROLE_ADMIN";
    const ROLE_JOURNALIST_APK = "ROLE_JOURNALIST_APK";
    const ROLE_JOURNALIST_NATION = "ROLE_JOURNALIST_NATION";
    const ROLE_JOURNALIST_NORTH = "ROLE_JOURNALIST_NORTH";
    const ROLE_JOURNALIST_VOLGA = "ROLE_JOURNALIST_VOLGA";
    const ROLE_ADVERT = "ROLE_ADVERT";
    const ROLE_USER = "ROLE_USER";

    const USER_ROLE_ADMINISTRATOR = 1;
    const USER_ROLE_JOURNALIST = 2;


    //integer $role_index
    //return string

    static public function getRole($role_index){
        $roles = array(
            self::ROLE_ADMIN, self::ROLE_JOURNALIST_APK, self::ROLE_JOURNALIST_NATION,
            self::ROLE_JOURNALIST_NORTH, self::ROLE_ADVERT, self::ROLE_JOURNALIST_VOLGA, self::ROLE_USER
        );

        if($role_index <= 0 || $role_index > count($roles)) {
            return $roles[count($roles) - 1];
        }

        return $roles[$role_index - 1];
    }

    //string $role
    //return value integer
    static public function getRoleValue($role_string){
        $roles = array(
            self::ROLE_ADMIN, self::ROLE_JOURNALIST_APK, self::ROLE_JOURNALIST_NATION,
            self::ROLE_JOURNALIST_NORTH, self::ROLE_ADVERT, self::ROLE_JOURNALIST_VOLGA, self::ROLE_USER
        );
        $count = count($roles);
        $role_index = null;

        for($i = 0; $i < $count; $i++) {
            if($roles[$i] === $role_string) {
                $role_index = $i + 1;
                break;
            }
        }

        return ($role_index) ? $role_index : array_search(self::ROLE_USER, $roles) + 1;
    }
}