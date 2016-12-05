<?php
namespace Lgck\CoreBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Lgck\CoreBundle\Model\AbstractEntity;
use Lgck\ServiceBundle\Component\StatusObject;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\Accessor;

/**
 * ThemeDocument
 *
 * @ORM\Table(name="theme_documents", indexes={
 * @ORM\Index(name="fk_users_theme_creator_idx", columns={"id_document"}),
 * @ORM\Index(name="fk_users_theme_theme_idx", columns={"id_theme"})})
 * @ORM\Entity(repositoryClass="Lgck\CoreBundle\Repository\ThemeDocumentRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class ThemeDocument extends AbstractEntity{

    /**
     * @var \Document
     * @Exclude
     * @ORM\ManyToOne(targetEntity="Document")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_document", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $document;

    /**
     * @var \Theme
     * @Exclude
     * @ORM\ManyToOne(targetEntity="Theme")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_theme", referencedColumnName="id", onDelete="set null")
     * })
     */
    private $theme;

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
     * Set user
     * @param \Lgck\CoreBundle\Entity\Document $document
     * @return Document
     */
    public function setDocument(\Lgck\CoreBundle\Entity\Document $document = null) {
        $this->document = $document;
        return $this;
    }

    /**
     * Get user
     * @return \Lgck\CoreBundle\Entity\Document
     */
    public function getDocument() {
        return $this->document;
    }

    /**
     * Set theme
     * @param \Lgck\CoreBundle\Entity\Theme $theme
     * @return Theme
     */
    public function setTheme(\Lgck\CoreBundle\Entity\Theme $theme = null) {
        $this->theme = $theme;
        return $this;
    }

    /**
     * Get theme
     * @return \Lgck\CoreBundle\Entity\Theme
     */
    public function getTheme() {
        return $this->theme;
    }
    
}