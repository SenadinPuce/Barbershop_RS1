import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentTypeCreateComponent } from './components/appointment-type/appointment-type-create/appointment-type-create.component';
import { AppointmentCreateComponent } from './components/appointment/appointment-create/appointment-create.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ServerErrorComponent } from './pages/errors/server-error/server-error.component';
import { TestErrorsComponent } from './pages/errors/test-errors/test-errors.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { StaffComponent } from './pages/staff/staff.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'appointment-types/create',
    component: AppointmentTypeCreateComponent,
  },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'staff', component: StaffComponent },
  { path: 'errors', component: TestErrorsComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
