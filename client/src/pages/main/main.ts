import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TokenReaderProvider } from '../../providers/token-reader/token-reader';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'main-page'
})
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  private user:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private tokenReader: TokenReaderProvider) {
  }

  ionViewDidLoad() {
    if(!this.auth.token){
      console.log('No hay token');
      //this.waitForToken();
    } else{
      console.log('Sí hay token');
      //this.user = this.tokenReader.loginTokenReader(this.auth.token._body);
      console.log(this.user);
    }
  }

  waitForToken() {
    let t = setInterval(() => {
      if(this.auth.token){
        this.navCtrl.setRoot('main-page');
        console.log(this.user);
        console.log('Cargando token!')
        clearInterval(t);
      }
    }, 500);
  }

}
