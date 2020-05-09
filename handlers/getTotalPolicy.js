import axios from 'axios';

/**
 * Calculate health life policy cost by one worker
 * @param {object} person
 * @param {number} percent
 */
const calculatehealthLifeCost = (person, percent) => {
  let costUF = 0;
  let calculatePercentage = 0;

  if (person.childs === 1) {
    calculatePercentage = percent * 0.4396;
    costUF = calculatePercentage / 100;
  } else if (person.childs > 1) {
    calculatePercentage = percent * 0.5599;
    costUF = calculatePercentage / 100;
  } else {
    calculatePercentage = percent * 0.279;
    costUF = calculatePercentage / 100;
  }

  return costUF;
};

/**
 * Calculate dental policy cost by one worker
 * @param {object} person
 * @param {number} percent
 */
const calculateDentalCost = (person, percent) => {
  let costUF = 0;
  let calculatePercentage = 0;

  if (person.childs === 1) {
    calculatePercentage = percent * 0.195;
    costUF = calculatePercentage / 100;
  } else if (person.childs > 1) {
    calculatePercentage = percent * 0.248;
    costUF = calculatePercentage / 100;
  } else {
    calculatePercentage = percent * 0.12;
    costUF = calculatePercentage / 100;
  }

  return costUF;
};

export const handler = (event, context, cb) => {
  return axios
    .get('https://dn8mlk7hdujby.cloudfront.net/interview/insurance/policy')
    .then((response) => {
      if (!!response.data && !!response.data.policy) {
        const workers = response.data.policy.workers;
        const percentCovered = response.data.policy.company_percentage;
        let totalCostCLP = 0;
        let totalCostUF = 0;

        // Add to all workers the healthLifeCost and dentalPolicyCost
        const resultWorkers = workers.map((person) => {
          person.healthLifeCost = calculatehealthLifeCost(
            person,
            percentCovered
          );
          person.dentalPolicyCost = calculateDentalCost(person, percentCovered);

          return person;
        });

        // Calculate total cost of all workers in uf
        for (var i in resultWorkers) {
          totalCostUF +=
            resultWorkers[i].healthLifeCost + resultWorkers[i].dentalPolicyCost;
        }

        // Calculate total cost of all workers in clp
        totalCostCLP = totalCostUF * 28716.52;

        return cb(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          data: {
            resultWorkers,
            totalCostUF,
            totalCostCLP,
          },
        });
      }

      throw { message: 'Fail request to policy data' };
    })
    .catch((error) => {
      return cb(
        {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          error: error.message || error.data,
        },
        null
      );
    });
};
