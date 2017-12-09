import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstPokemonPage } from './first-pokemon';

@NgModule({
  declarations: [
    FirstPokemonPage,
  ],
  imports: [
    IonicPageModule.forChild(FirstPokemonPage),
  ],
})
export class FirstPokemonPageModule {}
