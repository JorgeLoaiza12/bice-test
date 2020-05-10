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

      return { ...worker.calculatePolicyCost() };
    });

    const [totalCompanyCostUF, totalWorkerCostUF] = workers.reduce(
      (acum, { company, worker }) => {
        return [
          // Calculate total company cost of all workers in uf
          (acum[0] += company.healthCost + company.dentalCost),
          // Calculate total worker cost of all workers in uf
          (acum[1] += worker.healthCost + worker.dentalCost),
        ];
      },
      [0, 0]
    );

    // Calculate total company cost of all workers in clp
    const totalCompanyCostCLP = totalCompanyCostUF * Number(ufValue);

    // Calculate total workers cost of all workers in clp
    const totalWorkerCostCLP = totalWorkerCostUF * Number(ufValue);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          workers,
          totalCompanyCostUF: Number(totalCompanyCostUF.toFixed(2)),
          totalWorkerCostUF: Number(totalWorkerCostUF.toFixed(2)),
          totalCompanyCostCLP: Number(totalCompanyCostCLP.toFixed(0)),
          totalWorkerCostCLP: Number(totalWorkerCostCLP.toFixed(0)),
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
