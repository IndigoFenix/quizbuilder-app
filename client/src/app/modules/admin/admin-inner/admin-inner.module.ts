import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminInnerRoutingModule } from './admin-inner-routing.module';
import { ListComponent } from './list/list.component';
import { EditQuizComponent } from './edit-quiz/edit-quiz.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { QuizBuilderComponent } from './quiz-builder/quiz-builder.component';


@NgModule({
  declarations: [
    ListComponent,
    EditQuizComponent,
    CreateQuizComponent,
    QuizBuilderComponent
  ],
  imports: [
    CommonModule,
    AdminInnerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AdminInnerModule { }
