export class Carnet {
  constructor(id, contacts) {
    this._id = id;
    this._contacts = contacts;
  }

  get id() {
    return this._id;
  }

  get contactClass() {
    return this._contacts;
  }
}
