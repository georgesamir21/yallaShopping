import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class OrdersSellerService {
  // service name will be changed to OrdersSellerService

  constructor(public http: Http) { 
    
  }

  getOrdersOfSeller(id){
    return this.http.get(`http://localhost:9090/orders/sellers/${id}`)
      .map(result => result.json());
  }

  getOrderById(id) {
    return this.http.get(`http://localhost:9090/orders/${id}`)
      .map(result => result.json());
  }

}
