import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserProfile } from 'src/app/models/userprofiles';
import { UserDataService } from 'src/app/services/user-data.service';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, addDoc, deleteDoc, collection, updateDoc, query, where, getDocs } from '@angular/fire/firestore';

interface LikeData {
  id: string;
  createdAt: string;
  fromChrId: string;
  fromUserId: string;
  price: number;
  status: string;
  toChrId: string;
  toUserId: string;
  typeOfPlay: string;
}

@Component({
  selector: 'app-view-character',
  templateUrl: './view-character.component.html',
  styleUrls: ['./view-character.component.scss']
})
export class ViewCharacterComponent implements OnInit {
values = ["qwerty", 'rty', 'tyu yu', 'saddsd'];
  userId!: string;
  tabname!: string;
  title!: string;
  characterData: any;
  showConfirmBox: boolean = false;
  showAcceptBox: boolean = false;
  showRejectBox: boolean = false;
  feedback: boolean = false;
  currentUserId: string = '';
  approving: boolean = false;
  rejecting: boolean = false;
  isLoading: boolean = false; // Added loading state for requests
  requestStatus: string = ''; // Added status message for requests
  acceptSuccess: boolean = false; // Track if accept like was successful
  loadingCharacter: boolean = true;
  loadError: string = '';
  copied: boolean = false;
  likeId: string = '';
  @Input() activeProfile!: UserProfile;
  @Output() disableScroll = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute, private userDataService: UserDataService, private firestore: Firestore, private router: Router, private location: Location) { }
  async ngOnInit(): Promise<void> {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) this.userId = userId;
    const tabname = this.route.snapshot.paramMap.get('name');
    if (tabname) this.tabname = tabname;
    this.title = this.getTitle(this.tabname);
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      this.currentUserId = currentUser.id;
    }
    await this.loadCharacterData();
    if (this.tabname.toLowerCase() === 'active') {
      await this.loadLikeId();
    }
  }
    
  

  
  async loadCharacterData() {
    this.loadingCharacter = true;
    this.loadError = '';
    let collectionName = '';
    if (this.tabname.toLowerCase() === 'active' || this.tabname.toLowerCase() === 'banned' || this.tabname.toLowerCase() === 'inbox') {
      collectionName = 'characters';
    } else if (this.tabname.toLowerCase() === 'pending') {
      collectionName = 'pending-characters';
    }
    if (collectionName) {
      try {
        const docRef = doc(this.firestore, collectionName, this.userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.characterData = docSnap.data();
          console.log(this.characterData,'chr');

        } else {
          this.loadError = 'Character not found.';
        }
      } catch (error) {
        console.error('Error fetching character data:', error);
        this.loadError = 'Error loading character data.';
      }
    } else {
      this.loadError = 'Invalid tab.';
    }
    this.loadingCharacter = false;
  }
  
  async loadLikeId() {
    try {
      const currentUserString = localStorage.getItem('currentUser');
      if (!currentUserString) return;
      const currentUser = JSON.parse(currentUserString);
      const likesQuery = query(
        collection(this.firestore, 'likes'),
        where('status', '==', 'accepted')
      );
      const likesSnapshot = await getDocs(likesQuery);
      const likesData: LikeData[] = likesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LikeData));
      const like = likesData.find(l => 
        (l.fromChrId === this.userId || l.toChrId === this.userId) &&
        (l.fromUserId === currentUser.id || l.toUserId === currentUser.id)
      );
      if (like) this.likeId = like.id;
    } catch (error) {
      console.error('Error loading like id:', error);
    }
  }
  getTitle(tab: string): string {
    switch (tab.toLowerCase()) {
      case 'active':
        return 'Active Character';
      case 'pending':
        return 'Pending Character';
      case 'banned':
        return 'Banned Character';
      case 'inbox':
        return 'Like Request';
      default:
        return 'Character';
    }
  }

  isAdmin(): boolean {
    return this.currentUserId.toLowerCase().includes('admin');
  }

  navigateToReview() {
    this.router.navigate(['review-play', this.userId, this.likeId]);
  }

  async approve() {
    this.approving = true;
    this.isLoading = true;
    this.requestStatus = '';
    try {
      const charData = { ...this.characterData, status: 'active' };
      await addDoc(collection(this.firestore, 'characters'), charData);
      await deleteDoc(doc(this.firestore, 'pending-characters', this.userId));
      this.requestStatus = 'Character approved successfully!';
      setTimeout(() => {
        // Go back to previous route
        this.location.back();
      }, 1500);
    } catch (error) {
      console.error('Error approving character:', error);
      this.requestStatus = 'Failed to approve character. Please try again.';
    } finally {
      this.approving = false;
      this.isLoading = false;
      setTimeout(() => {
        this.requestStatus = '';
      }, 3000);
    }
  }

  async reject() {
    this.rejecting = true;
    this.isLoading = true;
    this.requestStatus = '';
    try {
      const charData = { ...this.characterData, status: 'banned' };
      await addDoc(collection(this.firestore, 'characters'), charData);
      await deleteDoc(doc(this.firestore, 'pending-characters', this.userId));
      this.requestStatus = 'Character rejected successfully!';
      setTimeout(() => {
        // Go back to previous route
        this.location.back();
      }, 1500);
    } catch (error) {
      console.error('Error rejecting character:', error);
      this.requestStatus = 'Failed to reject character. Please try again.';
    } finally {
      this.rejecting = false;
      this.isLoading = false;
      setTimeout(() => {
        this.requestStatus = '';
      }, 3000);
    }
  }

  async acceptLike() {
    this.isLoading = true;
    this.requestStatus = '';
    await this.updateLikeStatus('accepted');
  }

  async rejectLike() {
    this.isLoading = true;
    this.requestStatus = '';
    await this.updateLikeStatus('rejected');
  }

  private async updateLikeStatus(status: string) {
    try {
      // Find the like document where fromChrId matches current character and toUserId matches current user
      const likesQuery = query(
        collection(this.firestore, 'likes'),
        where('fromChrId', '==', this.userId), // Use raw document ID directly
        where('toUserId', '==', this.currentUserId),
        where('status', '==', 'pending')
      );

      const likesSnapshot = await getDocs(likesQuery);
      
      if (!likesSnapshot.empty) {
        const likeDoc = likesSnapshot.docs[0];
        await updateDoc(doc(this.firestore, 'likes', likeDoc.id), {
          status: status
        });
        
        this.requestStatus = `Play ${status} successfully!`;
        
        if (status === 'accepted') {
          this.acceptSuccess = true;
        } else {
          setTimeout(() => {
            // Go back to inbox for reject
            this.router.navigate(['/plays']);
          }, 1500);
        }
      } else {
        this.requestStatus = 'Like request not found.';
      }
    } catch (error) {
      console.error(`Error ${status === 'accepted' ? 'accepting' : 'rejecting'} like:`, error);
      this.requestStatus = `Failed to ${status === 'accepted' ? 'accept' : 'reject'} play. Please try again.`;
    } finally {
      this.isLoading = false;
      setTimeout(() => {
        this.requestStatus = '';
      }, 3000);
    }
  }

  goToMessages() {
    // Navigate to messages or back to plays
    this.router.navigate(['/favorite']);
  }

  copyMessage() {
    const message = `Hi dear, I liked your character: ${this.characterData?.name}, Rate: ${this.characterData?.datePrice || 0}, shall we continue`;
    navigator.clipboard.writeText(message).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy message: ', err);
    });
  }
}