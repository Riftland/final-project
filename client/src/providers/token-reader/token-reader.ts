import { Injectable } from '@angular/core';
import {JwtHelper} from "angular2-jwt";

/*
  Generated class for the TokenReaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TokenReaderProvider {

  user:string;
  recToken:string;
  jwtHelper = new JwtHelper();

  constructor() { }

  loginTokenReader(token){
    this.recToken = JSON.parse(token).token;
    return this.user = this.jwtHelper.decodeToken(this.recToken);
  }

}
