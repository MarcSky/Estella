<?php
namespace Lgck\CoreBundle\Repository;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;

class CourseworkTeacherRepository extends EntityRepository {
    const TABLE_ALIAS = 'coursework_teacher';

    private function check($q, QueryBuilder $qb) {
        if(isset($q['id_coursework']) && $q['id_coursework']) {
            $qb->leftJoin(self::TABLE_ALIAS.'.coursework','c')
                ->andWhere('c.id = '.self::TABLE_ALIAS.'.coursework')
                ->andWhere('c.id = '.$q['id_coursework']);
        }

        if(isset($q['id_user']) && $q['id_user']) {
            $qb->leftJoin(self::TABLE_ALIAS.'.user','u')
                ->andWhere('u.id = '.self::TABLE_ALIAS.'.user')
                ->andWhere('u.id = '.$q['id_user']);
        }

        if(isset($q['status']) && is_array($q['status'])) {
            $qb->andWhere($qb->expr()->in(self::TABLE_ALIAS.'.status', $q['status']));
        }
    }

    public function findObjects($q){
        $qb = $this->createQueryBuilder(self::TABLE_ALIAS)
            ->select(self::TABLE_ALIAS);
        $this->check($q,$qb);
        return $qb->getQuery()->getResult();
    }
}