import { db } from './firebaseConfig.js';
import { collection, getDocs, deleteDoc, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


// READ / CONSULTAR OS DADOS DE FUNCIONÁRIOS

async function buscarFuncionarios() {
    const dadosBanco = await getDocs(collection(db, "funcionarios"));
    const funcionarios = [];
    for (const doc of dadosBanco.docs) {
        funcionarios.push({ id: doc.id, ...doc.data() });
    }
    return funcionarios;
}

const listaFuncionariosDiv = document.getElementById("listar-funcionarios");

async function carregarListaDeFuncionarios() {
    listaFuncionariosDiv.innerHTML = '<p> Carregando lista de Funcionarios... </p>';
    try {
        const funcionarios = await buscarFuncionarios();
        console.log(funcionarios);
        renderizarListaDeFuncionarios(funcionarios);
    } catch (error) {
        console.log("Erro ao carregar a lista de funcionarios: ", error);
        listaFuncionariosDiv.innerHTML = '<p> Erro ao carregar a lista de funcionários... </p>';
    }
}

function renderizarListaDeFuncionarios(funcionarios) {
    listaFuncionariosDiv.innerHTML = '';

    if (funcionarios.length === 0) {
        listaFuncionariosDiv.innerHTML = '<p> Nenhum Funcionário cadastrado ainda ;( </p> ';
        return;
    }
    for (let funcionario of funcionarios) {
        const funcionarioDiv = document.createElement('div');
        funcionarioDiv.classList.add('funcionario-item');
        funcionarioDiv.innerHTML = `
            <strong> Nome: </strong> ${funcionario.nome} <br>
            <strong> Idade: </strong> ${funcionario.idade} <br>
            <strong> Cargo: </strong> ${funcionario.cargo} <br>
            <button class="btn-Excluir" data-id="${funcionario.id}"> Excluir </button>
            <button class="btn-Editar" data-id="${funcionario.id}"> Editar </button>
        `;
        listaFuncionariosDiv.appendChild(funcionarioDiv);
    }


    // Adicionar listeners de ação APÓS a renderização da lista
    adicionarListenersDeAcao();
}

async function lidarClique(eventoDeClique) {
    console.log("Excluir")
    const btnExcluir = eventoDeClique.target.closest('.btn-Excluir');
    if (btnExcluir) {
        const certeza = confirm("Tem certeza que deseja fazer essa exclusão?")
        if (certeza) {
            const idFuncionario = btnExcluir.dataset.id;
            const exclusaoBemSucedida = await excluirFuncionario(idFuncionario);

            if (exclusaoBemSucedida) {
                carregarListaDeFuncionarios();
                alert('Funcionário excluído com sucesso!');
            }
        } else {
            alert("Exclusão cancelada");
        }
    }

    const btnEditar = eventoDeClique.target.closest('.btn-Editar');
    if (btnEditar) {
        const idFuncionario = btnEditar.dataset.id;
        const funcionario = await buscarFuncionarioPorId(idFuncionario);

        const edicao = getValoresEditar()

        edicao.editarNome.value = funcionario.nome;
        edicao.editarIdade.value = funcionario.idade;
        edicao.editarCargo.value = funcionario.cargo;
        edicao.editarId.value = funcionario.id;

        edicao.formularioEdicao.style.display = 'block';
    }
}

async function excluirFuncionario(idFuncionario) {
    try {
        const documentoDeletar = doc(db, "funcionarios", idFuncionario);
        await deleteDoc(documentoDeletar);
        console.log("Funcionario com ID" + idFuncionario + "foi excluído.");
        return true;
    } catch (erro) {
        console.log("Erro ao excluir o funcionario", erro);
        alert("Ocorreu um erro ao excluir funcionario. Tente novamente");
        return false;
    }
}


// UPDATE - EDITAR OS DADOS DE FUNCIONÁRIO


document.getElementById('btn-salvar-edicao').addEventListener('click', async () => {
    const edicao = getValoresEditar()
    const id = edicao.editarId.value;
    const novosDados = {
        nome: edicao.editarNome.value.trim(),
        idade: parseInt(edicao.editarIdade.value),
        cargo: edicao.editarCargo.value.trim()
    };

    try {
        const ref = doc(db, "funcionarios", id);
        await setDoc(ref, novosDados);
        alert("Funcionário atualizado com sucesso!");
        edicao.formularioEdicao.style.display = 'none';
        carregarListaDeFuncionarios();
    } catch (error) {
        console.log("Erro ao salvar edição:", error);
        alert("Erro ao atualizar funcionário.");
    }
});


function getValoresEditar() {
    return {
        editarNome: document.getElementById("editar-nome"),
        editarIdade: document.getElementById("editar-idade"),
        editarCargo: document.getElementById("editar-cargo"),
        editarId: document.getElementById("editar-id"),
        formularioEdicao: document.getElementById("formulario-edicao")
    }
}

async function buscarFuncionarioPorId(id) {
    try {
        const funcionarioDoc = doc(db, "funcionarios", id);
        const snapshot = await getDoc(funcionarioDoc);
        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() };
        } else {
            console.log("Funcionário não encontrado com o ID:", id);
            return null;
        }
    } catch (error) {
        console.log("Erro ao buscar funcionário por ID:", error);
        alert("Erro ao buscar funcionário para edição.");
        return null;
    }
}

document.getElementById('btn-salvar-edicao').addEventListener('click', async () => {
    const edicao = getValoresEditar()
    const id = edicao.editarId.value;
    const novosDados = {
        nome: edicao.editarNome.value.trim(),
        idade: parseInt(edicao.editarIdade.value),
        cargo: edicao.editarCargo.value.trim()
    };

    try {
        const ref = doc(db, "funcionarios", id);
        await setDoc(ref, novosDados);
        alert("Funcionário atualizado com sucesso!");
        edicao.formularioEdicao.style.display = 'none';
        carregarListaDeFuncionarios();
    } catch (error) {
        console.log("Erro ao salvar edição:", error);
        alert("Erro ao atualizar funcionário.");
    }

    const btnEditar = eventoDeClique.target.closest('.btn-Editar');
    if (btnEditar) {
        const idFuncionario = btnEditar.dataset.id;
        const funcionario = await buscarFuncionarioPorId(idFuncionario);

        const edicao = getValoresEditar()

        edicao.editarNome.value = funcionario.nome;
        edicao.editarIdade.value = funcionario.idade;
        edicao.editarCargo.value = funcionario.cargo;
        edicao.editarId.value = funcionario.id;

        edicao.formularioEdicao.style.display = 'block';
    }

});


document.getElementById('btn-cancelar-edicao').addEventListener('click', () => {
    document.getElementById("formulario-edicao").style.display = 'none';
});


function adicionarListenersDeAcao() {
    listaFuncionariosDiv.addEventListener('click', lidarClique);
}



document.addEventListener("DOMContentLoaded", carregarListaDeFuncionarios);