// Fluent Glass Calculator Controller

document.addEventListener("DOMContentLoaded", () => {
    // 1. Calculator State Variables
    let currentInput = "0";
    let previousInput = "";
    let activeOperator = null;
    let formulaBuffer = "";
    let isResultDisplay = false; // Flag to check if screen displays calculation outcome
    let historyList = JSON.parse(localStorage.getItem("calc_history")) || [];

    // 2. DOM Elements
    const resultDisplay = document.getElementById("result-display");
    const formulaDisplay = document.getElementById("formula-display");
    const historyDrawer = document.getElementById("history-drawer");
    const historyContainer = document.getElementById("history-list");
    
    // Toggle buttons
    const btnHistoryToggle = document.getElementById("btn-history-toggle");
    const btnHistoryClose = document.getElementById("btn-history-close");
    const btnClearHistory = document.getElementById("btn-clear-history");

    // Keyboard hints toggle logic (Hide hint box on click)
    const keyboardHints = document.getElementById("keyboard-hints");
    document.addEventListener("click", (e) => {
        if (!keyboardHints.contains(e.target) && e.target !== resultDisplay && e.target.tagName !== "BUTTON") {
            keyboardHints.style.transform = "translateY(150px)";
        } else {
            keyboardHints.style.transform = "translateY(0)";
        }
    });

    // 3. Helper Functions
    function getOperatorSymbol(op) {
        switch(op) {
            case "add": return "+";
            case "subtract": return "−";
            case "multiply": return "×";
            case "divide": return "÷";
            default: return "";
        }
    }

    // Resolves JS floating-point accuracy errors (e.g., 0.1 + 0.2)
    function stripFloat(num) {
        return parseFloat(parseFloat(num).toPrecision(12));
    }

    function formatNumberString(str) {
        if (str === "Cannot divide by zero" || str === "Error" || str === "NaN") {
            return str;
        }
        
        const parts = str.split(".");
        let integerPart = parts[0];
        const decimalPart = parts[1] !== undefined ? "." + parts[1] : "";
        
        // Add thousands separator to integer part
        integerPart = parseFloat(integerPart).toLocaleString('en-US', { maximumFractionDigits: 0 });
        if (isNaN(parseFloat(parts[0]))) {
            return str; // return unformatted fallback
        }
        return integerPart + decimalPart;
    }

    function updateDisplay() {
        // Adjust display font size depending on length
        const rawLength = currentInput.length;
        if (rawLength > 16) {
            resultDisplay.style.fontSize = "1.35rem";
        } else if (rawLength > 10) {
            resultDisplay.style.fontSize = "1.85rem";
        } else {
            resultDisplay.style.fontSize = "2.5rem";
        }

        // Output formatting
        if (currentInput === "Cannot divide by zero" || currentInput === "Error") {
            resultDisplay.innerText = currentInput;
        } else {
            resultDisplay.innerText = formatNumberString(currentInput);
        }
        
        formulaDisplay.innerText = formulaBuffer;

        // Manage active operator highlight class
        document.querySelectorAll(".btn-operator").forEach(btn => {
            btn.classList.remove("active-operator");
            if (activeOperator && btn.getAttribute("data-value") === activeOperator) {
                btn.classList.add("active-operator");
            }
        });
    }

    // 4. Core Calculator Actions
    function appendNumber(num) {
        // Check if displaying a final result, reset input
        if (isResultDisplay) {
            currentInput = num === "." ? "0." : num;
            isResultDisplay = false;
        } else {
            if (num === ".") {
                if (currentInput.includes(".")) return;
                currentInput += ".";
            } else {
                if (currentInput === "0") {
                    currentInput = num;
                } else {
                    // Limit digits to prevent overflow
                    if (currentInput.replace(".", "").length >= 16) return;
                    currentInput += num;
                }
            }
        }
        updateDisplay();
    }

    function selectOperator(op) {
        if (currentInput === "Cannot divide by zero" || currentInput === "Error") return;

        const val = parseFloat(currentInput);

        // If operator selected and user types another, calculate the intermediate stage
        if (activeOperator && !isResultDisplay) {
            calculateResult();
        }

        previousInput = currentInput;
        activeOperator = op;
        formulaBuffer = `${formatNumberString(previousInput)} ${getOperatorSymbol(op)}`;
        isResultDisplay = true;
        updateDisplay();
    }

    function calculateResult() {
        if (!activeOperator || isResultDisplay) return;

        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        let result = 0;
        switch(activeOperator) {
            case "add":
                result = prev + current;
                break;
            case "subtract":
                result = prev - current;
                break;
            case "multiply":
                result = prev * current;
                break;
            case "divide":
                if (current === 0) {
                    currentInput = "Cannot divide by zero";
                    formulaBuffer = `${formatNumberString(previousInput)} ÷ 0 =`;
                    activeOperator = null;
                    isResultDisplay = true;
                    updateDisplay();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Save complete formula
        const cleanResult = stripFloat(result).toString();
        const formulaText = `${formatNumberString(previousInput)} ${getOperatorSymbol(activeOperator)} ${formatNumberString(currentInput)}`;
        formulaBuffer = `${formulaText} =`;
        
        // Log entry to History
        addHistoryEntry(formulaText, cleanResult);
        
        currentInput = cleanResult;
        activeOperator = null;
        isResultDisplay = true;
        updateDisplay();
    }

    function backspace() {
        if (isResultDisplay) {
            formulaBuffer = "";
            updateDisplay();
            return;
        }
        
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
            if (currentInput === "-" || currentInput === "-0") currentInput = "0";
        } else {
            currentInput = "0";
        }
        updateDisplay();
    }

    function clearAll() {
        currentInput = "0";
        previousInput = "";
        activeOperator = null;
        formulaBuffer = "";
        isResultDisplay = false;
        updateDisplay();
    }

    function squareNumber() {
        const val = parseFloat(currentInput);
        if (isNaN(val)) return;
        const result = stripFloat(val * val);
        formulaBuffer = `sqr(${formatNumberString(currentInput)})`;
        currentInput = result.toString();
        isResultDisplay = true;
        updateDisplay();
    }

    function sqrtNumber() {
        const val = parseFloat(currentInput);
        if (isNaN(val)) return;
        if (val < 0) {
            currentInput = "Error";
            formulaBuffer = `sqrt(${formatNumberString(currentInput)})`;
        } else {
            const result = stripFloat(Math.sqrt(val));
            formulaBuffer = `sqrt(${formatNumberString(currentInput)})`;
            currentInput = result.toString();
        }
        isResultDisplay = true;
        updateDisplay();
    }

    function percentNumber() {
        const val = parseFloat(currentInput);
        if (isNaN(val)) return;
        const result = stripFloat(val / 100);
        currentInput = result.toString();
        isResultDisplay = true;
        updateDisplay();
    }

    function toggleSign() {
        const val = parseFloat(currentInput);
        if (isNaN(val) || val === 0) return;
        currentInput = (val * -1).toString();
        updateDisplay();
    }

    // 5. Drawer History Actions
    function addHistoryEntry(formula, result) {
        historyList.unshift({ formula, result });
        // Cap history at 30 items
        if (historyList.length > 30) historyList.pop();
        localStorage.setItem("calc_history", JSON.stringify(historyList));
        renderHistory();
    }

    function renderHistory() {
        historyContainer.innerHTML = "";
        
        if (historyList.length === 0) {
            historyContainer.innerHTML = `<div class="history-empty">No history yet</div>`;
            return;
        }

        historyList.forEach((entry, idx) => {
            const div = document.createElement("div");
            div.className = "history-item";
            div.innerHTML = `
                <div class="history-item-formula">${entry.formula}</div>
                <div class="history-item-result">${formatNumberString(entry.result)}</div>
            `;
            
            // Re-load calculation when clicked
            div.addEventListener("click", () => {
                currentInput = entry.result;
                formulaBuffer = entry.formula + " =";
                isResultDisplay = true;
                activeOperator = null;
                updateDisplay();
                closeHistory();
            });
            
            historyContainer.appendChild(div);
        });
    }

    function openHistory() {
        historyDrawer.classList.add("open");
    }

    function closeHistory() {
        historyDrawer.classList.remove("open");
    }

    function clearHistory() {
        historyList = [];
        localStorage.removeItem("calc_history");
        renderHistory();
    }

    // Bind History Events
    btnHistoryToggle.addEventListener("click", openHistory);
    btnHistoryClose.addEventListener("click", closeHistory);
    btnClearHistory.addEventListener("click", clearHistory);

    // 6. Grid Click Listener Setup
    document.querySelectorAll(".calc-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const val = btn.getAttribute("data-value");
            
            if (btn.classList.contains("btn-num")) {
                if (val === "decimal") appendNumber(".");
                else appendNumber(val);
            } else if (btn.classList.contains("btn-operator")) {
                selectOperator(val);
            } else {
                switch(val) {
                    case "clear":
                        clearAll();
                        break;
                    case "sign":
                        toggleSign();
                        break;
                    case "percent":
                        percentNumber();
                        break;
                    case "backspace":
                        backspace();
                        break;
                    case "square":
                        squareNumber();
                        break;
                    case "sqrt":
                        sqrtNumber();
                        break;
                    case "equals":
                        calculateResult();
                        break;
                }
            }
        });
    });

    // 7. Full Keyboard Listener Setup
    const keyMap = {
        "0": "key-0", "1": "key-1", "2": "key-2", "3": "key-3", "4": "key-4",
        "5": "key-5", "6": "key-6", "7": "key-7", "8": "key-8", "9": "key-9",
        ".": "key-decimal", ",": "key-decimal",
        "+": "key-add", "-": "key-subtract", "*": "key-multiply", "/": "key-divide",
        "Enter": "key-equals", "=": "key-equals",
        "Backspace": "key-backspace",
        "Escape": "key-clear", "Delete": "key-clear",
        "%": "key-percent",
        "s": "key-sign", "S": "key-sign"
    };

    window.addEventListener("keydown", (e) => {
        const btnId = keyMap[e.key];
        if (btnId) {
            e.preventDefault();
            const btn = document.getElementById(btnId);
            
            // Visual keypress animation trigger
            btn.classList.add("key-pressed");
            setTimeout(() => btn.classList.remove("key-pressed"), 100);
            
            // Trigger programmatic click
            btn.click();
        }
    });

    // Startup Init
    updateDisplay();
    renderHistory();
});
