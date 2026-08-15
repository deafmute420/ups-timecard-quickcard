# UPS Activity System Quick Card

A Tampermonkey userscript that restores Quick Card-style functionality for the UPS Activity System.

The script allows technicians to save multiple schedules, switch between them using a dropdown menu, and automatically populate timecards with a single click.

---

## Features

### Timecard Automation

- Fill Timecard with one click
- Only appears on the UPS Timecard page
- Automatically fills Report To Work
- Automatically fills Finish Work
- Automatically fills schedule rows
- Automatically clears unused rows

---

### Multi-Schedule Support

- Save multiple schedules
- Select schedules from a dropdown
- Edit existing schedules
- Delete schedules
- Switch between schedules instantly

Examples:

- Night Shift
- Day Shift
- Training
- Meeting Day
- Project Work
- Vacation Coverage

---

### Smart Row Detection

The script automatically detects how many rows are available on the UPS Timecard page.

Benefits:

- Supports schedules of any length
- Future-proof if UPS changes row counts
- No hardcoded row limits

When creating a schedule:

```text
Row 1 Time
Row 2 Time
Row 3 Time
...
```

Leave the Time field blank and click OK when finished.

Example:

```text
Row 7 Time: 22:15

Row 8 Time:
```

Click OK on the blank Row 8 prompt and schedule entry ends automatically.

---

### Import / Export

#### Export

Click:

```text
📤 Export
```

A backup file is downloaded:

```text
UPS_Timecard_Schedules.json
```

This file contains all saved schedules.

#### Import

Click:

```text
📥 Import
```

Select a previously exported:

```text
UPS_Timecard_Schedules.json
```

file.

All schedules are restored automatically.

---

### Automatic Updates

Updates are hosted through GitHub.

When a new version is released:

1. Tampermonkey detects the update.
2. The user is prompted to update.
3. Existing schedules remain intact.

---

## Installation

### Prerequisites

Install:

- Tampermonkey

### Install Script

Open:

```text
https://github.com/deafmute420/ups-timecard-quickcard/raw/main/ups-timecard-quickcard.user.js
```

Tampermonkey should automatically offer to install the script.

---

## Initial Setup

1. Open the UPS Activity System Timecard page.
2. Click:

```text
⚙ Add / Update
```

3. Enter a schedule name.

Example:

```text
Night Shift
```

4. Enter:

```text
Report To Work
Finish Work
```

5. Enter rows until finished.

Example:

```text
15:00
100TSGW

17:00
130TSGW
```

6. Leave a Time field blank when done.

7. Click:

```text
⚡ Fill Timecard
```

to test.

---

## Daily Usage

1. Open your Timecard.
2. Select a schedule from the dropdown.

Example:

```text
Night Shift
```

3. Click:

```text
⚡ Fill Timecard
```

4. Review entries.
5. Submit for Approval.

---

## Schedule Management

### Create a Schedule

Click:

```text
⚙ Add / Update
```

Enter a new schedule name.

Example:

```text
Training
```

A new schedule will be created.

### Edit a Schedule

1. Select the schedule.
2. Click:

```text
⚙ Add / Update
```

3. Modify values.
4. Save.

### Delete a Schedule

1. Select a schedule.
2. Click:

```text
🗑 Delete Schedule
```

3. Confirm deletion.

---

## Common Work Codes

The configuration helper displays these codes during schedule setup.

### Internal Codes

| Code | Description |
|--------|-------------|
| 100TSGW | INT TECH SUPPORT |
| 130TSGW | INT BREAK |
| 120TSGW | INT SELF DEVELOP |
| 950TSGW | TSG MEETING |

### External Codes

| Code | Description |
|--------|-------------|
| 200TSGX | EXT TECH SUPPORT |
| 230TSGX | EXT BREAK |
| 220TSGX | EXT SELF DEVELOP |

### Other Codes

| Code | Description |
|--------|-------------|
| 0900 | Non-Work/Lunch |

---

## Data Storage

Schedules are stored locally in the browser using Local Storage.

Schedules survive:

- Browser restart
- Computer reboot
- Browser updates
- Userscript updates

Schedules may be lost if:

- Browser storage is cleared
- Site data is deleted
- Browser profile is reset

Use Export periodically to create backups.

---

## Version History

### 4.1.0

- Added automatic row detection
- Added dynamic schedule length support
- Configuration ends when a blank row is entered
- Automatically clears unused rows
- Added work code reference during schedule setup

### 3.2.1

- Added support for multiple schedules
- Added schedule selection dropdown
- Added schedule import functionality
- Added schedule export functionality
- Added schedule deletion
- Reworked storage format for multi-profile support

### 3.0.0

- Added schedule configuration
- Added import/export support
- Added reset functionality
- Added page detection

### 2.0.0

- Added configurable schedule support

### 1.0.0

- Initial Quick Card replacement

---

## Disclaimer

This userscript is an unofficial productivity tool intended to simplify timecard entry within the UPS Activity System.

Always review all entries before submitting a timecard for approval.
