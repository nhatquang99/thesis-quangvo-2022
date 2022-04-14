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

const imageUploadPath = "./";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`);
  },
});

const imageUpload = multer({ storage: storage });

const PINATA_API_KEY = "54a549f6a61daf973e52";
const PINATA_SECRET_KEY =
  "ede6cdf66c55e13687516b8e69f6829da5110385215cc2dac882c5ae771d33b4";

app.post(
  "/api/pinFileToIPFS",
  imageUpload.array("my-image-file"),
  async (req, res) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let fd = new FormData();
    fd.append(
      "file",
      fs.createReadStream(`./${req.files[0].filename}`)
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
      console.log(error.message);
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

const PORT = 4500;

app.listen(PORT, console.log(`Connected in development to port ${PORT}`));
