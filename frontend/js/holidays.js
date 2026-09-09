// =========================================================
// PAYROLLPRO - HOLIDAYS JAVASCRIPT
// Holiday add, edit, update, display aur delete functionality.
// =========================================================


// =========================================================
// HTML ELEMENTS
// =========================================================

const holidayForm =
    document.getElementById("holidayForm");

const holidayName =
    document.getElementById("holidayName");

const holidayDate =
    document.getElementById("holidayDate");

const holidayType =
    document.getElementById("holidayType");

const holidayDescription =
    document.getElementById("holidayDescription");

const holidayTableBody =
    document.getElementById("holidayTableBody");

const holidayCount =
    document.getElementById("holidayCount");


// =========================================================
// LOAD HOLIDAY DATA
// =========================================================

let holidays = [];

try {

    const savedHolidays =
        localStorage.getItem("holidays");

    const parsedHolidays =
        savedHolidays
            ? JSON.parse(savedHolidays)
            : [];

    holidays =
        Array.isArray(parsedHolidays)
            ? parsedHolidays
            : [];

}
catch (error) {

    console.error(
        "Holiday Storage Error:",
        error
    );

    holidays = [];

}


// =========================================================
// EDITING HOLIDAY ID
// =========================================================

// null = Add mode
// holiday ID = Edit mode

let editingHolidayId = null;


// =========================================================
// CREATE CANCEL BUTTON
// =========================================================

const saveButton =
    holidayForm.querySelector(
        ".save-button"
    );


let cancelButton =
    document.getElementById(
        "cancelHolidayEdit"
    );


if (
    saveButton &&
    !cancelButton
) {

    cancelButton =
        document.createElement(
            "button"
        );

    cancelButton.type =
        "button";

    cancelButton.id =
        "cancelHolidayEdit";

    cancelButton.textContent =
        "❌ Cancel Edit";

    cancelButton.style.display =
        "none";

    cancelButton.style.marginLeft =
        "10px";

    cancelButton.style.cursor =
        "pointer";

    cancelButton.style.padding =
        "12px 18px";

    cancelButton.style.border =
        "none";

    cancelButton.style.borderRadius =
        "8px";

    cancelButton.style.background =
        "#e5e7eb";

    cancelButton.style.color =
        "#111827";

    holidayForm
        .querySelector(".save-button")
        .parentNode
        .appendChild(
            cancelButton
        );

}


// =========================================================
// SAVE / UPDATE HOLIDAY
// =========================================================

holidayForm.addEventListener(
    "submit",
    function (event) {

        // Browser default submit stop karo

        event.preventDefault();


        // =================================================
        // FORM DATA
        // =================================================

        const name =
            holidayName.value.trim();

        const date =
            holidayDate.value;

        const type =
            holidayType.value;

        const description =
            holidayDescription.value.trim();


        // =================================================
        // VALIDATION
        // =================================================

        if (name === "") {

            alert(
                "Please enter holiday name."
            );

            return;

        }


        if (date === "") {

            alert(
                "Please select holiday date."
            );

            return;

        }


        if (type === "") {

            alert(
                "Please select holiday type."
            );

            return;

        }


        // =================================================
        // DUPLICATE DATE CHECK
        // =================================================

        const duplicateHoliday =
            holidays.find(
                function (holiday) {

                    // Edit mode mein current holiday
                    // ko duplicate check se ignore karo

                    if (
                        editingHolidayId !== null &&
                        String(
                            holiday.id
                        ) === String(
                            editingHolidayId
                        )
                    ) {

                        return false;

                    }


                    return (
                        holiday.date === date
                    );

                }
            );


        if (duplicateHoliday) {

            alert(
                "A holiday already exists on this date."
            );

            return;

        }


        // =================================================
        // UPDATE EXISTING HOLIDAY
        // =================================================

        if (
            editingHolidayId !== null
        ) {

            const holidayIndex =
                holidays.findIndex(
                    function (holiday) {

                        return (
                            String(
                                holiday.id
                            ) === String(
                                editingHolidayId
                            )
                        );

                    }
                );


            if (
                holidayIndex === -1
            ) {

                alert(
                    "Holiday not found."
                );

                cancelEdit();

                return;

            }


            // Existing holiday update

            holidays[
                holidayIndex
            ] = {

                ...holidays[
                    holidayIndex
                ],

                name:
                    name,

                date:
                    date,

                type:
                    type,

                description:
                    description

            };


            // Save updated holidays

            localStorage.setItem(
                "holidays",
                JSON.stringify(
                    holidays
                )
            );


            // Refresh table

            displayHolidays();


            // Reset edit mode

            cancelEdit();


            alert(
                "Holiday updated successfully!"
            );


            return;

        }


        // =================================================
        // CREATE NEW HOLIDAY
        // =================================================

        const holiday = {

            id:
                Date.now(),

            name:
                name,

            date:
                date,

            type:
                type,

            description:
                description

        };


        // =================================================
        // ADD HOLIDAY
        // =================================================

        holidays.push(
            holiday
        );


        // =================================================
        // SAVE LOCAL STORAGE
        // =================================================

        localStorage.setItem(
            "holidays",
            JSON.stringify(
                holidays
            )
        );


        // =================================================
        // UPDATE TABLE
        // =================================================

        displayHolidays();


        // =================================================
        // RESET FORM
        // =================================================

        holidayForm.reset();


        alert(
            "Holiday added successfully!"
        );

    }
);


