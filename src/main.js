import api from './api';

class App{

    // construtor
    constructor(){

        // lista de repositorios
        // this.repositorios = [];
        this.repositorios = JSON.parse(localStorage.getItem('repositorios')) || [];

        // form
        this.formulario = document.querySelector('form');

        // lista
        this.lista = document.querySelector('.list-group');

        // metodo para registrar eventos do form
        this.registrarEventos();
    }

    registrarEventos(){
        this.formulario.onsubmit = evento => this.adicionarRepositorio(evento);
    }

    deletarRepositorio(lst){
        // remove o repositorio da lista
        this.repositorios.splice(lst.textContent, 1);
    
        // executando a função para renderizar os repositorios da lista
        this.renderizarTela();
    
        // salva os dados no storage
        this.salvaDadosStorage();
    }

    salvaDadosStorage(){
        localStorage.setItem('repositorios', JSON.stringify(this.repositorios));
    }


    async adicionarRepositorio(evento){
        // evita que o formulario recarregue a pagina
        evento.preventDefault();

        // recuperar o valor do input
        let input = this.formulario.querySelector('input[id=repositorio').value;

        // se o input vier vazio... sai da aplicacao
        if(input.lenght === 0){
            return; // o return sempre sai da funcao
        }

        // ativa a mensagem de carregamento
        this.apresentarBuscando();

        try{
            let response = await api.get(`/repos/${input}`);

            // console.log(response);

            let {name, description, html_url, owner: {avatar_url}} = response.data;

            // adiciona o repositorio na lista
            this.repositorios.push({
                nome: name,
                descricao: description,
                avatar_url,
                link: html_url
            })

            // salvando dados na storage
            this.salvaDadosStorage();

            // renderizar a tela
            this.renderizarTela();

        }catch(erro){
            // limpa buscando pra substituir pelo erro
            this.lista.removeChild(document.querySelector('.list-group-item-warning'));

            // limpar erro existente
            let er = this.lista.querySelector('.list-group-item-danger');

            if(er != null){
                this.lista.removeChild(er);
            }
            
            // <li>
            let li = document.createElement('li');
            li.setAttribute('class', 'list-group-item list-group-item-danger');
            let txtErro = document.createTextNode(`O repositório ${input} não existe.`);
            li.appendChild(txtErro);
            this.lista.appendChild(li);
        }
    }

    apresentarBuscando(){
        // <li>
        let li = document.createElement('li');
        li.setAttribute('class', 'list-group-item list-group-item-warning');
        let txtBuscando = document.createTextNode(`Aguarde, Buscando o repositório...`);
        li.appendChild(txtBuscando);
        this.lista.appendChild(li);
    }


    renderizarTela(){
        // limpar o conteudo da lista
        this.lista.innerHTML = '';


        // percorrer a lista de rep e criar os elementos
        this.repositorios.forEach(repositorio => {
            // <li/>
            let li = document.createElement('li');
            li.setAttribute('class', 'list-group-item list-group-item-action');

            // <img>
            let img = document.createElement('img');
            img.setAttribute('src', repositorio.avatar_url);
            
            // adicionando a imagem a lista
            li.appendChild(img)

            // <strong>
            let strong = document.createElement('strong');
            let txtNome = document.createTextNode(repositorio.nome);
            strong.appendChild(txtNome);

            // adicionando o strong a lista
            li.appendChild(strong);

            // <p>
            let p = document.createElement('p');
            let txtDescricao = document.createTextNode(repositorio.descricao);
            p.appendChild(txtDescricao);
            
            // adicionando o paragrafo a lista
            li.appendChild(p);
            

            // <a>
            let a = document.createElement('a');
            a.setAttribute('target', '_blank');
            a.setAttribute('href', repositorio.link);
            let txtA = document.createTextNode('Acessar');
            a.appendChild(txtA);

            // adiciona o link a lista
            li.appendChild(a);

            // adicionar a lista como filho da ul
            this.lista.appendChild(li);

            // deletar repositorio
            let deletar = this.lista.appendChild(li);

            li.onclick = () => {this.deletarRepositorio(deletar)} 

            // limpar o conteudo do input
            this.formulario.querySelector('input[id=repositorio]').value = '';

            // adcionar o foco no input (digitar sem o mouse estar em cima da caixa de input)
            this.formulario.querySelector('input[id=repositorio]').focus(); 

        })
    }
}

new App().renderizarTela();