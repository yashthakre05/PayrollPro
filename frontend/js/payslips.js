/* =========================================================
   PAYROLLPRO - PAYSLIPS JAVASCRIPT
========================================================= */


/* =========================
   LOAD DATA
========================= */

let employees =
    JSON.parse(localStorage.getItem("employees")) || [];

let payrollRecords =
    JSON.parse(localStorage.getItem("payrollRecords")) || [];

let companyInfo =
    JSON.parse(localStorage.getItem("companyInfo")) || {};



/* =========================
   ELEMENTS
========================= */

const payslipEmployee =
    document.getElementById("payslipEmployee");

const payslipMonth =
    document.getElementById("payslipMonth");

const viewPayslipButton =
    document.getElementById("viewPayslip");

const printPayslipButton =
    document.getElementById("printPayslip");

const downloadPdfButton =
    document.getElementById("downloadPdf");


/* Company */

const slipCompanyName =
    document.getElementById("slipCompanyName");

const slipCompanyAddress =
    document.getElementById("slipCompanyAddress");

const slipCompanyPhone =
    document.getElementById("slipCompanyPhone");

const slipCompanyEmail =
    document.getElementById("slipCompanyEmail");


/* Logo */

const companyLogoImage =
    document.getElementById("companyLogoImage");

const companyLogoText =
    document.getElementById("companyLogoText");


/* Employee */

const slipMonth =
    document.getElementById("slipMonth");

const slipEmployeeId =
    document.getElementById("slipEmployeeId");

const slipEmployeeName =
    document.getElementById("slipEmployeeName");

const slipDepartment =
    document.getElementById("slipDepartment");

const slipDesignation =
    document.getElementById("slipDesignation");

const slipJoiningDate =
    document.getElementById("slipJoiningDate");

const slipEmployeeType =
    document.getElementById("slipEmployeeType");

const slipPan =
    document.getElementById("slipPan");

const slipUan =
    document.getElementById("slipUan");

const slipPf =
    document.getElementById("slipPf");

const slipBankAccount =
    document.getElementById("slipBankAccount");


/* Attendance */

const slipPresent =
    document.getElementById("slipPresent");

const slipAbsent =
    document.getElementById("slipAbsent");

const slipHalfDay =
    document.getElementById("slipHalfDay");

const slipHoliday =
    document.getElementById("slipHoliday");


/* Salary */

const slipBasic =
    document.getElementById("slipBasic");

const slipAllowance =
    document.getElementById("slipAllowance");

const slipBonus =
    document.getElementById("slipBonus");

const slipOvertime =
    document.getElementById("slipOvertime");

const slipDeduction =
    document.getElementById("slipDeduction");

const slipAbsentDeduction =
    document.getElementById("slipAbsentDeduction");

const slipHalfDayDeduction =
    document.getElementById("slipHalfDayDeduction");

const slipOtherDeduction =
    document.getElementById("slipOtherDeduction");

const slipNet =
    document.getElementById("slipNet");


/* Signature */

const companySignature =
    document.getElementById("companySignature");

const signaturePlaceholder =
    document.getElementById("signaturePlaceholder");



/* =========================
   INITIALIZATION
========================= */

document.addEventListener("DOMContentLoaded", function () {

    loadEmployees();

    loadCompanyInfo();

    setCurrentMonth();

});



/* =========================
   LOAD EMPLOYEES
========================= */

function loadEmployees() {

    payslipEmployee.innerHTML =
        '<option value="">Select Employee</option>';


    employees.forEach(function (employee) {

        const employeeId =
            employee.id ||
            employee.employeeId ||
            "";

        const employeeName =
            employee.name ||
            employee.fullName ||
            "";


        const option =
            document.createElement("option");


        option.value =
            employeeId;


        option.textContent =
            employeeId +
            " - " +
            employeeName;


        payslipEmployee.appendChild(option);

    });

}


/* =========================
   DEFAULT CURRENT MONTH
========================= */

function setCurrentMonth() {

    if (!payslipMonth.value) {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(today.getMonth() + 1)
                .padStart(2, "0");

        payslipMonth.value =
            `${year}-${month}`;

    }

}



/* =========================
   COMPANY INFORMATION
========================= */