// =========================================================
// DISPLAY HOLIDAYS
// =========================================================

function displayHolidays() {

    // Table clear

    holidayTableBody.innerHTML =
        "";


    // =================================================
    // NO HOLIDAYS
    // =================================================

    if (
        holidays.length === 0
    ) {

        holidayTableBody.innerHTML = `

            <tr>

                <td colspan="5">

                    <div class="empty-state">

                        <div class="empty-icon">
                            📅
                        </div>

                        <h3>
                            No Holidays Added
                        </h3>

                        <p>
                            Add your first company holiday.
                        </p>

                    </div>

                </td>

            </tr>

        `;


        holidayCount.textContent =
            "0 Holidays";


        return;

    }


    // =================================================
    // SORT BY DATE
    // =================================================

    const sortedHolidays =
        [...holidays].sort(
            function (a, b) {

                return (
                    String(
                        a.date || ""
                    ).localeCompare(
                        String(
                            b.date || ""
                        )
                    )
                );

            }
        );


    // =================================================
    // DISPLAY RECORDS
    // =================================================

    sortedHolidays.forEach(
        function (holiday) {

            if (
                !holiday ||
                typeof holiday !== "object"
            ) {

                return;

            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${holiday.name || "-"}
                </td>

                <td>
                    ${holiday.date || "-"}
                </td>

                <td>
                    ${holiday.type || "-"}
                </td>

                <td>
                    ${holiday.description || "-"}
                </td>

                <td>

                    <button
                        class="edit-button"
                        onclick="editHoliday('${holiday.id}')"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteHoliday('${holiday.id}')"
                    >
                        Delete
                    </button>

                </td>

            `;


            holidayTableBody.appendChild(
                row
            );

        }
    );


    // Update count

    holidayCount.textContent =
        holidays.length +
        " Holidays";

}


// =========================================================
// EDIT HOLIDAY
// =========================================================

function editHoliday(
    holidayId
) {

    const holiday =
        holidays.find(
            function (item) {

                return (
                    String(
                        item.id
                    ) === String(
                        holidayId
                    )
                );

            }
        );


    if (!holiday) {

        alert(
            "Holiday not found."
        );

        return;

    }


    // Set editing ID

    editingHolidayId =
        holiday.id;


    // Load data into form

    holidayName.value =
        holiday.name || "";

    holidayDate.value =
        holiday.date || "";

    holidayType.value =
        holiday.type || "";

    holidayDescription.value =
        holiday.description || "";


    // Change button text

    if (saveButton) {

        saveButton.textContent =
            "🔄 Update Holiday";

    }


    // Show cancel button

    if (cancelButton) {

        cancelButton.style.display =
            "inline-block";

    }


    // Scroll to form

    holidayForm.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
    );

}


// =========================================================
// CANCEL EDIT
// =========================================================

function cancelEdit() {

    editingHolidayId =
        null;


    holidayForm.reset();


    if (saveButton) {

        saveButton.textContent =
            "💾 Add Holiday";

    }


    if (cancelButton) {

        cancelButton.style.display =
            "none";

    }

}


// =========================================================
// DELETE HOLIDAY
// =========================================================

function deleteHoliday(
    holidayId
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this holiday?"
        );


    if (!confirmDelete) {

        return;

    }


    // Holiday remove

    holidays =
        holidays.filter(
            function (holiday) {

                return (
                    String(
                        holiday.id
                    ) !== String(
                        holidayId
                    )
                );

            }
        );


    // Updated data save

    localStorage.setItem(
        "holidays",
        JSON.stringify(
            holidays
        )
    );


    // Agar delete kiya hua holiday
    // edit mode mein tha

    if (
        editingHolidayId !== null &&
        String(
            editingHolidayId
        ) === String(
            holidayId
        )
    ) {

        cancelEdit();

    }


    // Refresh table

    displayHolidays();

}


// =========================================================
// PAGE LOAD
// =========================================================

displayHolidays();