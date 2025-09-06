// Seletores
const abrirComentariosBtn = document.getElementById("abrir-comentarios");
const comentariosModal = document.getElementById("comentarios-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const modalCloseBtn = document.getElementById("modal-close");
const enviarComentarioBtn = document.getElementById("enviar-comentario");
const mensagemInput = document.getElementById("mensagem");

// Funções para comentários
function abrirComentarios() {
  comentariosModal.classList.add("show");
  document.body.classList.add("modal-open");
}

function fecharComentarios() {
  comentariosModal.classList.remove("show");
  document.body.classList.remove("modal-open");
  mensagemInput.value = ""; // Limpa o campo ao fechar
}

function enviarComentario() {
  const mensagem = mensagemInput.value.trim();
  if (mensagem !== "") {
    Swal.fire({
      icon: "success",
      title: "Comentário enviado!",
      text: mensagem,
      confirmButtonColor: "#0072BC",
    });
    fecharComentarios();
  } else {
    Swal.fire({
      icon: "warning",
      title: "Campo vazio",
      text: "Por favor, insira um comentário.",
      confirmButtonColor: "#E30613",
    });
  }
}

// Eventos de comentários
abrirComentariosBtn.addEventListener("click", abrirComentarios);
modalBackdrop.addEventListener("click", fecharComentarios);
modalCloseBtn.addEventListener("click", fecharComentarios);
enviarComentarioBtn.addEventListener("click", enviarComentario);

// Fechar modal com tecla ESC
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && comentariosModal.classList.contains("show")) {
    fecharComentarios();
  }
});

// Mapbox
mapboxgl.accessToken =
  "pk.eyJ1IjoiY2F1ZWgxcDNyIiwiYSI6ImNsbG8zMDBubDA1bXYzZW4xY3J1aW56cjkifQ.BW8sXRQtfPcAY6zkrsVnRg";

