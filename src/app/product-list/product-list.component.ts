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
  constructor(private ps: ProductsService) { }

  ngOnInit() {
    this.ps
      .getProducts()
        .subscribe((data: Product[]) => {
          this.products = data;
        })
  }

}
