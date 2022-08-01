import { TestBed } from '@angular/core/testing';

import { QuizAdminService } from './quiz-admin.service';

describe('QuizAdminService', () => {
  let service: QuizAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
