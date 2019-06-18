import {Routes} from "@angular/router";
import {CompComponent} from './comp/comp.component';
import {Comp1Component} from './comp1/comp1.component';
import {OrcamentoComponent} from './orcamento/orcamento.component';
import {BudgetComponent} from './budget/budget.component';
import {LoginComponent} from './login/login.component';
import {BudgetTableComponent} from './budget/budget-table/budget-table.component';
import {BudgetNewComponent} from './budget/budget-new/budget-new.component';


export const ROUTES: Routes = [
    {path: '', component: LoginComponent},
    {path: 'comp', component: CompComponent},
    {path: 'comp1', component: Comp1Component},
    {path: 'orcamento', component: OrcamentoComponent},
    {path: 'budget', component: BudgetTableComponent},
    {path: 'login', component: LoginComponent},
    {path: 'newBudget', component: BudgetComponent},
    {path: 'newBudget2', component: BudgetNewComponent}
]