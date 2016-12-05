<?php
namespace Lgck\CoreBundle\Repository;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;

class NoteRepository extends EntityRepository {

    const TABLE_ALIAS = 'notes';

    private function check($q, QueryBuilder $qb) {
        if(isset($q['id_theme']) && ctype_digit($q['id_theme'])) {
            $qb->leftJoin(self::TABLE_ALIAS.'.theme1','t')
                ->andWhere('t.id = '.self::TABLE_ALIAS.'.theme1')
                ->andWhere('t.id = '.$q['id_theme']);
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