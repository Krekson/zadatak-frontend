import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { InvoiceItem } from './interface/invoice-item.interface';
import { Invoice } from './interface/invoice.interface';
import { Partner } from './interface/partner.interface';
import { InvoiceItemService } from './service/invoice-item.service';
import { InvoiceService } from './service/invoice.service';
import { PartnerService } from './service/partner.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from './service/item.service';
import { Item } from './interface/item.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isNew: boolean = true;
  public countries = ["Croatia", "England", "Germany", "Italy", "Spain", "France"];
  public partners: Partner[] | undefined;
  public items: Item[] | undefined;
  public invoiceInForm: Invoice | undefined;
  public itemInForm: InvoiceItem | undefined;
  public invoiceItems: InvoiceItem[] | undefined;
  public invoices: Invoice[] = [];
  private selectedInvoiceId: number = 0;

  public constructor (
    private modalService: NgbModal,
    private partnerService: PartnerService,
    private itemService: ItemService,
    private invoiceService: InvoiceService,
    private invoiceItemService: InvoiceItemService) 
    {}

  public ngOnInit() {
    this.readPartners();
    this.readItems();
    this.readInvoices();
  }

  private readPartners() {
    this.partnerService.readPartners().subscribe(
      (response: Partner[]) => {
        console.log("READ PARTNERS");
        this.partners = response;
      }
    );
  }

  private readItems() {
    this.itemService.readItems().subscribe(
      (response: Item[]) => {
        console.log("READ ITEMS");
        this.items = response;
      }
    );
  }

  private readInvoices() {
    this.invoiceService.readInvoices().subscribe(
      (response: Invoice[]) => {
        console.log("READ INVOICES");
        this.invoices = response;
      }
    );
  }

  private readInvoiceItems(invoiceId: number) {
    this.invoiceItemService.readInvoiceItems(invoiceId).subscribe(
      (response: InvoiceItem[]) => {
        console.log("READ INVOICE " + invoiceId + " ITEMS");
        this.invoiceItems = response;
      }
    );
  }
  
  public onSubmit(invoiceForm: NgForm) {
    if(this.isNew) {
      this.createInvoice(invoiceForm.value);
    } else {
      this.updateInvoice(invoiceForm.value);
    }
    invoiceForm.reset();
    this.isNew = true;
  }

  private createInvoice(invoice: Invoice) {
    console.log("CREATING INVOICE");
    console.log(invoice);
    this.invoiceService.createInvoice(invoice).subscribe(
      (response: Invoice) => {
        console.log("CREATED INVOICE");
        console.log(response);
        this.readInvoices();
        const maxId = Math.max(...this.invoices.map(o => o.id), 0);
        this.readInvoiceItems(maxId + 1);
        this.selectedInvoiceId = maxId + 1;
      }
    );
  }

  public viewInvoice(invoice: Invoice, invoiceForm: NgForm) {
    this.invoiceInForm = invoice;
    this.selectedInvoiceId = invoice.id;
    this.readInvoiceItems(invoice.id);
    this.isNew = false;
    invoiceForm.setValue(invoice);
  }

  private updateInvoice(invoice: Invoice) {
    console.log("UPDATING INVOICE");
    console.log(this.invoiceInForm);
    this.invoiceService.updateInvoice(invoice).subscribe(
      (response: Invoice) => {
        console.log("UPDATED INVOICE");
        console.log(response);
        this.readInvoices();        
      }
    );
  }

  public deleteInvoice(invoiceForm: NgForm) {
    console.log("DELETING INVOICE " + this.selectedInvoiceId);
    this.invoiceService.deleteInvoice(this.selectedInvoiceId).subscribe(
      (response: void) => {
        console.log("DELETED INVOICE " + this.selectedInvoiceId);
        invoiceForm.reset();
        this.deleteAllInvoiceItems(this.selectedInvoiceId);
        this.readInvoices();
        this.readInvoiceItems(0);
        this.selectedInvoiceId = 0;
        this.isNew = true;
      }
    );
  }

  private deleteAllInvoiceItems(invoiceId: number) {
    console.log("DELETING ALL INVOICE " + this.selectedInvoiceId + " ITEMS");
    this.invoiceItemService.deleteAllInvoiceItems(this.selectedInvoiceId).subscribe(
      (response: void) => {
        console.log("DELETED ALL INVOICE " + this.selectedInvoiceId + " ITEMS");
        this.selectedInvoiceId = 0;
      }
    );
  }

  deleteInvoiceItem(invoiceItem: InvoiceItem) {
    console.log("DELETING INVOICE ITEM " + invoiceItem.id);
    this.invoiceItemService.deleteInvoiceItem(invoiceItem.id).subscribe(
      (response: void) => {
        console.log("DELETED INVOICE ITEM " + this.selectedInvoiceId);
        this.readInvoiceItems(this.selectedInvoiceId);
      }
    );
    this.invoiceService.readInvoice(this.selectedInvoiceId).subscribe(
      (response: Invoice) => {
        console.log("READ INVOICE " + this.selectedInvoiceId);
        let invoice: Invoice = response;
        invoice.total = invoice.total - invoiceItem.itemPrice;
        this.invoiceInForm = invoice;
        this.updateInvoice(invoice);
        this.readInvoices();
      }
    );
  }

  public newItem(itemForm: NgForm) {
    let item: Item;
    let invoiceItem: InvoiceItem = itemForm.value;
    this.itemService.findItem(invoiceItem.itemName).subscribe(
      (response: Item) => {
        console.log("FIND ITEM " + invoiceItem.itemName);
        item = response;
        invoiceItem.invoiceId = this.selectedInvoiceId;
        invoiceItem.itemId = item.id;
        invoiceItem.itemCode = item.code;
        invoiceItem.itemPrice = item.price * invoiceItem.quantity;
        invoiceItem.itemQUnit = item.qUnit;
        invoiceItem.itemVat = item.vat;
        console.log("CREATING INVOICE ITEM");
        console.log(item);
        this.createItem(invoiceItem);
        this.updateInvoiceTotal(invoiceItem);
        this.modalService.dismissAll();
      }
    );
  }

  private createItem(invoiceItem: InvoiceItem) {
    this.invoiceItemService.createInvoiceItem(invoiceItem).subscribe(
      (response: InvoiceItem) => {
        console.log("CREATED INVOICE ITEM");
        console.log(response);
        this.readInvoiceItems(invoiceItem.invoiceId);
      }
    );
  }

  private updateInvoiceTotal(invoiceItem: InvoiceItem) {
    this.invoiceService.readInvoice(invoiceItem.invoiceId).subscribe(
      (response: Invoice) => {
        let invoice: Invoice = response;
        invoice.total = invoice.total + invoiceItem.itemPrice;
        console.log("NEW TOTAL INVOICE:");
        console.log(invoice);
        this.updateInvoice(invoice);
        this.invoiceInForm = invoice;
      }
    );
  }

  public clickCancel(invoiceForm: NgForm) {
    invoiceForm.reset();
    this.isNew = true;
  }

  openModal(content: any) {
    this.modalService.open(content);
  }
}
