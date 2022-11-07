const { yesterday, dataRFC } = require('../shared/DateRFC');
const { clientCredentials } = require("../shared/GNClientConnect");
const { isAfter, addHours } = require("date-fns");
const { getToken, GNRequest } = require("../apis/gerencianet")
const authData = getToken(clientCredentials)


let token;
let create;
class ShowReceivedPixService {
    static async execute(id, start = yesterday, end = dataRFC) {
        const { accessToken, createdAt } = await authData

        token = accessToken;
        create = createdAt;

        let compareData = addHours(create, 1);

        if (isAfter(Date.now(), compareData)) {
            let { accessToken, createdAt } = await getToken(clientCredentials);

            token = accessToken;
            create = createdAt;
        }

        const reqGN = await GNRequest(token)

        const listPixResponse = await reqGN.get(`/v2/pix?inicio=${start}&fim=${end}`)

        const payload = listPixResponse.data?.pix.filter(el => el.txid === id)

        if (!payload) {
            throw new Error('invalid ID, please verify pix confirmation!')
        }

        return await reqGN.get(`/v2/pix/${payload[0].endToEndId}`)
            .then(resp => resp)
    }
}

module.exports = { ShowReceivedPixService };