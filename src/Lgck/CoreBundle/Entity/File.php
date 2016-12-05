<?php
namespace Lgck\CoreBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Lgck\CoreBundle\Model\AbstractEntity;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\Accessor;

/**
 * File
 *
 * @ORM\Table(name="files")
 * @ORM\Entity(repositoryClass="Lgck\CoreBundle\Repository\FileRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class File extends AbstractEntity { //файл с курсовой работой может быть один

    /**
     * @var string
     * @ORM\Column(name="path", type="string", length=255, nullable=false)
     * @Assert\NotNull()
     */
    private $path;

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
    
}