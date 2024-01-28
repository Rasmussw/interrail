function redirectToAnotherPage(targetPage) {
    var url = targetPage;
    window.location.href = url;
}

const imagePath = '/resources/fotos/';

        // Funktion til at hente filnavne fra mappen
        async function fetchImageFileNames(name) {
            const response = await fetch(imagePath + name);
            const html = await response.text();
            // Brug en simpel metode til at udtrække filnavne fra HTML-indholdet
            console.log("html-3 = " + html);
            const matches = html.match(/href="([^"]+\.(jpg|jpeg|png))"/gi);
            return matches.map(match => match.replace('href="', '').replace('"', '').substring(1));
        }
      
        fetchImageFileNames("Amsterdam");
        // Funktion til at oprette HTML-elementer baseret på filnavne
        function createImageElements(fileNames) {
            const imageContainer = document.getElementById('imageContainer');
            var num = 0;
            fileNames.forEach(fileName => {
                const imgElement = document.createElement('img');
                imgElement.src = fileName;
                imgElement.alt = fileName;
                imgElement.className = "d-block w-100"

                const divImg = document.createElement('div');
                if(num == 0){
                    divImg.className = "carousel-item active"
                } else {
                    divImg.className = "carousel-item"
                }
                num ++;
                divImg.appendChild(imgElement)
                imageContainer.appendChild(divImg);
            });
        }

        async function fetchFolderNames() {
            const response = await fetch(imagePath);
            const html = await response.text();
            console.log("html1 = " + html);
            const matches = html.match(/<a href="\/resources\/fotos\/([^"]+)" class="icon icon-directory" title="[^"]+"><span class="name">([^<]+)<\/span>/gi);
            console.log("html2 = " + matches);
            return matches ? matches.map(match => match.replace(/<a href="\/resources\/fotos\/([^"]+)" class="icon icon-directory" title="[^"]+"><span class="name">([^<]+)<\/span>/i, '$1')) : [];
        }

        function createButtonElements(folderNames) {
            console.log(folderNames)
            const buttonContainer = document.getElementById('folderButton');
            folderNames.forEach(folderName => {
                const buttonElement = document.createElement('button');
                buttonElement.textContent = folderName;
                buttonElement.value = folderName;
                buttonElement.className = "btn col-3 btn-lg";
                buttonElement.onclick = function() {
                    test(folderName);
                };
                buttonContainer.appendChild(buttonElement);
            });
        }
        fetchFolderNames()
            .then(folderNames => createButtonElements(folderNames))
            .catch(error => console.error('Fejl ved hentning af filnavne:', error));

        // Kald funktionen til at hente filnavne og derefter oprette HTML-elementer
        function test(folderName){
            const imageContainerToRemove = document.getElementById('imageContainer');

// Fjern alle børneelementer
while (imageContainerToRemove.firstChild) {
    imageContainerToRemove.removeChild(imageContainerToRemove.firstChild);
}
            $('#myModal').modal('show');
            fetchImageFileNames(folderName)
            .then(fileNames => createImageElements(fileNames))
            .catch(error =>  {
                console.error('Fejl ved hentning af filnavne:', error)
                const pElement = document.createElement('p');
                pElement.className="failTextDivStyle"
                pElement.textContent = "Der er ikke uploadet nogle billeder til denne destination endnu"
                imageContainer.appendChild(pElement);
                });
        }

//CSV FIL HANDLING
//Overvej at hente data fra API istedet -> https://restcountries.com/#endpoints-all
function createButtonElementsForDestination(folderNames) {
    console.log(folderNames)
    const buttonContainer = document.getElementById('folderButtonDestination');
    folderNames.forEach(folderName => {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = folderName;
        buttonElement.value = folderName;
        buttonElement.className = "btn col-3 btn-lg";
        buttonElement.onclick = function() {
            destinationInserData(folderName);
        };
        buttonContainer.appendChild(buttonElement);
    });
}
fetchFolderNames()
    .then(folderNames => createButtonElementsForDestination(folderNames))
    .catch(error => console.error('Fejl ved hentning af filnavne til destination site:', error));



function processData(csvData,folderName) {
    // Opdel rækker og kolonner
    const rows = csvData.split('\n');
    const header = rows[0].split(',');
  
    const data = rows.slice(1).map(row => {
      const columns = row.split(',');
      const rowData = {};
  
      header.forEach((header, index) => {
        rowData[header.trim()] = columns[index].trim();
      });
  
      return rowData;
    });
  
    handleCSVData(data, folderName);
  }
  function handleCSVData(data, folderName) {
    // Gør noget med dataen, f.eks. udskriv det i konsollen
    const informationContainer = document.getElementById('destinationInformation');
    const InfoElement = document.createElement('div');
    const mapDiv = document.createElement('div');
    data.forEach(dataStructure=>{
        if(dataStructure.city === folderName){
            InfoElement.innerHTML = `<p><b>Land</b> ${dataStructure.country}</p><p><b>By</b> ${dataStructure.city}</p><p><b>Dato</b> ${dataStructure.startDate}-${dataStructure.endDate}</p><p><b>Info</b> ${dataStructure.info}</p><p><b>Bosted</b> ${dataStructure.apartman}</p>`;
            InfoElement.className = "col"
            mapDiv.innerHTML =  dataStructure.map;
            mapDiv.className = "col"

            informationContainer.appendChild(InfoElement)
            informationContainer.appendChild(mapDiv)
        }  
    })
    if(InfoElement.textContent.length === 0){
            InfoElement.className="failTextDivStyle"
            InfoElement.textContent = "Der er ikke uploadet information til destination endnu"
            informationContainer.className ="defaultContainer"
            informationContainer.appendChild(InfoElement);
    }
    if(!mapDiv.innerHTML.includes(`<iframe src="https://www.google.com/maps/embed`)){
        mapDiv.className="failTextDivStyle"
        mapDiv.textContent = ""
    }

  }

  
  function destinationInserData(folderName){
    const InfoContainerToRemove = document.getElementById('destinationInformation');

// Fjern alle børneelementer
while (InfoContainerToRemove.firstChild) {
    InfoContainerToRemove.removeChild(InfoContainerToRemove.firstChild);
}
    fetch('/resources/info.csv')
    .then(response => response.text())
    .then(csvData => processData(csvData, folderName))
  }  