import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, query, where } from '@angular/fire/firestore';
import { UserProfile } from '../models/userprofiles';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  constructor(private firestore: Firestore) { }

  async getActiveProfiles(): Promise<UserProfile[]> {
    try {
      // Get current user from localStorage
      const currentUserString = localStorage.getItem('currentUser');
      let currentUserId: string | null = null;

      if (currentUserString) {
        const currentUser = JSON.parse(currentUserString);
        currentUserId = currentUser.id;
      }

      // Query for all active characters (Firestore doesn't support multiple != conditions)
      const q = query(collection(this.firestore, 'characters'), where('status', '!=', 'banned'));
      const querySnapshot = await getDocs(q);

      // Filter out characters owned by current user
      const profiles: UserProfile[] = querySnapshot.docs
        .map((doc, index) => {
          const data = doc.data();
          return {
            id: doc.id, // Use Firestore document ID instead of sequential index
            name: data['name'] || '',
            age: data['age'] || 0,
            gender: data['gender'] || 'others',
            grade: 1, // Default grade
            playStyle: data['playStyle'] || 'Casual',
            job: data['job'] || '',
            maritalStatus: data['maritalStatus'] || 'Single',
            about: data['about'] || '',
            interests: data['interests'] || [],
            rate: data['datePrice'] || 0, // Default rate
            imgUrl: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80", // Default image
            ownerid: data['owneruserid'] || '' // Include owner ID for filtering
          };
        })
        .filter(profile => {
          // If we have current user ID, exclude characters owned by current user
          if (currentUserId) {
            return profile.ownerid !== currentUserId;
          }
          return true; // If no current user, include all (fallback)
        });

      return profiles;
    } catch (error) {
      console.error('Error fetching active profiles:', error);
      return [];
    }
  }
  getProfileByID(id: string) { // Changed from number to string to match Firestore document IDs
    // This method might need updating too, but for now keep as is
    return null; // Since we don't have the hardcoded data anymore
  }
  
}
