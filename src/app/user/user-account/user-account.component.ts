import { Component, OnInit } from '@angular/core';
import { UserAccount } from 'src/app/models/userprofiles';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit{
 stats = [
    { label: 'Wallet', value: 1200 },
    { label: 'Plays', value: 2 },
    { label: 'Rating', value: 4.5 },
    { label: 'Characters', value: 2 }
  ];

  myProfile !: UserAccount;

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString !== null && currentUserString !== undefined && currentUserString !== '') {
      this.myProfile = JSON.parse(currentUserString);   
      console.log(this.myProfile);
      
    }
  }
}
