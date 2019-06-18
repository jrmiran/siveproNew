import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from "@angular/http";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { Comp1Component } from './comp1/comp1.component';
import { CompComponent } from './comp/comp.component';

import { ROUTES } from './app.routes';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { SettingsComponent } from './settings/settings.component';
import { MenuItemComponent } from './menu/menu-item/menu-item.component';
import { SubMenuItemComponent } from './menu/menu-item/sub-menu-item/sub-menu-item.component';
import { OrcamentoComponent } from './orcamento/orcamento.component';
import { BudgetComponent } from './budget/budget.component';
import { BudgetService } from './budget/budget.service';

import { PaginationLinkComponent } from './pagination-link/pagination-link.component';
import { TableComponent } from './table/table.component';
import { LoginComponent } from './login/login.component';
import { BudgetTableComponent } from './budget/budget-table/budget-table.component';

import { AppService } from './app.service';
import { StartService } from './start.service';
import { InputComponent } from './shared/input/input.component';
import { RadioComponent } from './shared/radio/radio.component';

import {MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BudgetNewComponent } from './budget/budget-new/budget-new.component';
import { CheckComponent } from './shared/check/check.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng2-select2';
import { AutoCompleteInputTextBoxComponent } from './shared/auto-complete-input-text-box/auto-complete-input-text-box.component';
import { PrimaryBoxComponent } from './shared/primary-box/primary-box.component';
import { DatePickerComponent } from './shared/date-picker/date-picker.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { CreatePdfComponent } from './create-pdf/create-pdf.component';
import { AutoCompleteComponent } from './shared/auto-complete/auto-complete.component';
import {NgxMaskModule} from 'ngx-mask';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";


@NgModule({
  declarations: [
    AppComponent,
    Comp1Component,
    CompComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    SettingsComponent,
    MenuItemComponent,
    SubMenuItemComponent,
    OrcamentoComponent,
    BudgetComponent,
    PaginationLinkComponent,
    TableComponent,
    LoginComponent,
    BudgetTableComponent,
    InputComponent,
    RadioComponent,
    BudgetNewComponent,
    CheckComponent,
    AutoCompleteInputTextBoxComponent,
    PrimaryBoxComponent,
    DatePickerComponent,
    CreatePdfComponent,
    AutoCompleteComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    HttpModule,
    Ng2SearchPipeModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    NgbModule,
    Select2Module,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskModule.forRoot(),
    TextMaskModule,
    CurrencyMaskModule
  ],
  providers: [
      AppService,
      StartService,
      BudgetService,
      {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }