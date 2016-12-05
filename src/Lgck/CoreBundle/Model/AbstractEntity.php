<?php
namespace Lgck\CoreBundle\Model;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\Accessor;
use JMS\Serializer\Annotation\Groups;

class AbstractEntity {

    /**
     * @var integer
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @Groups({"notes_list"})
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;

    /**
     * @var integer
     * @Groups({"notes_list"})
     * @ORM\Column(name="date_create", type="integer", nullable=true)
     */
    protected $dateCreate;

    /**
     * @var integer
     * @Exclude
     * @ORM\Column(name="date_update", type="integer", nullable=true)
     */
    protected $dateUpdate;

    /**
     * @var integer
     * @Exclude
     * @ORM\Column(name="status", type="integer", nullable=true)
     */
    protected $status;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set status
     * @param integer $status
     * @return AbstractEntity
     */
    public function setStatus($status) {
        $this->status = $status;
        return $this;
    }

    /**
     * Get status
     * @return integer
     */
    public function getStatus() {
        return $this->status;
    }

    /**
     * Set dateCreate
     *
     * @param integer $dateCreate
     *
     * @return AbstractEntity
     */
    public function setDateCreate($dateCreate) {
        $this->dateCreate = $dateCreate;
        return $this;
    }

    /**
     * Get dateCreate
     *
     * @return integer
     */
    public function getDateCreate() {
        return $this->dateCreate;
    }

    /**
     * Set dateUpdate
     *
     * @param integer $dateUpdate
     *
     * @return AbstractEntity
     */
    public function setDateUpdate($dateUpdate) {
        $this->dateUpdate = $dateUpdate;
        return $this;
    }

    /**
     * Get dateUpdate
     *
     * @return integer
     */
    public function getDateUpdate() {
        return $this->dateUpdate;
    }

}