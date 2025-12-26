import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface TabData {
  id:number;
  image: string;
  name: string;
  coins: number;
  age?: number;
  job?: string;
  fromChrId?: string;
  toChrId?: string;
  fromUserId?: string;
  typeOfPlay?: string;
  status?: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class TabsComponent implements OnInit{
  selectedTab!:string;
  isAdmin: boolean = false;
  @Input() activeData: TabData[] = [];
  @Input() inboxData: TabData[] = [];
  @Input() bannedData: TabData[] = [];
  @Input() completedData: TabData[] = [];
  @Input() tabs: string[] = [];
  constructor(private router:Router){}
  ngOnInit(): void {
      this.selectedTab = this.tabs[0];
      this.isAdmin = this.checkIsAdmin();
    console.log(this.isAdmin);

  }
  checkIsAdmin(): boolean {
    try {
      const currentUserString = localStorage.getItem('currentUser');
      if (!currentUserString) return false;
      const currentUser = JSON.parse(currentUserString);
      return currentUser?.id === 'admin';
    } catch {
      return false;
    }
    
  }
  navigateToActive(user: TabData){
    // For active items, navigate to the other user's character
    const currentUserString = localStorage.getItem('currentUser');
    let currentUserId = '';
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      currentUserId = currentUser.id;
    }
    const isCurrentUserSender = user.fromUserId === currentUserId;
    // Prefer the other party's character id, fall back to any available id to avoid undefined segments
    let charId = isCurrentUserSender ? user.toChrId : user.fromChrId;
    if (!charId) {
      // try the opposite one, then the numeric id as last resort
      charId = isCurrentUserSender ? user.fromChrId : user.toChrId;
    }
    if (!charId && user.id !== undefined && user.id !== null) {
      charId = String(user.id);
    }
    if (!charId) {
      // nothing we can navigate to — abort safely
      console.warn('navigateToActive: no character id available for user', user);
      return;
    }
    this.router.navigate(['view-character', charId, this.selectedTab]);
  }
  
  navigateToInbox(user: TabData){
    // For inbox items, navigate to view the character that sent the like (fromChrId)
    if (user.fromChrId) {
      // Use the character document ID directly (no 'c' prefix)
      this.router.navigate(['view-character', user.fromChrId, this.selectedTab]);
    } else {
      // Fallback to index-based navigation
      this.router.navigate(['view-character', user.id, this.selectedTab]);
    }
  }
  navigateToCompleted(userId:number){
    this.router.navigate(['view-character',userId,this.selectedTab]);
  }
  navigateToBanned(user: TabData){
    this.router.navigate(['view-character', user.id, this.selectedTab]);
  }

  navigateToPendingAdmin(user: TabData){
    // Admin should navigate to the character page to be able to approve.
    console.log('asda');
    
    const charId = user.toChrId || user.fromChrId || user.id;
    this.router.navigate(['view-character', charId, 'pending']);
  }
}
