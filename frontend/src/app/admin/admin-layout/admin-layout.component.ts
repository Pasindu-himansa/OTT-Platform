import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  sidebarOpen = false;

  navItems = [
    { label: 'Dashboard', icon: 'fa-chart-line', path: 'dashboard' },
    { label: 'Users', icon: 'fa-users', path: 'users' },
    { label: 'Content', icon: 'fa-film', path: 'content' },
    { label: 'Subscriptions', icon: 'fa-crown', path: 'subscriptions' },
    { label: 'Analytics', icon: 'fa-chart-pie', path: 'analytics' },
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  exitAdmin(): void {
    this.router.navigate(['/home']);
  }
  logout(): void {
    this.authService.logout();
  }
}
