import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Client } from '../models/client';
import { PaginatedResult } from '../models/pagination';
import { BaseParams } from '../models/baseParams';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  baseUrl = environment.apiUrl + 'clients';
  clients: Client[] = [];
  paginatedResult: PaginatedResult<Client[]> = new PaginatedResult<Client[]>();
  params = new BaseParams();

  constructor(private http: HttpClient) {}

  getClients(clientParams: BaseParams) {
    let params = this.getPaginationParams(
      clientParams.page,
      clientParams.pageSize
    );
    if (clientParams.search !== '') {
      params = params.append('search', clientParams.search);
    }
    if (clientParams.sortBy !== '') {
      params = params.append('sortBy', clientParams.sortBy);
    }

    return this.http
      .get<Client[]>(this.baseUrl, { observe: 'response', params })
      .pipe(
        map((response) => {
          this.paginatedResult.result = response.body;
          this.paginatedResult.result.forEach((el) => {
            el.fullName = el.firstName + ' ' + el.lastName;
          });
          if (response.headers.get('Pagination') !== null) {
            this.paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return this.paginatedResult;
        })
      );
  }

  setParams(params: BaseParams) {
    this.params = params;
  }

  getParams() {
    return this.params;
  }

  getPaginationParams(page: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', page);
    params = params.append('pageSize', pageSize);

    return params;
  }
}
