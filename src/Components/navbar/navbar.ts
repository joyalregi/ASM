import { Component, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private router: Router) {}
  @Input() userData: any;
  @Output() selectionChange = new EventEmitter<string>();
  role: string = '';
  isMobileMenuOpen: boolean = false;
  showDropdown: boolean = false;
  currentSelection: string = 'FA';

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-dropdown')) {
      this.showDropdown = false;
    }
  }

  ngOnChanges() {
    if (this.userData) {
      this.role = this.userData.role;
      console.log(this.role);
    }
  }

  orderClick(action: string) {
    this.currentSelection = action;
    this.selectionChange.emit(action);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  handleDropdownClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleDropdown();
  }

  onMouseEnter() {
    // Only show on hover for desktop (non-touch devices)
    if (window.innerWidth > 768) {
      this.showDropdown = true;
    }
  }

  onMouseLeave() {
    // Only hide on mouse leave for desktop (non-touch devices)
    if (window.innerWidth > 768) {
      this.showDropdown = false;
    }
  }

  isManageActive(): boolean {
    return ['employees', 'shift', 'rdu', 'role'].includes(this.currentSelection);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
