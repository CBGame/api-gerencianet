const { clientCredentials } = require("../shared/GNClientConnect");
const { isAfter, addHours } = require("date-fns");
const { getToken, GNRequest } = require("../apis/gerencianet");

const authData = getToken(clientCredentials);

let token;
let create;

class QrCodeService {
  static async execute({ amount, cpf, fullname }) {
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
        expiracao: 3600,
      },
      devedor: {
        cpf: cpf,
        nome: fullname,
      },
      valor: {
        original: amount?.toFixed(2),
      },
      chave: "3e4639c6-3267-4335-8c01-d309525e21ec",
      solicitacaoPagador: "CBGJogo.com.br",
    };

    const cobResponse = await reqGN.post("/v2/cob", dataCob);

    return await reqGN
      .get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`)
      .then((resp) => resp);
  }
}

module.exports = { QrCodeService };
