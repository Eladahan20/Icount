import { Component, OnInit } from '@angular/core';
import { Product} from '../Product';
import { ProductsService } from '../products.service';
import { isNumber } from 'util';
import { MatSort, MatSortHeader, MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[];
  date: number;
  constructor(private ps: ProductsService) {}

  ngOnInit() {
    this.ps
      .getProducts()
      .subscribe((data: Product[]) => {
        this.products = data;
        this.products = this.productsGetToday(this.products);
        this.products = this.productsGetMonth(this.products);
        console.log(this.products);
      })
    this.ps.getDate().subscribe((data: any) => {
      this.date = data[0]['last_update'];
    });
  }


  productsGetMonth(products) {
    for (let i = 0; i < products.length; i++) {
      var monthQuantity = 0;
      const element = products[i]['Stamps']; // element = [{1243253: 3, 13253425: -11}] ..
      for (let j = 0; j < element.length; j++) {
        const quantity_stamp = element[j];
        const values = Object.keys(quantity_stamp).map(key =>
          quantity_stamp[key]);
        if (isNumber(values[0]) && values[0]<0) {
          monthQuantity += values[0]*-1;
        }
      }
      products[i]['monthly'] = monthQuantity;
      products[i]['dynamic'] = products[i]['Quantity']/monthQuantity;

    }
    return products;

  }

  productsGetToday(products) {
    products.forEach(element => {
      element['daily'] = 0;
      // takes the last stamp as objecs e,.g { 15043594329: 4}
      let todayStamp = element['Stamps'][element['Stamps'].length - 1];
      // takes its value
      if (todayStamp) {
        const values = Object.keys(todayStamp).map(key =>
          todayStamp[key]);
        const keys = Object.keys(todayStamp);
        // assign it to 'today' dynamic attribute
        if (isNumber(values[0]) && values[0]<0) {
          element['daily'] = values[0]*-1;
          element['today_date'] = this.getTime(keys[0]);
        } else {
          element['daily'] = 0;
        }

      }
    });
    return products;
  }
  getTime(timestamp) {
    timestamp = parseInt(timestamp);
    var date = new Date(timestamp);
    return date;
  }

}
