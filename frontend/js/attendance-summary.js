// =========================================================
// PAYROLLPRO - ATTENDANCE SUMMARY JAVASCRIPT
// Monthly attendance summary yahan handle hogi.
// =========================================================


// =========================================================
// HTML ELEMENTS
// =========================================================

const summaryEmployee =
    document.getElementById("summaryEmployee");

const summaryMonth =
    document.getElementById("summaryMonth");

const viewSummaryButton =
    document.getElementById("viewSummary");

const workingDays =
    document.getElementById("workingDays");

const summaryPresent =
    document.getElementById("summaryPresent");

const summaryAbsent =
    document.getElementById("summaryAbsent");

const summaryHalfDay =
    document.getElementById("summaryHalfDay");

const summaryTableBody =
    document.getElementById("summaryTableBody");


// =========================================================
// DATA
// Employees aur attendance localStorage se read karenge.
// =========================================================

const employees =
    JSON.parse(localStorage.getItem("employees")) || [];

const attendanceRecords =
    JSON.parse(localStorage.getItem("attendanceRecords")) || [];


// =========================================================
// LOAD EMPLOYEES
// Employee dropdown automatically fill hoga.
// =========================================================

function loadEmployees() {

    summaryEmployee.innerHTML = `
        <option value="">
            Select Employee
        </option>
    `;


    employees.forEach(function (employee) {

        const option = document.createElement("option");

        option.value = employee.id;

        option.textContent =
            employee.name + " (" + employee.id + ")";

        summaryEmployee.appendChild(option);

    });

}


// =========================================================
// VIEW SUMMARY
// Button click hone par monthly summary calculate hogi.
// =========================================================

viewSummaryButton.addEventListener("click", function () {

    const employeeId = summaryEmployee.value;

    const month = summaryMonth.value;


    // =====================================================
    // VALIDATION
    // =====================================================

    if (employeeId === "") {

        alert("Please select an employee.");

        return;

    }


    if (month === "") {

        alert("Please select a month.");

        return;

    }


    // =====================================================
    // SELECTED MONTH KE RECORDS
    // =====================================================

    const filteredRecords =
        attendanceRecords.filter(function (record) {

            return (
                record.employeeId === employeeId &&
                record.date.startsWith(month)
            );

        });


    // =====================================================
    // ATTENDANCE COUNT
    // =====================================================

    const present =
        filteredRecords.filter(function (record) {

            return record.status === "Present";

        }).length;


    const absent =
        filteredRecords.filter(function (record) {

            return record.status === "Absent";

        }).length;


    const halfDay =
        filteredRecords.filter(function (record) {

            return record.status === "Half Day";

        }).length;


    const holiday =
        filteredRecords.filter(function (record) {

            return record.status === "Holiday";

        }).length;


    // =====================================================
    // WORKING DAYS
    // Holiday ko working day mein count nahi karenge.
    // =====================================================

    const totalWorkingDays =
        filteredRecords.filter(function (record) {

            return record.status !== "Holiday";

        }).length;


    // =====================================================
    // SUMMARY CARDS UPDATE
    // =====================================================

    workingDays.textContent = totalWorkingDays;

    summaryPresent.textContent = present;

    summaryAbsent.textContent = absent;

    summaryHalfDay.textContent = halfDay;


    // =====================================================
    // TABLE DISPLAY
    // =====================================================

    displaySummary(filteredRecords);

});


// =========================================================
// DISPLAY SUMMARY
// Monthly attendance table mein records show karega.
// =========================================================

function displaySummary(records) {

    summaryTableBody.innerHTML = "";


    // Agar record nahi mila
    if (records.length === 0) {

        summaryTableBody.innerHTML = `
            <tr>

                <td colspan="3">

                    <div class="empty-state">

                        <div class="empty-icon">
                            🔍
                        </div>

                        <h3>
                            No Attendance Found
                        </h3>

                        <p>
                            No attendance record found
                            for this month.
                        </p>

                    </div>

                </td>

            </tr>
        `;

        return;

    }


    // =====================================================
    // RECORDS TABLE MEIN ADD KARNA
    // =====================================================

    records.forEach(function (record) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                ${record.date}
            </td>

            <td>
                ${record.employeeName}
            </td>

            <td>
                ${record.status}
            </td>

        `;


        summaryTableBody.appendChild(row);

    });

}


// =========================================================
// PAGE LOAD
// =========================================================

loadEmployees();