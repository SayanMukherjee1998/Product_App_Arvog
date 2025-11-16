import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private auth: AuthService, private token: TokenService, private router: Router) {}

  logout() {
    this.auth.logout().subscribe(() => {
      this.token.clear();
      this.router.navigateByUrl('/login');
    });
  }
}
