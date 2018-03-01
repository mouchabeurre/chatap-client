import { TestBed, inject } from '@angular/core/testing';

import { RoomContentService } from './room-content.service';

describe('RoomContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomContentService]
    });
  });

  it('should be created', inject([RoomContentService], (service: RoomContentService) => {
    expect(service).toBeTruthy();
  }));
});
