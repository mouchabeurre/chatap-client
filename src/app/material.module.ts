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
  MatMenuModule,
  MatProgressSpinnerModule
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
    MatMenuModule,
    MatProgressSpinnerModule
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
    MatMenuModule,
    MatProgressSpinnerModule
  ],
})
export class MaterialModule { }