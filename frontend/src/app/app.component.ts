import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {clientId, redirectUri, scope} from './oauth2-props';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  template: `
    <div class="container">
      <div class="content">
        <button (click)="authorizeFromGmail()">Press Me to fetch your info</button>
        <hr>
        <div *ngIf="!userInfo">No info yet...</div>
        <div *ngIf="userInfo">
          <p><strong>Email:</strong> {{ userInfo.email }}</p>
          <p><strong>Name:</strong> {{ userInfo.name }}</p>
          <p><strong>Picture:</strong><img class="avatar" [src]="userInfo.picture"/></p>
        </div>
      </div>
      <div class="gray-content">
        <img class="sequence-diagram" src="sequence_diagram.png">
        <p class="center mt-1">
          <a href="https://github.com/asgarov1/oauth2-demo" target="_blank">https://github.com/asgarov1/oauth2-demo</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  userInfo: any;
  popupCheckInterval: any = null;

  constructor(private httpClient: HttpClient) {
  }

  protected authorizeFromGmail() {
    const gmailOauth2Url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&prompt=consent`;
    console.log(`url to cal: ${gmailOauth2Url}`)
    const popupWindow = window.open(
      gmailOauth2Url,
      "",
      "width=600,height=800,left=200,top=150,scrollbars=yes"
    );

    this.popupCheckInterval = setInterval(() => {
      if (popupWindow && popupWindow.closed) {
        clearInterval(this.popupCheckInterval);

        let googleAccessToken = this.getCookie('google_access_token');
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${googleAccessToken}`
        })

        this.httpClient.get("https://www.googleapis.com/oauth2/v1/userinfo", {headers})
          .subscribe(response => {
            this.userInfo = response;
          })
      }
    }, 500);
  }


  getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      // @ts-ignore
      return parts.pop().split(';').shift();
    }
    return undefined;
  }


  protected readonly JSON = JSON;
}
