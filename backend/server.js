const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const FormData = require("form-data");
const fs = require("fs");
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();

app.use(cors());
app.options("*", cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const imageUploadPath = "D:/Thesis/Ethereum/Thesis_QuangVo_2021/upload-images";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`);
  },
});

const imageUpload = multer({ storage: storage });

const PINATA_API_KEY = "979185e89478d3eae88e";
const PINATA_SECRET_KEY =
  "bdc82d52975a0370bbfc4ff5710f7261775feba4486c1d359a5493fa9d1cc183";

app.post(
  "/api/pinFileToIPFS",
  imageUpload.array("my-image-file"),
  async (req, res) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let fd = new FormData();
    fd.append(
      "file",
      fs.createReadStream(`./upload-images/${req.files[0].filename}`)
    );

    try {
      const response = await axios.post(url, fd, {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${fd._boundary}`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      });

      fs.unlinkSync(req.files[0].path);
      res.status(200).json(response.data);
    } catch (error) {
      console.log("------------ERROR---------", error.message);
    }
  }
);

app.post('/api/pinJsonToIPFS', async (req, res) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    const response = await axios
        .post(url, JSON.stringify(req.body), {
            headers: {
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY
            }
        });
      res.status(200).json(response.data);
})

app.get('/api/getJsonFromIPFS/:hash', async (req, res) => {
  const hash = req.params.hash;

  const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`, {
        headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY
        }
    })
  
    res.status(200).json(JSON.parse(Object.keys(response.data)[0]));
})

const PORT = 5000;

app.listen(PORT, console.log(`Connected in development to port ${PORT}`));
