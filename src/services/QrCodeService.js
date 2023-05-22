const { clientCredentials } = require("../shared/GNClientConnect");
const { isAfter, addHours } = require("date-fns");
const { getToken, GNRequest } = require("../apis/gerencianet");

const authData = getToken(clientCredentials);

let token;
let create;

class QrCodeService {
  static async execute({ amount, cpf, fullname, expire }) {
    const { accessToken, createdAt } = await authData;

    token = accessToken;
    create = createdAt;

    let compareData = addHours(create, 1);

    if (isAfter(Date.now(), compareData)) {
      let { accessToken, createdAt } = await getToken(clientCredentials);

      token = accessToken;
      create = createdAt;
    }

    const reqGN = await GNRequest(token);

    const dataCob = {
      calendario: {
        expiracao: expire,
      },
      devedor: {
        cpf: cpf,
        nome: fullname,
      },
      valor: {
        original: amount?.toFixed(2),
      },
      chave: "c539a4a9-d2ae-48bf-8147-e1896886e4b2",
      solicitacaoPagador: "Payment Bicho da Sorte🍀",
    };

    const cobResponse = await reqGN.post("/v2/cob", dataCob);
    const qrCodeResponse = await reqGN.get(
      `/v2/loc/${cobResponse.data.loc.id}/qrcode`
    );

    console.log(qrCodeResponse);

    return { cob: cobResponse.data, qrcode: qrCodeResponse.data };
  }
}

module.exports = { QrCodeService };
