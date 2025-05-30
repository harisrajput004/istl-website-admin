import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-unauthorized-popup',
  imports: [MatDialogModule, MatButtonModule], 
  templateUrl: './unauthorized-popup.component.html',
  styleUrl: './unauthorized-popup.component.scss'
})
export class UnauthorizedPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) { }

}
