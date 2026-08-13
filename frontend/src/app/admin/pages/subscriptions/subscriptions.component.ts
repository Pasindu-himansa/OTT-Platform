import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  private API = 'http://localhost/api/v1';
  subscriptions: any[] = [];
  payments: any[] = [];
  activeTab = 'subscriptions';
  loading = true;
  total = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSubscriptions();
    this.loadPayments();
  }

  loadSubscriptions(): void {
    this.http.get<any>(`${this.API}/subscriptions?limit=20`).subscribe({
      next: (res) => {
        this.subscriptions = res.data.subscriptions;
        this.total = res.data.pagination.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadPayments(): void {
    this.http.get<any>(`${this.API}/payments?limit=20`).subscribe({
      next: (res) => {
        this.payments = res.data.payments;
      },
      error: () => {},
    });
  }
}
