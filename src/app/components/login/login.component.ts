import { Router } from '@angular/router'
import { AuthService } from './../../services/auth.service'
import { Component, OnInit } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email = 'zynpcrcr@gmail.com';
  linkSuccess = false;

  constructor(
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {
    this.auth.currentUser.subscribe((user) => {
      if (user && !this.isNavigating) { // Yönlendirme döngüsünü önle
        this.isNavigating = true;
        this.router.navigateByUrl("/workspace", { replaceUrl: true });
      }
    });
  }
  ngOnInit(): void {}


  private isNavigating = false;
  
  async signIn() {
    this.spinner.show()
    const result = await this.auth.signInWithOTP(this.email)

    this.spinner.hide()
    if (!result.error) {
      this.linkSuccess = true
    } else {
      alert(result.error.message)
    }
  }
}
