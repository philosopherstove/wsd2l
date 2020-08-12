const app = {};

/* FUNCTIONS */
app.func = {};
app.func.create       = {};
app.func.createAppend = {};
app.func.event        = {};
app.func.get          = {};
app.func.give         = {};
app.func.init         = {};
app.func.remove       = {};
app.func.sort         = {};
app.func.update       = {};
/*
*****************
function hotkeys:
*****************
CREATEAPPEND
app.func.createAppend.quiz = ()=>{
CREATE
app.func.create.questionCards = ()=>{
app.func.create.options = (options, answer)=>{
GET
app.func.get.quizTime = (startTime)=>{
EVENT
app.func.event.exitQuiz = ()=>{
app.func.event.selectOption = (me)=>{
app.func.event.startQuiz = async()=>{
GIVE
app.func.give.body_scrollFreeAttr = ()=>{
app.func.give.body_scrollLockAttr = ()=>{
app.func.give.quizButton_listener = ()=>{
app.func.give.stars_fill = ()=>{
INIT
app.func.init.component = ()=>{
REMOVE
app.func.remove.quiz = ()=>{
SORT
app.func.sort.shuffle = (arr)=>{
UPDATE
app.func.update.results_inLocalStorage = (scorePacket)=>{
*/

/* SETTINGS */
app.setting               = {};
app.setting.questionCards = null;
app.setting.questionCount = 0;
app.setting.questions     = [
    {
        question: "You can think of DNA as?",
        options: {
            a: "an engine",
            b: "instructions",
            c: "a transporter",
            d: "a tanscriber"
        },
        answer: "b"
    },
    {
        question: "DNA's structure is referred to as?",
        options: {
            a: "a twisted ladder",
            b: "a double-helix",
            c: "a spiral staircase",
            d: "a helical twist"
        },
        answer: "b"
    },
    {
        question: "Which ONE of the following is NOT one of DNA's essential functions?",
        options: {
            a: "replication",
            b: "transcription",
            c: "evolving",
            d: "provide instructions"
        },
        answer: "b"
    },
    {
        question: "Which is a correct nitrogenous pair in DNA?",
        options: {
            a: "A–T (adenine, thymine)",
            b: "A–C (adenine, cytosine)",
            c: "G–T (guanine, thymine)",
            d: "A–G (adenine, guanine)"
        },
        answer: "a"
    },
    {
        question: "What type of bond holds the nitrogenous bases of DNA together?",
        options: {
            a: "a carbon bond",
            b: "a nitrogen bond",
            c: "an RNA bond",
            d: "a hydrogen bond"
        },
        answer: "d"
    }
];
app.setting.score = 0;
app.setting.time  = 0;



/***********
CREATEAPPEND
************/
app.func.createAppend.quiz = ()=>{
    return new Promise(async(resolve)=>{
        let questionCards = await app.func.create.questionCards();
        let html = `
            <div class="quiz">
                ${questionCards}
                <div class="cancelQuizButton" onclick="app.func.event.exitQuiz()">Cancel Quiz<span></span></div>
            </div>
        `;
        let wrap = document.querySelector('.wrap');
            wrap.insertAdjacentHTML('beforeend', html);
        resolve();
    });
};


/*****
CREATE
******/
app.func.create.questionCards = ()=>{
    return new Promise(async(resolve)=>{
        let html = ``;
        app.func.sort.shuffle(app.setting.questions);
        for(let i = 0; i < app.setting.questions.length; i++){
            let obj      = app.setting.questions[i];
            let question = obj.question;
            let answer   = obj.answer;
            let options  = Object.entries(obj.options);
            app.func.sort.shuffle(options);
            if( i === 0){
                html += `<div class="questionCard">`;
            }
            else{
                html += `<div class="questionCard displayNone">`;
            };
            html += `
                    <h6>Q${i+1}</h6>
                    <p class="question">${question}</p>
                    ${await app.func.create.options(options, answer)}
                </div>
            `;

            if( i === app.setting.questions.length-1){ // end of loop
                resolve(html);
            };
        };
    });
};


