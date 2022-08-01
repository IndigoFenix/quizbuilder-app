import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Quiz } from '@core/models/quiz';
import { QuizAdminService } from '@core/services/quiz-admin.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public error: string | null = null;
  public loaded: boolean = false;
  public quizzes: Quiz[] = [];
  public location: Location = location;

  constructor(
    private quizAdminService: QuizAdminService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.loaded = false;
    this.quizAdminService.all().then(result => {
      this.quizzes = result;
      this.loaded = true;
    }, error => {
      this.loaded = true;
      this.error = error;
    });
  }

  createQuiz() {
    this.router.navigate(['/admin/new']);
  }

  editQuiz(quiz: Quiz) {
    this.router.navigate([`/admin/edit/${quiz.id}`]);
  }

  publishQuiz(quiz: Quiz) {
    this.quizAdminService.publish(quiz.id).then(result => {
      quiz.published = true;
      this.loaded = true;
    }, error => {
      this.loaded = true;
      this.error = error;
    });
  }

  deleteQuiz(quiz: Quiz) {
    quiz.deleting = true;
    this.quizAdminService.delete(quiz.id).then(result => {
      this.quizzes = this.quizzes.filter(q => q !== quiz);
    }, error => {
      quiz.deleting = false;
      this.error = error;
    });
  }

  fullPathToQuiz(id: string){
    return `${location.origin}/quiz/${id}`;
  }

  copyToClipboard(quiz: Quiz){
    navigator.clipboard.writeText(this.fullPathToQuiz(quiz.id));
    quiz.copying = true;
    setTimeout(() => {
      quiz.copying = false;
    }, 1000)
  }

}
