import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  uri = '/products';

  
  constructor(private http: HttpClient) { }

  getProducts() {
   return this.http.get(this.uri);
  }
  getDate(){
    return this.http.get(this.uri + '/last_update');
  }


}
