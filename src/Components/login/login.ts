import { Component } from '@angular/core';
import { Attendanceservice } from '../../Services/api';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  showForgotPassword: boolean = false;
  forgotPasswordEmail: string = '';
  isLoading: boolean = false;

  constructor(
    private attendanceService: Attendanceservice,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  toggleForgotPassword(event: Event) {
    event.preventDefault();
    this.showForgotPassword = !this.showForgotPassword;
    if (!this.showForgotPassword) {
      this.forgotPasswordEmail = '';
    }
  }

  submitForgotPassword() {
    if (!this.forgotPasswordEmail || this.forgotPasswordEmail.trim() === '') {
      this.showAlert('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.forgotPasswordEmail.trim())) {
      this.showAlert('Please enter a valid email address');
      return;
    }

    this.isLoading = true;
    this.attendanceService.forgotPassword(this.forgotPasswordEmail.trim()).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.showAlert(data.message || 'Password reset email sent. Please check your inbox.');
        this.showForgotPassword = false;
        this.forgotPasswordEmail = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlert(err.error?.message || 'Failed to send password reset email. Please try again.');
      },
    });
  }

  login() {
    if (this.email == '' || this.password == '') {
      this.showAlert('Please fill Both Email and Password');
    } else {
      this.attendanceService.login({ email: this.email, password: this.password }).subscribe({
        next: (data) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.user.id);
          this.showAlert(data.message);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.showAlert(err.error.message);
        },
      });
    }
  }

  handleSignUp(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showAlert('Sign up functionality coming soon!');
    // You can add navigation to sign up page here
    // this.router.navigate(['/signup']);
  }

  showInfo() {
    this.showAlert('Attendo - Your modern attendance management system. Sign in with your credentials to access the dashboard.');
  }

  showAlert(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
