import express from "express";
import { xml2json } from "xml-js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/convertToXML", (req, res) => {
  try {
    const { data } = req.body;
    const result = toXML(data);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ result: "Error convirtiendo a XML" });
  }
});

app.post("/convert", (req, res) => {
  try {
    const { data } = req.body;
    const result = data.toUpperCase();
    res.json({ result });
  } catch (e) {
    res.status(400).json({ result: "Error convirtiendo a XML" });
  }
});

app.post("/convertToJson", (req, res) => {
  try {
    const { data } = req.body;

    const jsonString = xml2json(data, { compact: true, spaces: 4 });

    const resultObj = JSON.parse(jsonString);

    res.json({ result: resultObj });
  } catch (e) {
    console.error(e);
    res.status(400).json({ result: "Error: El XML no es válido" });
  }
});

app.post("/convertPokemon", async (req, res) => {
  try {
    const { name } = req.body;
    const cleanName = name ? name.trim().toLowerCase() : "";

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${cleanName}`,
    );

    if (!response.ok) {
      throw new Error("Pokemon no trobat");
    }

    const pokemonData = await response.json();

    res.json({ result: pokemonData });
  } catch (e) {
    // És millor enviar un objecte amb estructura similar per no petar el front
    res.status(404).json({ result: null, error: "No s'ha trobat el Pokémon" });
  }
});

// Afegeix aquesta ruta al teu server.js
app.post("/convertPokemonToXML", async (req, res) => {
  try {
    const { name } = req.body;
    const cleanName = name ? name.trim().toLowerCase() : "";

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${cleanName}`);
    if (!response.ok) throw new Error("Pokemon no trobat");

    const pokemonData = await response.json();

    const xmlResult = xml2json(JSON.stringify(pokemonData), { compact: true, spaces: 4 });

    res.header('Content-Type', 'application/xml');
    res.send(xmlResult);
  } catch (e) {
    res.status(404).send("<error>No s'ha trobat el Pokémon</error>");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor a http://localhost:${PORT}`);
});


const toXML = (data) => {
  // let textRebut = '{"key1":value1,"key2":value2,"key3":value3}';
  let textRebut = data;
  textRebut = textRebut.replaceAll('{', '');
  textRebut = textRebut.replaceAll('}', '');
  textRebut = textRebut.replaceAll('\"', '');

  let keyValues = textRebut.split(',');


  let xml = '';
  let continua = false;

  xml += `<root>\n`;

  for (let i = 0; i < keyValues.length; i++) {
    const keyValue = keyValues[i].split(':');

    if (keyValue.length === 2) {
      const tag = keyValue[0].trim();
      const value = keyValue[1].trim();
      xml += `  <${tag}>${value}</${tag}>\n`;
    } else {
      continua = true;
    }
  }

  continua
    ? (xml =
      'Error: El formato de entrada debe ser JSON válido. \nEjemplo: {"nombre": "Juan"}')
    : (xml += `</root>`);

  return xml;
};

const toJson = (data) => {
  data = data.replace('<?xml version="1.0" encoding="UTF-8"?>', '').trim();

  let menorQ = [];
  let mayorQ = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i] == '<') menorQ.push(i);
    if (data[i] == '>') mayorQ.push(i);
  }

  let json = '{';
  let first = true;

  for (let i = 0; i < menorQ.length; i++) {
    let keyRaw = data.substring(menorQ[i] + 1, mayorQ[i]);

    if (keyRaw.includes('/')) continue;

    let value = data.substring(mayorQ[i] + 1, menorQ[i + 1]);

    if (value !== undefined && !value.includes('<') && value.trim() !== '') {
      if (!first) json += ',';

      let formattedValue = isNaN(value) ? `"${value.trim()}"` : value.trim();
      json += `"${keyRaw.trim()}":${formattedValue}`;
      first = false;
    }
  }

  json += '}';
  return json;
};