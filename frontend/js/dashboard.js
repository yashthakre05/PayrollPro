// =========================================================
// PAYROLLPRO - DASHBOARD JAVASCRIPT
// Dashboard ko dynamic aur safe banane ke liye.
// =========================================================


// =========================================================
// HTML ELEMENTS
// =========================================================

const totalEmployeesElement =
    document.getElementById("totalEmployees");

const presentTodayElement =
    document.getElementById("presentToday");

const pendingPayrollElement =
    document.getElementById("pendingPayroll");

const payslipsElement =
    document.getElementById("totalPayslip");

const recentPayrollSection =
    document.querySelector(".recent-payroll");


// =========================================================
// SAFE LOCAL STORAGE READER
// =========================================================

function getStorageArray(key) {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(key)
            );

        if (!Array.isArray(data)) {
            return [];
        }

        // Null / invalid records remove
        return data.filter(function (item) {

            return (
                item &&
                typeof item === "object"
            );

        });

    } catch (error) {

        console.error(
            `Error reading ${key}:`,
            error
        );

        return [];

    }

}


// =========================================================
// GET FRESH DATA
// =========================================================

function getEmployees() {

    return getStorageArray("employees");

}


function getAttendanceRecords() {

    return getStorageArray("attendanceRecords");

}


function getPayrollRecords() {

    return getStorageArray("payrollRecords");

}


// =========================================================
// GET TODAY'S DATE
// =========================================================

function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// =========================================================
// GET CURRENT MONTH
// =========================================================

function getCurrentMonth() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    return `${year}-${month}`;

}


// =========================================================
// UPDATE TOTAL EMPLOYEES
// =========================================================

function updateTotalEmployees() {

    if (!totalEmployeesElement) {
        return;
    }


    const employees =
        getEmployees();


    totalEmployeesElement.textContent =
        employees.length;

}


// =========================================================
// UPDATE PRESENT TODAY
// =========================================================

function updatePresentToday() {

    if (!presentTodayElement) {
        return;
    }


    const attendanceRecords =
        getAttendanceRecords();


    const today =
        getTodayDate();


    // Today's Present records
    const presentToday =
        attendanceRecords.filter(
            function (record) {

                if (!record) {
                    return false;
                }


                const recordDate =
                    String(
                        record.date || ""
                    ).trim();


                const status =
                    String(
                        record.status || ""
                    ).trim().toLowerCase();


                return (
                    recordDate === today &&
                    status === "present"
                );

            }
        );


    // Same employee ki duplicate
    // attendance ko count nahi karenge
    const uniqueEmployees =
        new Set();


    presentToday.forEach(
        function (record) {

            const employeeId =
                String(
                    record.employeeId ||
                    record.id ||
                    ""
                ).trim();


            if (employeeId) {

                uniqueEmployees.add(
                    employeeId
                );

            }

        }
    );


    presentTodayElement.textContent =
        uniqueEmployees.size;

}


// =========================================================
// UPDATE PENDING PAYROLL
// =========================================================

function updatePendingPayroll() {

    if (!pendingPayrollElement) {
        return;
    }


    const employees =
        getEmployees();


    const payrollRecords =
        getPayrollRecords();


    const currentMonth =
        getCurrentMonth();


    // Current month ke processed employees
    const processedIds =
        new Set();


    payrollRecords.forEach(
        function (record) {

            if (!record) {
                return;
            }


            const recordMonth =
                String(
                    record.month || ""
                ).trim();


            if (
                recordMonth !== currentMonth
            ) {
                return;
            }


            const employeeId =
                String(
                    record.employeeId || ""
                ).trim();


            if (employeeId) {

                processedIds.add(
                    employeeId
                );

            }

        }
    );


    // Jinka current month payroll
    // abhi process nahi hua
    const pendingCount =
        employees.filter(
            function (employee) {

                if (!employee) {
                    return false;
                }


                const employeeId =
                    String(
                        employee.id ||
                        employee.employeeId ||
                        ""
                    ).trim();


                if (!employeeId) {
                    return false;
                }


                return !processedIds.has(
                    employeeId
                );

            }
        ).length;


    pendingPayrollElement.textContent =
        pendingCount;

}


// =========================================================
// UPDATE PAYSLIP COUNT
// =========================================================

