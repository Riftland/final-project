//import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

const BASE = 'http://localhost:3000';
const URL = `${BASE}/auth`;

@Injectable()
export class AuthProvider {

  token:any;
  local:any;

  options:object = {
    withCredentials:true
  }

  tokenUser(o) {
    this.token = o;
    this.local.set('user', 'Fran');
    // if(!this.storage.get('user')){
    //   console.log('No existe user!, vamos a añadirlo!');
    //   this.addToStorage();
    // }
    return this.token;
  }

  addToStorage() {
    let t = setInterval(() => {
      console.log('Esperando Token para guardar en storage');
      if(this.token){
        this.storage.set('user', this.token);
      }
    }, 500);
  }

  constructor(
    //public http: HttpClient,
    public http: Http
  ) {
    this.local = new Storage();
  }

  //Funciona
  // signup(username:string, hashed_password:string) {
  //   console.log(username, hashed_password);
  //   return new Promise((resolve, reject) => {
  //     this.http.post(`${URL}/signup`, {username, hashed_password})
  //       .subscribe(res => {
  //         resolve(res);
  //       }, (err) => {
  //         reject(err);
  //       });
  //   });
  // }

  //Funciona
  signup(username:string, hashed_password:string) {
    console.log('Método signup del provider');
    console.log(username, hashed_password);
    return this.http.post(`${URL}/signup`, {username, hashed_password}, this.options)
      .subscribe(res => res.json());
  }

  //Funciona
  login(username:string, hashed_password: string) {
    console.log('Método login del provider');
    return this.http.post(`${URL}/login`, {username, hashed_password}, this.options)
      .subscribe(token => this.tokenUser(token))
  }

}
