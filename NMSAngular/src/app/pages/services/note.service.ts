import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) {}

  fromReload = new Subject();
  FromReload(mag: any) {
    this.fromReload.next(mag);
  }

  addNote(data: any): Observable<any>{
    const url = `/Note/Add`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('addNote', [])));
  }

  getAllNotes(data: any): Observable<any>{
    const url = `/Note/GetAll`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getAllNotes', [])));
  }

  getRecentTodos(data: any): Observable<any>{
    const url = `/Note/GetRecentTodo`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getRecentTodos', [])));
  }

  getRecentReminders(data: any): Observable<any>{
    const url = `/Note/GetRecentReminder`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError<any>('getRecentReminders', [])));
  }

  changeTodoStatus(status: any, noteId: any): Observable<any>{
    const url = `/Note/ChangeTodoStatus/${status}/${noteId}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError<any>('getRecentReminders', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