function updatePayslipCount() {

    if (!payslipsElement) {
        return;
    }


    const payrollRecords =
        getPayrollRecords();


    /*
        Payroll record save hone ke baad
        uska payslip generate kiya ja sakta hai.

        Current project structure mein
        payroll records ko generated payslips
        ke count ke liye use kiya ja raha hai.
    */

    payslipsElement.textContent =
        payrollRecords.length;

}


// =========================================================
// FORMAT SALARY
// =========================================================

function formatCurrency(amount) {

    const value =
        Number(amount) || 0;


    return "₹" + value.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// =========================================================
// UPDATE RECENT PAYROLL
// =========================================================

function updateRecentPayroll() {

    if (!recentPayrollSection) {
        return;
    }


    const payrollRecords =
        getPayrollRecords();


    // ---------------------------------------------
    // Remove old dynamic table
    // ---------------------------------------------

    const oldTable =
        recentPayrollSection.querySelector(
            ".recent-payroll-table"
        );


    if (oldTable) {

        oldTable.remove();

    }


    // ---------------------------------------------
    // Empty State
    // ---------------------------------------------

    const existingEmptyState =
        recentPayrollSection.querySelector(
            ".empty-state"
        );


    if (payrollRecords.length === 0) {

        // Agar empty state already hai
        if (existingEmptyState) {

            return;

        }


        // Safety ke liye empty state create
        const emptyState =
            document.createElement("div");


        emptyState.className =
            "empty-state";


        emptyState.innerHTML = `

            <div class="empty-icon">
                📊
            </div>

            <h3>
                No Payroll Records
            </h3>

            <p>
                Payroll records will appear here
                after salary processing.
            </p>

        `;


        recentPayrollSection.appendChild(
            emptyState
        );


        return;

    }


    // ---------------------------------------------
    // Existing empty state remove
    // ---------------------------------------------

    if (existingEmptyState) {

        existingEmptyState.remove();

    }


    // ---------------------------------------------
    // Create Recent Payroll Table
    // ---------------------------------------------

    const table =
        document.createElement("table");


    table.className =
        "recent-payroll-table";


    table.innerHTML = `

        <thead>

            <tr>

                <th>Employee ID</th>

                <th>Employee</th>

                <th>Month</th>

                <th>Present</th>

                <th>Absent</th>

                <th>Net Salary</th>

            </tr>

        </thead>

        <tbody></tbody>

    `;


    const tbody =
        table.querySelector("tbody");


    // Last 5 records
    const recentRecords =
        payrollRecords
            .slice(-5)
            .reverse();


    recentRecords.forEach(
        function (record) {

            if (
                !record ||
                typeof record !== "object"
            ) {
                return;
            }


            const row =
                document.createElement("tr");


            const employeeId =
                record.employeeId || "-";


            const employeeName =
                record.employeeName || "-";


            const month =
                record.month || "-";


            const present =
                Number(
                    record.present
                ) || 0;


            const absent =
                Number(
                    record.absent
                ) || 0;


            const netSalary =
                formatCurrency(
                    record.netSalary
                );


            row.innerHTML = `

                <td>
                    ${employeeId}
                </td>

                <td>
                    ${employeeName}
                </td>

                <td>
                    ${month}
                </td>

                <td>
                    ${present}
                </td>

                <td>
                    ${absent}
                </td>

                <td>
                    ${netSalary}
                </td>

            `;


            tbody.appendChild(row);

        }
    );


    recentPayrollSection.appendChild(
        table
    );

}


// =========================================================
// VIEW ALL PAYROLL BUTTON
// =========================================================

function setupViewAllButton() {

    if (!recentPayrollSection) {
        return;
    }


    const button =
        recentPayrollSection.querySelector(
            ".section-header button"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            window.location.href =
                "payroll.html";

        }
    );

}


// =========================================================
// UPDATE DASHBOARD
// =========================================================

function updateDashboard() {

    updateTotalEmployees();

    updatePresentToday();

    updatePendingPayroll();

    updatePayslipCount();

    updateRecentPayroll();

}


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDashboard();

        setupViewAllButton();

    }
);


// =========================================================
// DEBUG
// =========================================================

console.log(
    "PayrollPro Dashboard loaded successfully."
);

console.log(
    "Employees:",
    getEmployees()
);

console.log(
    "Attendance:",
    getAttendanceRecords()
);

console.log(
    "Payroll:",
    getPayrollRecords()
);