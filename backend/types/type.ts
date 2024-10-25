export interface BusinessDetails {
    _id: string;
    userId: string;
    name: string;
    contact: string;
    address: string;
    description: string;
    gstNumber: string;
  }
  export interface newBusinessDetails {
    userId: string;
    name: string;
    email: string;
    address: string;
    description: string;
    gstNumber: string;
  }
  
  export interface Client {
    businessId:string;
    _id: string;
    clientNumber: number;
    name: string;
    contact: string;
    gst_number: string;
  }
  
  export interface Item {
    businessId:string;
    _id: string;
    itemNumber:number;
    name: string;
    description: string;
    price: number;
    tax: number;
  }
  
  export interface Invoice {
    _id: string;
    businessId: string;
    invoice_number: string;
    clientId:string;
    paymentStatus: string;
    billDate: string;
    dueDate: string;
    total_amount: number;
    items: Item[];
    isItemwiseTax: boolean;
    totalTaxRate: number;
    total: number;
    client:Client[];
    invoice_id: string
  }
  
  export interface Business {
    _id: string;
    name: string;
  }

  export interface InvoiceItem {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    tax: number;
  }