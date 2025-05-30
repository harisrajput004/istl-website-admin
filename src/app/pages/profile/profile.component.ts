import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faEye } from '@fortawesome/free-solid-svg-icons';
import { ProfileService } from '../../services/profile/profile.service';
import { filter, first, firstValueFrom, take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faEye = faEye;
  user: any;
  isLoading: boolean = true;
  userId: number = 2;
  isEditing: boolean = false
  formData = {
    firstName: '',
    lastName: ''
  };

  constructor(private profileService: ProfileService, private authService: AuthService) { }

  ngOnInit(): void {
    // First check synchronously if we already have a user ID
    const immediateUserId = this.authService.getUserId();
    if (immediateUserId) {
      this.loadProfile(immediateUserId);
      return;
    }

    // Fallback to observable if not available yet
    const sub = this.authService.userId$.pipe(
      filter(userId => userId !== null),
      take(1)
    ).subscribe({
      next: (userId) => {
        if (userId) {
          this.loadProfile(userId);
        } else {
          this.handleNoUserId();
        }
        sub.unsubscribe();
      },
      error: (err) => {
        this.handleUserIdError(err);
        sub.unsubscribe();
      }
    });
  }

  private handleNoUserId(): void {
    this.isLoading = false;
    console.error('No user ID available');
    // Optionally redirect to login
  }

  private handleUserIdError(err: any): void {
    this.isLoading = false;
    console.error('Error getting user ID:', err);
  }

  loadProfile(userId: number): void {
    this.profileService.getById(userId).subscribe({
      next: (response) => {
        this.user = response?.data;
        this.formData.firstName = this.user?.firstName || '';
        this.formData.lastName = this.user?.lastName || '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.isLoading = false;
      }
    });
  }

  updateProfile(): void {
    const updatedUser = {
      ...this.user,
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
    };

    this.profileService.updateProfile(this.formData.firstName, this.formData.lastName).subscribe({
      next: (res) => {
        this.user.firstName = this.formData.firstName;
        this.user.lastName = this.formData.lastName;
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }
}
