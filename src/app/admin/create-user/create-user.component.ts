import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private firestore: Firestore) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      loginId: ['', Validators.required],
      name: ['', Validators.required],
      profileLink: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.userForm.valid) {
      try {
        const userData = {
          loginId: this.userForm.value.loginId,
          name: this.userForm.value.name,
          profileLink: this.userForm.value.profileLink,
          avgRating: "0.0",
          chrCount: 0,
          createdAt: new Date(),
          isActive: true,
          totalEarnings: 0,
          totalPlays: 0,
          totalSpent: 0,
          wallet: 1000
        };

        await addDoc(collection(this.firestore, 'users'), userData);
        console.log('Form value:', this.userForm.value);
        alert('User created successfully!');
        this.router.navigate(['/admin/manage-users']);
      } catch (error) {
        console.error('Error creating user:', error);
        alert('Error creating user. Please try again.');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  }

  cancel() {
    this.router.navigate(['/shield_person']);
  }
}
