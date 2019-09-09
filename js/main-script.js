let url = "http://localhost:8080/api/to-do/tasks";

var tasks = [];

getTheDataFromAPI()
.then((data) =>{
    tasks = convertJSONToArray(data);
    renderTaskInAsHTML(tasks);
})

function getTheDataFromAPI(){
    return new Promise(function(resolve,reject)
    {
        fetch(url,{
            method: 'GET',
            headers : { "content-type" : "application/json;" }
        })
        .then((res) => res.json())
        .then((data)=> resolve(data))
        .catch((data) => reject(data))
    })
}


function convertJSONToArray(arrayObj){
    let taskNew = [];
    for(let i = 0; i < arrayObj.length; i++){
        taskNew.push(arrayObj[i]["data"]);
    }
    return taskNew;
}

function renderTaskInAsHTML(tasks){
    removeOldRows();
    for(let i = 0; i < tasks.length; i++){
        let row = makeRowHTML(i,tasks[i]);
        insertRowInTable(row);
    }

    function insertRowInTable(row){
        let table = document.getElementsByClassName("task-row")[0].parentNode;
        let newRow = table.insertRow(table.rows.length);
        newRow.innerHTML = row;
    }

    function makeRowHTML(taskNumber, task){
        let row = `<tr>
                        <td style="display: none;">${taskNumber}</td>
                        <td>${task}</td>
                        <td>
                            <i class="fa fa-trash fa-2x" onclick="deleteItem(this);"></i>
                            <i class="fa fa-wrench fa-2x" onclick="modifyItem(this);"></i>
                        </td>
                        </tr>`;
                        return row;
    }

    function removeOldRows(){
        let table = document.getElementsByClassName("task-row")[0].parentNode;
        let rowNumber = table.rows.length;
        
        while(rowNumber > 2){
            table.deleteRow(--rowNumber);
        }

    }
}

// Button Events
function searchButtonClicked(event){
    if(event.keyCode == '13' && document.getElementsByClassName("fa-plus")[0].style.display == 'inline-block'){
        addButtonClicked();
    }
    let searchedText = getValueFromTextBox();

    if(searchedText.length == 0){
        searchButtonShow();
        AddButtonHide();
        renderTaskInAsHTML(tasks);
        return;
    }

    let tempTask = [];

    for(let i in tasks){
        if(tasks[i].startsWith(searchedText)){
            tempTask.push(tasks[i]);
        }
    }

    if(tempTask.length == 0){
        AddButtonShow();
        searchButtonHide();
    }
    
    renderTaskInAsHTML(tempTask)
    
}

function addButtonClicked(){
    addTaskInStorage();
    renderTaskInAsHTML(tasks);
    AddButtonHide();
    searchButtonShow();
}

function editedButtonClicked(element){
    let updatedValue = element.parentNode.parentNode.children[1].children[0].value;
    let indexInTasks = element.parentNode.parentNode.children[0].innerText;
    let previousValue = tasks[indexInTasks];

    fetch(url,{
        method: 'PUT',
        headers : { "content-type" : "application/json;" },
        body:JSON.stringify(
            [
                {
                    id: indexInTasks,
                    data:previousValue
                },
                {
                    id: indexInTasks,
                    data:updatedValue
                }
            ])
    })
    .then((res) => res.json())
    .then((data)=> {
        if(data["message"] == "Success"){
            getTheDataFromAPI()
            .then((data) =>{
            tasks = convertJSONToArray(data);
            renderTaskInAsHTML(tasks);
        })
        }
        else if(data["message"] == "failed")
            throw "failed";
    })
    .catch((data) => {
        console.log(data);
    })
}

function modifyItem(element){
    let editField = element.parentNode.parentNode.children[1];
    let previousText = editField.innerHTML;
    let immediateParent = element.parentNode;
    immediateParent.innerHTML = `<i class="fa fa-check fa-2x" aria-hidden="true" onclick="editedButtonClicked(this)"></i>`;
    
    editField.innerHTML = `<input class="edit-field" type="textarea" value="${previousText}">`;
}

function deleteItem(element){
    let task = element.parentNode.parentNode.childNodes[3].innerText;
    let indexInTasks = element.parentNode.parentNode.childNodes[1].innerText;
    
    fetch(url,{
        method: 'DELETE',
        headers : { "content-type" : "application/json;" },
        body:JSON.stringify(
                {
                    id: indexInTasks,
                    data:task
                })
    })
    .then((res) => res.json())
    .then((data)=> {
        if(data["message"] == "Success"){
            getTheDataFromAPI()
            .then((data) =>{
            tasks = convertJSONToArray(data);
            renderTaskInAsHTML(tasks);
        })
        }
        else if(data["message"] == "failed")
            throw "failed";
    })
    .catch((data) => {
        console.log(data);
    })
}

function navButtonClicked(element){
    hideAllContentAndActiveClasses();
    element.classList.add("active");

    switch(element.innerHTML.toLowerCase()){
        case 'to-do':
                document.getElementsByClassName("to-do")[0].style.display = 'block';
            break;
        case 'users':
                document.getElementsByClassName("users")[0].style.display = 'block';
            break;
        case 'contact-us':
                document.getElementsByClassName("contact-us")[0].style.display = 'block';
                break;
    }

    function hideAllContentAndActiveClasses(){
        let toDo = document.getElementsByClassName("to-do")[0];
        let users = document.getElementsByClassName("users")[0];
        let contactUs = document.getElementsByClassName("contact-us")[0];

        toDo.style.display = 'none';
        users.style.display = 'none';
        contactUs.style.display = 'none';

        let navElements = element.parentNode.children;
        for(let i =0; i < navElements.length;i++){
            navElements[i].classList.remove("active");
        }
    }

}


// Helper Functions

function AddButtonHide(){
    let addButton = document.getElementsByClassName("fa-plus")[0];
    addButton.style.display = 'none';
}

function AddButtonShow(){
    let addButton = document.getElementsByClassName("fa-plus")[0];
    addButton.style.display = 'inline-block';
}

function searchButtonHide(){
    let addButton = document.getElementsByClassName("fa-search")[0];
    addButton.style.display = 'none';
}

function searchButtonShow(){
    let addButton = document.getElementsByClassName("fa-search")[0];
    addButton.style.display = 'inline-block';
}

function getValueFromTextBox(){
    let text = document.getElementsByClassName("input-field")[0].value;
    return text;
}

function clearSearchFiedl(){
    document.getElementsByClassName("input-field")[0].value = "";
}

function addTaskInStorage(){
    let task = getValueFromTextBox();
    clearSearchFiedl();
    fetch(url,{
        method: 'POST',
        headers : { "content-type" : "application/json;" },
        body:JSON.stringify({data:task})
    })
    .then((res) => res.json())
    .then((data)=> {
        if(data["message"] == "Success"){
            getTheDataFromAPI()
            .then((data) =>{
            tasks = convertJSONToArray(data);
            renderTaskInAsHTML(tasks);
        })
        }
        else if(data["message"] == "failed")
            throw "failed";
    })
    .catch((data) => {
        console.log(data);
    })
}