import { getAllOrders } from "../model/OrderModel.js";
import { getAllCustomers } from "../model/CustomerModel.js";
import { getAllItems, updateItem } from "../model/ItemModel.js";
import { saveOrder } from "../model/OrderModel.js";

var itemId;
var itemQty;
var orderQty;

$(document).ready(function () {
  refresh();
});

$(".orderManageBtn").click(function () {
  refresh();
});

function refresh() {
  generateOrderId().then((newOrderId) => {
    $("#OrderManage .orderId").val(newOrderId);
    $("#OrderManage .orderDate").val(new Date().toISOString().split("T")[0]);
    loadCustomer();
    loadItems();
  });

  // $('#OrderManage .Total').text("");
  // $('#OrderManage .SubTotal').text("");
  // $('#OrderManage .SubTotal').text("");
  // $('#OrderManage .Balance').val("");
  // $('#OrderManage .Cash').val('');
  // $('#OrderManage .Discount').val('');
}

async function generateOrderId() {
  const orders = await getAllOrders();
  if (orders.length === 0) {
    return "OD01";
  } else {
    let lastOrder = orders[orders.length - 1];
    const lastOrderId = lastOrder ? lastOrder.orderId : "OD00";
    const lastIdNumber = parseInt(lastOrderId.slice(2), 10);
    const newIdNumber = lastIdNumber + 1;
    return "OD" + newIdNumber.toString().padStart(2, "0");
  }
}

// function extractNumber(id) {
//   var match = id.match(/OD(\d+)/);
//   if (match && match.length > 1) {
//     return match[1];
//   }
//   return null;
// }

// function generateId() {
//   let orders = getAllOrders();

//   if (orders.length === 0) {
//     return "OD01";
//   } else {
//     // alert('ok');
//     let orderId = orders[orders.length - 1].orderId;
//     let number = extractNumber(orderId);
//     number++;
//     //alert('OD0' + number);
//     return "OD0" + number;
//   }
// }

function loadCustomer() {
  let cmb = $("#OrderManage .customers");
  cmb.empty();

  getAllCustomers()
    .then((customers) => {
      let option = [];
      option.unshift("");

      customers.forEach((customer) => {
        option.push(customer.custId);
      });

      $.each(option, function (index, value) {
        cmb.append($("<option>").val(value).text(value));
      });
    })
    .catch((error) => {
      console.error("Failed to load data to comboBox:", error);
    });
}

function loadItems() {
  let cmb = $("#OrderManage .itemCmb");
  cmb.empty();

  getAllItems()
    .then((items) => {
      let option = [];

      items.forEach((item) => {
        option.push(item.itemId);
      });

      option.unshift("");

      $.each(option, function (index, value) {
        cmb.append($("<option>").val(value).text(value));
      });
    })
    .catch((error) => {
      console.error("Failed to load data to comboBox:", error);
    });
}

$("#OrderManage .customers").change(function () {
  const selectedCustomerId = $(this).val();
  getAllCustomers()
    .then((customers) => {
      const customer = customers.find((c) => c.custId === selectedCustomerId);

      if (customer) {
        $("#OrderManage .custId").val(customer.custId);
        $("#OrderManage .custName").val(customer.custName);
        $("#OrderManage .custAddress").val(customer.custAddress);
        $("#OrderManage .custSalary").val(customer.custSalary);
      } else {
        alert("Customer not found");
      }
    })
    .catch((error) => {
      console.error("Error by retrieving customers: ", error);
    });
});

$("#OrderManage .itemCmb").change(function () {
  const selectedItemId = $(this).val();

  getAllItems()
    .then((items) => {
      const item = items.find((i) => i.itemId === selectedItemId);

      if (item) {
        $("#OrderManage .addBtn").text("Add");
        $("#OrderManage .itemCode").val(item.itemId);
        $("#OrderManage .itemName").val(item.itemName);
        $("#OrderManage .itemQty").val(item.itemQty);
        $("#OrderManage .itemPrice").val(item.itemPrice);
      } else {
        alert("Item not found");
      }
    })
    .catch((error) => {
      console.error("Error retrieving items:", error);
    });
  // itemId = item.itemId;
  // alert(item.itemQty);
  //itemQty = item.itemQty;
});

function clear(tableCount) {
  if (tableCount === 1) {
    $("#OrderManage .itemCode").val("");
    $("#OrderManage .itemName").val("");
    $("#OrderManage .itemPrice").val("");
    $("#OrderManage .itemQty").val("");
    $("#OrderManage .orderQty").val("");
    $("#OrderManage .SubTotal").text("");
    $("#OrderManage .Cash").val("");
    $("#OrderManage .Total").text("");
    $("#OrderManage .Discount").val("");
    $("#OrderManage .itemCmb").val("");
  } else {
    $("#OrderManage .custId").val("");
    $("#OrderManage .custName").val("");
    $("#OrderManage .custAddress").val("");
    $("#OrderManage .custSalary").val("");
    $("#OrderManage .itemCode").val("");
    $("#OrderManage .itemName").val("");
    $("#OrderManage .itemPrice").val("");
    $("#OrderManage .itemQty").val("");
    $("#OrderManage .orderQty").val("");
  }
}

let getItems = [];

