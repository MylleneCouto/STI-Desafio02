var locais = [];
getLocais();

async function getLocais() {
    let response = await fetch("http://dadosabertos.rio.rj.gov.br/apiTransporte/apresentacao/rest/index.cfm/estacoesBikeRio")
    let data = await response.json();

    for (let i = 0; i < data['DATA'].length; i++) {

        aux = data["DATA"]
        obj = {Bairro:aux[i][0] ,Estacao:aux[i][1], Endereco:aux[i][3], Numero:aux[i][4], lat:aux[i][5], lon:aux[i][6] };
        locais.push(obj);
    }
}

function calcDist(lat1, lon1, lat2, lon2) {

    if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}else{
        let radlat1 = Math.PI * lat1 / 180;
        let radlat2 = Math.PI * lat2 / 180;
        let theta = lon1 - lon2;
        let radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
      
        return dist;
    }


};
  
function sortLocation(olat, olon){
    locais.sort(function(a, b) {
        return calcDist(olat, olon, a["lat"], a["lon"]) - calcDist(olat, olon, b["lat"], b["lon"]);
    });
    console.log(locais);
}

function renderLocation(){

    let display = document.querySelector(".locais");
    display.innerHTML = " ";

    for (let i in locais) {
        display.innerHTML += `<li>
        <div class="item-locais"> <p> <b>Endereço:</b>  ${locais[i]['Endereco']}, ${locais[i]['Numero']} - ${locais[i]['Bairro']} </p>
        <p> <b>Estação:</b> ${locais[i]['Estacao']}</p>
        <p> <b>Coordenadas:</b> ${locais[i]['lat']}, ${locais[i]['lon']}</p>
        </div>
        </li>` ;
    }
}

function validaForm(form) {
    let aux;

    for (let i = 0; i < form.length; i++) {
        aux = form[i].value;

        if ( aux == "") {
            alert("Todos os campos precisam ser preenchidos");
            return false;
        }
    }

    return true;

  } 

async function busca() {

    let form = document.querySelector(".enderecoForm");

    if (validaForm(form)){

        let num = form["numero"].value;
        let street = form["rua"].value;
        let city = form["cidade"].value;
    
        let url = `http://nominatim.openstreetmap.org/search?street=${num} ${street}&city=${city}&format=json&polygon=1&limit=1&addressdetails=1`
        url = encodeURI(url);
    
        let response = await fetch(url)
        let data = await response.json();

        if (data.length == 0){
            alert("Local não localizado");
        }else{
            sortLocation(data[0]['lat'],data[0]['lon']);
            renderLocation();
        }
    }

}