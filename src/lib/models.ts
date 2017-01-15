export class Person {
  name: string;
  salary: number;
  cohort: string;

  static fromString(personString): Person {
    // e.g. 'Alice,123,A' -> Person('Alice', 123, 'A')
    let [name, salaryString, cohort] = personString.split(',', 3).map(item => item.trim());
    let salary = Number.parseInt(salaryString);
    if (isNaN(salary)) {
      salary = 0;
    }
    return new Person(name, salary, cohort || '');
  }

  constructor(name: string, salary: number, cohort: string) {
    this.name = name;
    this.salary = salary;
    this.cohort = cohort;
  }

  equals(other: Person): boolean {
    let keys = Object.keys(this);
    return keys.filter(key => this[key] === other[key]).length === keys.length;
  }
}
