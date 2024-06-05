import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {

  private http;
  public itemList: any;
  public supplierList: any;

  constructor(private httpClient: HttpClient) {
    this.http = httpClient;
  }

  //item object
  public item = {
    itemName: null,
    itemCode: null,
    category: null,
    supplierName: null,
    unit: null,
    stock: 0,
    cost: null
  }

  ngOnInit(): void {
    this.loadItemInfo();
  }

  //add new item for the system
  handleBtnRegisterClick() {
    if (
      this.item.itemName === null ||
      this.item.itemCode === null ||
      this.item.category === null ||
      this.item.supplierName === null ||
      this.item.unit === null ||
      this.item.cost === null
    ) {
      alert("please add all required information...");
      return;
    }

    fetch("http://localhost:8081/item", {
      method: "POST",
      body: JSON.stringify(this.item),
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(Response => Response.json())
    alert(this.item.itemName + " is add to the system succssfully...");
    this.clearBtnClick();
    this.loadItemInfo();
  }

  clearBtnClick() {
    console.log(this.item.itemName);
      this.item.itemName = null,
      this.item.itemCode = null,
      this.item.category = null,
      this.item.supplierName = null,
      this.item.unit = null,
      this.item.cost = null
  }

  loadItemInfo() {
    this.http.get("http://localhost:8081/item")
      .subscribe(data => {
        console.log(data);
        this.itemList = data;
      })
  }

}
