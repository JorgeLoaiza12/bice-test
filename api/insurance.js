import axios from 'axios';

const { INSURANCE_URL } = process.env;

const client = axios.create({
  baseURL: INSURANCE_URL,
});

const getPolicy = async () => {
  try {
    const { data } = await client.request({
      url: '/policy',
      method: 'get',
    });

    if (!data.policy) {
      return Promise.reject(new Error("Cant't get policy"));
    }

    return data.policy;
  } catch (error) {
    console.error('Error api/insurance/getPolicy ::', error);

    return new Error("Cant't get policy");
  }
};

export default { getPolicy };
