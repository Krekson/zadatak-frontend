export interface InvoiceItem {
    id: number,    
    quantity: number,    
    invoiceId: number,

    itemId: number,
    itemCode: number,
    itemName: string,
    itemQUnit: number,
    itemPrice: number,
    itemVat: number
}