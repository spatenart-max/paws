import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss']
})
export class LoginUserComponent {
  id: string = '';
  alertMessage = 'asdadsa'
  showAlert: boolean = false;
  constructor(private generalService: GeneralService, private router: Router) { }
  login() {
    if(this.isAdmin(this.id)){
       this.generalService.loginForAdmin(this.id)
        .then(user => {
          console.log('Logged in:', user);
          this.router.navigate(['home']);
          this.alertMessage = '';
          this.showAlert = false;
        })
        .catch(err => {
          this.alertMessage = 'Invalid ID !'
          this.showAlert = true;
        });
    }else{
       this.generalService.loginWithLoginId(this.id)
        .then(user => {
          console.log('Logged in:', user);
          this.router.navigate(['home']);
          this.alertMessage = '';
          this.showAlert = false;
        })
        .catch(err => {
          this.alertMessage = 'Invalid ID !'
          this.showAlert = true;
        });
    }
     

  }
  isAdmin(id: string): boolean {
    return id.toLowerCase().includes('admin');
  }
}