function loadCompanyInfo() {

    slipCompanyName.textContent =
        companyInfo.name || "PayrollPro";


    slipCompanyAddress.textContent =
        companyInfo.address || "Company Address";


    slipCompanyPhone.textContent =
        companyInfo.phone || "-";


    slipCompanyEmail.textContent =
        companyInfo.email || "-";


    /* COMPANY LOGO */

    if (companyInfo.logo) {

        companyLogoImage.src =
            companyInfo.logo;

        companyLogoImage.style.display =
            "block";

        companyLogoText.style.display =
            "none";

    } else {

        companyLogoImage.style.display =
            "none";

        companyLogoText.style.display =
            "block";

    }


    /* SIGNATURE */

    if (companyInfo.signature) {

        companySignature.src =
            companyInfo.signature;

        companySignature.style.display =
            "block";

        signaturePlaceholder.style.display =
            "none";

    } else {

        companySignature.style.display =
            "none";

        signaturePlaceholder.style.display =
            "flex";

    }

}



/* =========================
   VIEW PAYSLIP
========================= */

viewPayslipButton.addEventListener(
    "click",
    function () {

        const employeeId =
            payslipEmployee.value;

        const month =
            payslipMonth.value;


        if (!employeeId) {

            alert("Please select an employee.");

            return;
        }


        if (!month) {

            alert("Please select salary month.");

            return;
        }


        const payroll =
            payrollRecords.find(function (record) {

                return (
                    String(record.employeeId) ===
                        String(employeeId)
                    &&
                    record.month === month
                );

            });


        if (!payroll) {

            alert(
                "Payroll record not found for this employee and month."
            );

            return;
        }


        displayPayslip(payroll);

    }
);



/* =========================
   DISPLAY PAYSLIP
========================= */

function displayPayslip(payroll) {

    const employee =
        employees.find(function (emp) {

            return String(emp.employeeId) ===
                String(payroll.employeeId);

        });


    /* MONTH */

    slipMonth.textContent =
        formatMonth(payroll.month);



    /* EMPLOYEE */

    slipEmployeeId.textContent =
        payroll.employeeId || "-";


    slipEmployeeName.textContent =
        payroll.employeeName ||
        (employee ? employee.fullName : "-");


    slipDepartment.textContent =
        payroll.department ||
        (employee ? employee.department : "-");


    slipDesignation.textContent =
        payroll.designation ||
        (employee ? employee.designation : "-");


    slipJoiningDate.textContent =
        formatDate(
            payroll.joiningDate ||
            (employee ? employee.joiningDate : "")
        );


    slipEmployeeType.textContent =
        payroll.employeeType ||
        (employee ? employee.employeeType : "-");


    slipPan.textContent =
        payroll.panNumber ||
        (employee ? employee.panNumber : "-");


    slipUan.textContent =
        payroll.uanNumber ||
        (employee ? employee.uanNumber : "-");


    slipPf.textContent =
        payroll.pfNumber ||
        (employee ? employee.pfNumber : "-");


    slipBankAccount.textContent =
        maskBankAccount(
            payroll.bankAccount ||
            (employee ? employee.bankAccount : "")
        );



    /* ATTENDANCE */

    slipPresent.textContent =
        payroll.present || 0;


    slipAbsent.textContent =
        payroll.absent || 0;


    slipHalfDay.textContent =
        payroll.halfDay || 0;


    slipHoliday.textContent =
        payroll.holiday || 0;



    /* SALARY */

    slipBasic.textContent =
        money(payroll.basicSalary);


    slipAllowance.textContent =
        money(payroll.allowance);


    slipBonus.textContent =
        money(payroll.bonus);


    slipOvertime.textContent =
        money(payroll.overtime);


    slipDeduction.textContent =
        money(payroll.deduction);


    slipAbsentDeduction.textContent =
        money(payroll.absentDeduction);


    slipHalfDayDeduction.textContent =
        money(payroll.halfDayDeduction);


    slipOtherDeduction.textContent =
        money(payroll.otherDeduction);


    slipNet.textContent =
        money(payroll.netSalary);

}



/* =========================
   MONTH FORMAT
========================= */

function formatMonth(month) {

    if (!month) {
        return "-";
    }


    const parts =
        month.split("-");


    if (parts.length !== 2) {
        return month;
    }


    const year =
        Number(parts[0]);

    const monthNumber =
        Number(parts[1]);


    const date =
        new Date(
            year,
            monthNumber - 1,
            1
        );


    return date.toLocaleString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );

}



