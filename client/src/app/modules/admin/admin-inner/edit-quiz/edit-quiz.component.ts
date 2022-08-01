import { Component, OnInit, Input } from '@angular/core';
import { Quiz } from '@core/models/quiz';
import { ActivatedRoute } from '@angular/router';
import { QuizAdminService } from '@core/services/quiz-admin.service';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.scss']
})
export class EditQuizComponent implements OnInit {

  @Input('quiz') quiz: Quiz | null = null;
  public error: string | null = null;

  constructor(
    private quizAdminService: QuizAdminService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.quizAdminService.get(params['id']).then(result => {
        this.quiz = result;
        this.quiz.questions.sort((a, b) => a.order - b.order);
        for (let i=0; i<this.quiz.questions.length; i++){
          for (let j=0; j<this.quiz.questions[i].answers.length; j++){
            this.quiz.questions[i].answers[j].correct = this.quiz.questions[i].correct?.includes(j);
          }
        }
        console.log(this.quiz);
      }, error => {
        this.error = error;
      });
    });
  }

}
