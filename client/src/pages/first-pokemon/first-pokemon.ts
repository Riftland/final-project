import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PokemonFinderProvider } from '../../providers/pokemon-finder/pokemon-finder';
import { TokenReaderProvider } from '../../providers/token-reader/token-reader';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the FirstPokemonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'first-pokemon-page'
})
@Component({
  selector: 'page-first-pokemon',
  templateUrl: 'first-pokemon.html',
})
export class FirstPokemonPage {

  pokemon:any;
  pokeName:string;
  user:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private finder: PokemonFinderProvider,
    private tokenReader: TokenReaderProvider,
    private auth: AuthProvider
  ) { }

  ionViewDidLoad() {
    this.show();
  }

  show() {
    this.finder.pokeFinder(this.navParams.get('data'));
    let t = setInterval(() => {
      console.log('Esperando datos...');
      if(this.finder.pokeToken){
        console.log('Datos encontrados!');
        this.pokemon = this.tokenReader.tokenReader(this.finder.pokeToken._body);
        console.log(this.pokemon);
        clearInterval(t);
      }
    }, 500);
  }

  toMain() {
    if(this.auth.nativeStorage){
      this.auth.nativeStorage.getItem('tokenUser')
        .then(data => {
          console.log('Token de usuario obtenido del almacén');
          this.user = this.tokenReader.tokenReader(data.property);
          console.log(this.user);
          this.user.first = false;
          console.log(this.user);
          this.finder.pokeRegister(this.user.id, this.pokemon._id, this.pokeName);
          this.navCtrl.setRoot('main-page');
        })
        .catch(error => {
          console.log('No ha sido posible obtener los datos del almacén');
        })
    } else{
      console.log(this.auth.token);
    }
  }

}
