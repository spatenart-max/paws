import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addDoc, Firestore } from '@angular/fire/firestore';
import { collection, getDocs, deleteDoc, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  constructor(private firestore: Firestore, private router: Router) { }

  navigateToCreateUser() {
    this.router.navigate(['/admin/create-user']);
  }

  navigateToManageUsers() {
    this.router.navigate(['/admin/manage-users']);
  }

  async deleteAllActiveCharacters() {
    if (confirm('Are you sure you want to delete all active characters? This action cannot be undone.')) {
      try {
        const querySnapshot = await getDocs(collection(this.firestore, 'characters'));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        alert('All active characters have been deleted successfully.');
      } catch (error) {
        console.error('Error deleting active characters:', error);
        alert('Error deleting active characters. Please try again.');
      }
    }
  }

  async deleteAllPendingCharacters() {
    if (confirm('Are you sure you want to delete all pending characters? This action cannot be undone.')) {
      try {
        const querySnapshot = await getDocs(collection(this.firestore, 'pending-characters'));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        alert('All pending characters have been deleted successfully.');
      } catch (error) {
        console.error('Error deleting pending characters:', error);
        alert('Error deleting pending characters. Please try again.');
      }
    }
  }

  async deleteAllLikes() {
    if (confirm('Are you sure you want to delete all likes? This action cannot be undone.')) {
      try {
        const querySnapshot = await getDocs(collection(this.firestore, 'likes'));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        alert('All likes have been deleted successfully.');
      } catch (error) {
        console.error('Error deleting likes:', error);
        alert('Error deleting likes. Please try again.');
      }
    }
  }

  async approveAllPendingCharacters() {
    if (confirm('Are you sure you want to approve all pending characters?')) {
      try {
        const querySnapshot = await getDocs(collection(this.firestore, 'pending-characters'));
        const approvePromises = querySnapshot.docs.map(async (document) => {
          const charData = { ...document.data(), status: 'active' };
          await addDoc(collection(this.firestore, 'characters'), charData);
          await deleteDoc(doc(this.firestore, 'pending-characters', document.id));
        });
        await Promise.all(approvePromises);
        alert('All pending characters have been approved successfully.');
      } catch (error) {
        console.error('Error approving pending characters:', error);
        alert('Error approving pending characters. Please try again.');
      }
    }
  }
}