//save
$("#OrderManage .addBtn").click(function () {
  if ($("#OrderManage .addBtn").text() === "delete") {
    dropItem();
  } else {
    let getItem = {
      itemCode: $("#OrderManage .itemCode").val(),
      getItems: $("#OrderManage .itemName").val(),
      itemPrice: parseFloat($("#OrderManage .itemPrice").val()),
      itemQty: parseInt($("#OrderManage .orderQty").val(), 10),
      total:
        parseFloat($("#OrderManage .itemPrice").val()) *
        parseInt($("#OrderManage .orderQty").val(), 10),
    };

    let itemQty = parseInt($("#OrderManage .itemQty").val(), 10);
    let orderQty = parseInt($("#OrderManage .orderQty").val(), 10);

    if (itemQty >= orderQty) {
      if (
        $("#OrderManage .custId").val() !== "" &&
        $("#OrderManage .custName").val() !== null
      ) {
        if (orderQty > 0) {
          let item = getItems.find((I) => I.itemCode === getItem.itemCode);
          if (item == null) {
            getItems.push(getItem);
            loadTable();
            clear(1);
            setTotal();
          } else {
            alert("Already Added");
          }
        } else {
          alert("Invalid Quantity");
        }
      } else {
        alert("Invalid Customer");
      }
    } else {
      alert("Not Enough Quantity");
    }
  }
});

function dropItem() {
  let itemCode = $("#OrderManage .itemCode").val();
  let item = getItems.find((I) => I.itemCode === itemCode);
  let index = getItems.findIndex((I) => I.itemCode === itemCode);
  getItems.splice(index, 1);
  alert("Item Removed");
  loadTable();
  clear(1);
  setTotal();
}

function loadTable() {
  $("#OrderManage .tableRows").empty();
  for (let i = 0; i < getItems.length; i++) {
    $("#OrderManage .tableRows").append(
      "<div> " +
        "<div>" +
        getItems[i].itemCode +
        "</div>" +
        "<div>" +
        getItems[i].getItems +
        "</div>" +
        "<div>" +
        getItems[i].itemPrice +
        "</div>" +
        "<div>" +
        getItems[i].itemQty +
        "</div>" +
        "<div>" +
        getItems[i].total +
        "</div>" +
        "</tr>"
    );
  }
}

function setTotal() {
  let total = 0;
  for (let i = 0; i < getItems.length; i++) {
    total += getItems[i].total;
  }
  $("#OrderManage .Total").text(total);
}

$("#OrderManage .placeOrder").click(function () {
  let cash = parseFloat($("#OrderManage .Cash").val());
  let total = parseFloat($("#OrderManage .Total").text());
  let discount = parseFloat($("#OrderManage .Discount").val());

  alert(cash + " " + total + " " + discount);

  if (cash >= total) {
    if (discount >= 0 && discount <= 100) {
      let subTotal = total - (total * discount) / 100;
      $("#OrderManage .SubTotal").text(subTotal.toFixed(2));
      let balance = cash - subTotal;
      $("#OrderManage .Balance").val(balance.toFixed(2));

      let Order = {
        orderId: $("#OrderManage .orderId").val(),
        orderDate: $("#OrderManage .orderDate").val(),
        custId: $("#OrderManage .custId").val(),
        items: getItems,
        total: total,
        discount: discount,
        subTotal: subTotal,
        cash: cash,
        balance: balance,
      };

      saveOrder(Order)
        .then(() => updateItemData())
        .then(() => {
          getItems = [];
          loadTable();
          clear(2);
          alert("Order Placed");
          refresh();
        })
        .catch((error) => {
          console.error("Failed to save order:", error);
          alert("Failed to save order");
        });
    } else {
      alert("Invalid Discount");
    }
  } else {
    alert("Not Enough Cash");
  }
});

function updateItemData() {
  return getAllItems()
    .then((items) => {
      const updatePromises = getItems.map((item) => {
        // for (let i = 0; i < getItems.length; i++) {
        //   let item = items.find((I) => I.itemId === getItems[i].itemCode);
        //   item.itemQty -= getItems[i].itemQty;
        //   let index = items.findIndex((I) => I.itemId === getItems[i].itemCode);
        //   updateItem(index, item);
        // }
        let foundItem = items.find((I) => I.itemId === item.itemId);
        if (foundItem) {
          foundItem.itemQty -= item.itemQty;
          return updateItem(foundItem);
        } else {
          console.warn(`Item with ID ${item.itemId} not Found `);
          return Promise.resolve();
        }
      });
      return Promise.all(updatePromises);
    })
    .catch((error) => {
      console.error("Failed to retrieve items:", error);
      throw error;
    });
}

$(".mainTable .tableRows").on("click", "div", function () {
  let itemCode = $(this).children("div:eq(0)").text();
  let itemName = $(this).children("div:eq(1)").text();
  let price = $(this).children("div:eq(2)").text();
  let qty = $(this).children("div:eq(3)").text();

  $("#OrderManage .itemCode").val(itemCode);
  $("#OrderManage .itemName").val(itemName);
  $("#OrderManage .itemPrice").val(price);
  $("#OrderManage .orderQty").val(qty);

  $("#OrderManage .ItemSelect .addBtn").text("delete");
});

// $('#orderManage .itemCmb')
