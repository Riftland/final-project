//import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
/*
  Generated class for the PokemonFinderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PokemonFinderProvider {

  BASE_URL = 'http://localhost:3000/find';
  BASE_URL_USER = 'http://localhost:3000/user';
  pokeToken:any;
  headers:any = new Headers();

  options:object = {
    withCredentials:true
  }

  pokeFinded(o) {
    this.pokeToken = o;
    console.log(this.pokeToken);
    return this.pokeToken;
  }

  constructor(
    //public http: HttpClient,
    public http: Http
  ) { }

  //Método para encontrar un pokemon
  pokeFinder(id:number) {
    console.log('Método pokemon finder');
    this.http.get(`${this.BASE_URL}/${id}`, this.options)
      .subscribe(pokemon => this.pokeFinded(pokemon))
  };

  //Método para registrar un pokemon
  pokeRegister(userId:any, id:number, pokeName:string) {
    console.log('Método para registrar pokemon');
    console.log(`Id de pokemon: ${id}
                 Nombre Pokemon: ${pokeName}`);
    //this.headers.append('authorization', `JWT ${JSON.parse(userToken).token}`);
    this.http.post(`${this.BASE_URL}/add/${userId}`, {id, pokeName}, this.options)
      .subscribe(res => res.json())
  }

  //Método para recuperar toda la info del usuario
  getAll(userId:number) {
    console.log('Método para traer todo lo del usuario');
    return this.http.get(`${this.BASE_URL_USER}/${userId}`)
      .map(res => res.json())
  }

}
