import {Injectable} from '@angular/core';
import {UserConnect} from "../models/UserConnect";
import {environment} from 'src/environments/environment';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {map, Observable} from "rxjs";
import {UserSubscribe} from "../models/UserSubscribe";

@Injectable({
  providedIn: 'root'
})
export class ConnexionService {

  private urlConnection = `${environment.apiUrl}/user/connexion`;
  private getUserByToken = `${environment.apiUrl}/user/me`;

  constructor(private http: HttpClient) {
  }

  connectUser(userConnect: UserConnect): Observable<any> {
    return this.http.post<any>(this.urlConnection, userConnect);
  }

  logout(): void {
    localStorage.removeItem("token");
  }

  isUserLoggedIn(): Promise<UserSubscribe | null | undefined> {
    let token = localStorage.getItem("token");
    if (token) {
      var header = {
        headers: new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
      }
      return this.http.get<UserSubscribe>(this.getUserByToken, header).toPromise().then(
        (res) => {
          return res;
        },
        (error) => {
          return null;
        });
    } else {
      return Promise.resolve(null);
    }
  }

  getUserById(idUser: number): Observable<UserSubscribe> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(`${environment.apiUrl}/user/getById/${idUser}`, header).pipe(
      map((res: { user: any; }) => {
        return res.user;
      }));
  }
}
