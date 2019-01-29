import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  uri = '/products';
  uri2 = '/products/last_update';
  
  constructor(private http: HttpClient) { }

  getProducts() {
   return this.http.get(this.uri);
  }
  getDate(){
    return this.http.get(this.uri2);
  }


}
