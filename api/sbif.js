import axios from 'axios';

const { SBIF_URL, SBIF_API_KEY } = process.env;

const client = axios.create({
  baseURL: SBIF_URL,
});

const getUF = async () => {
  try {
    const { data } = await client.request({
      url: '/uf',
      method: 'get',
      params: {
        apikey: SBIF_API_KEY,
        formato: 'json',
      },
    });

    if (!data.UFs) {
      return Promise.reject(new Error("Cant't get daily uf"));
    }

    return data.UFs.shift();
  } catch (error) {
    console.error('Error api/sbif/getUF ::', error);

    return new Error("Cant't get daily uf");
  }
};

export default { getUF };
