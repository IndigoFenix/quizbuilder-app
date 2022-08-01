import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { EditQuizComponent } from './edit-quiz/edit-quiz.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: 'new',
    component: CreateQuizComponent,
  },
  {
    path: 'edit/:id',
    component: EditQuizComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInnerRoutingModule { }
