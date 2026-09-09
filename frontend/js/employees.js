// =========================================================
// PAYROLLPRO - EMPLOYEE JAVASCRIPT
// Add, Edit, Search, Delete Employee
// =========================================================


// =========================================================
// HTML ELEMENTS
// =========================================================

const addEmployeeButton =
    document.querySelector(".add-button");

const employeeModal =
    document.getElementById("employeeModal");

const closeModalButton =
    document.getElementById("closeModal");

const cancelEmployeeButton =
    document.getElementById("cancelEmployee");

const employeeForm =
    document.getElementById("employeeForm");

const employeeTableBody =
    document.getElementById("employeeTableBody");

const employeeCount =
    document.getElementById("employeeCount");

const employeeSearch =
    document.getElementById("employeeSearch");

const modalTitle =
    document.getElementById("modalTitle");


// =========================================================
// EMPLOYEE DATA
// =========================================================

let employees =
    JSON.parse(
        localStorage.getItem("employees")
    ) || [];


// =========================================================
// EDIT MODE
// =========================================================

let editingEmployeeId = null;


// =========================================================
// OPEN ADD EMPLOYEE MODAL
// =========================================================

if (addEmployeeButton) {

    addEmployeeButton.addEventListener(
        "click",
        function () {

            editingEmployeeId = null;

            modalTitle.textContent =
                "Add New Employee";

            employeeForm.reset();

            employeeModal.style.display =
                "flex";

        }
    );

}


// =========================================================
// CLOSE MODAL
// =========================================================

if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        function () {

            employeeModal.style.display =
                "none";

            employeeForm.reset();

            editingEmployeeId = null;

        }
    );

}


// =========================================================
// CANCEL
// =========================================================

if (cancelEmployeeButton) {

    cancelEmployeeButton.addEventListener(
        "click",
        function () {

            employeeModal.style.display =
                "none";

            employeeForm.reset();

            editingEmployeeId = null;

        }
    );

}


// =========================================================
// SAVE / UPDATE EMPLOYEE
// =========================================================

if (employeeForm) {

    employeeForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // =================================================
            // GET FORM DATA
            // =================================================

            const employee = {

                id:
                    document
                        .getElementById("employeeId")
                        .value
                        .trim(),

                name:
                    document
                        .getElementById("employeeName")
                        .value
                        .trim(),

                email:
                    document
                        .getElementById("employeeEmail")
                        .value
                        .trim(),

                mobile:
                    document
                        .getElementById("employeeMobile")
                        .value
                        .trim(),

                department:
                    document
                        .getElementById("department")
                        .value
                        .trim(),

                designation:
                    document
                        .getElementById("designation")
                        .value
                        .trim(),

                joiningDate:
                    document
                        .getElementById("joiningDate")
                        .value,

                employeeType:
                    document
                        .getElementById("employeeType")
                        .value,

                panNumber:
                    document
                        .getElementById("panNumber")
                        .value
                        .trim()
                        .toUpperCase(),

                uanNumber:
                    document
                        .getElementById("uanNumber")
                        .value
                        .trim(),

                pfNumber:
                    document
                        .getElementById("pfNumber")
                        .value
                        .trim(),

                bankAccount:
                    document
                        .getElementById("bankAccount")
                        .value
                        .trim(),

                basicSalary:
                    document
                        .getElementById("basicSalary")
                        .value,

                status:
                    document
                        .getElementById("employeeStatus")
                        .value

            };


            // =================================================
            // CHECK DUPLICATE EMPLOYEE ID
            // =================================================

            const duplicateEmployee =
                employees.find(function (existingEmployee) {

                    return (
                        existingEmployee.id === employee.id &&
                        existingEmployee.id !== editingEmployeeId
                    );

                });


            if (duplicateEmployee) {

                alert(
                    "Employee ID already exists. Please use a different ID."
                );

                return;

            }


            // =================================================
            // EDIT EMPLOYEE
            // =================================================

            if (editingEmployeeId !== null) {

                const employeeIndex =
                    employees.findIndex(
                        function (existingEmployee) {

                            return (
                                existingEmployee.id ===
                                editingEmployeeId
                            );

                        }
                    );


                if (employeeIndex !== -1) {

                    employees[employeeIndex] =
                        employee;

                }


                alert(
                    "Employee updated successfully!"
                );

            }


            // =================================================
            // ADD NEW EMPLOYEE
            // =================================================

            else {

                employees.push(employee);

                alert(
                    "Employee added successfully!"
                );

            }


            // =================================================
            // SAVE LOCAL STORAGE
            // =================================================

            localStorage.setItem(
                "employees",
                JSON.stringify(employees)
            );


            // =================================================
            // UPDATE TABLE
            // =================================================

            displayEmployees();


            // =================================================
            // RESET
            // =================================================

            employeeForm.reset();

            employeeModal.style.display =
                "none";

            editingEmployeeId = null;

        }
    );

}


// =========================================================
// DISPLAY EMPLOYEES
// =========================================================

