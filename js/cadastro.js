import { db } from './firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// CREATE - CADASTRAR DADOS DE FUNCIONÁRIO

function getInputs() {
    return {
        nome: document.getElementById('nome'),
        idade: document.getElementById('idade'),
        cargo: document.getElementById('cargo')
    };
}

function getValores({ nome, idade, cargo }) {
    return {
        nome: nome.value.trim(),
        idade: parseInt(idade.value),
        cargo: cargo.value.trim()
    };
}

function limpar({nome, idade, cargo}){
    nome.value = ''
    idade.value = ''
    cargo.value = ''
}

document.getElementById("btnEnviar").addEventListener('click', async function(){
    const Inputs = getInputs();
    const dados =getValores(Inputs)
    
    console.log("Inputs:", Inputs)
    console.log("Dados", dados)

    if (!dados.idade || !dados.nome || !dados.cargo){
        alert("Preencha todos os campos.");
        return
    }
    try{
        const ref = await addDoc(collection(db, "funcionarios"), dados);
        console.log("ID do documento", ref.id);
        limpar(Inputs)
        alert("Funcionário cadastrado com sucesso: ")
    }catch (e){
        console.log("Erro: ", e)
    }
});