export default class CustomerClass {
  private _id: string;
  private _rev: string;
  private _type: string;
  private _name: string;
  private _street: string;
  private _streetNumber: string;
  private _zip: string;
  private _city: string;
  private _telephone: string;
  private _email: string;
  private _web: string;
  private _token: string;
  private _active: boolean;

  constructor() {}

  public set id(id: string) {
    this._id = id;
  }

  public get id(): string {
    return this._id;
  }

  public set rev(ref: string) {
    this._rev = ref;
  }

  public get ref(): string {
    return this._rev;
  }

  public set type(type: string) {
    this.type = type;
  }

  public get type(): string {
    return this._type;
  }

  public set name(name: string) {
    this.name = name;
  }

  public get name(): string {
    return this._name;
  }

  public set street(street: string) {
    this.street = street;
  }

  public get street(): string {
    return this._street;
  }

  public set streetNumber(streetNumber: string) {
    this.streetNumber = streetNumber;
  }

  public get streetNumber(): string {
    return this._streetNumber;
  }

  public set zip(zip: string) {
    this.zip = zip;
  }

  public get zip(): string {
    return this._zip;
  }

  public set city(city: string) {
    this.city = city;
  }

  public get city(): string {
    return this._city;
  }

  public set telephone(telephone: string) {
    this.telephone = telephone;
  }

  public get telephone(): string {
    return this._telephone;
  }

  public set email(email: string) {
    this.email = email;
  }

  public get email(): string {
    return this._email;
  }

  public set web(web: string) {
    this.web = web;
  }

  public get web(): string {
    return this._web;
  }

  public set token(token: string) {
    this.token = token;
  }

  public get token(): string {
    return this._token;
  }

  public set active(active: boolean) {
    this.active = active;
  }

  public get active(): boolean {
    return this._active;
  }
}
