// =========================================================
// PAYROLLPRO - SALARY STRUCTURE JAVASCRIPT
// Employee salary components ko manage karega.
// =========================================================


// =========================================================
// HTML ELEMENTS
// =========================================================

const salaryEmployee =
    document.getElementById("salaryEmployee");

const salaryForm =
    document.getElementById("salaryForm");

const salaryTableBody =
    document.getElementById("salaryTableBody");

const summaryBasic =
    document.getElementById("summaryBasic");

const summaryAllowance =
    document.getElementById("summaryAllowance");

const summaryDeduction =
    document.getElementById("summaryDeduction");

const summaryNet =
    document.getElementById("summaryNet");


// =========================================================
// EMPLOYEE DATA
// Employees page se saved employees read kar rahe hain.
// =========================================================

const employees =
    JSON.parse(localStorage.getItem("employees")) || [];


// =========================================================
// SALARY DATA
// Pehle se saved salary structures read karenge.
// =========================================================

let salaryStructures =
    JSON.parse(localStorage.getItem("salaryStructures")) || [];


// =========================================================
// EDIT MODE
// =========================================================

let editingSalaryIndex = -1;


// =========================================================
// LOAD EMPLOYEES
// Employee dropdown ko fill karega.
// =========================================================

function loadEmployees() {

    salaryEmployee.innerHTML = `
        <option value="">
            Select Employee
        </option>
    `;


    employees.forEach(function (employee) {

        const option =
            document.createElement("option");

        option.value =
            employee.id;

        option.textContent =
            employee.name +
            " (" +
            employee.id +
            ")";

        salaryEmployee.appendChild(option);

    });

}


// =========================================================
// GET FORM BUTTON
// Existing Save button ko hi use karenge.
// =========================================================

const salarySubmitButton =
    salaryForm.querySelector(
        'button[type="submit"]'
    );


// =========================================================
// CREATE CANCEL EDIT BUTTON
// Design change nahi hoga.
// Sirf edit mode me button show hoga.
// =========================================================

let cancelEditButton = null;


function createCancelEditButton() {

    if (cancelEditButton) {

        return;

    }


    cancelEditButton =
        document.createElement("button");


    cancelEditButton.type =
        "button";


    cancelEditButton.textContent =
        "Cancel Edit";


    // Existing save button ke baad add hoga
    if (salarySubmitButton) {

        salarySubmitButton.parentNode.appendChild(
            cancelEditButton
        );

    }


    cancelEditButton.addEventListener(
        "click",
        function () {

            cancelSalaryEdit();

        }
    );

}


// =========================================================
// SAVE / UPDATE SALARY STRUCTURE
// =========================================================

salaryForm.addEventListener(
    "submit",
    function (event) {

        // Page reload prevent
        event.preventDefault();


        // =====================================================
        // FORM DATA
        // =====================================================

        const employeeId =
            salaryEmployee.value;


        const basicSalary =
            Number(
                document.getElementById(
                    "basicSalary"
                ).value
            ) || 0;


        const hra =
            Number(
                document.getElementById(
                    "hra"
                ).value
            ) || 0;


        const allowance =
            Number(
                document.getElementById(
                    "allowance"
                ).value
            ) || 0;


        const pf =
            Number(
                document.getElementById(
                    "pf"
                ).value
            ) || 0;


        const otherDeduction =
            Number(
                document.getElementById(
                    "otherDeduction"
                ).value
            ) || 0;


        // =====================================================
        // VALIDATION
        // =====================================================

        if (employeeId === "") {

            alert(
                "Please select an employee."
            );

            return;

        }


        // =====================================================
        // EMPLOYEE FIND
        // =====================================================

        const employee =
            employees.find(
                function (item) {

                    return (
                        item.id ===
                        employeeId
                    );

                }
            );


        if (!employee) {

            alert(
                "Employee not found."
            );

            return;

        }


        // =====================================================
        // SALARY CALCULATION
        // =====================================================

        const totalAllowance =
            hra + allowance;


        const totalDeduction =
            pf + otherDeduction;


        const netSalary =
            basicSalary +
            totalAllowance -
            totalDeduction;


        // =====================================================
        // SALARY OBJECT
        // =====================================================

        const salary = {

            employeeId:
                employee.id,

            employeeName:
                employee.name,

            basicSalary:
                basicSalary,

            hra:
                hra,

            allowance:
                allowance,

            totalAllowance:
                totalAllowance,

            pf:
                pf,

            otherDeduction:
                otherDeduction,

            totalDeduction:
                totalDeduction,

            netSalary:
                netSalary

        };


        // =====================================================
        // UPDATE EXISTING SALARY
        // =====================================================

        if (
            editingSalaryIndex !== -1
        ) {

            salaryStructures[
                editingSalaryIndex
            ] = salary;


            localStorage.setItem(
                "salaryStructures",
                JSON.stringify(
                    salaryStructures
                )
            );


            updateSummary(salary);

            displaySalaryStructures();

            salaryForm.reset();

            editingSalaryIndex = -1;


            if (salarySubmitButton) {

                salarySubmitButton.textContent =
                    "Save Salary Structure";

            }


            if (cancelEditButton) {

                cancelEditButton.remove();

                cancelEditButton = null;

            }


            alert(
                "Salary structure updated successfully!"
            );


            return;

        }


        // =====================================================
        // CHECK DUPLICATE EMPLOYEE
        // =====================================================

        const alreadyExists =
            salaryStructures.some(
                function (item) {

                    return (
                        item &&
                        item.employeeId ===
                        employeeId
                    );

                }
            );


        if (alreadyExists) {

            alert(
                "Salary structure already exists for this employee. Please edit the existing structure."
            );

            return;

        }


        // =====================================================
        // SAVE NEW DATA
        // =====================================================

        salaryStructures.push(
            salary
        );


        localStorage.setItem(
            "salaryStructures",
            JSON.stringify(
                salaryStructures
            )
        );


        // =====================================================
        // UPDATE PAGE
        // =====================================================

        updateSummary(salary);

        displaySalaryStructures();


        // Form reset
        salaryForm.reset();


        // Success message
        alert(
            "Salary structure saved successfully!"
        );

    }
);


