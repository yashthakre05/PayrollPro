// =========================================================
// PAYROLLPRO - REPORTS JAVASCRIPT
// =========================================================


// =========================================================
// GET HTML ELEMENTS
// =========================================================

const reportMonth =
    document.getElementById("reportMonth");

const reportEmployee =
    document.getElementById("reportEmployee");

const generateReportButton =
    document.getElementById("generateReport");

const printReportButton =
    document.getElementById("printReport");

const reportTableBody =
    document.getElementById("reportTableBody");

const totalEmployees =
    document.getElementById("totalEmployees");

const totalPayroll =
    document.getElementById("totalPayroll");

const totalPresent =
    document.getElementById("totalPresent");

const totalAbsent =
    document.getElementById("totalAbsent");


// =========================================================
// FORMAT CURRENCY
// =========================================================

function formatCurrency(amount) {

    const value = Number(amount) || 0;

    return "₹" + value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


// =========================================================
// GET PAYROLL RECORDS
// =========================================================

function getPayrollRecords() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem("payrollRecords")
            );

        // Make sure data is an array
        if (!Array.isArray(data)) {
            return [];
        }

        // Remove invalid/null records
        return data.filter(function (record) {

            return (
                record &&
                typeof record === "object"
            );

        });

    } catch (error) {

        console.error(
            "Error reading payrollRecords:",
            error
        );

        return [];

    }

}


// =========================================================
// LOAD EMPLOYEES
// =========================================================

function loadEmployees() {

    let employees = [];

    try {

        const data =
            JSON.parse(
                localStorage.getItem("employees")
            );

        if (Array.isArray(data)) {
            employees = data;
        }

    } catch (error) {

        console.error(
            "Error reading employees:",
            error
        );

    }


    // Reset employee dropdown

    reportEmployee.innerHTML = `
        <option value="">All Employees</option>
    `;


    employees.forEach(function (employee) {

        if (
            !employee ||
            typeof employee !== "object"
        ) {
            return;
        }


        // Current Employees page uses id
        // Fallbacks are also supported

        const employeeId =
            String(
                employee.id ||
                employee.employeeId ||
                ""
            ).trim();


        const employeeName =
            String(
                employee.name ||
                employee.fullName ||
                ""
            ).trim();


        if (!employeeId) {
            return;
        }


        const option =
            document.createElement("option");


        option.value =
            employeeId;


        option.textContent =
            employeeName
                ? `${employeeName} (${employeeId})`
                : employeeId;


        reportEmployee.appendChild(option);

    });

}


// =========================================================
// SET CURRENT MONTH
// =========================================================

function setCurrentMonth() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    reportMonth.value =
        `${year}-${month}`;

}


// =========================================================
// DISPLAY REPORT
// =========================================================

function displayReport(records) {

    reportTableBody.innerHTML = "";


    // No records

    if (
        !Array.isArray(records) ||
        records.length === 0
    ) {

        reportTableBody.innerHTML = `
            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        <div class="empty-icon">
                            📊
                        </div>

                        <h3>
                            No Report Data
                        </h3>

                        <p>
                            No payroll records found
                            for the selected filters.
                        </p>

                    </div>

                </td>

            </tr>
        `;

        return;

    }


    // Display records

    records.forEach(function (record) {

        if (
            !record ||
            typeof record !== "object"
        ) {
            return;
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${record.employeeId || "-"}
            </td>

            <td>
                ${record.employeeName || "-"}
            </td>

            <td>
                ${record.month || "-"}
            </td>

            <td>
                ${Number(record.present) || 0}
            </td>

            <td>
                ${Number(record.absent) || 0}
            </td>

            <td>
                ${formatCurrency(record.basicSalary)}
            </td>

            <td>
                ${formatCurrency(record.netSalary)}
            </td>

        `;


        reportTableBody.appendChild(row);

    });

}


// =========================================================
// GENERATE REPORT
// =========================================================

function generateReport() {

    // =============================================
    // GET FILTER VALUES
    // =============================================

    const selectedMonth =
        String(
            reportMonth.value || ""
        ).trim();


    const selectedEmployee =
        String(
            reportEmployee.value || ""
        ).trim();


    // =============================================
    // GET FRESH PAYROLL DATA
    // =============================================

    const payrollRecords =
        getPayrollRecords();


    console.log(
        "========== REPORT DEBUG =========="
    );

    console.log(
        "Selected Month:",
        selectedMonth
    );

    console.log(
        "Selected Employee:",
        selectedEmployee || "All Employees"
    );

    console.log(
        "Payroll Records:",
        payrollRecords
    );


    // =============================================
    // FILTER RECORDS
    // =============================================

    const filteredRecords =
        payrollRecords.filter(function (record) {

            if (
                !record ||
                typeof record !== "object"
            ) {
                return false;
            }


            const recordMonth =
                String(
                    record.month || ""
                ).trim();


            const recordEmployeeId =
                String(
                    record.employeeId || ""
                ).trim();


            // -----------------------------------------
            // MONTH FILTER
            // -----------------------------------------

            if (
                selectedMonth &&
                recordMonth !== selectedMonth
            ) {

                return false;

            }


            // -----------------------------------------
            // EMPLOYEE FILTER
            // -----------------------------------------

            if (
                selectedEmployee &&
                recordEmployeeId !== selectedEmployee
            ) {

                return false;

            }


            return true;

        });


    console.log(
        "Filtered Records:",
        filteredRecords
    );


    // =============================================
    // CALCULATE SUMMARY
    // =============================================

    let payrollAmount = 0;

    let presentDays = 0;

    let absentDays = 0;


    filteredRecords.forEach(function (record) {

        payrollAmount +=
            Number(
                record.netSalary
            ) || 0;


        presentDays +=
            Number(
                record.present
            ) || 0;


        absentDays +=
            Number(
                record.absent
            ) || 0;

    });


    // =============================================
    // COUNT UNIQUE EMPLOYEES
    // =============================================

    const employeeIds =
        new Set();


    filteredRecords.forEach(function (record) {

        const employeeId =
            String(
                record.employeeId || ""
            ).trim();


        if (employeeId) {

            employeeIds.add(
                employeeId
            );

        }

    });


    // =============================================
    // UPDATE SUMMARY
    // =============================================

    totalEmployees.textContent =
        employeeIds.size;


    totalPayroll.textContent =
        formatCurrency(
            payrollAmount
        );


    totalPresent.textContent =
        presentDays;


    totalAbsent.textContent =
        absentDays;


    // =============================================
    // DISPLAY REPORT TABLE
    // =============================================

    displayReport(
        filteredRecords
    );

}


// =========================================================
// PRINT REPORT
// =========================================================

function printReport() {

    const payrollRecords =
        getPayrollRecords();


    if (
        payrollRecords.length === 0
    ) {

        alert(
            "No payroll records available to print."
        );

        return;

    }


    window.print();

}


// =========================================================
// BUTTON EVENTS
// =========================================================

generateReportButton.addEventListener(
    "click",
    generateReport
);


printReportButton.addEventListener(
    "click",
    printReport
);


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadEmployees();

        setCurrentMonth();

    }
);


// =========================================================
// DEBUG
// =========================================================

console.log(
    "REPORTS JS LOADED SUCCESSFULLY"
);

console.log(
    "Payroll Records:",
    getPayrollRecords()
);