import {ReservationService} from "../services/reservation.service";
import {Component, OnInit} from '@angular/core';
import {PaymentService} from "../services/payment.service";
import {UntypedFormControl} from '@angular/forms';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import {PurchaseService} from "../services/purchase.service";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})


export class PurchaseComponent implements OnInit {

  public totalNumber: number = 0;
  public valueDatePicker: any;
  date = new UntypedFormControl(moment());
  purchase: any;
  purchaseTmp: any;
  public returnError: boolean = false;
  public returnSuccess: boolean = false;
  public success: string = "success"
  public errorMessage: string = "";
  model: NgbDateStruct | undefined;
  minDate = new Date(new Date().getFullYear(), 5, 1);
  maxDate = new Date(new Date().getFullYear() + 1, 11, 1);
  minDateNg = {year: new Date().getFullYear(), month: 5, day: 1};
  maxDateNg = {year: new Date().getFullYear() + 1, month: 11, day: 1}
  public test: any;
  reservations: any;
  public src64: any;
  public selectedFile: any;
  public displayAddPurchaseBool: boolean = false;
  public displayImage: boolean = false;
  public displayReservationBool: boolean = false;

  constructor(private paymentService: PaymentService, private purchaseService: PurchaseService, private reservationService: ReservationService, private h: HttpClient, private sanitizer: DomSanitizer) {
  }

  async ngOnInit() {
    await this.getTotal();
    await this.getAllPurchase(new Date());
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

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: any) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    this.purchaseTmp = this.purchase.filter((purchase: any) => {
      return new Date(purchase.datePurchase).getMonth() == this.date.value._d.getMonth() && new Date(purchase.datePurchase).getFullYear() == this.date.value._d.getFullYear();
    });
    this.purchaseTmp.sort((a: any, b: any) => {
      return new Date(b.datePurchase).getTime() - new Date(a.datePurchase).getTime();
    });
    datepicker.close();
  }

  private async getAllPurchase(date: Date) {
    this.purchaseService.getAll().subscribe({
      next: (res) => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].image != "") {
            let objectURL = 'data:image/png;base64,' + res[i].image;
            res[i].image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
        }
        this.purchase = res;
        this.purchaseTmp = res.filter((purchase: any) => {
          return new Date(purchase.datePurchase).getMonth() == date.getMonth() && new Date(purchase.datePurchase).getFullYear() == date.getFullYear();
        });
        //trier par date desc
        this.purchaseTmp.sort((a: any, b: any) => {
          return new Date(b.datePurchase).getTime() - new Date(a.datePurchase).getTime();
        });
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

  addPurchase(name: string, price: string, reservationId: string, toggle: any) {
    if (this.selectedFile == undefined) {
      this.selectedFile = null;
    }
    if (toggle._model == undefined) {
      this.returnError = true;
      this.errorMessage = "Vous devez selectionner une date";
      return;
    }
    if (reservationId == "0") {
      this.returnError = true;
      this.errorMessage = "Vous devez selectionner une reservation";
      return;
    }
    if (name == undefined || price == undefined || reservationId == undefined) {
      this.returnError = true;
      this.errorMessage = "Vous devez remplir tous les champs";
      return;
    }
    let createPurchase = {
      name: name,
      amount: price,
      idReservation: reservationId,
      datePurchase: new Date(toggle._model.year, toggle._model.month - 1, toggle._model.day),
      image: this.selectedFile
    }
    this.purchaseService.createPurchase(createPurchase).subscribe({
      next: (res: any) => {
        this.returnSuccess = true;
        this.errorMessage = "Achat ajouté avec succès";
        this.getAllPurchase(new Date());
        this.getTotal();
        this.displayAddPurchaseBool = false;
      },
      error: (err: any) => {
        this.returnError = true;
        this.errorMessage = err.error.message;
      }
    });
  }


  displayPurchase() {
    if (this.reservations.length <= 0) {
      this.returnError = true;
      this.errorMessage = "Vous devez creer une reservation avant de pouvoir ajouter un achat";
      return;
    }
    this.displayAddPurchaseBool = !this.displayAddPurchaseBool;
  }

  async processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const fileToBlob = async (file: File) => new Blob([new Uint8Array(await file.arrayBuffer())], {type: file.type});
    this.selectedFile = await fileToBlob(file);
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

  openImage(image: string) {
    this.displayImage = true;
    this.src64 = image;
  }

  closeImage() {
    this.displayImage = false;
    this.displayReservationBool = false;
  }

  deletePurchase(idPurchase: any) {
    console.log(idPurchase);
    this.purchaseService.deletePurchase(idPurchase).subscribe({
      complete: async () => {
        this.purchase = this.purchase.filter((purchase: any) => {
          return purchase.idPurchase != idPurchase;
        });
        await this.getAllPurchase(new Date());
        await this.getTotal();
      }
    });
  }

  displayReservation(idReservation: number) {
    this.displayReservationBool = true;
    this.reservations.filter((reservation: any) => {
      return reservation.idReservation == idReservation;
    }).pop();
    console.log(this.reservations);
  }
}
