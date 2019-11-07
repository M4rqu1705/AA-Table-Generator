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

var parser = new DOMParser();
const table = document.getElementsByTagName('table')[0].children[0];
let templateCell = document.createElement("td"); templateCell.classList.add('align-middle'); templateCell.innerHTML = "<div contenteditable='true'></div>";

function updateTable(param){
	const insertRegex = /\((\d+),(\d+)\)([l|r|u|d])([\+|-])/;

	let rows = table.children.length;
	let columns = table.children[0].children.length;
	let processedTable = '';


	if(insertRegex.test(param)){
		m = insertRegex.exec(param);
		rowPos = m[1]; colPos = m[2];
		side = m[3]; action = m[4];

		// Store table data into array
		tempTable = [];
		for(let r = 0; r < rows; r++){
			tempTable.push([]);
			for(let c = 0; c < columns; c++){
				tempTable[r].push(table.children[r].children[c]);
			}
		}

		// Perform action accordingly
		if(action === '+'){
			switch(side){
				case 'l':
					for(let r = 0; r < rows; r++)
						tempTable[r].splice(colPos, 0, templateCell);
					columns+=1;
					break;
				case 'r':
					for(let r = 0; r < rows; r++)
						tempTable[r].splice(colPos+1, 0, templateCell);
					columns+=1;
					break;
				case 'u':
					newRow = []
					for(let c = 0; c < columns; c++)
						newRow.push(templateCell);
					tempTable.splice(rowPos, 0, newRow);
					rows+=1;
					break;
				case 'd':
					newRow = []
					for(let c = 0; c < columns; c++)
						newRow.push(templateCell);
					tempTable.splice(rowPos+1, 0, newRow);
					rows+=1;
					break;
			}
		} else{
			for(let r = 0; r < rows; r++){
				tempTable[r].splice(colPos-1,colPos);
			}
			columns-=1;
		}

		// Stringify tempTable
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
	}
}

function insertEmpty(side){
	element = document.getElementById("selected-cell");
	rowPos = element.parentNode.parentNode.rowIndex;
	colPos = element.parentNode.cellIndex;

	output = ["(", rowPos, ",", colPos, ")", side, "+"].join("")

	updateTable(output);
}


table.addEventListener('click', function(e){
	const divs = document.querySelectorAll('div[contenteditable=true]');
	for(let c = 0; c<divs.length; c++){
		divs[c].id = '';
		divs[c].parentNode.style.border = "none";
	}
	if(event.target.tagName == 'DIV'){
		e.target.id = 'selected-cell';
		e.target.parentNode.style.border = "1px solid black";
	}else{
		event.target.children[0].id = 'selected-cell';
		e.target.style.border = "1px solid black";
	}
});

updateTable();
