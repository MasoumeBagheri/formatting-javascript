

function formatting() {
//***********************************Tokenize*********************************************************
    const input = document.getElementById("inputTextarea").value;
    let keyWords = ['if', 'let', 'function', 'return', 'false', 'null'];
    let attributeInHtml = ['className', 'title'];
    let eventInHtml = ['onMouseOver'];
    let operator = ['===', '==', '=', '*', '+'];
    //let comment = ['/', '*'];
    let current = 0;
    let tokens = [];
    console.log(input);
    function tokenizer(input) {
        //Remove the extra semicolon
        input = input.replace(/;+/g, ';');
        let regexpLineBreak = /\n/g;
        let linebreak = input.match(regexpLineBreak);
        while (current < input.length) {
            let char = input[current];
    
            //tokenize openbraces
            if (char === '{') {
                tokens.push({
                    type: 'openbraces',
                    value: '{',
                });
                current++;
                continue;
            }
    
            //tokenize closedbraces
            if (char === '}') {
                tokens.push({
                    type: 'closedbraces',
                    value: '}',
                });
                current++;
                continue;
            }
            //tokenize open parenthesis
            if (char === '(') {
                tokens.push({
                    type: 'openparen',
                    value: '(',
                });
                current++;
                continue;
            }
            //tokenize close parenthesis
            if (char === ')') {
                tokens.push({
                    type: 'closedparen',
                    value: ')',
                });
                current++;
                continue;
            }
            //tokenize words
            let letters = /[a-z]/i;
            let dot = /\./;
            if (letters.test(char) || dot.test(char)) {
                let value = '';
                while (letters.test(char)) {
                    value += char;
                    char = input[++current];
                }
                if (input[current] === '.') {
                    while (char !== '(' && char != " ") {
                        value += char;
                        char = input[++current];
                    }
                    tokens.push({
                        type: 'method',
                        value
                    });
                } else {
                    tokens.push({
                        type: 'name',
                        value
                    });
                }
    
                continue;
            }
            //tokenize numbers
            let numbers = /[0-9]/;
            if (numbers.test(char)) {
                let value = '';
                while (numbers.test(char)) {
                    value += char;
                    char = input[++current];
                }
                tokens.push({
                    type: 'number',
                    value
                });
                continue;
            }
    
            //tokenize string and double or single quotation value 
            if (char === '"') {
                tokens.push({
                    type: 'doublequotation',
                    value: '"',
                });
                let value = '';
                char = input[++current];
                while (char !== '"') {
                    value += char;
                    char = input[++current];
                }
                char = input[++current];
                tokens.push({
                    type: 'string',
                    value
                });
                tokens.push({
                    type: 'doublequotation',
                    value: '"',
                });
                continue;
            }
            //tokenize string value
            if (char === "'") {
                tokens.push({
                    type: 'singleQuotation',
                    value: "'",
                });
                let value = '';
                char = input[++current];
                while (char !== "'") {
                    value += char;
                    char = input[++current];
                }
                char = input[++current];
                tokens.push({
                    type: 'string',
                    value
                });
                tokens.push({
                    type: 'singleQuotation',
                    value: "'",
                });
                continue;
            }
    
            //tokenize operator
            let opr = 0
            while (opr < operator.length) {
    
                if (char === operator[opr]) {
                    let value = '';
                    while (char === operator[opr]) {
                        value += char;
                        char = input[++current];
                    }
                    tokens.push({
                        type: 'operator',
                        value
                    });
                    --current;
                }
                opr++;
                continue;
            }
            //tokenize semicolon
            if (char === ';') {
                tokens.push({
                    type: 'semicolon',
                    value: ';',
                });
                current++;
                continue;
            }
    
            //tokenize Comma
            if (char === ',') {
                tokens.push({
                    type: 'comma',
                    value: ',',
                });
                current++;
                continue;
            }
    
            //tokenize exclamation mark
            if (char === '!') {
                tokens.push({
                    type: 'exclamationMark',
                    value: '!',
                });
                current++;
                continue;
            }
            //tokenize whitspace
            let whitspace = /\s/;
            if (whitspace.test(char)) {
                current++;
                continue;
            }
    
            //tokenize oneLineComment and regxp
            let r = '\\';
            if (char === '/') {
                char = input[current]
                if (input[++current] === '/') {
                    let value = char;
                    while (char !== linebreak[0]) {
                        value += char;
                        char = input[++current];
                    }
                    tokens.push({
                        type: 'oneLineComment',
                        value
                    });
                }
                else if (input[current] === r) {
                    let value = '';
                    while (char !== ',') {
                        value += char;
                        char = input[current++];
                    }
                    tokens.push({
                        type: 'regexp',
                        value
                    });
                    --current;
                }
                continue;
            }
            //tokenize multiLineComment
            if (char === '/' && input[current] === '*') {
                let value = char + input[current];
                //خط زیر به خاطر اینکه 
                //value=/* و char = '/'
                // value += char;  و در  کد 
                //value=/*/ میشود 
                //آخر اضافی است بنابراین خط زیر را می نویسیم slash که 
                char = '';
                while (char !== '*' && input[current] !== '/') {
                    value += char;
                    char = input[++current];
                }
                value += '*/';
                tokens.push({
                    type: 'multiLineComment',
                    value
                });
    
                continue;
            }
            //tokenize tag
            if (char === '<') {
                let value = '';
                if (input[++current] !== '/') {
                    current--;
                    while (char !== ' ' && char !== '>') {
                        value += char;
                        char = input[++current];
                    }
                    if (char === '>') {
                        value += char;
                    }
                    tokens.push({
                        type: 'opentag',
                        value
                    });
                    current++;
                    continue;
                }
                else {
                    current--;
                    while (char !== '>') {
                        value += char;
                        char = input[++current];
                    }
                    value += char;
                    tokens.push({
                        type: 'closedtag',
                        value
                    });
                    current++;
                    continue;
    
                }
            }
            if (char === '>') {
                tokens.push({
                    type: 'closedtagmarktag',
                    value: '>'
                });
                current++;
                continue;
            }
            let backtick = "`"
            if (char === backtick) {
                let value = char;
                char = input[++current];
                while (char !== backtick) {
                    value += char;
                    char = input[++current];
                }
                value += char;
                tokens.push({
                    type: 'sentence',
                    value
                });
            }
            //tokenize colon
            if (char === ':') {
                tokens.push({
                    type: 'colon',
                    value: ':',
                });
                current++;
                continue;
            }
            //tokenize questionmark
            if (char === '?') {
                tokens.push({
                    type: 'questionmark',
                    value: '?',
                });
                current++;
                continue;
            }
            current++;
        }
        return tokens;
    
    }
    
    let token = tokenizer(input);
//****************************************************************************************************************************** 

    let value = '';
    let spaceCount = 0;
    let space = '  ';//Two Space
    let isAttributeInHtml;
    let isEventInHtml;
    let isReturn = 0;
    for (let i = 0; i < token.length; i++) {
        let len = token.length
        let index = i;
        let indexTwo = i;
        let indexThree = i;
        let indexFour = i;
        let indexFive = i;
        isAttributeInHtml = 0;
        isEventInHtml = 0;

        //Before adding the next token item to value  to linebreak before comment
        if ((token[i].type === 'oneLineComment' || token[i].type === "multiLineComment")) {
            value += '\n' + space.repeat(distance);
        }
        for (let z = 0; z < attributeInHtml.length; z++) {
            //Before adding the next token item to value  to linebreak before attributeInHtml
            if (token[i].value === attributeInHtml[z]) {
                index = i;
                if (token[--index].type !== "opentag") {
                    value += '\n' + space.repeat(distance);
                }
                isAttributeInHtml = 1;
            }
        }
        value += token[i].value;
        if (token[i].type === "openbraces") {
            spaceCount += 1;
            if (++index !== len) {
                index = i;
                //The open and closed braces come together without linebreak and space
                //or
                //There was a sentence after openbraces without linebreak and space
                //There was a opentag and closedtag befor openbraces without linebreak and space
                //Otherwise linebreak after openbracess
                if (token[++index].value !== "}" && token[++indexTwo].type !== "sentence" && token[++indexThree].type !== "method"
                    && token[--indexFour].type !== "opentag" && token[--indexFive].type !== "closedtag"
                    ) {
                    value += '\n';
                }
                index = i;
                indexTwo = i;
                indexThree = i;
                if (token[++index].type === "method" || token[--indexTwo].type === "opentag" || token[--indexTwo].type === "closedtag") {
                //    debugger;
                    let count = 1;
                    while (count !== 0) {
                        i++
                        value += token[i].value;
                        if (token[i].value === "{") {
                            count += 1
                        }
                        else if (token[i].value === "}" ) {
                            count -= 1
                        }
                    }
                    i--;
                    value = value.slice(0, -1);
                }
            }
            //If the previous item in the token array was closedbraces, delete last character value that equals semicolon
        } else if (token[i].value === ";") {
            if (token[--index].value === "}") {
                value = value.slice(0, -1);
                index = i;
            }
            else {
                value += '\n';
            }
        } else if (token[i].type === "closedbraces") {
            spaceCount -= 1;
            value += '\n';
        } else if (token[i].type === "closedparen") {
            //If the next item in the token array was not semicolon, we have space
            if (++index !== len) {
                index = i;
                if (token[++index].value !== ";") {
                    value += ' ';
                }
            }
        } else if (token[i].value === ",") {
            //After the comma
            // If the next item in the token array was not closedbraces we would linebreak
            if (++index !== len) {
                index = i;
                if (token[++index].value !== "}") {
                    value += '\n';
                    //We should not have comma before closedbraces  
                } else {
                    value = value.slice(0, -1) + '\n';
                }
            }
            //After token name or number
            //If the next item in the token array was colsebrace after the name or number, we would have semicolon + linebreak
            /*example:
            if(!greeting){return null};
            if(!greeting){return 1}; */
        } else if (token[i].type === "name" || token[i].type === "number") {
            if (++index !== len) {
                index = i;
                if (token[++index].value === "}") {
                    value += ';' + '\n';
                }

            }
            
        } else if (token[i].type === "oneLineComment") {
            if (++index !== len) {
                index = i;
                indexTwo = i;
                //because no extra linebreaks
                if (token[++index].type !== "oneLineComment" && token[++indexTwo].type !== "multiLineComment") {
                    value += '\n\n';
                } else {
                    value += '\n';
                }
            }
        } else if (token[i].type === "multiLineComment") {
            if (++index !== len) {
                index = i;
                indexTwo = i;
                //because no extra linebreaks
                if (token[++index].type !== "oneLineComment" && token[++indexTwo].type !== "multiLineComment") {
                    value += '\n\n';
                } else {
                    value += '\n';
                }
            }
        }
        //To put nested methods in a line
        else if (token[i].type === "method") {
            countOpenParen = 0;
            if (++index !== len) {
                countOpenParen = 1
                value += token[index].value;
                i++;
                while (countOpenParen !== 0) {
                    index = i;
                    if (++index !== len) {
                        index = i
                        if (token[++index].value === "(") {
                            countOpenParen += 1;
                        }
                    }
                    index = i;
                    if (++index !== len) {
                        index = i
                        if (token[++index].value === ")") {
                            countOpenParen -= 1;
                        }
                        index = i;
                    }
                    if (++i !== len) {
                        value += token[i].value;
                    }
                }
                indexTwo = i;
                //example
                /* .toString()
                   .replace(/\.\d+/ig,""); */
                if (token[++indexTwo].type !== "method") {
                    value += ';' + '\n\n';
                }
                else {
                    value += '\n' + space.repeat(distance + 1);
                }

            }
        }
        else if (token[i].type === "closedtag") {
            spaceCount -= 1;
            if (++index !== len) {
                index = i
                //example
                /* </div>
                   ); */
                if (token[++index].value === ";" && isReturn === 1) {
                    value += '\n' + space.repeat(--distance) + ')';
                    spaceCount -= 1;
                }
                else {
                    value += '\n';
                }
            }
        }
        else if (token[i].type === 'closedtagmarktag') {
            if (++index !== len) {
                index = i
                //example
                /* ></div> */
                if (token[++index].type !== "closedtag") {
                    value += '\n';
                }
            }
        }
        else if (token[i].type === 'opentag') {
            spaceCount += 1;
            value += '\n';
        }

        for (let j = 0; j < keyWords.length; j++) {
            if (token[i].value === keyWords[j]) {
                // If the next item in the token array was not camma we would space --->example:false in example
                // If the next item in the token array was not closedbraces we would space --->example:null in example--->if(!greeting){return null};
                // If the next item in the token array was not semicolon we would space --->example:null in example--->if(!greeting){return null;}
                if (++index !== len) {
                    index = i;
                    indexTwo = i;
                    indexThree = i;
                    indexFour = i
                    if (token[++index].value !== ',' && token[++indexTwo].value !== '}' && token[++indexThree].value !== ';' && keyWords[j] !== 'return') {
                        value += ' ';
                    }
                    else if (keyWords[j] === 'return') {
                        if (token[++indexFour].type === 'name') {
                            value += ' ';
                        }
                        else {
                            isReturn = 1;
                            value += ' ' + '(' + '\n';
                            spaceCount += 1;
                        }
                    }
                }
                index = i;
            }
        }
        for (let x = 0; x < operator.length; x++) {
            //There is a space after each of the operator array items
            if (token[i].value === operator[x]) {
                value += ' ';
            }
            //There is a space before each of the operator array items and token array was not eventInHtml
            for (let r = 0; r < eventInHtml.length; r++) {
                index = i;
                if (++index !== len) {
                    index = i;
                    if (token[++index].value === operator[x] && token[i].value != eventInHtml[r]) {
                        value += ' ';
                    }
                }
            }
        }
        for (let y = 0; y < eventInHtml.length; y++) {
            //example:
            // onMouseOver={onMouseOver}
            if (token[i].value === eventInHtml[y]) {
                index = i;
                if (++index !== len) {
                    index = i;
                    if (token[++index].value === "=") {
                        while (token[i].value !== "}") {
                            if (i++ !== len) {
                                value += token[i].value;
                            }
                        }
                        value += '\n';
                    }
                }
            }
        }
        //indent
        //In the next line we have to specify the value of the code indent
        if (value.slice(-1) === '\n') {
            distance = spaceCount;
            index = i;
            indexTwo = i;
            indexThree = i;
            if (++index !== len) {
                index = i;
                //If the next item in the token array was closebrase, we would have a lower indent
                //example for (token[++indexTwo].value === ";")
                /* function HelloWorld() {   
                if(!greeting){return null};}  */
                //ما در اینجا میگیم اگر آیتم بعدی آکولاد بسته بود یک فاصله کمتر بذار ولی در این مثال بعد از آکولاد بسته سمیکولون داریم 
                //که در کد حذفش میکنیم و بعد آکولاد بسته داریم و در اینجا چون آیتم بعدی ما سمیکولون هست نه آکولاد بسته از کد
                // آخر else
                //رد میشه در حالی که ما میخوایم از کد بالایی رد شود و یک فاصله کمتر باشد بنابرین خط زیر رو به کد اضافه می کنیم
                // token[++indexTwo].value === ";"
                //برای تگ بسته indexThree-indexFour 

                if (token[++index].value === "}" || token[++indexTwo].value === ";" || token[++indexThree].value === ">" || token[++indexFour].type === "closedtag") {
                    try {
                        value += space.repeat(--distance);
                    } catch (err) {

                        alert('The number of open and closed tags or open and closed braces is not equal');
                        return;
                    }
                    index = i;
                }
                else {
                    value += space.repeat(distance);
                }
            }
            if (i === len - 1 && distance !== 0) {
                alert('The number of open and closed tags or open and closed braces is not equal');
                return;
            }
        }

    }
   
    document.getElementById("outputTextarea").value = value;

}


