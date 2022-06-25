import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteAddComponent } from './note-add/note-add.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'note-add', component: NoteAddComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    DashboardComponent,
    NoteListComponent,
    NoteAddComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MaterialFileInputModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule, 
    MatMomentDateModule,
  ],
  providers: [
  ]
})
export class NoteModule { }
