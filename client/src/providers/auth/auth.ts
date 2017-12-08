//import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

const BASE = 'http://localhost:3000';
const URL = `${BASE}/auth`;

@Injectable()
export class AuthProvider {

  token:any;

  options:object = {
    withCredentials:true
  }

  tokenUser(o) {
    this.token = o;
    return this.token;
  }

  constructor(
    //public http: HttpClient,
    public http: Http
  ) {
    console.log('Hello AuthProvider Provider');
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
