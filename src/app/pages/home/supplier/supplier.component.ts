import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent {

  private http;
  public supplierList:any;

  constructor(private httpClient:HttpClient){
    this.http=httpClient;
  }

  public supplier={
    nameOfCompany:null,
    location:null,
    contactNumber:null,
    email:null
  }

  ngOnInit(): void{
    this.loadSupplierInfo();
  }
  handleBtnRegisterClick(){
    if(
      this.supplier.nameOfCompany === null ||
      this.supplier.location === null ||
      this.supplier.contactNumber === null ||
      this.supplier.email === null 
    ){
      alert("please add all required information...");
      return;
    }

    fetch("http://localhost:8081/supplier",{
      method: "POST",
      body: JSON.stringify(this.supplier),
      headers:{
        "Content-type":"application/json"
      }
    })
    .then(Response=>Response.json())
    alert(this.supplier.nameOfCompany +" is add to the system succssfully...");
    this.clearBtnClick();
    this.loadSupplierInfo();
  }

  clearBtnClick(){
    this.supplier.nameOfCompany = null,
    this.supplier.location = null,
    this.supplier.contactNumber = null,
    this.supplier.email = null
  }

  loadSupplierInfo(){
    this.http.get("http://localhost:8081/supplier")
    .subscribe(data=>{
      console.log(data);
      this.supplierList = data;
    })
  }
}