function displayEmployees() {

    if (!employeeTableBody) {
        return;
    }


    if (employees.length === 0) {

        employeeTableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        <div class="empty-icon">
                            👨‍💼
                        </div>

                        <h3>
                            No Employees Found
                        </h3>

                        <p>
                            Add your first employee
                            to get started.
                        </p>

                    </div>

                </td>

            </tr>

        `;


        if (employeeCount) {

            employeeCount.textContent =
                "0 Employees";

        }


        return;

    }


    employeeTableBody.innerHTML = "";


    employees.forEach(
        function (employee) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${employee.id || "-"}
                </td>

                <td>
                    ${employee.name || "-"}
                </td>

                <td>
                    ${employee.department || "-"}
                </td>

                <td>
                    ${employee.designation || "-"}
                </td>

                <td>
                    ${employee.joiningDate || "-"}
                </td>

                <td>
                    ${employee.status || "-"}
                </td>

                <td>

                    <button
                        onclick="editEmployee('${employee.id}')"
                    >
                        Edit
                    </button>

                    <button
                        onclick="deleteEmployee('${employee.id}')"
                    >
                        Delete
                    </button>

                </td>

            `;


            employeeTableBody.appendChild(row);

        }
    );


    if (employeeCount) {

        employeeCount.textContent =
            employees.length +
            " Employees";

    }

}


// =========================================================
// EDIT EMPLOYEE
// =========================================================

function editEmployee(employeeId) {

    const employee =
        employees.find(
            function (item) {

                return item.id === employeeId;

            }
        );


    if (!employee) {

        alert(
            "Employee record not found."
        );

        return;

    }


    editingEmployeeId =
        employeeId;


    modalTitle.textContent =
        "Edit Employee";


    // =================================================
    // FILL FORM
    // =================================================

    document.getElementById(
        "employeeId"
    ).value =
        employee.id || "";


    document.getElementById(
        "employeeName"
    ).value =
        employee.name || "";


    document.getElementById(
        "employeeEmail"
    ).value =
        employee.email || "";


    document.getElementById(
        "employeeMobile"
    ).value =
        employee.mobile || "";


    document.getElementById(
        "department"
    ).value =
        employee.department || "";


    document.getElementById(
        "designation"
    ).value =
        employee.designation || "";


    document.getElementById(
        "joiningDate"
    ).value =
        employee.joiningDate || "";


    document.getElementById(
        "employeeType"
    ).value =
        employee.employeeType || "";


    document.getElementById(
        "panNumber"
    ).value =
        employee.panNumber || "";


    document.getElementById(
        "uanNumber"
    ).value =
        employee.uanNumber || "";


    document.getElementById(
        "pfNumber"
    ).value =
        employee.pfNumber || "";


    document.getElementById(
        "bankAccount"
    ).value =
        employee.bankAccount || "";


    document.getElementById(
        "basicSalary"
    ).value =
        employee.basicSalary || "";


    document.getElementById(
        "employeeStatus"
    ).value =
        employee.status || "";


    // =================================================
    // OPEN MODAL
    // =================================================

    employeeModal.style.display =
        "flex";

}


// =========================================================
// DELETE EMPLOYEE
// =========================================================

function deleteEmployee(employeeId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this employee?"
        );


    if (!confirmDelete) {
        return;
    }


    employees =
        employees.filter(
            function (employee) {

                return employee.id !== employeeId;

            }
        );


    localStorage.setItem(
        "employees",
        JSON.stringify(employees)
    );


    displayEmployees();

}


// =========================================================
// SEARCH EMPLOYEE
// =========================================================

if (employeeSearch) {

    employeeSearch.addEventListener(
        "input",
        function () {

            const searchText =
                employeeSearch.value
                    .toLowerCase()
                    .trim();


            const filteredEmployees =
                employees.filter(
                    function (employee) {

                        return (

                            (employee.name || "")
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            (employee.id || "")
                                .toLowerCase()
                                .includes(searchText)

                        );

                    }
                );


            displayFilteredEmployees(
                filteredEmployees
            );

        }
    );

}


// =========================================================
// DISPLAY SEARCH RESULTS
// =========================================================

function displayFilteredEmployees(
    employeeList
) {

    if (!employeeTableBody) {
        return;
    }


    employeeTableBody.innerHTML = "";


    if (employeeList.length === 0) {

        employeeTableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        <div class="empty-icon">
                            🔍
                        </div>

                        <h3>
                            No Employee Found
                        </h3>

                        <p>
                            Try another name or employee ID.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    employeeList.forEach(
        function (employee) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${employee.id || "-"}
                </td>

                <td>
                    ${employee.name || "-"}
                </td>

                <td>
                    ${employee.department || "-"}
                </td>

                <td>
                    ${employee.designation || "-"}
                </td>

                <td>
                    ${employee.joiningDate || "-"}
                </td>

                <td>
                    ${employee.status || "-"}
                </td>

                <td>

                    <button
                        onclick="editEmployee('${employee.id}')"
                    >
                        Edit
                    </button>

                    <button
                        onclick="deleteEmployee('${employee.id}')"
                    >
                        Delete
                    </button>

                </td>

            `;


            employeeTableBody.appendChild(row);

        }
    );

}


// =========================================================
// PAGE LOAD
// =========================================================

displayEmployees();