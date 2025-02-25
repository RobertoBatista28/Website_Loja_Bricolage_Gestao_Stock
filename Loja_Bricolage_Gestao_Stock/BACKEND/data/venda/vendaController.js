function vendaController(VendaModel) {
    let controller = {
        create,
        findAll,
        update,
        findByNrVenda,
        removeByNrVenda,
        findByUsername,
        findByNrVendaAndUsername,
        findCarrinho,
        gerarAutoIncremental,
        findFinalizada
    };

    function create(values) {
        let newVenda = VendaModel(values);
        return save(newVenda);
    }

    function save(newVenda) {
        return new Promise(function (resolve, reject) {
            newVenda
                .save()
                .then(() => resolve("A venda foi adicionada com sucesso."))
                .catch((err) => reject(err));
        });
    }

    function findAll() {
        return new Promise(function (resolve, reject) {
            VendaModel.find({})
                .then((vendas) => resolve(vendas))
                .catch((err) => reject(err));
        });
    }

    function findByNrVenda(nrVenda) {
        return new Promise(function (resolve, reject) {
            VendaModel.findOne({ nrVenda: nrVenda })
                .then((venda) => resolve(venda))
                .catch((err) => reject(err));
        });
    }

    function findByUsername(usernameUtilizador) {
        return new Promise(function (resolve, reject) {
            VendaModel.find({ 'cliente.usernameUtilizador' : usernameUtilizador })
                .then((vendas) => {
                    if (vendas.length === 0) {
                        reject("Nenhuma venda encontrada para este utilizador.");
                        return;
                    }
                    resolve(vendas);
                })
                .catch((err) => reject(err));
        });
    }

    function findByNrVendaAndUsername(nrVenda, username) {
        return new Promise(function (resolve, reject) {
            VendaModel.findOne({ nrVenda, 'cliente.usernameUtilizador': username })
                .then((venda) => {
                    if (!venda) {
                        reject("Nenhuma venda encontrada para este número de venda e usernameUtilizador.");
                        return;
                    }
                    resolve(venda);
                })
                .catch((err) => reject(err));
        });
    }

    function update(nrVenda, venda) {
        return new Promise(function (resolve, reject) {
            VendaModel.findOneAndUpdate({ nrVenda }, venda)
                .then(() => resolve(venda))
                .catch((err) => reject(err));
        });
    }

    function removeByNrVenda(nrVenda) {
        return new Promise(function (resolve, reject) {
            VendaModel.findOneAndDelete({ nrVenda: nrVenda })
                .then((venda) => {
                    if (!venda) {
                        reject("Não foi possível encontrar uma venda com essa referência!");
                    }
                    resolve();
                })
                .catch((err) => reject(err));
        });
    }

    function findCarrinho(usernameUtilizador) {
        return new Promise(function (resolve, reject) {
            VendaModel.find({
                'cliente.usernameUtilizador': usernameUtilizador,
                'estado': 'Carrinho'
            })
            .then((vendas) => resolve(vendas))
            .catch((err) => reject(err));
        });
    }

    function findFinalizada(usernameUtilizador) {
        return new Promise(function (resolve, reject) {
            VendaModel.find({
                'cliente.usernameUtilizador': usernameUtilizador,
                'estado': 'Finalizada'
            })
            .then((vendas) => resolve(vendas))
            .catch((err) => reject(err));
        });
    }

    function gerarAutoIncremental() {
        return new Promise(function (resolve, reject) {
            VendaModel.find({}).sort({ nrVenda: 1 })
                .then((vendas) => {
                    if (vendas.length === 0) {
                        resolve(1); // Se não houver vendas, retorna 1
                    } else {
                        let ultimoNrVenda = vendas[vendas.length - 1].nrVenda;
                        resolve(ultimoNrVenda + 1); // Retorna o próximo número de venda disponível
                    }
                })
                .catch((err) => reject(err));
        });
    }

    return controller;
}

module.exports = vendaController;
