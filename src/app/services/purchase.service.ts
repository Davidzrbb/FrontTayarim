import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable} from "rxjs";
import * as Buffer from "buffer";

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private urlGetTotal = `${environment.apiUrl}/purchase/getAll`;
  private urlCreate = `${environment.apiUrl}/purchase/create`;
  private urlDelte = `${environment.apiUrl}/purchase/delete`;


  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(this.urlGetTotal, header).pipe(
      map((res: { purchase: any; }) => {
        return res.purchase;
      }));
  }

  createPurchase(createPurchase: { image: any; idReservation: string; amount: string; name: string; datePurchase: Date }) {
    let token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }

    let formData = new FormData();
    formData.append("image", createPurchase.image);
    formData.append("idReservation", createPurchase.idReservation);
    formData.append("amount", createPurchase.amount);
    formData.append("name", createPurchase.name);
    formData.append("datePurchase", createPurchase.datePurchase.toISOString());
    return this.http.post<any>(this.urlCreate, formData, header).pipe(
      map((res: { purchase: any; }) => {
        return res.purchase;
      }));
  }

  deletePurchase(idPurchase: number) {
    let token = localStorage.getItem("token");
    let header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.delete<any>(this.urlDelte + '/' + idPurchase, header);
  }
}
