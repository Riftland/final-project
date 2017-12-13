import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FightLogPage } from './fight-log';

@NgModule({
  declarations: [
    FightLogPage,
  ],
  imports: [
    IonicPageModule.forChild(FightLogPage),
  ],
})
export class FightLogPageModule {}
