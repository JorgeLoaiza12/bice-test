const ageLimit = 65;
const insuranceCosts = {
  health: {
    0: 0.279,
    1: 0.4396,
    2: 0.5599,
  },
  dental: {
    0: 0.12,
    1: 0.195,
    2: 0.248,
  },
};

export default class Worker {
  constructor({ age, childs, companyPercentage, hasDentalCare }) {
    this.age = age;
    this.childs = childs;
    this.companyPercentage = companyPercentage;
    this.workerPercentage = 100 - companyPercentage;
    this.hasDentalCare = hasDentalCare;
  }

  getSegment() {
    if (this.childs === 0) return 0;
    if (this.childs === 1) return 1;
    if (this.childs >= 2) return 2;
  }

  calculatePolicyCost() {
    if (this.age > ageLimit) {
      return {
        company: {
          healthCost: 0,
          dentalCost: 0,
        },
        worker: {
          healthCost: 0,
          dentalCost: 0,
        },
        isCovered: false,
      };
    }

    return {
      company: {
        healthCost: (insuranceCosts.health[this.getSegment()] * this.companyPercentage) / 100,
        dentalCost: this.hasDentalCare
          ? (insuranceCosts.dental[this.getSegment()] * this.companyPercentage) / 100
          : 0,
      },
      worker: {
        healthCost: (insuranceCosts.health[this.getSegment()] * this.workerPercentage) / 100,
        dentalCost: this.hasDentalCare
          ? (insuranceCosts.dental[this.getSegment()] * this.workerPercentage) / 100
          : 0,
      },
      isCovered: true,
    };
  }
}
