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
 * Group
 * @ORM\Table(name="groups")
 * @ORM\Entity(repositoryClass="Lgck\CoreBundle\Repository\GroupRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Group extends AbstractEntity {

    /**
     * @var string
     * @Groups({"group_detail", "group_list"})
     * @ORM\Column(name="name", type="text", nullable=true)
     */
    private $name;

    /**
     * Set group
     * @param string $name
     * @return Group
     */
    public function setName($name) {
        $this->name = $name;
        return $this;
    }

    /**
     * @var \User
     * @Exclude
     * @ORM\OneToMany(targetEntity="\Fewnix\UserBundle\Entity\User", mappedBy="group1")
     * @ORM\JoinTable(name="users",
     *  joinColumns={@ORM\JoinColumn(name="id_group", referencedColumnName="id")},
     *  inverseJoinColumns={@ORM\JoinColumn(name="id", referencedColumnName="id")}
     * )
     */
    private $groupStudents;

    /**
     * @var \Array
     * @Groups({"group_detail"})
     * @Accessor(getter="getGroupStudents")
     */
    private $students;

    public function getGroupStudents() {
        if(!$this->groupStudents)
            return null;

        $count = sizeof($this->groupStudents);
        for($i = 0; $i < $count; $i++) {
            if(in_array('ROLE_STUDENT',$this->groupStudents[$i]->getRoles())) {
                $this->students[] = [
                    'id' => $this->groupStudents[$i]->getId(),
                    'fname' => $this->groupStudents[$i]->getFname(),
                    'sname' => $this->groupStudents[$i]->getSname(),
                    'pname' => $this->groupStudents[$i]->getPname(),
                    'email' => $this->groupStudents[$i]->getEmail(),
                    'course' => $this->groupStudents[$i]->getCourse(),
                    'subdivision' => $this->groupStudents[$i]->getUserSubdivision()
                ];
            }
        }
        return $this->students;
    }

    /**
     * Get group
     * @return string
     */
    public function getName() {
        return $this->name;
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