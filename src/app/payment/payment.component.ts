import {Component, OnInit} from '@angular/core';
import {PaymentService} from "../services/payment.service";
import {PurchaseService} from "../services/purchase.service";
import {ReservationService} from "../services/reservation.service";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  public returnError: boolean = false;
  public returnSuccess: boolean = false;
  public totalNumber: number = 0;
  public success: string = "success"
  public errorMessage: string = "";
  public displayAddPayment: boolean = false;
  public payments: any;
  model: any;
  minDateNg = {year: new Date().getFullYear(), month: 0, day: 1};
  maxDateNg = {year: new Date().getFullYear() + 1, month: 11, day: 1}
  reservations: any;
  actualReservation: any;
  public displayReservationBool: boolean = false;

  constructor(private paymentService: PaymentService, private purchaseService: PurchaseService, private reservationService: ReservationService, private h: HttpClient, private sanitizer: DomSanitizer) {
  }

  async ngOnInit() {
    await this.getTotal();
    await this.getAllPayments();
    await this.getAllReservations();
  }

  private async getTotal() {
    this.paymentService.getTotal().subscribe({
      next: (res) => {
        this.totalNumber = res;
      },
      error: (err) => {
        this.returnError = true;
        this.errorMessage = err.error.message;
      }
    });
  }

  closeAlert() {
    this.returnError = false;
    this.returnSuccess = false;
  }

  displayPayment() {
    this.displayAddPayment = !this.displayAddPayment;
  }


  private async getAllPayments() {
    this.paymentService.getAllPayments().subscribe({
      next: (res) => {
        this.payments = res;
        this.payments.sort((a: any, b: any) => {
          return new Date(b.datePayment).getTime() - new Date(a.datePayment).getTime();
        });
      },
      error: (err) => {
        this.returnError = true;
        this.errorMessage = err.error.message;
      }
    });
  }

  private async getAllReservations() {
    this.reservationService.getAll().subscribe({
      next: (res) => {
        this.reservations = res;
      },
      error: (err) => {
        this.returnError = true;
        this.errorMessage = err.error.message;
      }
    });
  }

  closeModal() {
    this.displayAddPayment = false;
    this.displayReservationBool = false;
  }

  addPayment(nameSend: string, nameReceipt: string, amount: string, d: any, reservationId: string | null) {
    if (nameSend == "" || nameReceipt == "" || amount == "") {
      this.returnError = true;
      this.errorMessage = "Please fill all fields";
      return;
    }
    if (d._model == undefined) {
      this.returnError = true;
      this.errorMessage = "Vous devez selectionner une date";
      return;
    }
    if (reservationId == undefined) {
      reservationId = null;
    }
    let createPayment = {
      userSend: nameSend,
      userReceipt: nameReceipt,
      amount: amount,
      datePayment: new Date(d._model.year, d._model.month - 1, d._model.day),
      idReservation: reservationId
    }
    this.paymentService.create(createPayment).subscribe({
      next: async (res: any) => {
        this.returnSuccess = true;
        this.returnError = false;
        this.success = "success";
        this.errorMessage = "Ajout réussie";
        await this.getAllPayments();
        await this.getTotal();
        this.closeModal();
      },
      error: (err: any) => {
        this.returnError = true;
        this.returnSuccess = false;
        this.errorMessage = err.error.message;
      }
    });
  }

  deletePayment(idPayment: number) {
    if (idPayment == undefined) {
      this.returnError = true;
      this.returnSuccess = false;
      this.errorMessage = "Vous devez selectionner un paiement";
      return;
    }
    this.paymentService.delete(idPayment).subscribe({
      next: async (res: any) => {
        this.returnSuccess = true;
        this.returnError = false;
        this.success = "success";
        this.errorMessage = "Suppression réussie";
        await this.getAllPayments();
        await this.getTotal();
      },
      error: (err: any) => {
        this.returnError = true;
        this.returnSuccess = false;
        this.errorMessage = err.error.message;
      }
    });
  }

  displayReservation(idReservation: number) {
    console.log(idReservation);
    console.log(this.reservations);
    this.displayReservationBool = true;
    this.actualReservation = this.reservations.filter((reservation: any) => {
      return reservation.idReservation == idReservation;
    }).pop();
  }
}
