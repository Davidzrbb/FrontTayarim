import {Injectable} from '@angular/core';
import {UserConnect} from "../models/UserConnect";
import {environment} from 'src/environments/environment';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {map, Observable} from "rxjs";
import {UserSubscribe} from "../models/UserSubscribe";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private urlGetTotal = `${environment.apiUrl}/payment/getTotal`;
  private getUserByToken = `${environment.apiUrl}/user/me`;

  constructor(private http: HttpClient) {
  }

  getTotal(): Observable<any> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(this.urlGetTotal, header).pipe(
      map((res: { total: any; }) => {
        return res.total;
      }));
  }

}
