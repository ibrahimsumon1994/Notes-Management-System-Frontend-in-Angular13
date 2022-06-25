import { Component, OnInit, AfterViewInit, ViewChild, Input, SimpleChanges } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements AfterViewInit {
  length: any;
  displayedColumns: string[] = ['Checkbox', 'Serial No', 'Type of Note', 'Note Details', 'Reminder / Due Time', 'Bookmarked Url', 'Status'];
  searchString: string = '';
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  constructor(
    public dialog: MatDialog,
    public asyncService: AsyncService,
    private commonService: CommonService,
    private noteService: NoteService,
    private router: Router
  ) { }
  applyFilter(filterValue: any) {
    filterValue = filterValue.trim().toLowerCase();
    this.searchString = filterValue;
    this.loadAllNotes();
  }
  ngAfterViewInit() {
    this.loadAllNotes();
  }
  loadAllNotes = (): void => {
    if(this.searchString)
    {
      this.paginator.pageIndex = 0;
    }
    this.paginator.page.subscribe((resp) => { }
    );
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.asyncService.start();
          return this.noteService.getAllNotes(
            {
              "page": this.paginator.pageIndex + 1,
              "pageSize": this.paginator.pageSize,
              "searchString": this.searchString
            }
          )
        }),
        map(data => {
          this.dataSource.paginator = this.paginator;
          this.length = data.totalRecord;
          this.dataSource.paginator = data.apidata;
          this.asyncService.finish();
          return data;
        })
      )
      .subscribe(
        data => {
          this.length = data.totalRecord;
          this.dataSource.data = data.apiData;
          this.asyncService.finish();
        }
      );
  };
  addNote() {
    this.router.navigate(['dashboard/note-add']);
  }
  changeTodoStatus(event: MatCheckboxChange, noteId: any): void {
    this.noteService.changeTodoStatus(event.checked, noteId).
        subscribe(
          (data) => {
            this.asyncService.finish();
            if (data.isExecute) {
              this.loadAllNotes();
            } else {
              this.asyncService.finish();
            }
          },
          (error) => {
            this.asyncService.finish();
            this.commonService.showErrorMsg(JSON.stringify(error));
          }
        );
  }
  goToLink(url: string){
    window.open("//" + url, '_blank');
  }
}
