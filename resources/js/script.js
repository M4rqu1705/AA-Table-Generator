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

const table = document.getElementsByTagName('table')[0];
var rows = table.children[0].children.length + table.children[1].children.length;
var columns = table.children[1].children[0].children.length;

temp = ''

for(var r = 0; r < rows; r++){
    temp += '<tr>'
    for(var c = 0; c < columns; c++){
        temp += '<td>' + r + '</td>';
    }
    temp += '</tr>'
}

document.write('<table class="table table-responsive table-bordered table-striped">' + temp + '</table>')
