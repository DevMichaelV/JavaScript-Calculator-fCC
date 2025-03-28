import React, { useState, useEffect } from "https://esm.sh/react";
import { createRoot } from 'https://esm.sh/react-dom/client';


const domNode = document.getElementById("root")
const root = createRoot(domNode)

const App = () => {
  const opsArr = ["+", "-", "*", "/"];
  const negOps = ["+-", "*-", "/-"];
  const numsArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const [answer, setAnswer] = useState("");
  const [expression, setExpression] = useState("");
  const [prevVal, setPrevVal] = useState("");
  const [val, setVal] = useState("");
  const [cChar, setCChar] = useState("");
  const [isCalced, setIsCalced] = useState(0);
   
  const endsWithOp = (str) => {
    if(opsArr.includes(str[str.length-1])) {
      return true;
    }
    return false;
  }
  
  const endsWithMinus = (str) => {
    if(str[str.length-1] === "-") {
      return true;
    }
    return false;
  }
  
  const clickHandler = (e) => {
    let uChar;
    if(e.target.value) {uChar = e.target.value;}
    else if(e.key) {uChar = e.key;}
    
    // Checking if user entered a number [0-9]
    if(numsArr.includes(uChar)) {
      // Check if answer is previously set
      if(isCalced) {
        setAnswer("");
        setIsCalced(0);
        setCChar(uChar);
        setVal(uChar);
        setExpression(uChar);
      } else {
        // Check for leading zeroes, as number can only begin with up to one 0
        if(uChar === "0" && val.length < 2 && val[0] === "0") {
          return;
        // Otherwise, append the number
        } else {
          setVal(val + uChar);
          setCChar(val + uChar);
          setExpression(expression + uChar);
        }
      }
    }
    
    // Checking if user input an operator [+-*/]
    else if(opsArr.includes(uChar)) {
      setCChar(uChar);
      setPrevVal(val);
      setVal("");
      
      if(isCalced) {
        setIsCalced(0);
        setExpression(answer + uChar);
      
      // If expr ends with operator
      } else if(endsWithOp(expression)) {
        
        // Check to see if we're about to create a double minus
        if(expression[expression.length-1] + uChar === "--") {
          setExpression(expression.slice(0, expression.length-1) + "+");
          setCChar("+");
          
        // Look for [+-, /-, *-] and replace with new operator if found
        } else if(negOps.includes(expression.slice(expression.length-2, expression.length))) {
          console.log("Expr ends with a negOp", expression.substring[expression.length-2, expression.length])
          setExpression(expression.slice(0, expression.length-2) + uChar);
        
        // If user input -, let me make negOp
        } else if(uChar === "-") {
          setExpression(expression + uChar);
        // Otherwise, replace the previous operator
        } else {
          setExpression(expression.slice(0, expression.length-1) + uChar);
        }
      
      // Expr does not end with an operator
      } else {
        setExpression(expression + uChar);
      }
      setAnswer("");
    }
    
    // Checking if user input a decimal [.]
    else if(uChar === ".") {
      if(isCalced) {
        setIsCalced(0);
        setVal("0.");
        setCChar("0.");
        setExpression("0.");
        setAnswer("");
      } else if(val.search(/\./g) === -1) {
        if(val.length === 0) {
          setVal("0.");
          setCChar("0.");
          setExpression(expression + "0.");
        } else {
          setVal(val + ".");
          setCChar(val + uChar);
          setExpression(expression + ".");
        }
      }
    }
    
    // Checking if user wants to calculate
    else if(uChar === "=" || uChar === "Enter") {
      console.log("Evaluating:", expression);
      setIsCalced(1);
      setAnswer(eval(expression));
      setVal("");
      setPrevVal("");
      setCChar("");
    }
    
    // Checking if user wants to clear values
    else if(uChar === "ac" || uChar === "Escape") {
      setIsCalced(0);
      setVal("");
      setPrevVal("");
      setCChar("");
      setExpression("");
      setAnswer("");
    }
    
    else return false;
  }; // End clickHandler

  useEffect(() => {
    document.addEventListener("keydown", clickHandler);
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("keydown", clickHandler);
      document.removeEventListener("click", clickHandler);
    }
  });
  
  // Return the app JSX
  { return (
    <div id="calculator">
      <div id="info-wrap">
        <div>Current Char: {cChar}</div>
        <div>Current Value: {val}</div>
        <div>Previous Value: {prevVal}</div>
        <div>Expression: {expression}</div>
        <div>Answer: {answer}</div>
        <div>isCalced: {isCalced}</div>
      </div>
      <div class="display-wrap">
        <div id="formula">{expression + (answer?"="+answer:"")}</div>
        <div id="display">{answer? answer: cChar? cChar: "0"}</div>
      </div>
      <div class="button-wrap">
        <table>
          <tr>
            <td><button id="clear" value="ac" className="redbtn">AC</button></td>
          {/*  <td><button id="expo" value="^">^</button></td>
            <td><button id="lpar" value="(">(</button></td>
            <td><button id="rpar" value=")">)</button></td>
          </tr>
          <tr>
            <td><button id="perc" value="%">%</button></td> */}
            <td><button id="divide" value="/" className="reg-op">/</button></td>
            <td><button id="multiply" value="*" className="reg-op">*</button></td>
            <td><button id="subtract" value="-" className="reg-op">-</button></td>
          </tr>
          <tr>
            <td><button id="seven" value="7" className="num">7</button></td>
            <td><button id="eight" value="8" className="num">8</button></td>
            <td><button id="nine" value="9" className="num">9</button></td>
            <td rowSpan="2"><button id="add" value="+" className="reg-op bluebtn">+</button></td>
          </tr>
          <tr>
            <td><button id="four" value="4" className="num">4</button></td>
            <td><button id="five" value="5" className="num">5</button></td>
            <td><button id="six" value="6" className="num">6</button></td>
          </tr>
          <tr>
            <td><button id="one" value="1" className="num">1</button></td>
            <td><button id="two" value="2" className="num">2</button></td>
            <td><button id="three" value="3" className="num">3</button></td>
            <td rowSpan="2"><button id="equals" value="=" className="reg-op greenbtn">=</button></td>
          </tr>
          <tr>
            <td colSpan="2"><button id="zero" className="num" value="0">0</button></td>
            <td><button id="decimal" className="num" value=".">.</button></td>
          </tr>
        </table>
      </div>
    </div>
  ); }
}

root.render(<App />);
