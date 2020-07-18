import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    constructor(public authService: AuthService, public router: Router) { }
    canActivate(): boolean {
        console.log(this.authService.signedIn);
        if (!this.authService.signedIn) {
            // this.authService.signIn();
            this.router.navigate(['']);
            return false;
        }
        return true;
    }
}