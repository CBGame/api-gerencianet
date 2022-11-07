const { ChargesListService } = require("../services/ChargesListService.js");
const {
  ListReceivedPixService,
} = require("../services/ListReceivedPixService.js");
const { QrCodeService } = require("../services/QrCodeService.js");
const {
  ShowReceivedPixService,
} = require("../services/ShowReceivedPixService.js");

class pixController {
  static async qrcodeGen(req, res) {
    const { cpf, amount, fullname, user } = req.body;
    try {
      await QrCodeService.execute({ amount, cpf, fullname }).then((resp) => {
        const data = {
          user,
          total: amount,
          qrcode: qrcodeResponse.data,
          status: "pending",
          txid: cobResponse.data.txid,
        };

        return res.status(200).send(data);
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  static async cobList(req, res) {
    // const { start, end } = req.query;
    try {
      await ChargesListService.execute().then((resp) =>
        res.status(200).json(resp.data)
      );
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  static async pixList(req, res) {
    try {
      await ListReceivedPixService.execute().then((resp) =>
        res.status(200).json(resp.data)
      );
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  static async pixShow(req, res) {
    const { id } = req.params;
    try {
      await ShowReceivedPixService.execute(id).then((resp) =>
        res.status(200).json(resp.data)
      );
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
}

module.exports = { pixController };
