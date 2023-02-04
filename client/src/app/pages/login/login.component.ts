import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  model: any = {};
  registerMode = false;
  returnUrl: string;

  constructor(public accountService: AccountService, private activatedRoute: ActivatedRoute, 
    private router: Router) {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit(): void {}

  login() {
    this.accountService.login(this.model).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }

  logout() {
    this.accountService.logout();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
