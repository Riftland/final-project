//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

/*
  Generated class for the GeolocatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeolocatorProvider {

  constructor(
    //public http: HttpClient,
    public geo: Geolocation
  ) { }

  getPosition() {
    setInterval(() => {
      this.geo.getCurrentPosition()
        .then(resp => {
          console.log(`Latitud: ${resp.coords.latitude} | Longitud: ${resp.coords.longitude}`);
        })
        .catch(error => {
          console.log('Error intentando adquirir la geolocalización', error);
        })
    }, 1000)
  }

}
