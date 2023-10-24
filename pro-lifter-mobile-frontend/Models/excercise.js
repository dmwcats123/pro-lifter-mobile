class Exercise {
  constructor(name, weightPerSet, repsPerSet) {
    this.name = name;
    // weight is a numeric value representing the weight lifted in each rep
    this.weightPerSet = weightPerSet;

    // repsPerSet is an array where each element represents the number of reps in a set
    // For example: [5, 5, 5] means the exercise includes 3 sets, each with 5 reps
    this.repsPerSet = repsPerSet;
  }
}
