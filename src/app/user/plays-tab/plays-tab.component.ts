import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore';

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
  selector: 'app-plays-tab',
  templateUrl: './plays-tab.component.html',
  styleUrls: ['./plays-tab.component.scss']
})
export class PlaysTabComponent implements OnInit {
  tabs = ['active', 'inbox', 'completed'];
  isAdmin = false;

  active: any[] = [];

  inbox: any[] = [];

  completed = [
    { id: 1, image: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80', name: 'Completed User 1', coins: 500 }
  ];

  constructor(private firestore: Firestore) { }

  async ngOnInit() {
    this.isAdmin = this.checkIsAdmin();
    if (this.isAdmin) {
      this.tabs = ['active', 'completed'];
      await this.loadActiveDataAdmin();
      await this.loadCompletedDataAdmin();
    } else {
      await this.loadActiveData();
      await this.loadInboxData();
    }
  }

  checkIsAdmin(): boolean {
    try {
      const currentUserString = localStorage.getItem('currentUser');
      if (!currentUserString) return false;
      const currentUser = JSON.parse(currentUserString);
      return currentUser?.role === 'admin';
    } catch {
      return false;
    }
  }

  async loadInboxData() {
    try {
      // Get current user from localStorage
      const currentUserString = localStorage.getItem('currentUser');
      if (!currentUserString) {
        console.error('No current user found');
        return;
      }

      const currentUser = JSON.parse(currentUserString);

      // Query likes collection where toUserId matches current user and status is pending
      const likesQuery = query(
        collection(this.firestore, 'likes'),
        where('toUserId', '==', currentUser.id),
        where('status', '==', 'pending')
      );

      const likesSnapshot = await getDocs(likesQuery);
      const likesData: LikeData[] = likesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LikeData));

      // Transform likes data to match TabData interface
      this.inbox = await Promise.all(likesData.map(async (like, index) => {
        // Use character IDs directly (they are already Firestore document IDs)
        const fromCharDocId = like.fromChrId;
        const toCharDocId = like.toChrId;

        // Fetch character names
        let fromCharName = like.fromChrId; // fallback to ID if fetch fails
        let toCharName = like.toChrId; // fallback to ID if fetch fails

        try {
          // Fetch from character name
          let fromDoc = await getDoc(doc(this.firestore, 'characters', fromCharDocId));
          if (!fromDoc.exists()) {
            fromDoc = await getDoc(doc(this.firestore, 'pending-characters', fromCharDocId));
          }
          if (fromDoc.exists()) {
            fromCharName = fromDoc.data()['name'] || like.fromChrId;
          }

          // Fetch to character name
          let toDoc = await getDoc(doc(this.firestore, 'characters', toCharDocId));
          if (!toDoc.exists()) {
            toDoc = await getDoc(doc(this.firestore, 'pending-characters', toCharDocId));
          }
          if (toDoc.exists()) {
            toCharName = toDoc.data()['name'] || like.toChrId;
          }
        } catch (error) {
          console.error('Error fetching character names:', error);
          // Keep using IDs as fallback
        }

        return {
          id: index + 1,
          image: 'https://image.similarpng.com/file/similarpng/very-thumbnail/2020/07/Love-icons-social-media-vector-PNG.png',
          name: `${fromCharName} liked your character: ${toCharName}`,
          coins: like.price,
          fromChrId: like.fromChrId,
          toChrId: like.toChrId,
          typeOfPlay: like.typeOfPlay,
          status: like.status
        };
      }));
      console.log(this.inbox,'inbox');
      

    } catch (error) {
      console.error('Error fetching inbox data:', error);
      this.inbox = [];
    }
  }
  async loadActiveData() {
    try {
      const currentUserString = localStorage.getItem('currentUser');
      if (!currentUserString) {
        console.error('No current user found');
        return;
      }

      const currentUser = JSON.parse(currentUserString);

      const receivedLikesQuery = query(
        collection(this.firestore, 'likes'),
        where('toUserId', '==', currentUser.id),
        where('status', '==', 'accepted')
      );
      const sentLikesQuery = query(
        collection(this.firestore, 'likes'),
        where('fromUserId', '==', currentUser.id),
        where('status', '==', 'accepted')
      );

      const [receivedSnap, sentSnap] = await Promise.all([
        getDocs(receivedLikesQuery),
        getDocs(sentLikesQuery),
      ]);

      const likes: LikeData[] = [
        ...receivedSnap.docs.map(d => ({ id: d.id, ...d.data() } as LikeData)),
        ...sentSnap.docs.map(d => ({ id: d.id, ...d.data() } as LikeData)),
      ];
      console.log(likes,'likes');
      this.active = await Promise.all(likes.map(async (like, index) => {
        // Use character IDs directly (they are already Firestore document IDs)
        const fromCharDocId = like.fromChrId;
        const toCharDocId = like.toChrId;

        // Fetch character names
        let fromCharName = like.fromChrId; // fallback to ID if fetch fails
        let toCharName = like.toChrId; // fallback to ID if fetch fails

        try {
          // Fetch from character name
          let fromDoc = await getDoc(doc(this.firestore, 'characters', fromCharDocId));
          if (!fromDoc.exists()) {
            fromDoc = await getDoc(doc(this.firestore, 'pending-characters', fromCharDocId));
          }
          if (fromDoc.exists()) {
            fromCharName = fromDoc.data()['name'] || like.fromChrId;
          }

          // Fetch to character name
          let toDoc = await getDoc(doc(this.firestore, 'characters', toCharDocId));
          if (!toDoc.exists()) {
            toDoc = await getDoc(doc(this.firestore, 'pending-characters', toCharDocId));
          }
          if (toDoc.exists()) {
            toCharName = toDoc.data()['name'] || like.toChrId;
          }
        } catch (error) {
          console.error('Error fetching character names:', error);
          // Keep using IDs as fallback
        }

        return {
          id: index + 1,
          image: 'https://image.similarpng.com/file/similarpng/very-thumbnail/2020/07/Love-icons-social-media-vector-PNG.png',
          name: `${fromCharName} ❤️ ${toCharName}`,
          coins: like.price,
          fromChrId: like.fromChrId,
          toChrId: like.toChrId,
          fromUserId: like.fromUserId,
          toUserId: like.toUserId,
          typeOfPlay: like.typeOfPlay,
          status: like.status
        };
      }));
      this.filterDuplicateActive(this.active);
      

    } catch (error) {
      console.error('Error fetching active data:', error);
      this.active = [];
    }
  }

  async loadActiveDataAdmin() {
    try {
      const acceptedLikesQuery = query(
        collection(this.firestore, 'likes'),
        where('status', '==', 'accepted')
      );

      const acceptedSnap = await getDocs(acceptedLikesQuery);
      const likes: LikeData[] = acceptedSnap.docs.map(d => ({ id: d.id, ...d.data() } as LikeData));

      this.active = await Promise.all(likes.map(async (like, index) => {
        const fromCharDocId = like.fromChrId;
        const toCharDocId = like.toChrId;

        let fromCharName = like.fromChrId;
        let toCharName = like.toChrId;

        try {
          let fromDoc = await getDoc(doc(this.firestore, 'characters', fromCharDocId));
          if (!fromDoc.exists()) {
            fromDoc = await getDoc(doc(this.firestore, 'pending-characters', fromCharDocId));
          }
          if (fromDoc.exists()) {
            fromCharName = fromDoc.data()['name'] || like.fromChrId;
          }

          let toDoc = await getDoc(doc(this.firestore, 'characters', toCharDocId));
          if (!toDoc.exists()) {
            toDoc = await getDoc(doc(this.firestore, 'pending-characters', toCharDocId));
          }
          if (toDoc.exists()) {
            toCharName = toDoc.data()['name'] || like.toChrId;
          }
        } catch (error) {
          console.error('Error fetching character names (admin active):', error);
        }

        return {
          id: index + 1,
          image: 'https://image.similarpng.com/file/similarpng/very-thumbnail/2020/07/Love-icons-social-media-vector-PNG.png',
          name: `${fromCharName} ❤️ ${toCharName}`,
          coins: like.price,
          fromChrId: like.fromChrId,
          toChrId: like.toChrId,
          fromUserId: like.fromUserId,
          toUserId: like.toUserId,
          typeOfPlay: like.typeOfPlay,
          status: like.status
        };
      }));

      this.filterDuplicateActive(this.active);
    } catch (error) {
      console.error('Error fetching admin active data:', error);
      this.active = [];
    }
  }

  async loadCompletedDataAdmin() {
    try {
      const doneLikesQuery = query(
        collection(this.firestore, 'likes'),
        where('status', '==', 'done')
      );
      const doneSnap = await getDocs(doneLikesQuery);
      const likes: LikeData[] = doneSnap.docs.map(d => ({ id: d.id, ...d.data() } as LikeData));

      this.completed = await Promise.all(likes.map(async (like, index) => {
        const fromCharDocId = like.fromChrId;
        const toCharDocId = like.toChrId;

        let fromCharName = like.fromChrId;
        let toCharName = like.toChrId;

        try {
          let fromDoc = await getDoc(doc(this.firestore, 'characters', fromCharDocId));
          if (!fromDoc.exists()) {
            fromDoc = await getDoc(doc(this.firestore, 'pending-characters', fromCharDocId));
          }
          if (fromDoc.exists()) {
            fromCharName = fromDoc.data()['name'] || like.fromChrId;
          }

          let toDoc = await getDoc(doc(this.firestore, 'characters', toCharDocId));
          if (!toDoc.exists()) {
            toDoc = await getDoc(doc(this.firestore, 'pending-characters', toCharDocId));
          }
          if (toDoc.exists()) {
            toCharName = toDoc.data()['name'] || like.toChrId;
          }
        } catch (error) {
          console.error('Error fetching character names (admin completed):', error);
        }

        return {
          id: index + 1,
          image: 'https://image.similarpng.com/file/similarpng/very-thumbnail/2020/07/Love-icons-social-media-vector-PNG.png',
          name: `${fromCharName} ❤️ ${toCharName}`,
          coins: like.price,
          fromChrId: like.fromChrId,
          toChrId: like.toChrId,
          fromUserId: like.fromUserId,
          toUserId: like.toUserId,
          typeOfPlay: like.typeOfPlay,
          status: like.status
        };
      }));
    } catch (error) {
      console.error('Error fetching admin completed data:', error);
      this.completed = [];
    }
  }
  filterDuplicateActive(activeData: any[]) {
    const likesList:any[] = [];

    for (const like of activeData) {
      const isDuplicate = likesList.some(existingLike =>
        (existingLike.fromChrId === like.fromChrId && existingLike.toChrId === like.toChrId) ||
        (existingLike.fromChrId === like.toChrId && existingLike.toChrId === like.fromChrId)
      );

      if (!isDuplicate) {
        likesList.push(like);
      }
    }
    this.active = likesList;
    console.log(likesList,'filterered list');
    
  }
}
