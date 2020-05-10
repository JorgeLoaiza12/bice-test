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

  getHealthCost(type) {
    return this.isCovered() ? (insuranceCosts.health[this.getSegment()] * this[type]) / 100 : 0;
  }

  getDentalCost(type) {
    if (this.hasDentalCare) {
      return this.isCovered() ? (insuranceCosts.dental[this.getSegment()] * this[type]) / 100 : 0;
    }

    return 0;
  }

  isCovered() {
    return this.age <= ageLimit;
  }

  getInfo() {
    return {
      age: this.age,
      childs: this.childs,
      companyPercentage: this.companyPercentage,
      workerPercentage: this.workerPercentage,
      hasDentalCare: this.hasDentalCare,
    };
  }

  calculatePolicyCost() {
    return {
      ...this.getInfo(),
      company: {
        healthCost: this.getHealthCost('companyPercentage'),
        dentalCost: this.getDentalCost('companyPercentage'),
      },
      worker: {
        healthCost: this.getHealthCost('workerPercentage'),
        dentalCost: this.getDentalCost('workerPercentage'),
      },
      isCovered: this.isCovered(),
    };
  }
}
