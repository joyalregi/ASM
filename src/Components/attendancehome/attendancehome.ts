import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { Filtershift } from '../filtershift/filtershift';

@Component({
  selector: 'app-attendancehome',
  imports: [FormsModule, CommonModule, Filtershift],
  templateUrl: './attendancehome.html',
  styleUrl: './attendancehome.css',
})
export class Attendancehome {
  attendanceData: any[] = [];
  showTable: boolean = false;
  selectedUser: string = '';
  totalHours: any[] = [];
  showHours: boolean = false;

  exportToExcel(): void {
    // Prepare data for export
    const exportData = this.attendanceData.map((record) => ({
      'Employee ID': record.empID,
      Name: record.empName,
      Date: record.date,
      'Check In': record.check_in,
      'Check Out': record.check_out,
      'Work Duration': record.duration,
      'Over Night Shift': record.is_midnight_shift,
      verified: record.updated_at !== null ? 'Verified' : '',
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

    // Generate file name with current date
    const fileName = `Attendance_Report_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  }
  handleArrayFromChild(receivedArray: string[]) {
    this.attendanceData = receivedArray;
    console.log('Array from child:', receivedArray);
    // You can now use it — assign to variable, process, etc.
  }
  handletotalHours(ra: string[]) {
    console.log('Inside Home');
    this.totalHours = ra;
    console.log('Total from child:', this.totalHours);
  }
  viewHours() {
    this.showHours = !this.showHours;
  }
}