/* =========================
   DATE FORMAT
========================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {
        return dateValue;
    }


    return date.toLocaleDateString(
        "en-IN"
    );

}



/* =========================
   MASK BANK ACCOUNT
========================= */

function maskBankAccount(account) {

    if (!account) {
        return "-";
    }


    const value =
        String(account);


    if (value.length <= 4) {
        return value;
    }


    return "XXXXXX" +
        value.slice(-4);

}



/* =========================
   MONEY FORMAT
========================= */

function money(value) {

    const amount =
        Number(value) || 0;


    return "₹" +
        amount.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}



/* =========================
   PRINT PAYSLIP
========================= */

printPayslipButton.addEventListener(
    "click",
    function () {

        window.print();

    }
);



/* =========================
   DOWNLOAD PDF
========================= */

downloadPdfButton.addEventListener(
    "click",
    function () {

        const employeeId =
            payslipEmployee.value;

        const month =
            payslipMonth.value;


        if (!employeeId || !month) {

            alert(
                "Please select employee and month first."
            );

            return;
        }


        const payroll =
            payrollRecords.find(function (record) {

                return (
                    String(record.employeeId) ===
                        String(employeeId)
                    &&
                    record.month === month
                );

            });


        if (!payroll) {

            alert(
                "Payroll record not found."
            );

            return;
        }


        generatePDF(payroll);

    }
);



/* =========================
   GENERATE PDF
========================= */

