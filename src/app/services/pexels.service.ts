import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { EnvironmentConfig, ENV_CONFIG } from 'src/environments/environment-config.interface';
import { PexelData } from '../models/pexel-data';

@Injectable({
  providedIn: 'root',
})
export class PexelsService {
  apiKey: string;
  private readonly _pexelsAPI: string = 'https://api.pexels.com/v1';
  private readonly _curatedPhotos: string = `${this._pexelsAPI}/curated`;
  private readonly _searchPhotos: string = `${this._pexelsAPI}/search`;
  private _requestHeaders: HttpHeaders;

  constructor(
    @Inject(ENV_CONFIG) private config: EnvironmentConfig,
    private http: HttpClient,
  ) {
    this._requestHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + config.environment.API_KEY
    });
  }

  private handleQueryParamCreation(paramSettings: Params): HttpParams {
    if (paramSettings.color) {
      const params = new HttpParams()
        .set('query', paramSettings.query)
        .set('color', paramSettings.color)
        .set('per_page', 30)
        .set('page', paramSettings.pageNumber.toString())
      return params;
    } else {
      const params = new HttpParams()
      .set('query', paramSettings.query)
      .set('per_page', 30)
      .set('page', paramSettings.pageNumber.toString())
      return params;
    }
  }

  getCuratedPhotos(pageNumber: number): Observable<PexelData> {
    return this.http.get<PexelData>(this._curatedPhotos, {
      headers: this._requestHeaders,
      params: {
        per_page: 30,
        page: pageNumber.toString()
      }
    });
  }

  getSearchPhotos(pageNumber: number, query: string, color?: string): Observable<PexelData> {
    const queryStringSettings: { pageNumber: number, query: string, color?: string } = { pageNumber, query, color };
    const params = this.handleQueryParamCreation(queryStringSettings);

    return this.http.get<PexelData>(this._searchPhotos, {
      headers: this._requestHeaders,
      params
    });
  }

}
