import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store, Select } from "@ngxs/store";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { User } from "./signin/user.model";
import { Logout } from "./actions/auth.actions";
import { AuthState } from "./state/auth.state";
import { Auth } from "./models/auth.model";
import {
  StartAsyncLoad,
  FinishAsyncLoad,
} from "../shared/actions/async.actions";
import { AsyncService } from "../shared/services/async.service";
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NavItem, NavItemData } from "../shared/models/nav-item.model";
@Injectable()
export class AuthService {
  @Select(AuthState.isLoggedIn) isLoggedIn!: Observable<boolean>;
  @Select(AuthState.getAuthInfo) authInfo!: Observable<Auth>;
  @Select(AuthState.menuList) menuList!: Observable<NavItemData[]>;
  @Select(AuthState.menuLocationList) menuLocationList!: Observable<NavItemData[]>;

  sessionSub?: Subscription;
  constructor(
    private router: Router,
    private store: Store,
    private http: HttpClient,
    public asyncService: AsyncService,
  ) { }

  login(user: User): Observable<any> {
    return this.http.post<any>(`/User/Login/`, user).pipe(
      map((response) =>
        response = { isAuthenticated: true, userInformation: response.apiData, message: response.message}
      ),
      catchError((error) => of(null))
    );
  }

  signUp(data: any): Observable<any> {
    const url = `/User/SignUp`;
    return this.http.post<any>(url, data)
    .pipe(catchError(this.handleError<any>('signUp', [])));
  }

  logout(emailId: any) {
    const url = `/User/Logout/${emailId}`;
    return this.http.get<any>(url);
  }

  refreshToken(data: any): Observable<any> {
    const url = `/User/RefreshToken`;
    return this.http
      .post<any>(url, data);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
