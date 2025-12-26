import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private jsonUrl_Users = 'assets/data/users.json';
   constructor(private firestore: Firestore) {}

   async loginWithLoginId(loginId: string) {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('loginId', '==', loginId));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('User not found');
    }

    const userDoc = snapshot.docs[0];

    const user = {
      id: userDoc.id,          // 🔑 USER ID
      ...userDoc.data()
    };

    // Store for future use
    localStorage.setItem('currentUser', JSON.stringify(user));

    return user;
  }

  async loginForAdmin(loginId: string) {
    const adminRef = collection(this.firestore, 'admin');
    const q = query(adminRef, where('id', '==', loginId));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('Admin not found');
    }

    const adminDoc = snapshot.docs[0];

    const admin = {
      id: adminDoc.id,
      ...adminDoc.data()
    };

    // Store for future use
    localStorage.setItem('currentUser', JSON.stringify(admin));

    return admin;
  }
}
