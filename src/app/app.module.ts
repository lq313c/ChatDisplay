import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms'; // <-- NgModel lives here

import { AppComponent } from './app.component';
import { ChatWindowComponent, ChangeNameDialog } from './chat-window/chat-window.component';

// Imports for angular material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
	MatInputModule,
	MatDialogModule,
	MatProgressSpinnerModule,
	MatButtonModule,
	MatDialog,
	MatDialogRef
} from '@angular/material'; 

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent, 
    ChangeNameDialog
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    MatInputModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  entryComponents: [ChatWindowComponent, ChangeNameDialog],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
