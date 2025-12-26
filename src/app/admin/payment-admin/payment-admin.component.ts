import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, updateDoc, query, where } from '@angular/fire/firestore';

interface ReviewData {
  id: string;
  createdAt: any;
  fromUserId: string;
  fromUserName?: string;
  fromChrId?: string;
  likeId: string;
  rating: string;
  toChrId: string;
  toUserId: string;
  toUserName?: string;
}

interface TabData {
  id: number;
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
  selector: 'app-payment-admin',
  templateUrl: './payment-admin.component.html',
  styleUrls: ['./payment-admin.component.scss']
})
export class PaymentAdminComponent implements OnInit {
  paymentTabs: string[] = ['pending', 'completed'];
  selectedTab: string = this.paymentTabs[0];
  activeData: TabData[] = [];
  completedData: TabData[] = [];
  reviews: ReviewData[] = [];
  groupedReviews: any[] = [];
  groupedCompletedReviews: any[] = [];
  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
    this.loadReviewData();
    this.loadReviewCompletedData();
  }
  createReviewList() {
    const groupedByLikeId = this.reviews.reduce((acc: any, review: any) => {
      const key = review.likeId;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(review);
      return acc;
    }, {});
    return groupedByLikeId;
  }
  async loadReviewData() {
    try {
      const reviewsCollection = collection(this.firestore, 'reviews');
      const reviewsSnapshot = await getDocs(reviewsCollection);
      this.reviews = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ReviewData));
      console.log('Reviews:', this.reviews);

      // Fetch user names
      const userIds = new Set<string>();
      this.reviews.forEach(review => {
        userIds.add(review.fromUserId);
        userIds.add(review.toUserId);
      });
      const userMap = new Map<string, string>();
      const userPromises = Array.from(userIds).map(async (userId) => {
        const userDoc = await getDoc(doc(this.firestore, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userMap.set(userId, userData['name'] || 'Unknown');
        }
      });
      await Promise.all(userPromises);

      // Add names to reviews
      this.reviews.forEach(review => {
        review.fromUserName = userMap.get(review.fromUserId);
        review.toUserName = userMap.get(review.toUserId);
      });

      if (this.reviews.length > 0) {
        const groupedByLikeId = this.createReviewList();
        const groupedReviews:any[] = Object.values(groupedByLikeId);
        this.groupedReviews=[];
        for (const group of groupedReviews) {
          if((group.length === 2) && (group[0].payment !== 'done' && group[1].payment !== 'done')) {
            console.log(group.length,'len');
            
            this.groupedReviews.push(group);
          }
        }
        this.loadReviewCompletedData()  ;
        console.log('Grouped Reviews:', this.groupedReviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }
  async loadReviewCompletedData() {
    try {
      console.log('reviews here',this.reviews);
      
      if (this.reviews.length > 0) {
        const groupedByLikeId = this.createReviewList();
        const groupedCompletedReviews:any[] = Object.values(groupedByLikeId);
        this.groupedCompletedReviews=[];
        for (const group of groupedCompletedReviews) {
          if((group.length == 2) && (group[0].payment === 'done' && group[1].payment === 'done')) {
            this.groupedCompletedReviews.push(group);
          }
        }
      }
    } catch (error) {
    }
  }
  navigateToPendingPayment() {
    // Implement navigation logic for pending payment
    console.log('Navigating to pending payment');
  }
  navigateToCompletedPayment() {
    // Implement navigation logic for completed payment
    console.log('Navigating to completed payment');
  }

  releasePayment(reviewGroup: any[]) {
    if (reviewGroup.length >= 2) {
      const review1 = reviewGroup[0];
      const review2 = reviewGroup[1];
      this.updateUser(review1.toUserId, review1.rating);
      this.updateUser(review2.toUserId, review2.rating);
      this.updateCharacter(review1.toChrId, review1.rating);
      this.updateCharacter(review2.toChrId, review2.rating);
      // Update reviews to mark payment as done
      this.updateReview(review1.id);
      this.updateReview(review2.id);
      
      // Update likes status to done for both directions
      this.updateLikesForReview(review1);
      this.updateLikesForReview(review2);
      
      // Optionally, remove from groupedReviews or mark as completed
      this.groupedReviews = this.groupedReviews.filter(group => group !== reviewGroup);
    }
  }

  async updateUser(userId: string, rating: string) {
    const userRef = doc(this.firestore, 'users', userId);
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        const currentAvg = data['avgRating'] || 0;
        const currentPlays = data['totalPlays'] || 0;
        const newPlays = currentPlays + 1;
        const newAvg = ((currentAvg * currentPlays) + parseFloat(rating)) / newPlays;
        const walletIncrement = parseFloat(rating) * 100;
        const newWallet = (data['wallet'] || 0) + walletIncrement;
        await updateDoc(userRef, {
          avgRating: newAvg,
          totalPlays: newPlays,
          wallet: newWallet
        });
        console.log(`Updated user ${userId}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  async updateCharacter(charId: string, rating: string) {
    const charRef = doc(this.firestore, 'characters', charId);
    try {
      const charDoc = await getDoc(charRef);
      if (charDoc.exists()) {
        const data = charDoc.data();
        const currentAvg = data['avgRating'] || 0;
        const currentPlays = data['totalPlays'] || 0;
        const newPlays = currentPlays + 1;
        const newAvg = ((currentAvg * currentPlays) + parseFloat(rating)) / newPlays;
        await updateDoc(charRef, {
          avgRating: newAvg,
          totalPlays: newPlays
        });
        console.log(`Updated character ${charId}`);
      }
    } catch (error) {
      console.error('Error updating character:', error);
    }
  }

  async updateReview(reviewId: string) {
    const reviewRef = doc(this.firestore, 'reviews', reviewId);
    try {
      await updateDoc(reviewRef, {
        payment: 'done'
      });
      console.log(`Updated review ${reviewId} with payment: done`);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  }

  async updateLikesForReview(review: ReviewData) {
    try {
      if (!review.likeId) {
        console.warn('No likeId on review; skipping likes update', review);
        return;
      }
      const likeRef = doc(this.firestore, 'likes', review.likeId);
      const likeSnap = await getDoc(likeRef);
      if (!likeSnap.exists()) {
        console.warn(`Like doc not found for id ${review.likeId}`);
        return;
      }
      await updateDoc(likeRef, { status: 'done' });
      console.log(`Updated like ${review.likeId} status to done`);
    } catch (error) {
      console.error('Error updating like by id:', error);
    }
  }
}
