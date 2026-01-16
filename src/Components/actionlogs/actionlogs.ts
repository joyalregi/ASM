import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Authservice } from '../../Services/authservice';
import { Attendanceservice } from '../../Services/api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-actionlogs',
  imports: [FormsModule],
  templateUrl: './actionlogs.html',
  styleUrl: './actionlogs.css',
})
export class Actionlogs {
  constructor(
    private api: Attendanceservice,
    private auth: Authservice,
    private snackBar: MatSnackBar
  ) {}
  startDate: any = '';
  endDate: any = '';
  logs: any[] = [];
  isLoading: boolean = false;
  hasSearched: boolean = false;

  generateLog() {
    // Validation: Both dates are required
    if (!this.startDate || !this.endDate) {
      this.showAlert('Please select both start date and end date');
      return;
    }

    // Validation: Start date should not be greater than end date
    if (new Date(this.startDate) > new Date(this.endDate)) {
      this.showAlert('Start date cannot be greater than end date');
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    this.logs = [];

    this.api.getLog(this.auth.getToken(), this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.logs = Array.isArray(data) ? data : [];
        console.log('Logs fetched:', this.logs);
        if (this.logs.length === 0) {
          this.showAlert('No logs found for the selected date range');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching logs:', err);
        this.showAlert(err.error?.message || 'Failed to load logs. Please try again.');
      },
    });
  }

  showAlert(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
