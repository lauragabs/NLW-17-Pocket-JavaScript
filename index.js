const {select, input} = require('@inquirer/prompts')

let meta = {
    value: 'Tomar café da manhã',
    checked: false,
}

let metas = [ meta ]

const cadastrarMetas = async () => {
    const meta = await input [{mensage: 'Digite nova meta:'}]

    if (meta.length  == 0) {
        console.log('Meta não pode ser vazia')
        return
    }

    metas.push(
        { value: meta, checked: false }
    )

}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    if(respostas.length == 0) {
        console.log("Nenhuma meta selecionada!")
        return
    }

    metas.forEach((m) => {
        m.checked = false
    })

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    console.log('Meta(s) marcadas como concluída(s)')

}

const metasRealizadas  = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0){
        console.log('Nenhuma meta concluída')
    }

    await select({
        mensage: 'Metas Realizadas',
        choices: [...realizadas],
    })
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
                    name: 'Metas realizadas',
                    value: 'metasRealizadas'
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
                console.log(metas)
                break;
            case "listar":
                await listarMetas
                break;
            case "realizadas":
                await metasRealizadas
                break;
            case "sair":
                console.log('Até a próxima!')
                return
            
        }
    }
}
start ()