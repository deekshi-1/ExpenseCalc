import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';





@Component({
  selector: 'app-popup',
  imports: [MatButton],
  templateUrl: './popup.html',
  styleUrls: ['./popup.css']
})
export class Popup {
  constructor(
    public dialogRef: MatDialogRef<Popup>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    
  }

  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close();
  }
}