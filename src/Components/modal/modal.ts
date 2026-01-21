import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Attendanceservice } from '../../Services/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Authservice } from '../../Services/authservice';
import { Observable } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
@Component({
  selector: 'app-modal',
  imports: [FormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal implements OnChanges {
  @Output() close = new EventEmitter<void>();

  isLoading: boolean = false;
  isRegular: boolean = false;
  NewcheckOut: any = null;
  Newcheckin: any = null;
  actualCheckin: any = null;
  actualcheckout: any = null;
  selectedRole: string = '';
  roles: any[] = [];
  constructor(
    private api: Attendanceservice,
    private snackBar: MatSnackBar,
    private auth: Authservice,
  ) {}
  onClose() {
    console.log('Dysonnn');
    this.close.emit();
  }
  @Input() attendanceData: any = {};
  @Input() selected: String = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['attendanceData'] && this.attendanceData) {
      this.initializeData();
    }
  }

  ngOnInit() {
    this.initializeData();
    this.loadRoles();
  }

  /**
   * Normalize various date string shapes into a datetime-local value.
   * Accepts values like "2024-05-01T09:00:00Z" or "2024-05-01 09:00:00".
   */
  private toDatetimeLocal(raw: any): string | null {
    if (!raw) return null;
    const normalized = typeof raw === 'string' ? raw.replace(' ', 'T') : raw;
    const dt = new Date(normalized);
    if (isNaN(dt.getTime())) return null;
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    const hours = String(dt.getHours()).padStart(2, '0');
    const minutes = String(dt.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  initializeData() {
    console.log('Initializing modal with data:', this.attendanceData);
    // Reset values
    this.NewcheckOut = null;
    this.Newcheckin = null;
    this.actualCheckin = null;
    this.actualcheckout = null;
    this.selectedRole = '';

    if (this.attendanceData) {
      const logoutRaw =
        this.attendanceData.Logout_Time ||
        this.attendanceData.check_out ||
        this.attendanceData.actual_logout_time;
      const loginRaw =
        this.attendanceData.Login_Time ||
        this.attendanceData.check_in ||
        this.attendanceData.actual_login_time;

      this.NewcheckOut = this.toDatetimeLocal(logoutRaw);
      this.Newcheckin = this.toDatetimeLocal(loginRaw);
      this.actualcheckout = logoutRaw ? String(logoutRaw) : null;
      this.actualCheckin = loginRaw ? String(loginRaw) : null;
    }
    console.log('Initialized checkin:', this.Newcheckin, 'checkout:', this.NewcheckOut);
  }

  loadRoles() {
    this.api.getRole().subscribe({
      next: (data) => {
        this.roles = data;
        console.log('Roles loaded:', this.roles);
      },
      error: (err) => {
        console.error('Error loading roles:', err);
      },
    });
  }
  Save() {
    // Validation
    if (!this.selectedRole) {
      this.showAlert('Kindly specify who approved this.');
      return;
    }

    if (!this.attendanceData || !this.attendanceData.log_id) {
      this.showAlert('Invalid attendance data. Cannot update.');
      return;
    }

    // Convert datetime-local format back to ISO string for comparison
    const newCheckInISO = this.Newcheckin ? new Date(this.Newcheckin).toISOString() : null;
    const newCheckOutISO = this.NewcheckOut ? new Date(this.NewcheckOut).toISOString() : null;
    const actualCheckInISO = this.actualCheckin ? new Date(this.actualCheckin).toISOString() : null;
    const actualCheckOutISO = this.actualcheckout
      ? new Date(this.actualcheckout).toISOString()
      : null;

    if (actualCheckInISO === newCheckInISO && actualCheckOutISO === newCheckOutISO) {
      this.showAlert('No changes in login time and logout time detected');
      return;
    }

    // Optional: Add loading state
    this.isLoading = true;

    console.log('Updating checkin:', this.Newcheckin, 'checkout:', this.NewcheckOut);

    this.api
      .updateattendance(this.auth.getToken(), {
        log_id: this.attendanceData.log_id,
        newCheckIn: this.Newcheckin,
        newCheckOut: this.NewcheckOut,
        approved_by: this.selectedRole,
      })
      .pipe(
        switchMap((response) => {
          if (response.status !== 'Updated') {
            throw new Error('Update failed');
          }

          // Only update log if attendance update succeeded
          return this.api.updateLog(this.auth.getToken(), {
            log_id: this.attendanceData.log_id,
            newCheckIn: this.Newcheckin,
            newCheckOut: this.NewcheckOut,
            approved_by: this.selectedRole,
            actualLogInTime: this.actualCheckin,
            actualLogOutTime: this.actualcheckout,
            emp_id: this.attendanceData.empID,
            actionType: 'Update',
          });
        }),
        finalize(() => {
          this.isLoading = false; // Reset loading state
        }),
      )
      .subscribe({
        next: (data) => {
          console.log('Update success:', data);
          this.showAlert('Attendance updated successfully');
          this.updateLoginStatus();
          this.onClose();
        },
        error: (err) => {
          console.error('Update error:', err);
          this.showAlert('Failed to update attendance. Please try again.');
        },
      });
  }
  updateLoginStatus() {
    console.log('Im In');
    if (this.actualcheckout == null && this.NewcheckOut !== null) {
      this.api.updateShiftStatus(this.auth.getToken(), this.attendanceData.empID).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      return;
    }
  }
  updateLoginStatusOnDelete() {
    console.log('Im In');
    if (this.actualcheckout == null) {
      this.api.updateShiftStatus(this.auth.getToken(), this.attendanceData.empID).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      return;
    }
  }
  Delete() {
    if (!this.selectedRole) {
      this.showAlert('Kindly specify who approved this.');
      return;
    }

    if (!this.attendanceData || !this.attendanceData.log_id) {
      this.showAlert('Invalid attendance data. Cannot delete.');
      return;
    }

    console.log('Deleting log ID:', this.attendanceData.log_id);
    this.isLoading = true;

    this.api
      .deleteLog(this.auth.getToken(), this.attendanceData.log_id)
      .pipe(
        switchMap((deleteResult: any) => {
          console.log('Delete API response:', deleteResult);
          // Only update log if delete was successful
          return this.api.updateLog(this.auth.getToken(), {
            log_id: this.attendanceData.log_id,
            approved_by: this.selectedRole,
            actualLogInTime: this.actualCheckin,
            actualLogOutTime: this.actualcheckout,
            emp_id: this.attendanceData.empID,
            actionType: 'Delete',
          });
        }),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (data) => {
          console.log('Delete success:', data);
          this.showAlert('Deleted successfully');
          this.updateLoginStatusOnDelete();
          this.onClose();
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.showAlert(err.error?.message || 'Failed to delete item. Please try again.');
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
