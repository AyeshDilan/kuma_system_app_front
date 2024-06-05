import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit{
  private http;
  public customerList:any;

  constructor(private httpClient:HttpClient){
    this.http=httpClient;
  }

  ngOnInit(): void {
    this.loadCustomerInfo();
  }

  //customer object
  public customer={
    firstName:null,
    lastName:null,
    shopName:null,
    idNumber:null,
    address:null,
    contact1:null,
    contact2:null,
    email:null,
    identificationCode:null
  }

  //save new customer to the system
  handleClick(){
    if(
      this.customer.firstName === null ||
      this.customer.lastName === null ||
      this.customer.shopName === null ||
      this.customer.idNumber === null ||
      this.customer.address === null ||
      this.customer.contact1 === null ||
      this.customer.email === null ||
      this.customer.identificationCode === null
    ){
      alert("Please add all required information.");
      return;
    }

    fetch("http://localhost:8081/customer",{
      method:"POST",
      body:JSON.stringify(this.customer),
      headers:{
        "Content-type":"application/json"
      }

    })
    .then(Response => Response.json())
    alert(this.customer.firstName+" "+this.customer.lastName+" is add to the system successfully...");
    this.clearAllClick();
    this.loadCustomerInfo();
  }

  //clear for customer inputs
  clearAllClick(){
    this.customer.firstName=null;
    this.customer.lastName=null;
    this.customer.shopName=null;
    this.customer.idNumber=null;
    this.customer.address=null;
    this.customer.contact1=null;
    this.customer.contact2=null;
    this.customer.email=null;
    this.customer.identificationCode=null;
  }

  //load the registerd custmer list to the table
  loadCustomerInfo(){
    this.http.get("http://localhost:8081/customer")
    .subscribe(data =>{
      console.log(data);
      this.customerList = data;
    })
  }
}
