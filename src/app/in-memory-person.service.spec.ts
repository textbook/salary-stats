import { InMemoryPersonService } from './in-memory-person.service';

describe('InMemoryPersonService', () => {
  let service = new InMemoryPersonService();

  it('should provide a default set of people', () => {
    expect(service.createDb()['people'].length).toBe(10);
  });
});
