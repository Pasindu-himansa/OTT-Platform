import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input() activeSection = 'home';
  @Output() menuToggled = new EventEmitter<void>();
  @Output() sectionChanged = new EventEmitter<string>();
  searchQuery = '';

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.sectionChanged.emit('search');
    }
  }
}
