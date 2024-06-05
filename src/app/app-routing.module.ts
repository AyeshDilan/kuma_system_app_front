import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { InvoiceComponent } from './pages/home/invoice/invoice.component';
import { NavibarComponent } from './pages/home/navibar/navibar.component';
import { ApproveComponent } from './pages/home/approve/approve.component';
import { SidenavbarComponent } from './pages/home/sidenavbar/sidenavbar.component';
import { CustomerComponent } from './pages/home/customer/customer.component';
import { ItemComponent } from './pages/home/item/item.component';
import { StockComponent } from './pages/home/stock/stock.component';
import { SupplierComponent } from './pages/home/supplier/supplier.component';
import { DatePipe } from '@angular/common';


const routes: Routes = [
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path:"home",
    component: HomeComponent
  },
  {
    path:"home/invoice",
    component: InvoiceComponent
  },
  {
    path:"home/approve",
    component: ApproveComponent
  }
  ,{
    path:"home/sidebar",
    component:SidenavbarComponent
  },
  {
    path:"home/customer",
    component:CustomerComponent
  },
  {
    path:"home/item",
    component:ItemComponent
  },
  {
    path:"home/stock",
    component:StockComponent
  },
  {
    path:"home/supplier",
    component:SupplierComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    DatePipe, // Add DatePipe here
  ]
})
export class AppRoutingModule { }
export class AppModule { }