import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PlaysTabComponent } from './user/plays-tab/plays-tab.component';
import { CharacterScrollComponent } from './user/character-scroll/character-scroll.component';
import { UserProfileComponent } from './shared/user-profile/user-profile.component';
import { CharactersComponent } from './user/characters/characters.component';
import { CreateCharacterComponent } from './user/create-character/create-character.component';
import { LoginUserComponent } from './user/login-user/login-user.component';
import { UserAccountComponent } from './user/user-account/user-account.component';
import { ViewCharacterComponent } from './user/view-character/view-character.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { CreateUserComponent } from './admin/create-user/create-user.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { ReviewPlayComponent } from './user/review-play/review-play.component';
import { PaymentAdminComponent } from './admin/payment-admin/payment-admin.component';
import { RankingsComponent } from './shared/rankings/rankings.component';

const routes: Routes = [
  {
    path:'',
    component:LoginUserComponent
  },
  {
    path:'home',
    component:CharacterScrollComponent
  },
  // User Routes
  {
    path:'favorite',
    component:PlaysTabComponent
  },
  {
    path:'award_star',
    component:CharactersComponent
  },
  {
    path:'account_circle',
    component:UserAccountComponent
  },
  {
    path:'shield_person',
    component:AdminDashboardComponent
  },
  {
    path:'leaderboard',
    component:RankingsComponent
  },
  {
    path:'local_atm',
    component:PaymentAdminComponent
  },
  {
    path:'admin/create-user',
    component:CreateUserComponent
  },
  {
    path:'admin/manage-users',
    component:ManageUsersComponent
  },
  {
    path:'newChr',
    component:CreateCharacterComponent
  },
  { path: 'profile/:id/:name', component: UserProfileComponent },
  { path: 'inbox/:id/:name', component: UserProfileComponent },
  { path: 'completed/:id/:name', component: UserProfileComponent },
  { path: 'view-character/:id/:name', component: ViewCharacterComponent },
  { path: 'review-play/:id/:likeId', component: ReviewPlayComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
