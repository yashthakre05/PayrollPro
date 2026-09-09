// =========================================================
// PAYROLLPRO - PAYROLL JAVASCRIPT
// Monthly payroll calculate aur save karne ke liye.
// =========================================================


// =========================================================
// HTML ELEMENTS
// =========================================================

const payrollEmployee =
    document.getElementById("payrollEmployee");

const payrollMonth =
    document.getElementById("payrollMonth");

const calculatePayrollButton =
    document.getElementById("calculatePayroll");

const savePayrollButton =
    document.getElementById("savePayroll");


// Attendance

const payrollPresent =
    document.getElementById("payrollPresent");

const payrollAbsent =
    document.getElementById("payrollAbsent");

const payrollHalfDay =
    document.getElementById("payrollHalfDay");

const payrollHoliday =
    document.getElementById("payrollHoliday");


// Salary

const payrollBasic =
    document.getElementById("payrollBasic");

const payrollAllowance =
    document.getElementById("payrollAllowance");

const payrollDeduction =
    document.getElementById("payrollDeduction");

const absentDeduction =
    document.getElementById("absentDeduction");

const payrollNet =
    document.getElementById("payrollNet");


// Payroll table

const payrollTableBody =
    document.getElementById("payrollTableBody");


// =========================================================
// CURRENT PAYROLL
// =========================================================

let currentPayroll = null;


// =========================================================
// FORMAT CURRENCY
// =========================================================

function formatCurrency(amount) {

    const value =
        Number(amount) || 0;

    return (
        "₹" +
        value.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    );

}


// =========================================================
// GET LOCAL STORAGE ARRAY
// =========================================================

function getStorageArray(key) {

    try {

        const data =
            localStorage.getItem(key);

        if (!data) {

            return [];

        }


        const parsed =
            JSON.parse(data);


        if (!Array.isArray(parsed)) {

            return [];

        }


        return parsed;

    }

    catch (error) {

        console.error(
            "Storage Error:",
            key,
            error
        );

        return [];

    }

}


// =========================================================
// LOAD EMPLOYEES
// =========================================================

function loadEmployees() {

    if (!payrollEmployee) {

        return;

    }


    const employees =
        getStorageArray(
            "employees"
        );


    payrollEmployee.innerHTML = "";


    const defaultOption =
        document.createElement(
            "option"
        );

    defaultOption.value = "";

    defaultOption.textContent =
        "Select Employee";

    payrollEmployee.appendChild(
        defaultOption
    );


    if (employees.length === 0) {

        const noEmployeeOption =
            document.createElement(
                "option"
            );

        noEmployeeOption.value = "";

        noEmployeeOption.textContent =
            "No Employees Found";

        noEmployeeOption.disabled = true;

        payrollEmployee.appendChild(
            noEmployeeOption
        );

        return;

    }


    employees.forEach(
        function (employee) {

            if (
                !employee ||
                typeof employee !== "object"
            ) {

                return;

            }


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
                    "Employee"
                ).trim();


            if (!employeeId) {

                return;

            }


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                employeeId;


            option.textContent =
                employeeName +
                " (" +
                employeeId +
                ")";


            payrollEmployee.appendChild(
                option
            );

        }
    );

}


// =========================================================
// SET CURRENT MONTH
// =========================================================

