import { Injectable } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import Auth, { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  greeting: string;
  signedIn: boolean;
  user;

  constructor(public amplifyService: AmplifyService) {
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        this.signedIn = authState.state === 'signedIn';
        if (!authState.user) {
          this.user = null;
        } else {
          this.user = authState.user;
          this.greeting = "Hello " + this.user.username;
        }
        console.log("auth", authState);
      });
  }

  signIn() {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google }).then(data => console.log("in", data));
  }
}
