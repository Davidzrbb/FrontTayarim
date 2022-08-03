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
  private urlGetAll = `${environment.apiUrl}/payment/getAll`;
  private urlDelete = `${environment.apiUrl}/payment/delete`;

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

  getAllPayments() {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(this.urlGetAll, header).pipe(
      map((res: { payment: any; }) => {
        return res.payment;
      }));
  }

  create(createPayment: { userReceipt: string; amount: string; userSend: string; datePayment: Date ,idReservation: string | null  }) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.post<any>(`${environment.apiUrl}/payment/create`, createPayment, header);

  }

  delete(idPayment: number) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.delete<any>(`${environment.apiUrl}/payment/delete/${idPayment}`, header);
  }
}
