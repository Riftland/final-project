import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeStorage } from '@ionic-native/native-storage';
import { Geolocation } from '@ionic-native/geolocation';
/*
Es necesario importar el módulo http y requerirlo en
imports para poder utilizarlo en los providers/services
*/
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthProvider } from '../providers/auth/auth';
import { TokenReaderProvider } from '../providers/token-reader/token-reader';
import { PokemonFinderProvider } from '../providers/pokemon-finder/pokemon-finder';
import { GeolocatorProvider } from '../providers/geolocator/geolocator';
import { LogFinderProvider } from '../providers/log-finder/log-finder';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TokenReaderProvider,
    PokemonFinderProvider,
    NativeStorage,
    GeolocatorProvider,
    Geolocation,
    LogFinderProvider
  ]
})
export class AppModule {}
