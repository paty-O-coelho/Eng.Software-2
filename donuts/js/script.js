let modalKey = 0
let quantDonuts = 1
let cart = []



const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos= (elemento) => document.querySelectorAll(elemento)


const formatoReal = (valor) =>{
    return valor.toLocaleString('pt-BR', {style:'currency', currency: 'BRL'})
}

const formatoMonetario = (valor) =>{
    if (valor){
        return valor.toFixed(2)
    }
}


const abrirModal = () => {
    seleciona('.pizzaWindowArea').style.opacity = 0
    seleciona('.pizzaWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.pizzaWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.pizzaWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.pizzaWindowArea').style.display = 'none', 500)
}
/*
const botoesFechar = () =>{

   
    //evento para quando apertar em cancelar ele fecha o modal com os donuts
    document.querySelector('.pizzaInfo--cancelButton').addEventListener('click',()=>{
        document.querySelector('.pizzaWindowArea').style.display='none'

    })


    //evento para voltar no modo mobile
    document.querySelector('.pizzaInfo--cancelMobileButton').addEventListener('click',()=>{
        document.querySelector('.pizzaWindowArea').style.display='none'

    })


    selecionaTodos('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) =>{
        item.addEventListener('click',fecharModal)
    })

}
*/

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDosDonuts = (donutItem, item, index) =>{
    // preencher os dados de cada donuts


        donutItem.setAttribute('data-key', index)
    donutItem.querySelector('.pizza-item--img img').src = item.img
    //item com o caminho onde esta os donuts img
    donutItem.querySelector('.pizza-item--price').innerHTML = formatoReal(item.price[2])
    //tofixed fica em 2 casas decimais
    donutItem.querySelector('.pizza-item--name').innerHTML = item.name
    donutItem.querySelector('.pizza-item--desc').innerHTML = item.description

    

}

const preencheDadosModal = (item) =>{

    //nome do donuts
    document.querySelector('.pizzaBig img').src = item.img
    document.querySelector('.pizzaInfo h1').innerHTML = item.name
    document.querySelector('.pizzaInfo--desc').innerHTML = item.description
    document.querySelector('.pizzaInfo--actualPrice').innerHTML = formatoReal(item.price[2])
    
}

const pegarKey = (e) => {
    let key = e.target.closest('.pizza-item').getAttribute('data-key')
    console.log('donuts ' + key)
    console.log(donutsJson[key])

    quantDonuts = 1

    modalKey = key

    return key

}

const preencherTamanhos = (key) => {
    //tirar a seleção do tamanho por ultimo
    seleciona('.pizzaInfo--size.selected').classList.remove('selected')

    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = donutsJson[key].sizes[sizeIndex]
    })


}
/*
const escolherTamanhoPreco = (key) => {
 // ação nos botoes de taamanho
 //seleciona todos os tamaanhos

 selecionaTodos('.pizzaInfo--size').forEach((size,sizeIndex) => {
    size.addEventListener('click', (e) => {
        seleciona('.pizzaInfo--size.selected').classList.remove('selected')

        size.classList.add('selected')
        seleciona('pizzaInfo--actualPrice').innerHTML = formatoReal(donutsJson[key].price[sizeIndex])
     })
    }) 
}
*/
const escolherTamanhoPreco = (key) => {
    // Ações nos botões de tamanho
    // selecionar todos os tamanhos
    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
            // tirar a selecao de tamanho atual e selecionar o tamanho grande
            seleciona('.pizzaInfo--size.selected').classList.remove('selected')
            // marcar o que vc clicou, ao inves de usar e.target use size, pois ele é nosso item dentro do loop
            size.classList.add('selected')

            // mudar o preço de acordo com o tamanho
            seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(donutsJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.pizzaInfo--qtmais').addEventListener('click', () => {
        quantDonuts++
        seleciona('.pizzaInfo--qt').innerHTML = quantDonuts
    })

    seleciona('.pizzaInfo--qtmenos').addEventListener('click', () => {
        if(quantDonuts > 1) {
            quantDonuts--
            seleciona('.pizzaInfo--qt').innerHTML = quantDonuts	
        }
    })
}



donutsJson.map((item, index ) => {
    //console.log(item)
    let donutItem = document.querySelector('.models .pizza-item').cloneNode(true)
    //clone node faz uma copia de todos os elementos que estao dentro do objeto (true)
    console.log(donutItem)
    // document.querySelector('.pizza-area').append(donutItem)
    seleciona('.pizza-area').append(donutItem)
    // esse append sera chamadao quando vezes os donuts foram adicionados

    preencheDadosDosDonuts(donutItem, item, index)



    //donuts clicado
    donutItem.querySelector('.pizza-item a').addEventListener('click',(e)=> {
        e.preventDefault()

        let chave = pegarKey(e)
        //quando clicar no donuts ele vai aparecer a opção de add ou remover
        //abrir a janela modal

        // document.querySelector('.pizzaWindowArea').style.display = 'flex'
        abrirModal()
        //printar na tela os dados

        preencheDadosModal(item)

        preencherTamanhos(chave)

        seleciona('.pizzaInfo--qt').innerHTML = quantDonuts

        escolherTamanhoPreco(chave)

    })

    botoesFechar()
})

mudarQuantidade()