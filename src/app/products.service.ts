import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  uri = 'http://localhost:4000/products';
  
  constructor(private http: HttpClient) { }

  getProducts() {
   return this.http.get(this.uri);
  }
}
