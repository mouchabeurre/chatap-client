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
  MatChipsModule
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
    MatChipsModule
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
    MatChipsModule
  ],
})
export class MaterialModule { }