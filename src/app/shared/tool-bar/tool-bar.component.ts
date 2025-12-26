import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAccount } from 'src/app/models/userprofiles';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {
  @Input() showToolbar: boolean = true;      // Toggle visibility
  @Input() icons: string[] = [];             // Array of icon names
  isAdminUser: boolean = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString !== null && currentUserString !== undefined && currentUserString !== '') {
      const myProfile: UserAccount = JSON.parse(currentUserString);
      this.isAdminUser = myProfile.id.toString().toLowerCase().includes('admin');
    }
  }

  get displayIcons(): string[] {
    if (this.isAdminUser) {
      return [...this.icons, 'shield_person','local_atm'];
    }
    return this.icons;
  }

  navigateTo(iconName: string) {
    this.router.navigate([`${iconName}`]);
    
  }
}
