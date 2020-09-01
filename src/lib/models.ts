export interface Person {
  id?: number;
  name: string;
  salary: number;
  cohort: string;
}

export const fromString = (personString: string): Person => {
  // e.g. 'Alice,123,A' -> Person('Alice', 123, 'A')
  const [name, salaryString, cohort] = personString
      .split(',', 3)
      .map((item: string) => item.trim());
  let salary = Number.parseInt(salaryString, 10);
  if (isNaN(salary)) {
    salary = 0;
  }
  return { name, salary, cohort: cohort || '' };
};

export interface CohortMap {
  [name: string]: number[];
}
