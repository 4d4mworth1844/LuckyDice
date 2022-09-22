"use strict"; 
console.log("%cWelcome to LuckyDice", "color: orange"); 

const gREQUEST_STATUS_OK = 200;
const gREQUEST_READY_STATUS_FINISH_AND_OK = 4;
const gEND_OF_ROW = -1; 

var gInpUsername = $("#inp-username"); 
var gInpFirstname = $("#inp-firstname");
var gInpLastname = $("#inp-lastname"); 
var gImgPresent = $("#present-img"); 

var gPGreeting = $("#p-greeting");

var gDiceVoucherId = $("#p-voucher-id"); 
var gDiceVoucherDiscount = $("#p-voucher-discount");

var gTableHeading = $("#table-heading"); 
var gTableBody = $("#table-body"); 

var gHistoryTable = $("#history-table");

var gXMLHttpRequest = new XMLHttpRequest(); 

var gSignedUser = {
    firstname: "", 
    lastname: "", 
    username: ""
};

const gUserList = []; 
const gBASE_URL = "http://42.115.221.44:8080/devcamp-lucky-dice/";
// Throw and get new dice
function onBtnThrowNewDice() {
    var vCheckedUsername = validateUsername(); 
    if(vCheckedUsername === false) {
        return; 
    }
    var vCheckedFirstname = validateFirstname(); 
    if(vCheckedFirstname === false) {
        return; 
    }
    var vCheckedLastname = validateLastname(); 
    if(vCheckedLastname === false) {
        return; 
    }

    
    const vUTF8_TEXT_APPLICATION_HEADER = "application/json;charset=UTF-8";
    // add new user data to object
    gSignedUser.firstname = vCheckedUsername; 
    gSignedUser.lastname = vCheckedLastname; 
    gSignedUser.username = vCheckedUsername; 

    var vJsonUser = JSON.stringify(gSignedUser); 
    gUserList.push(gSignedUser);
    gXMLHttpRequest.open("POST", gBASE_URL + "/dice", true);
    gXMLHttpRequest.setRequestHeader("Content-Type", vUTF8_TEXT_APPLICATION_HEADER);
    gXMLHttpRequest.send(vJsonUser);
    gXMLHttpRequest.onreadystatechange = function() {
        if(this.readyState === gREQUEST_READY_STATUS_FINISH_AND_OK && this.status === gREQUEST_STATUS_OK) {
            var vResponsedResult = this.responseText; 
            console.log(vResponsedResult); 
            var vResultObj = JSON.parse(vResponsedResult);
            console.log("%cChange: ", "color: blue"); 
            console.log(vResultObj); 
            var vDiceNumber = vResultObj.dice; 
            console.log(vDiceNumber); 
            if(vDiceNumber >= 4) {
                gPGreeting.html("Chúc mừng bạn hãy thử vận may tiếp nào!"); 
            }else{
                gPGreeting.html("Chúc bạn may mắn lần sau!"); 
            }
            //Change result img
            changeNumberImg(vDiceNumber);
            // show Voucher if there is
            var vVoucher = vResultObj.voucher; 
            if(vVoucher !== null ) {
                gDiceVoucherDiscount.html("Discount: " + vVoucher.phanTramGiamGia) ; 
                gDiceVoucherId.html("Code: " + vVoucher.maVoucher); 
            }
            // show present 
            var vPresent = vResultObj.prize; 
            changePresentImg(vPresent); 
        }
    }

}


function onBtnDiceHistory() {
    console.log("%cNút Dice History đã được ấn", "color: orange");
    var vCheckedUsername = validateUsername(); 
    if(vCheckedUsername === false) {
        return; 
    }
    var vCheckedFirstname = validateFirstname(); 
    if(vCheckedFirstname === false) {
        return; 
    }
    var vCheckedLastname = validateLastname(); 
    if(vCheckedLastname === false) {
        return; 
    }
    gHistoryTable.css("visibility", "visible");
    gTableHeading.append("<th>Lượt</th>\n<th>Dice</th>"); 
    // INSERT ROW FOR HEADING PART OF TABLE
    // var vRoundCell = document.createElement("th"); 
    // var vDiceCell = document.createElement("th"); 

    // var vRound = document.createTextNode("Lượt");
    // var vDice = document.createTextNode("Dice"); 

    // vRoundCell.appendChild(vRound);
    // vDiceCell.appendChild(vDice);  

    // gTableHeading.appendChild(vRoundCell); 
    // gTableHeading.appendChild(vDiceCell); 

    gXMLHttpRequest.open("GET", gBASE_URL + "/dice-history?username=" + vCheckedUsername, true);
    gXMLHttpRequest.send(); 
    gXMLHttpRequest.onreadystatechange = function() {
        if(this.readyState === gREQUEST_READY_STATUS_FINISH_AND_OK && this.status === gREQUEST_STATUS_OK) {
            var vDiceHistory = this.responseText; 
            //INSERT ROW FOR BODY PART OF TABLE
            var vDiceHistoryObj = JSON.parse(vDiceHistory); 
            var vDices = vDiceHistoryObj.dices; 
            for(var bRoundIdx = 0; bRoundIdx < vDices.length; bRoundIdx++) {
                var vBodyRow = gTableBody.append("<tr></tr>"); 
                
                var vRound = vBodyRow.insertCell(0); 
                var vDice = vBodyRow.insertCell(1); 

                vRound.innerHTML = bRoundIdx + 1; 
                vDice.innerHTML = vDices[bRoundIdx]; 
            }
        }
    }
}

function changePresentImg(paramPresent) {
    switch(paramPresent) {
        case null:
            gImgPresent.attr("src", "LuckyDiceImages/no-present.jpg"); 
            break; 
        case "Mũ":
            gImgPresent.attr("src","LuckyDiceImages/hat.jpg"); 
            break; 
        case "Xe máy":
            gImgPresent.attr("src","LuckyDiceImages/xe-may.jpg"); 
            break; 
        case "Áo":
            gImgPresent.attr("src", "LuckyDiceImages/t-shirt.jpg");
            break; 
        case "Ô tô":
            gImgPresent.attr("src", "LuckyDiceImages/car.jpg"); 
            break; 
        default:
            break;  
    }
}



function changeNumberImg(paramDiceNumber) {
    var vDiceImage = $("#dice-result");
    switch(paramDiceNumber) {
        case 1:
            vDiceImage.attr("src","LuckyDiceImages/1.png");
            break; 
        case 2:
            vDiceImage.attr("src","LuckyDiceImages/2.png"); 
            break;
        case 3:
            vDiceImage.attr("src","LuckyDiceImages/3.png"); 
            break; 
        case 4:
            vDiceImage.attr("src","LuckyDiceImages/4.png"); 
            break;
        case 5:
            vDiceImage.attr("src","LuckyDiceImages/5.png"); 
            break; 
        case 6:
            vDiceImage.attr("src","LuckyDiceImages/6.png");
        default:
            break;  
    }
}

//Validate user's input
function validateUsername() {
    var vInpUsername = gInpFirstname.val(); 
    if(vInpUsername.trim() === "") {
        alert("Must enter username"); 
        return false; 
    }
    return vInpUsername.trim(); 
} 

function validateFirstname() {
    var vInpFirstname = gInpFirstname.val(); 
    if(vInpFirstname.trim() === "") {
        alert("Must enter firstname"); 
        return false; 
    }
    return vInpFirstname.trim(); 
}

function validateLastname() {
    var vInpLastname = gInpLastname.val(); 
    if(vInpLastname.trim() === "") {
        alert("Must enter lastname"); 
        return false; 
    }
    return vInpLastname.trim(); 
}