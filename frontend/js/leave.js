// =========================================================
// PAYROLLPRO - LEAVE JAVASCRIPT
// Employee leave add, display, edit aur delete.
// =========================================================


// =========================================================
// HTML ELEMENTS
// =========================================================

const leaveForm =
    document.getElementById("leaveForm");

const leaveEmployee =
    document.getElementById("leaveEmployee");

const leaveType =
    document.getElementById("leaveType");

const leaveStart =
    document.getElementById("leaveStart");

const leaveEnd =
    document.getElementById("leaveEnd");

const leaveReason =
    document.getElementById("leaveReason");

const leaveTableBody =
    document.getElementById("leaveTableBody");

const leaveCount =
    document.getElementById("leaveCount");


// =========================================================
// LOAD DATA
// =========================================================

// Employees localStorage se read karna

const employees =
    JSON.parse(localStorage.getItem("employees")) || [];


// Leave records localStorage se read karna

let leaveRecords =
    JSON.parse(localStorage.getItem("leaveRecords")) || [];


// =========================================================
// EDIT MODE
// =========================================================

// Is variable me currently edit ho raha leave ID store hoga

let editingLeaveId = null;


// =========================================================
// CREATE CANCEL EDIT BUTTON
// =========================================================

const cancelEditButton =
    document.createElement("button");

cancelEditButton.type =
    "button";

cancelEditButton.className =
    "save-button";

cancelEditButton.textContent =
    "Cancel Edit";

cancelEditButton.style.display =
    "none";

cancelEditButton.style.marginLeft =
    "10px";


// Save button ke baad Cancel button add karna

leaveForm.querySelector(".save-button")
    .insertAdjacentElement(
        "afterend",
        cancelEditButton
    );


// =========================================================
// LOAD EMPLOYEES
// =========================================================

function loadEmployees() {

    leaveEmployee.innerHTML = `
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


        leaveEmployee.appendChild(option);

    });

}


// =========================================================
// CALCULATE LEAVE DAYS
// =========================================================

function calculateDays(startDate, endDate) {

    const start =
        new Date(startDate);

    const end =
        new Date(endDate);


    const difference =
        end - start;


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        ) + 1;


    return days;

}


// =========================================================
// SAVE / UPDATE LEAVE
// =========================================================

leaveForm.addEventListener(
    "submit",
    function (event) {

        // Default form submit stop

        event.preventDefault();


        const employeeId =
            leaveEmployee.value;


        const type =
            leaveType.value;


        const startDate =
            leaveStart.value;


        const endDate =
            leaveEnd.value;


        const reason =
            leaveReason.value.trim();


        // =================================================
        // VALIDATION
        // =================================================

        if (employeeId === "") {

            alert(
                "Please select an employee."
            );

            return;

        }


        if (type === "") {

            alert(
                "Please select leave type."
            );

            return;

        }


        if (
            startDate === "" ||
            endDate === ""
        ) {

            alert(
                "Please select leave dates."
            );

            return;

        }


        // End date start date se pehle nahi ho sakti

        if (endDate < startDate) {

            alert(
                "End date cannot be before start date."
            );

            return;

        }


        // =================================================
        // FIND EMPLOYEE
        // =================================================

        const employee =
            employees.find(
                function (item) {

                    return item.id === employeeId;

                }
            );


        if (!employee) {

            alert(
                "Employee not found."
            );

            return;

        }


        // =================================================
        // CALCULATE DAYS
        // =================================================

        const days =
            calculateDays(
                startDate,
                endDate
            );


        // =================================================
        // UPDATE EXISTING LEAVE
        // =================================================

        if (editingLeaveId !== null) {

            const leaveIndex =
                leaveRecords.findIndex(
                    function (leave) {

                        return leave.id === editingLeaveId;

                    }
                );


            if (leaveIndex === -1) {

                alert(
                    "Leave record not found."
                );

                cancelEdit();

                return;

            }


            // Existing record update

            leaveRecords[leaveIndex] = {

                ...leaveRecords[leaveIndex],

                employeeId:
                    employee.id,

                employeeName:
                    employee.name,

                leaveType:
                    type,

                startDate:
                    startDate,

                endDate:
                    endDate,

                days:
                    days,

                reason:
                    reason

            };


            // Save updated records

            localStorage.setItem(
                "leaveRecords",
                JSON.stringify(leaveRecords)
            );


            // Table refresh

            displayLeaves();


            // Exit edit mode

            cancelEdit();


            alert(
                "Leave updated successfully!"
            );


            return;

        }


        // =================================================
        // CREATE NEW LEAVE RECORD
        // =================================================

        const leave = {

            id:
                Date.now(),

            employeeId:
                employee.id,

            employeeName:
                employee.name,

            leaveType:
                type,

            startDate:
                startDate,

            endDate:
                endDate,

            days:
                days,

            reason:
                reason

        };


        // =================================================
        // ADD TO ARRAY
        // =================================================

        leaveRecords.push(leave);


        // =================================================
        // SAVE TO LOCAL STORAGE
        // =================================================

        localStorage.setItem(
            "leaveRecords",
            JSON.stringify(leaveRecords)
        );


        // =================================================
        // UPDATE TABLE
        // =================================================

        displayLeaves();


        // =================================================
        // RESET FORM
        // =================================================

        leaveForm.reset();


        alert(
            "Leave saved successfully!"
        );

    }
);


// =========================================================
// DISPLAY LEAVE RECORDS
// =========================================================

function displayLeaves() {

    // Table clear

    leaveTableBody.innerHTML = "";


    // No records

    if (leaveRecords.length === 0) {

        leaveTableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        <div class="empty-icon">
                            🏖️
                        </div>

                        <h3>
                            No Leave Records
                        </h3>

                        <p>
                            Apply leave to create
                            your first record.
                        </p>

                    </div>

                </td>

            </tr>

        `;


        leaveCount.textContent =
            "0 Records";


        return;

    }


    // =================================================
    // ADD RECORDS
    // =================================================

    leaveRecords.forEach(
        function (leave) {

            // Invalid/null record protection

            if (!leave) {
                return;
            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${leave.employeeName || "-"}
                    (${leave.employeeId || "-"})
                </td>

                <td>
                    ${leave.leaveType || "-"}
                </td>

                <td>
                    ${leave.startDate || "-"}
                </td>

                <td>
                    ${leave.endDate || "-"}
                </td>

                <td>
                    ${leave.days || 0}
                </td>

                <td>
                    ${leave.reason || "-"}
                </td>

                <td>

                    <button
                        class="edit-button"
                        onclick="editLeave(${leave.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteLeave(${leave.id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            leaveTableBody.appendChild(row);

        }
    );


    // Update count

    leaveCount.textContent =
        leaveRecords.length +
        " Records";

}


