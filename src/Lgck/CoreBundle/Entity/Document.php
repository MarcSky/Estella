<?php
namespace Lgck\CoreBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Lgck\CoreBundle\Model\AbstractEntity;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\Accessor;

/**
 * Document
 *
 * @ORM\Table(name="documents", indexes={
 * @ORM\Index(name="fk_service_creator_idx", columns={"id_creator"})})
 * @ORM\Entity(repositoryClass="Lgck\CoreBundle\Repository\DocumentRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Document extends AbstractEntity{

    const FOLDER_UPLOAD   = 'uploads';

    /**
     * @var string
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     * @Assert\NotNull()
     */
    private $name;

    /**
     * @var string
     * @ORM\Column(name="path", type="string", length=255, nullable=false)
     * @Assert\NotNull()
     */
    private $path;

    /**
     * @var \User
     * @Exclude
     * @ORM\ManyToOne(targetEntity="\Fewnix\UserBundle\Entity\User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_creator", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $creator;

    /**
     * @var integer
     * @Exclude
     * @ORM\Column(name="type", type="integer", nullable=true)
     */
    protected $type;
    
    /**
     * Set path
     * @param string $path
     * @return Document
     */
    public function setPath($path){
        $this->path = $path;
        return $this;
    }

    /**
     * Get path
     * @return string
     */
    public function getPath(){
        return $this->path;
    }

    /**
     * Set name
     * @param string $name
     * @return Document
     */
    public function setName($name){
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     * @return string
     */
    public function getName(){
        return $this->name;
    }

    /**
     * Set creator
     * @param \Fewnix\UserBundle\Entity\User $creator
     * @return User
     */
    public function setCreator(\Fewnix\UserBundle\Entity\User $creator = null) {
        $this->creator = $creator;
        return $this;
    }

    /**
     * Get creator
     * @return \Fewnix\UserBundle\Entity\User
     */
    public function getCreator() {
        return $this->creator;
    }

    public function __construct(){
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

    /**
     * Set type
     * @param integer $type
     * @return Document
     */
    public function setType($type) {
        $this->type = $type;
        return $this;
    }

    /**
     * Get type
     * @return integer
     */
    public function getType() {
        return $this->type;
    }

    public function getAbsolutePath()
    {
        return $this->path === null
            ? null
            : $this->getUploadRootDir();
    }

    public function getWebPath()
    {
        return $this->path === null
            ? null
            : $this->getUploadDir() . '/documents/materials/'. $this->path;
    }

    protected function getUploadRootDir()
    {
        return __DIR__ . '/../../../../web/' . $this->getUploadDir();
    }

    public function getUploadDir()
    {
        return self::FOLDER_UPLOAD;
    }
}
