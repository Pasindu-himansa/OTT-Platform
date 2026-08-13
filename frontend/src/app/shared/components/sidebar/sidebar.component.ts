import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Input() activeSection = 'home';
  @Output() closed = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  go(page: string): void {
    this.navigate.emit(page);
    this.closed.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}
