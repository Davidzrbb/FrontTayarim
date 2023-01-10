import {Component, OnInit} from '@angular/core';
import {PaymentService} from "../services/payment.service";
import {PurchaseService} from "../services/purchase.service";
import {ReservationService} from "../services/reservation.service";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  returnError: boolean = false;
  returnSuccess: boolean = false;
  errorMessage: string = "";
  success: string = "success";
  public totalNumber: number = 0;
  public reservations: any;
  public displayAddReservationBool: boolean = false;
  model: NgbDateStruct | undefined;
  minDate = new Date(new Date().getFullYear(), 0, 1);
  maxDate = new Date(new Date().getFullYear() + 1, 11, 1);
  minDateNg = {year: new Date().getFullYear(), month: 0, day: 1};
  maxDateNg = {year: new Date().getFullYear() + 1, month: 11, day: 1}
  newItem: NgbDateStruct | undefined;

  constructor(private paymentService: PaymentService, private purchaseService: PurchaseService, private reservationService: ReservationService, private h: HttpClient, private sanitizer: DomSanitizer) {
  }

  async ngOnInit() {
    await this.getTotal();
    await this.getAllReservations();
  }

  private async getTotal() {
    this.paymentService.getTotal().subscribe({
      next: (res) => {
        this.totalNumber = res;
      },
      error: (err) => {
        this.returnError = true;
        this.returnSuccess = false;
        this.errorMessage = err.error.message;
      }
    });
  }

  private async getAllReservations() {
    this.reservationService.getAll().subscribe({
      next: (res) => {
        this.reservations = res;
        this.reservations.sort((a: any, b: any) => {
          return new Date(b.dateStarted).getTime() - new Date(a.dateStarted).getTime();
        });
        //nomber of night between two dates
        this.reservations.forEach((reservation: any) => {
          let dateStarted = new Date(reservation.dateStarted);
          let dateEnded = new Date(reservation.dateEnded);
          let diff = Math.abs(dateEnded.getTime() - dateStarted.getTime());
          reservation.days = Math.ceil(diff / (1000 * 3600 * 24));
          if (reservation.days == 0) {
            reservation.days = 1;
          }
        });
      },
      error: (err) => {
        this.returnError = true;
        this.returnSuccess = false;
        this.errorMessage = err.error.message;
      }
    });
  }

  closeAlert() {
    this.returnError = false;
    this.returnSuccess = false;
  }

  displayAddReservation() {
    this.displayAddReservationBool = !this.displayAddReservationBool;
  }

  deleteReservation(idReservation: number) {
    this.reservationService.delete(idReservation).subscribe({
      next: (res: any) => {
        this.returnSuccess = true;
        this.returnError = false;
        this.success = "success";
        this.errorMessage = "Suppression réussie";
        this.getAllReservations();
      },
      error: (err: any) => {
        this.returnError = true;
        this.returnSuccess = false;
        this.errorMessage = err.error.message;
      }
    });
  }

  closeModal() {
    this.displayAddReservationBool = false;
  }

  addReservation(name: string, price: string, d: any, dfin: any) {
    if (name == "" || price == "" || d._model == undefined || dfin._model == undefined) {
      this.returnError = true;
      this.errorMessage = "Veuillez remplir tous les champs";
      return;
    }
    let createReservation = {
      name: name,
      amount: price,
      dateStarted: new Date(d._model.year, d._model.month - 1, d._model.day),
      dateEnded: new Date(dfin._model.year, dfin._model.month - 1, dfin._model.day)
    }
    this.reservationService.create(createReservation).subscribe({
      next: async (res: any) => {
        this.returnSuccess = true;
        this.returnError = false;
        this.success = "success";
        this.errorMessage = "Ajout réussie";
        await this.getAllReservations();
        this.displayAddReservationBool = false;
      },
      error: (err: any) => {
        this.returnError = true;
        this.returnSuccess = false;
        this.errorMessage = err.error.message;
      }
    });

  }
}
