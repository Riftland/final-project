import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) { }

  signupClicked() {
    console.log('Signup!');
    /*
    Deberá llevar el nombre del import si en el decorador
    que haya en el destino no hay ningún nombre especificado
    */
    /*
    Por el contrario, si en el decorador @IonicPage de la página del destino
    hay un nombre definido, deberá (obligatorio) llevar éste en su lugar.
    El import en este caso lógicamente no será necesario realizarlo
    */
    //this.navCtrl.push('SignupPage');
    this.navCtrl.push('signup-page');
  }


  loginClicked() {
    console.log('Login!');
    this.navCtrl.push('login-page');
  }

}
