// Angular Core modules start;
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
// Angular Core modules end;

// Project modules import start
import { CourseListComponent } from './course-list/course-list.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SettingsComponent } from './settings/settings.component';
import { CoursesComponent } from './courses/courses.component';
import { ScheduleOptionsComponent } from './schedule-options/schedule-options.component';
// Porject modules import end

// Material module import start
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table'
// import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
// import { UiScrollModule } from 'ngx-ui-scroll';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatExpansionModule } from '@angular/material/expansion';

// Calendar scheduler start

import { FormsModule } from '@angular/forms';
import { DegreePlannerComponent } from './degree-planner/degree-planner.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
// Calendar schedule end;

/* Add Amplify imports */
// import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth.service';
import { CourseInfoComponent } from './course-info/course-info.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

/* Configure Amplify resources */
Amplify.configure(awsconfig);

@NgModule({
  declarations: [
    AppComponent,
    CourseListComponent,
    ScheduleComponent,
    SettingsComponent,
    CoursesComponent,
    ScheduleOptionsComponent,
    DegreePlannerComponent,
    HomeComponent,
    CourseInfoComponent,
    NavBarComponent,

  ],
  imports: [
    // Core modules import start
    AmplifyAngularModule,
    // AmplifyUIAngularModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    // Core modules import end
    // Material modules import start
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    ScrollingModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTableModule,
    CdkScrollableModule,
    MatExpansionModule,
    // Materials Modules import end;
    // Calendar module import start;
    // ExperimentalScrollingModule,
    // UiScrollModule,
    // Calendar module import end;
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [AmplifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
