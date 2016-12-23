//// FUNCTIONS
// Parses a CSV content into a sorted JavaScript 2D array
function csvToJavaScript(txt) {
    
    // Regular expression definition
    var rentRegExp = new RegExp("((.+),){4}(.+)\n", "g");
    
    var rentals = txt.match(rentRegExp);
    
    // Result to return
    var javaTable = new Array(rentals.length - 1);
    
    for (var i = 1; i < rentals.length; i++) {
        rental = rentals[i].split(",");
        // JSON-like representation of each rental
        javaTable[i - 1] = {beg: rental[0],
                            end: rental[1],
                            // Duration of the rental
                            dura: (new Date(rental[1]) - new Date(rental[0])),
                            type: rental[2],
                            dist: rental[3],
                            car: rental[4]};
    }
    
    /*
    // Sorts the rentals in ascending start time order
    return javaTable.sort(function (a,b){
        return new Date(a.beg) - new Date(b.beg);
    });
    */
    
    // Sorts the rentals in ascending start time order
    javaTable = javaTable.sort(function (a,b){
        return new Date(a.beg) - new Date(b.beg);
    });
    
    // Translation of variables 'beg', 'end' and 'dura' to an understandable format
    for (var i = 0; i < javaTable.length; i++) {
        for (var j in javaTable[i]) {
            if ((j === "beg") || (j === "end")) {
                var date = new Date(javaTable[i][j]);
                javaTable[i][j] = date.getDate() + "/" +
                                     (date.getMonth() + 1).toString() + "/" +
                                     date.getFullYear() + ", " +
                                     (date.getHours() + 4).toString() + ":" +
                                     date.getMinutes() + ":" +
                                     date.getSeconds();
            } else if (j === "dura") {
                // Duration in minutes
                var val = javaTable[i][j];
                val = Math.floor(val / (1000 * 60)).toString() + ":" +
                      ((val / 1000) % 60).toString().match(/.+\./)[0].slice(0, -1);
                javaTable[i][j] = val;
            }

        }
    }
    
    return javaTable;    
    
}

// Parses a JavaScript 2D array into an HTML table
function javaScriptToHTML(javaTable) {
    var tableElt = document.createElement("table");
    tableElt.id = "table";
    
    // Head of the table
    var tableHeadElt = document.createElement("tr");
    tableHeadElt.id = "tableHead";
    
    var tableHeadDataElts = new Array(6);
    for (var i = 0; i < 6; i++) {
        tableHeadDataElts[i] = document.createElement("td");
    }
    tableHeadDataElts[0].textContent = "Début";
    tableHeadDataElts[1].textContent = "Fin";
    tableHeadDataElts[2].textContent = "Durée";
    tableHeadDataElts[3].textContent = "Type";
    tableHeadDataElts[4].textContent = "Distance";
    tableHeadDataElts[5].textContent = "Voiture";
    
    for (var i = 0; i < 6; i++) {
        tableHeadElt.appendChild(tableHeadDataElts[i]);
    }
    
    tableElt.appendChild(tableHeadElt);
    
    // For each rental
    var rentElts = new Array(javaTable.length);
    for (var i = 0; i < javaTable.length; i++) {
        
        rentElts[i] = document.createElement("tr");
        
        // For each data
        var dataElts = new Array(6);
        for (var j in javaTable[i]) {
            
            dataElts[j] = document.createElement("td");
            dataElts[j].className = j;
            dataElts[j].textContent = javaTable[i][j];
            
            rentElts[i].appendChild(dataElts[j]);
        }
        
        tableElt.appendChild(rentElts[i]);
        
    }
    
    return tableElt;
    
}

//// MAIN
// Checks if the browser supports the files APIs
if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    // It does not
    alert("Votre navigateur ne permet pas la manipulation de fichiers.");
} else {
    
    // It does
    var fileListElt = document.getElementById("inputFile");
    fileListElt.addEventListener('change', function () {
        
        // Checks if the file's extension
        if (!/\.csv$/i.test(fileListElt.files[0].name)) {
            // It is not a CSV
            alert("Le fichier fourni doit être de type CSV. Merci de réessayer.");
        } else {
            
            // Remove previous table
            try {
                document.body.removeChild(document.getElementById("table"));
            } catch(e) {}
            
            // It is a CSV
            var reader = new FileReader();
            reader.addEventListener('load', function () {
                
                // From file's content to JavaScript table, to HTML table
                var javaTable = csvToJavaScript(reader.result);
                var htmlTable = javaScriptToHTML(javaTable);
                
                document.body.appendChild(htmlTable);
                
            });
            // Reads the given file
            reader.readAsText(fileListElt.files[0]);
            
        }
        
    });
    
}
