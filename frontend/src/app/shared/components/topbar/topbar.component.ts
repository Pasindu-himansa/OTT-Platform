import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopbarComponent {
  @Input() activeSection = 'home';
  @Input() unreadCount = 0;
  @Input() canGoBack = false;
  @Output() menuToggled = new EventEmitter<void>();
  @Output() sectionChanged = new EventEmitter<string>();
  @Output() backClicked = new EventEmitter<void>();
  @Input() profilePicUrl = '';
  searchQuery = '';

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.sectionChanged.emit('search');
    }
  }
}
