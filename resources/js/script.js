class Cell{
    constructor(row, col, rowspan, colspan, color, background, content){
        this._row = row;
        this._column = col;
        this._rowspan = rowspan;
        this._colspan = colspan;
        this._color = color;
        this._background = background;
        this._content = content;
    }

    get row(){  return(this._row);   }
    set row(row){   this._row = row; }

    get column(){  return(this._column);   }
    set column(column){   this._column = column; }

    get rowspan(){  return(this._rowspan);   }
    set rowspan(rowspan){   this._rowspan = rowspan; }

    get colspan(){  return(this._colspan);   }
    set colspan(colspan){   this._colspan = colspan; }

    get color(){  return(this._color);   }
    set color(color){   this._color = color; }

    get background(){  return(this._background);   }
    set background(background){   this._background = background; }

    get content(){  return(this._content);  }
    set content(content){  this._content = content;  }
};

const table = document.getElementsByTagName('table')[0].children[0];
let templateCell = document.createElement("td"); templateCell.classList.add('align-middle'); templateCell.innerHTML = "<div contenteditable='true'>Placeholder</div>";

Array.prototype.insert = function (index, item) {
    this.splice( index, 0, item );
};

function updateTable(param){
    const insertRegex = /\((\d+),(\d+)\)([l|r|u|d|c])([\+|-])/;
    const clearRegex = /reset/;

    let rows = table.children.length;
    let columns = table.children[0].children.length;


    if(insertRegex.test(param)){
        // Extract important data from parameters
        m = insertRegex.exec(param);
        rowPos = Number(m[1]); colPos = Number(m[2]);
        side = m[3]; action = m[4];

        // 'Convert' table into array
        tempTable = [];
        for(let r = 0; r < rows; r++){
            tempTable.push([]);
            for(let c = 0; c < columns; c++){
                tempTable[r].push(table.children[r].children[c]);
            }
        }
        console.log(tempTable);

        // Perform action accordingly
        if(action === '+'){
            switch(side){
                case 'l':
                    console.log("Adding column left");
                    console.log(["Current Row: ", rowPos, " Current Column: ", colPos].join(""))
                    for(let r = 0; r < rows; r++)
                        tempTable[r].insert(colPos, templateCell);
                    columns+=1;
                    break;
                case 'r':
                    console.log("Adding column right");
                    console.log(["Current Row: ", rowPos, " Current Column: ", colPos].join(""))
                    columns+=1;
                    for(let r = 0; r < rows; r++)
                        tempTable[r].insert(colPos+1, templateCell);
                    break;
                case 'u':
                    newRow = []
                    rows+=1;
                    for(let c = 0; c < columns; c++)
                        newRow.push(templateCell);
                    tempTable.insert(rowPos, newRow);
                    break;
                case 'd':
                    newRow = []
                    for(let c = 0; c < columns; c++)
                        newRow.push(templateCell);
                    tempTable.insert(rowPos+1, newRow);
                    rows+=1;
                    break;
            }
        } else{
            switch(side){
                case 'r':
                    delete tempTable[rowPos];
                    rows-=1;
                    break;
                case 'c':
                    for(let r = 0; r < rows; r++){
                        delete tempTable[r][colPos];
                    }
                    columns-=1;
                    break;
            }
        }

        // Stringify answer
        output = "<tbody>";
        for(let r = 0; r < rows; r++){
            output += '<tr>';
            for(let c = 0; c < columns; c++){

                output += tempTable[r][c].outerHTML;
            }
            output += '</tr>';
        }
        output += "</tbody>";

        table.innerHTML = output;

        return;
    } else if(clearRegex.test(param)){
        output = '<tbody>';
        for(let r = 0; r < rows; r++){
            output += '<tr>';
            for(let c = 0; c < columns; c++){
                output += templateCell.outerHTML;
            }
            output += '</tr>';
        }
        output += '</tbody>';

        table.innerHTML = output;
        return;
    }
}

function insertEmpty(side){
    element = document.getElementById('selected-cell');
    rowPos = element.parentNode.parentNode.rowIndex;
    colPos = element.parentNode.cellIndex;
    output = ['(', rowPos, ',', colPos, ')', side, '+'].join('')
    updateTable(output);
}

function remove(part){
    element = document.getElementById('selected-cell');
    rowPos = element.parentNode.parentNode.rowIndex;
    colPos = element.parentNode.cellIndex;
    if(part == 'row'){
        output = ['(', rowPos, ',', colPos, ')', 'r', '-'].join('')
    } else if(part == 'column'){
        output = ['(', rowPos, ',', colPos, ')', 'c', '-'].join('')
    }
    updateTable(output);
}

var moved = false;
var dragStart;
$(table)
    .mousedown(function(e){  
        moved = false;
        dragStart = e.target
        divs = document.querySelectorAll('#drag-content');
        if(divs !== null && divs != undefined && divs.length != 0){
            console.log("Removing 'drag-content' from");
            console.log(divs);
            for(var d = 0; d < divs.length; d++)
                divs[d].id = '';
        }
    })
    .mousemove(function(){  moved = true;   })
    .mouseup(function(e) {
        function retrieveCell(target){
            if(target.tagName == 'DIV'){
                return(target);
            } else{
                return(target.children[0]);
            }
        }

        // Click
        if (!moved) {
            var divs = document.querySelectorAll('div[contenteditable=true]');
            for(let c = 0; c<divs.length; c++){
                divs[c].id = '';
                divs[c].parentNode.style.border = "";
                divs[c].backround = '#00000000';
            }

            selected = retrieveCell(e.target)
            selected.id = 'selected-cell';
            selected.parentNode.style.border = "2px solid #000000";

            // Drag
        } else{
            let dragEnd = e.target;
            dragPos = {"start": {"row":0,"column":0}, "end": {"row":0,"column":0} };

            // Get selected cells positions
            dragStart = retrieveCell(dragStart);
            dragEnd = retrieveCell(dragEnd);

            dragPos.start.row = dragStart.parentNode.parentNode.rowIndex;
            dragPos.start.column = dragStart.parentNode.cellIndex;

            dragPos.end.row = dragEnd.parentNode.parentNode.rowIndex;
            dragPos.end.column = dragEnd.parentNode.cellIndex;

            // Apply id to change selected div's styles
            for(var r = dragPos.start.row; r <= dragPos.end.row; r++){
                for(var c = dragPos.start.column; c <= dragPos.end.column; c++){
                    table.children[r].children[c].children[0].id = 'drag-content';
                }
            }

        }
    });

updateTable();
var divs = document.querySelectorAll('div[contenteditable=true]');
divs[0].backgroundColor = "#000000";
