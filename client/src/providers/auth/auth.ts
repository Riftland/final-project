//import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class AuthProvider {

  token:any;
  local:any;

  BASE_URL = 'http://localhost:3000/auth';

  options:object = {
    withCredentials:true
  }

  tokenUser(o) {
    this.token = o;
    this.addToStorage();
    return this.token;
  }

  addToStorage() {
    let t = setInterval(() => {
      console.log('Esperando al token para guardar en storage');
      if(this.token){
        this.nativeStorage.setItem('tokenUser', {property: this.token._body})
          .then(
            () => console.log('Item guardado!'),
            error => console.log('Error al guardar', error)
          );
        clearInterval(t);
      }
    }, 500);
  }

  constructor(
    //public http: HttpClient,
    public http: Http,
    public nativeStorage: NativeStorage
  ) { }

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
    return this.http.post(`${this.BASE_URL}/signup`, {username, hashed_password}, this.options)
      .subscribe(res => res.json());
  }

  //Funciona
  login(username:string, hashed_password: string) {
    console.log('Método login del provider');
    return this.http.post(`${this.BASE_URL}/login`, {username, hashed_password}, this.options)
      .subscribe(token => {
          console.log('Entra aquí');
          this.tokenUser(token)
        }
      )
  }

}
