<?php
namespace Lgck\CoreBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Lgck\CoreBundle\Model\AbstractEntity;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\Accessor;

/**
 * Discipline
 *
 * @ORM\Table(name="disciplines", indexes={
 * @ORM\Index(name="fk_discipline_subdivision_idx", columns={"id_subdivision"})})
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 */
class Discipline extends AbstractEntity {

    /**
     * @var string
     * @ORM\Column(name="name", type="text", nullable=true)
     */
    private $name;

    /**
     * @var integer
     * @ORM\Column(name="course", type="integer", nullable=false)
     * @Assert\NotNull()
     */
    private $course;

    /**
     * @var \Subdivision
     * @Exclude
     * @ORM\ManyToOne(targetEntity="\Lgck\CoreBundle\Entity\Subdivision")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_subdivision", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $subdivision;

    /**
     * Set subdivision
     * @param \Lgck\CoreBundle\Entity\Subdivision $subdivision
     * @return \Lgck\CoreBundle\Entity\Subdivision
     */
    public function setSubdivision(\Lgck\CoreBundle\Entity\Subdivision $subdivision = null) {
        $this->subdivision = $subdivision;
        return $this;
    }

    /**
     * Get subdivision
     * @return \Lgck\CoreBundle\Entity\Subdivision
     */
    public function getSubdivision() {
        return $this->subdivision;
    }


    /**
     * Set name
     * @param string $name
     * @return Discipline
     */
    public function setName($name) {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     * @return string
     */
    public function getName() {
        return $this->name;
    }

    /**
     * Set course
     * @param integer $course
     * @return Discipline
     */
    public function setCourse($course) {
        $this->course = $course;
        return $this;
    }

    /**
     * Get course
     * @return integer
     */
    public function getCourse() {
        return $this->course;
    }

    public function __construct() {
        $this->status = StatusObject::STATUS_OBJECT_ACTIVE;
        $this->dateCreate = time();
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function updatedTimestamps() {
        $this->dateUpdate = time();
    }

}
