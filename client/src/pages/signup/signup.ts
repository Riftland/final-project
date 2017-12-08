import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
//Indicando el nombre en el decorador habrá que especificar
//el mismo nombre en el método de navegación 'push'.
//Si no se indica, el método push deberá llevar el nombre
//del import
@IonicPage({
  name: 'signup-page'
})
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  username:string = '';
  hashed_password:string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signupOnClick() {
    this.auth.signup(this.username, this.hashed_password);
    //Vaciar los campos del formulario
    this.username = '';
    this.hashed_password = '';
    //Quita el último elemento del stack para volver a la página anterior
    this.navCtrl.pop();
  }

}
