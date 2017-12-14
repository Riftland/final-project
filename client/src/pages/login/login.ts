import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TokenReaderProvider } from '../../providers/token-reader/token-reader';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'login-page'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user:any;
  username:string = '';
  hashed_password:string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private tokenReader: TokenReaderProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginOnClick() {
    this.auth.login(this.username, this.hashed_password);
    console.log(this.username, this.hashed_password);
    let t = setInterval(() => {
      if(this.auth.token){
        this.user = this.tokenReader.tokenReader(this.auth.token._body);
        if(this.user.first){
          console.log('A la primera página!');
          //Set root vacía la pila de pages, así que no hace falta el push
          this.navCtrl.setRoot('first-time-page');
        } else{
          console.log('A la página principal del jugador!');
          this.navCtrl.setRoot('main-page');
        }
        clearInterval(t);
      } else{
        console.log('No hay token!');
      }
      //Queda cortar si no hay autorización!!
    }, 500);

  }

}
