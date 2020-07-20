import { Injectable } from "@angular/core";
import { AmplifyService } from "aws-amplify-angular";
import Auth, { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  greeting = "";
  signedIn = new BehaviorSubject<boolean | null>(null);
  user: { username: string } | null = null;

  constructor(public amplifyService: AmplifyService) {
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        if (!authState.user) {
          this.user = null;
        } else {
          this.user = authState.user;
          if (this.user) {
            this.greeting = "Hello " + this.user.username;
          }
        }
        this.signedIn.next(authState.state === "signedIn");
        console.log("auth", authState);
      });
  }

  signIn() {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google }).then(data => console.log("in", data));
  }
}
