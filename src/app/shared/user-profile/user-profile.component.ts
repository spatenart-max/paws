import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from 'src/app/models/userprofiles';
import { UserDataService } from 'src/app/services/user-data.service';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnChanges {
  values = ["qwerty", 'rty', 'tyu yu', 'saddsd'];
  userId!: string;
  tabname!: string;
  showConfirmBox: boolean = false;
  showAcceptBox: boolean = false;
  showRejectBox: boolean = false;
  feedback: boolean = false;
  isLoading: boolean = false; // Added loading state for requests
  requestStatus: string = ''; // Added status message for requests
  @Input() activeProfile!: UserProfile;
  @Output() disableScroll = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute, private userDataService: UserDataService, private firestore: Firestore, private router: Router) { }
  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) this.userId = userId;
    const tabname = this.route.snapshot.paramMap.get('name');
    if (tabname) this.tabname = tabname;
    const profile = userId ? this.userDataService.getProfileByID(userId) : null; // Added null check for userId
    if (profile) {
      this.activeProfile = profile;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['activeProfile']) {
      console.log(this.activeProfile, 'changes');

    }
  }
  likeProfile(profile: UserProfile) {
    console.log(profile);
    this.showConfirmBox = true;
    this.disableScroll.emit(true);
  }
  closeConfirmBox() {
    this.showConfirmBox = false;
    this.disableScroll.emit(false);

  }
  closeAcceptBox() {
    this.showAcceptBox = false;
    this.disableScroll.emit(false);

  }
  closeRejectBox() {
    this.showRejectBox = false;
    this.disableScroll.emit(false);

  }
  acceptPlay(){
    this.showAcceptBox = true;
    this.disableScroll.emit(true);
  }
  rejectPlay(){
    this.showRejectBox = true;
    this.disableScroll.emit(true);
  }
  confirmReject(){
    console.log('reject confirmed');
    
  }
  cancelReject(){
    console.log('reject cancelled');

  }
  feedbackClick(){
    this.feedback=true;
  }

  async onDateClick() {
    this.isLoading = true;
    this.requestStatus = '';
    try {
      await this.createPlayRequest('date');
      this.isLoading = false;
      this.requestStatus = 'Date request sent successfully!';
      setTimeout(() => {
        this.closeConfirmBox();
        this.router.navigate(['/home']); // Navigate back to character scroll
      }, 1000);
    } catch (error) {
      if ((error as Error).message === 'DUPLICATE_REQUEST') {
        this.isLoading = false;
        this.requestStatus = 'You already have a pending or accepted request to this character.';
        setTimeout(() => {
          this.requestStatus = '';
        }, 2500);
      } else {
        this.isLoading = false;
        this.requestStatus = 'Failed to send date request. Please try again.';
        setTimeout(() => {
          this.requestStatus = '';
          this.router.navigate(['/home']);
        }, 2000);
      }
    }
  }

  async onRolePlayClick() {
    this.isLoading = true;
    this.requestStatus = '';
    try {
      await this.createPlayRequest('roleplay');
      this.isLoading = false;
      this.requestStatus = 'RolePlay request sent successfully!';
      setTimeout(() => {
        this.closeConfirmBox();
        this.router.navigate(['/home']); // Navigate back to character scroll
      }, 1000);
    } catch (error) {
      if ((error as Error).message === 'DUPLICATE_REQUEST') {
        this.isLoading = false;
        this.requestStatus = 'You already have a pending or accepted request to this character.';
        setTimeout(() => {
          this.requestStatus = '';
        }, 2500);
      } else {
        this.isLoading = false;
        this.requestStatus = 'Failed to send roleplay request. Please try again.';
        setTimeout(() => {
          this.requestStatus = '';
          this.router.navigate(['/home']);
        }, 2000);
      }
    }
  }

  private async createPlayRequest(typeOfPlay: string) {
    try {
      // Get current user from localStorage
      const currentUserString = localStorage.getItem('currentUser');
      if (!currentUserString) {
        console.error('No current user found');
        return;
      }

      const currentUser = JSON.parse(currentUserString);

      // Get current user's first active character
      const charactersQuery = query(
        collection(this.firestore, 'characters'),
        where('owneruserid', '==', currentUser.id),
        where('status', '!=', 'banned')
      );
      const charactersSnapshot = await getDocs(charactersQuery);
      
      if (charactersSnapshot.empty) {
        throw new Error('You need to create a character first!');
      }

      // Use the first character as the sender
      const senderCharacter = charactersSnapshot.docs[0];
      const fromChrId = senderCharacter.id; // Use Firestore document ID directly

      const requestData = {
        createdAt: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        fromChrId: fromChrId,
        fromUserId: currentUser.id,
        price: this.activeProfile.rate,
        status: 'pending',
        toChrId: this.activeProfile.id, // Using c + profile id as character ID
        toUserId: this.activeProfile.ownerid || '',
        typeOfPlay: typeOfPlay
      };

      // Prevent duplicate pending/accepted requests from same sender character to same target character
      const likesCollection = collection(this.firestore, 'likes');
      const duplicateQuery = query(
        likesCollection,
        where('fromChrId', '==', fromChrId),
        where('toChrId', '==', this.activeProfile.id),
        where('status', 'in', ['pending', 'accepted'])
      );
      const duplicateSnap = await getDocs(duplicateQuery);
      if (!duplicateSnap.empty) {
        // Throw a special error so caller can show a friendly message
        throw new Error('DUPLICATE_REQUEST');
      }

      // Add to 'likes' collection in Firestore
      await addDoc(likesCollection, requestData);

      console.log(`${typeOfPlay} request created:`, requestData);
      // Success status is handled in the calling method

    } catch (error) {
      console.error('Error creating play request:', error);
      throw error; // Re-throw to let calling method handle the error
    }
  }
}
