import { fromString } from './models';

describe('fromString function', () => {
  it('should create a new person from a string', () => {
    expect(fromString('Alice,123,A')).toEqual({ name: 'Alice', salary: 123, cohort: 'A' });
  });

  it('should strip out whitespace', () => {
    expect(fromString('  Edwina  ,  654  ,  E  '))
        .toEqual({ name: 'Edwina', salary: 654, cohort: 'E' });
  });

  it('should handle bad data', () => {
    expect(fromString('Farah,A')).toEqual({ name: 'Farah', salary: 0, cohort: '' });
  });
});
