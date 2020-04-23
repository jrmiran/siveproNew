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
import {NgxMaskModule} from 'ngx-mask-2';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { BudgetItemsComponent } from './budget/budget-items/budget-items.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SpinnerService} from './shared/spinner.service';
import { ClientRegisterComponent } from './clients/client-register/client-register.component';
import { ClientSearchComponent } from './clients/client-search/client-search.component';
import { SellerRegisterComponent } from './seller-register/seller-register.component';
import { SellerSearchComponent } from './seller-search/seller-search.component';
import { BudgetEditComponent } from './budget/budget-edit/budget-edit.component';
import { ServiceOrderComponent } from './service-order/service-order.component';
import { ParameterService } from './shared/parameter.service';
import { ServiceOrderTableComponent } from './service-order/service-order-table/service-order-table.component';
import { ServiceOrderEditComponent } from './service-order/service-order-edit/service-order-edit.component';
import { InfoBoxComponent } from './shared/info-box/info-box.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LoginService}  from './login/login.service';
import { CreatePdfSOComponent } from './create-pdf-so/create-pdf-so.component';
import { UploadComponent } from './upload/upload.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { DndModule } from 'ngx-drag-drop';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FileDropComponent } from './file-drop/file-drop.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { CreatePdfProjectComponent } from './create-pdf-project/create-pdf-project.component';
import { MaterialComponent } from './material/material.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderServiceTestComponent } from './order-service-test/order-service-test.component';
import { SearchProjectComponent } from './search-project/search-project.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import {MatExpansionModule} from '@angular/material/expansion';
import { ServiceOrderReportComponent } from './service-order-report/service-order-report.component';
import { RequestComponent } from './request/request.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NewRequestComponent } from './request/new-request/new-request.component';
import { RequestTableComponent } from './request/request-table/request-table.component';
import { EditRequestComponent } from './request/edit-request/edit-request.component';
import { ExpandableBoxComponent } from './shared/expandable-box/expandable-box.component';
import { BudgetV2Component } from './budget-v2/budget-v2.component';
import { NewBudgetV2Component } from './budget-v2/new-budget-v2/new-budget-v2.component';
import { EditBudgetV2Component } from './budget-v2/edit-budget-v2/edit-budget-v2.component';
import {BudgetV2PdfService} from './budget-v2/budget-v2-pdf.service';
import {ModalComponent} from './shared/modal/modal.component';

import {LOCALE_ID} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ServiceOrderV2Component } from './service-order-v2/service-order-v2.component';
import { ServiceOrderTableV2Component } from './service-order-v2/service-order-table-v2/service-order-table-v2.component';
import { ConfirmationBoxComponent } from './shared/confirmation-box/confirmation-box.component';
import { ServiceOrderReportV2Component } from './service-order-report-v2/service-order-report-v2.component';
import { ColorBoxComponent } from './shared/color-box/color-box.component';
import { PayrollComponent } from './payment/payroll/payroll.component';
import { PayrollTableComponent } from './payment/payroll-table/payroll-table.component';
registerLocaleData(localePt);





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
    BudgetItemsComponent,
    SpinnerComponent,
    ClientRegisterComponent,
    ClientSearchComponent,
    SellerRegisterComponent,
    SellerSearchComponent,
    BudgetEditComponent,
    ServiceOrderComponent,
    ServiceOrderTableComponent,
    ServiceOrderEditComponent,
    InfoBoxComponent,
    CreatePdfSOComponent,
    UploadComponent,
    DragDropComponent,
    FileUploadComponent,
    FileDropComponent,
    CreatePdfProjectComponent,
    MaterialComponent,
    PaymentComponent,
    OrderServiceTestComponent,
    SearchProjectComponent,
    ServiceOrderReportComponent,
    RequestComponent,
    NewRequestComponent,
    RequestTableComponent,
    EditRequestComponent,
    ExpandableBoxComponent,
    BudgetV2Component,
    NewBudgetV2Component,
    EditBudgetV2Component,
    ModalComponent,
    ServiceOrderV2Component,
    ServiceOrderTableV2Component,
    ConfirmationBoxComponent,
    ServiceOrderReportV2Component,
    ColorBoxComponent,
    PayrollComponent,
    PayrollTableComponent
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
    CurrencyMaskModule,
    NgxSpinnerModule,
    MatTooltipModule,
    DndModule,
    AngularFileUploaderModule,
    FileUploadModule,
    NgxFileDropModule,
    NgxDaterangepickerMd.forRoot(),
    MatExpansionModule,
    AutocompleteLibModule
  ],
  providers: [
      AppService,
      BudgetV2PdfService,
      StartService,
      BudgetService,
      SpinnerService,
      ParameterService,
      LoginService,
      UploadComponent,
      CreatePdfSOComponent,
      CreatePdfProjectComponent,
      {provide: LOCALE_ID, useValue: 'pt-BR'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }