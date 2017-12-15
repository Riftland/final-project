import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LogFinderProvider } from '../../providers/log-finder/log-finder';

/**
 * Generated class for the FightLogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'fight-log-page'
})
@Component({
  selector: 'page-fight-log',
  templateUrl: 'fight-log.html',
})
export class FightLogPage {

  count:number = 20;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logFinder: LogFinderProvider
  ) { }

  ionViewDidLoad() {
    this.logFinder.getLog();
    if(!this.logFinder.log){
      let t = setInterval(() => {
        console.log('Buscando log...');
        if(this.logFinder.log){
          console.log(this.logFinder.log);
          clearInterval(t);
        }
      }, 500);
    }
  }

}
