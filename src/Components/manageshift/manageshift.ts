import { Component, ViewChild } from '@angular/core';
import { Filtershift } from '../filtershift/filtershift';
import { Modal } from '../modal/modal';
import { Authservice } from '../../Services/authservice';
import { Attendanceservice } from '../../Services/api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manageshift',
  imports: [Filtershift, Modal],
  templateUrl: './manageshift.html',
  styleUrl: './manageshift.css',
})
export class Manageshift {
  constructor(
    private api: Attendanceservice,
    private snackBar: MatSnackBar,
    private auth: Authservice
  ) {}
  @ViewChild(Filtershift) filterShiftComponent!: Filtershift;
  attendanceData: any = [];
  showmodal: boolean = false;
  selectedProduct: any = {};
  showSecondButton: boolean = false;
  selected: string = '';
  handleArrayFromChild(receivedArray: string[]) {
    this.attendanceData = receivedArray;
    console.log('Array from child:', receivedArray);
    // You can now use it — assign to variable, process, etc.
  }
  edit(product: any) {
    if (product) {
      this.selected = '0';
      console.log('Editing product:', product);
      this.selectedProduct = { ...product };
      this.showmodal = true;
    }
  }
  handleClose() {
    this.showmodal = !this.showmodal;
    if (this.showSecondButton) {
      this.filterShiftComponent.getSelectedUserAttendance();
    } else if (!this.showSecondButton) {
      this.filterShiftComponent.getAllAttendance();
    }
  }
  handlestatusFromChild(receivedStatus: boolean) {
    this.showSecondButton = receivedStatus;
  }
  deleteShift(record: any) {
    if (record) {
      console.log('Deleting record:', record);
      this.selectedProduct = { ...record };
      this.selected = '1';
      this.showmodal = true;
    }
  }
  showAlert(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
