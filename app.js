const db = {

"P0420":{
descripcion:"Eficiencia del catalizador por debajo del umbral",
gravedad:"MEDIA",
coste:"150€ - 1200€",
causas:[
{
nombre:"Catalizador deteriorado",
procedimiento:[
"Comprobar señales de sondas lambda",
"Verificar fugas de escape",
"Medir eficiencia catalítica",
"Confirmar mediante pruebas adicionales"
]
},
{
nombre:"Sonda lambda",
procedimiento:[
"Comprobar cableado",
"Verificar tensión",
"Comprobar respuesta del sensor"
]
}
]
},

"P0300":{
descripcion:"Fallo de encendido múltiple",
gravedad:"ALTA",
coste:"50€ - 600€",
causas:[
{
nombre:"Bujías desgastadas",
procedimiento:[
"Inspeccionar bujías",
"Comprobar separación",
"Sustituir si procede"
]
},
{
nombre:"Bobinas defectuosas",
procedimiento:[
"Verificar bobinas",
"Comprobar alimentación",
"Realizar pruebas cruzadas"
]
}
]
}

};

let codigoActual="";

document.getElementById("startApp").onclick=()=>{

document.getElementById("splash").classList.add("hidden");
document.getElementById("app").classList.remove("hidden");

};

document.getElementById("buscar").onclick=buscar;
document.getElementById("limpiar").onclick=limpiar;
document.getElementById("inicio").onclick=volverInicio;
document.getElementById("voz").onclick=leer;
document.getElementById("youtube").onclick=video;
document.getElementById("favorito").onclick=favorito;
document.getElementById("pdf").onclick=pdf;

function buscar(){

const codigo=
document.getElementById("codigo")
.value
.toUpperCase()
.trim();

codigoActual=codigo;

const r=document.getElementById("resultado");

if(!db[codigo]){

r.innerHTML=`
<div class="result">
<h2>Código no encontrado</h2>
</div>
`;

return;
}

const d=db[codigo];

let html=`
<div class="result">

<h2>${codigo}</h2>

<p><b>${d.descripcion}</b></p>

<p>Gravedad orientativa:
${d.gravedad}</p>

<p>Coste estimado:
${d.coste}</p>

<h3>Posibles causas</h3>
`;

d.causas.forEach(c=>{

html+=`
<div class="causa">

<b>${c.nombre}</b>

<ul>

${c.procedimiento
.map(x=>`<li>${x}</li>`)
.join("")}

</ul>

</div>
`;

});

html+=`

<p style="margin-top:15px">

⚠️ Información orientativa.
No confirma una avería definitiva.

</p>

</div>
`;

r.innerHTML=html;

guardarHistorial(codigo);

}

function limpiar(){

document.getElementById("codigo").value="";
document.getElementById("modelo").value="";
document.getElementById("anio").value="";

document.getElementById("resultado").innerHTML="";

}

function volverInicio(){

limpiar();

document.getElementById("app").classList.add("hidden");

document.getElementById("splash").classList.remove("hidden");

}

function leer(){

const texto=
document.getElementById("resultado")
.innerText;

if(!texto) return;

speechSynthesis.cancel();

const voz=
new SpeechSynthesisUtterance(texto);

voz.lang="es-ES";

speechSynthesis.speak(voz);

}

function video(){

if(!codigoActual) return;

window.open(
"https://www.youtube.com/results?search_query="+
encodeURIComponent(codigoActual+" reparación"),
"_blank"
);

}

function favorito(){

if(!codigoActual) return;

let f=
JSON.parse(
localStorage.getItem("favoritos")||"[]"
);

if(!f.includes(codigoActual))
f.push(codigoActual);

localStorage.setItem(
"favoritos",
JSON.stringify(f)
);

mostrarFavoritos();

}

function guardarHistorial(codigo){

let h=
JSON.parse(
localStorage.getItem("historial")||"[]"
);

h.unshift(codigo);

h=[...new Set(h)];

localStorage.setItem(
"historial",
JSON.stringify(h)
);

mostrarHistorial();

}

function mostrarFavoritos(){

let f=
JSON.parse(
localStorage.getItem("favoritos")||"[]"
);

document.getElementById("favoritos")
.innerHTML=
f.map(x=>`<div>${x}</div>`).join("");

}

function mostrarHistorial(){

let h=
JSON.parse(
localStorage.getItem("historial")||"[]"
);

document.getElementById("historial")
.innerHTML=
h.map(x=>`<div>${x}</div>`).join("");

}

function pdf(){

if(!codigoActual) return;

const { jsPDF } = window.jspdf;

const doc=new jsPDF();

doc.text(
"Diagnóstico OBD: "+codigoActual,
10,
20
);

doc.text(
document.getElementById("resultado")
.innerText.substring(0,3000),
10,
40
);

doc.save(
"OBD_"+codigoActual+".pdf"
);

}

mostrarFavoritos();
mostrarHistorial();