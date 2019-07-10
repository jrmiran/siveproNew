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
    {path: 'budgetEdit', component: BudgetEditComponent}
]