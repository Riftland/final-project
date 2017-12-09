import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FirstTimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'first-time-page'
})
@Component({
  selector: 'page-first-time',
  templateUrl: 'first-time.html',
})
export class FirstTimePage {

  gender:string

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
    ) { }

  ionViewDidLoad() {}

  choosePokemon() {
    console.log('Elige a tu bicho, cabrón!');
    this.navCtrl.push('choose-pokemon-page');
  }

}
