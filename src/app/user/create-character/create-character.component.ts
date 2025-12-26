import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDoc } from '@angular/fire/firestore';
import { UserAccount } from 'src/app/models/userprofiles';

@Component({
  selector: 'app-create-character',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.scss']
})
export class CreateCharacterComponent implements OnInit{
  defaultDatePrice = 200;
  chrForm!: FormGroup;
  interests: string[] = [];
  interestInput = '';
  showSaveBox=false;
  constructor(private fb: FormBuilder , private router:Router, private firestore: Firestore) { }
  ngOnInit(): void {
      this.chrForm = this.fb.group({
      name: ['', Validators.required],
      gender: [''],
      age: ['', Validators.required],
      job: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      playStyle: ['', Validators.required],
      about: ['', Validators.required],
      interests: ['', Validators.required]
    })
  }
  addInterest() {
    if (this.interests.length < 5 && this.interestInput.length >=2) {
      this.interests.push(this.interestInput);
      this.interestInput=''
      this.chrForm.get('interests')?.setValue(this.interests);
    }
  }
  save(){
    this.showSaveBox = true;
  }
  cancel(){
    this.showSaveBox = false;

  }
  async confirmSave(){
    console.log('Form value:', this.chrForm.value);
    const currentUserString = localStorage.getItem('currentUser');
    let owneruserid = '';
    let profileLink = '';
    if (currentUserString !== null && currentUserString !== undefined && currentUserString !== '') {
      const myProfile: UserAccount = JSON.parse(currentUserString);
      owneruserid = myProfile.id.toString();
      // Fetch user's profileLink
      const userDocRef = doc(this.firestore, 'users', owneruserid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        profileLink = userDoc.data()['profileLink'] || '';
      }
    }
    try {
      const docRef = await addDoc(collection(this.firestore, 'pending-characters'), {
        ...this.chrForm.value,
        status: 'pending',
        owneruserid: owneruserid,
        profileLink: profileLink,
        datePrice:this.defaultDatePrice,
        createdAt: new Date()
      });
      console.log('Character saved with ID: ', docRef.id);
      this.router.navigate(['/award_star']);
    } catch (error) {
      console.error('Error saving character: ', error);
    }
  }
  confirmCancel(){
    this.showSaveBox = false;
  }
  closeSaveBox(){
    this.showSaveBox = false;
  }
}
