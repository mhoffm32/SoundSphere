document.getElementById("search-info").addEventListener('click', searchHeroes);
document.getElementById("search-matches").addEventListener('click', getMatches);
document.getElementById("create-list").addEventListener('click', addList);
document.getElementById("past-lists").addEventListener('click', display_past_lists);
document.getElementById("delete-list").addEventListener('click', deleteList)
document.getElementById("search-list").addEventListener('click', search_list)

const fieldSelector = document.getElementById("select-field");

fieldSelector.addEventListener("change",getPatternBtns);
const patternSelector = document.getElementById("select-pattern");

const numResultsDiv = document.getElementById("numResults");
const listDiv = document.getElementById("saved-lists");

const heroInfoPage = document.getElementById("hero-info-page")
const heroMatchesPage = document.getElementById("hero-matches-page")
const manageListsPage = document.getElementById("manage-lists-page")

const searchSelector = document.getElementById("searchFor")
searchSelector.addEventListener("change", () => {
    let label = document.getElementById("search-by-label");
    let input = document.getElementById("search-by-input");
    label.textContent = searchSelector.value + ": ";
    input.value = ""
    input.placeholder = "Hero "+searchSelector.value
});

document.getElementById("hero-info").addEventListener("click", () => {
    document.getElementById("hero-info").style.color = "blue"
    document.getElementById("hero-matches").style.color = "black"
    document.getElementById("manage-lists").style.color = "black"

    heroInfoPage.style.display = "block"
    heroMatchesPage.style.display = "none"
    manageListsPage.style.display = "none"
});

document.getElementById("hero-matches").addEventListener("click", () => {
    document.getElementById("hero-info").style.color = "black"
    document.getElementById("hero-matches").style.color = "blue"
    document.getElementById("manage-lists").style.color = "black"

    heroInfoPage.style.display = "none"
    heroMatchesPage.style.display = "block"
    manageListsPage.style.display = "none"
});

document.getElementById("manage-lists").addEventListener("click", () => {
    document.getElementById("hero-info").style.color = "black"
    document.getElementById("hero-matches").style.color = "black"
    document.getElementById("manage-lists").style.color = "blue"

    heroInfoPage.style.display = "none"
    heroMatchesPage.style.display = "none"
    manageListsPage.style.display = "block"
});

function deleteList(){
    let listMessage = document.getElementById('list-message');
    listMessage.textContent = ''

    const inputbox = document.getElementById('listName2')
    let listName = inputbox.value;

    if(listName.trim() == "" || listName.length > 40){
        listMessage.textContent = "Invalid list name input ."
        return
    }

    const list = {
        name: listName,
    };

    const send = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(list), 
    };

    fetch('/api/hero/deleteList', send)
      .then((response) => {
        if (response.status === 409) {
        alert('List name does not exist.');
        }else if(response.status === 200){
            listMessage.textContent = `List: ${listName} successfully deleted`
        }
        return response.json(); 
      })
      .then((data) => {
        console.log('Response data:', data);
      })
      .catch((error) => {
        console.error('Error:' + error);
      
    });
}


function search_list() {

    let listMessage = document.getElementById('list-message');
    listMessage.textContent = ''

    let savedlistHeader = document.getElementById("saved-lists-header")
    savedlistHeader.textContent = ''

    let listOfLists = document.getElementById("saved-lists");

    while (listOfLists.firstChild) {
        listOfLists.removeChild(listOfLists.firstChild);
    }
    
    let listName = document.getElementById('listName2')
    listName = listName.value;


    if(listName.trim() == "" || listName.length > 40){
        listMessage.textContent = "Invalid list name input ."
        return
    }
    let found = false;

    fetch("/api/hero/past_lists")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((list, index) => {
                if(list.name.toLowerCase() == listName.toLowerCase()){
                    found = true;

                    const listName = list.name;
                    const listIds = list.ids;

                    const listDiv = document.createElement('div');
                    listDiv.id = `List${index + 1}`;
                    listOfLists.appendChild(listDiv);
                    const listNameHeader = document.createElement('h1');
                    listNameHeader.textContent = `${listName}`;
                    listDiv.appendChild(listNameHeader);

                    const listUl = document.createElement('ul');
                    listDiv.appendChild(listUl);

                    listIds.forEach((id) => {
                        id = parseInt(id, 10);
                        const fetchHeroData = fetch(`/api/hero/${id}`)
                            .then((res) => res.json());
                        const fetchPowersData = fetch(`/api/hero/${id}/powers`)
                            .then((res) => res.json());

                        Promise.all([fetchHeroData, fetchPowersData])
                            .then(([heroData, powersData]) => {
                            
                                const infoAndPowers = `Hero Name: ${heroData.name}, Gender: ${heroData.Gender}, Eye Color: ${heroData["Eye color"]}, Race: ${heroData.Race}, Hair Color: ${heroData["Hair color"]}, Height: ${heroData.Height}, Publisher: ${heroData.Publisher}, Skin Color: ${heroData["Skin color"]}, Alignment: ${heroData.Alignment}, Weight: ${heroData.Weight}, Powers: [${powersData.join(', ')}]`;
                                const combinedLi = document.createElement('li');
                                combinedLi.textContent = infoAndPowers;
                                listUl.appendChild(combinedLi);
                                listUl.appendChild(document.createElement('br'))
                            });
                    });
                }
            }
            );
        })
        .catch((error) => {
            console.error(error);
        }).finally(()=>{
            if(!found){
                listMessage.textContent = "List not found."
            }
        })
}



