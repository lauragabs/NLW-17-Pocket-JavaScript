const {select, input} = require('@inquirer/prompts')

const cadastrarMetas = async () => {
    const meta = await input [{mensage: 'Digite nova meta:'}]

    if (meta.length  == 0) {
        console.log('Meta não pode ser vazia')
        return
    }

}

const start = async() => {

    while (true) {

        const opcao = await select({
            message: 'Menu >',
            choices: [
                {
                    name: 'Cadastrar meta',
                    value: 'cadastrar'
                },
                {
                    name: 'Listar metas',
                    value: 'listar'
                },
                {
                    name: 'Sair',
                    value: 'sair'
                }
            ]
        })
        
        switch (opcao){
            case "cadastar":
                await cadastrarMetas
                break;
            case "listar":
                listarMetas
                break;
            case "sair":
                return
            
        }
    }
}
start ()