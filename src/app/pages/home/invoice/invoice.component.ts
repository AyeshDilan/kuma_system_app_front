import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { __values } from 'tslib';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  //invoice object
  public invoice = {
    id: null,
    itemName: null,
    units: null,
    invoiceNumber: '',
    cost: 0,
    margin: 0,
    sellingPrice: 0,
    quantity: 1,
    inStock: 0,
    itemsValue: 0,
    currentDate: null,
    selectedRef: null,
    selectedCustomer: null,
    paymentType: null,
    selectedRemarksType: null,
    selectedAssignTo: null,
    selectedAssignName: '',
    lorryNumber: null,
    taxTotal: null,
    discount: 0,
    netTotalOfInvoice: 0
  }
  private http;
  public itemName: string = '';
  public units: string = '';
  public invoiceNumber: string = 'IN000001';
  public cost: Number = 0;
  public margin: Number = 0;
  public sellingPrice: Number = 0;
  public quantity: Number = 1;
  public inStock: Number = 0;
  public itemsValue: Number = 0;
  public currentDate: any;
  public selectedRef: any;
  public selectedCustomer: string = '';
  public paymentType: string = '';
  public selectedRemarksType: string = '';
  public selectedAssignTo: string = '';
  public selectedAssignName: string | undefined;
  public lorryNumber: string | undefined;
  public taxTotal: Number | undefined;
  public discount: number = 0;
  public netTotalOfInvoice: number = 0;

  public items: any;
  public userRefList: any;
  public secectedRefName: any;
  public customerRefList: any;
  public selectedAssignee: string | undefined;
  public users: any;
  public num: any;
  selectedRefIn: number = 0;

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) {
    this.http = httpClient;
  }

  ngOnInit(): void {
    this.loadInvoiceNumber();
    this.currentDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy'); //get current date
    this.invoice.currentDate = this.currentDate;
    this.loadItem();
    this.loadSalseRef();
    this.updateWholesalePrice();
    this.calculateTotalOfItem();
    this.loadCustomer();
  }

  //load next invoice number automatically
  loadInvoiceNumber() {
    const requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect
    };

    fetch("http://localhost:8081/invoice/next", requestOptions)
      .then(response => response.text())
      .then(data => {
        this.invoice.invoiceNumber = data;
      })
      .catch(error => console.error(error));

  }

  //-------------- Get selected Item name ----------------
  loadItem() {
    this.http.get("http://localhost:8081/item")
      .subscribe((data: any) => {
        this.items = data;
        if (this.items.length > 0) {
          this.invoice.itemName = this.items[0].itemName; // Set the itemName to the first item's itemName
          this.onItemNameChange();
        }
      })
  }

  //-------------- auto fill cost of item and unit fields  ----------------
  onItemNameChange() {
    fetch(`http://localhost:8081/item/${this.invoice.itemName}`, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        const firstItem = data[0]
        this.invoice.units = firstItem.unit;
        this.invoice.cost = firstItem.cost;
        this.invoice.inStock = firstItem.stock;
        this.invoice.id = firstItem.id;
        this.updateWholesalePrice();
        this.calculateTotalOfItem();
        this.calculateNetTotal();
      })
  }

  //-------------- when add the margin auto fill wholesale price ----------------
  calculateWholeSalePrice() {
    this.invoice.sellingPrice = parseFloat((+this.invoice.cost + (+this.invoice.cost * +this.invoice.margin / 100)).toFixed(2));
  }

  //-------------- when filled quantity auto fill total value ----------------
  updateWholesalePrice() {
    this.calculateWholeSalePrice();
    this.calculateTotalOfItem();
    this.calculateNetTotal();
  }

  updateQuantity() {
    if (this.invoice.quantity > this.invoice.inStock) {
      alert("Your order has exceeded the available Stock");
      this.invoice.quantity = 1;
      return;
    }
    this.calculateTotalOfItem();
    this.calculateNetTotal();
  }

  calculateTotalOfItem() {
    this.invoice.itemsValue = parseFloat((+this.invoice.sellingPrice * +this.invoice.quantity).toFixed(2));
  }

  //-------------- edit the current date ----------------
  onDateEntered(event: any) {
    //console.log('New date:', this.currentDate);
  }

  //-------------- auto load of sales ref name list ----------------
  loadSalseRef() {
    this.http.get("http://localhost:8081/user/retrive-user/Sales Rep")
      .subscribe((data: any) => {
        this.userRefList = data;
        console.log(data);
        if (this.userRefList.length > 1) {
          this.selectedRef = this.userRefList[this.selectedRefIn].firstName + " " + this.userRefList[this.selectedRefIn].lastName;
          console.log(this.selectedRef);
        }
      });
  }

  onSelectionRefChange(event: any) {
    this.selectedRefIn = event.target.selectedIndex;
    console.log(this.userRefList[this.selectedRefIn].firstName);
  }

  //-------------- auto load of customer name list ----------------
  loadCustomer() {
    this.http.get("http://localhost:8081/customer")
      .subscribe((data: any) => {
        this.customerRefList = data;
      })
  }

  onCustomerSelectionChange(event: any) {
    const selectedCustomer = event.target.value;
  }

  //-------------- Get value of selected pavement type ----------------
  onSelectedPavementType(event: any) {
    this.paymentType = event.target.value;
  }

  //-------------- Get value of selected remarks type ----------------
  onSelectedRemarksType(event: any) {
    this.selectedRemarksType = event.target.value;
  }

  //-------------- Assign to Invoice possition----------------
  onAssignToChange(): void {
    this.selectedAssignName = '';
    this.loadUsersByRole(this.selectedAssignTo);
  }

  //-------------- Assign to Invoice Name----------------
  loadUsersByRole(role: string): void {
    const url = `http://localhost:8081/user/retrive-user/${this.invoice.selectedAssignTo}`;

    this.http.get(url)
      .subscribe((data: any) => {
        this.users = data; // Assuming data is an array of users
        if (this.users.length > 0) {
          this.invoice.selectedAssignName = this.users[0].firstName + ' ' + this.users[0].lastName;
        }
      }, (error) => {
        console.error('Error fetching users:', error);
      });
  }

  onassinTo() {
    this.selectedAssignName = this.users[0].firstName + " " + this.users[0].lastName;
  }

  //-------------- Add Lorry  Number----------------
  selectedLorrry(event: any) {
    this.lorryNumber = event.target.value;
  }

  //-------------- Calculate net total----------------
  calculateNetTotal() {
    this.invoice.netTotalOfInvoice = parseFloat((+this.invoice.itemsValue - (+this.invoice.itemsValue * +this.invoice.discount / 100)).toFixed(2));
  }

  //-------------- when update discount total calculate net total----------------
  onUpdateTotalDiscount() {
    this.calculateNetTotal();
  }

  //-------------- Save invoice for apprival----------------
  saveForApproval() {
    if (
      this.invoice.itemName === null ||
      this.invoice.units === null ||
      this.invoice.invoiceNumber === '' ||
      this.invoice.cost === null ||
      this.invoice.margin === null ||
      this.invoice.sellingPrice === null ||
      this.invoice.quantity === null ||
      this.invoice.inStock === null ||
      this.invoice.itemsValue === null ||
      this.invoice.currentDate === null ||
      this.invoice.selectedRef === null ||
      this.invoice.selectedCustomer === null ||
      this.invoice.paymentType === null ||
      this.invoice.selectedRemarksType === null ||
      this.invoice.selectedAssignTo === null ||
      this.invoice.selectedAssignName === null ||
      this.invoice.lorryNumber === null ||
      // this.invoice.taxTotal === null || //for future requirment
      this.invoice.discount === null ||
      this.invoice.netTotalOfInvoice === null
    ) {
      alert("Please complete all required information.");
      return;
    }

    fetch("http://localhost:8081/invoice", {
      method: "POST",
      body: JSON.stringify(this.invoice),
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          alert(this.invoice.itemName + " is saved for approval in the system successfully.");
          this.allClean();
          this.loadInvoiceNumber();
          this.loadItem();
          this.invoice.currentDate = this.currentDate;
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('There was a problem with saving the invoice. Please try again later.');
      });

    fetch(`http://localhost:8081/item/${this.invoice.id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "stock": this.invoice.inStock - this.invoice.quantity })
    })
      .then((response) => {
        if (response.ok) {
          // Stock update successful
          console.log("Stock updated successfully.");
        } else {
          // Stock update failed
          console.error("Stock update failed.");
          throw new Error("Your stock update failed. Please try again.");
        }
      })
      .catch((error) => console.error(error));
  }

  //reset all
  allClean() {
    this.invoice.itemName = null,
      this.invoice.units = null,
      this.invoice.cost = 0,
      this.invoice.margin = 0,
      this.invoice.sellingPrice = 0,
      this.invoice.quantity = 1,
      this.invoice.itemsValue = 0,
      this.invoice.currentDate = null,
      this.invoice.selectedRef = null,
      this.invoice.selectedCustomer = null,
      this.invoice.paymentType = null,
      this.invoice.selectedRemarksType = null,
      this.invoice.selectedAssignTo = null,
      this.invoice.selectedAssignName = '',
      this.invoice.lorryNumber = null,
      this.invoice.taxTotal = null,
      this.invoice.discount = 0,
      this.invoice.netTotalOfInvoice = 0
  }

  clearAll() {
    this.allClean();
  }
}
