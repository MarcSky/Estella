<?php
namespace Fewnix\UserBundle\Repository;
use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;

class UserRepository extends EntityRepository{
    const TABLE_ALIAS = 'users';

    private function check(QueryBuilder $qb, $q) {
        if(isset($q['id']) && $q['id']) {
            $qb->andWhere(self::TABLE_ALIAS.'.id = :id')
                ->setParameter('id' , $q['id']);
        }

        if(isset($q['id_group']) && $q['id_group']) {
            $qb->leftJoin(self::TABLE_ALIAS.'.group1','g')
                ->andWhere('g.id = '.self::TABLE_ALIAS.'.group1')
                ->andWhere('g.id = '.$q['id_group']);
        }

        if(isset($q['email']) && $q['email']) {
            $qb->andWhere(self::TABLE_ALIAS.'.email = :email')
                ->setParameter('email' , $q['email']);
        }

        if(isset($q['roles']) && $q['roles']) {
            $qb->andWhere(self::TABLE_ALIAS.'.roles LIKE :role');

            if(count($q['roles']) == 1) {
                $qb->andWhere(self::TABLE_ALIAS.'.roles LIKE :role');
                $qb->setParameter('role', '%'.$q['roles'][0].'%');//получаем первую роль
            } else {
                $i = 0;
                foreach ($q['roles'] as $role) {
                    if (!$i) {
                        $qb->andWhere(self::TABLE_ALIAS.'.roles LIKE :role');
                        $qb->setParameter('role', '%'.$role.'%');
                        $i++;
                    }
                    $qb->orWhere(self::TABLE_ALIAS.'.roles LIKE :role');
                    $qb->setParameter('role', '%'.$role.'%');
                }
            }
        }

        $qb->andWhere(self::TABLE_ALIAS.'.enabled = 1');//User is not disable
    }

    public function findCountObjects($q = array()){
        $qb = $this->createQueryBuilder(self::TABLE_ALIAS);
        $qb->select('COUNT('.self::TABLE_ALIAS.')');
        $this->check($qb, $q);

        return $qb->getQuery()->getSingleScalarResult();
    }

    public function findObjects($q = array(), $limit = 0, $offset = 0){
        $qb = $this->createQueryBuilder(self::TABLE_ALIAS)
            ->select(self::TABLE_ALIAS);

        $this->check($qb, $q);
        if($offset) {
            $qb->setFirstResult($offset);
        }

        if($limit) {
            $qb->setMaxResults($limit);
            return $qb->getQuery()->getResult();
        }

        return $qb->getQuery()->getOneOrNullResult(AbstractQuery::HYDRATE_OBJECT); //fix Security.php
    }
    
}