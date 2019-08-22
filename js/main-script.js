var tasks = [];

function addButtonClicked(){
    addTaskInStorage();
    renderTaskInAsHTML();
}

function addTaskInStorage(){
    let task = getValueFromTextBox();
    tasks.push(task);

    function getValueFromTextBox(){
        let text = document.getElementsByClassName("input-field")[0].value;
        return text;
    }
}

function renderTaskInAsHTML(){
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
                        <i class="fa fa-trash" onclick="deleteItem(this);"></i>
                        <i class="fa fa-wrench" onclick="modifyItem(this);"></i>
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
    let indexInTasks = element.parentNode.parentNode.firstElementChild.innerText;
    tasks.splice(indexInTasks,1);
    renderTaskInAsHTML();
}






