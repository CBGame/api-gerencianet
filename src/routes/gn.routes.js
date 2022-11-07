const { Router } = require("express");
const { pixController } = require("../controllers/PixController");
const { reqGNAlready } = require("../shared/GNClientConnect");

const pixRoutes = Router();

pixRoutes.post("/", pixController.qrcodeGen);
pixRoutes.get("/cobrancas", pixController.cobList);
pixRoutes.get("/relatorio", pixController.pixList);
pixRoutes.get("/consulta/:id", pixController.pixShow);

module.exports = { pixRoutes };
