import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatTabsModule,
  MatStepperModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatProgressBarModule,
  MatDialogModule,
  MatSnackBarModule,
  MatListModule,
  MatChipsModule,
  MatMenuModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatTabsModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDialogModule, MatSnackBarModule,
    MatListModule,
    MatChipsModule,
    MatMenuModule
  ],
  exports: [
    MatButtonModule,
    MatTabsModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDialogModule, MatSnackBarModule,
    MatListModule,
    MatChipsModule,
    MatMenuModule
  ],
})
export class MaterialModule { }