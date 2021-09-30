const send = document.querySelector("form input[type='submit']");
const container = document.querySelector("form #container");
const quiz = document.querySelector("form");
let QuizJSON = [];

const getAnswers=(data)=>{
    let answers = []
    QuizJSON.forEach((ask,index)=>{
        answers.push(data.get(`${index+1}`));
    });
    return answers;
}

const checkQuiz=(e)=>{
    e.preventDefault();
    let data = new FormData(quiz);
    let answers=getAnswers(data); // response user
    let solutions=[];
    QuizJSON.forEach((ask,index)=>{
        let jsonSolution = {
            ask:index+1,
            text:ask.answers.filter(answer=>answer.valid==true)[0].text
        }
        solutions.push(jsonSolution);
    });
    solutions.forEach(solution=>{
        let response = answers.find(answer=>answer==solution.text);
        console.log(response,solution.text);
        if(response==undefined){
            document.querySelector(`#container div#n${solution.ask}`).style.background="rgba(255,0,0,.3)";
        }else{
            document.querySelector(`#container div#n${solution.ask}`).removeAttribute("style");
        }
    });
}

const printAnswers=(answers,id,fragment,template)=>{
    let templateAnswers = document.querySelector("body template#answers").content;
    let fragmentAnswers = document.createDocumentFragment();
    answers.forEach((answer,index)=>{
        templateAnswers.querySelector("span > input").dataset.check=answer.valid;
        templateAnswers.querySelector("span > input").setAttribute("name",id);
        templateAnswers.querySelector("span > input").setAttribute("value",answer.text);
        templateAnswers.querySelector("span > input").setAttribute("id",`${id}${index+1}`);
        templateAnswers.querySelector("span > label").setAttribute("for",`${id}${index+1}`);
        templateAnswers.querySelector("span > label").textContent=answer.text;
        let clone = templateAnswers.cloneNode(true);
        fragmentAnswers.appendChild(clone);
    });
    return fragmentAnswers;
}

const printQuiz=()=>{
    let templateAsk = document.querySelector("body template#ask").content;
    let fragmentAsk = document.createDocumentFragment();
    QuizJSON.forEach((ask,index)=>{
        templateAsk.querySelector("div").setAttribute("id",`n${index+1}`);
        templateAsk.querySelector("div > b").textContent=`${index+1} ${ask.ask}`;
        templateAsk.querySelector("div > div").innerHTML="";
        templateAsk.querySelector("div > div").appendChild(printAnswers(ask.answers,index+1));
        let cloneAsk = templateAsk.cloneNode(true);
        fragmentAsk.appendChild(cloneAsk);
    });
    container.appendChild(fragmentAsk);
}

const loadQuiz=async()=>{
    let res = await fetch("data/quiz.json");
    QuizJSON = await res.json();
}

const init=async()=>{
    await loadQuiz();
    printQuiz();
    send.addEventListener("click",checkQuiz);
}

init();