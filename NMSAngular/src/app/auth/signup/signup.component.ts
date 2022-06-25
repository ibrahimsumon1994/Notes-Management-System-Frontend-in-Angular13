import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public asyncService: AsyncService,
    private router: Router,
    private commonService: CommonService,
    private authService: AuthService) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(14), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[0-9A-Za-z\d$@$!%*?&].{7,}')]],
    })
  }
  get name() {
    return this.form.get("name");
  }
  get email() {
    return this.form.get("email");
  }
  get dateOfBirth() {
    return this.form.get("dateOfBirth");
  }
  get password() {
    return this.form.get("password");
  }
  onSubmit() {
    const obj: any = {
      name: this.form.value.name,
      email: this.form.value.email,
      dateOfBirth: moment(this.form.value.dob).format('YYYY-MM-DD'),
      password: this.form.value.password
    }
    if (this.form.valid) {
      this.asyncService.start();
      this.authService.signUp(obj).
        subscribe(
          (data) => {
            if (data) {
              if(data.isExecute)
              {
                this.asyncService.finish();
                this.commonService.showSuccessMsgForAdd(data.message);
                this.router.navigate(['/auth']);
              }
              else
              {
                this.asyncService.finish();
                this.commonService.showSuccessMsgForDelete(data.message);
              }
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showSuccessMsgForDelete(JSON.stringify(error));
          }
        );
    }
  }
  backToLogin() {
    this.router.navigate(['/auth']);
  }
}
