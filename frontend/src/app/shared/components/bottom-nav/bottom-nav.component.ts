import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bottom-nav">
      <div
        class="nav-item"
        [class.active]="active === 'home'"
        (click)="navigate.emit('home')"
      >
        <i class="fa-solid fa-house"></i>
        <span>Home</span>
      </div>
      <div
        class="nav-item"
        [class.active]="active === 'live-tv'"
        (click)="navigate.emit('live-tv')"
      >
        <i class="fa-solid fa-tower-broadcast"></i>
        <span>Live</span>
      </div>
      <div
        class="nav-item"
        [class.active]="active === 'movies'"
        (click)="navigate.emit('movies')"
      >
        <i class="fa-solid fa-film"></i>
        <span>Movies</span>
      </div>
      <div
        class="nav-item"
        [class.active]="active === 'search'"
        (click)="navigate.emit('search')"
      >
        <i class="fa-solid fa-magnifying-glass"></i>
        <span>Search</span>
      </div>
      <div
        class="nav-item"
        [class.active]="active === 'profile'"
        (click)="navigate.emit('profile')"
      >
        <i class="fa-solid fa-user"></i>
        <span>Profile</span>
      </div>
    </div>
  `,
  styles: [
    `
      .bottom-nav {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 64px;
        background: rgba(6, 6, 16, 0.98);
        border-top: 1px solid rgba(255, 255, 255, 0.07);
        z-index: 998;
        padding-bottom: env(safe-area-inset-bottom, 0px);

        @media (max-width: 1024px) {
          display: flex;
          align-items: center;
          justify-content: space-around;
        }
      }

      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 16px;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.4);
        transition: 0.2s;
        flex: 1;

        i {
          font-size: 20px;
        }
        span {
          font-size: 10px;
          font-weight: 500;
        }

        &.active {
          color: #ff2d55;
          i {
            transform: scale(1.1);
          }
        }
      }
    `,
  ],
})
export class BottomNavComponent {
  @Input() active = 'home';
  @Output() navigate = new EventEmitter<string>();
}
