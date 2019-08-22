var tasks = [];

function addButtonClicked(){
    addTaskInStorage();
    renderTaskInAsHTML(tasks);
    AddButtonHide();
    searchButtonShow();
}

function addTaskInStorage(){
    let task = getValueFromTextBox();
    clearSearchFiedl();
    tasks.push(task);

}

function getValueFromTextBox(){
    let text = document.getElementsByClassName("input-field")[0].value;
    return text;
}

function clearSearchFiedl(){
    document.getElementsByClassName("input-field")[0].value = "";
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

function deleteItem(element){
    let indexInTasks = element.parentNode.parentNode.childNodes[0].innerText;
    tasks.splice(indexInTasks,1);
    renderTaskInAsHTML(tasks);
}

function modifyItem(element){
    let editField = element.parentNode.parentNode.children[1];
    let previousText = editField.innerHTML;
    let immediateParent = element.parentNode;
    immediateParent.innerHTML = `<i class="fa fa-check fa-2x" aria-hidden="true" onclick="editedButtonClicked(this)"></i>`;
    
    editField.innerHTML = `<input class="edit-field" type="textarea" value="${previousText}">`;
}


function editedButtonClicked(element){
    let updatedValue = element.parentNode.parentNode.children[1].children[0].value;
    let indexInTasks = element.parentNode.parentNode.children[0].innerText;
    replaceValue(indexInTasks,updatedValue);
}

function replaceValue(index, value){
    tasks[index] = value;
    renderTaskInAsHTML(tasks); 
}


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