function generatePDF(payroll) {

    if (!window.jspdf) {

        alert(
            "PDF library could not be loaded."
        );

        return;
    }


    const { jsPDF } =
        window.jspdf;


    const doc =
        new jsPDF();


    let y = 18;


    /* COMPANY */

    doc.setFontSize(18);

    doc.setFont("helvetica", "bold");

    doc.text(
        companyInfo.name || "PayrollPro",
        20,
        y
    );


    y += 8;


    doc.setFontSize(9);

    doc.setFont("helvetica", "normal");


    doc.text(
        companyInfo.address || "Company Address",
        20,
        y
    );


    y += 5;


    doc.text(
        "Phone: " +
        (companyInfo.phone || "-"),
        20,
        y
    );


    y += 5;


    doc.text(
        "Email: " +
        (companyInfo.email || "-"),
        20,
        y
    );


    /* TITLE */

    doc.setFontSize(16);

    doc.setFont("helvetica", "bold");

    doc.text(
        "SALARY SLIP",
        150,
        20
    );


    doc.setFontSize(10);

    doc.setFont("helvetica", "normal");

    doc.text(
        formatMonth(payroll.month),
        150,
        27
    );


    y = 48;


    /* EMPLOYEE INFORMATION */

    doc.setFontSize(12);

    doc.setFont("helvetica", "bold");

    doc.text(
        "Employee Information",
        20,
        y
    );


    y += 8;


    doc.setFontSize(9);

    doc.setFont("helvetica", "normal");


    const employee =
        employees.find(function (emp) {

            return String(emp.employeeId) ===
                String(payroll.employeeId);

        });


    const employeeName =
        payroll.employeeName ||
        (employee ? employee.fullName : "-");


    const department =
        payroll.department ||
        (employee ? employee.department : "-");


    const designation =
        payroll.designation ||
        (employee ? employee.designation : "-");


    const joiningDate =
        payroll.joiningDate ||
        (employee ? employee.joiningDate : "");


    const employeeType =
        payroll.employeeType ||
        (employee ? employee.employeeType : "-");


    const pan =
        payroll.panNumber ||
        (employee ? employee.panNumber : "-");


    const uan =
        payroll.uanNumber ||
        (employee ? employee.uanNumber : "-");


    const pf =
        payroll.pfNumber ||
        (employee ? employee.pfNumber : "-");


    const bank =
        payroll.bankAccount ||
        (employee ? employee.bankAccount : "");



    doc.text(
        "Employee ID: " +
        (payroll.employeeId || "-"),
        20,
        y
    );

    doc.text(
        "Employee Name: " +
        employeeName,
        110,
        y
    );


    y += 6;


    doc.text(
        "Department: " +
        department,
        20,
        y
    );

    doc.text(
        "Designation: " +
        designation,
        110,
        y
    );


    y += 6;


    doc.text(
        "Date of Joining: " +
        formatDate(joiningDate),
        20,
        y
    );

    doc.text(
        "Employee Type: " +
        employeeType,
        110,
        y
    );


    y += 6;


    doc.text(
        "PAN: " +
        pan,
        20,
        y
    );

    doc.text(
        "UAN: " +
        uan,
        110,
        y
    );


    y += 6;


    doc.text(
        "PF Number: " +
        pf,
        20,
        y
    );

    doc.text(
        "Bank Account: " +
        maskBankAccount(bank),
        110,
        y
    );


    /* ATTENDANCE */

    y += 12;


    doc.setFontSize(12);

    doc.setFont("helvetica", "bold");

    doc.text(
        "Attendance",
        20,
        y
    );


    y += 8;


    doc.setFontSize(9);

    doc.setFont("helvetica", "normal");


    doc.text(
        "Present: " +
        (payroll.present || 0),
        20,
        y
    );


    doc.text(
        "Absent: " +
        (payroll.absent || 0),
        65,
        y
    );


    doc.text(
        "Half Day: " +
        (payroll.halfDay || 0),
        110,
        y
    );


    doc.text(
        "Holiday: " +
        (payroll.holiday || 0),
        155,
        y
    );


    /* EARNINGS */

    y += 15;


    doc.setFontSize(12);

    doc.setFont("helvetica", "bold");

    doc.text(
        "Earnings",
        20,
        y
    );


    y += 8;


    doc.setFontSize(9);

    doc.setFont("helvetica", "normal");


    doc.text(
        "Basic Salary",
        20,
        y
    );

    doc.text(
        money(payroll.basicSalary),
        80,
        y
    );


    y += 6;


    doc.text(
        "Allowances",
        20,
        y
    );

    doc.text(
        money(payroll.allowance),
        80,
        y
    );


    y += 6;


    doc.text(
        "Bonus",
        20,
        y
    );

    doc.text(
        money(payroll.bonus),
        80,
        y
    );


    y += 6;


    doc.text(
        "Overtime",
        20,
        y
    );

    doc.text(
        money(payroll.overtime),
        80,
        y
    );


    /* DEDUCTIONS */

    y -= 18;


    doc.setFontSize(12);

    doc.setFont("helvetica", "bold");

    doc.text(
        "Deductions",
        115,
        y
    );


    y += 8;


    doc.setFontSize(9);

    doc.setFont("helvetica", "normal");


    doc.text(
        "Deductions",
        115,
        y
    );

    doc.text(
        money(payroll.deduction),
        175,
        y
    );


    y += 6;


    doc.text(
        "Absent Deduction",
        115,
        y
    );

    doc.text(
        money(payroll.absentDeduction),
        175,
        y
    );


    y += 6;


    doc.text(
        "Half Day Deduction",
        115,
        y
    );

    doc.text(
        money(payroll.halfDayDeduction),
        175,
        y
    );


    y += 6;


    doc.text(
        "Other Deduction",
        115,
        y
    );

    doc.text(
        money(payroll.otherDeduction),
        175,
        y
    );


    /* NET SALARY */

    y += 20;


    doc.setFontSize(13);

    doc.setFont("helvetica", "bold");

    doc.text(
        "Net Salary",
        20,
        y
    );


    doc.text(
        money(payroll.netSalary),
        150,
        y
    );


    /* SIGNATURE */

    y += 35;


    if (companyInfo.signature) {

        try {

            doc.addImage(
                companyInfo.signature,
                "PNG",
                145,
                y - 15,
                40,
                15
            );

        } catch (error) {

            console.log(
                "Signature could not be added to PDF."
            );

        }

    }


    doc.line(
        140,
        y,
        195,
        y
    );


    doc.setFontSize(9);

    doc.setFont("helvetica", "normal");

    doc.text(
        "Authorized Signature",
        150,
        y + 6
    );


    /* FOOTER */

    doc.setFontSize(8);

    doc.text(
        "This is a computer-generated salary slip.",
        105,
        285,
        {
            align: "center"
        }
    );


    doc.text(
        "Generated by PayrollPro",
        105,
        290,
        {
            align: "center"
        }
    );


    /* SAVE */

    const employeeFileName =
        String(employeeName)
            .replace(/[^a-z0-9]/gi, "_");


    doc.save(
        "Payslip_" +
        employeeFileName +
        "_" +
        payroll.month +
        ".pdf"
    );

}