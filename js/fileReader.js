// Parses a CSV content into a JavaScript 2D array
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
                            type: rental[2],
                            dist: rental[3],
                            car: rental[4]};
    }
    
    return javaTable;
    
}

// Parses a JavaScript 2D array into an HTML table
function javaScriptToHTML(table) {
    
}

// Sorts an array of dates
function sortByDate(dateArray) {
    
}

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
            alert("Le fichier à fournir doit être de type CSV. Merci de réessayer.");
        } else {
            
            // It is a CSV
            var reader = new FileReader();
            reader.addEventListener('load', function () {
                // From file's content to JavaScript table, to HTML table
                //var htmlTable = javaScriptToHTML(csvToJavaScript(reader.result));
                var javaTable = csvToJavaScript(reader.result);
            });
            // Reads the given file
            reader.readAsText(fileListElt.files[0]);
            
        }
        
    });
    
}