// Função para inicializar o mapa
function initializeMap() {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-49.96455, -22.23669], // Coordenadas da Unimar em Marília
    zoom: 16,
    interactive: true,
  });

  // Esconder loading quando mapa carregar
  map.on('load', function() {
    const loadingElement = document.getElementById('map-loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  });

  return map;
}

// Inicializar mapa
const map = initializeMap();

// Adiciona marcador
const marker = new mapboxgl.Marker()
  .setLngLat([-49.96455, -22.23669])
  .addTo(map);

// Adiciona popup
const popup = new mapboxgl.Popup()
  .setHTML("<b>Unimar, Campus</b><br>Localização aproximada.")
  .addTo(map);

marker.setPopup(popup);

// ===== MAPBOX DIRECTIONS API =====

// Elementos da interface de direções
const originInput = document.getElementById("origin");
const destinationInput = document.getElementById("destination");
const calculateRouteBtn = document.getElementById("calculate-route");
const routeInfo = document.getElementById("route-info");
const routeDistance = document.getElementById("route-distance");
const routeDuration = document.getElementById("route-duration");
const routeInstructions = document.getElementById("route-instructions");
const originInfoBox = document.getElementById("origin-info");
const destinationInfoBox = document.getElementById("destination-info");

// Coordenadas dos blocos da UNIMAR (coordenadas reais)
const UNIMAR_BLOCKS = {
  Reitoria: [-49.96970979205795, -22.235074643253984],
  "Bloco 2": [-49.968759260896086, -22.235192743720294],
  "Bloco 3": [-49.96915478392988, -22.235865914477994],
  "Bloco 4": [-49.968025629462446, -22.23591315440976],
  "Bloco 5": [-49.96830632322836, -22.236391457822027],
  "Bloco 9": [-49.966001159725565, -22.237938267468966],
  "Bloco Novo": [-49.9649614256234, -22.240212856740712],
};

// Informações dos blocos com imagem e cursos (simples)
const BLOCK_INFOS = {
  Reitoria: {
    endereco: "Av. Higino Muzi Filho, s/n",
    horario: "08:00 - 18:00",
    nota: "Administração central",
    img: "./img/recepcao-novos-alunos-10-1024x683.jpg",
    cursos: ["Administração", "Direito", "Ciências Contábeis"],
  },
  "Bloco 2": {
    endereco: "Próx. à entrada principal",
    horario: "07:30 - 22:00",
    nota: "Salas de aula",
    img: "./img/3-scaled.webp",
    cursos: ["Engenharia Civil", "Engenharia de Produção"],
  },
  "Bloco 3": {
    endereco: "Eixo principal do campus",
    horario: "07:30 - 22:00",
    nota: "Salas e laboratórios",
    img: "./img/3-scaled.webp",
    cursos: ["Sistemas de Informação", "Ciência da Computação"],
  },
  "Bloco 4": {
    endereco: "Ao lado da clínica",
    horario: "07:30 - 22:00",
    nota: "Salas e auditório",
    img: "./img/3-scaled.webp",
    cursos: ["Arquitetura e Urbanismo", "Design"],
  },
  "Bloco 5": {
    endereco: "Atrás do estacionamento",
    horario: "07:30 - 22:00",
    nota: "Laboratórios",
    img: "./img/3-scaled.webp",
    cursos: ["Biomedicina", "Farmácia"],
  },
  "Bloco 9": {
    endereco: "Área da medicina",
    horario: "07:30 - 22:00",
    nota: "Saúde",
    img: "./img/3-scaled.webp",
    cursos: ["Medicina", "Enfermagem"],
  },
  "Bloco Novo": {
    endereco: "Tech Unimar",
    horario: "07:30 - 22:00",
    nota: "Novo Bloco",
    img: "./img/3-scaled.webp",
    cursos: ["Incubadora", "Unimar Tech"],
  },
};

function renderBlockInfo(element, blockName) {
  if (!blockName || !BLOCK_INFOS[blockName]) {
    element.innerHTML = "<p>Selecione um bloco para ver informações.</p>";
    return;
  }
  const info = BLOCK_INFOS[blockName];
  const cursosLista = (info.cursos || []).map((c) => `<li>${c}</li>`).join("");
  element.innerHTML = `
      <div class="block-info-header">
        <img src="${info.img}" alt="${blockName}" class="block-thumb" />
        <div>
          <h4>${blockName}</h4>
          <p><strong>Endereço:</strong> ${info.endereco}</p>
          <p><strong>Horário:</strong> ${info.horario}</p>
          <p><strong>Nota:</strong> ${info.nota}</p>
        </div>
      </div>
      <div class="block-courses">
        <strong>Cursos:</strong>
        <ul>${cursosLista}</ul>
      </div>
    `;
}

originInput.addEventListener("change", () =>
  renderBlockInfo(originInfoBox, originInput.value)
);
destinationInput.addEventListener("change", () =>
  renderBlockInfo(destinationInfoBox, destinationInput.value)
);

// Variáveis para armazenar dados da rota
let routeSource = null;
let routeLayer = null;
let originMarker = null;
let destinationMarker = null;

// Função para geocodificar endereço (converter texto em coordenadas)
async function geocodeAddress(address) {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${mapboxgl.accessToken}&country=BR&limit=1`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features[0].center; // [longitude, latitude]
    } else {
      throw new Error("Endereço não encontrado");
    }
  } catch (error) {
    console.error("Erro na geocodificação:", error);
    throw error;
  }
}

// Função para calcular rota
async function calculateRoute() {
  const selectedOrigin = originInput.value;
  const selectedDestination = destinationInput.value;

  if (!selectedOrigin) {
    Swal.fire({
      icon: "info",
      title: "Origem",
      text: "Selecione seu ponto de partida.",
      confirmButtonColor: "#0072BC",
    });
    return;
  }

  if (!selectedDestination) {
    Swal.fire({
      icon: "info",
      title: "Destino",
      text: "Selecione seu destino.",
      confirmButtonColor: "#0072BC",
    });
    return;
  }

  if (selectedOrigin === selectedDestination) {
    Swal.fire({
      icon: "error",
      title: "Ops!",
      text: "Origem e destino não podem ser iguais.",
      confirmButtonColor: "#E30613",
    });
    return;
  }

  // Desabilita o botão durante o cálculo
  calculateRouteBtn.disabled = true;
  calculateRouteBtn.classList.add('loading');

  try {
    // Usa coordenadas pré-definidas para origem e destino
    const originCoords = UNIMAR_BLOCKS[selectedOrigin];
    const destCoords = UNIMAR_BLOCKS[selectedDestination];

    // Remove marcadores anteriores
    if (originMarker) originMarker.remove();
    if (destinationMarker) destinationMarker.remove();

    // Adiciona marcadores para origem e destino
    originMarker = new mapboxgl.Marker({ color: "#E30613" })
      .setLngLat(originCoords)
      .addTo(map);

    destinationMarker = new mapboxgl.Marker({ color: "#0072BC" })
      .setLngLat(destCoords)
      .addTo(map);

    // Adiciona popups nos marcadores
    const originPopup = new mapboxgl.Popup()
      .setHTML(`<b>${selectedOrigin}</b><br>Seu ponto de partida`)
      .addTo(map);

    const destPopup = new mapboxgl.Popup()
      .setHTML(`<b>${selectedDestination}</b><br>Seu destino`)
      .addTo(map);

    originMarker.setPopup(originPopup);
    destinationMarker.setPopup(destPopup);

    // Calcula a rota usando a Directions API
    const routeResponse = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords[0]},${originCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}&overview=full&steps=true&annotations=distance,duration`
    );

    const routeData = await routeResponse.json();

    if (routeData.routes && routeData.routes.length > 0) {
      const route = routeData.routes[0];

      // Remove rota anterior se existir
      if (routeSource) {
        map.removeLayer(routeLayer);
        map.removeSource(routeSource);
      }

      // Adiciona a nova rota ao mapa
      routeSource = "route";
      routeLayer = "route";

      map.addSource(routeSource, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: route.geometry,
        },
      });

      map.addLayer({
        id: routeLayer,
        type: "line",
        source: routeSource,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#E30613",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });

      // Ajusta o mapa para mostrar toda a rota
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(originCoords);
      bounds.extend(destCoords);
      map.fitBounds(bounds, { padding: 50 });

      // Exibe informações da rota
      displayRouteInfo(route, selectedOrigin, selectedDestination);
    } else {
      throw new Error("Não foi possível calcular a rota");
    }
  } catch (error) {
    console.error("Erro ao calcular rota:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro ao calcular a rota. Tente novamente.",
      confirmButtonColor: "#E30613",
    });
  } finally {
    // Reabilita o botão
    calculateRouteBtn.disabled = false;
    calculateRouteBtn.classList.remove('loading');
  }
}

