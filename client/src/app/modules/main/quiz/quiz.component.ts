import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Quiz } from '@core/models/quiz';
import { QuizService } from '@core/services/quiz.service';
import { Question } from '@core/models/question';
import { Answer } from '@core/models/answer';
import { User } from '@core/models/user';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  public loaded: boolean = false;
  public error: string | null = null;
  public quiz: Quiz | null = null;
  public quizForm: FormGroup;
  public JSON = JSON;
  public totalCorrect = 0;
  public checking = false;
  public done = false;
  public user: User | null = null;

  constructor(
    private authService: AuthService,
    private quizService: QuizService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.quizForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.route.params.subscribe((params) => {
      this.quizService.get(params['id']).then(result => {
        this.quiz = result;
        this.quiz.questions.sort((a, b) => a.order - b.order);
        this.createForm(this.quiz);
        this.loaded = true;
      }, error => {
        this.error = error;
        this.loaded = true;
      });
    });
  }

  reset(){
    if (this.quiz){
      this.done = false;
      this.createForm(this.quiz);
    }
  }

  createForm(quiz: Quiz) {
    var arr = [];
    for (var i = 0; i < quiz.questions.length; i++) {
      arr.push(this.createQuestion(quiz.questions[i]));
    }
    this.quizForm = this.formBuilder.group({
      'questions': this.formBuilder.array(arr)
    });
    console.log(this.quizForm);
  }

  createQuestion(question: Question): FormGroup {
    var subArr = [];
    for (var i = 0; i < question.answers.length; i++) {
      subArr.push(this.createAnswer(question.answers[i]));
    }
    return this.formBuilder.group({
      'id': question.id,
      'text': question.text,
      'allAnswers': question.allAnswers,
      'answers': this.formBuilder.array(subArr),
      'selected': undefined,
      'correct': false
    });
  }

  createAnswer(answer: Answer): FormGroup {
    return this.formBuilder.group({
      'text': [answer.text, Validators.required],
      'selected': false,
      'correct': false
    });
  }

  getQuestionControls(){
    return (this.quizForm.get('questions') as FormArray).controls as FormGroup[];
  }

  getAnswerControls(question: FormGroup){
    return (question.get('answers') as FormArray).controls as FormGroup[];
  }

  submit(){
    const quizvalue = this.quizForm.value;
    const answeredQuestions = quizvalue.questions as Question[];
    this.checking = true;
    this.quizService.getAnswers(this.quiz!.id).then(result => {
      const questionAnswers = result;
      this.totalCorrect = 0;
      for (let i=0; i<questionAnswers.length; i++){
        const answer = questionAnswers[i];
        const answered = answeredQuestions.find(q => q.id === answer.id);
        if (!answered) continue;
        if (this.isCorrect(answered, answer.correct!)){
          this.totalCorrect++;
        }
      }
      this.checking = false;
      this.done = true;
    }, error => {
      this.error = error;
      this.checking = false;
    });
    
  }

  isCorrect(answered: Question, correct: number[]){
    if (answered.allAnswers){
      let checkedIndex = 0;
      correct = correct.sort((a, b) => a - b);
      for (let i=0; i<answered.answers.length; i++){
        if (answered.answers[i].selected){
          if (correct[checkedIndex] === i){
            checkedIndex++;
          } else {
            return false;
          }
        }
      }
      return checkedIndex === correct.length;
    } else {
      if (answered.selected !== undefined && 
        correct.includes(parseInt(String(answered.selected)))
      ){
        return true;
      }
      return false;
    }

  }

}
