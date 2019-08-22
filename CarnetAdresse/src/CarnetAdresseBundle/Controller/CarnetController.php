<?php

namespace CarnetAdresseBundle\Controller;

use CarnetAdresseBundle\Entity\Carnet;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;


class CarnetController extends Controller
{


    /**
     * @Route("carnets/{carnetId}", name="getCarnet", methods={"GET"})
     */
    public function getAllContactsByCarnet ($carnetId)
    {
        //get manager
        $em = $this->getDoctrine()->getManager();

        //retireve data
        $carnet = $em->getRepository(Carnet::class)->find($carnetId);

        //serialize
        $data = $this->get('jms_serializer')->serialize($carnet, 'json');

        //set the response
        $response = JsonResponse::fromJsonString($data);

        return $response;
    }


    /**
     * @Route("carnets", name="getCarnets", methods={"GET"})
     */
    public function getAllCarnets ()
    {
        //get manager
        $em = $this->getDoctrine()->getManager();

        //Recupere seulement les data nécessaires à l'affichage page d'accueil pour éviter réponse trop lourde si il y a bcp de personnes dans le carnet
        $fields = array('c.id', 'c.nom');
        $query = $this->getDoctrine()->getManager()->createQueryBuilder();
        $query
            ->select($fields)
            ->from('CarnetAdresseBundle:Carnet', "c");

        $carnet = $query->getQuery()->getResult();

        //serialize
        $data = $this->get('jms_serializer')->serialize($carnet, 'json');

        //set the response
        $response = JsonResponse::fromJsonString($data);

        return $response;
    }

}