// Função para exibir informações da rota
function displayRouteInfo(route, selectedOrigin, selectedDestination) {
  const distance = (route.distance / 1000).toFixed(1); // Converte para km
  const duration = Math.round(route.duration / 60); // Converte para minutos

  routeDistance.textContent = `${distance} km`;
  routeDuration.textContent = `${duration} min`;

  // Exibe instruções da rota
  routeInstructions.innerHTML = "";

  // Adiciona informações de origem e destino
  const routeInfo = document.createElement("div");
  routeInfo.className = "instruction-item";
  routeInfo.style.backgroundColor = "#0072BC";
  routeInfo.style.color = "#FFFFFF";
  routeInfo.style.padding = "10px";
  routeInfo.style.borderRadius = "5px";
  routeInfo.style.marginBottom = "10px";
  routeInfo.innerHTML = `
    <strong>🚀 Origem:</strong> ${selectedOrigin}<br>
    <strong>🎯 Destino:</strong> ${selectedDestination}
  `;
  routeInstructions.appendChild(routeInfo);

  if (route.legs && route.legs[0] && route.legs[0].steps) {
    route.legs[0].steps.forEach((step, index) => {
      const instructionDiv = document.createElement("div");
      instructionDiv.className = "instruction-item";
      instructionDiv.innerHTML = `
        <strong>${index + 1}.</strong> ${step.maneuver.instruction}
        <br><small>${(step.distance / 1000).toFixed(1)} km</small>
      `;
      routeInstructions.appendChild(instructionDiv);
    });
  }

  // Mostra a seção de informações
  routeInfo.classList.remove("hidden");
}

// Event listener para o botão de calcular rota
calculateRouteBtn.addEventListener("click", calculateRoute);

// Event listener para Enter nos campos de input
originInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    calculateRoute();
  }
});

