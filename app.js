//-----------------------------

//storage controller

//-----------------------------

const StorageCtrl = (function() {
  return {
    storeItem: function(item) {
      let items;
      //check if any items in LS
      if (localStorage.getItem("items") === null) {
        items = [];
        //push
        items.push(item);
        //set local storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(itemToDelete) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (itemToDelete.id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    }
  };
})();

//-----------------------------

//item controller----------------------------------------------

//-----------------------------
const ItemCtrl = (function() {
  //item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //data structure / state

  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  //public methods
  return {
    logData: function() {
      return data;
    },
    getitems: function() {
      return data.items;
    },

    addItem: function(name, calories) {
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

    getTotalCalories: function() {
      let totalCalories = 0;
      data.items.forEach(item => {
        totalCalories += item.calories;
      });
      data.totalCalories = totalCalories;
      return data.totalCalories;
    },

    getItemById: function(id) {
      let found;
      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    setCurrentItem: function(item) {
      data.currentItem = item;
    },

    getCurrentItem: function() {
      return data.currentItem;
    },

    updateItem: function(name, calories) {
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      //get ids
      ids = data.items.map(item => {
        return item.id;
      });
      //get index
      const index = ids.indexOf(id);

      //remove item
      data.items.splice(index, 1);
    },

    clearAllItems: function() {
      data.items = [];
    }
  };
})();

//-----------------------------

//ui controller -----------------------------

//-----------------------------

const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    deleteBtn: ".delete-btn",
    editBtn: ".update-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInptut: "#item-calories",
    totalCaloriesDisplay: ".total-calories",
    listItems: "#item-list li"
  };

  return {
    populateItemList: function(items) {
      let html = "";
      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>`;
      });
      //insert list item
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getSelectors: function() {
      return UISelectors;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInptut).value
      };
    },
    addListItem: function(item) {
      //create li element
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = ` <strong>${item.name}: </strong> <em>${
        item.calories
      } Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
      document.querySelector(UISelectors.itemList).style.display = "block";

      //insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInptut).value = "";
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showList: function() {
      document.querySelector(UISelectors.itemList).style.display = "block";
    },
    updateTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCaloriesDisplay
      ).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.editBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelectors.editBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInptut
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //turn the nodelist into an array
      listItems = Array.from(listItems);
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = ` <strong>${
            item.name
          }: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`;
        }
      });
      UICtrl.clearEditState();
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    removeListItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // turn node list into array list
      listItems = Array.from(listItems);
      listItems.forEach(item => item.remove());
    }
  };
})();

//-----------------------------

//app controller---------------------------------

//-----------------------------
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // load event listeners method
  const loadEventListeners = function() {
    //get ui selectors
    const UISelectors = UICtrl.getSelectors();

    //add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    //disable submit on enter keypress
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    //update item click event
    document
      .querySelector(UISelectors.editBtn)
      .addEventListener("click", itemUpdateSubmit);
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    //clear items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);

    //delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);
  };
  //add item submit
  const itemAddSubmit = function(e) {
    //get form input from UI controller
    const input = UICtrl.getItemInput();

    //check for empty inputs
    if ((input.name !== "") & (input.calories !== "")) {
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addListItem(newItem);
    }

    //get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.updateTotalCalories(totalCalories);

    //storage in local storage
    StorageCtrl.storeItem(newItem);

    //clear input fields
    UICtrl.clearInput();
    e.preventDefault();
  };

  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      //get list item id
      const listItemId = e.target.parentNode.parentNode.id; //returns 'item-2'
      //break into array
      const listIdArray = listItemId.split("-");
      //get the actual id
      const id = parseInt(listIdArray[1]);
      //get item
      const itemToEdit = ItemCtrl.getItemById(id);
      //set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //add item to form
      UICtrl.addItemToForm();
    } else {
    }

    e.preventDefault();
  };

  const itemUpdateSubmit = function(e) {
    //get item input
    const input = UICtrl.getItemInput();

    //update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    UICtrl.updateListItem(updatedItem);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.updateTotalCalories(totalCalories);

    //update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  const itemDeleteSubmit = function(e) {
    const currentItem = ItemCtrl.getCurrentItem();
    ///delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.updateTotalCalories(totalCalories);

    //delete from ui
    UICtrl.deleteListItem(currentItem.id);
    UICtrl.clearEditState();

    //delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem);

    e.preventDefault();
  };

  const clearAllItemsClick = function(e) {
    //delete all items from data structure
    ItemCtrl.clearAllItems();
    //remove from UI
    UICtrl.removeListItems();
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.updateTotalCalories(totalCalories);
    
    localStorage.removeItem('items');
    UICtrl.hideList();

    e.preventDefault();
  };

  return {
    init: function() {
      //  clear edit state / set initial state
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
  };
})(ItemCtrl, StorageCtrl, UICtrl);

//initalize App
App.init();
