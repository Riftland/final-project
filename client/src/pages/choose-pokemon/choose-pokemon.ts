import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the ChoosePokemonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'choose-pokemon-page'
})
@Component({
  selector: 'page-choose-pokemon',
  templateUrl: 'choose-pokemon.html',
})
export class ChoosePokemonPage {

  pokeInit:Array<number> = [1, 4, 7];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider) { }

  ionViewDidLoad() {}

  surprise() {
    console.log(this.auth.local);
    console.log(this.pokeInit[~~(Math.random() * 3)]);
  }

}
