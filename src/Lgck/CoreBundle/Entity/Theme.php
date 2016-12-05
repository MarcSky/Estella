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
 * Theme
 *
 * @ORM\Table(name="themes", indexes={
 * @ORM\Index(name="fk_theme_course_idx", columns={"id_coursework"}),
 * @ORM\Index(name="fk_theme_document_idx", columns={"id_file"})})
 * @ORM\Entity(repositoryClass="Lgck\CoreBundle\Repository\ThemeRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Theme extends AbstractEntity {

    /**
     * @var string
     * @ORM\Column(name="name", type="text", nullable=true)
     */
    private $name;

    /**
     * @var string
     * @ORM\Column(name="text_theme", type="text", nullable=true)
     */
    private $text;

    /**
     * @var \Coursework
     * @Exclude
     * @ORM\ManyToOne(targetEntity="Coursework")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_coursework", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $coursework1;

    /**
     * @var \User
     * @Exclude
     * @ORM\ManyToOne(targetEntity="\Fewnix\UserBundle\Entity\User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_student", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $user;//student
    
    /**
     * @var \Document
     * @Exclude
     * @ORM\OneToMany(targetEntity="ThemeDocument", mappedBy="theme")
     * @ORM\JoinTable(name="theme_documents",
     *  joinColumns={@ORM\JoinColumn(name="id_theme", referencedColumnName="id")},
     *  inverseJoinColumns={@ORM\JoinColumn(name="id", referencedColumnName="id")}
     * )
     */
    private $themeDocuments;

    /**
     * @var \Note
     * @Exclude
     * @ORM\OneToMany(targetEntity="Note", mappedBy="theme1")
     * @ORM\JoinTable(name="notes",
     *  joinColumns={@ORM\JoinColumn(name="id_theme", referencedColumnName="id")},
     *  inverseJoinColumns={@ORM\JoinColumn(name="id", referencedColumnName="id")}
     * )
     */
    private $themeNotes;

    /**
     * @var \File
     * @Exclude
     * @ORM\ManyToOne(targetEntity="File")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_file", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $file;

    /**
     * @var \Array
     * @Accessor(getter="getThemeStudent")
     */
    private $student;
    /**
     * @var \Array
     * @Accessor(getter="getThemeCoursework")
     */
    private $coursework;

    /**
     * @var \Array
     * @Accessor(getter="getThemeDocument")
     */
    private $documents;

    /**
     * @var \Array
     * @Accessor(getter="getNotesCount")
     */
    private $ncount;

    /**
     * @Exclude
     */
    public $host;
    
    public function getThemeDocument() {
        if(!$this->themeDocuments)
            return null;
        $count = sizeof($this->themeDocuments);
        $documents = [];
        for($i = 0; $i < $count; $i++) {
            if($this->themeDocuments[$i]->getStatus() === StatusObject::STATUS_OBJECT_ACTIVE) {
                $document = $this->themeDocuments[$i]->getDocument();
                $d = [
                        'id' => $document->getId(),
                        'path' => $this->host . $document->getWebPath(),
                        'name' => $document->getName(),
                        'type' => $document->getType()
                     ];
                if($creator = $document->getCreator()) {
                    $d['creator'] = [ 
                        'id' => $creator->getId(), 
                        'fname' => $creator->getFname(), 
                        'sname' => $creator->getSname(),
                        'pname' => $creator->getPname()
                    ];
                }
                $documents[] = $d;
            }
        }
        return $documents;
    }

    public function getNotesCount() {
        if(!$this->themeNotes)
            return null;
        $count = sizeof($this->themeNotes);
        $с = 0;
        for($i = 0; $i < $count; $i++) {
            if($this->themeNotes[$i]->getStatus() === StatusObject::STATUS_OBJECT_ACTIVE) {
                $с++;
            }
        }
        return $с;
    }

    public function getThemeCoursework() {
        if(!$this->coursework1)
            return null;
        return [
            'name' => $this->coursework1->getName(),
            'id' => $this->coursework1->getId(),
            'teachers' => $this->coursework1->getCourseworkTeachers(),
            'group' => $this->coursework1->getCourseworkGroup(),
            'end' => $this->coursework1->getEnd()
        ];
    }

    public function getThemeStudent() {
        if(!$this->user)
            return null;
        return [
            'id' => $this->user->getId(),
            'fname' => $this->user->getFname(),
            'sname' => $this->user->getSname(),
            'pname' => $this->user->getPname()
        ];
    }

    /**
     * Set name
     * @param string $name
     * @return Theme
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
     * Set text
     * @param string $text
     * @return Theme
     */
    public function setText($text) {
        $this->text = $text;
        return $this;
    }

    /**
     * Get text
     * @return string
     */
    public function getText() {
        return $this->text;
    }

    /**
     * Set file
     * @param \Lgck\CoreBundle\Entity\File $file
     * @return File
     */
    public function setFile(\Lgck\CoreBundle\Entity\File $file = null) {
        $this->file = $file;
        return $this;
    }

    /**
     * Get file
     * @return \Lgck\CoreBundle\Entity\File
     */
    public function getFile() {
        return $this->file;
    }

    /**
     * Set coursework
     * @param \Lgck\CoreBundle\Entity\Coursework $coursework
     * @return Theme
     */
    public function setCoursework(\Lgck\CoreBundle\Entity\Coursework $coursework = null) {
        $this->coursework1 = $coursework;
        return $this;
    }

    /**
     * Get coursework
     * @return \Lgck\CoreBundle\Entity\Coursework
     */
    public function getCoursework() {
        return $this->coursework1;
    }

    /**
     * Set user
     * @param \Fewnix\UserBundle\Entity\User $user
     * @return User
     */
    public function setUser(\Fewnix\UserBundle\Entity\User $user = null) {
        $this->user = $user;
        return $this;
    }

    /**
     * Get user
     * @return \Fewnix\UserBundle\Entity\User
     */
    public function getUser() {
        return $this->user;
    }


    public function __construct() {
        $this->status = StatusObject::STATUS_OBJECT_ACTIVE;
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function updatedTimestamps() {
        $this->dateUpdate = time();
    }


}