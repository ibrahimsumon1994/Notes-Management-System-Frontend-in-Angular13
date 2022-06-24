import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule,
    NgxSpinnerModule,
  ],
  declarations: [SigninComponent, SignupComponent],
  providers: [],
})
export class AuthModule {}
