let flashElement = document.getElementById("flash-message");

function setFlashMessageFadeOut(flashMessageElement){
    setTimeout(()=>{
let currentOpacity =1.0;
let timer=setInterval(()=>{
    if(currentOpacity<.05){
        clearInterval(timer);
        flashMessageElement.remove();
    }
currentOpacity =currentOpacity-.05;
flashMessageElement.style.opacity = currentOpacity;
},50);
    },4000);
}

function addFlashFromFrontEnd(message,level){
    let flashMessageDiv = document.createElement("div");
    let innerFlashDiv = document.createElement("div");
    let innerTextNode = document.createTextNode(message);
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);
    flashMessageDiv.setAttribute("id","flash-message");
    innerFlashDiv.setAttribute(`class`,`alert alert-${level}`)
    document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
    setFlashMessageFadeOut(flashMessageDiv);
}

function createCard(postData){
    return `<div id="post-${postData.id}" class="card">
    <img class="card-image" src="${postData.thumbnail}" alt="no image">
    <div class="card-body">
        <p class="card-title">${postData.title}</p>
        <p class="card-description">${postData.description}</p>
        <a href="/post/${postData.id}" class="anchor-buttons">Post Link:</a>
    </div>
</div>`;
}
function executeSearch(){
    let searchTerm = document.getElementById('search-bar').value;
    if(!searchTerm){
        location.replace('/');
        return;
    }
    let mainContent = document.getElementById('photo-Container'); //dble check
    let searchUrl = `/posts/search?search=${searchTerm}`;
    fetch(searchUrl)
    .then((data) =>{
        console.log(data);
        return data.json();
    })
    .then((data_json) =>{
       let newMainContentHTML ='';
       data_json.results.forEach((row)=>{
           newMainContentHTML += createCard(row);
       });
      
       mainContent.innerHTML= newMainContentHTML;
       if(data_json.message){
           addFlashFromFrontEnd(data_json.message);
       }
    })
    .catch((error) =>console.log(error));
    
}


if(flashElement){
  setFlashMessageFadeOut(flashElement);  
}


let searchButton = document.getElementById('search-button');
searchButton.onclick =executeSearch;

