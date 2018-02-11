import { Component, OnInit, Inject } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  providers: [WebsocketService]
})
export class ChatWindowComponent implements OnInit {

  private outMessage: string;
  private chatHistory: string = "";
  private placeholder: string = "Type a message here";
  private mySessionName: string;
  public clients: string[] = [];


  constructor(
    private wsService: WebsocketService,
    public dialog: MatDialog
  ) {
    if (window.location.host.includes(":4200")) {
      // Local testing
      var webSocketUrl = 'ws://' + 'localhost:8080' + '/ChatService/websocket/chat';
    } else {
      // Deployment endpoint
      var webSocketUrl = 'ws://' + window.location.host + '/ChatService/websocket/chat';
    }

    wsService.createObservableSocket(webSocketUrl)
      .subscribe(
      this.onMessage(),
      err => {
        this.log(err.type);
      },
      () => {
        alert("WebSocket closed. Observable completed.")
      }
      );
  }

  // Handler for incoming websocket messages
  private onMessage() {
    return (data) => {
      console.log(data);
      switch (data.type) {

        case 'MESSAGE':
          this.log(`${data.sessionName}: ${data.message}`)
          break;

        case 'SESSION_LIST':
          this.clients = [];
          data.sessions.forEach(element => {
            this.clients.push(element.sessionName);
          });
          break;

        case 'SESSION':
          this.mySessionName = data.sessionName;
          break;

        default:
          console.log("Error: Message data type not recognized");
      }

    };
  }

  // User presses the enter key to send message
  private submit(): void {
    if (this.outMessage === "close") {
      this.log("Client disconnected.");
      this.wsService.close();
    }

    if (this.outMessage != "" && this.wsService.ws.readyState === this.wsService.ws.OPEN) {
      this.wsService.sendMessage(this.outMessage);
      this.outMessage = "";
    }
  }

  // Print to the Chat message window
  private log(text: string) {
    this.chatHistory += text + '\n';
  }

  // Change Name Dialog
  openDialog(): void {
    let dialogRef = this.dialog.open(ChangeNameDialog, {
      width: '250px',
      data: {name: this.mySessionName}
    });

    dialogRef.afterClosed().subscribe( result => {
      // If result result not undefined, notify server to change session name
      if (result) {
        this.wsService.sendMessage( JSON.stringify({newSessionName: result}) );
        // this.mySessionName = result;
      }
    });
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'change-name-dialog',
  templateUrl: 'change-name-dialog.html'
})
export class ChangeNameDialog {
  constructor(
    public dialogRef: MatDialogRef<ChangeNameDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close(this.data.newName);
  }
}