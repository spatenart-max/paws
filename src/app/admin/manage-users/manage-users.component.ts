import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';

interface User {
  id: string;
  loginId: string;
  name: string;
  avgRating: string;
  chrCount: number;
  createdAt: any;
  isActive: boolean;
  totalEarnings: number;
  totalPlays: number;
  totalSpent: number;
  wallet: number;
}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  selectedTab: string = 'active';
  activeUsers: User[] = [];
  inactiveUsers: User[] = [];
  tabs: string[] = ['active', 'inactive'];
  loading: boolean = true;

  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  async loadUsers(): Promise<void> {
    try {
      this.loading = true;

      // Load active users
      const activeQuery = query(collection(this.firestore, 'users'), where('isActive', '==', true));
      const activeSnapshot = await getDocs(activeQuery);
      this.activeUsers = activeSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));

      // Load inactive users
      const inactiveQuery = query(collection(this.firestore, 'users'), where('isActive', '==', false));
      const inactiveSnapshot = await getDocs(inactiveQuery);
      this.inactiveUsers = inactiveSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));

    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      this.loading = false;
    }
  }

  getCurrentUsers(): User[] {
    return this.selectedTab === 'active' ? this.activeUsers : this.inactiveUsers;
  }

  async toggleUserStatus(user: User): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', user.id);
      await updateDoc(userRef, {
        isActive: !user.isActive
      });
      // Reload users to reflect the change
      await this.loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  }

  async deleteUser(user: User): Promise<void> {
    if (confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
      try {
        const userRef = doc(this.firestore, 'users', user.id);
        await deleteDoc(userRef);
        // Reload users to reflect the change
        await this.loadUsers();
        alert('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  }
}
