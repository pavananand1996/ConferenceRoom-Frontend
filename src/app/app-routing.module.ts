import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginregisterComponent } from './loginregister/loginregister.component';
import { BookingsComponent } from './bookings/bookings.component';
import { StatusComponent } from './status/status.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginregisterComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'bookings',
        component: BookingsComponent
      },
      {
        path: 'history',
        component: StatusComponent
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
