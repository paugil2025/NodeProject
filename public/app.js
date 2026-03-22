
const btn = document.getElementById("btn");
const xml = document.getElementById("xml");
const json = document.getElementById("json");


btn.addEventListener("click", async () => {

  const text = document.getElementById("input").value;

  // Fem una petició HTTP al servidor (Express)
  // fetch() envia una request al backend
  const res = await fetch("/convert", {
    // Tipus de petició
    // POST = enviem dades al servidor
    method: "POST",
    // Capçaleres HTTP
    // Indiquem que estem enviant dades en format JSON
    headers: {
      "Content-Type": "application/json"
    },

    // Cos de la petició (les dades que enviem)
    // Convertim l’objecte JS a text JSON
    body: JSON.stringify({ data: text })
  });

  // El servidor respon amb JSON
  // Convertim la resposta a objecte JavaScript
  const json = await res.json();
  
  // Mostrem el resultat a la textarea de sortida
  document.getElementById("output").value = json.result;
});

xml.addEventListener('click', async () => {
  const text = input.value.trim();
  if (!text) return alert('Escribe algo primero');
 
  xml.disabled = true;
  xml.textContent = 'Procesando...';
 
  try {
    const res = await fetch('/convert-json-to-xml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: text }),
    });
 
    if (!res.ok) throw new Error('Error en la respuesta del servidor');
 
    const json = await res.json();
    output.value = json.result;
  } catch (error) {
    console.error(error);
    alert('Hubo un fallo en la conexión.');
  } finally {
    // Restaurar estado
    xml.disabled = false;
    xml.textContent = 'Convertir a XML';
  }
});

json.addEventListener('click', async () => {
  const text = input.value.trim();
  if (!text) return alert('Escribe algo primero');
 
  json.disabled = true;
  json.textContent = 'Procesando...';
 
  try {
    const res = await fetch('/convert-xml-to-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: text }),
    });
 
    if (!res.ok) throw new Error('Error en la respuesta del servidor');
 
    const xml = await res.json();
    output.value = xml.result;
  } catch (error) {
    console.error(error);
    alert('Hubo un fallo en la conexión.');
  } finally {
    // Restaurar estado
    json.disabled = false;
    json.textContent = 'Convertir a JSON';
  }
});