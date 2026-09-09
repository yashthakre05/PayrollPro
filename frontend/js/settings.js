// =========================================================
// PAYROLLPRO - SETTINGS JAVASCRIPT
// Company + Logo + Signature + Salary Settings
// =========================================================


// =========================================================
// COMPANY FORM
// =========================================================

const companyForm =
    document.getElementById("companyForm");


// =========================================================
// COMPANY FIELDS
// =========================================================

const companyId =
    document.getElementById("companyId");

const companyName =
    document.getElementById("companyName");

const companyEmail =
    document.getElementById("companyEmail");

const companyPhone =
    document.getElementById("companyPhone");

const companyAddress =
    document.getElementById("companyAddress");


// =========================================================
// LOGO + SIGNATURE
// =========================================================

const companyLogo =
    document.getElementById("companyLogo");

const companySignature =
    document.getElementById("companySignature");


// =========================================================
// PREVIEW ELEMENTS
// =========================================================

const logoPreview =
    document.getElementById("logoPreview");

const logoPreviewContainer =
    document.getElementById(
        "logoPreviewContainer"
    );

const signaturePreview =
    document.getElementById("signaturePreview");

const signaturePreviewContainer =
    document.getElementById(
        "signaturePreviewContainer"
    );


// =========================================================
// CURRENT COMPANY INFORMATION
// =========================================================

const displayCompanyName =
    document.getElementById(
        "displayCompanyName"
    );

const displayCompanyId =
    document.getElementById(
        "displayCompanyId"
    );

const displayCompanyEmail =
    document.getElementById(
        "displayCompanyEmail"
    );

const displayCompanyPhone =
    document.getElementById(
        "displayCompanyPhone"
    );

const displayCompanyAddress =
    document.getElementById(
        "displayCompanyAddress"
    );


// =========================================================
// RESET BUTTON
// =========================================================

const resetSettingsButton =
    document.getElementById(
        "resetSettings"
    );


// =========================================================
// SALARY SETTINGS
// =========================================================

const salaryCalculationMethod =
    document.getElementById(
        "salaryCalculationMethod"
    );

const saveSalaryMethodButton =
    document.getElementById(
        "saveSalaryMethod"
    );


// =========================================================
// LOAD COMPANY DATA
// =========================================================

function loadCompanyData() {

    const savedCompany =
        JSON.parse(
            localStorage.getItem(
                "companyInfo"
            )
        );


    if (!savedCompany) {

        return;

    }


    // Company ID

    if (companyId) {

        companyId.value =
            savedCompany.id || "";

    }


    // Company Name

    if (companyName) {

        companyName.value =
            savedCompany.name || "";

    }


    // Email

    if (companyEmail) {

        companyEmail.value =
            savedCompany.email || "";

    }


    // Phone

    if (companyPhone) {

        companyPhone.value =
            savedCompany.phone || "";

    }


    // Address

    if (companyAddress) {

        companyAddress.value =
            savedCompany.address || "";

    }


    // Logo

    if (savedCompany.logo) {

        showLogoPreview(
            savedCompany.logo
        );

    }


    // Signature

    if (savedCompany.signature) {

        showSignaturePreview(
            savedCompany.signature
        );

    }


    // Current information

    displayCompanyInformation(
        savedCompany
    );

}


// =========================================================
// LOGO PREVIEW
// =========================================================

