import axios from 'axios';
import Person from '../lib/Person';
const UF_VALUE = 28716.52;

export const handler = (event, context, cb) => {
  return axios
    .get('https://dn8mlk7hdujby.cloudfront.net/interview/insurance/policy')
    .then((response) => {
      if (!!response.data && !!response.data.policy) {
        const workers = response.data.policy.workers;
        const percent = response.data.policy.company_percentage;
        let totalCostCLP = 0;
        let totalCostUF = 0;

        // Add to all workers the healthLifeCost and dentalPolicyCost
        const resultWorkers = workers.map((person) => {
          const personObject = new Person(person); // new instance of person

          return {
            ...personObject,
            healthLife: personObject.calculatePolicyCost('health', percent),
            dental: personObject.calculatePolicyCost('dental', percent),
          };
        });

        // Calculate total cost of all workers in uf
        for (var i in resultWorkers) {
          totalCostUF += resultWorkers[i].healthLife + resultWorkers[i].dental;
        }

        // Calculate total cost of all workers in clp
        totalCostCLP = totalCostUF * UF_VALUE;

        return cb(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          data: {
            workers: resultWorkers,
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
