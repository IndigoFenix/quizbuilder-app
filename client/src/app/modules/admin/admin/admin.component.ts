import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@core/models/user';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public user: User | null = null;
  public error: string | null = null;

  constructor(
    private authService:AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
