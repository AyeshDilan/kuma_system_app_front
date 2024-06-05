import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {

  public checkedInvoice = {
    invoiceForApprovalId: '',
    invoiceNumber: '000000',
    invoicedDate: '',
    itemName: '',
    units: '',
    cost: 0,
    margin: 0,
    wholesalePrice: 0,
    quantity: 1,
    subTotal: 0,
    approvedDate: null,
    salesRef: null,
    customer: null,
    paymentType: null,
    remarks: null,
    approvedBy: '',
    lorryNumber: null,
    taxTotal: null,
    discount: 0,
    netTotal: 0,
    status: false
  };

  invoiceListForApprove: any[] = [];
  selectedIndex: number = 0;
  customerRefList: any;
  currentDate: any;

  constructor(private httpClient: HttpClient, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loadInvoiceNumber();
    this.onUpdateMargin();
    this.currentDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    this.checkedInvoice.approvedDate = this.currentDate;
  }

  //load invoice number
  loadInvoiceNumber(): void {
    this.httpClient.get("http://localhost:8081/invoice")
      .subscribe((data: any) => {
        this.invoiceListForApprove = data;
        this.updateDetailsOfSelectedInvoice();
      });
  }

  //when select invoice number, show data
  selectedInvoiceNumber(event: any): void {
    this.selectedIndex = event.target.selectedIndex;
    this.updateDetailsOfSelectedInvoice();
  }

  //update details of checked inoice
  updateDetailsOfSelectedInvoice(): void {
    const selectedInvoice = this.invoiceListForApprove[this.selectedIndex];
    this.checkedInvoice.invoiceForApprovalId = selectedInvoice.invoiceForApprovalId;
    this.checkedInvoice.invoiceNumber = selectedInvoice.invoiceNumber;
    this.checkedInvoice.invoiceNumber = selectedInvoice.invoiceNumber;
    this.checkedInvoice.invoicedDate = selectedInvoice.currentDate;
    this.checkedInvoice.itemName = selectedInvoice.itemName;
    this.checkedInvoice.units = selectedInvoice.units;
    this.checkedInvoice.quantity = selectedInvoice.quantity;
    this.checkedInvoice.cost = selectedInvoice.cost;
    this.checkedInvoice.margin = selectedInvoice.margin;
    this.checkedInvoice.wholesalePrice = selectedInvoice.sellingPrice;
    this.checkedInvoice.subTotal = selectedInvoice.itemsValue;
    this.checkedInvoice.salesRef = selectedInvoice.selectedRef;
    this.checkedInvoice.customer = selectedInvoice.selectedCustomer;
    this.checkedInvoice.netTotal = selectedInvoice.netTotalOfInvoice;
    this.checkedInvoice.discount = selectedInvoice.discount;
    this.checkedInvoice.paymentType = selectedInvoice.paymentType;
    this.checkedInvoice.remarks = selectedInvoice.selectedRemarksType;
    this.checkedInvoice.lorryNumber = selectedInvoice.lorryNumber;
    this.checkedInvoice.approvedBy = selectedInvoice.selectedAssignName;
  }

  //when update margin update other parts
  onUpdateMargin(): void {
    this.calculateWholeSalePrice();
    this.calculateSubTotal();
    this.calculateTotal();
  }

  // calculate wholesale price
  calculateWholeSalePrice(): void {
    if (this.checkedInvoice.quantity !== undefined) {
      var newWholePrice = (this.checkedInvoice.cost + (this.checkedInvoice.cost * this.checkedInvoice.margin / 100)).toFixed(2);
      this.checkedInvoice.wholesalePrice = parseFloat(newWholePrice);
    }
  }

  // calculate sub total of the approval
  calculateSubTotal(): void {
    this.checkedInvoice.subTotal = parseFloat((this.checkedInvoice.wholesalePrice + this.checkedInvoice.wholesalePrice * this.checkedInvoice.quantity).toFixed(2));
  }

  // calculate total of the approval
  calculateTotal(): void {
    this.checkedInvoice.netTotal = parseFloat((this.checkedInvoice.subTotal - this.checkedInvoice.subTotal * this.checkedInvoice.discount / 100).toFixed(2));
  }

  // update discount of the approval
  onUpdateTotalDiscount(): void {
    this.calculateTotal();
  }

  // can update approved date
  onDateEntered(event: any): void {
    console.log('New date:', this.currentDate);
  }

  // save checked invoice to database
  saveCheckedInvoices() {
    if (
      this.checkedInvoice.margin === null ||
      this.checkedInvoice.margin === null ||
      this.checkedInvoice.margin === null
    ) {
      alert("Please check completed all requird information.");
    }

    fetch("http://localhost:8081/checkedInvoice", {
      method: "POST",
      body: JSON.stringify(this.checkedInvoice),
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(responce => {
        if (responce.ok) {
          alert(this.checkedInvoice.invoiceNumber + " invoice is successfully checked");

          fetch(`http://localhost:8081/invoice/${this.checkedInvoice.invoiceForApprovalId}`, {
            method: "DELETE",
            redirect: "follow"
          })
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));

          this.loadInvoiceNumber();
          this.checkedInvoice.status = false;

        } else {
          throw new Error(`Network responce was not ok.`)
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('There was a problem with saving the invoice. Please try again later.');
      });
  }
}