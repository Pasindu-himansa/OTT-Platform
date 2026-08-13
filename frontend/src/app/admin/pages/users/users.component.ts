import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  private API = 'http://localhost/api/v1';
  users: any[] = [];
  loading = true;
  searchQuery = '';
  page = 1;
  total = 0;
  limit = 10;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.http
      .get<any>(`${this.API}/users?page=${this.page}&limit=${this.limit}`)
      .subscribe({
        next: (res) => {
          this.users = res.data.users;
          this.total = res.data.pagination.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  toggleStatus(user: any): void {
    this.http
      .put(`${this.API}/users/${user.id}/status`, { isActive: !user.isActive })
      .subscribe({
        next: () => {
          user.isActive = !user.isActive;
        },
        error: () => {},
      });
  }

  get filteredUsers(): any[] {
    const q = this.searchQuery.toLowerCase();
    return q
      ? this.users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        )
      : this.users;
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }
  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }
  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }
}
