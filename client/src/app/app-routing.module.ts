import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentTypeCreateComponent } from './components/appointment-type/appointment-type-create/appointment-type-create.component';
import { BarberCardComponent } from './components/barber/barber-card/barber-card.component';
import { BarberDetailComponent } from './components/barber/barber-detail/barber-detail.component';
import { BarberEditComponent } from './components/barber/barber-edit/barber-edit.component';
import { ServiceCreateComponent } from './components/service/service-create/service-create.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ServerErrorComponent } from './pages/errors/server-error/server-error.component';
import { TestErrorsComponent } from './pages/errors/test-errors/test-errors.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { StaffComponent } from './pages/staff/staff.component';
import { AdminGuard } from './_guards/admin.guard';
import { BarberGuard } from './_guards/barber.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'appointment-types/create',
    component: AppointmentTypeCreateComponent,
  },
  {
    path: 'services/create',
    component: ServiceCreateComponent,
  },
  { path: 'appointments', component: AppointmentsComponent },
  {
    path: 'barber/edit/:id',
    component: BarberEditComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'barbers/:id',
    component: BarberDetailComponent,
  },
  {
    path: 'barbers',
    component: StaffComponent,
  },
  {
    path: 'edit-profile/:username',
    component: BarberEditComponent,
    canActivate: [BarberGuard],
  },
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
