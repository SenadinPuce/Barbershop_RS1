import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentTypeCreateComponent } from './components/appointment-type/appointment-type-create/appointment-type-create.component';
import { BarberCreateComponent } from './components/barber/barber-create/barber-create.component';
import { BarberDetailComponent } from './components/barber/barber-detail/barber-detail.component';
import { BarberEditComponent } from './components/barber/barber-edit/barber-edit.component';
import { ServiceCreateComponent } from './components/service/service-create/service-create.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ServerErrorComponent } from './pages/errors/server-error/server-error.component';
import { LoginComponent } from './pages/login/login.component';
import { BarberComponent } from './pages/barber/barber.component';
import { AdminGuard } from './_guards/admin.guard';
import { BarberGuard } from './_guards/barber.guard';
import { AuthGuard } from './_guards/auth.guard';
import { ClientComponent } from './pages/client/client.component';
import { ClientCreateComponent } from './components/client/client-create/client-create.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ClientDetailComponent } from './pages/client-detail/client-detail.component';
import { ClientDetailedResolver } from './_resolvers/client-detailed.resolver';
import { BarberDetailedResolver } from './_resolvers/barber-detailed.resolver';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { ClientProfileComponent } from './pages/client-profile/client-profile.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'appointments', component: AppointmentsComponent },
      {
        path: 'appointment-types/create',
        component: AppointmentTypeCreateComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'services/create',
        component: ServiceCreateComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'barber/edit/:id',
        component: BarberEditComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'barbers/create',
        component: BarberCreateComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'barbers/:id',
        component: BarberDetailComponent,
        resolve: { barber: BarberDetailedResolver },
      },
      {
        path: 'barbers',
        component: BarberComponent,
      },
      {
        path: 'edit-profile/:username',
        component: BarberEditComponent,
        canActivate: [BarberGuard],
      },
      {
        path: 'clients/create',
        component: ClientCreateComponent,
        canActivate: [BarberGuard],
      },
      {
        path: 'clients',
        component: ClientComponent,
        canActivate: [BarberGuard],
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'messages',
        component: MessagesComponent,
      },
      {
        path: 'client/:id',
        component: ClientDetailComponent,
        resolve: { client: ClientDetailedResolver },
      },
      {
        path: 'profile/:username',
        component: ClientProfileComponent
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then(mod => mod.OrdersModule),
      }
    ],
  }, 
  {
    path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule)
  },
  {
    path: 'basket', loadChildren: () => import('./basket/basket.module').then(mod => mod.BasketModule)
  },
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadChildren: () => import('./checkout/checkout.module').then(mod => mod.CheckoutModule)
  },
  { path: 'login', component: LoginComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  {
    path: '**',
    component: NotFoundComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
