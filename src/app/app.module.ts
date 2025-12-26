import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterScrollComponent } from './user/character-scroll/character-scroll.component';
import { ChipsComponent } from './shared/chips/chips.component';
import { ToolBarComponent } from './shared/tool-bar/tool-bar.component';
import { UserProfileComponent } from './shared/user-profile/user-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlaysTabComponent } from './user/plays-tab/plays-tab.component';
import { TitleComponent } from './shared/title/title.component';
import { TabsComponent } from './shared/tabs/tabs.component';
import { BackButtonComponent } from './shared/back-button/back-button.component';
import { CharactersComponent } from './user/characters/characters.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCharacterComponent } from './user/create-character/create-character.component';
import { LoginUserComponent } from './user/login-user/login-user.component';
import { HttpClientModule } from '@angular/common/http';
import { UserAccountComponent } from './user/user-account/user-account.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from 'src/env/environment';
import { ViewCharacterComponent } from './user/view-character/view-character.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { CreateUserComponent } from './admin/create-user/create-user.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { ReviewPlayComponent } from './user/review-play/review-play.component';
import { PaymentAdminComponent } from './admin/payment-admin/payment-admin.component';
import { RankingsComponent } from './shared/rankings/rankings.component';
@NgModule({
  declarations: [
    AppComponent,
    CharacterScrollComponent,
    ChipsComponent,
    ToolBarComponent,
    UserProfileComponent,
    PlaysTabComponent,
    TitleComponent,
    TabsComponent,
    BackButtonComponent,
    CharactersComponent,
    CreateCharacterComponent,
    LoginUserComponent,
    UserAccountComponent,
    ViewCharacterComponent,
    AdminDashboardComponent,
    CreateUserComponent,
    ManageUsersComponent,
    ReviewPlayComponent,
    PaymentAdminComponent,
    RankingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatExpansionModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
