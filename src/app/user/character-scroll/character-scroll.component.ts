import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UserAccount, UserProfile, UserProfiles } from 'src/app/models/userprofiles';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-character-scroll',
  templateUrl: './character-scroll.component.html',
  styleUrls: ['./character-scroll.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(50px) scale(0.9)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0) scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ transform: 'translateY(-50px) scale(0.9)', opacity: 0 }))
      ])
    ])
  ]
})
export class CharacterScrollComponent implements OnInit {
  activeProfiles: UserProfile[] = [];
  allProfiles: UserProfile[] = [];
  selectedGender: string = '';
  showFilterPopup: boolean = false;
  tempSelectedGender: string = '';
  disableScrolling: boolean = false;
  myProfile: UserAccount | null = null;
  constructor(private userDataService: UserDataService) { }
  async ngOnInit(): Promise<void> {
    const profiles = await this.userDataService.getActiveProfiles();
    console.log(profiles, 'before shuffle 1');

    this.allProfiles = this.shuffleOnce(profiles);
    console.log(this.allProfiles, 'after shuffle 1');
    this.activeProfiles = [...this.allProfiles];

    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString !== null && currentUserString !== undefined && currentUserString !== '') {
      this.myProfile = JSON.parse(currentUserString);

    }
  }
  currentIndex = 0;
  startY = 0;
  endY = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) { this.startY = event.touches[0].clientY; }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (!this.disableScrolling) {
      this.endY = event.changedTouches[0].clientY;
      const deltaY = this.startY - this.endY;
      if (deltaY > 50 && this.currentIndex < this.activeProfiles.length - 1) {
        this.currentIndex++;
      }
    }
  }
  toggleScroll(value: boolean) {

    this.disableScrolling = value;
  }

  onGenderChange(gender: string) {
    this.selectedGender = gender;
    if (!gender) {
      this.activeProfiles = [...this.allProfiles];
    } else {
      if (gender === 'other') {
        this.activeProfiles = this.allProfiles.filter(p => {
          const g = (p as any).gender;
          if (!g) return true;
          const gl = ('' + g).toLowerCase();
          return gl !== 'male' && gl !== 'female';
        });
      } else {
        this.activeProfiles = this.allProfiles.filter(p => (('' + ((p as any).gender || '')).toLowerCase()) === gender);
      }
    }

    console.log(this.allProfiles, 'before shuffle 2');

    this.allProfiles = this.shuffleOnce(this.allProfiles);
    console.log(this.allProfiles, 'after shuffle 2');
    this.currentIndex = 0;
  }

  openFilter() {
    this.tempSelectedGender = this.selectedGender || '';
    this.showFilterPopup = true;
  }

  applyFilter() {
    this.showFilterPopup = false;
    this.onGenderChange(this.tempSelectedGender || '');
  }

  clearFilter() {
    this.tempSelectedGender = '';
    this.onGenderChange('');
    this.showFilterPopup = false;
  }
  shuffleOnce<T>(array: T[]): T[] {
    const shuffled = [...array]; // avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
