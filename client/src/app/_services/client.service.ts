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
  clientCache = new Map();

  constructor(private http: HttpClient) {}

  getClients(clientParams: BaseParams) {
    const response = this.clientCache.get(
      Object.values(clientParams).join('-')
    );
    if (response !== undefined) return of(response);

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
          let paginatedResult = new PaginatedResult<Client[]>();
          paginatedResult.result = response.body;
          paginatedResult.result.forEach((el) => {
            el.fullName = el.firstName + ' ' + el.lastName;
          });
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          this.clientCache.set(
            Object.values(clientParams).join('-'),
            paginatedResult
          );
          return paginatedResult;
        })
      );
  }

  getById(id: number) {
    const member = [...this.clientCache.values()]
      .reduce((arr, el) => arr.concat(el.result), [])
      .find((x) => x.id === id);
    if (member) return of(member);

    return this.http.get<Client>(this.baseUrl + '/' + id).pipe(
      map((client) => {
        client.fullName = client.firstName + ' ' + client.lastName;
        return client;
      })
    );
  }

  post(resource: Partial<Client>) {
    return this.http.post(this.baseUrl, resource).pipe(
      map(() => {
        this.clientCache.clear();
      })
    );
  }

  put(resource: Client) {
    return this.http.put(this.baseUrl + '/' + resource.id, resource).pipe(
      map(() => {
        this.clientCache.clear();
      })
    );
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + '/' + id).pipe(
      map(() => {
        this.clientCache.clear();
      })
    );
  }

  getPaginationParams(page: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', page);
    params = params.append('pageSize', pageSize);

    return params;
  }
}
