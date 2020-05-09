export default class Person {
  constructor(props) {
    this.age = props.age;
    this.childs = props.childs;
  }

  calculatePolicyCost(type, percent) {
    // Object with diferent types of policies and prices
    const healthCosts = {
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

    /**
     * If person has 0 childs return 0
     * If person has 1 childs return 1
     * If person has 2 or more childs return 2
     */
    const costType = this.childs === 0 ? 0 : this.childs === 1 ? 1 : 2;
    // Find the cost by person in the object
    const costWithoutDiscount = healthCosts[type][costType];
    const total = (percent * costWithoutDiscount) / 100;

    return total;
  }
}
