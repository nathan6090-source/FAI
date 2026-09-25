async function obterToken() {

```
const token = localStorage.getItem("fai_token");

if (!token) {
    window.location.href = "login.html";
    return null;
}

return token;
```

}

// =====================================================
// DASHBOARD
// =====================================================

async function carregarDashboard() {

```
try {

    const token = await obterToken();

    if (!token) {
        return;
    }

    const resposta = await fetch(
        "http://127.0.0.1:8000/dashboard",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );


    if (resposta.status === 401) {

        localStorage.removeItem("fai_token");

        window.location.href = "login.html";

        return;
    }


    if (!resposta.ok) {

        throw new Error(
            "Erro HTTP " + resposta.status
        );

    }


    const dados = await resposta.json();


    // =================================================
    // CARDS
    // =================================================

    document.getElementById("clientes").textContent =
        dados.total_clientes;


    document.getElementById("faturamento").textContent =
        "R$ " +
        dados.faturamento_total.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    document.getElementById("pago").textContent =
        "R$ " +
        dados.total_pago.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    document.getElementById("pendente").textContent =
        "R$ " +
        dados.total_pendente.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    document.getElementById("vencido").textContent =
        "R$ " +
        dados.total_vencido.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    // =================================================
    // DISTRIBUIÇÃO FINANCEIRA
    // =================================================

    const total = dados.faturamento_total;


    const pago = total === 0
        ? 0
        : Math.round(
            (dados.total_pago / total) * 100
        );


    const pendente = total === 0
        ? 0
        : Math.round(
            (dados.total_pendente / total) * 100
        );


    const vencido = total === 0
        ? 0
        : Math.round(
            (dados.total_vencido / total) * 100
        );


    document.getElementById(
        "percentual-pago"
    ).textContent = pago + "%";


    document.getElementById(
        "percentual-pendente"
    ).textContent = pendente + "%";


    docume
```
