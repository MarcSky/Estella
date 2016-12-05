<?php
namespace Lgck\CoreBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Lgck\CoreBundle\Model\AbstractEntity;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\Accessor;
use JMS\Serializer\Annotation\Groups;

/**
 * Note
 *
 * @ORM\Table(name="notes", indexes={
 * @ORM\Index(name="fk_note_theme_idx", columns={"id_theme"}),
 * @ORM\Index(name="fk_note_creator_idx", columns={"id_creator"})})
 * @ORM\Entity(repositoryClass="Lgck\CoreBundle\Repository\NoteRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Note extends AbstractEntity{

    /**
     * @var string
     * @Groups({"notes_list"})
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     * @var \Theme
     * @Exclude
     * @ORM\ManyToOne(targetEntity="Theme")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_theme", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $theme1;

    /**
     * @var \User
     * @Exclude
     * @ORM\ManyToOne(targetEntity="\Fewnix\UserBundle\Entity\User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_creator", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $user1;
    
    /**
     * @var \Array
     * @Groups({"notes_list"})
     * @Accessor(getter="getNoteTheme")
     */
    private $theme;
    
    /**
     * @var \Array
     * @Groups({"notes_list"})
     * @Accessor(getter="getNoteCreator")
     */
    private $teacher;

    public function getNoteTheme() {
        if(!$this->theme1)
            return null;
        return [
            'name' => $this->theme1->getName(),
            'id' => $this->theme1->getId()
        ];
    }

    public function getNoteCreator() {
        if(!$this->user1)
            return null;
        return [
            'fname' => $this->user1->getFname(),
            'sname' => $this->user1->getSname(),
            'pname' => $this->user1->getPname(),
            'id' => $this->user1->getId()
        ];
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
        $this->setDateUpdate(time());
    }


    /**
     * Set description
     * @param string $description
     * @return Note
     */
    public function setDescription($description) {
        $this->description = $description;
        return $this;
    }

    /**
     * Get description
     * @return string
     */
    public function getDescription() {
        return $this->description;
    }

    /**
     * Set theme
     * @param \Lgck\CoreBundle\Entity\Theme $theme
     * @return Note
     */
    public function setTheme(\Lgck\CoreBundle\Entity\Theme $theme = null) {
        $this->theme1 = $theme;
        return $this;
    }

    /**
     * Get theme
     * @return \Lgck\CoreBundle\Entity\Theme
     */
    public function getTheme() {
        return $this->theme1;
    }

    /**
     * Set creator
     * @param \Fewnix\UserBundle\Entity\User $creator
     * @return Note
     */
    public function setUser(\Fewnix\UserBundle\Entity\User $creator = null) {
        $this->user1 = $creator;
        return $this;
    }

    /**
     * Get creator
     * @return \Fewnix\UserBundle\Entity\User
     */
    public function getUser() {
        return $this->user1;
    }
}
