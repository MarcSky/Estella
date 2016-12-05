<?php
namespace Lgck\CoreBundle\Repository;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;

class SubdivisionRepository extends EntityRepository{
    
    const TABLE_ALIAS = 'subdivisions';
    
    private function check($q, QueryBuilder $qb) {
        if(isset($q['name']) && $q['name']) {
            $qb->andWhere($qb->expr()->like(self::TABLE_ALIAS . '.name', ':name'));
            $qb->setParameter('name', '%'.$q['name'].'%');
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

        return $qb->getQuery()->getResult();
    }

}