function setCurrentMonth() {

    if (!payrollMonth) {

        return;

    }


    if (payrollMonth.value) {

        return;

    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    payrollMonth.value =
        year + "-" + month;

}


// =========================================================
// FIND EMPLOYEE
// =========================================================

function findEmployee(employeeId) {

    const employees =
        getStorageArray(
            "employees"
        );


    return employees.find(
        function (employee) {

            if (
                !employee ||
                typeof employee !== "object"
            ) {

                return false;

            }


            const id =
                String(
                    employee.id ||
                    employee.employeeId ||
                    ""
                ).trim();


            return (
                id === employeeId
            );

        }
    );

}


// =========================================================
// FIND SALARY STRUCTURE
// =========================================================

function findSalaryStructure(
    employeeId
) {

    const salaryStructures =
        getStorageArray(
            "salaryStructures"
        );


    return salaryStructures.find(
        function (salary) {

            if (
                !salary ||
                typeof salary !== "object"
            ) {

                return false;

            }


            const id =
                String(
                    salary.employeeId ||
                    salary.id ||
                    ""
                ).trim();


            return (
                id === employeeId
            );

        }
    );

}


// =========================================================
// GET EMPLOYEE ATTENDANCE
// =========================================================

function getEmployeeAttendance(
    employeeId,
    month
) {

    const attendanceRecords =
        getStorageArray(
            "attendanceRecords"
        );


    return attendanceRecords.filter(
        function (record) {

            if (
                !record ||
                typeof record !== "object"
            ) {

                return false;

            }


            const recordEmployeeId =
                String(
                    record.employeeId ||
                    ""
                ).trim();


            const recordDate =
                String(
                    record.date ||
                    ""
                ).trim();


            return (

                recordEmployeeId ===
                employeeId

                &&

                recordDate.startsWith(
                    month
                )

            );

        }
    );

}


// =========================================================
// GET COMPANY HOLIDAYS FOR MONTH
// =========================================================
// Holidays page se save kiye gaye holidays
// "holidays" localStorage me stored hote hain.
//
// Example:
// {
//     id: 123,
//     name: "Independence Day",
//     date: "2026-08-15",
//     type: "National Holiday",
//     description: "..."
// }
//
// Payroll me selected month ke company holidays
// automatically paid days me count honge.
// =========================================================

function getCompanyHolidays(month) {

    const holidays =
        getStorageArray(
            "holidays"
        );


    return holidays.filter(
        function (holiday) {

            if (
                !holiday ||
                typeof holiday !== "object"
            ) {

                return false;

            }


            const holidayDate =
                String(
                    holiday.date ||
                    ""
                ).trim();


            return (
                holidayDate.startsWith(
                    month
                )
            );

        }
    );

}


// =========================================================
// CHECK COMPANY HOLIDAY DATE
// =========================================================

function isCompanyHoliday(
    date,
    companyHolidayDates
) {

    return companyHolidayDates.includes(
        date
    );

}


// =========================================================
// CALCULATE PAYROLL
// =========================================================

if (calculatePayrollButton) {

    calculatePayrollButton.addEventListener(
        "click",
        function () {

            // -------------------------------------------------
            // Employee
            // -------------------------------------------------

            const employeeId =
                String(
                    payrollEmployee.value ||
                    ""
                ).trim();


            // -------------------------------------------------
            // Month
            // -------------------------------------------------

            const month =
                String(
                    payrollMonth.value ||
                    ""
                ).trim();


            // -------------------------------------------------
            // Validation
            // -------------------------------------------------

            if (!employeeId) {

                alert(
                    "Please select an employee."
                );

                return;

            }


            if (!month) {

                alert(
                    "Please select a salary month."
                );

                return;

            }


            // -------------------------------------------------
            // Find Employee
            // -------------------------------------------------

            const employee =
                findEmployee(
                    employeeId
                );


            if (!employee) {

                alert(
                    "Employee not found."
                );

                return;

            }


            // -------------------------------------------------
            // Find Salary Structure
            // -------------------------------------------------

            const salary =
                findSalaryStructure(
                    employeeId
                );


            if (!salary) {

                alert(
                    "Salary structure not found for this employee."
                );

                return;

            }


            // -------------------------------------------------
            // Salary Values
            // -------------------------------------------------

            const basicSalary =
                Number(
                    salary.basicSalary
                ) || 0;


            const totalAllowance =
                Number(
                    salary.totalAllowance
                ) || 0;


            const totalDeduction =
                Number(
                    salary.totalDeduction
                ) || 0;


            // -------------------------------------------------
            // Attendance
            // -------------------------------------------------

            const employeeAttendance =
                getEmployeeAttendance(
                    employeeId,
                    month
                );


            // -------------------------------------------------
            // COMPANY HOLIDAYS
            // -------------------------------------------------
            // Holidays page par jo holidays add kiye gaye hain,
            // unki dates yahan automatically mil jayengi.
            // -------------------------------------------------

            const companyHolidays =
                getCompanyHolidays(
                    month
                );


            const companyHolidayDates =
                companyHolidays
                    .map(
                        function (holiday) {

                            return String(
                                holiday.date ||
                                ""
                            ).trim();

                        }
                    )
                    .filter(
                        function (date) {

                            return date !== "";

                        }
                    );


            // -------------------------------------------------
            // Attendance Count
            // -------------------------------------------------

            let present = 0;

            let absent = 0;

            let halfDay = 0;

            let holiday = 0;


            employeeAttendance.forEach(
                function (record) {

                    const status =
                        String(
                            record.status ||
                            ""
                        ).trim();


                    const recordDate =
                        String(
                            record.date ||
                            ""
                        ).trim();


                    // -----------------------------------------
                    // Company Holiday
                    // -----------------------------------------
                    // Agar attendance me Absent/Half Day hai
                    // lekin date company holiday hai,
                    // to company holiday ko paid maana jayega.
                    // -----------------------------------------

                    const isHoliday =
                        isCompanyHoliday(
                            recordDate,
                            companyHolidayDates
                        );


                    if (status === "Present") {

                        present++;

                    }

                    else if (
                        status === "Holiday"
                    ) {

                        holiday++;

                    }

                    else if (
                        status === "Absent"
                    ) {

                        if (isHoliday) {

                            // Company holiday par Absent
                            // hone par bhi paid holiday.
                            holiday++;

                        }

                        else {

                            absent++;

                        }

                    }

                    else if (
                        status === "Half Day"
                    ) {

                        if (isHoliday) {

                            // Company holiday par Half Day
                            // hone par full holiday payment.
                            holiday++;

                        }

                        else {

                            halfDay++;

                        }

                    }

                }
            );


            // -------------------------------------------------
            // AUTOMATIC COMPANY HOLIDAY PAYMENT
            // -------------------------------------------------
            // Agar Holidays page par holiday add hai aur
            // attendance me us date ka koi record nahi hai,
            // to automatically 1 paid day count hoga.
            //
            // Agar attendance me already "Holiday" hai,
            // to dobara count nahi hoga.
            //
            // Agar Present hai, to Present already 1 paid day hai.
            // Agar Absent/Half Day hai, upar usko Holiday me
            // convert kar diya gaya hai.
            // -------------------------------------------------

            let automaticHolidayCount = 0;


            companyHolidayDates.forEach(
                function (holidayDate) {

                    const attendanceForDate =
                        employeeAttendance.find(
                            function (record) {

                                return (
                                    String(
                                        record.date ||
                                        ""
                                    ).trim() ===
                                    holidayDate
                                );

                            }
                        );


                    // Attendance nahi hai
                    // => automatic paid holiday

                    if (!attendanceForDate) {

                        automaticHolidayCount++;

                    }

                }
            );


            // -------------------------------------------------
            // TOTAL PAID HOLIDAYS
            // -------------------------------------------------

            const totalPaidHoliday =
                holiday +
                automaticHolidayCount;


            // -------------------------------------------------
            // Paid Days
            //
            // Present = 1
            // Company Holiday = 1
            // Half Day = 0.5
            // Absent = 0
            //
            // Company Holiday automatically paid hai.
            // -------------------------------------------------

            const paidDays =
                present +
                totalPaidHoliday +
                (halfDay * 0.5);


            // -------------------------------------------------
            // Salary Calculation Method
            // -------------------------------------------------

            const calculationMethod =
                localStorage.getItem(
                    "salaryCalculationMethod"
                ) || "30";


            let salaryDays;


            if (
                calculationMethod ===
                "30"
            ) {

                salaryDays = 30;

            }

            else {

                const year =
                    Number(
                        month.substring(
                            0,
                            4
                        )
                    );


                const monthNumber =
                    Number(
                        month.substring(
                            5,
                            7
                        )
                    );


                salaryDays =
                    new Date(
                        year,
                        monthNumber,
                        0
                    ).getDate();

            }


            // -------------------------------------------------
            // Daily Salary
            // -------------------------------------------------

            const dailySalary =
                basicSalary /
                salaryDays;


            // -------------------------------------------------
            // Earned Basic Salary
            // -------------------------------------------------

            const earnedBasicSalary =
                dailySalary *
                paidDays;


            // ---------------------------------------------
            // Attendance Deductions
            // -------------------------------------------------
            // Company holiday ko absent/half-day deduction
            // me include nahi kiya jayega.
            // -------------------------------------------------

            const absentDeductionAmount =
                dailySalary *
                absent;


            const halfDayDeduction =
                dailySalary *
                halfDay *
                0.5;


            const attendanceDeduction =
                absentDeductionAmount +
                halfDayDeduction;


            // -------------------------------------------------
            // Net Salary
            // -------------------------------------------------

            const netSalary =
                earnedBasicSalary +
                totalAllowance -
                totalDeduction;


            // -------------------------------------------------
            // CREATE CURRENT PAYROLL
            // -------------------------------------------------

            currentPayroll = {

                employeeId:
                    String(
                        employee.id ||
                        employee.employeeId ||
                        employeeId
                    ).trim(),

                employeeName:
                    employee.name ||
                    employee.fullName ||
                    "",

                email:
                    employee.email ||
                    "",

                mobile:
                    employee.mobile ||
                    "",

                department:
                    employee.department ||
                    "",

                designation:
                    employee.designation ||
                    "",

                joiningDate:
                    employee.joiningDate ||
                    "",

                employeeType:
                    employee.employeeType ||
                    "",

                panNumber:
                    employee.panNumber ||
                    "",

                uanNumber:
                    employee.uanNumber ||
                    "",

                pfNumber:
                    employee.pfNumber ||
                    "",

                bankAccount:
                    employee.bankAccount ||
                    "",

                employeeStatus:
                    employee.status ||
                    "",

                month:
                    month,

                present:
                    present,

                absent:
                    absent,

                halfDay:
                    halfDay,

                // Attendance se existing holidays
                // + Holidays page ke automatic holidays
                holiday:
                    totalPaidHoliday,

                // Automatic holiday information
                automaticHoliday:
                    automaticHolidayCount,

                companyHoliday:
                    companyHolidayDates.length,

                paidDays:
                    paidDays,

                salaryDays:
                    salaryDays,

                dailySalary:
                    dailySalary,

                originalBasicSalary:
                    basicSalary,

                basicSalary:
                    earnedBasicSalary,

                allowance:
                    totalAllowance,

                deduction:
                    totalDeduction,

                absentDeduction:
                    absentDeductionAmount,

                halfDayDeduction:
                    halfDayDeduction,

                attendanceDeduction:
                    attendanceDeduction,

                bonus:
                    Number(
                        salary.bonus
                    ) || 0,

                overtime:
                    Number(
                        salary.overtime
                    ) || 0,

                otherDeduction:
                    Number(
                        salary.otherDeduction
                    ) || 0,

                netSalary:
                    netSalary

            };


            // -------------------------------------------------
            // UPDATE ATTENDANCE UI
            // -------------------------------------------------

            if (payrollPresent) {

                payrollPresent.textContent =
                    present;

            }


            if (payrollAbsent) {

                payrollAbsent.textContent =
                    absent;

            }


            if (payrollHalfDay) {

                payrollHalfDay.textContent =
                    halfDay;

            }


            if (payrollHoliday) {

                payrollHoliday.textContent =
                    totalPaidHoliday;

            }


            // -------------------------------------------------
            // UPDATE SALARY UI
            // -------------------------------------------------

            if (payrollBasic) {

                payrollBasic.textContent =
                    formatCurrency(
                        earnedBasicSalary
                    );

            }


            if (payrollAllowance) {

                payrollAllowance.textContent =
                    formatCurrency(
                        totalAllowance
                    );

            }


            if (payrollDeduction) {

                payrollDeduction.textContent =
                    formatCurrency(
                        totalDeduction
                    );

            }


            if (absentDeduction) {

                absentDeduction.textContent =
                    formatCurrency(
                        attendanceDeduction
                    );

            }


            if (payrollNet) {

                payrollNet.textContent =
                    formatCurrency(
                        netSalary
                    );

            }


            alert(
                "Payroll calculated successfully!"
            );

        }
    );

}


// =========================================================
// SAVE / UPDATE PAYROLL
// =========================================================

if (savePayrollButton) {

    savePayrollButton.addEventListener(
        "click",
        function () {

            // -------------------------------------------------
            // Check calculated payroll
            // -------------------------------------------------

            if (
                !currentPayroll ||
                typeof currentPayroll !== "object"
            ) {

                alert(
                    "Please calculate payroll first."
                );

                return;

            }


            try {

                // -------------------------------------------------
                // Make safe copy
                // -------------------------------------------------

                const payrollToSave =
                    {
                        ...currentPayroll
                    };


                // -------------------------------------------------
                // Get existing records
                // -------------------------------------------------

                let payrollRecords =
                    getStorageArray(
                        "payrollRecords"
                    );


                // -------------------------------------------------
                // Remove invalid/null records
                // -------------------------------------------------

                payrollRecords =
                    payrollRecords.filter(
                        function (record) {

                            return (
                                record &&
                                typeof record ===
                                "object"
                            );

                        }
                    );


                // -------------------------------------------------
                // Employee ID
                // -------------------------------------------------

                const employeeId =
                    String(
                        payrollToSave.employeeId ||
                        ""
                    ).trim();


                // -------------------------------------------------
                // Month
                // -------------------------------------------------

                const month =
                    String(
                        payrollToSave.month ||
                        ""
                    ).trim();


                // -------------------------------------------------
                // Validation
                // -------------------------------------------------

                if (!employeeId) {

                    alert(
                        "Employee ID is missing."
                    );

                    return;

                }


                if (!month) {

                    alert(
                        "Payroll month is missing."
                    );

                    return;

                }


                // -------------------------------------------------
                // Find Existing Payroll
                // -------------------------------------------------

                const existingIndex =
                    payrollRecords.findIndex(
                        function (record) {

                            const recordEmployeeId =
                                String(
                                    record.employeeId ||
                                    ""
                                ).trim();


                            const recordMonth =
                                String(
                                    record.month ||
                                    ""
                                ).trim();


                            return (

                                recordEmployeeId ===
                                employeeId

                                &&

                                recordMonth ===
                                month

                            );

                        }
                    );


                // -------------------------------------------------
                // Update Existing Record
                // -------------------------------------------------

                if (
                    existingIndex !== -1
                ) {

                    payrollRecords[
                        existingIndex
                    ] =
                        payrollToSave;

                }


                // -------------------------------------------------
                // Add New Record
                // -------------------------------------------------

                else {

                    payrollRecords.push(
                        payrollToSave
                    );

                }


                // -------------------------------------------------
                // SAVE TO LOCAL STORAGE
                // -------------------------------------------------

                localStorage.setItem(
                    "payrollRecords",
                    JSON.stringify(
                        payrollRecords
                    )
                );


                // -------------------------------------------------
                // VERIFY DATA
                // -------------------------------------------------

                const verifyRecords =
                    getStorageArray(
                        "payrollRecords"
                    );


                const savedRecord =
                    verifyRecords.find(
                        function (record) {

                            if (
                                !record ||
                                typeof record !==
                                "object"
                            ) {

                                return false;

                            }


                            const savedEmployeeId =
                                String(
                                    record.employeeId ||
                                    ""
                                ).trim();


                            const savedMonth =
                                String(
                                    record.month ||
                                    ""
                                ).trim();


                            return (

                                savedEmployeeId ===
                                employeeId

                                &&

                                savedMonth ===
                                month

                            );

                        }
                    );


                if (!savedRecord) {

                    alert(
                        "Payroll could not be saved."
                    );

                    return;

                }


                // -------------------------------------------------
                // SUCCESSFUL SAVE
                // -------------------------------------------------

                displayPayrollRecords();


                if (
                    existingIndex !== -1
                ) {

                    alert(
                        "Payroll updated successfully!"
                    );

                }

                else {

                    alert(
                        "Payroll saved successfully!"
                    );

                }


                // Clear only AFTER successful save

                currentPayroll = null;

            }

            catch (error) {

                console.error(
                    "Payroll Save Error:",
                    error
                );


                alert(
                    "Unable to save payroll.\n\n" +
                    error.message
                );

            }

        }
    );

}


// =========================================================
// DISPLAY PAYROLL RECORDS
// =========================================================

function displayPayrollRecords() {

    if (!payrollTableBody) {

        return;

    }


    let payrollRecords =
        getStorageArray(
            "payrollRecords"
        );


    // Remove invalid records

    payrollRecords =
        payrollRecords.filter(
            function (record) {

                return (
                    record &&
                    typeof record ===
                    "object"
                );

            }
        );


    payrollTableBody.innerHTML =
        "";


    // -------------------------------------------------
    // Empty State
    // -------------------------------------------------

    if (payrollRecords.length === 0) {

        payrollTableBody.innerHTML = `

            <tr>

                <td colspan="6">

                    <div class="empty-state">

                        <div class="empty-icon">
                            💵
                        </div>

                        <h3>
                            No Payroll Records
                        </h3>

                        <p>
                            Calculate payroll to
                            create a record.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    // -------------------------------------------------
    // Display Records
    // -------------------------------------------------

    payrollRecords.forEach(
        function (record) {

            const row =
                document.createElement(
                    "tr"
                );


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
                    ${Number(
                        record.present
                    ) || 0}
                </td>

                <td>
                    ${Number(
                        record.absent
                    ) || 0}
                </td>

                <td>
                    ${formatCurrency(
                        record.netSalary
                    )}
                </td>

            `;


            payrollTableBody.appendChild(
                row
            );

        }
    );

}


// =========================================================
// PAGE INITIALIZATION
// =========================================================

function initializePayrollPage() {

    loadEmployees();

    setCurrentMonth();

    displayPayrollRecords();

}


// =========================================================
// START PAGE
// =========================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePayrollPage
    );

}

else {

    initializePayrollPage();

}


console.log(
    "PayrollPro Payroll System loaded successfully."
);