app.func.create.options = (options, answer)=>{
    return new Promise((resolve)=>{
        let html = `<div class="options">`;
        for(let i = 0; i < options.length; i++){
            let number = i+1;
            let letter = options[i][0];
            let text   = options[i][1];
            if( letter === answer){
                html += `<p onclick="app.func.event.selectOption(this)" a=""><span>${number}.</span><span>${text}</span></p>`;
            }
            else{
                html += `<p onclick="app.func.event.selectOption(this)"><span>${number}.</span><span>${text}</span></p>`;
            };
            if( i === options.length-1){ // end of loop
                html += `</div>`; // add closing div
                resolve(html);
            };
        };
    });
};


/**
GET
***/
app.func.get.quizTime = (startTime)=>{
    let current = Date.now();
    let elapsed = current - startTime;
    let elapsedSeconds = (elapsed / 1000).toFixed(2);
    return elapsedSeconds;
};


/****
EVENT
*****/
app.func.event.exitQuiz = ()=>{
    app.func.remove.quiz();
};


app.func.event.selectOption = (me)=>{
    /* correct answer incr score */
    if( me.hasAttribute('a')){
        app.setting.score++;
        console.log('correct');
    }
    /* Reached end of questions */
    if(app.setting.questionCards.length-1 === app.setting.questionCount){

        /* hide current questionCard */
        app.setting.questionCards[app.setting.questionCount].classList.add('displayNone');
        // serve endQuizPage
        let time         = app.func.get.quizTime(app.setting.time);
        let result       = `${app.setting.score}/${app.setting.questionCards.length} in ${time}s`;
        let scorePacket  = [app.setting.score, time];
        let results      = app.func.update.results_inLocalStorage(scorePacket);
        let highest      = results.highest;
            highest      = `${highest[0]}/${app.setting.questionCards.length} in ${highest[1]}s`;
        let first        = results.first;
            first        = `${first[0]}/${app.setting.questionCards.length} in ${first[1]}s`;
        let html = `
            <div class="endQuizPage">
                <h6 class="result">
                    <span>Result:</span>
                    <span>${result}</span>
                </h6>
                <p class="highest">
                    <span>Highest:</span>
                    <span>${highest}</span>
                </p>
                <p class="first">
                    <span>First:</span>
                    <span>${first}</span>
                </p>
                <div class="backToNotesButton" onclick="app.func.event.exitQuiz()">Back to Notes</div>
                <div class="nextModuleButton"><span>Next Module</span><span></span></div>
            </div>
        `;
        let quiz = document.querySelector('.quiz');
            quiz.insertAdjacentHTML('beforeend', html);
    }
    else{
        /* hide current questionCard, incr count, show next questionCard */
        app.setting.questionCards[app.setting.questionCount].classList.add('displayNone');
        app.setting.questionCount++;
        app.setting.questionCards[app.setting.questionCount].classList.remove('displayNone');
    };
};


app.func.event.startQuiz = async()=>{
    app.setting.questionCount  = 0;
    app.setting.score          = 0;
    app.func.give.body_scrollLockAttr();
    await app.func.createAppend.quiz();
    app.setting.questionCards  = document.querySelectorAll('.questionCard');
    app.setting.time           = Date.now();
};


/***
GIVE
****/
app.func.give.body_scrollFreeAttr = ()=>{
    let body = document.body;
        body.classList.remove('scrollLock');
};


app.func.give.body_scrollLockAttr = ()=>{
    let body = document.body;
        body.classList.add('scrollLock');
};


app.func.give.quizButton_listener = ()=>{
    let quizButtons = document.querySelectorAll('.quizButton');
    for(x of quizButtons){
        x.addEventListener('click', app.func.event.startQuiz);
    };
};


