//-----------------------------

//storage controller

//-----------------------------


//-----------------------------

//item controller----------------------------------------------

//-----------------------------
const ItemCtrl = (function () {
    //item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //data structure / state

    const data = {
        items: [],
        currentItem: null,
        totalCalories: 0
    }

    //public methods
    return {
        logData: function () {
            return data;
        },
        getitems: function () {
            return data.items;
        },

        addItem: function (name, calories) {
            let ID;
            //create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 1;
            }
            //calories to number
            calories = parseInt(calories);
            newItem = new Item(ID, name, calories);
            data.items.push(newItem);
            return newItem;
        },

        getTotalCalories: function () {
            let totalCalories = 0;
            data.items.forEach(item => {
                totalCalories += item.calories;
            });
            data.totalCalories = totalCalories;
            return data.totalCalories;

        }


    }
})();


//-----------------------------

//ui controller -----------------------------

//-----------------------------

const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        deleteBtn: '.delete-btn',
        updateBtn: '.update-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInptut: '#item-calories',
        totalCaloriesDisplay: '.total-calories'
    }



    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>`
            });
            //insert list item
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function () {
            return UISelectors;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInptut).value
            }
        },
        addListItem: function (item) {
            //create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = ` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
            document.querySelector(UISelectors.itemList).style.display = 'block';

            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInptut).value = '';
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        updateTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCaloriesDisplay).textContent = totalCalories;
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        }
    }

})();


//-----------------------------

//app controller---------------------------------

//-----------------------------
const App = (function (ItemCtrl, UICtrl) {
    // load event listeners method
    const loadEventListeners = function () {
        //get ui selectors
        const UISelectors = UICtrl.getSelectors();


        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    }
    //add item submit
    const itemAddSubmit = function (e) {
        //get form input from UI controller
        const input = UICtrl.getItemInput();
        //check for empty inputs
        if (input.name !== '' & input.calories !== '') {
            // add item
            UICtrl.addListItem(ItemCtrl.addItem(input.name, input.calories));
        }



        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.updateTotalCalories(totalCalories);


        //clear input fields
        UICtrl.clearInput();
        e.preventDefault();
    }



    return {
        init: function () {
            UICtrl.clearEditState();
            //fetch items from data structure
            const items = ItemCtrl.getitems();
            // check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                //showlist
                UICtrl.showList();
                //populate list with item
                UICtrl.populateItemList(items);
            }

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.updateTotalCalories(totalCalories);

            // load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);


//initalize App
App.init();