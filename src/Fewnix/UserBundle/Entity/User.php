<?php
namespace Fewnix\UserBundle\Entity;
use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use JMS\Serializer\Annotation\Accessor;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\Exclude;

/**
 * @ORM\Table(name="users", indexes={
 * @ORM\Index(name="fk_users_subdivision_idx", columns={"id_subdivision"}),
 * @ORM\Index(name="fk_users_group_idx", columns={"id_group"})})
 * @ORM\AttributeOverrides({
 *      @ORM\AttributeOverride(name="email", column=
 *          @ORM\Column(type="string", name="email", length=255, unique=false, nullable=true)
 *      ),
 *      @ORM\AttributeOverride(name="emailCanonical", column=
 *          @ORM\Column(type="string", name="email_canonical", length=255, unique=false, nullable=true)
 *      ),
 *      @ORM\AttributeOverride(name="username", column=
 *          @ORM\Column(type="string", name="username", length=255, nullable=true, unique=true)
 *      ),
 *      @ORM\AttributeOverride(name="usernameCanonical", column=
 *          @ORM\Column(type="string", name="username_canonical", length=255, nullable=true, unique=true)
 *      )
 * })
 * @ORM\Entity(repositoryClass="Fewnix\UserBundle\Repository\UserRepository")
 * @UniqueEntity("email")
 */
class User extends BaseUser {

    const FOLDER_UPLOAD   = 'uploads';

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @Groups({"users_list", "user_detail"})
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;

    /**
     *
     * @Groups({"users_list", "user_detail"})
     * @Assert\NotBlank()
    */
    protected $email;

    /**
     * @Assert\NotBlank()
     * @Exclude
     */
    protected $password;

    /**
     * @Assert\NotBlank()
     * @Exclude
     */
    protected $salt;

    /**
     * @var boolean
     * @ORM\Column(name="status", type="integer", nullable=true)
     */
    private $status;

    /**
     * @var integer
     * @Exclude
     * @ORM\Column(name="date_create", type="integer", nullable=true)
     */
    private $dateCreate;

    /**
     * @var integer
     * @Exclude
     * @ORM\Column(name="date_lastlogin", type="integer", nullable=true)
     */
    private $dateLastlogin;

    /**
     * @var string
     * @Groups({"users_list", "user_detail"})
     * @ORM\Column(name="fname", type="string", length=45, nullable=true)
     */
    private $fname;

    /**
     * @var string
     * @Groups({"users_list", "user_detail"})
     * @ORM\Column(name="sname", type="string", length=45, nullable=true)
     */
    private $sname;

    /**
     * @var string
     * @Groups({"users_list", "user_detail"})
     * @ORM\Column(name="pname", type="string", length=45, nullable=true)
     */
    private $pname;

    /**
     * @var integer
     * @Groups({"users_list", "user_detail"})
     * @ORM\Column(name="course", type="integer", nullable=true)
     */
    private $course;

    /**
     * @var string
     * @Exclude
     * @ORM\Column(name="avatar", type="string", length=255, nullable=true)
     */
    private $avatar_path;

    /**
     * @var \Subdivision
     * @Exclude
     * @ORM\ManyToOne(targetEntity="\Lgck\CoreBundle\Entity\Subdivision")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_subdivision", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $subdivision1;

    /**
     * @var \Group
     * @Exclude
     * @ORM\ManyToOne(targetEntity="\Lgck\CoreBundle\Entity\Group")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_group", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $group1;

    /**
     * @var \Theme
     * @Exclude
     * @ORM\OneToMany(targetEntity="\Lgck\CoreBundle\Entity\Theme", mappedBy="user")
     * @ORM\JoinTable(name="themes",
     *  joinColumns={@ORM\JoinColumn(name="id_student", referencedColumnName="id")},
     *  inverseJoinColumns={@ORM\JoinColumn(name="id", referencedColumnName="id")}
     * )
     */
    private $studentThemes;

    /**
     * @Groups({"users_list", "user_detail"})
     * @Accessor(getter="getUserAvatar")
     */
    private $avatar;

    /**
     * @Groups({"users_list", "user_detail"})
     * @Accessor(getter="getUserGroup")
     */
    private $group;

    /**
     * @Groups({"users_list", "user_detail"})
     * @Accessor(getter="getUserSubdivision")
     */
    private $subdivision;

    /**
     * @Groups({"users_list_with_themes", "user_detail"})
     * @Accessor(getter="getStudentThemes")
     */
    private $themes;

    public function getStudentThemes() {
        if(!$this->studentThemes)
            return null;
        $count = sizeof($this->studentThemes);
        $documents = [];
        for($i = 0; $i < $count; $i++) {
            if($this->studentThemes[$i]->getStatus() === StatusObject::STATUS_OBJECT_ACTIVE) {
                $documents[] = [
                    'name' => $this->studentThemes[$i]->getName(),
                    'student' => $this->studentThemes[$i]->getThemeStudent()
                ];
            }
        }
        return $documents;
    }

