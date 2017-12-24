import { InMemoryPersonService } from './in-memory-person.service';

describe('InMemoryPersonService', () => {
  const service = new InMemoryPersonService();

  it('should provide a default set of people', () => {
    expect(service.createDb()['people'].length).toBe(10);
  });
});
