import {Routes} from "@angular/router";
import {CompComponent} from './comp/comp.component';
import {Comp1Component} from './comp1/comp1.component';
import {OrcamentoComponent} from './orcamento/orcamento.component';
import {BudgetComponent} from './budget/budget.component';
import {LoginComponent} from './login/login.component';
import {BudgetTableComponent} from './budget/budget-table/budget-table.component';
import {BudgetNewComponent} from './budget/budget-new/budget-new.component';
import {BudgetItemsComponent} from './budget/budget-items/budget-items.component';
import { ClientRegisterComponent } from './clients/client-register/client-register.component';
import { ClientSearchComponent } from './clients/client-search/client-search.component';
import { SellerRegisterComponent } from './seller-register/seller-register.component';
import { SellerSearchComponent } from './seller-search/seller-search.component';
import { BudgetEditComponent } from './budget/budget-edit/budget-edit.component';
import { ServiceOrderComponent } from './service-order/service-order.component';
import { ServiceOrderTableComponent } from './service-order/service-order-table/service-order-table.component';
import { ServiceOrderEditComponent } from './service-order/service-order-edit/service-order-edit.component';
import {DragDropComponent} from './drag-drop/drag-drop.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {FileDropComponent} from './file-drop/file-drop.component';
import {MaterialComponent} from './material/material.component';
import {PaymentComponent} from './payment/payment.component';
import {OrderServiceTestComponent} from './order-service-test/order-service-test.component';
import {SearchProjectComponent} from './search-project/search-project.component';
import {ServiceOrderReportComponent} from './service-order-report/service-order-report.component';
import {RequestComponent} from './request/request.component';
import {NewRequestComponent} from './request/new-request/new-request.component';
import {EditRequestComponent} from './request/edit-request/edit-request.component';

export const ROUTES: Routes = [
    {path: '', component: LoginComponent},
    {path: 'comp', component: CompComponent},
    {path: 'comp1', component: Comp1Component},
    {path: 'orcamento', component: OrcamentoComponent},
    {path: 'budget', component: BudgetTableComponent},
    {path: 'login', component: LoginComponent},
    {path: 'newBudget', component: BudgetComponent},
    {path: 'newBudget2', component: BudgetNewComponent},
    {path: 'budgetItems', component: BudgetItemsComponent},
    {path: 'clientRegister', component: ClientRegisterComponent},
    {path: 'clientSearch', component: ClientSearchComponent},
    {path: 'sellerRegister', component: SellerRegisterComponent},
    {path: 'sellerSearch', component: SellerSearchComponent},
    {path: 'budgetEdit', component: BudgetEditComponent},
    {path: 'serviceOrder', component: ServiceOrderComponent},
    {path: 'serviceOrderTable', component: ServiceOrderTableComponent},
    {path: 'serviceOrderEdit', component: ServiceOrderEditComponent},
    {path: 'dragDrop', component: FileDropComponent},
    {path: 'materials', component: MaterialComponent},
    {path: 'payment', component: PaymentComponent},
    {path: 'serviceOrderTest', component: OrderServiceTestComponent},
    {path: 'searchProject', component: SearchProjectComponent},
    {path: 'serviceOrderReport', component: ServiceOrderReportComponent},
    {path: 'request', component: RequestComponent},
    {path: 'newRequest', component: NewRequestComponent},
    {path: 'editRequest', component: EditRequestComponent}
]