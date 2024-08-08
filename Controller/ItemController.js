import { saveItem } from "../model/ItemModel.js";
import { getAllItems } from "../model/ItemModel.js";
import { deleteItem } from "../model/ItemModel.js";
import { updateItem } from "../model/ItemModel.js";

document
  .querySelector("#ItemManage #ItemForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

$(document).ready(function () {
  refresh();
});

var itemId;
var itemName;
var itemQty;
var itemPrice;

//save
$("#ItemManage .saveBtn").click(function () {
  itemId = $("#ItemManage .itemId").val();
  itemName = $("#ItemManage .itemName").val();
  itemQty = $("#ItemManage .itemQty").val();
  itemPrice = $("#ItemManage .itemPrice").val();

  let item = {
    itemId: itemId,
    itemName: itemName,
    itemQty: itemQty,
    itemPrice: itemPrice,
  };

  validate(item)
    .then((validResult) => {
      if (validResult) {
        saveItem(item, () => {
          refresh();
        });
      }
    })
    .catch((error) => {
      console.error("Validation Failed : ", error);
    });
});

function validate(item) {
  return new Promise((resolve, reject) => {
    let valid = true;

    if (/^I[0-9]+$/.test(item.itemId)) {
      $("#ItemManage .invalidCode").text("");
      valid = true;
    } else {
      $("#ItemManage .invalidCode").text("Invalid Item Id");
      valid = false;
    }

    if (/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/.test(item.itemName)) {
      $("#ItemManage .invalidName").text("");

      if (valid) {
        valid = true;
      }
    } else {
      $("#ItemManage .invalidName").text("Invalid Item Name");
      valid = false;
    }

    if (item.itemQty != null && item.itemQty > 0) {
      $("#ItemManage .invalidQty").text("");
      if (valid) {
        valid = true;
      }
    } else {
      $("#ItemManage .invalidQty").text("Invalid Item Quantity");
      valid = false;
    }

    if (item.itemPrice != null && item.itemPrice > 0) {
      $("#ItemManage .invalidPrice").text("");
      if (valid) {
        valid = true;
      }
    } else {
      $("#ItemManage .invalidPrice").text("Invalid Item Price");
      valid = false;
    }

    getAllItems()
      .then((items) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].itemId === item.itemId) {
          //  $("#ItemManage .invalidCode").text("Item Id already exists");
            valid = false;
          }
        }

        resolve(valid);
      })
      .catch((error) => {
        console.error(error);
        reject(false);
      });
  });
}

function loadTable(item) {
  $("#ItemManage .tableRow").append(
    "<tr> " +
      "<td>" +
      item.itemId +
      "</td>" +
      "<td>" +
      item.itemName +
      "</td>" +
      "<td>" +
      item.itemQty +
      "</td>" +
      "<td>" +
      item.itemPrice +
      "</td>" +
      "</tr>"
  );
}

async function createItemId() {
  const items = await getAllItems();
  if (!items || items.length === 0) {
    return "I01";
  } else {
    const lastItem = items[items.length - 1];
    const lastItemId = lastItem ? lastItem.itemId : "I00";
    const lastIdNumber = parseInt(lastItemId.slice(1), 10); // Convert to number
    const newIdNumber = lastIdNumber + 1;
    return "I" + newIdNumber.toString().padStart(2, "0"); // Ensure ID is always 2 digits (minimum length)
  }
}

function refresh() {
  createItemId().then((newItemId) => {
    $("#ItemManage .itemId").val(newItemId);
    $("#ItemManage .itemName").val("");
    $("#ItemManage .itemQty").val("");
    $("#ItemManage .itemPrice").val("");
    $("#ItemManage .invalidItemId").text("");
    $("#ItemManage .invalidItemName").text("");
    $("#ItemManage .invalidItemQty").text("");
    $("#ItemManage .invalidItemPrice").text("");

    reloadTable();
  });
}

$("#ItemManage .clearBtn").click(function () {
  refresh();
});

$("#ItemManage .searchBtn").click(function () {

  const itemId = $("#ItemManage .itemId").val();

  searchItem(itemId)
    .then((item) => {
      if (item) {
        $("#ItemManage .itemName").val(item.itemName);
        $("#ItemManage .itemQty").val(item.itemQty);
        $("#ItemManage .itemPrice").val(item.itemPrice);
      } else {
        alert("Item Not Found");
      }
    })
    .catch((error) => {
      console.error("Search Failed : ", error);
    });
});

async function searchItem(id) {
  try {
    const items = await getAllItems();
    return items.find((i) => i.itemId === id);
  } catch (error) {
    console.error("Failed to get Items:", error);
    return null;
  }
}
//update
$("#ItemManage .updateBtn").click(function () {
  let UpdateItem = {
    itemId: "I00",
    itemName: $("#ItemManage .itemName").val(),
    itemQty: $("#ItemManage .itemQty").val(),
    itemPrice: $("#ItemManage .itemPrice").val(),
  };

  let validResult = validate(UpdateItem);

  UpdateItem.itemId = $("#ItemManage .itemId").val();

  if (validResult) {
    getAllItems()
      .then((items) => {
        let item = items.findIndex((c) => {
          c.itemId === updateItem.itemId;
        });
        if (item) {
          updateItem(UpdateItem);
          refresh();
        } else {
          alert("Item not Found");
        }
      })
      .catch((error) => {
        console.error("Failed to get customers", error);
      });
  }
});

function reloadTable() {
  getAllItems()
    .then((items) => {
      $("#ItemManage .tableRow").empty();
      items.forEach((c) => {
        loadTable(c);
      });
    })
    .catch((error) => {
      console.error("Failed to get items", error);
    });
}

//delete
$("#ItemManage .deleteBtn").click(function () {
  let id = $("#ItemManage .itemId").val();

  getAllItems()
    .then((items) => {
      let item = items.findIndex((c) => {
        c.itemId === id;
      });
      if (item) {
        deleteItem(id);
        refresh();
      } else {
        alert("Item Not Found");
      }
    })
    .catch((error) => {
      console.error("Failed to get items", error);
    });
});

$("#ItemManage .tableRow").on("click", "tr", function () {
  let id = $(this).children("td:eq(0)").text();
  let name = $(this).children("td:eq(1)").text();
  let qty = $(this).children("td:eq(2)").text();
  let price = $(this).children("td:eq(3)").text();

  $("#ItemManage .itemId").val(id);
  $("#ItemManage .itemName").val(name);
  $("#ItemManage .itemQty").val(qty);
  $("#ItemManage .itemPrice").val(price);
});
