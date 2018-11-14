//Budget controller
var budgetController = (function(){
  var Expense = function(id, description,value){
      this.id = id;
      this.description = description;
      this.value = value;
  }
  var Income = function(id, description,value){
    this.id = id;
    this.description = description;
    this.value = value;
}
    var calculateTotal = function(type){
        var sum= 0;
        data.allItems[type].forEach(function(cur){
            sum=sum+cur.value;
        });
        data.totals[type]=sum;
    };
var data = {
    allItems:{
        exp:[],
        inc:[]
    },
    totals:{
        exp:0,
        inc:0,
    },
    budged: 0,
    percentage: -1,
};
return {
    addItem:function(type, des, val){
            var newItem, id;
            //create new id
            if(data.allItems[type].length>0){
            id = data.allItems[type][data.allItems[type].length-1].id+1; //id should be id = id +1
            } else{
                id=0;
            }
            //create new item based on 'inc' or 'exp' type 
            if (type ==='exp'){
                newItem = new Expense(id,des,val);
            }else if (type ==='inc'){
                newItem = new Income(id,des,val);
            }
            //push it into data
            data.allItems[type].push(newItem);
            //return our new element
            return newItem;
    },
    calculateBudget: function(){
        //calculate total income and expenses
        calculateTotal('inc');
        calculateTotal('exp');
        //calculate the budget: income-expenses
        data.budged = data.totals.inc - data.totals.exp;
        //calculate the percentage of income spend
        if(data.totals.inc> 0 ){
        data.percentage= Math.round((data.totals.exp/ data.totals.inc)*100);
        } else{
            data.percentage = -1
        }
    
    },
    testing: function(){
        return(data);
    },
    getBudged: function(){
        return{
            budged: data.budged,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage,
        }

    },
}
            
})();







//UI controller
var UIcontroller = (function(){


    var DOMstrings ={
 inputType : '.add__type',
 inputDescription: '.add__description',
 inputValue: '.add__value',
 inputBtn: '.add__btn',
 incomeContainer: '.income__list',
 expensesContainer: '.expenses__list',
    };
return {
    getInput:function(){ 
        return{
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value :parseFloat( document.querySelector(DOMstrings.inputValue).value),
        };
    },
    addListItem:function(obj, type){
        var html, newHtml, element;
            //create HTML string with placeholder text
            if(type ==='inc'){
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
            } else if (type ==='exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
                //replace the placeholder text with some actual data
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', obj.value)
            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    
        clearFields: function(){
            var fields,fieldsArr;
            fields=document.querySelectorAll(DOMstrings.inputDescription +', '+ DOMstrings.inputValue)
            
             fieldsArr=Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
                current.value = "";
            });
            fieldsArr[0].focus();
        },





    getDOMstrings: ()=> DOMstrings,
}


})();






//GLOBAL APP Controller
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListner = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if (event.keyCode ===13 || event.which ===13){
                UICtrl.ctrlAddItem();
            }
             })
            
    }
    var updateBudged = function(){
            //calculate the budget
            budgetCtrl.calculateBudget();
            // return the budget
            var budged = budgetCtrl.getBudged();
     // display the budget on the UI
     console.info(budged);
    }

    
    var ctrlAddItem = function(){
        var input, newItem;
     //get the field input data
      input = UICtrl.getInput();
     if (input.description !==""&& !isNaN(input.value) && input.value >0){
     // add the item to the budget controller
     newItem=budgetCtrl.addItem(input.type,input.description,input.value);
     // add a new item to the user interface
        UICtrl.addListItem(newItem,input.type)
        //cleaer the fields by calling the clearField method
        UICtrl.clearFields();
        //calculate and update budged
        updateBudged();
     }
    }
    return {
        init: function(){
            setupEventListner();
        }
    }
 
 

})(budgetController,UIcontroller);
controller.init();