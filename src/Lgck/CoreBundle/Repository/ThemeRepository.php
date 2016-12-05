<?php
namespace Lgck\CoreBundle\Repository;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;

class ThemeRepository extends EntityRepository {
    
    const TABLE_ALIAS = 'themes';

    private function check($q, QueryBuilder $qb) {
        if(isset($q['name']) && $q['name']) {
            $qb->andWhere($qb->expr()->like(self::TABLE_ALIAS . '.name', ':name'));
            $qb->setParameter('name', '%'.$q['name'].'%');
        }

        if(isset($q['id_coursework']) && $q['id_coursework']) {
            $qb->leftJoin(self::TABLE_ALIAS.'.coursework1','d')
                ->andWhere('d.id = '.self::TABLE_ALIAS.'.coursework1')
                ->andWhere('d.id = '.$q['id_coursework']);
        }

        if(isset($q['id_student']) && $q['id_student']) {
            $qb->leftJoin(self::TABLE_ALIAS.'.user','s')
                ->andWhere('s.id = '.self::TABLE_ALIAS.'.user')
                ->andWhere('s.id = '.$q['id_student']);
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