function invalid_input(req_type,field){
    console.log(`Please enter a ${req_type} for ${field}`)
}


function get_past_lists(){
    fetch("/api/hero/past_lists").then(res => {res.json()
        .then(data => {
            if(data){
                return true
            }
        })
    })
}


function display_past_lists() {
    let listMessage = document.getElementById('list-message');
    listMessage.textContent = ''

    let savedlistHeader = document.getElementById("saved-lists-header")
    savedlistHeader.textContent = ''

    let listOfLists = document.getElementById("saved-lists");

    while (listOfLists.firstChild) {
        listOfLists.removeChild(listOfLists.firstChild);
    }

    fetch("/api/hero/past_lists")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((list, index) => {
                const listName = list.name;
                const listIds = list.ids;

                const listDiv = document.createElement('div');
                listDiv.id = `List${index + 1}`;
                listOfLists.appendChild(listDiv);
                const listNameHeader = document.createElement('h1');
                listNameHeader.textContent = `${listName}`;
                listDiv.appendChild(listNameHeader);

                const listUl = document.createElement('ul');
                listDiv.appendChild(listUl);

                listIds.forEach((id) => {
                    id = parseInt(id, 10);
                    const fetchHeroData = fetch(`/api/hero/${id}`)
                        .then((res) => res.json());
                    const fetchPowersData = fetch(`/api/hero/${id}/powers`)
                        .then((res) => res.json());

                    Promise.all([fetchHeroData, fetchPowersData])
                        .then(([heroData, powersData]) => {
                        
                            const infoAndPowers = `Hero Name: ${heroData.name}, Gender: ${heroData.Gender}, Eye Color: ${heroData["Eye color"]}, Race: ${heroData.Race}, Hair Color: ${heroData["Hair color"]}, Height: ${heroData.Height}, Publisher: ${heroData.Publisher}, Skin Color: ${heroData["Skin color"]}, Alignment: ${heroData.Alignment}, Weight: ${heroData.Weight}, Powers: [${powersData.join(', ')}]`;
                            const combinedLi = document.createElement('li');
                            combinedLi.textContent = infoAndPowers;
                            listUl.appendChild(combinedLi);
                            listUl.appendChild(document.createElement('br'))

                        });
                });
            });
        })
        .catch((error) => {
            console.error(error);
        });

        savedlistHeader.textContent = "Saved Lists"
}


//DONE
function addList() {

    let savedlistHeader = document.getElementById("saved-lists-header")
    savedlistHeader.textContent = ''

    let id_input = document.getElementById("heroIds").value;
    let listMessage = document.getElementById('list-message');
    listMessage.textContent = ''
    
    let id_arr = id_input.split(",");
    for (e in id_arr) {
      e = e.trim();
      e = parseInt(e, 10);
    }
  
    let listName = document.getElementById("listName").value;
    if (listName.length >= 40 ||listName.length == '') {
      console.log("Invalid List name");
      return;
    }
    // if(past_lists(listName.trim())){
    const list = {
      name: listName,
      ids: id_arr,
    };
    const send = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify(list), // Convert the object to a JSON string
    };
  
    fetch('/api/hero/newList', send)
      .then((response) => {
        if (response.status === 409) {
          // List name already exists on the server
          alert('List name already exists on the server.');
        }else if (response.status === 200){
            listMessage.textContent = `List: ${listName} IDs: ${id_arr} successfully added!`
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        console.log('Response data:', data);
        // Handle the response data as needed
      })
      .catch((error) => {
        console.error('Error:' + error);
        // Handle any other errors that occur during the request
      });
}
  
  

function load_data(){
    fetch("/load-superhero-data").then(res => {res.json()
        .then(data => {
            const l = document.getElementById("searchResults");
            data.forEach(element => {
                console.log("loading")
            });
        })
    })
}


function getInfo(){
    fetch("/api/hero/").then(res => {res.json()
        .then(data => {
            const l = document.getElementById("searchResults");
            data.forEach( element => { 
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`Name:${element.name} \n ${element.Publisher}`))
                l.appendChild(item);
            });
        })
    })
}


