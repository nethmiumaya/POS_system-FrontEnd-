import { saveCustomer } from "../model/CustomerModel.js";
import { getAllCustomers } from "../model/CustomerModel.js";
import { updateCustomer } from "../model/CustomerModel.js";
import { deleteCustomer } from "../model/CustomerModel.js";

$(document).ready(function () {
  refresh();
});

document
  .querySelector("#CustomerManage #customerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

var custId;
var custName;
var custAddress;
var custSalary;

//save button
$("#CustomerManage .saveBtn").click(function () {
  custId = $("#CustomerManage .custId").val();
  custName = $("#CustomerManage .custName").val();
  custAddress = $("#CustomerManage .custAddress").val();
  custSalary = $("#CustomerManage .custSalary").val();

  let customer = {
    custId: custId,
    custName: custName,
    custAddress: custAddress,
    custSalary: custSalary,
  };

  validate(customer)
    .then((validResult) => {
      if (validResult) {
        saveCustomer(customer, () => {
          refresh();
        });
      }
    })
    .catch((error) => {
      console.error("Validation Failed : ", error);
    });
});

function validate(customer) {
  return new Promise((resolve, reject) => {
    let valid = true;

    if (/^C[0-9]+$/.test(customer.custId)) {
      $("#CustomerManage .invalidCustId").text("");
      valid = true;
    } else {
      $("#CustomerManage .invalidCustId").text("Invalid Customer Id");
      valid = false;
    }

    if (/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/.test(customer.custName)) {
      $("#CustomerManage .invalidCustName").text("");

      if (valid) {
        valid = true;
      }
    } else {
      $("#CustomerManage .invalidCustName").text("Invalid Customer Name");
      valid = false;
    }

    if (/^[A-Z][a-z, ]+$/.test(customer.custAddress)) {
      $("#CustomerManage .invalidCustAddress").text("");

      if (valid) {
        valid = true;
      }
    } else {
      $("#CustomerManage .invalidCustAddress").text("Invalid Customer Address");
      valid = false;
    }

    if (customer.custSalary != null && customer.custSalary > 0) {
      $("#CustomerManage .invalidCustSalary").text("");
      if (valid) {
        valid = true;
      }
    } else {
      $("#CustomerManage .invalidCustSalary").text("Invalid Customer Salary");
      valid = false;
    }

    getAllCustomers()
      .then((customers) => {
        for (let i = 0; i < customers.length; i++) {
          if (customers[i].custId === customer.custId) {
            $("#CustomerManage .invalidCustId").text(
              "Customer Id Already Exists!"
            );
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

function loadTable(customer) {
  $("#CustomerManage .tableRow").append(
    "<tr> " +
      "<td>" +
      customer.custId +
      "</td>" +
      "<td>" +
      customer.custName +
      "</td>" +
      "<td>" +
      customer.custAddress +
      "</td>" +
      "<td>" +
      customer.custSalary +
      "</td>" +
      "</tr>"
  );
}

async function createCustomerId() {
  const customers = await getAllCustomers();
  if (!customers || customers.length === 0) {
    return "C01";
  } else {
    const lastCustomer = customers[customers.length - 1];
    const lastCustomerId = lastCustomer ? lastCustomer.custId : "C00";
    const lastIdNumber = parseInt(lastCustomerId.slice(1), 10); // Convert to number
    const newIdNumber = lastIdNumber + 1;
    return "C" + newIdNumber.toString().padStart(2, "0"); // Ensure ID is always 2 digits (minimum length)
  }
}

function refresh() {
  createCustomerId().then((newCustomerId) => {
    $("#CustomerManage .custId").val(newCustomerId);
    $("#CustomerManage .custName").val("");
    $("#CustomerManage .custAddress").val("");
    $("#CustomerManage .custSalary").val("");
    $("#CustomerManage .invalidCustId").text("");
    $("#CustomerManage .invalidCustName").text("");
    $("#CustomerManage .invalidCustAddress").text("");

    reloadTable();
  });
}

$("#CustomerManage .clearBtn").click(function () {
  refresh();
});

$("#CustomerManage .searchBtn").click(function () {
  const custId = $("#CustomerManage .custId").val();

  searchCustomer(custId)
    .then((customer) => {
      if (customer) {
        $("#CustomerManage .custName").val(customer.custName);
        $("#CustomerManage .custAddress").val(customer.custAddress);
        $("#CustomerManage .custSalary").val(customer.custSalary);
      } else {
        alert("Customer Not Found");
      }
    })
    .catch((error) => {
      console.error("Search Failed : ", error);
    });
});

async function searchCustomer(id) {
  try {
    const customers = await getAllCustomers();
    return customers.find((c) => c.custId === id);
  } catch (error) {
    console.error("Failed to get customers:", error);
    return null;
  }
}

//update btn
$("#CustomerManage .updateBtn").click(function () {
  let UpdateCustomer = {
    custId: "C00",
    custName: $("#CustomerManage .custName").val(),
    custAddress: $("#CustomerManage .custAddress").val(),
    custSalary: $("#CustomerManage .custSalary").val(),
  };

  let validResult = validate(UpdateCustomer);

  UpdateCustomer.custId = $("#CustomerManage .custId").val();

  if (validResult) {
    getAllCustomers()
      .then((customers) => {
        let customer = customers.findIndex((c) => {
          c.custId === UpdateCustomer.custId;
        });
        if (customer) {
          updateCustomer(UpdateCustomer);
          refresh();
        } else {
          alert("Customer not Found");
        }
      })
      .catch((error) => {
        console.error("Failed to get customers", error);
      });
  }
});

function reloadTable() {
  getAllCustomers()
    .then((customers) => {
      $("#CustomerManage .tableRow").empty();
      customers.forEach((c) => {
        loadTable(c);
      });
    })
    .catch((error) => {
      console.error("Failed to get customers", error);
    });
}

//Delete
$("#CustomerManage .removeBtn").click(function () {
  let id = $("#CustomerManage .custId").val();

  getAllCustomers()
    .then((customers) => {
      let customer = customers.findIndex((c) => {
        c.custId === id;
      });
      if (customer) {
        deleteCustomer(id);
        refresh();
      } else {
        alert("Customer Not Found");
      }
    })
    .catch((error) => {
      console.error("Failed to get customers", error);
    });
});

$("#CustomerManage .tableRow").on("click", "tr", function () {
  let id = $(this).children("td:eq(0)").text();
  let name = $(this).children("td:eq(1)").text();
  let qty = $(this).children("td:eq(2)").text();
  let price = $(this).children("td:eq(3)").text();

  $("#CustomerManage .custId").val(id);
  $("#CustomerManage .custName").val(name);
  $("#CustomerManage .custAddress").val(qty);
  $("#CustomerManage .custSalary").val(price);
});