if (companyLogo) {

    companyLogo.addEventListener(
        "change",
        function () {

            const file =
                companyLogo.files[0];


            if (!file) {

                return;

            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select a valid logo image."
                );

                companyLogo.value = "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    showLogoPreview(
                        event.target.result
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


// =========================================================
// SIGNATURE PREVIEW
// =========================================================

if (companySignature) {

    companySignature.addEventListener(
        "change",
        function () {

            const file =
                companySignature.files[0];


            if (!file) {

                return;

            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select a valid signature image."
                );

                companySignature.value = "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    showSignaturePreview(
                        event.target.result
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


// =========================================================
// SHOW LOGO PREVIEW
// =========================================================

function showLogoPreview(imageData) {

    if (!logoPreview ||
        !logoPreviewContainer) {

        return;

    }


    logoPreview.src =
        imageData;


    logoPreviewContainer.style.display =
        "flex";

}


// =========================================================
// SHOW SIGNATURE PREVIEW
// =========================================================

function showSignaturePreview(imageData) {

    if (!signaturePreview ||
        !signaturePreviewContainer) {

        return;

    }


    signaturePreview.src =
        imageData;


    signaturePreviewContainer.style.display =
        "flex";

}


// =========================================================
// SAVE COMPANY INFORMATION
// =========================================================

if (companyForm) {

    companyForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Company name validation

            const name =
                companyName
                    ? companyName.value.trim()
                    : "";


            if (name === "") {

                alert(
                    "Please enter company name."
                );

                return;

            }


            // =================================================
            // OLD SAVED DATA
            // =================================================

            const oldCompany =
                JSON.parse(
                    localStorage.getItem(
                        "companyInfo"
                    )
                ) || {};


            // =================================================
            // READ LOGO
            // =================================================

            let logoData =
                oldCompany.logo || "";


            if (
                companyLogo &&
                companyLogo.files.length > 0
            ) {

                logoData =
                    await readImageFile(
                        companyLogo.files[0]
                    );

            }


            // =================================================
            // READ SIGNATURE
            // =================================================

            let signatureData =
                oldCompany.signature || "";


            if (
                companySignature &&
                companySignature.files.length > 0
            ) {

                signatureData =
                    await readImageFile(
                        companySignature.files[0]
                    );

            }


            // =================================================
            // CREATE COMPANY OBJECT
            // =================================================

            const company = {

                id:
                    companyId
                        ? companyId.value.trim()
                        : "",

                name:
                    name,

                email:
                    companyEmail
                        ? companyEmail.value.trim()
                        : "",

                phone:
                    companyPhone
                        ? companyPhone.value.trim()
                        : "",

                address:
                    companyAddress
                        ? companyAddress.value.trim()
                        : "",

                logo:
                    logoData,

                signature:
                    signatureData

            };


            // =================================================
            // SAVE
            // =================================================

            localStorage.setItem(
                "companyInfo",
                JSON.stringify(company)
            );


            // Update current information

            displayCompanyInformation(
                company
            );


            // Update previews

            if (company.logo) {

                showLogoPreview(
                    company.logo
                );

            }


            if (company.signature) {

                showSignaturePreview(
                    company.signature
                );

            }


            // Clear file inputs after save

            if (companyLogo) {

                companyLogo.value = "";

            }


            if (companySignature) {

                companySignature.value = "";

            }


            alert(
                "Company information, logo and signature saved successfully!"
            );

        }
    );

}


// =========================================================
// READ IMAGE FILE
// =========================================================

function readImageFile(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    resolve(
                        event.target.result
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Image could not be read."
                        )
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


// =========================================================
// DISPLAY COMPANY INFORMATION
// =========================================================

function displayCompanyInformation(
    company
) {

    if (displayCompanyName) {

        displayCompanyName.textContent =
            company.name || "Not Set";

    }


    if (displayCompanyId) {

        displayCompanyId.textContent =
            company.id || "Not Set";

    }


    if (displayCompanyEmail) {

        displayCompanyEmail.textContent =
            company.email || "Not Set";

    }


    if (displayCompanyPhone) {

        displayCompanyPhone.textContent =
            company.phone || "Not Set";

    }


    if (displayCompanyAddress) {

        displayCompanyAddress.textContent =
            company.address || "Not Set";

    }

}


// =========================================================
// RESET COMPANY SETTINGS
// =========================================================

if (resetSettingsButton) {

    resetSettingsButton.addEventListener(
        "click",
        function () {

            const confirmReset =
                confirm(
                    "Are you sure you want to reset company settings?"
                );


            if (!confirmReset) {

                return;

            }


            // Remove company information

            localStorage.removeItem(
                "companyInfo"
            );


            // Reset form

            if (companyForm) {

                companyForm.reset();

            }


            // Hide logo preview

            if (logoPreviewContainer) {

                logoPreviewContainer.style.display =
                    "none";

            }


            // Hide signature preview

            if (signaturePreviewContainer) {

                signaturePreviewContainer.style.display =
                    "none";

            }


            // Reset display

            if (displayCompanyName) {

                displayCompanyName.textContent =
                    "Not Set";

            }


            if (displayCompanyId) {

                displayCompanyId.textContent =
                    "Not Set";

            }


            if (displayCompanyEmail) {

                displayCompanyEmail.textContent =
                    "Not Set";

            }


            if (displayCompanyPhone) {

                displayCompanyPhone.textContent =
                    "Not Set";

            }


            if (displayCompanyAddress) {

                displayCompanyAddress.textContent =
                    "Not Set";

            }


            alert(
                "Company settings reset successfully."
            );

        }
    );

}


// =========================================================
// LOAD SALARY CALCULATION METHOD
// =========================================================

function loadSalaryCalculationMethod() {

    const savedMethod =
        localStorage.getItem(
            "salaryCalculationMethod"
        );


    const method =
        savedMethod || "30";


    if (salaryCalculationMethod) {

        salaryCalculationMethod.value =
            method;

    }

}


// =========================================================
// SAVE SALARY CALCULATION METHOD
// =========================================================

if (saveSalaryMethodButton) {

    saveSalaryMethodButton.addEventListener(
        "click",
        function () {

            if (!salaryCalculationMethod) {

                return;

            }


            const selectedMethod =
                salaryCalculationMethod.value;


            if (
                selectedMethod !== "30" &&
                selectedMethod !== "actual"
            ) {

                alert(
                    "Please select a valid salary calculation method."
                );

                return;

            }


            localStorage.setItem(
                "salaryCalculationMethod",
                selectedMethod
            );


            if (selectedMethod === "30") {

                alert(
                    "Salary calculation set to fixed 30 days."
                );

            } else {

                alert(
                    "Salary calculation set to actual calendar days."
                );

            }

        }
    );

}


// =========================================================
// PAGE LOAD
// =========================================================

loadCompanyData();

loadSalaryCalculationMethod();


console.log(
    "PayrollPro Settings loaded successfully."
);