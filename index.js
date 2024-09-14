const { select, input } = require('@inquirer/prompts')

let meta = {
    value: 'Tomar café da manhã',
    checked: false,
}

let metas = [meta]

const cadastrarMetas = async () => {
    const meta = await input[{ mensage: 'Digite nova meta:' }]

    if (meta.length == 0) {
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

    metas.forEach((m) => {
        m.checked = false
    })

    if (respostas.length == 0) {
        console.log("Nenhuma meta selecionada!")
        return
    }


    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    console.log('Meta(s) marcadas como concluída(s)')

}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0) {
        console.log('Nenhuma meta concluída')
    }

    await select({
        mensage: 'Metas Realizadas' + realizadas.length,
        choices: [...realizadas],
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return !meta.checked
    })

    if(abertas.length == 0){
        console.log('Nenhuma meta aberta')
        return 
    }

    await select({
        mensage: 'Metas Abertas' +  abertas.length,

        choices: [...abertas]
    })
}

const deletarMetas  = async () => {
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })

    const itensAdeletar = await checkbox({
        message: "Selecione item para  deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if (itensAdeletar.length == 0){
        console.log('Nenhum item para deletar')
        return
    }

    itensAdeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return  meta.value != item
        })

        console.log("Meta(s) deletada(s) com sucesso")
    })

}



const start = async () => {

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
                    value: 'realizadas'
                },
                {
                    name: 'Metas Abertas',
                    value: 'abertas'
                },
                {
                    name: 'Deletar Metas',
                    value: 'deletar'
                },
                {
                    name: 'Sair',
                    value: 'sair'
                }
            ]
        })

        switch (opcao) {
            case "cadastar":
                await cadastrarMetas
                console.log(metas)
                break
            case "listar":
                await listarMetas
                break
            case "realizadas":
                await metasRealizadas
                break
            case "abertas":
                await metasAbertas
                break
            case  "deletar":
                await deletarMetas
                break
            case "sair":
                console.log('Até a próxima!')
                return

        }
    }
}
start()