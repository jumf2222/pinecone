import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ScheduleComponent } from "./schedule/schedule.component";
import { CoursesComponent } from "./courses/courses.component";
import { DegreePlannerComponent } from "./degree-planner/degree-planner.component";
import { ScheduleOptionsComponent } from "./schedule-options/schedule-options.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./auth.guard";


const routes: Routes = [
  { path: "finder", component: CoursesComponent, canActivate: [AuthGuard] },
  { path: "schedule", component: ScheduleComponent, canActivate: [AuthGuard] },
  { path: "preferences", component: ScheduleOptionsComponent, canActivate: [AuthGuard] },
  { path: "planner", component: DegreePlannerComponent, canActivate: [AuthGuard] },
  { path: "", component: HomeComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
