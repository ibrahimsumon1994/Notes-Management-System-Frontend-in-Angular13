import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthService } from '../auth.service';
import { AsyncService } from '../../shared/services/async.service';
import { CommonService } from '../../shared/services/common.service';
import { Login } from '../actions/auth.actions';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from './user.model';

@Component({
  selector: 'signin-component',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit, OnDestroy {
  formId = 'loginForm';
  form!: FormGroup;
  loginedsub!: Subscription;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
    private commonService: CommonService,
    public asyncService: AsyncService,
    private authService: AuthService,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      emailId: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  get emailId() {
    return this.form.get('emailId');
  }
  get password() {
    return this.form.get('password');
  }

  onLogin() {
    if (this.form.valid) {
      this.spinnerService.show();
      this.asyncService.start();
      const user: User = {
        email: this.form.value.emailId,
        password: this.form.value.password
      };
      this.loginedsub = this.authService.login(user).subscribe(
        (auth) => {
          if (auth) {
            if (auth.isAuthenticated && auth.userInformation) {
              this.store.dispatch(new Login(auth));
              if(auth.userInformation.token)
              {
                localStorage.setItem('accessToken', auth.userInformation.token.accessToken);
                localStorage.setItem('refreshToken', auth.userInformation.token.refreshToken);
              }
              if(auth.userInformation.user)
              {
                localStorage.setItem('emailId', auth.userInformation.user.email);
              }
              this.router.navigate(['dashboard']);
              this.spinnerService.hide();
              this.commonService.showSuccessMsgForAdd(auth.message);
              this.asyncService.finish();
            } else {
              this.spinnerService.hide();
              this.commonService.showSuccessMsgForDelete(auth.message);
              this.asyncService.finish();
              return;
            }
          } else {
            this.spinnerService.hide();
            this.commonService.showSuccessMsgForDelete(
              'Server down. Please try again later!'
            );
            this.asyncService.finish();
            return;
          }
        },
        (error) => {
          this.spinnerService.hide();
          this.asyncService.finish();
          this.commonService.showErrorMsg(JSON.stringify(error));
        }
      );
    }
  }

  redirectToSignUp() {
    this.router.navigate(['/auth/signup']);
  }

  ngOnDestroy(): void {
    if (this.loginedsub) {
      this.loginedsub.unsubscribe();
    }
    this.asyncService.finish();
  }
}
