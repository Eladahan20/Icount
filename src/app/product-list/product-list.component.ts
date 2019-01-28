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
      // takes the last stamp as objecs e,.g { 15043594329: 4}
      let todayStamp = element['Stamps'][element['Stamps'].length-1];
      // takes its value
      if (todayStamp) {
        const values = Object.keys(todayStamp).map(key => 
          todayStamp[key]);
        const keys = Object.keys(todayStamp);
        // assign it to 'today' dynamic attribute
        element['today_quantity']= values[0];
        element['today_date'] = this.getTime(keys[0]);
      }
    });
    return products;
  } 
  getTime(timestamp){
    timestamp = parseInt(timestamp);
    var date = new Date(timestamp);
   return date;

    // console.log(day);
    //     // Minutes part from the timestamp
    // var month = date.getMonth();
    // console.log(month);
    // Seconds part fr

// Will display time in 10:30:23 format
// var formattedTime = hours + '/' + minutes + '/' + seconds;
// return formattedTime;
  }
  productsGetLastMonth(products){
    
  }

}
