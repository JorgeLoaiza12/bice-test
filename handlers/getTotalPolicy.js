import Worker from '../lib/Worker';
import { Insurance, SBIF } from '../api';

export const handler = async () => {
  try {
    const {
      workers: workersData,
      company_percentage: companyPercentage,
      has_dental_care: hasDentalCare,
    } = await Insurance.getPolicy();
    const { Valor } = await SBIF.getUF();
    const ufValue = Number(Valor.replace('.', '').replace(',', '.'));

    // Add to all workers the healthLifeCost and dentalPolicyCost
    const workers = workersData.map((workerInfo) => {
      const worker = new Worker({ ...workerInfo, companyPercentage, hasDentalCare });

      return worker.calculatePolicyCost();
    });

    // Calculate total company cost of all workers in uf
    const totalCompanyCostUF = workers
      .reduce((acum, { company }) => acum + (company.healthCost + company.dentalCost), 0)
      .toFixed(2);

    // Calculate total workers cost of all workers in uf
    const totalWorkerCostUF = workers
      .reduce((acum, { worker }) => acum + (worker.healthCost + worker.dentalCost), 0)
      .toFixed(2);

    // Calculate total company cost of all workers in clp
    const totalCompanyCostCLP = (totalCompanyCostUF * Number(ufValue)).toFixed(0);

    // Calculate total workers cost of all workers in clp
    const totalWorkerCostCLP = (totalWorkerCostUF * Number(ufValue)).toFixed(0);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          workers,
          totalCompanyCostUF,
          totalWorkerCostUF,
          totalCompanyCostCLP,
          totalWorkerCostCLP,
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        data: {
          error: error.message,
          stackTrace: error.stack,
        },
      }),
    };
  }
};
