import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const PINATA_API_KEY = "979185e89478d3eae88e";
const PINATA_SECRET_KEY = "bdc82d52975a0370bbfc4ff5710f7261775feba4486c1d359a5493fa9d1cc183";

export const pinFileToIPFS = async (payload) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  
    let fd = new FormData();
    fd.append("file", fs.createReadStream(payload.data));
  
    const metadata = JSON.stringify(payload.metadata);

    fd.append("pinataMetadata", metadata);
  
    const res = await axios
      .post(url, fd, {
        maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
        headers: {
          "Content-Type": `multipart/form-data; boundary=${fd._boundary}`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      })
    
    return res.data;
};

export const pinJSONToIPFS = async (payload) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    const res = await axios
        .post(url, JSON.stringify(payload.data), {
            headers: {
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY
            }
        });
    return res.data;
};

export const getHashValue = async (payload) => {
    const res = await axios.get(`https://gateway.pinata.cloud/ipfs/${payload.data}`, {
        headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY
        }
    })
    
    return JSON.parse(Object.keys(res.data)[0]);
}

export const getImage = async (payload) => {
    const res = await axios.get(`https://gateway.pinata.cloud/ipfs/${payload.data}`, {
        headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY
        }
    })
    
    return res.data;
}

let payload = {
    data: 'Qmdp4YcxDatg2xCDguz5ce52nobZMrHYyqj4m2Tw2ozWCU'
}

const data = await getImage(payload);
console.log('--------------\n', data);
