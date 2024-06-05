import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { findIndex } from 'rxjs';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {
  private http;
  public item: any;
  public itemList: any;
  public stock: number = 0;
  public stockList: any;
  combindItemList: any[] = [];
  itemName: String = '';
  itemCode: String = '';
  newArrivals: number = 0;
  newStock: number = 0;
  selectedItemId: number | undefined; 
  selectedIndex: number = 0;


  ngOnInit(): void {
    this.loadItemInfo();
  }

  constructor(private httpClient: HttpClient) {
    this.http = httpClient
  }

  loadItemInfo() {
    this.http.get("http://localhost:8081/item")
      .subscribe(data => {
        console.log(data);
        this.itemList = data;
        //console.log(this.itemList[0]);
      })

  }
  onItemNameChange(event:any) {
    this.selectedIndex = event.target.selectedIndex;
    const oldStock = Number(this.itemList[this.selectedIndex].stock);
    const newArive = Number(this.newArrivals);
    console.log(oldStock + newArive);

   
   

  }

  updateStock() {
    const oldStock = Number(this.itemList[this.selectedIndex].stock);
    const newArive = Number(this.newArrivals);
    const newStockValue = oldStock + newArive;
    fetch(`http://localhost:8081/item/${this.itemList[this.selectedIndex].id}`,{
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"stock" : newStockValue})
    })
    .then((response)=> {
      if(response.ok){
        this.loadItemInfo();
        alert("Your stock update is successfully added to the system.");
        this.newArrivals = 0;
      }else{
        throw new Error("Your stock update is fail try again.");
      }
    })
    .catch((error) => console.error(error));
    
  }



}
