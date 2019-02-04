import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ProductsService } from '../products.service';
import { Product } from '../Product';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})



export class ProductDetailsComponent implements OnInit {

  chart: [];
  product: Product;
  stamps: Array<string> = [];
  values: Array<number> = [];
  importStamps: Array<any> = [];
  isOn : Boolean = true;
  
  
  constructor(private route:ActivatedRoute, private ps: ProductsService){}
  
  ngOnInit() {
      this.ps
      .getProduct(this.route.snapshot.params['id'])
      .subscribe((data: Product) => {
        this.getArrays(data['Stamps']);
        this.product = data;
      });
 }


  getTime(timestamp) {
      var d = new Date(+timestamp),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      let date = [day, month, year].join('/');
      return date;
  
  }

  getArrays(stamp) {
    this.stamps = [];
    this.values = [];
    for (let i = 0; i < stamp.length; i++) {
      const element = stamp[i];
      const stamps =  Object.keys(element);
      const values = Object.keys(element).map(key =>
        element[key]);
        if (values[0] < 0) {
          this.stamps.push(this.getTime(stamps[0]));
          this.values.push(-1 * values[0]);
        } else {
          this.importStamps.push({time: this.getTime(stamps[0]), value: values[0]});      
        }

    }

    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.stamps,
        datasets: [{
          data: this.values, 
          // backgroundColor: [
          //     'rgba(255, 99, 132, 0.8)',
          // ],
          // borderColor: [
          //     'rgba(255,99,132,1)'     
          // ],
          borderWidth: 1
      }]
      },
      options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
    });
  }

}
