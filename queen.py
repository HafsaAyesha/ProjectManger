from typing import Dict, List, Optional

# ---------- Constraint Base Class ----------
class Constraint:
    def __init__(self, variables: List[str]) -> None:
        self.variables = variables

    def satisfied(self, assignment: Dict[str, int]) -> bool:
        raise NotImplementedError


# ---------- CSP Base Class ----------
class CSP:
    def __init__(self, variables: List[str], domains: Dict[str, List[int]]) -> None:
        self.variables = variables
        self.domains = domains
        self.constraints: Dict[str, List[Constraint]] = {}

        # Each variable gets an empty constraints list
        for variable in self.variables:
            self.constraints[variable] = []

    def add_constraint(self, constraint: Constraint) -> None:
        for variable in constraint.variables:
            self.constraints[variable].append(constraint)

    def consistent(self, variable: str, assignment: Dict[str, int]) -> bool:
        # Check all constraints for this variable
        for constraint in self.constraints[variable]:
            if not constraint.satisfied(assignment):
                return False
        return True

    # Backtracking search algorithm
    def backtracking_search(self, assignment: Dict[str, int] = {}) -> Optional[Dict[str, int]]:
        # If all variables assigned → success
        if len(assignment) == len(self.variables):
            return assignment

        # Choose an unassigned variable
        unassigned = [v for v in self.variables if v not in assignment]
        first = unassigned[0]

        # Try every domain value
        for value in self.domains[first]:
            new_assignment = assignment.copy()
            new_assignment[first] = value
            if self.consistent(first, new_assignment):
                result = self.backtracking_search(new_assignment)
                if result is not None:
                    return result
        
        return None


# ---------------------------------------------------------
# ---------- Queens Constraint ----------
class QueensConstraint(Constraint):
    def __init__(self, queen1: str, queen2: str) -> None:
        super().__init__([queen1, queen2])
        self.queen1 = queen1
        self.queen2 = queen2

    def satisfied(self, assignment: Dict[str, int]) -> bool:
        # If either queen is unassigned → no conflict
        if self.queen1 not in assignment or self.queen2 not in assignment:
            return True
        
        row1 = assignment[self.queen1]
        row2 = assignment[self.queen2]

        col1 = int(self.queen1[-1])
        col2 = int(self.queen2[-1])

        # 1. Same row → attack
        if row1 == row2:
            return False

        # 2. Same diagonal → attack
        if abs(row1 - row2) == abs(col1 - col2):
            return False

        return True


# ---------- Define Variables and Domains ----------
variables = ["Q1", "Q2", "Q3", "Q4"]
domains = {var: [1, 2, 3, 4] for var in variables}

# ---------- Create CSP ----------
csp = CSP(variables, domains)

# Add constraints for each pair of queens
for i in range(len(variables)):
    for j in range(i + 1, len(variables)):
        csp.add_constraint(QueensConstraint(variables[i], variables[j]))

# ---------- Solve ----------
solution = csp.backtracking_search()

# ---------- Print Result ----------
if solution is None:
    print("No solution found!")
else:
    print("Solution:", solution)
