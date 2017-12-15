import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TeamPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'team-page'
})
@Component({
  selector: 'page-team',
  templateUrl: 'team.html',
})
export class TeamPage {

  userTeam:Array<string>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.userTeam = this.navParams.get('param');
    console.log(this.userTeam);
  }

}
