import { Component, OnInit } from '@angular/core';
import { Product } from '../Product';
import { ProductsService } from '../products.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[];
  date : string;
  constructor(private ps: ProductsService) { }

  ngOnInit() {
    this.ps
      .getProducts()
        .subscribe((data: Product[]) => {
          this.products = data;
          this.products = this.productsGetToday(this.products);
          console.log(this.products);
        })
  }

  productsGetToday(products){
    products.forEach(element => {
      let todayStamp = element['Stamps'][element['Stamps'].length-1];
      const values = Object.keys(todayStamp).map(key => todayStamp[key]);
      element['today']= values[0];
    });
    return products;
  }
  productsGetYesterday(products){
    
  }
  productsGetLastMonth(products){
    
  }

}
