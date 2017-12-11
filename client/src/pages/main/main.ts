import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TokenReaderProvider } from '../../providers/token-reader/token-reader';
import { PokemonFinderProvider } from '../../providers/pokemon-finder/pokemon-finder';

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

  private user:any;
  private userData:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private tokenReader: TokenReaderProvider,
    private pokeFinder: PokemonFinderProvider) {
  }

  ionViewDidLoad() {
    if(!this.auth.token){
      console.log('No hay token');
      //this.waitForToken();
    } else{
      console.log('Sí hay token');
      //this.user = this.tokenReader.loginTokenReader(this.auth.token._body);
      //Llamar a native storage de auth
      this.getData();
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

  getData() {
    this.auth.nativeStorage.getItem('tokenUser')
      .then(data => {
        console.log(data.property);
        this.user = this.tokenReader.tokenReader(data.property);
        console.log(this.user);
        this.pokeFinder.getAll(this.user.id)
          .subscribe(data => {
            console.log(data);
            this.userData = data
          })
      })
      .catch(error => {
        console.log('No ha sido posible recuperar la info del storage');
      })
  }

}