    public function getUserAvatar() {
        if(!$this->avatar_path)
            return null;
        return $this->getUploadDir() . '/avatar/' . $this->avatar_path;
    }

    public function getUserSubdivision() {
        if(!$this->subdivision1)
            return null;
        return ['id' => $this->subdivision1->getId(), 'name' => $this->subdivision1->getName()];
    }

    public function getUserGroup() {
        if(!$this->group1 || in_array('ROLE_TEACHER', $this->getRoles()) || in_array('ROLE_ADMIN', $this->getRoles()))
            return null;
        return ['id' => $this->group1->getId(), 'name' => $this->group1->getName()];
    }

    /**
     * Get id
     * @return integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Set avatar
     * @param string $avatar
     * @return string
     */
    public function setAvatar($avatar){
        $this->avatar_path = $avatar;
        return $this;
    }

    /**
     * Get avatar
     * @return string
     */
    public function getAvatar(){
        return $this->avatar_path;
    }

    /**
     * Set course
     * @param string $course
     * @return string
     */
    public function setCourse($course){
        $this->course = $course;
        return $this;
    }

    /**
     * Get course
     * @return string
     */
    public function getCourse(){
        return $this->course;
    }

    /**
     * Set fname
     * @param string $fname
     * @return User
     */
    public function setFname($fname) {
        $this->fname = $fname;
        return $this;
    }

    /**
     * Get fname
     * @return string
     */
    public function getFname() {
        return $this->fname;
    }

    /**
     * Set sname
     * @param string $sname
     * @return User
     */
    public function setSname($sname) {
        $this->sname = $sname;
        return $this;
    }

    /**
     * Get sname
     * @return string
     */
    public function getSname() {
        return $this->sname;
    }

    /**
     * Set pname
     * @param string $pname
     * @return User
     */
    public function setPname($pname) {
        $this->pname = $pname;
        return $this;
    }

    /**
     * Get sname
     * @return string
     */
    public function getPname() {
        return $this->pname;
    }

    /**
     * Get email
     * @return string
     */
    public function getEmail() {
        return $this->email;
    }

    /**
     * Set email
     * @param string $email
     * @return User
     */
    public function setEmail($email) {
        $this->email = $email;
        return $this;
    }

    /**
     * Set password
     * @param string $password
     * @return User
     */
    public function setPassword($password) {
        $this->password = $password;
        return $this;
    }

    /**
     * Get password
     * @return string
     */
    public function getPassword() {
        return $this->password;
    }

    /**
     * Set salt
     * @param string $salt
     * @return User
     */
    public function setSalt($salt) {
        $this->salt = $salt;
        return $this;
    }

    /**
     * Get salt
     * @return string
     */
    public function getSalt() {
        return $this->salt;
    }

    /**
     * Set status
     * @param integer $status
     * @return User
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
     * @param \DateTime $dateCreate
     * @return User
     */
    public function setDateCreate($dateCreate) {
        $this->dateCreate = $dateCreate;
        return $this;
    }

    /**
     * Get dateCreate
     * @return \DateTime
     */
    public function getDateCreate() {
        return $this->dateCreate;
    }

    /**
     * Set dateLastlogin
     * @param \DateTime $dateLastlogin
     * @return User
     */
    public function setDateLastlogin($dateLastlogin) {
        $this->dateLastlogin = $dateLastlogin;
        return $this;
    }

    /**
     * Get dateLastlogin
     * @return \DateTime
     */
    public function getDateLastlogin() {
        return $this->dateLastlogin;
    }

    public function __construct(){
        parent::__construct();
        $this->dateCreate = time();
        $this->dateLastlogin = time();
        $this->token = $this->generateRandom();
        $this->enabled = true;
    }

    public function generateRandom(){
        return md5(uniqid(null, true).time());
    }

    public function generatePassword($length = 7) {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $password = substr( str_shuffle( $chars ), 0, $length);
        return $password;
    }

    /**
     * Returns the username used to authenticate the user.
     * @return string The username
     */
    public function getUsername() {
        return $this->email;
    }

    /**
     * Set subdivision
     * @param \Lgck\CoreBundle\Entity\Subdivision $subdivision
     * @return \Lgck\CoreBundle\Entity\Subdivision
     */
    public function setSubdivision(\Lgck\CoreBundle\Entity\Subdivision $subdivision = null) {
        $this->subdivision1 = $subdivision;
        return $this;
    }

    /**
     * Get subdivision
     * @return \Lgck\CoreBundle\Entity\Subdivision
     */
    public function getSubdivision() {
        return $this->subdivision1;
    }

    /**
     * Set group
     * @param \Lgck\CoreBundle\Entity\Group $group
     * @return \Lgck\CoreBundle\Entity\Group
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

    public function getAbsolutePath()
    {
        return $this->avatar === null
            ? null
            : $this->getUploadRootDir();
    }

    public function getWebPath()
    {
        return $this->avatar === null
            ? null
            : $this->getUploadDir() . '/avatar/'. $this->avatar;
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
