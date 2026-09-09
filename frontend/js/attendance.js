// =========================================================
// PAYROLLPRO - ATTENDANCE JAVASCRIPT
// Today's attendance display + historical data safe.
// =========================================================


// =========================================================
// HTML ELEMENTS
// =========================================================

const employeeSelect =
    document.getElementById("employeeSelect");

const attendanceDate =
    document.getElementById("attendanceDate");

const attendanceStatus =
    document.getElementById("attendanceStatus");

const saveAttendanceButton =
    document.getElementById("saveAttendance");

const attendanceTableBody =
    document.getElementById("attendanceTableBody");

const presentCount =
    document.getElementById("presentCount");

const absentCount =
    document.getElementById("absentCount");

const halfDayCount =
    document.getElementById("halfDayCount");

const holidayCount =
    document.getElementById("holidayCount");


// =========================================================
// EMPLOYEE DATA
// =========================================================

let employees =
    JSON.parse(
        localStorage.getItem("employees")
    ) || [];


// =========================================================
// ATTENDANCE DATA
// IMPORTANT:
// Saara old data localStorage mein safe rahega.
// Hum koi old record delete nahi karenge.
// =========================================================

let attendanceRecords =
    JSON.parse(
        localStorage.getItem("attendanceRecords")
    ) || [];


// =========================================================
// GET TODAY'S DATE
// Format: YYYY-MM-DD
// =========================================================

function getTodayDate() {

    const today = new Date();

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

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// =========================================================
// LOAD EMPLOYEES
// =========================================================

function loadEmployees() {

    employeeSelect.innerHTML = `
        <option value="">
            Select Employee
        </option>
    `;


    // Agar employees nahi hain
    if (employees.length === 0) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "No Employees Available";

        employeeSelect.appendChild(
            option
        );

        return;
    }


    // Employees dropdown mein add karna
    employees.forEach(
        function (employee) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                String(employee.id);


            option.textContent =
                employee.name +
                " (" +
                employee.id +
                ")";


            employeeSelect.appendChild(
                option
            );

        }
    );

}


// =========================================================
// SAVE ATTENDANCE
// =========================================================

if (saveAttendanceButton) {

    saveAttendanceButton.addEventListener(
        "click",
        function () {


            // Selected employee
            const employeeId =
                employeeSelect.value;


            // Selected date
            const date =
                attendanceDate.value;


            // Selected status
            const status =
                attendanceStatus.value;


            // =================================================
            // VALIDATION
            // =================================================

            if (employeeId === "") {

                alert(
                    "Please select an employee."
                );

                return;
            }


            if (date === "") {

                alert(
                    "Please select a date."
                );

                return;
            }


            if (status === "") {

                alert(
                    "Please select attendance status."
                );

                return;
            }


            // =================================================
            // FIND EMPLOYEE
            // =================================================

            const employee =
                employees.find(
                    function (item) {

                        return (
                            String(item.id) ===
                            String(employeeId)
                        );

                    }
                );


            if (!employee) {

                alert(
                    "Employee not found."
                );

                return;
            }


            // =================================================
            // DUPLICATE CHECK
            // Same employee + same date
            // =================================================

            const alreadyExists =
                attendanceRecords.some(
                    function (record) {

                        return (
                            String(
                                record.employeeId
                            ) ===
                            String(
                                employeeId
                            )

                            &&

                            record.date ===
                            date
                        );

                    }
                );


            if (alreadyExists) {

                alert(
                    "Attendance already exists for this employee on this date."
                );

                return;
            }


            // =================================================
            // CREATE ATTENDANCE OBJECT
            // =================================================

            const attendance = {

                employeeId:
                    employee.id,

                employeeName:
                    employee.name,

                date:
                    date,

                status:
                    status

            };


            // =================================================
            // SAVE DATA
            // IMPORTANT:
            // Old records remain safe.
            // =================================================

            attendanceRecords.push(
                attendance
            );


            localStorage.setItem(
                "attendanceRecords",
                JSON.stringify(
                    attendanceRecords
                )
            );


            // =================================================
            // UPDATE PAGE
            // =================================================

            displayTodayAttendance();

            updateTodayAttendanceSummary();


            // =================================================
            // RESET FORM
            // =================================================

            employeeSelect.value = "";

            attendanceDate.value = "";

            attendanceStatus.value =
                "Present";


            alert(
                "Attendance saved successfully!"
            );

        }
    );

}


