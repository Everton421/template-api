"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectForma_pagamento = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class SelectForma_pagamento {
    async buscaGeral(empresa) {
        return new Promise(async (resolve, reject) => {
            let sql = ` select * from ${empresa}.forma_pagamento  `;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }
}
exports.SelectForma_pagamento = SelectForma_pagamento;
