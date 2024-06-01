import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListComponent } from './dashboard/list/list.component';
import { AddPartyComponent } from './dashboard/add-party/add-party.component';

const routes: Routes = [
  {
    path:'login',component:LoginComponent,
  },
  {
    path:'dashboard',canActivate:[AuthGuard],component:DashboardComponent,
    children:[
      {path:'',component:ListComponent},
      {path:'add',component:AddPartyComponent},
      {path:'edit/:id',component:AddPartyComponent}
    ]
  },
  {
    path:'**',pathMatch:'full',redirectTo:'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
