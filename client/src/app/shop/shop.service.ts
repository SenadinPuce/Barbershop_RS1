import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'

import { Type } from '../models/productType';
import { Brand } from '../models/brands';
import { Product } from '../models/product';
import { ShopParams } from '../models/shopParams';
import { getPaginatedResult } from '../_services/paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if(shopParams.brandId !== 0) {
      params = params.append('brandId', shopParams.brandId.toString());
    }

    if(shopParams.typeId !== 0) {
      params = params.append('typeId', shopParams.typeId.toString());
    }

    if(shopParams.search) {
      params = params.append('search', shopParams.search);
    }

    params = params.append('sortBy', shopParams.sortBy);
    params = params.append('pageNumber', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

    return getPaginatedResult<Product[]>(this.baseUrl + 'products', params, this.http)
      .pipe(
        map(response => {
          return response;
        })
      )
  }

  getProduct(id: number) {
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  getBrands() {
    return this.http.get<Brand[]>(this.baseUrl + 'products/brands');
  }

  getTypes() {
    return this.http.get<Type[]>(this.baseUrl + 'products/types');
  }
}
