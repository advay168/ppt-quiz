var main_table = document.querySelector("#mainTable");

var Q_rows = [];
var O_rows = [];
var Questions = [];
var Answers = []
var Options = [];

function add_row() {
    var row = document.createElement("tr");
    row.className = "Question-row";
    Q_rows.push(row);

    var Question_cell = row.insertCell(-1);
    var q_textarea = document.createElement("textarea");
    q_textarea.className = "Question";
    Questions.push(q_textarea);
    Question_cell.appendChild(q_textarea);

    var Answer_cell = row.insertCell(-1);
    var a_input = document.createElement("input");
    a_input.className = "Answer";
    Answers.push(a_input);
    Answer_cell.appendChild(a_input);

    var Options_cell = row.insertCell(-1);
    O_rows.push(Options_cell);
    var o_input = document.createElement("input");
    o_input.className = "Options";
    Options.push([o_input]);
    Options_cell.appendChild(o_input);

    main_table.appendChild(row);
}

function remove_row(index) {
    var Q = [];
    var A = [];
    var O = [];
    var Q_r = [];
    var O_r = [];
    for (let i = 0; i < Questions.length; i++) {
        if (i != index) {
            Q.push(Questions[i]);
            A.push(Answers[i]);
            O.push(Options[i]);
            Q_r.push(Q_rows[i]);
            O_r.push(O_rows[i]);
        }
    }
    main_table.removeChild(Q_rows[index]);
    Questions = Q;
    Answers = A;
    Options = O;
    Q_rows = Q_r;
    O_rows = O_r;
}

function remove_option(Optionarrayindex, index) {
    Optionarray = Options[Optionarrayindex];
    var o = [];
    for (let i = 0; i < Optionarray.length; i++) {
        if (i != index) {
            o.push(Optionarray[i]);
        }
    }
    O_rows[Optionarrayindex].removeChild(Optionarray[index]);
    Options[Optionarrayindex] = o;
}

function onkeyup(e) {
    for (let i = 0; i < Options.length; i++) {
        var Option = Options[i];
        if (Option[Option.length - 1].value) {
            var option = document.createElement("input");
            option.className = "Options";
            Option.push(option);
            O_rows[i].appendChild(option);
        } else {
            for (let j = 0; j < Option.length - 1; j++) {
                if (!(Option[j].value)) {
                    remove_option(i, j);
                    break;
                }
            }
        }
    }
    if (Questions[Questions.length - 1].value || Answers[Answers.length - 1].value || (Options[Options.length - 1][Options[Options.length - 1].length - 2] || Options[Options.length - 1][Options[Options.length - 1].length - 1]).value) {
        add_row();
    } else {
        for (let i = 0; i < Questions.length - 1; i++) {
            if (!(Questions[i].value || Answers[i].value || Options[i][0].value)) {
                remove_row(i);
                break;
            }
        }
    }
}

function generate() {
    var Questions_and_answers = [];
    for (let i = 0; i < Questions.length - 1; i++) {
        var question = Questions[i].value;
        var answer = Answers[i].value;
        var options = [];
        for (const option of(Options[i]).slice(0, Options[i].length - 1)) {
            options.push(option.value);
        }
        Questions_and_answers.push({
            Question: question,
            Answer: answer,
            Options: options
        });
    }
    console.log(Questions_and_answers);
    var request = new XMLHttpRequest();

    request.onload = function() {
        console.log(request.responseText);
        document.getElementById("response").innerHTML = request.responseText;
    }

    request.open("POST", "/generate");
    request.setRequestHeader('content-type', 'application/json');
    request.send(JSON.stringify(Questions_and_answers));
}

add_row();

main_table.addEventListener("keyup", onkeyup);

document.addEventListener("load", e => add_row())