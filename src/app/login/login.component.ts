import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  htmlParsed: any;
  form;

  constructor(private fb: FormBuilder,
              private myRoute: Router,
              private auth: AuthService,
              private domSanitizer: DomSanitizer) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.htmlParsed = this.domSanitizer.bypassSecurityTrustHtml(`
<button type="button" (click)="alertz()">alert</button>
<a href="https://www.google.com">me</a>
`);
  }

  alertz() {
    console.log('sasa');
  }

  login() {
    if (this.form.valid) {
      this.auth.sendToken(this.form.value.email);
      this.myRoute.navigate(['home']);
    }
  }



}
