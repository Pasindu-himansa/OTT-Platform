import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class AdminSettingsComponent {
  activeTab = 'general';

  tabs = [
    { id: 'general', label: 'General Settings', icon: 'fa-gear' },
    { id: 'payment', label: 'Payment Gateways', icon: 'fa-credit-card' },
    { id: 'email', label: 'Email Templates', icon: 'fa-envelope' },
    { id: 'notifications', label: 'Notification Settings', icon: 'fa-bell' },
    { id: 'security', label: 'Security Settings', icon: 'fa-shield-halved' },
    { id: 'logs', label: 'System Logs', icon: 'fa-file-lines' },
    { id: 'backup', label: 'Backup & Restore', icon: 'fa-database' },
  ];

  // General Settings
  general = {
    appName: 'OTT TV',
    appUrl: 'http://localhost',
    supportEmail: 'support@otttv.com',
    timezone: 'UTC',
    currency: 'USD',
    trialDays: 7,
    maintenanceMode: false,
  };

  email = {
    fromName: 'OTT TV',
    fromEmail: 'noreply@otttv.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
  };

  // Payment Gateways
  payment = {
    stripeEnabled: false,
    stripeKey: '',
    paypalEnabled: false,
    paypalClientId: '',
    razorpayEnabled: false,
    razorpayKey: '',
  };

  // Email Settings

  // Notification Settings
  notifications = {
    newUserEmail: true,
    subscriptionEmail: true,
    paymentEmail: true,
    newContentPush: true,
    maintenancePush: false,
  };

  // Security Settings
  security = {
    twoFactorAuth: false,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
  };

  // System Logs
  logs = [
    {
      time: '2026-09-21 10:00',
      level: 'INFO',
      message: 'Server started successfully',
    },
    {
      time: '2026-09-21 10:01',
      level: 'INFO',
      message: 'Database connection established',
    },
    {
      time: '2026-09-21 10:15',
      level: 'INFO',
      message: 'New user registered: test@example.com',
    },
    {
      time: '2026-09-21 10:30',
      level: 'WARN',
      message: 'Failed login attempt from IP: 192.168.1.100',
    },
    {
      time: '2026-09-21 11:00',
      level: 'INFO',
      message: 'Subscription created for user ID: abc123',
    },
    {
      time: '2026-09-21 11:30',
      level: 'ERROR',
      message: 'Payment gateway timeout - retrying...',
    },
    {
      time: '2026-09-21 12:00',
      level: 'INFO',
      message: 'Cache cleared successfully',
    },
    {
      time: '2026-09-21 12:30',
      level: 'INFO',
      message: 'Email sent to: user@example.com',
    },
  ];

  saveSuccess = '';

  save(section: string): void {
    this.saveSuccess = `${section} saved successfully!`;
    setTimeout(() => (this.saveSuccess = ''), 3000);
  }

  clearLogs(): void {
    this.logs = [];
  }
}
