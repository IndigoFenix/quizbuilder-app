import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Answer } from '@core/models/answer';
import { Question } from '@core/models/question';
import { Quiz } from '@core/models/quiz';
import { QuizAdminService } from '@core/services/quiz-admin.service';

@Component({
  selector: 'app-quiz-builder',
  templateUrl: './quiz-builder.component.html',
  styleUrls: ['./quiz-builder.component.scss']
})
export class QuizBuilderComponent implements OnInit {

  @Input('quiz') quiz: Quiz = {'id': '', 'user': '', 'title': '', 'questions': [], 'published': false};
  public quizForm: FormGroup;
  public error: string | null = null;
  public showErrors: boolean = false;
  public submitted: boolean = false;

  public maxQuestions = 10;
  public maxAnswers = 5;

  constructor(
    private quizAdminService: QuizAdminService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.quizForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    console.log('Building quiz', this.quiz);
    this.createForm(this.quiz);
  }

  createForm(quiz: Quiz) {
    var arr = [];
    for (var i = 0; i < quiz.questions.length; i++) {
      arr.push(this.createQuestion(quiz.questions[i]));
    }
    this.quizForm = this.formBuilder.group({
      'title': [quiz.title, Validators.required],
      'published': [quiz.published],
      'questions': this.formBuilder.array(arr)
    },{
      validator: this.AtLeastOneCorrectAnswer()
    });
  }

  AtLeastOneCorrectAnswer() {
    return (quizForm: FormGroup) => {
        const questions = quizForm!.get('questions') as FormArray
        for (let i=0; i<questions.length; i++){
          const question = questions.at(i);
          const questionValue = question.value as Question;
          let hasErrors = false;
          const errors = {
            'text': false,
            'noAnswer': false,
            'noCorrectAnswer': false
          };
          if (questionValue.text === ''){
            errors.text = true;
            hasErrors = true;
          }
          if (questionValue.answers.length === 0){
            errors.noAnswer = true;
            hasErrors = true;
          } else if (!questionValue.answers.find(a => a.correct)) {
            errors.noCorrectAnswer = true;
            hasErrors = true;
          }
          question.setErrors(hasErrors ? errors : null);
        }
        if (questions.length === 0){
          console.log(quizForm);
          quizForm.controls['questions'].setErrors({'noQuestions': true});
        }
    }
  }

  blankQuestion(){
    return {'text': '', 'allAnswers': false, 'order': 0, 'answers': []} as Question;
  }

  blankAnswer(){
    return {'text': '', 'correct': false} as Answer;
  }

  createQuestion(question: Question = this.blankQuestion()): FormGroup {
    var subArr = [];
    for (var i = 0; i < question.answers.length; i++) {
      subArr.push(this.createAnswer(question.answers[i]));
    }
    return this.formBuilder.group({
      'id': question.id,
      'text': [question.text, Validators.required],
      'allAnswers': [question.allAnswers],
      'answers': this.formBuilder.array(subArr)
    });
  }

  createAnswer(answer: Answer = this.blankAnswer()): FormGroup {
    return this.formBuilder.group({
      'text': [answer.text, Validators.required],
      'correct': answer.correct || false
    });
  }

  getQuestionControls(){
    return (this.quizForm.get('questions') as FormArray).controls as FormGroup[];
  }

  getAnswerControls(question: FormGroup){
    return (question.get('answers') as FormArray).controls as FormGroup[];
  }

  addQuestion(){
    const questions = this.quizForm!.get('questions') as FormArray;
    questions.push(this.createQuestion());
  }

  deleteFromFormArray(arr: FormArray, item: any){
    for (let i=0; i<arr.length; i++){
      if (arr.at(i) === item){
        arr.removeAt(i);
        return true;
      }
    }
    return false;
  }

  addAnswer(question: FormGroup){
    const answers = question.get('answers') as FormArray;
    answers.push(this.createAnswer());
  }

  deleteQuestion(question: FormGroup){
    this.deleteFromFormArray(this.quizForm!.get('questions') as FormArray, question);
  }

  deleteAnswer(question: FormGroup, answer: FormGroup){
    this.deleteFromFormArray(question.get('answers') as FormArray, answer);
  }

  saveQuiz(andPublish: boolean = false){
    console.log('VALID:',this.quizForm.valid,this.quizForm.errors)
    console.log(this.quizForm.controls);
    this.quizForm.patchValue({'published': andPublish});
    if (this.quizForm.valid){
      if (this.quizForm.value['questions'].length === 0){

      }
      this.submitted = true;
      if (this.quiz.id === ''){
        this.quizAdminService.create(this.quizForm.value).then(result=>{
          this.backToList();
        },error=>{
          this.submitted = false;
          this.error = error;
        });
      } else {
        this.quizAdminService.update(this.quiz.id, this.quizForm.value).then(result=>{
          this.backToList();
        },error=>{
          this.submitted = false;
          this.error = error;
        });
      }
    } else {
      this.showErrors = true;
    }
  }

  backToList(){
    this.router.navigate(['/admin']);
  }
}