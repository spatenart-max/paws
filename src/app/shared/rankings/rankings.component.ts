import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss']
})
export class RankingsComponent implements OnInit {
  rankingTabs: string[] = ['Top rating'];
  selectedTab: string = this.rankingTabs[0];

  topRatedRankingData: Array<any> = [];

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      const usersCol = collection(this.firestore, 'users');
      const usersSnap = await getDocs(usersCol);
      const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      users.sort((a: any, b: any) => (b.avgRating || 0) - (a.avgRating || 0));
      this.topRatedRankingData = users.slice(0, 5);
      console.log('Top rated users:', this.topRatedRankingData);
    } catch (err) {
      console.error('Error loading users for rankings', err);
    }
  }
}
