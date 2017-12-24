import { Person } from './models';

describe('Person model', () => {
  it('should provide a constructor', () => {
    const name = 'Zoe';
    const salary = 235711;
    const cohort = 'A';

    const person = new Person(name, salary, cohort);

    expect(person.name).toBe(name);
    expect(person.salary).toBe(salary);
    expect(person.cohort).toBe(cohort);
  });

  describe('equals method', () => {
    it('should compare two people', () => {
      const person = new Person('A', 0, 'A');
      const samePerson = new Person('A', 0, 'A');

      const sameName = new Person('A', 1, 'B');
      const sameSalary = new Person('B', 0, 'B');
      const sameCohort = new Person('B', 1, 'A');

      expect(person.equals(samePerson)).toBe(true);

      expect(person.equals(sameName)).toBe(false);
      expect(person.equals(sameSalary)).toBe(false);
      expect(person.equals(sameCohort)).toBe(false);
    });
  });

  describe('fromString method', () => {
    it('should create a new Person from a string', () => {
      expect(Person.fromString('Alice,123,A')).toEqual(new Person('Alice', 123, 'A'));
    });

    it('should strip out whitespace', () => {
      expect(Person.fromString('  Edwina  ,  654  ,  E  '))
          .toEqual(new Person('Edwina', 654, 'E'));
    });

    it('should handle bad data', () => {
      expect(Person.fromString('Farah,A')).toEqual(new Person('Farah', 0, ''));
    });
  });
});
