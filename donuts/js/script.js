//variaveis para serem ultilizadas globalmente no projeto

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
//pizzaJson donutsJson

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


const adicionarNoCarrinho = () => {
    seleciona('.pizzaInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        // pegar dados da janela modal atual
    	// qual pizza? pegue o modalKey para usar pizzaJson[modalKey]
    	console.log("Pizza " + modalKey)
    	// tamanho
	    let size = seleciona('.pizzaInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
	    // quantidade
    	console.log("Quant. " + quantDonuts)
        // preco
        let price = seleciona('.pizzaInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        // crie um identificador que junte id e tamanho
	    // concatene as duas informacoes separadas por um símbolo, vc escolhe
	    let identificador = donutsJson[modalKey].id+'t'+size

        // antes de adicionar verifique se ja tem aquele codigo e tamanho
        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantDonuts
        } else {
            // adicionar objeto pizza no carrinho
            let pizza = {
                identificador,
                id: donutsJson[modalKey].id,
                size, // size: size
                qt: quantDonuts,
                price: parseFloat(price) // price: price
            }
            cart.push(pizza)
            console.log(pizza)
            console.log('Sub total R$ ' + (pizza.qt * pizza.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// use o find para pegar o item por id
			let pizzaItem = donutsJson.find( (item) => item.id == cart[i].id )
			console.log(pizzaItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let pizzaSizeName = cart[i].size

			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = pizzaItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		// fora do for
		// calcule desconto 10% e total
		//desconto = subtotal * 0.1
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
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

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()