export interface Email {
    orderId: string;
    name: string;
    message: string;
    email: string;
    createAt : string;
    productName?: string;
    productAmount?: string;
    productImage?:string;
    orderUser?:string;
  }