// =========================================================
// EDIT SALARY STRUCTURE
// =========================================================

function editSalary(index) {

    const salary =
        salaryStructures[index];


    if (!salary) {

        return;

    }


    // =====================================================
    // SET EDIT MODE
    // =====================================================

    editingSalaryIndex =
        index;


    // =====================================================
    // LOAD DATA INTO FORM
    // =====================================================

    salaryEmployee.value =
        salary.employeeId || "";


    document.getElementById(
        "basicSalary"
    ).value =
        salary.basicSalary || 0;


    document.getElementById(
        "hra"
    ).value =
        salary.hra || 0;


    document.getElementById(
        "allowance"
    ).value =
        salary.allowance || 0;


    document.getElementById(
        "pf"
    ).value =
        salary.pf || 0;


    document.getElementById(
        "otherDeduction"
    ).value =
        salary.otherDeduction || 0;


    // =====================================================
    // UPDATE BUTTON TEXT
    // =====================================================

    if (salarySubmitButton) {

        salarySubmitButton.textContent =
            "Update Salary Structure";

    }


    // =====================================================
    // ADD CANCEL BUTTON
    // =====================================================

    createCancelEditButton();


    // =====================================================
    // UPDATE SUMMARY
    // =====================================================

    updateSummary(salary);


    // Form ke paas le jao
    salaryForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// =========================================================
// CANCEL SALARY EDIT
// =========================================================

function cancelSalaryEdit() {

    editingSalaryIndex =
        -1;


    salaryForm.reset();


    if (salarySubmitButton) {

        salarySubmitButton.textContent =
            "Save Salary Structure";

    }


    if (cancelEditButton) {

        cancelEditButton.remove();

        cancelEditButton = null;

    }

}


// =========================================================
// UPDATE SUMMARY
// =========================================================

function updateSummary(salary) {

    summaryBasic.textContent =
        "₹" +
        Number(
            salary.basicSalary || 0
        ).toLocaleString("en-IN");


    summaryAllowance.textContent =
        "₹" +
        Number(
            salary.totalAllowance || 0
        ).toLocaleString("en-IN");


    summaryDeduction.textContent =
        "₹" +
        Number(
            salary.totalDeduction || 0
        ).toLocaleString("en-IN");


    summaryNet.textContent =
        "₹" +
        Number(
            salary.netSalary || 0
        ).toLocaleString("en-IN");

}


// =========================================================
// DISPLAY SALARY STRUCTURES
// =========================================================

function displaySalaryStructures() {

    salaryTableBody.innerHTML = "";


    // Agar koi salary structure nahi hai
    if (salaryStructures.length === 0) {

        salaryTableBody.innerHTML = `
            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        <div class="empty-icon">
                            💰
                        </div>

                        <h3>
                            No Salary Structure Found
                        </h3>

                        <p>
                            Add salary details
                            to get started.
                        </p>

                    </div>

                </td>

            </tr>
        `;

        return;

    }


    // =====================================================
    // TABLE RECORDS
    // =====================================================

    salaryStructures.forEach(
        function (salary, index) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${salary.employeeId}
                </td>

                <td>
                    ${salary.employeeName}
                </td>

                <td>
                    ₹${Number(
                        salary.basicSalary || 0
                    ).toLocaleString("en-IN")}
                </td>

                <td>
                    ₹${Number(
                        salary.totalAllowance || 0
                    ).toLocaleString("en-IN")}
                </td>

                <td>
                    ₹${Number(
                        salary.totalDeduction || 0
                    ).toLocaleString("en-IN")}
                </td>

                <td>
                    ₹${Number(
                        salary.netSalary || 0
                    ).toLocaleString("en-IN")}
                </td>

                <td>

                    <button
                        onclick="editSalary(${index})"
                    >
                        Edit
                    </button>

                    <button
                        onclick="deleteSalary(${index})"
                    >
                        Delete
                    </button>

                </td>

            `;


            salaryTableBody.appendChild(
                row
            );

        }
    );

}


// =========================================================
// DELETE SALARY STRUCTURE
// =========================================================

function deleteSalary(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this salary structure?"
        );


    if (!confirmDelete) {

        return;

    }


    salaryStructures.splice(
        index,
        1
    );


    localStorage.setItem(
        "salaryStructures",
        JSON.stringify(
            salaryStructures
        )
    );


    // Agar deleted record edit mode me tha
    if (
        editingSalaryIndex === index
    ) {

        cancelSalaryEdit();

    }

    else if (
        editingSalaryIndex > index
    ) {

        editingSalaryIndex--;

    }


    displaySalaryStructures();

}


// =========================================================
// PAGE LOAD
// =========================================================

loadEmployees();

displaySalaryStructures();