const professionals = [
  {
    id: 1,
    name: "Mariana Silva",
    role: "Fullstack",
    city: "São Paulo",
    rating: 4.9,
    reviews: 57,
    bio: "Especialista em desenvolvimento web fullstack com foco em React e Node.js.",
    favorite: false,
  },
  {
    id: 2,
    name: "Lucas Pereira",
    role: "DevOps",
    city: "Belo Horizonte",
    rating: 4.7,
    reviews: 34,
    bio: "Engenheiro DevOps com experiência em AWS e automação de infraestrutura.",
    favorite: false,
  },
  {
    id: 3,
    name: "Ana Costa",
    role: "UI/UX Designer",
    city: "Rio de Janeiro",
    rating: 4.8,
    reviews: 45,
    bio: "Designer com foco em experiência do usuário e interfaces intuitivas.",
    favorite: false,
  },
  {
    id: 4,
    name: "Pedro Gomes",
    role: "Data Scientist",
    city: "Curitiba",
    rating: 4.6,
    reviews: 28,
    bio: "Cientista de dados com experiência em Machine Learning e análise preditiva.",
    favorite: false,
  },
];

// Elementos DOM
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const showAllBtn = document.getElementById("showAll");
const refineSearchInput = document.getElementById("refineSearch");
const roleFilter = document.getElementById("roleFilter");
const orderFilter = document.getElementById("orderFilter");
const favoritesBtn = document.getElementById("favoritesBtn");
const clearBtn = document.getElementById("clearBtn");
const countDisplay = document.getElementById("count");
const professionalsList = document.getElementById("professionals");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const mName = document.getElementById("modalTitle");
const mBio = document.getElementById("modalDesc");

// Inicializa filtro de roles dinamicamente
function initRoleFilter() {
  const roles = [...new Set(professionals.map(p => p.role))];
  roles.forEach(role => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    roleFilter.appendChild(option);
  });
}

// Renderiza cards filtrando e ordenando
function render() {
  let filtered = [...professionals];

  // Busca principal
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.role.toLowerCase().includes(searchTerm) ||
      p.city.toLowerCase().includes(searchTerm)
    );
  }

  // Mostrar somente favoritos
  if (favoritesBtn.classList.contains("active")) {
    filtered = filtered.filter(p => p.favorite);
  }

  // Refinar busca (busca dentro do resultado)
  const refineTerm = refineSearchInput.value.trim().toLowerCase();
  if (refineTerm) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(refineTerm) ||
      p.role.toLowerCase().includes(refineTerm) ||
      p.city.toLowerCase().includes(refineTerm)
    );
  }

  // Filtra função
  const roleValue = roleFilter.value;
  if (roleValue) {
    filtered = filtered.filter(p => p.role === roleValue);
  }

  // Ordenar
  const order = orderFilter.value;
  if (order === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (order === "reviews") {
    filtered.sort((a, b) => b.reviews - a.reviews);
  } else {
    // ordem natural (por id)
    filtered.sort((a, b) => a.id - b.id);
  }

  // Atualiza contador
  countDisplay.textContent = `${filtered.length} profissional${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  // Limpa lista
  professionalsList.innerHTML = "";

  if (filtered.length === 0) {
    professionalsList.innerHTML = `<p>Nenhum profissional encontrado.</p>`;
    return;
  }

  // Cria cards
  filtered.forEach(p => {
    const card = document.createElement("article");
    card.className = "professional-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p><strong>${p.role}</strong> — ${p.city}</p>
      <p class="rating">${p.rating.toFixed(1)} ★ <small>(${p.reviews} avaliações)</small></p>
      <button class="primary" aria-label="Ver mais sobre ${p.name}">Ver mais</button>
    `;

    // Abre modal ao clicar no botão Ver mais
    const btn = card.querySelector("button");
    btn.addEventListener("click", () => openModal(p.id));

    professionalsList.appendChild(card);
  });
}

// Abrir modal com detalhes
function openModal(id) {
  const p = professionals.find(x => x.id === id);
  if (!p) return;
  mName.textContent = p.name;
  mBio.textContent = p.bio;
  modal.classList.add("open");
  modal.focus();
}

function closeModal() {
  modal.classList.remove("open");
}

// Eventos
searchBtn.addEventListener("click", render);

showAllBtn.addEventListener("click", () => {
  searchInput.value = "";
  refineSearchInput.value = "";
  roleFilter.value = "";
  orderFilter.value = "relevance";
  favoritesBtn.classList.remove("active");
  render();
});

refineSearchInput.addEventListener("input", render);
roleFilter.addEventListener("change", render);
orderFilter.addEventListener("change", render);

favoritesBtn.addEventListener("click", () => {
  favoritesBtn.classList.toggle("active");
  render();
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  refineSearchInput.value = "";
  roleFilter.value = "";
  orderFilter.value = "relevance";
  favoritesBtn.classList.remove("active");
  render();
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Inicializa tudo
initRoleFilter();
render();