app.func.give.stars_fill = ()=>{
    let topStars    = document.querySelectorAll('.header .quizRow .star');
    let bottomStars = document.querySelectorAll('.footer .star');
    let obj         = window.localStorage.getItem('wsd2l');
        obj         = JSON.parse(obj);
    if( obj === null){
        obj = {};
    };
    let highest = obj.highest;
    if( highest !== undefined){
        let score = highest[0];
        for(let i = 0; i < score; i++){
            let topStar = topStars[i];
                topStar.classList.add('topStarOn');
            let bottomStar = bottomStars[i];
                bottomStar.classList.add('bottomStarOn');
        };
    };
};


app.func.give.window_scrollListener = ()=>{
    window.addEventListener('scroll', ()=>{
        let headerSection = document.querySelector('.header');
        let headerTitle   = document.querySelector('.header header h2');
        let headerText    = document.querySelector('.header header p');
        let headerQuizRow = document.querySelector('.header .quizRow');
        let quizButton    = document.querySelector('.header .quizButton');
        let functionTile  = document.querySelector('.function .tile');

        let bottomHeaderSection = headerSection.getBoundingClientRect().bottom;
        let topFunctionTile     = functionTile.getBoundingClientRect().top;

        if( topFunctionTile < 180){ // shrink point
            headerSection.classList.add('shrinkHeight');
            let delay_zindex = setTimeout(()=>{
                headerSection.classList.add('zindex');
            },300);
            headerSection.classList.remove('fullHeight');
            headerTitle.classList.add('shrink');
            headerText.classList.add('opacity_none');
            headerQuizRow.classList.add('opacity_none');
            quizButton.classList.add('visibilityHidden');
        }
        else
        if( topFunctionTile < bottomHeaderSection){ // overlap point
            headerSection.classList.add('fullHeight');
            headerSection.classList.remove('shrinkHeight');
            headerSection.classList.remove('zindex');
            headerTitle.classList.remove('shrink');
            headerText.classList.add('opacity_half');
            headerText.classList.remove('opacity_none');
            headerQuizRow.classList.add('opacity_half');
            headerQuizRow.classList.remove('opacity_none');
            quizButton.classList.remove('visibilityHidden');

        }
        else{ //  normal
            headerSection.classList.add('fullHeight');
            headerSection.classList.remove('shrinkHeight');
            headerSection.classList.remove('zindex');
            headerTitle.classList.remove('shrink');
            headerText.classList.remove('opacity_half', 'opacity_none');
            headerQuizRow.classList.remove('opacity_half', 'opacity_none');
            quizButton.classList.remove('visibilityHidden');
        }
    });
};


/*****
REMOVE
******/
app.func.remove.quiz = ()=>{
    app.func.give.body_scrollFreeAttr();
    app.func.give.stars_fill();
    let quiz = document.querySelector('.quiz');
        quiz.remove();
};


/***
SORT
****/
app.func.sort.shuffle = (arr)=>{
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    };
    return arr;
};


/*****
UPDATE
******/
app.func.update.results_inLocalStorage = (scorePacket)=>{
    let score = scorePacket[0];
    let time  = scorePacket[1];
    let obj   = window.localStorage.getItem('wsd2l');
        obj   = JSON.parse(obj);
    if( obj === null){
        obj = {};
    };
    let first   = obj.first;
    if( first == undefined){
        obj.first = [score, time];
    };
    let highest = obj.highest;
    if( highest == undefined
        || score > highest[0]){ // Case 1: highest undefined or score is exceeds highest => update with new score
            obj.highest = [score, time];
    }
    else
    if( score == highest[0]){ // Case 2: score equals highest, then check against time
        if( time < highest[1]){ // time best highest => update with new score
            obj.highest = [score, time];
        };
    };
    window.localStorage.setItem('wsd2l', JSON.stringify(obj));
    return obj;
};




/***
INIT
****/
app.func.init.component = ()=>{
    app.func.give.quizButton_listener();
    app.func.give.stars_fill();
    app.func.give.window_scrollListener();
};
/********
FIRE INIT
*********/
app.func.init.component();
