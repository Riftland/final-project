//import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the GeolocatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeolocatorProvider {

  BASE_URL_LOC = 'http://localhost:3000/user/loc';
  coordinates:Array<number> = [];

  options:object = {
    withCredentials:true
  }

  rival:any;
  fight:boolean = true;
  show:boolean = false;

  constructor(
    //public http: HttpClient,
    public http: Http,
    public geo: Geolocation
  ) { }

  getPosition(userId:number) {
    if(this.fight){
      let t = setInterval(() => {
        let response;
        this.geo.getCurrentPosition()
          .then(resp => {
            //console.log('ID: ' + userId);
            this.coordinates = [Number(resp.coords.latitude.toFixed(6)), Number(resp.coords.longitude.toFixed(6))];
            //console.log(this.coordinates);
            //console.log(`Latitud: ${resp.coords.longitude} | Longitud: ${resp.coords.latitude}`);
            this.http.post(`${this.BASE_URL_LOC}/${userId}`, this.coordinates, this.options)
              .subscribe(res => {
                // response = res.json();
                // console.log(response.message);
                // if(res.json().message + '' !== 'No hay rival'){
                  this.rival = res.json();
                  console.log(this.rival);
                  this.fight = false;
                  this.show = true;
                  clearInterval(t);
                // }
              })
          })
          .catch(error => {
            console.log('Error intentando adquirir la geolocalización', error);
          })
      }, 2000)
    }
  }

}
