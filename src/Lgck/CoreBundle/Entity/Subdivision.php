<?php
namespace Lgck\CoreBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Lgck\CoreBundle\Model\AbstractEntity;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use JMS\Serializer\Annotation\Accessor;
use JMS\Serializer\Annotation\Exclude;

/**
 * Subdivision
 *
 * @ORM\Table(name="subdivisions", indexes={@ORM\Index(name="subdivisions_idx", columns={"id_parent"})})
 * @ORM\Entity(repositoryClass="Lgck\CoreBundle\Repository\SubdivisionRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Subdivision extends AbstractEntity{
    
    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=150, nullable=true)
     */
    private $name;

    /**
     * @var \Subdivision
     * @Exclude
     * @ORM\ManyToOne(targetEntity="Subdivision")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_parent", referencedColumnName="id", nullable = true, onDelete="set null")
     * })
     */
    private $parent;

    /**
     * @var integer
     * @Accessor(getter="getIdParent")
     */
    private $idParent;

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
     * Set name
     *
     * @param string $name
     * @return Subdivision
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set parent
     *
     * @param \Lgck\CoreBundle\Entity\Subdivision $parent
     * @return Subdivision
     */
    public function setParent(\Lgck\CoreBundle\Entity\Subdivision $parent = null)
    {
        $this->parent = $parent;
        return $this;
    }

    /**
     * Get parent
     *
     * @return \Lgck\CoreBundle\Entity\Subdivision
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Get idParent
     *
     * @return integer
     */
    public function getIdParent() {
        return ($this->parent) ? $this->parent->getId() : null;
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