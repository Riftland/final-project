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

  options:object = {
    withCredentials:true
  }

  constructor(
    //public http: HttpClient,
    public http: Http
  ) { }

  //Método para encontrar pokémons
  pokeFinder(id:number) {
    console.log('Método pokemon finder');
    this.http.get(`${this.BASE_URL}/:${id}`, this.options)
      .subscribe(res => res.json());
  }

}
