import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { NavibarComponent } from './pages/home/navibar/navibar.component';
import { InvoiceComponent } from './pages/home/invoice/invoice.component';
import { ApproveComponent } from './pages/home/approve/approve.component';
import { SidenavbarComponent } from './pages/home/sidenavbar/sidenavbar.component';
import { CustomerComponent } from './pages/home/customer/customer.component';
import { ItemComponent } from './pages/home/item/item.component';
import { StockComponent } from './pages/home/stock/stock.component';
import { SupplierComponent } from './pages/home/supplier/supplier.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NavibarComponent,
    InvoiceComponent,
    ApproveComponent,
    SidenavbarComponent,
    CustomerComponent,
    ItemComponent,
    StockComponent,
    SupplierComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
