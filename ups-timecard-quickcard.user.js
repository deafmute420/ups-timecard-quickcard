// ==UserScript==
// @name         UPS Activity System Quick Card
// @namespace    UPS
// @version      3.2.1
// @description  Personal Quick Card replacement for UPS Activity System
// @match        *://actsys.inside.ups.com/*
// @downloadURL  https://raw.githubusercontent.com/deafmute420/ups-timecard-quickcard/main/ups-timecard-quickcard.user.js
// @updateURL    https://raw.githubusercontent.com/deafmute420/ups-timecard-quickcard/main/ups-timecard-quickcard.user.js
// @grant        none
// ==/UserScript==

/*
Version History
3.2.1
- Added support for multiple schedules
- Added schedule selection dropdown
- Added schedule import functionality
- Added schedule export functionality
- Added schedule deletion
- Reworked storage format for multi-profile support
3.0.0
- Added schedule configuration
- Added import/export support
- Added reset functionality
- Added page detection
2.0.0
- Added configurable schedule support
1.0.0
- Initial Quick Card replacement
*/

(function () {
    'use strict';

    const isTimecardPage =
        document.querySelector('[name="ReportIn"]') &&
        document.querySelector('[name="Finish"]');

    if (!isTimecardPage) {
        return;
    }

    const STORAGE_KEY = 'ups_timecard_schedules';

    function getData() {
        const data = localStorage.getItem(STORAGE_KEY);

        return data
            ? JSON.parse(data)
            : {
                selectedSchedule: '',
                schedules: {}
            };
    }

    function saveData(data) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );
    }

    function configureSchedule() {

        const data = getData();

        const scheduleName = prompt(
            'Schedule Name:',
            data.selectedSchedule || ''
        );

        if (!scheduleName) {
            return;
        }

        const existing =
            data.schedules[scheduleName] || {
                reportIn: '',
                finish: '',
                rows: []
            };

        const reportIn = prompt(
            'Report To Work Time',
            existing.reportIn
        );

        if (reportIn === null) return;

        const finish = prompt(
            'Finish Work Time',
            existing.finish
        );

        if (finish === null) return;

        const rows = [];

        for (let i = 1; i <= 7; i++) {

            const row =
                existing.rows[i - 1] || {};

            const time = prompt(
                `Row ${i} Time`,
                row.time || ''
            );

            if (time === null) return;

            const code = prompt(
                `Row ${i} Code`,
                row.code || ''
            );

            if (code === null) return;

            rows.push({
                time,
                code
            });
        }

        data.schedules[scheduleName] = {
            reportIn,
            finish,
            rows
        };

        data.selectedSchedule =
            scheduleName;

        saveData(data);

        rebuildDropdown();

        alert(
            `Schedule "${scheduleName}" saved.`
        );
    }

    function getSelectedSchedule() {

        const data = getData();

        const selector =
            document.getElementById(
                'upsScheduleSelect'
            );

        if (!selector) {
            return null;
        }

        return data.schedules[
            selector.value
        ];
    }

    function fillTimecard() {

        const schedule =
            getSelectedSchedule();

        if (!schedule) {

            alert(
                'No schedule selected.'
            );

            return;
        }

        const reportInField =
            document.querySelector(
                '[name="ReportIn"]'
            );

        const finishField =
            document.querySelector(
                '[name="Finish"]'
            );

        if (reportInField) {
            reportInField.value =
                schedule.reportIn;
        }

        if (finishField) {
            finishField.value =
                schedule.finish;
        }

        schedule.rows.forEach(
            (entry, index) => {

                const row =
                    index + 1;

                const timeField =
                    document.querySelector(
                        `[name="Time_${row}"]`
                    );

                const codeField =
                    document.querySelector(
                        `[name="Code_${row}"]`
                    );

                if (timeField) {
                    timeField.value =
                        entry.time || '';
                }

                if (codeField) {
                    codeField.value =
                        entry.code || '';
                }
            }
        );

        alert('Timecard filled.');
    }

    function deleteSchedule() {

        const selector =
            document.getElementById(
                'upsScheduleSelect'
            );

        if (!selector.value) {
            return;
        }

        if (
            !confirm(
                `Delete schedule "${selector.value}"?`
            )
        ) {
            return;
        }

        const data =
            getData();

        delete data.schedules[
            selector.value
        ];

        data.selectedSchedule = '';

        saveData(data);

        rebuildDropdown();
    }

    function exportSchedules() {

        const data =
            getData();

        const blob =
            new Blob(
                [
                    JSON.stringify(
                        data,
                        null,
                        2
                    )
                ],
                {
                    type:
                        'application/json'
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const a =
            document.createElement(
                'a'
            );

        a.href = url;

        a.download =
            'UPS_Timecard_Schedules.json';

        a.click();

        URL.revokeObjectURL(url);
    }

    function importSchedules() {

        const input =
            document.createElement(
                'input'
            );

        input.type = 'file';

        input.accept = '.json';

        input.onchange = function () {

            const file =
                input.files[0];

            if (!file) return;

            const reader =
                new FileReader();

            reader.onload =
                function (e) {

                    try {

                        const data =
                            JSON.parse(
                                e.target.result
                            );

                        saveData(data);

                        rebuildDropdown();

                        alert(
                            'Schedules imported.'
                        );

                    } catch {

                        alert(
                            'Invalid file.'
                        );
                    }
                };

            reader.readAsText(
                file
            );
        };

        input.click();
    }

    function rebuildDropdown() {

        const data =
            getData();

        const select =
            document.getElementById(
                'upsScheduleSelect'
            );

        if (!select) {
            return;
        }

        select.innerHTML = '';

        Object.keys(
            data.schedules
        ).forEach(name => {

            const option =
                document.createElement(
                    'option'
                );

            option.value = name;

            option.textContent =
                name;

            select.appendChild(
                option
            );
        });

        if (
            data.selectedSchedule &&
            data.schedules[
                data.selectedSchedule
            ]
        ) {
            select.value =
                data.selectedSchedule;
        }
    }

    function createButton(
        text,
        top,
        color,
        handler
    ) {

        const button =
            document.createElement(
                'button'
            );

        button.textContent =
            text;

        Object.assign(
            button.style,
            {
                position: 'fixed',
                right: '20px',
                top,
                zIndex: '99999',
                width: '180px',
                padding: '10px',
                backgroundColor:
                    color,
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
            }
        );

        button.onclick =
            handler;

        document.body.appendChild(
            button
        );
    }

    const selector =
        document.createElement(
            'select'
        );

    selector.id =
        'upsScheduleSelect';

    Object.assign(
        selector.style,
        {
            position: 'fixed',
            top: '60px',
            right: '20px',
            width: '180px',
            zIndex: '99999'
        }
    );

    selector.addEventListener(
        'change',
        function () {

            const data =
                getData();

            data.selectedSchedule =
                this.value;

            saveData(data);
        }
    );

    document.body.appendChild(
        selector
    );

    rebuildDropdown();

    createButton(
        '⚡ Fill Timecard',
        '100px',
        '#0066cc',
        fillTimecard
    );

    createButton(
        '⚙ Add / Update',
        '145px',
        '#28a745',
        configureSchedule
    );

    createButton(
        '📤 Export',
        '190px',
        '#6f42c1',
        exportSchedules
    );

    createButton(
        '📥 Import',
        '235px',
        '#fd7e14',
        importSchedules
    );

    createButton(
        '🗑 Delete Schedule',
        '280px',
        '#dc3545',
        deleteSchedule
    );

})();
