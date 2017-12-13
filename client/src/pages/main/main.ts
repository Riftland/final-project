import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TokenReaderProvider } from '../../providers/token-reader/token-reader';
import { PokemonFinderProvider } from '../../providers/pokemon-finder/pokemon-finder';
import { GeolocatorProvider } from '../../providers/geolocator/geolocator';
import { AlertController } from 'ionic-angular';


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
    public alerCtrl: AlertController,
    private auth: AuthProvider,
    private tokenReader: TokenReaderProvider,
    private pokeFinder: PokemonFinderProvider,
    public geolocator: GeolocatorProvider
    ) { }

  ionViewDidLoad() {
    if(!this.auth.token){
      console.log('No hay token');
      //this.waitForToken();
    } else{
      console.log('Sí hay token');
      //this.user = this.tokenReader.loginTokenReader(this.auth.token._body);
      //No puede leer la propiedad undefined de id
      if(this.auth.nativeStorage.getItem('tokenUser')){
        this.getData();
        this.watcher();
      }
    }
  }

  getData() {
    this.auth.nativeStorage.getItem('tokenUser')
      .then(data => {
        this.user = this.tokenReader.tokenReader(data.property);
        this.pokeFinder.getAll(this.user.id)
          .subscribe(data => {
            this.userData = data
          })
        this.geolocator.getPosition(this.user.id);
      })
      .catch(error => {
        console.log('No ha sido posible recuperar la info del storage');
      })
  }

  watcher(){
    //No está bien implementado
    setInterval(() => {
      if(this.geolocator.show) {
        let alert = this.alerCtrl.create({
          title: 'New Rival!',
          message: 'Misterious rival has appeared!',
          buttons: [{
            text: 'See result!',
            handler: () => {
              this.navCtrl.push('fight-log-page');
            }
          }]
        });
        this.geolocator.show = false;
        alert.present();
      }
    }, 1000)
  }


}
