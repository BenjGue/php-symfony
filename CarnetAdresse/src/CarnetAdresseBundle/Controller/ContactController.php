<?php

namespace CarnetAdresseBundle\Controller;

use CarnetAdresseBundle\Entity\Carnet;
use CarnetAdresseBundle\Entity\Contact;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;


class ContactController extends Controller
{

    /**
     * @Route("contacts/{contactId}", name="Recupere_un_Contact", methods={"GET"})
     */
    public function getContact ($contactId)
    {
        $em = $this->getDoctrine()->getManager();

        //get data from repo
        $contact = $em->getRepository(Contact::class)->find($contactId);

        //serialize
        $data = $this->get('jms_serializer')->serialize($contact, 'json');

        //set the response
        $response = JsonResponse::fromJsonString($data);

        return $response;
    }


    /**
     * @Route("contacts/{contactId}", name="update_un_Contact", methods={"PUT"})
     */
    public function updateContact ($contactId, Request $request, LoggerInterface $logger, ValidatorInterface $validator)
    {
        //get data in body
        $data = $request->getContent();
        $logger->info("update contact, data received : " . $data);


        $result = $this->saveContact($data, $validator, $logger, $contactId);

        if (!($result instanceof Contact)) {
            $response = new JsonResponse($result);
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            return $response;
        }

        return new Response('', Response::HTTP_OK);
    }



    /**
     * @Route("contacts", name="ajouteConatct", methods={"POST"})
     */
    public function addContact (Request $request, LoggerInterface $logger,  ValidatorInterface $validator) {
        //get data in body
        $data = $request->getContent();
        $logger->info("addContact data received : " . $data);

        $result = $this->saveContact($data, $validator, $logger, -1);
        if($result instanceof Contact) {
            $contact = $result;
        } else {
            $response = new JsonResponse($result);
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            return $response;
        }

        //prepare Ok response
        $response = new Response('', Response::HTTP_CREATED);
        $response->headers->set('Location', 'http://localhost:8000/contacts/' . $contact->getId());

        return $response;
    }

    /**
     * Methode permettant de faire update et persist d'un contact.
     * @param $data données à traiter.
     * @param ValidatorInterface $validator validators
     * @param LoggerInterface $logger logger.
     * @param $contactId id du contact pour l'update.
     * @return array|\JMS\Serializer\scalar|mixed|object|string
     * @throws \Exception
     */
    private function saveContact($data, ValidatorInterface $validator, LoggerInterface $logger, $contactId) {
        //deserialize data
        $contact = $this->get('jms_serializer')->deserialize($data, 'CarnetAdresseBundle\Entity\Contact', 'json');

        //verify values
        $errors = $validator->validate($contact);

        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $violation) {
                $messages[$violation->getPropertyPath()][] = $violation->getMessage();
            }
            return $messages;
        }

        //si update check id not null
        if ($contactId == null) {
            return "Erreur identifiant du contact manquant.";
        }


        //check retraite
        if($contact->getRetraite() == null) {
            $contact->setRetraite(false);
        }

        //si création set date
        if($contactId == -1) {
            $contact->setDateCreation(new \DateTime('now'));
        }


        //prepare for db persist
        $em = $this->getDoctrine()->getManager();

        if($contactId > 0) {
            //si update check entity exist on recup date création
            $persist = $em->getRepository(Contact::class)->find($contactId);
            if($persist == null) {
                $this->createNotFoundException("Le contact n'a pas été trouvé");
            }
            $persist->setNom($contact->getNom());
            $persist->setPrenom($contact->getPrenom());
            $persist->setTelephone($contact->getTelephone());
            $persist->setEmail($contact->getEmail());
            $persist->setProfession($contact->getProfession());
            $persist->setRetraite($contact->getRetraite());
            $persist->setCommentaire($contact->getCommentaire());

            $contact = $persist;
        }

        $carnet = $em->getRepository(Carnet::class)->find($contact->getCarnet()->getId());
        $contact->setCarnet($carnet);

        //update db
        $em->persist($contact);
        $em->flush();

        return $contact;
    }



}
