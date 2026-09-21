# Sistem Cek Nilai Siswa (Portal Akademik)

A simple web app for recording and managing students' semester exam scores. Enter a student's name and their subject scores, and the app calculates the average and keeps everything saved in your browser, so the data is still there after a refresh.

Built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no backend, no build step.

## Features

- **Add student records:** enter a student's name together with any number of subjects and scores.
- **Default subjects:** the form starts with Matematika, Bahasa Indonesia, Ilmu Pengetahuan Alam (IPA), and Bahasa Inggris. Rename them, remove them, or add more.
- **Dynamic subject rows:** add as many subjects as needed with "+ Tambah mata pelajaran". At least one subject must remain.
- **Automatic average:** each student card shows the average score, rounded to one decimal place.
- **Score color coding:** scores are highlighted by range, so high and low results are easy to spot.
- **Edit and delete:** update a student's name or scores, or remove a record (with a confirmation prompt).
- **Persistent storage:** all data is saved to `localStorage`, so it survives page reloads.
- **Form validation:** clear error messages for a missing student name, a missing subject name, an empty score, or a score outside 0 - 100.
- **Empty state:** a friendly message is shown until the first record is added.
- **Accessible markup:** form controls and icon buttons have `aria-label`s, and error messages use `role="alert"`.

## Getting Started

No installation is needed.

1. Download or clone the project.
2. Open `index.html` in any modern browser.

## Project Structure

```
.
├── index.html   # Page structure and form
├── style.css    # Styling
└── script.js    # App logic: validation, rendering, localStorage
```

`script.js` is loaded with `defer`, and `style.css` must define a `.hidden { display: none; }` rule, which the error message and empty state depend on.

## How to Use

1. Type the student's name.
2. Fill in a score (0 - 100) for each subject. Edit the subject names, add rows, or remove rows as needed.
3. Click **Simpan Nilai** to save. The student appears in the **Daftar Siswa** list with a score table and average.
4. Use **Edit** on a card to change a record (the form switches to **Simpan Perubahan**, and **Batal** cancels), or **Hapus** to delete it.
5. Use **Reset** to clear the form.

## Data Storage

Records are stored in the browser's `localStorage` under the key `dataSiswa`, as an array of objects:

```json
[
  {
    "id": 1758423900000,
    "nama": "Budi Santoso",
    "nilai": [
      { "mapel": "Matematika", "skor": 85 },
      { "mapel": "Bahasa Indonesia", "skor": 90 }
    ]
  }
]
```

Because data lives only in your browser, it is specific to that browser and device, and it is lost if you clear the site's data.

## Tech Stack

- HTML5
- CSS3 (Inter font via Google Fonts)
- JavaScript (ES6+, no libraries)