import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChoosePokemonPage } from './choose-pokemon';

@NgModule({
  declarations: [
    ChoosePokemonPage,
  ],
  imports: [
    IonicPageModule.forChild(ChoosePokemonPage),
  ],
})
export class ChoosePokemonPageModule {}
