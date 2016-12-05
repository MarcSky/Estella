<?php
namespace Lgck\CoreBundle\Repository;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;
use Lgck\ServiceBundle\Component\StatusObject;

class CourseworkRepository extends EntityRepository{

    const TABLE_ALIAS = 'cw';

    private function check($q, QueryBuilder $qb) {
        if(isset($q['name']) && $q['name']) {
            $qb->andWhere($qb->expr()->like(self::TABLE_ALIAS . '.name', ':name'));
            $qb->setParameter('name', '%'.$q['name'].'%');
        }

        if(isset($q['course']) && $q['course']) {
            $qb->andWhere(self::TABLE_ALIAS.'.course = :course');
            $qb->setParameter('course', $q['course']);
        }

        if(isset($q['id_discipline']) && ctype_digit($q['id_discipline'])) {
            $qb->leftJoin(self::TABLE_ALIAS.'.discipline','d')
                ->andWhere('d.id = '.self::TABLE_ALIAS.'.discipline')
                ->andWhere('d.id = '.$q['id_discipline']);
        }
        
        if(isset($q['id_user']) && ctype_digit($q['id_user'])) {
            $qb->innerJoin('LgckCoreBundle:UserCoursework','uc');
            $qb->andWhere('uc.user = ' . $q['id_user']);
            $qb->andWhere('uc.coursework = ' . self::TABLE_ALIAS.'.id');
            $qb->andWhere('uc.status = ' . StatusObject::STATUS_OBJECT_ACTIVE);
        }

        if(isset($q['status']) && is_array($q['status'])) {
            $qb->andWhere($qb->expr()->in(self::TABLE_ALIAS.'.status', $q['status']));
        }
    }

    public function findCountObjects($q){

        $qb = $this->createQueryBuilder(self::TABLE_ALIAS);
        $qb->select('COUNT('.self::TABLE_ALIAS.')');
        $this->check($q, $qb);

        return $qb->getQuery()->getSingleScalarResult();
    }

    public function findObjects($q, $limit = null, $offset = null){
        $qb = $this->createQueryBuilder(self::TABLE_ALIAS)
            ->select(self::TABLE_ALIAS);
        $this->check($q, $qb);

        if($limit) {
            $qb->setMaxResults($limit);
        }
        if($offset) {
            $qb->setFirstResult($offset);
        }
        $qb->orderBy(self::TABLE_ALIAS.'.id', 'DESC');
        
        return $qb->getQuery()->getResult();

    }

}