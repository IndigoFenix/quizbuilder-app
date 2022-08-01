import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public signupMode: Boolean = false;
  public sending: Boolean = false;
  public signingUp: Boolean = false;
  public error: string | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['',Validators.required],
      pass: ['',[Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  submit(){
    let value = this.form.value;
    this.sending = true;
    this.authService.login(value.name,value.pass).then(result=>{
      this.router.navigate(['/admin']);
      this.error = null;
      this.sending = false;
    },error=>{
      this.sending = false;
      this.error = error;
    })

  }

  signup(){
    let value = this.form.value;
    this.sending = true;
    this.signingUp = true;
    this.authService.signup(value.name,value.pass).then(result=>{
      this.error = null;
      this.signingUp = false;
      this.submit();
    },error=>{
      this.sending = false;
      this.signingUp = false;
      this.error = error;
    })
  }

}
