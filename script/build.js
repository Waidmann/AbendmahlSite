let quizContainer;
let resultsContainer;
let submitButton;
let answers;
let previousButton;
let nextButton;
let slides;
let currentSlide = 0;

const myQuestions = [
    {
        question: "Von wem stammt die Aussage: <br><i>\"Ui, da bahnt sich was an, das Mädchen zieht sich schon aus\"</i>?",
        answers: {
            a: "Lina",
            b: "Lara",
            c: "Paul",
            d: "Oscar"
        },
        correctAnswer: "b"
    },
    {
        question: "Von wem stammt die Aussage: <br><i>\"Wenn man Besuch hat und dann einfach ein Party Hurensohn da ist...\"</i>?",
        answers: {
            a: "David",
            b: "Oscar",
            c: "Anoki"
        },
        correctAnswer: "c"
    },
    {
        question: "Wer empfindet Kren und Senf als \"ekelige Sachen\"?",
        answers: {
            a: "Paul",
            b: "Anoki",
            c: "Filip",
            d: "Erik"
        },
        correctAnswer: "b"
    },
    {
        question: "Wer hat die \"Abendmahl\" WhatsApp Gruppe erstellt?",
        answers: {
            a: "Lara",
            b: "Oscar",
            c: "Paul",
            d: "Natalie"
        },
        correctAnswer: "a"
    },
    {
        question: "Welches ist das Erstellungs-datum der \"Abendmahl\" WhatsApp Gruppe?",
        answers: {
            a: "5/6/2018",
            b: "22/3/2018",
            c: "11/5/2017",
            d: "10/12/2017"
        },
        correctAnswer: "d"
    }
];

$(function () {
    previousButton = document.getElementById("previous");
    nextButton = document.getElementById("next");
    quizContainer = document.getElementById('quiz');
    resultsContainer = document.getElementById('results');
    submitButton = document.getElementById('submit');

    submitButton.addEventListener('click', showResults);
    nextButton.addEventListener('click', nextSlide);
    previousButton.addEventListener('click', prevSlide);

    buildQuiz();
    slides = document.querySelectorAll(".slide");
    showSlide(0);
});

function prevSlide() {
    showSlide(Math.max(currentSlide - 1, 0));
}

function nextSlide() {
    showSlide(Math.min(currentSlide + 1, slides.length));
}

function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    currentSlide = n;
    if(currentSlide===0){
        previousButton.style.display = 'none';
    }
    else{
        previousButton.style.display = 'inline-block';
    }
    if(currentSlide===slides.length-1){
        nextButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
    }
    else{
        nextButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
    }
}

function buildQuiz() {
    const output = [];

    myQuestions.forEach(
        (currentQuestion, questionNumber) => {
            const answers = [];

            for (letter in currentQuestion.answers) {

                answers.push(`<label>
                                <input type="radio" name="question${questionNumber}" value="${letter}">
                                    ${letter} :
                                    ${currentQuestion.answers[letter]}
                              </label>`
                );
            }

            output.push(
                 `<div class="slide">
                    <div class="question"> ${currentQuestion.question} </div>
                    <div class="answers"> ${answers.join("")} </div>
                  </div>`
            );
        }
    );

    quizContainer.innerHTML = output.join('');
}

function showResults(){
    const answerContainers = quizContainer.querySelectorAll('.answers');

    let numCorrect = 0;

    myQuestions.forEach( (currentQuestion, questionNumber) => {

        const answerContainer = answerContainers[questionNumber];
        const selector = 'input[name=question'+questionNumber+']:checked';
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;

        if(userAnswer===currentQuestion.correctAnswer){
            numCorrect++;
            answerContainers[questionNumber].style.color = 'lightgreen';
        }
        else{
            answerContainers[questionNumber].style.color = 'red';
        }
    });
    resultsContainer.innerHTML = numCorrect + ' out of ' + myQuestions.length;

    let resGif = document.getElementById("resultGif");
    resGif.src = "resources/" + numCorrect + "of" + myQuestions.length + ".gif";
    resGif.setAttribute("onerror", "this.src='" + "resources/" + numCorrect + "of" + myQuestions.length + ".jpg';");

    nextButton.style.display = "none";
    previousButton.style.display = "none";
    submitButton.style.display = "none";
    quizContainer.style.display = "none";

    resGif.style.display = "block";
}




/*
var config = {
    apiKey: "AIzaSyD4jq8T8rvPRh0QKgRQN6FCBy8QQSayMOA",
    authDomain: "abendmahl-9a005.firebaseapp.com",
    databaseURL: "https://abendmahl-9a005.firebaseio.com",
    projectId: "abendmahl-9a005",
    storageBucket: "",
    messagingSenderId: "643977983264"
};
firebase.initializeApp(config);




$(function () {
    if(isEncoded() && !isDebug())
        showLogin(decodeSite);
    else if(!isEncoded() && !isDebug())
        showLogin(encodeSite);
});

function showLogin(delegate) {
    let pass = window.prompt("Enter password", "password");
    delegate(pass);
}

function isEncoded() {
    return $("meta[name='encrypted']").attr("content") === "true";
}

function isDebug() {
    return $("meta[debug='true']").attr("debug") === "true";
}

function toDataURL(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        let reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function encodeSite(passphrase) {
    $("meta[name]").attr("content", "true");

    $("[encoding-type]").each(function (a, element) {


        notNull(element.getAttribute("data-url"), function (text) {
            text.split(",").forEach(function (e) {
                toDataURL(element.getAttribute(e), function (encoded) {
                    element.setAttribute(e, encoded);
                });
            })
        });


        element.getAttribute("encoding-type").split(",").forEach(function (e) {
            if(e === "content"){
                element.innerHTML = CryptoJS.AES.encrypt(element.innerHTML, passphrase);
            }else{
                element.setAttribute(e, CryptoJS.AES.encrypt(element.getAttribute(e), passphrase));
            }
        });
    });
}

function notNull(value, delegate){
    if(value != null)
        delegate(value);
}

function decodeSite(passphrase) {
    $("[encoding-type]").each(function (a, element) {
        element.getAttribute("encoding-type").split(",").forEach(function (e) {
            if(e === "content"){
                element.innerHTML = CryptoJS.AES.decrypt(element.innerHTML, passphrase).toString(CryptoJS.enc.Utf8);
            }else{
                element.setAttribute(e, CryptoJS.AES.decrypt(element.getAttribute(e), passphrase).toString(CryptoJS.enc.Utf8));
            }
        });
    });
}
*/