//FINISHED
function searchHeroes(){
    const results = document.getElementById("info-results");
    while (results.firstChild) {
        results.removeChild(results.firstChild);
    }
    let property = searchSelector.value;
    let property_value = document.getElementById("search-by-input")

    if(!isNaN(property_value.value)){
        invalid_input("string","property value")
    }
    let sortBy = document.getElementById("sortBy").value;

    fetch(`/api/hero/search/${property}/${property_value.value}/${sortBy}`).then(res => {res.json()
        .then(data => {
            const l = document.getElementById("info-results");
            data.forEach(element => {
                powers_display = [];
                if(element.powers){
                    for (power of element.powers){
                        powers_display.push(" "+power)
                    }
                    powers_display[0] = powers_display[0].trim()
                }

                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`ID: ${element.id}, Name:${element.name}, Gender: ${element.Gender}, Eye Color: ${element["Eye color"]}, Race: ${element.Race}, Hair Color: ${element["Hair color"]}, Height: ${element.Height}, Publisher: ${element.Publisher}, Skin Color: ${element["Skin color"]}, Alignment: ${element.Alignment}, Weight: ${element.Weight}, Powers: [${powers_display}]`))
                l.appendChild(item);
                l.appendChild(document.createElement('br'));

            });
        })
    })
}

//add all info
function getById(id_input){
    fetch(`/api/hero/${id_input}`).then(res => {res.json()
        .then(element => {
            return element;
        })
    })
}

function getPowers(id){
    fetch(`/api/hero/${id}/powers`).then(res => { res.json()
        .then(powers => {
            console.log(powers)
            return powers
        });
    });
}


function getPublishers(){
    fetch(`/api/hero/${property}/powers`).then(res => {res.json()
        .then(data => {
            const l = document.getElementById("searchResults");
            data.forEach(publisher => {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`\n${publisher}`))
                l.appendChild(item);
            });
        })
    })
}


function getMatches(){
    let field = fieldSelector.value;
    let pattern = patternSelector.value;
    let n = 0;
    
    const matchesResults = document.getElementById("matches-results")

    while (matchesResults.firstChild){
        matchesResults.removeChild(matchesResults.firstChild);
    }

    document.getElementById("match-message").textContent = ""
    n_input = document.getElementById("numMatches");
    //n_input = parseInt(n_input.value.trim())

    if(isNaN(n_input.value)){
        invalid_input("integer","n")
        document.getElementById("match-message").textContent = "Please Enter a valid integer for n"
        return
    }
    if(!n_input.value){
        document.getElementById("match-message").textContent = "Please Enter a Valid Number of matches."
    }else{
        if(fieldSelector.value.trim() == "Height" ||fieldSelector.value.trim() == "Weight"){
            console.log(fieldSelector.value.trim())
            pattern = document.getElementById("hw-value").value;
        }

        console.log(pattern)

        field = encodeURIComponent(field);
        pattern = encodeURIComponent(pattern);
        n = n_input.value
        fetch(`/api/hero/${field}/${pattern}/${n}`).then(res => {res.json()
            .then(data => {

                if(data.length == 0){
                    document.getElementById("match-message").textContent = "No matches found."
                }

                for (hero of data){
                const results = document.getElementById("matches-results")
                heroElem = document.createElement('li')
                p = document.createElement('p');
                p.id = "pMatch"
                heroText = ''
                for (prop in hero){
                    heroText+= `${prop}: ${hero[prop]}<br>`
                }
                p.innerHTML = heroText
                heroElem.appendChild(p)
                results.appendChild(heroElem)
                console.log(data)
                }
            });
        })
    }
}


function getPatternBtns(){
    selected_field = 0;
    patternSelector.style.display = "inline-block"
    document.querySelector(`label[for="${"select-pattern"}"]`).style.display = "inline-block"
    document.getElementById("match-message").textContent = ""

    const hw_input = document.createElement("input");
    const label = document.createElement("label");

    hw_parent = document.getElementById("hw-input")

    while (hw_parent.firstChild) {
        hw_parent.removeChild(hw_parent.firstChild);
    }

    while (patternSelector.firstChild){
        patternSelector.removeChild(patternSelector.firstChild);
    }

    for(option of fieldSelector){
        if (option.id === fieldSelector.value){
            selected_field = option.id;
        }
    }
    
    if (selected_field === 'Height' || selected_field === 'Weight'){
        hw_input.type = "text";
        hw_input.name = "pattern";
        hw_input.id = "hw-value";
        label.textContent = selected_field + " Value: ";
        label.htmlFor = selected_field;
        document.getElementById("hw-input").appendChild(label)
        document.getElementById("hw-input").appendChild(hw_input)
        patternSelector.style.display = "none"
        document.querySelector(`label[for="${"select-pattern"}"]`).style.display = "none"
    } else {
        fetch(`/api/hero/search/${selected_field}`).then(res => {res.json()
            .then(patterns => {
                for (pattern of patterns){
                    const option = document.createElement("option");
                    option.text = pattern;
                    option.id = pattern;
                    patternSelector.appendChild(option);
                }
            });
        })
    }
}

