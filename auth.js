const API_URL = "http://127.0.0.1:8000";

let modoCadastro = false;

const form = document.getElementById("form-login");
const campoNome = document.getElementById("campo-nome");
const inputNome = document.getElementById("login-nome");
const inputEmail = document.getElementById("login-email");
const inputSenha = document.getElementById("login-senha");
const btnLogin = document.getElementById("btn-login");
const tituloFormulario = document.getElementById("titulo-formulario");
const linkAlternar = document.getElementById("link-alternar");
const divErro = document.getElementById("login-erro");

function mostrarErro(mensagem) {
    divErro.textContent = mensagem;
    divErro.classList.add("mostrar");
}

function esconderErro() {
    divErro.classList.remove("mostrar");
}

linkAlternar.addEventListener("click", function (evento) {
    evento.preventDefault();

    modoCadastro = !modoCadastro;
    esconderErro();

    if (modoCadastro) {
        tituloFormulario.textContent = "Criar conta";
        btnLogin.textContent = "Cadastrar";
        campoNome.classList.add("mostrar");
        inputNome.required = true;
        linkAlternar.textContent = "Já tenho conta";
        linkAlternar.previousSibling.textContent = "Já tem conta? ";
    } else {
        tituloFormulario.textContent = "Entrar";
        btnLogin.textContent = "Entrar";
        campoNome.classList.remove("mostrar");
        inputNome.required = false;
        linkAlternar.textContent = "Cadastre-se";
        linkAlternar.previousSibling.textContent = "Não tem conta? ";
    }
});

form.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    esconderErro();
    btnLogin.disabled = true;

    const email = inputEmail.value.trim();
    const senha = inputSenha.value;

    try {

        if (modoCadastro) {

            const nome = inputNome.value.trim();

            const respostaCadastro = await fetch(`${API_URL}/cadastro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome: nome, email: email, senha: senha })
            });

            if (!respostaCadastro.ok) {
                const erro = await respostaCadastro.json();
                throw new Error(erro.detail || "Erro ao cadastrar.");
            }

            // Após cadastrar, faz login automaticamente
        }

        const corpoLogin = new URLSearchParams();
        corpoLogin.append("username", email);
        corpoLogin.append("password", senha);

        const respostaLogin = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: corpoLogin
        });

        if (!respostaLogin.ok) {
            const erro = await respostaLogin.json();
            throw new Error(erro.detail || "E-mail ou senha incorretos.");
        }

        const dadosLogin = await respostaLogin.json();

        localStorage.setItem("fai_token", dadosLogin.access_token);

        window.location.href = "index.html";

    } catch (erro) {

        mostrarErro(erro.message);
        btnLogin.disabled = false;
    }
});