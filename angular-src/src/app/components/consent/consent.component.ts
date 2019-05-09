import { Component, OnInit, Input } from '@angular/core';
import { Consent } from 'src/app/models/consent.model';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.css']
})
export class ConsentComponent implements OnInit {
  @Input()
  consent: Consent;
  constructor() { }

  ngOnInit() {
    console.log('voici le consent', this.consent);
  }

}
