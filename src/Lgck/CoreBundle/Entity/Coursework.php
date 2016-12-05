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
 * Coursework
 *
 * @ORM\Table(name="courseworks", indexes={
 * @ORM\Index(name="fk_coursework_creator_idx", columns={"id_creator"}),
 * @ORM\Index(name="fk_coursework_group_idx", columns={"id_group"})})
 * @ORM\Entity(repositoryClass="Lgck\CoreBundle\Repository\CourseworkRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Coursework extends AbstractEntity {

    /**
     * @var string
     * @Groups({"coursework_list", "coursework_detail"})
     * @ORM\Column(name="name", type="string", length=255, nullable=true)
     */
    private $name;

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
     * @var \User
     * @Exclude
     * @ORM\ManyToOne(targetEntity="Group")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_group", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $group1;
    
    /**
     * @var integer
     * @ORM\Column(name="date_end", type="integer", nullable=true)
     */
    protected $end;

    /**
     * @var \Theme
     * @Exclude
     * @ORM\OneToMany(targetEntity="Theme", mappedBy="coursework1")
     * @ORM\JoinTable(name="themes",
     *  joinColumns={@ORM\JoinColumn(name="id_coursework", referencedColumnName="id")},
     *  inverseJoinColumns={@ORM\JoinColumn(name="id", referencedColumnName="id")}
     * )
     */
    private $courseworkThemes;

    /**
     * @var \Theme
     * @Exclude
     * @ORM\OneToMany(targetEntity="CourseworkTeacher", mappedBy="coursework")
     * @ORM\JoinTable(name="coursework_teachers",
     *  joinColumns={@ORM\JoinColumn(name="id_coursework", referencedColumnName="id")},
     *  inverseJoinColumns={@ORM\JoinColumn(name="id", referencedColumnName="id")}
     * )
     */
    private $courseworkTeachers;

    /**
     * @var \Array
     * @Groups({"coursework_list", "coursework_detail"})
     * @Accessor(getter="getCourseworkThemes")
     */
    private $themes;

    /**
     * @var \Array
     * @Groups({"coursework_list", "coursework_detail"})
     * @Accessor(getter="getCourseworkCountThemes")
     */
    private $tcount; //количество тем в курсовой работе

    /**
     * @var \Array
     * @Groups({"coursework_list", "coursework_detail"})
     * @Accessor(getter="getCourseworkGroup")
     */
    private $group;

    /**
     * @var \Array
     * @Groups({"coursework_list", "coursework_detail"})
     * @Accessor(getter="getCourseworkTeachers")
     */
    private $teachers;

    public function getCourseworkThemes() {
        if(!$this->courseworkThemes)
            return null;

        $count = sizeof($this->courseworkThemes);
        for($i = 0; $i < $count; $i++) {
            if($this->courseworkThemes[$i]->getStatus() === StatusObject::STATUS_OBJECT_ACTIVE) {
                $theme = [
                    'id' => $this->courseworkThemes[$i]->getId(),
                    'name' => $this->courseworkThemes[$i]->getName(),
                ];
                if($student = $this->courseworkThemes[$i]->getUser()) {
                    $theme['student']['fname'] = $student->getFname();
                    $theme['student']['sname'] = $student->getSname();
                    $theme['student']['pname'] = $student->getPname();
                }
                $this->themes[] = $theme;
            }
        }
        return $this->themes;
    }

    public function getCourseworkCountThemes() {
        if(!$this->courseworkThemes)
            return null;

        $count = sizeof($this->courseworkThemes);
        $с = 0;
        for($i = 0; $i < $count; $i++) {
            if($this->courseworkThemes[$i]->getStatus() === StatusObject::STATUS_OBJECT_ACTIVE) {
                $с++;
            }
        }
        return $с;
    }


    public function getCourseworkTeachers() {
        if(!$this->courseworkTeachers)
            return null;

        $count = sizeof($this->courseworkTeachers);
        for($i = 0; $i < $count; $i++) {
            if($this->courseworkTeachers[$i]->getStatus() === StatusObject::STATUS_OBJECT_ACTIVE) {
                $this->teachers[] = [
                    'id' => $this->courseworkTeachers[$i]->getTeacher()->getId(),
                    'fname' => $this->courseworkTeachers[$i]->getTeacher()->getFname(),
                    'sname' => $this->courseworkTeachers[$i]->getTeacher()->getSname(),
                    'pname' => $this->courseworkTeachers[$i]->getTeacher()->getPname()
                ];
            }
        }
        return $this->teachers;
    }

    public function getCourseworkGroup() {
        if(!$this->group1)
            return null;

        return ['name' => $this->group1->getName(), 'id' => $this->group1->getId()];        
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

    /**
     * Set name
     * @param string $name
     * @return Coursework
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
     * Set creator
     * @param \Fewnix\UserBundle\Entity\User $creator
     * @return Coursework
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

    /**
     * Set end
     * @param integer $end
     * @return Coursework
     */
    public function setEnd($end) {
        $this->end = $end;
        return $this;
    }

    /**
     * Get end
     * @return integer
     */
    public function getEnd() {
        return $this->end;
    }

    /**
     * Set group
     * @param \Lgck\CoreBundle\Entity\Group $group
     * @return Group
     */
    public function setGroup(\Lgck\CoreBundle\Entity\Group $group = null) {
        $this->group1 = $group;
        return $this;
    }

    /**
     * Get group
     * @return \Lgck\CoreBundle\Entity\Group
     */
    public function getGroup() {
        return $this->group1;
    }
}
