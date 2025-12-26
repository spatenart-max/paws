import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-review-play',
  templateUrl: './review-play.component.html',
  styleUrls: ['./review-play.component.scss']
})
export class ReviewPlayComponent implements OnInit {
  profile: any;
  userId!: string;
  likeId!: string;
  rating: number = 0;
  currentUserId: string = '';
  isLoading: boolean = false;
  requestStatus: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private firestore: Firestore) {}

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      this.currentUserId = currentUser.id;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = id;
      this.loadProfile();
    }
    const likeId = this.route.snapshot.paramMap.get('likeId');
    if (likeId) {
      this.likeId = likeId;
      console.log('Reviewing like ID:', this.likeId);
    }
  }

  async loadProfile() {
    try {
      const docRef = doc(this.firestore, 'characters', this.userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.profile = docSnap.data();
        console.log('Reviewing profile:', this.profile);
      } else {
        console.error('Profile not found');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  setRating(r: number) {
    this.rating = r;
  }

  async submitReview() {
    if (this.rating === 0) {
      this.requestStatus = 'Please select a rating before submitting.';
      setTimeout(() => this.requestStatus = '', 3000);
      return;
    }
    this.isLoading = true;
    this.requestStatus = '';
    try {
      const review = {
        createdAt: new Date(),
        fromUserId: this.currentUserId,
        likeId: this.likeId,
        rating: this.rating.toString(),
        toChrId: this.userId,
        toUserId: this.profile.owneruserid
      };
      console.log('Submitting review:', review);
      await addDoc(collection(this.firestore, 'reviews'), review);
      this.requestStatus = 'Review submitted successfully!';
      setTimeout(() => {
        this.router.navigate(['favorite']);
      }, 1500);
    } catch (error) {
      console.error('Error submitting review:', error);
      this.requestStatus = 'Failed to submit review. Please try again.';
    } finally {
      this.isLoading = false;
      setTimeout(() => this.requestStatus = '', 3000);
    }
  }
}
