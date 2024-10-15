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
    _id: number;
    clientNumber: number;
    name: string;
    contact: string;
    gstNumber: string;
  }
  
  export interface Item {
    businessId:string;
    _id: number;
    itemNumber:number;
    name: string;
    description: string;
    price: number;
    tax: number;
  }
  
  export interface Invoice {
    businessId: number;
    number: string;
    client: {
      name: string;
      email: string;
      gstNumber: string;
    };
    date: string;
    dueDate: string;
    amount: number;
    items: {
      id: number;
      name: string;
      quantity: number;
      price: number;
      tax: number;
    }[];
    isItemwiseTax: boolean;
    totalTaxRate: number;
  }
  
  export interface Business {
    id: string;
    name: string;
  }

  export interface InvoiceItem {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    tax: number;
  }