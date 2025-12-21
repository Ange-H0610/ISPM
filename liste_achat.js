// Stockage local
let shoppingLists = JSON.parse(localStorage.getItem("shoppingLists")) || [];

// Rafraîchir statistiques
function refreshStats() {
  let totalSpent = 0, totalItems = 0, pendingItems = 0;
  shoppingLists.forEach(list => {
    list.items.forEach(item => {
      totalItems++;
      if(item.purchased) totalSpent += item.price;
      else pendingItems++;
    });
  });
  document.getElementById("totalSpent").textContent = totalSpent.toLocaleString() + " Ar";
  document.getElementById("totalItems").textContent = totalItems;
  document.getElementById("pendingItems").textContent = pendingItems;
}

// Rafraîchir listes
function refreshLists() {
  const container = document.getElementById("listsContainer");
  container.innerHTML = "";

  if(shoppingLists.length === 0){
    container.innerHTML = `<div class="empty-list">
      <p>Aucune liste d'achat active</p>
      <small>Créez une nouvelle liste pour commencer</small>
    </div>`;
    return;
  }

  shoppingLists.forEach((list,index)=>{
    const total = list.items.reduce((s,i)=>s+i.price,0);
    const div = document.createElement("div");
    div.className="budget-card";
    div.innerHTML=`
      <div class="card-header">
        <div class="icon"><i class="fa-solid fa-cart-shopping"></i></div>
        <div class="title"><strong>${list.name}</strong><br><small>${list.items.length} produits</small></div>
      </div>
      <div class="card-body">
        <p><strong>Total :</strong> ${total.toLocaleString()} Ar</p>
        <ul>
          ${
            list.items.length === 0 ? "<li><em>Aucun produit</em></li>" :
            list.items.map((i,idx)=>
              `<li>
                ${i.name} - ${i.price} Ar 
                <input type="checkbox" ${i.purchased?"checked":""} onclick="togglePurchased(${index},${idx})">
              </li>`
            ).join("")
          }
        </ul>
        <div class="list-actions">
          <button class="add" onclick="addItem(${index})"><i class="fa-solid fa-plus"></i> Ajouter produit</button>
          <button class="cancel" onclick="clearList(${index})"><i class="fa-solid fa-rotate-left"></i> Annuler</button>
          <button class="delete" onclick="deleteList(${index})"><i class="fa-solid fa-trash"></i> Supprimer</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

// Créer nouvelle liste (nom automatique)
function createList(){
  const listNumber = shoppingLists.length+1;
  const name = "Liste #" + listNumber;
  shoppingLists.push({name, items:[]});
  localStorage.setItem("shoppingLists", JSON.stringify(shoppingLists));
  refreshLists();
  refreshStats();
  addItem(shoppingLists.length-1); // Ajouter produit directement
}

// Ajouter produit
function addItem(listIndex){
  const itemName = prompt("Nom du produit :");
  if(!itemName) return;
  const itemPrice = Number(prompt("Prix du produit :")) || 0;
  shoppingLists[listIndex].items.push({name:itemName, price:itemPrice, purchased:false});
  localStorage.setItem("shoppingLists", JSON.stringify(shoppingLists));
  refreshLists();
  refreshStats();
}

// Supprimer liste
function deleteList(index){
  if(confirm("Supprimer cette liste ?")){
    shoppingLists.splice(index,1);
    localStorage.setItem("shoppingLists", JSON.stringify(shoppingLists));
    refreshLists();
    refreshStats();
  }
}

// Vider liste
function clearList(index){
  if(confirm("Vider cette liste ?")){
    shoppingLists[index].items = [];
    localStorage.setItem("shoppingLists", JSON.stringify(shoppingLists));
    refreshLists();
    refreshStats();
  }
}

// Marquer produit comme acheté
function togglePurchased(listIndex,itemIndex){
  const item = shoppingLists[listIndex].items[itemIndex];
  item.purchased = !item.purchased;
  localStorage.setItem("shoppingLists", JSON.stringify(shoppingLists));
  refreshLists();
  refreshStats();
}

// Initialisation
refreshLists();
refreshStats();
