let jsonBooks=[];
const table = document.querySelector("table tbody");
const search = document.querySelector("table input");

const printValue=(json,value)=>{
    writers=[]
    json.forEach(el=>{
        writers.push(el[value]);
    });
    return writers.toString();
}

const printRows=(search)=>{
    let fragment = document.createDocumentFragment();
    let template = document.querySelector("template").content;
    jsonBooks.forEach(book=>{
        if((search && String(book.title.toUpperCase()).includes(search.toUpperCase())) || !search){
            template.querySelector("tr td.title").textContent=book.title;
            template.querySelector("tr td.year").textContent=book.year;
            template.querySelector("tr td.price").textContent=book.prices;
            template.querySelector("tr td.writers").textContent=printValue(book.writers,"name");
            let clone = template.cloneNode(true);
            fragment.appendChild(clone);
        }
    });
    table.innerHTML=""
    table.appendChild(fragment);
}

const loadBooks=async()=>{
    let res = await fetch("data/books.json");
    jsonBooks = await res.json();
}

const init=async()=>{
    await loadBooks();
    printRows();
    search.addEventListener("keyup",()=>{
        if(search.value.length>=3){
            printRows(search.value);
        }
    });
    search.addEventListener("keydown",()=>{
        if(search.value.length<3){
            printRows()
        }
    })
}

window.onload=init();