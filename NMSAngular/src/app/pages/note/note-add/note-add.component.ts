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
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-note-add',
  templateUrl: './note-add.component.html',
  styleUrls: ['./note-add.component.scss']
})
export class NoteAddComponent implements OnInit {
  form!: FormGroup;
  isTypeRegular: any;
  constructor(
    private fb: FormBuilder,
    public asyncService: AsyncService,
    private router: Router,
    private commonService: CommonService,
    private noteService: NoteService) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      noteType: ['', [Validators.required]],
      noteDetails: ['', [Validators.required]],
      time: ['', [Validators.required]],
      bookmarkUrl: ['', [Validators.required]]
    })
  }
  get noteType() {
    return this.form.get("noteType");
  }
  get noteDetails() {
    return this.form.get("noteDetails");
  }
  get time() {
    return this.form.get("time");
  }
  get bookmarkUrl() {
    return this.form.get("bookmarkUrl");
  }
  fieldChange(noteType: any) {
    if(noteType == 'Regular Note') {
      //this.isTypeRegular = true;
      this.form.controls['noteDetails'].enable();
      this.form.controls['time'].disable();
      this.form.controls['bookmarkUrl'].disable();
      this.time?.patchValue(null);
      this.bookmarkUrl?.patchValue(null);
    }
    else if(noteType == 'Reminder') {
      this.form.controls['noteDetails'].enable();
      this.form.controls['time'].enable();
      this.form.controls['bookmarkUrl'].disable();
      this.bookmarkUrl?.patchValue(null);
    }
    else if(noteType == 'Todo') {
      this.form.controls['noteDetails'].enable();
      this.form.controls['time'].enable();
      this.form.controls['bookmarkUrl'].disable();
      this.bookmarkUrl?.patchValue(null);
    }
    else if(noteType == 'Bookmark') {
      this.form.controls['bookmarkUrl'].enable();
      this.form.controls['noteDetails'].disable();
      this.form.controls['time'].disable();
      this.noteDetails?.patchValue(null);
      this.time?.patchValue(null);
    }
  }
  onSubmit() {
    let time = null;
    if(this.form.value.time)
    {
      time = moment(this.form.value.time).format('YYYY-MM-DD HH:mm:ss')
    }
    const obj: any = {
      noteType: this.form.value.noteType,
      noteDetails: this.form.value.noteDetails,
      time: time,
      bookmarkUrl: this.form.value.bookmarkUrl
    }
    if (this.form.valid) {
      this.asyncService.start();
      this.noteService.addNote(obj).
        subscribe(
          (data) => {
            if (data) {
              if(data.isExecute)
              {
                this.asyncService.finish();
                this.commonService.showSuccessMsgForAdd(data.message);
                this.router.navigate(['/dashboard']);
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
  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}