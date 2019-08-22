/**
 * Récupère tous les contacts pour un carnet d'adresse sépcifique.
 * @param {*} id du carnet
 */
function getContacts(id) {
  if (id == null) {
    return;
  }
  let carnetId = -1;
  $.ajax({
    type: "GET",
    dataType: "json",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    url: "http://localhost:8000/carnets/" + id,
    statusCode: {
      404: function() {
        html = notFoundMessage();
      }
    }
  }).done(function(data) {
    if (data == null) {
      return null;
    }

    carnetId = data.id;
    //modify the dom to get
    let html =
      "<div class='col-sm-8 display-4 mb-5 text-center'>Carnet " +
      data.nom +
      "</div><div class='col-sm-4 text-center mt-4 mb-4 float-right'><button class='btn btn-outline-primary' onclick='editContactTemplate(" +
      carnetId +
      ")'>Ajouter un contact</button></div>";

    data.personnes.forEach(element => {
      html += "<div class='col-sm-3 mb-5'>";
      html += "<ul class='list-group'>";
      html +=
        "<li class='list-group-item list-group-item-primary text-center'> <i class='fas fa-user float-left'></i>" +
        "<span class='mr-2 text-uppercase'><i class='fas fa-edit float-right edit' onclick='editContactTemplate(" +
        carnetId +
        "," +
        element.id +
        ',"' +
        element.nom +
        '","' +
        element.prenom +
        '","' +
        element.telephone +
        '","' +
        element.email +
        '","' +
        element.profession +
        '",' +
        element.retraite +
        ',"' +
        element.commentaire +
        "\")'></i>" +
        element.nom +
        "</span><span>" +
        element.prenom +
        "</span></li>";
      html +=
        "<li class='list-group-item list-group-item-dark'><i class='fas fa-phone-square mr-2'></i>" +
        element.telephone +
        "</li>";
      html +=
        "<li class='list-group-item list-group-item-dark'><i class='fas fa-at mr-2'></i> " +
        element.email +
        "</li>";
      html +=
        "<li class='list-group-item list-group-item-dark'><i class='fas fa-briefcase mr-2'></i>" +
        evalProfession(element.retraite, element.profession) +
        "</li>";
      html +=
        "<li class='list-group-item list-group-item-dark'><i class='far fa-comment mr-2'></i>" +
        element.commentaire +
        "</li>";
      html +=
        "<li class='list-group-item list-group-item-dark'>Ajouté le  : " +
        formatDate(element.date_creation) +
        "</li>";
      html += "</ul>";
      html += "</div>";
    });

    //add button
    html += "";
    $("#main-content").html(html);
  });
}

function loadCarnets() {
  let html =
    "<div class='h5 col-sm-12 mb-5 text-center'>Liste des carnets de contact</div>";
  $.ajax({
    type: "GET",
    dataType: "json",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    url: "http://localhost:8000/carnets",
    statusCode: {
      404: function() {
        html = notFoundMessage();
      }
    }
  }).done(function(data) {
    if (data == null) {
      return null;
    }
    if (data == null) {
      html = "Aucun carnet à afficher";
    }
    data.forEach(element => {
      html +=
        "<div class='col-sm-4 border border-info rounded carnet-box mr-3 ml-3 mb-3 d-flex flex-column align-items-star'>";
      html +=
        "<div class='text-center mb-auto p-2 nom-carnet'>" +
        element.nom +
        "</div>";
      html +=
        "<div class='p-2'><button class='btn btn-outline-dark' onclick='getContacts(" +
        element.id +
        ")'>";
      html += "voir les contacts</button></div></div>";
    });

    $("#main-content").html(html);
  });
}

function notFoundMessage() {
  return "page non trouvée, problème de connexion au serveur";
}

function formatDate(date) {
  const formattedDate = new Date(date);
  const d = formattedDate.getDate();
  let m = formattedDate.getMonth();
  m += 1; // JavaScript months are 0-11
  var y = formattedDate.getFullYear();

  return d + "/" + m + "/" + y;
}

function evalProfession(retraite, profession) {
  return retraite ? "retraité" : profession;
}

function errorCreationMessage() {
  return "Erreur lors de la création ou modification des données.";
}