// =========================================================
// EDIT LEAVE
// =========================================================

function editLeave(leaveId) {

    const leave =
        leaveRecords.find(
            function (item) {

                return item &&
                    item.id === leaveId;

            }
        );


    if (!leave) {

        alert(
            "Leave record not found."
        );

        return;

    }


    // =================================================
    // FORM ME EXISTING DATA LOAD
    // =================================================

    leaveEmployee.value =
        leave.employeeId || "";


    leaveType.value =
        leave.leaveType || "";


    leaveStart.value =
        leave.startDate || "";


    leaveEnd.value =
        leave.endDate || "";


    leaveReason.value =
        leave.reason || "";


    // =================================================
    // ENABLE EDIT MODE
    // =================================================

    editingLeaveId =
        leaveId;


    // Save button text change

    const saveButton =
        leaveForm.querySelector(".save-button");

    saveButton.textContent =
        "🔄 Update Leave";


    // Cancel button show

    cancelEditButton.style.display =
        "inline-block";


    // Form ke top par scroll

    leaveForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// =========================================================
// CANCEL EDIT
// =========================================================

function cancelEdit() {

    // Edit mode remove

    editingLeaveId =
        null;


    // Form reset

    leaveForm.reset();


    // Save button original text

    const saveButton =
        leaveForm.querySelector(".save-button");

    saveButton.textContent =
        "💾 Save Leave";


    // Cancel button hide

    cancelEditButton.style.display =
        "none";

}


// =========================================================
// DELETE LEAVE
// =========================================================

function deleteLeave(leaveId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this leave record?"
        );


    if (!confirmDelete) {

        return;

    }


    // Leave remove

    leaveRecords =
        leaveRecords.filter(
            function (leave) {

                return leave &&
                    leave.id !== leaveId;

            }
        );


    // Updated data save

    localStorage.setItem(
        "leaveRecords",
        JSON.stringify(leaveRecords)
    );


    // Agar delete kiya hua record edit mode me tha

    if (editingLeaveId === leaveId) {

        cancelEdit();

    }


    // Table refresh

    displayLeaves();

}


// =========================================================
// PAGE LOAD
// =========================================================

loadEmployees();

displayLeaves();