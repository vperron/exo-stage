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
                            dura: (new Date(rental[1]) - new Date(rental[0])),
                            type: rental[2],
                            dist: rental[3],
                            car: rental[4]};
        
    }
    
    
    // Sorts the rentals in ascending start time order
    return javaTable.sort(function (a,b){
        return new Date(a.beg) - new Date(b.beg);
    });
    
    
    /*
    // Sorts the rentals in ascending start time order
    javaTable = javaTable.sort(function (a,b){
        return new Date(a.beg) - new Date(b.beg);
    });
    
    for (var i in ("beg", "end")) {
        
    }
    */
    
}

// Parses a JavaScript 2D array into an HTML table
function javaScriptToHTML(javaTable) {
    var tableElt = document.createElement("table");
    tableElt.id = "table";
    
    // For each rental
    for (var i = 0; i < javaTable.length; i++) {
        
        var rentElts = new Array(javaTable.length);
        rentElts[i] = document.createElement("tr");
        
        // For each data
        for (var j in javaTable[i]) {
            
            var dataElts = new Array(6);
            dataElts[j] = document.createElement("td");
            dataElts[j].class = j;
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
            
            // It is a CSV
            var reader = new FileReader();
            reader.addEventListener('load', function () {
                
                // From file's content to JavaScript table, to HTML table
                var javaTable = csvToJavaScript(reader.result);
                var htmlTable = javaScriptToHTML(javaTable);
                
                document.body.appendChild(htmlTable);
                
                //TESTS
                
            });
            // Reads the given file
            reader.readAsText(fileListElt.files[0]);
            
        }
        
    });
    
}
