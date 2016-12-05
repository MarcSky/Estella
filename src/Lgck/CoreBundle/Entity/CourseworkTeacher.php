<?php
namespace Lgck\CoreBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Lgck\CoreBundle\Model\AbstractEntity;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\Accessor;

/**
 * CourseworkTeacher
 *
 * @ORM\Table(name="coursework_teachers", indexes={
 * @ORM\Index(name="fk_users_theme_creator_idx", columns={"id_teacher"}),
 * @ORM\Index(name="fk_users_theme_theme_idx", columns={"id_coursework"})})
 * @ORM\Entity(repositoryClass="Lgck\CoreBundle\Repository\CourseworkTeacherRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class CourseworkTeacher extends AbstractEntity {

    /**
     * @var \User
     * @Exclude
     * @ORM\ManyToOne(targetEntity="\Fewnix\UserBundle\Entity\User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_teacher", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $teacher;

    /**
     * @var \Theme
     * @Exclude
     * @ORM\ManyToOne(targetEntity="Coursework")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_coursework", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $coursework;

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
     * Set teacher
     * @param \Fewnix\UserBundle\Entity\User $teacher
     * @return User
     */
    public function setTeacher(\Fewnix\UserBundle\Entity\User $teacher = null) {
        $this->teacher = $teacher;
        return $this;
    }

    /**
     * Get teacher
     * @return \Fewnix\UserBundle\Entity\User
     */
    public function getTeacher() {
        return $this->teacher;
    }

    /**
     * Set coursework
     * @param \Lgck\CoreBundle\Entity\Coursework $coursework
     * @return Coursework
     */
    public function setCoursework(\Lgck\CoreBundle\Entity\Coursework $coursework = null) {
        $this->coursework = $coursework;
        return $this;
    }

    /**
     * Get theme
     * @return \Lgck\CoreBundle\Entity\Coursework
     */
    public function getCoursework() {
        return $this->coursework;
    }
}
