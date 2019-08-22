class Contact {
  contructor(
    id,
    nom,
    prenom,
    telephone,
    email,
    profession,
    retraite,
    commentaire,
    dateCreation,
    carnetId
  ) {
    this._id = id;
    this._nom = nom;
    this._prenom = prenom;
    this._telephone = telephone;
    this._email = email;
    this._profession = profession;
    this._retraite = retraite;
    this._commentaire = commentaire;
    this._dateCreation = dateCreation;
    this._carnetId = carnetId;
  }

  get id() {
    return this._id;
  }

  get nom() {
    return this._nom;
  }

  get prenom() {
    return this._prenom;
  }

  get telephone() {
    return this._telephone;
  }

  get email() {
    return this._email;
  }

  get profession() {
    return this._profession;
  }

  get retraite() {
    return this._retraite;
  }

  get commentaire() {
    return this._commentaire;
  }

  get dateCreation() {
    return this._dateCreation;
  }

  get carnetId() {
    return this._carnetId;
  }
}

export { Contact };
