// ==UserScript==
// @name         UPS Activity System Quick Card
// @namespace    UPS
// @version      3.0
// @description  Personal Quick Card replacement for UPS Activity System
// @match        *://actsys.inside.ups.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Only run on the Timecard page
    const isTimecardPage =
        document.querySelector('[name="ReportIn"]') &&
        document.querySelector('[name="Finish"]');

    if (!isTimecardPage) {
        return;
    }

    const STORAGE_KEY = 'ups_timecard_schedule';

    function getSchedule() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    }

    function saveSchedule(schedule) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(schedule)
        );
    }

    function configureSchedule() {

        const current = getSchedule() || {
            reportIn: '',
            finish: '',
            rows: []
        };

        const reportIn = prompt(
            'Report To Work Time (Example: 15:00)',
            current.reportIn || ''
        );

        if (reportIn === null) return;

        const finish = prompt(
            'Finish Work Time (Example: 00:00)',
            current.finish || ''
        );

        if (finish === null) return;

        const rows = [];

        for (let i = 1; i <= 7; i++) {

            const existing = current.rows[i - 1] || {};

            const time = prompt(
                `Row ${i} Time (leave blank if unused)`,
                existing.time || ''
            );

            if (time === null) return;

            const code = prompt(
                `Row ${i} Code

Examples:
100TSGW = INT TECH SUPPORT
130TSGW = INT BREAK
120TSGW = INT SELF DEVELOP

200TSGX = EXT TECH SUPPORT
230TSGX = EXT BREAK

950TSGW = TSG MEETING
0900 = Non-Work/Lunch`,
                existing.code || ''
            );

            if (code === null) return;

            rows.push({
                time,
                code
            });
        }

        saveSchedule({
            reportIn,
            finish,
            rows
        });

        alert('Schedule saved successfully.');
    }

    function fillTimecard() {

        const schedule = getSchedule();

        if (!schedule) {
            alert(
                'No schedule configured.\n\nClick "Configure Schedule" first.'
            );
            return;
        }

        const reportInField =
            document.querySelector('[name="ReportIn"]');

        const finishField =
            document.querySelector('[name="Finish"]');

        if (reportInField) {
            reportInField.value = schedule.reportIn;
        }

        if (finishField) {
            finishField.value = schedule.finish;
        }

        schedule.rows.forEach((entry, index) => {

            const row = index + 1;

            const timeField =
                document.querySelector(`[name="Time_${row}"]`);

            const codeField =
                document.querySelector(`[name="Code_${row}"]`);

            if (timeField) {
                timeField.value = entry.time || '';
            }

            if (codeField) {
                codeField.value = entry.code || '';
            }
        });

        alert('Timecard filled.');
    }

    function exportSchedule() {

        const schedule = getSchedule();

        if (!schedule) {
            alert('No schedule configured.');
            return;
        }

        const data =
            JSON.stringify(schedule, null, 2);

        const blob = new Blob(
            [data],
            { type: 'application/json' }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement('a');

        link.href = url;
        link.download =
            'UPS_Timecard_Schedule.json';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }

    function importSchedule() {

        const input =
            document.createElement('input');

        input.type = 'file';
        input.accept = '.json';

        input.addEventListener(
            'change',
            function () {

                const file = this.files[0];

                if (!file) {
                    return;
                }

                const reader =
                    new FileReader();

                reader.onload = function (e) {

                    try {

                        const schedule =
                            JSON.parse(
                                e.target.result
                            );

                        if (
                            !schedule.reportIn ||
                            !schedule.finish ||
                            !Array.isArray(
                                schedule.rows
                            )
                        ) {
                            throw new Error();
                        }

                        saveSchedule(schedule);

                        alert(
                            'Schedule imported successfully.'
                        );

                    } catch {

                        alert(
                            'Invalid schedule file.'
                        );

                    }

                };

                reader.readAsText(file);

            }
        );

        input.click();
    }

    function resetSchedule() {

        const confirmed = confirm(
            'Delete your saved schedule?'
        );

        if (!confirmed) {
            return;
        }

        localStorage.removeItem(
            STORAGE_KEY
        );

        alert(
            'Schedule deleted.'
        );
    }

    function createButton(
        text,
        top,
        color,
        handler
    ) {

        const button =
            document.createElement('button');

        button.textContent = text;

        Object.assign(button.style, {
            position: 'fixed',
            top,
            right: '20px',
            zIndex: '99999',
            padding: '10px 16px',
            backgroundColor: color,
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '170px'
        });

        button.addEventListener(
            'click',
            handler
        );

        document.body.appendChild(
            button
        );
    }

    createButton(
        '⚡ Fill Timecard',
        '100px',
        '#0066cc',
        fillTimecard
    );

    createButton(
        '⚙ Configure',
        '145px',
        '#28a745',
        configureSchedule
    );

    createButton(
        '📤 Export',
        '190px',
        '#6f42c1',
        exportSchedule
    );

    createButton(
        '📥 Import',
        '235px',
        '#fd7e14',
        importSchedule
    );

    createButton(
        '🗑 Reset',
        '280px',
        '#dc3545',
        resetSchedule
    );

})();
