import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log(this.navParams.get('data'));
  }

}
