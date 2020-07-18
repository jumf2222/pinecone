import { Component, Inject } from '@angular/core';
// import { FormFieldTypes } from '@aws-amplify/ui-components';
// import { Auth } from 'aws-amplify';
// import Amplify, { Auth, Hub } from 'aws-amplify';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // formFields: FormFieldTypes;
  sideMenu: boolean = false;
  selectedTab: number = 0;

  links = [{ name: "Home", route: "/" }, { name: "Finder", route: "/finder" }, { name: "Planner", route: "/planner" }, { name: "Preferences", route: "/preferences" }];

  constructor(public router: Router, public authService: AuthService) {
    router.events.subscribe(() => this.sideMenu = false);
    console.log(router.url);
    // this.formFields = [
    //   {
    //     type: "email",
    //     label: "Email Address",
    //     placeholder: "Enter email",
    //     required: true,
    //   },
    //   {
    //     type: "password",
    //     label: "Password",
    //     placeholder: "Enter password",
    //     required: true,
    //   },
    // {
    //   type: "phone_number",
    //   label: "Custom Phone Label",
    //   placeholder: "custom Phone placeholder",
    //   required: false,
    // },
    // ];


  }

  // selectLink(route) {
  //   console.log("change", route);
  //   this.router.navigate([route]);
  //   console.log(this.router.url);

  // }
}
