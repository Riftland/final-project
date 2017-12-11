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

  constructor(
    //public http: HttpClient,
    public http: Http,
    public geo: Geolocation
  ) { }

  getPosition(userId:number) {
    setInterval(() => {
      this.geo.getCurrentPosition()
        .then(resp => {
          //console.log('ID: ' + userId);
          this.coordinates.push(resp.coords.longitude);
          this.coordinates.push(resp.coords.latitude);
          //console.log(this.coordinates);
          //console.log(`Latitud: ${resp.coords.latitude} | Longitud: ${resp.coords.longitude}`);
          this.http.post(`${this.BASE_URL_LOC}/${userId}`, this.coordinates, this.options)
            .subscribe(res => {
              console.log(res.json());
              this.coordinates = [];
            })
        })
        .catch(error => {
          console.log('Error intentando adquirir la geolocalización', error);
        })
    }, 2000)
  }

}
