import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StreamDatePipe } from '../../pipes/stream-date.pipe';
import { MESSAGE } from '../../models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private fg: FormGroup;
  private new_message: FormControl;

  private myInnerHeight: number;
  private whoami: string;

  get is_valid_message(): boolean { return this.new_message.errors && (this.new_message.dirty || this.new_message.touched); }

  @Input() stream: MESSAGE[];
  @Output() onSendMessage = new EventEmitter<{ content: string, media: string }>();

  constructor(
    private _authService: AuthService,
    private _fb: FormBuilder
  ) {
    this.myInnerHeight = window.innerHeight - 250;
  }

  ngOnInit() {
    this.whoami = this._authService.user.userIdentity;
    this.new_message = new FormControl(null, {
      validators: [Validators.required, Validators.maxLength(500)]
    });
    this.fg = this._fb.group({
      new_message: this.new_message
    });
  }

  onResize(event) {
    this.myInnerHeight = event.target.innerHeight - 250;
  }

  onSubmit() {
    const response = {
      content: this.fg.controls.new_message.value,
      media: 'text'
    }
    this.onSendMessage.emit(response);
    this.fg.reset();
  }

}
