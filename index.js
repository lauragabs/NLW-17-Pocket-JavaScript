const { select, input, checkbox } = require('@inquirer/prompts')
const fs  = require('fs').promises

let mensagem = "App de metas"

let metas

const carregarMetas  = async () => {
    try{
        const dados = await fs.readFile('metas.json', 'utf-8')
        metas = JSON.parse(dados)
    }
    catch(erro){
        metas = []
    }
}

const salvarMetas  = async () => {
    await  fs.writeFile('metas.json', JSON.stringify(metas, null, 2))

}


const cadastrarMetas = async () => {
    const novaMeta = await input({ message: 'Digite nova meta:' })

    if (novaMeta.length == 0) {
        mensagem = 'Meta não pode ser vazia'
        return
    }

    metas.push({ value: novaMeta, checked: false })

    mensagem = 'Metas cadastradas com sucesso'

}

const listarMetas = async () => {

    if(metas.length == 0){
        mensagem = 'Nenhuma meta cadastrada' 
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if (respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!"
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = 'Meta(s) marcadas como concluída(s)'
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => meta.checked)

    if(metas.length == 0){
        mensagem = 'Nenhuma meta cadastrada' 
        return
    }

    if (realizadas.length == 0) {
        mensagem = 'Nenhuma meta concluída'
        return
    }

    await select({
        message: 'Metas Realizadas: ' + realizadas.length,
        choices: realizadas.map((meta) => ({ name: meta.value, value: meta.value })),
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => !meta.checked)

    if(metas.length == 0){
        mensagem = 'Nenhuma meta cadastrada' 
        return
    }

    if (abertas.length == 0) {
        mensagem = 'Nenhuma meta aberta'
        return
    }

    await select({
        message: 'Metas Abertas: ' + abertas.length,
        choices: abertas.map((meta) => ({ name: meta.value, value: meta.value })),
    })
}

const deletarMetas = async () => {

    if(metas.length == 0){
        mensagem = 'Nenhuma meta cadastrada' 
        return
    }

    const metasDesmarcadas = metas.map((meta) => ({
        name: meta.value,
        value: meta.value,
        checked: false
    }))

    const itensAdeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: metasDesmarcadas,
        instructions: false,
    })

    if (itensAdeletar.length == 0) {
        mensagem = 'Nenhum item para deletar'
        return
    }

    itensAdeletar.forEach((item) => {
        metas = metas.filter((meta) => meta.value != item)
    })

    mensagem =  'Metas deletadas com sucesso'

}

const mostarMensagem = () => {
    console.clear();

    if (mensagem != ""){
        console.log(mensagem)
        console.log(" ")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()

    while (true) {

        mostarMensagem()

        await salvarMetas()

        const opcao = await select({
            message: 'Menu',
            choices: [
                { name: 'Cadastrar meta', value: "cadastrar" },
                { name: 'Listar metas', value: "listar" },
                { name: 'Metas realizadas', value: "realizadas" },
                { name: 'Metas Abertas', value: "abertas" },
                { name: 'Deletar Metas', value: "deletar" },
                { name: 'Sair', value: "sair" }
            ]
        })

        switch (opcao) {
            case "cadastrar":
                await cadastrarMetas()
                console.log(metas)
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log('Até a próxima!')
                return
        }
    }
}

start()
