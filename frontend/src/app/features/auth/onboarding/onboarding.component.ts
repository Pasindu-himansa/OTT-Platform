import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, NgFor, RouterLink],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent {
  current = 0;
  animating = false;

  slides = [
    {
      icon: 'fa-tv',
      color: 'linear-gradient(135deg,#1a0a3e,#2d1b69)',
      iconColor: '#a78bfa',
      title: 'Unlimited Entertainment',
      desc: 'Access thousands of live TV channels, movies, and shows from around the world. All in stunning HD quality.',
    },
    {
      icon: 'fa-globe',
      color: 'linear-gradient(135deg,#1a2e0a,#3d6b2d)',
      iconColor: '#86efac',
      title: 'Watch Anywhere',
      desc: 'Stream on your phone, tablet, computer, or smart TV. Your entertainment follows you wherever you go.',
    },
    {
      icon: 'fa-download',
      color: 'linear-gradient(135deg,#2e0a1a,#6b2d3d)',
      iconColor: '#fca5a5',
      title: 'Download & Go',
      desc: "Save your favorite content offline. Perfect for travel or when you're away from Wi-Fi.",
    },
  ];

  constructor(private router: Router) {}

  next(): void {
    if (this.animating) return;
    if (this.current < this.slides.length - 1) {
      this.animating = true;
      setTimeout(() => {
        this.current++;
        this.animating = false;
      }, 300);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  skip(): void {
    this.router.navigate(['/auth/login']);
  }
  goTo(i: number): void {
    this.current = i;
  }
}
