import { TestBed } from '@angular/core/testing';

import { JobApplicationService } from './job-application.service';

describe('JobService', () => {
  let service: JobApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});