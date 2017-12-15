//import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { NativeStorage } from '@ionic-native/native-storage';

/*
  Generated class for the LogFinderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LogFinderProvider {

  log:object;

  options:object = {
    withCredentials:true
  }

  BASE_URL_LOG = 'http://localhost:3000';

  constructor(
    //public http: HttpClient,
    public http: Http
  ) {
    console.log('Hello LogFinderProvider Provider');
  }

  getLog() {
    return this.http.get(`${this.BASE_URL_LOG}/log`, this.options)
      .subscribe(res => this.log = res.json())
  }

}
