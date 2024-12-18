let basePrice = 0;
let selectedFood = null;
let selectedRecheios = [];
var totalPrice = 0;
var popupSales = document.querySelector(".popup");

let images = ["imagens/Imagem2.jpg", "imagens/Imagem3.jpg", "imagens/Imagem4.jpg"];
let currentIndex = 0; 

function changeImage() {
    const imageElement = document.getElementById("header-image"); 
    currentIndex = (currentIndex + 1) % images.length; 
    imageElement.src = images[currentIndex]; 
}


setInterval(changeImage, 3000);



function selectFood(foodId, foodPrice) {
    selectedFood = foodId;
    basePrice = foodPrice;
    selectedRecheios = []; 
    updatePrice();
    loadFillings(foodId);
}


function loadFillings(foodId) {
    if (!foodId) return;

    fetch(`http://localhost:8080/food?id=${foodId}`)
        .then(response => response.json())
        .then(data => {

            const fillingOptions = document.getElementById("filling-options");
            fillingOptions.innerHTML = ""; 

            if (Array.isArray(data.filing) && data.filing.length > 0) {
                data.filing.forEach(filing => {
                    const filingCheckbox = `
                        <label>
                            <input type="checkbox" value="${filing.name}" data-price="${filing.price}" onclick="toggleRecheio(this)">
                            ${filing.name} (R$ ${filing.price.toFixed(2)})
                        </label><br>
                    `;
                    fillingOptions.innerHTML += filingCheckbox;
                });
            } else {
                fillingOptions.innerHTML = "Nenhum recheio disponível.";
            }
        })
        .catch(error => {
            console.error("Erro ao carregar os recheios:", error);
            alert("Erro ao carregar os recheios: " + error.message);
        });
}




function updatePrice() {
    totalPrice = basePrice + selectedRecheios.reduce((sum, recheio) => sum + recheio.price, 0);
    document.getElementById("total-price").textContent = `Preço Total: R$ ${totalPrice.toFixed(2)}`;
}

function toggleRecheio(checkbox) {
    const price = parseFloat(checkbox.getAttribute('data-price'));
    if (checkbox.checked) {
        selectedRecheios.push({ name: checkbox.value, price: price });
        console.log(selectedRecheios)
        
    } else {
        selectedRecheios = selectedRecheios.filter(recheio => recheio.name !== checkbox.value);
        console.log(selectedRecheios)

    }
    updatePrice();
}

function submitOrder() {
    const cpf = document.getElementById("cpf").value;
    if (!cpf || !selectedFood) {
        alert("Por favor, selecione a comida e informe o CPF.");
        return;
    }

    const description = selectedRecheios.map(recheio => recheio.name).join(", ");
    
    const orderData = {
        id_food: parseInt(selectedFood),
        cpf: cpf,
        description: description,
        total_price: totalPrice 
    };

    fetch('http://localhost:8080/payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.mensagem) {
                alert(data.mensagem);
            } else if (data.erro) {
                alert(data.erro);
            }
        })
        .catch(error => alert("Erro ao enviar o pedido: " + error.message));
}


const foodNames = {
    1: "Tapioca",
    2: "Cuscuz",
    3: "Sanduíche"
};

function loadHistory() {
    const cpf = document.getElementById("cpf").value; 
    const historyContainer = document.getElementById("popup");
    const historyContent = document.querySelector(".popup-content"); // Seletor para a div que contém o conteúdo do popup

    if (!cpf) {
        
        historyContent.innerHTML = `
            <span class="close-button" onclick="togglePopup()">&times;</span>
            <h2>Histórico de Compras</h2>
            <p>Por favor, informe o CPF para ver o histórico.</p>
        `;
        
        historyContainer.style.display = 'flex'; 
        return; 
    }

    
    fetch(`http://localhost:8080/history?cpf=${cpf}`)
        .then(response => response.json())
        .then(data => {
            if (cpf.length === 0) {
                historyContent.innerHTML = `
                    <span class="close-button" onclick="togglePopup()">&times;</span>
                    <h2>Histórico de Compras</h2>
                    <p>Sem compras registradas no momento.</p>
                `;
            } else {
                let historyHTML = "<ul>";
                data.forEach(item => {
                    const foodName = foodNames[item.id_food] || "Comida Desconhecida"; 
                    historyHTML += `
                        <li>
                            Pedido de comida: ${foodName} com recheios: ${item.description}.
                            Preço: R$ ${item.price.toFixed(2)}.
                            Data: ${item.sale_date}.
                        </li>
                    `;
                });
                historyHTML += "</ul>";
                historyContent.innerHTML = `
                    <span class="close-button" onclick="togglePopup()">&times;</span>
                    <h2>Histórico de Compras</h2>
                    ${historyHTML}
                `;
                
            }
            // Exibe o popup
            historyContainer.style.display = 'flex';
        })
        
}






// Alterna a visibilidade do histórico de compras
function togglePopup() {
    const popup = document.querySelector('.popup');
    popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
}

// Inicializa o carregamento de comidas ao carregar a página
window.onload = () => {
    
};