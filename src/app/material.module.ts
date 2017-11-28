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
  MatSnackBarModule,
  MatGridListModule
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
    MatSnackBarModule,
    MatGridListModule
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
    MatSnackBarModule,
    MatGridListModule
  ],
})
export class MaterialModule { }