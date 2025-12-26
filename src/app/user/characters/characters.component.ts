import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, query, where } from '@angular/fire/firestore';
import { UserAccount } from 'src/app/models/userprofiles';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  tabs = ['active', 'pending', "banned"];
  defaultCoins = 200;
  currentUserId: string = '';

  activeCharacters: any[] = [];

  pendingCharacters: any[] = [];

  bannedCharacters: any[] = [];

  completed = [
    { id: 1, image: 'https://www.livehindustan.com/lh-img/smart/img/2025/08/06/1200x900/Anupama_6_August_1754472345963_1754472350625.jpg', name: 'Completed User 1', coins: 500 }
  ];
  constructor(private fb: FormBuilder, private router: Router, private firestore: Firestore) { }

  async ngOnInit() {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString !== null && currentUserString !== undefined && currentUserString !== '') {
      const myProfile: UserAccount = JSON.parse(currentUserString);
      this.currentUserId = myProfile.id.toString();
      console.log(this.currentUserId);
      if (!this.isAdmin(this.currentUserId)) {
        await this.loadActiveCharacters();
        await this.loadPendingCharacters();
        await this.loadBannedCharacters();
      }else{
        await this.loadAllActiveCharacters();
        await this.loadAllPendingCharacters();
        await this.loadAllBannedCharacters();
      }
    }
  }
  isAdmin(id: string): boolean {
    return id.toLowerCase().includes('admin');
  }
  async loadActiveCharacters() {
      try {
        const q = query(collection(this.firestore, 'characters'),
          where('owneruserid', '==', this.currentUserId));
        const querySnapshot = await getDocs(q);
        this.activeCharacters = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            name: doc.data()['name'],
            age: doc.data()['age'],
            job: doc.data()['job'],
            image: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80',
            coins: doc.data()['datePrice'] || 0,
            status: doc.data()['status']
          }))
          .filter(char => char.status !== 'banned'); // Client-side filter for status
      } catch (error) {
        console.error('Error fetching active characters:', error);
      }
    }

  async loadPendingCharacters() {
      try {
        const q = query(collection(this.firestore, 'pending-characters'), where('owneruserid', '==', this.currentUserId));
        const querySnapshot = await getDocs(q);
        this.pendingCharacters = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data()['name'],
          age: doc.data()['age'],
          job: doc.data()['job'],
          image: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80',
          coins: doc.data()['datePrice'] || this.defaultCoins
        }));
        console.log(this.pendingCharacters,'pending');
        
      } catch (error) {
        console.error('Error fetching pending characters:', error);
      }
    }
  async loadBannedCharacters() {
      try {
        const q = query(collection(this.firestore, 'characters'),
          where('owneruserid', '==', this.currentUserId),
          where('status', '==', 'banned'));
        const querySnapshot = await getDocs(q);
        this.bannedCharacters = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data()['name'],
          age: doc.data()['age'],
          job: doc.data()['job'],
          image: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80',
          coins: doc.data()['datePrice'] || 0
        }));
      } catch (error) {
        console.error('Error fetching banned characters:', error);
      }
    }
  async loadAllActiveCharacters() {
      try {
        const q = query(collection(this.firestore, 'characters'),
          where('status', '!=', 'banned'));
        const querySnapshot = await getDocs(q);
        this.activeCharacters = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data()['name'],
          age: doc.data()['age'],
          job: doc.data()['job'],
          image: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80',
          coins: doc.data()['datePrice'] || 0
        }));
      } catch (error) {
        console.error('Error fetching active characters:', error);
      }
    }

  async loadAllPendingCharacters() {
      try {
        const q = query(collection(this.firestore, 'pending-characters'));
        const querySnapshot = await getDocs(q);
        this.pendingCharacters = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data()['name'],
          age: doc.data()['age'],
          job: doc.data()['job'],
          image: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80',
          coins: this.defaultCoins
        }));
      } catch (error) {
        console.error('Error fetching pending characters:', error);
      }
    }
  async loadAllBannedCharacters() {
      try {
        const q = query(collection(this.firestore, 'characters'),
          where('status', '==', 'banned'));
        const querySnapshot = await getDocs(q);
        this.bannedCharacters = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data()['name'],
          age: doc.data()['age'],
          job: doc.data()['job'],
          image: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80',
          coins: doc.data()['datePrice'] || 0
        }));
      } catch (error) {
        console.error('Error fetching banned characters:', error);
      }
    }
    createNewChr() {
      this.router.navigate(['/newChr'])
    }
  }
