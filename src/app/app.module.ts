import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt'; // Correção na importação
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { initializeApp } from 'firebase/app';

initializeApp(environment.firebase)

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token'); // Função que obtém o token do Local Storage
        },
      },
    }),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp({"projectId":"pet-club-678a8","appId":"1:1042796599505:web:694d3ff1b2f9af0c400df0","storageBucket":"pet-club-678a8.appspot.com","apiKey":"AIzaSyBlECn26I9hxoIeaQKt3mfRS1eiOb5SxXQ","authDomain":"pet-club-678a8.firebaseapp.com","messagingSenderId":"1042796599505","measurementId":"G-W554EC5L9G"})),
    provideStorage(() => getStorage()),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
