import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Authservice } from '../../Services/authservice';
import { Attendanceservice } from '../../Services/api';
import { Navbar } from '../navbar/navbar';
import { Attendancehome } from '../attendancehome/attendancehome';
import { Manageshift } from '../manageshift/manageshift';
import { Actionlogs } from '../actionlogs/actionlogs';

@Component({
  selector: 'app-homepage',
  imports: [Navbar, Attendancehome, Manageshift, Actionlogs],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  token: string = '';
  userData: any;
  selection: string = 'FA';
  constructor(private auth: Authservice, private router: Router, private api: Attendanceservice) {}
  ngOnInit() {
    this.token = this.auth.getToken();
    console.log('token', this.token);
    if (this.token == '') {
      this.router.navigate(['/login']);
    } else {
      this.api.verifyToken(this.token).subscribe({
        next: (data) => {
          if ((data.cstatus = 'verified')) {
            this.userData = data[0];
          } else {
            this.router.navigate(['/login']);
          }
        },
        error: (e) => {
          this.router.navigate(['/login']);
        },
      });
    }
  }
}
