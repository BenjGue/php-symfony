<?php

namespace CarnetAdresseBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Carnet
 *
 * @ORM\Table(name="carnet")
 * @ORM\Entity(repositoryClass="CarnetAdresseBundle\Repository\CarnetRepository")
 */
class Carnet
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @Assert\NotBlank
     * @ORM\Column(name="nom", type="string")
     */
    private $nom;

    /**
     * @var ArrayCollection
     * @ORM\OneToMany(targetEntity="Contact", mappedBy="carnet")
     */
    private $personnes;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return ArrayCollection
     */
    public function getPersonnes()
    {
        return $this->personnes;
    }

    /**
     * @return string
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * @param string $nom
     */
    public function setNom($nom)
    {
        $this->nom = $nom;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }


    public function __toString()
    {
        return "[id=" . $this->getId()."][nom=". $this->getNom()."][]";
    }

}