// =========================================================
// GET TODAY'S ATTENDANCE
// =========================================================

function getTodayAttendance() {

    const today =
        getTodayDate();


    return attendanceRecords.filter(
        function (record) {

            return (
                record.date === today
            );

        }
    );

}


// =========================================================
// DISPLAY TODAY'S ATTENDANCE
// IMPORTANT:
// Sirf aaj ka data screen par show hoga.
// Old data delete nahi hoga.
// =========================================================

function displayTodayAttendance() {

    // Table clear
    attendanceTableBody.innerHTML = "";


    // Today's records
    const todayRecords =
        getTodayAttendance();


    // =================================================
    // NO TODAY RECORDS
    // =================================================

    if (
        todayRecords.length === 0
    ) {

        attendanceTableBody.innerHTML = `

            <tr>

                <td colspan="5">

                    <div class="empty-state">

                        <div class="empty-icon">
                            🕐
                        </div>

                        <h3>
                            No Attendance For Today
                        </h3>

                        <p>
                            Today's attendance
                            records will appear here.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;
    }


    // =================================================
    // DISPLAY TODAY'S RECORDS
    // =================================================

    todayRecords.forEach(
        function (record) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${record.employeeId}
                </td>

                <td>
                    ${record.employeeName}
                </td>

                <td>
                    ${record.date}
                </td>

                <td>
                    ${record.status}
                </td>

                <td>

                    <button
                        onclick="deleteAttendance(
                            '${record.employeeId}',
                            '${record.date}'
                        )"
                    >
                        Delete
                    </button>

                </td>

            `;


            attendanceTableBody.appendChild(
                row
            );

        }
    );

}


// =========================================================
// TODAY'S ATTENDANCE SUMMARY
// Sirf aaj ka Present / Absent / Half Day / Holiday
// count hoga.
// =========================================================

function updateTodayAttendanceSummary() {

    const todayRecords =
        getTodayAttendance();


    // Present
    const present =
        todayRecords.filter(
            function (record) {

                return (
                    record.status ===
                    "Present"
                );

            }
        ).length;


    // Absent
    const absent =
        todayRecords.filter(
            function (record) {

                return (
                    record.status ===
                    "Absent"
                );

            }
        ).length;


    // Half Day
    const halfDay =
        todayRecords.filter(
            function (record) {

                return (
                    record.status ===
                    "Half Day"
                );

            }
        ).length;


    // Holiday
    const holiday =
        todayRecords.filter(
            function (record) {

                return (
                    record.status ===
                    "Holiday"
                );

            }
        ).length;


    // Update cards

    if (presentCount) {

        presentCount.textContent =
            present;

    }


    if (absentCount) {

        absentCount.textContent =
            absent;

    }


    if (halfDayCount) {

        halfDayCount.textContent =
            halfDay;

    }


    if (holidayCount) {

        holidayCount.textContent =
            holiday;

    }

}


// =========================================================
// DELETE TODAY'S ATTENDANCE
// =========================================================

function deleteAttendance(
    employeeId,
    date
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this attendance record?"
        );


    if (!confirmDelete) {

        return;
    }


    // =================================================
    // Sirf selected record delete hoga.
    // Baaki historical data safe rahega.
    // =================================================

    attendanceRecords =
        attendanceRecords.filter(
            function (record) {

                return !(
                    String(
                        record.employeeId
                    ) ===
                    String(
                        employeeId
                    )

                    &&

                    record.date ===
                    date
                );

            }
        );


    // Save updated records
    localStorage.setItem(
        "attendanceRecords",
        JSON.stringify(
            attendanceRecords
        )
    );


    // Refresh page
    displayTodayAttendance();

    updateTodayAttendanceSummary();

}


// =========================================================
// PAGE LOAD
// =========================================================

loadEmployees();

displayTodayAttendance();

updateTodayAttendanceSummary();