export interface BusinessDetails {
    _id: string | number;
    userId: string | number;
    name: string;
    contact: string;
    address: string;
    description: string;
    gstNumber : string;
    
  }
  export interface newBusinessDetails {
    userId: string | number;
    name: string;
    email: string;
    address: string;
    description: string;
    gstNumber: string;
  }
  
  export interface Client {
    businessId:string | number;
    _id: string | number;
    clientNumber: number;
    name: string;
    contact: string;
    gst_number: string;
  }
  
  export interface Item {
    businessId:string | number;
    _id: string | number;
    itemNumber:number;
    name: string;
    description: string;
    price: number;
    tax: number;
  }
  
  export interface Invoice {
    _id: string | number;
    businessId: string | number;
    invoice_number: string;
    clientId:string | number;
    paymentStatus: string;
    billDate: string;
    dueDate: string;
    total_amount: number;
    items: Item[];
    isItemwiseTax: boolean;
    totalTaxRate: number;
    total: number;
    client:Client[];
    invoice_id: string| number;
  }
  
  export interface Business {
    _id: string | number;
    userId: string | number;
    name: string;
    contact: string;
    address: string;
    description: string;
    gst_number : string;

  }

  export interface InvoiceItem {
    _id: string | number;
    name: string;
    quantity: number;
    price: number;
    tax: number;
  }

  export interface UserProfile {
    _id: string;
    username: string;
    contact: string;
    created_at: string;
    last_login: string | null;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    businesses: Business[];
  }