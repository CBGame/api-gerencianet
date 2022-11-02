if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const GNRequest = require("./src/apis/gerencianet");

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const reqGN = await GNRequest({
    clientID: process.env.GN_CLIENT_ID,
    clientSecret: process.env.GN_CLIENT_SECRET,
  });
  const { fullname, expire, amount, cpf, user } = req.body;
  const dataCob = {
    calendario: {
      expiracao: expire,
    },
    devedor: {
      cpf: cpf,
      nome: fullname,
    },
    valor: {
      original: amount.toFixed(2),
    },
    chave: "3e4639c6-3267-4335-8c01-d309525e21ec",
    solicitacaoPagador: "Informe o número ou identificador do pedido.",
  };

  const cobResponse = await reqGN.post("v2/cob", dataCob);
  const qrcodeResponse = await reqGN.get(
    `/v2/loc/${cobResponse.data.loc.id}/qrcode`,
    dataCob
  );

  const data = {
    user,
    total: amount,
    qrcode: qrcodeResponse.data,
    status: "pending",
    txid: cobResponse.data.txid,
  };

  res.send(data);
});

app.post("/webhook(/pix)?", async (req, res) => {
  console.log(req.body);
  const { pix } = req.body;
  return console.log(pix);
  res.send(200);
});

app.listen(8000, () => console.log("server running"));
