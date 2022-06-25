import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { merge, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { NoteService } from '../../services/note.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  lengthTodo: any;
  displayedColumnsTodo: string[] = ['Serial No', 'Note Details', 'Due Time'];
  lengthReminder: any;
  displayedColumnsReminder: string[] = ['Serial No', 'Note Details', 'Reminder Time'];
  dataSourceTodo = new MatTableDataSource<any>();
  dataSourceReminder = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: false }) paginatorTodo!: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) paginatorReminder!: MatPaginator;
  filterForTodo: any;
  filterForReminder: any;
  listOfOptions = {
    "list": [
      {"name": "Today", ID: "1", "checked": true},
      {"name": "This week", ID: "2", "checked": false},
      {"name": "This month", ID: "3", "checked": false}
    ]
  };
  constructor(
    public dialog: MatDialog,
    public asyncService: AsyncService,
    private commonService: CommonService,
    private noteService: NoteService
  ) { }
  ngAfterViewInit() {
    this.filterForTodo = "1";
    this.filterForReminder = "1";
    this.loadRecentTodos();
    this.loadRecentReminders();
  }
  loadRecentTodos = (): void => {
    this.paginatorTodo.pageIndex = 0;
    this.paginatorTodo.page.subscribe((resp) => { }
    );
    merge(this.paginatorTodo.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.asyncService.start();
          return this.noteService.getRecentTodos(
            {
              "page": this.paginatorTodo.pageIndex + 1,
              "pageSize": this.paginatorTodo.pageSize,
              "searchString": this.filterForTodo
            }
          )
        }),
        map(data => {
          this.dataSourceTodo.paginator = this.paginatorTodo;
          this.lengthTodo = data.totalRecord;
          this.dataSourceTodo.paginator = data.apidata;
          this.asyncService.finish();
          return data;
        })
      )
      .subscribe(
        data => {
          this.lengthTodo = data.totalRecord;
          this.dataSourceTodo.data = data.apiData;
          this.asyncService.finish();
        }
      );
  };
  loadRecentReminders = (): void => {
    this.paginatorReminder.pageIndex = 0;
    this.paginatorReminder.page.subscribe((resp) => { }
    );
    merge(this.paginatorReminder.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.asyncService.start();
          return this.noteService.getRecentReminders(
            {
              "page": this.paginatorReminder.pageIndex + 1,
              "pageSize": this.paginatorReminder.pageSize,
              "searchString": this.filterForReminder
            }
          )
        }),
        map(data => {
          this.dataSourceReminder.paginator = this.paginatorReminder;
          this.lengthReminder = data.totalRecord;
          this.dataSourceReminder.paginator = data.apidata;
          this.asyncService.finish();
          return data;
        })
      )
      .subscribe(
        data => {
          this.lengthReminder = data.totalRecord;
          this.dataSourceReminder.data = data.apiData;
          this.asyncService.finish();
        }
      );
  };
  setFilterIdForTodo(filterId: any) {
    this.filterForTodo = filterId;
    this.loadRecentTodos();
  }
  setFilterIdForReminder(filterId: any) {
    this.filterForReminder = filterId;
    this.loadRecentReminders();
  }
}
