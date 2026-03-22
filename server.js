const express = require("express");


const app = express();
const PORT = 3000;

// permet rebre JSON
app.use(express.json());

// servir fitxers estàtics (HTML, JS, CSS)
app.use(express.static("public"));


// endpoint d'exemple
app.post("/convert", (req, res) => {
  const { data } = req.body;

  const result = data.toUpperCase(); // prova simple

  res.json({ result });
});

const nomArrelsRandom = [
  'datos',
  'usuario',
  'registro',
  'info',
  'resultado',
  'contenedor',
];
 
const toXML = (data) => {
  // let textRebut = '{"key1":value1,"key2":value2,"key3":value3}';
  let textRebut = data;
  textRebut = textRebut.replaceAll('{', '');
  textRebut = textRebut.replaceAll('}', '');
  textRebut = textRebut.replaceAll('\"', '');
 
  let keyValues = textRebut.split(',');
 
  const indiceAleatorio = Math.floor(Math.random() * nomArrelsRandom.length);
  const arrelEscollida = nomArrelsRandom[indiceAleatorio];
 
  let xml = '';
  let continua = false;
 
  xml += `<${arrelEscollida}>\n`;
 
  for (let i = 0; i < keyValues.length; i++) {
    const keyValue = keyValues[i].split(':');
 
    if (keyValue.length === 2) {
      const tag = keyValue[0].trim();
      const value = keyValue[1].trim();
      xml += `  <${tag}>${value}</${tag}>\n`;
    } else {
      continua = true;body
    }
  }
 
  continua
    ? (xml =
        'Error: El formato de entrada debe ser JSON válido. \nEjemplo: {"nombre": "Juan"}')
    : (xml += `</${arrelEscollida}>`);
 
  return xml;
};

const toJSON = (data) => {
  // let textRebut = '<contenedor><id>1</id><nom>Anna</nom><edat>20</edat><curs>DAW</curs></contenedor>';
  let xml = data;
  xml = xml.replaceAll('/', '');
  xml = xml.replaceAll(' ', '');
  let menorQ=[];
  let mayorQ=[];
  
  for(let i = 0 ; i < xml.length; i++){
    if(xml[i]==">"){
      mayorQ.push(i);
    }
    if(xml[i]=="<"){
      menorQ.push(i);
    }
  }

  let json = "{";
  for(let i = 0; i < menorQ.length; i++){
    if(i%2!=0){continue;}
    let key = xml.substring(menorQ[i]+1,mayorQ[i]);
    let value = xml.substring(mayorQ[i]+1,menorQ[i+1]);
    json+=`"${key}":${value}`
    if (i<menorQ.length-2){
      json+=',';
    }
  }
  json+="}"

  return json;
  
};


app.post('/convert-json-to-xml', (req, res) => {
  try {
    const { data } = req.body;
    if (typeof data !== 'string')
      return res.status(400).json({ error: 'Dato inválido' });
 
    const result = toXML(data);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

app.post('/convert-xml-to-json', (req, res) => {
  try {
    const { data } = req.body;
    if (typeof data !== 'string')
      return res.status(400).json({ error: 'Dato inválido' });
 
    const result = toJSON(data);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor a http://localhost:${PORT}`);
});


