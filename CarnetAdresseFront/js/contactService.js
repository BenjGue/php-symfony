function editContactTemplate(
  idCarnet,
  id,
  nom,
  prenom,
  telephone,
  email,
  profession,
  retraite,
  commentaire
) {
  let ajout = false;
  if (nom == null) {
    ajout = true;
  }

  let html =
    "<div class='col-sm-12 h5 text-center mb-5'>" +
    (ajout ? "Création" : "Modification") +
    " d'un contact</div>";

  html += "<form id='contact-form' class='col-sm-12'>";
  html +=
    "<div id='msg' class='alert' style='display:none' role='alert'></div>";
  html +=
    "<div class='form-group row'><label for='inputNom' class='col-sm-2 col-form-label'>Nom</label><div class='col-sm-10'><input " +
    (nom ? "value=" + nom : "") +
    " type='text' class='form-control' name='nom' id='inputNom' placeholder='Nom du contact'></div></div>";
  html +=
    "<div class='form-group row'><label for='inputPrenom' class='col-sm-2 col-form-label'>Preom</label><div class='col-sm-10'><input type='text' " +
    (prenom ? "value=" + prenom : "") +
    " class='form-control' name='prenom' id='inputPrenom' placeholder='Prénom du contact'></div></div>";
  html +=
    "<div class='form-group row'><label for='inputTel' class='col-sm-2 col-form-label'>Téléphone</label><div class='col-sm-10'><input type='tel' " +
    (telephone ? "value=" + telephone : "") +
    " class='form-control' id='inputTel'  name='telephone'placeholder='01758496xx'></div></div>";
  html +=
    "<div class='form-group row'><label for='inputEmail' class='col-sm-2 col-form-label'>Email</label><div class='col-sm-10'><input type='email' " +
    (email ? "value=" + email : "") +
    " class='form-control' name='email' id='inputEmail' placeholder='prenom.nom@orange.fr'></div></div>";
  html +=
    "<div class='form-group row'><label for='inputProfession' class='col-sm-2 col-form-label'>Profession</label><div class='col-sm-10'><input type='text' " +
    (profession ? "value=" + profession : "") +
    " class='form-control' name='profession' id='inputProfession' placeholder='boulanger'></div></div>";
  html +=
    "<div class='form-group row'><label for='inputRetraite' class='col-sm-2 form-check-label'>Retraite</label><div class='col-sm-10'><input type='checkbox'" +
    (retraite ? "checked" : "") +
    " class='form-check-input ml-2' name='retraite' id='inputRetraite'></div></div>";
  html +=
    "<div class='form-group row'><label for='inputCom' class='col-sm-2 col-form-label'>Commentaire</label><div class='col-sm-10'><input type='text' " +
    (commentaire ? "value=" + commentaire : "") +
    " class='form-control' name='commentaire' id='inputCom'></div></div>";

  html +=
    " <div class='form-group row'> <div class='col-sm-12 text-center mt-2 d-flex'><div class='offset-3 col-sm-3'><button type='button' class='btn btn-primary btn-lg' onclick='editContact(" +
    id +
    "," +
    idCarnet +
    ")'>" +
    (ajout ? "Créer" : "Modifier") +
    "</button></div><div class='col-sm-3'><button type='button' class='btn btn-secondary btn-lg' onclick='getContacts(" +
    idCarnet +
    ")'>Retour</button></div></div></div>";
  html += "</form>";
  $("#main-content").html(html);
}

function editContact(idContact, idCarnet) {
  let httpMethod = "POST";
  let url = "http://localhost:8000/contacts";

  if (idContact != null) {
    httpMethod = "PUT";
    url = "http://localhost:8000/contacts/" + idContact;
  }

  let formJson = $("#contact-form").serializeArray();
  let data = "{";
  formJson.forEach((element, index, arr) => {
    data += '"' + element.name + '":"' + element.value + '",';
  });
  data += '"carnet":{"id":' + idCarnet + "}";
  data += "}";

  $("#msg").hide();

  $.ajax({
    type: httpMethod,
    dataType: "json",
    data: data,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    contentType: "application/json;charset=UTF-8",
    url: url
  })
    .fail(function(data) {
      console.log(data);
      if (data == null) {
        return null;
      }
      if (data.status <= 300) {
        return;
      }
      //get the error message from the response
      let msg = "";
      $.each(data.responseJSON, function(key, item) {
        msg += item + "<br/>";
      });

      //put message and show
      $("#msg").html(msg);
      $("#msg").removeClass("alert-success");
      $("#msg").addClass("alert-danger");
      $("#msg").show();
    })
    .always(function(data) {
      switch (data.status) {
        case 200:
          handleOk("Le contact a été modifié");
          break;
        case 201:
          handleOk("Le contact a été ajouté");
          break;
      }
    });
}

function handleOk(msg) {
  //hide error msg and show msg success
  console.log("I go here! ");
  $("#msg").removeClass("alert-danger");
  $("#msg").addClass("alert-success");
  $("#msg").html(msg);
  $("#msg").show();
}
