const KUNCI_STORAGE = "dataSiswa";

const mapelAwal = [
  "Matematika",
  "Bahasa Indonesia",
  "Ilmu Pengetahuan Alam (IPA)",
  "Bahasa Inggris"
];

const form = document.getElementById("gradeForm");
const namaInput = document.getElementById("namaInput");
const subjectRows = document.getElementById("subjectRows");
const addSubjectBtn = document.getElementById("addSubjectBtn");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const daftarSiswa = document.getElementById("daftarSiswa");
const studentList = document.getElementById("studentList");
const emptyState = document.getElementById("emptyState");

function ambilData() {
  try {
    const tersimpan = localStorage.getItem(KUNCI_STORAGE);
    if (tersimpan) {
      const hasil = JSON.parse(tersimpan);
      if (Array.isArray(hasil)) return hasil;
    }
  } catch (error) {
    console.warn("localStorage tidak bisa dibaca:", error);
  }
  return [];
}

function simpanData() {
  try {
    localStorage.setItem(KUNCI_STORAGE, JSON.stringify(dataSiswa));
  } catch (error) {
    console.warn("localStorage tidak bisa disimpan:", error);
  }
}

let dataSiswa = ambilData();

let idSedangDiedit = null;

function hitungRataRata(daftarNilai) {
  let total = 0;
  daftarNilai.forEach(function (item) {
    total += item.skor;
  });
  return (total / daftarNilai.length).toFixed(1);
}

function buatBaris(mapel = "", skor = "") {
  const row = document.createElement("div");
  row.className = "baris-mapel";

  const mapelInput = document.createElement("input");
  mapelInput.type = "text";
  mapelInput.placeholder = "Mata pelajaran";
  mapelInput.value = mapel;
  mapelInput.autocomplete = "off";
  mapelInput.setAttribute("aria-label", "Nama mata pelajaran");
  mapelInput.className = "input input-mapel";

  const skorInput = document.createElement("input");
  skorInput.type = "number";
  skorInput.placeholder = "Nilai";
  skorInput.min = "0";
  skorInput.max = "100";
  skorInput.step = "any";
  skorInput.value = skor;
  skorInput.setAttribute("aria-label", "Nilai");
  skorInput.className = "input input-skor";

  const hapusBtn = document.createElement("button");
  hapusBtn.type = "button";
  hapusBtn.textContent = "\u2715";
  hapusBtn.setAttribute("aria-label", "Hapus mata pelajaran");
  hapusBtn.className = "tombol-hapus";
  hapusBtn.addEventListener("click", function () {
    if (subjectRows.children.length <= 1) {
      tampilkanError("Minimal harus ada satu mata pelajaran.");
      return;
    }
    sembunyikanError();
    row.remove();
  });

  row.append(mapelInput, skorInput, hapusBtn);
  return row;
}

function isiBarisAwal() {
  subjectRows.innerHTML = "";
  mapelAwal.forEach(function (mapel) {
    subjectRows.appendChild(buatBaris(mapel));
  });
}

function tampilkanError(pesan, fokusKe) {
  errorText.textContent = pesan;
  errorMessage.classList.remove("hidden");
  if (fokusKe) fokusKe.focus();
}

function sembunyikanError() {
  errorMessage.classList.add("hidden");
}

function kosongkanForm() {
  idSedangDiedit = null;
  namaInput.value = "";
  isiBarisAwal();
  submitBtn.textContent = "Simpan Nilai";
  resetBtn.textContent = "Reset";
  sembunyikanError();
  renderDaftar();
}

function masukModeEdit(siswa) {
  idSedangDiedit = siswa.id;
  namaInput.value = siswa.nama;

  subjectRows.innerHTML = "";
  siswa.nilai.forEach(function (item) {
    subjectRows.appendChild(buatBaris(item.mapel, item.skor));
  });

  submitBtn.textContent = "Simpan Perubahan";
  resetBtn.textContent = "Batal";
  sembunyikanError();
  renderDaftar();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  namaInput.focus();
}

function buatKartuSiswa(siswa) {
  const kartu = document.createElement("article");
  kartu.className = "hasil";
  if (siswa.id === idSedangDiedit) kartu.classList.add("hasil-diedit");

  const header = document.createElement("div");
  header.className = "hasil-header hasil-header-aksi";

  const info = document.createElement("div");

  const nama = document.createElement("h3");
  nama.className = "hasil-nama";
  nama.textContent = siswa.nama;

  const keterangan = document.createElement("p");
  keterangan.className = "hasil-keterangan";
  keterangan.textContent = siswa.nilai.length + " mata pelajaran";

  info.append(nama, keterangan);

  const tombolWrap = document.createElement("div");
  tombolWrap.className = "hasil-tombol";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.textContent = "Edit";
  editBtn.className = "tombol-kecil";
  editBtn.setAttribute("aria-label", "Edit nilai " + siswa.nama);
  editBtn.addEventListener("click", function () {
    masukModeEdit(siswa);
  });

  const hapusBtn = document.createElement("button");
  hapusBtn.type = "button";
  hapusBtn.textContent = "Hapus";
  hapusBtn.className = "tombol-kecil tombol-kecil-bahaya";
  hapusBtn.setAttribute("aria-label", "Hapus nilai " + siswa.nama);
  hapusBtn.addEventListener("click", function () {
    hapusSiswa(siswa.id);
  });

  tombolWrap.append(editBtn, hapusBtn);
  header.append(info, tombolWrap);

  const tabel = document.createElement("table");
  tabel.className = "tabel-nilai";
  tabel.innerHTML =
    '<thead><tr><th>Mata Pelajaran</th><th class="kolom-kanan">Nilai</th></tr></thead>';

  const tbody = document.createElement("tbody");
  siswa.nilai.forEach(function (item) {
    let kelasNilai = "";
    if (item.skor >= 90) kelasNilai = " nilai-tinggi";
    else if (item.skor >= 80) kelasNilai = " nilai-cukup";
    else if (item.skor < 75) kelasNilai = " nilai-rendah";

    const tdMapel = document.createElement("td");
    tdMapel.textContent = item.mapel;

    const tdSkor = document.createElement("td");
    tdSkor.className = "kolom-kanan" + kelasNilai;
    tdSkor.textContent = item.skor;

    const row = document.createElement("tr");
    row.append(tdMapel, tdSkor);
    tbody.appendChild(row);
  });

  const tfoot = document.createElement("tfoot");
  const rowRata = document.createElement("tr");

  const tdLabel = document.createElement("td");
  tdLabel.className = "rata-rata-label";
  tdLabel.textContent = "Rata-rata";

  const tdRata = document.createElement("td");
  tdRata.className = "kolom-kanan rata-rata-nilai";
  tdRata.textContent = hitungRataRata(siswa.nilai);

  rowRata.append(tdLabel, tdRata);
  tfoot.appendChild(rowRata);

  tabel.append(tbody, tfoot);
  kartu.append(header, tabel);
  return kartu;
}

function renderDaftar() {
  studentList.innerHTML = "";

  if (dataSiswa.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  dataSiswa.forEach(function (siswa) {
    studentList.appendChild(buatKartuSiswa(siswa));
  });
}

function hapusSiswa(id) {
  const siswa = dataSiswa.find(function (s) {
    return s.id === id;
  });
  if (!siswa) return;

  if (!confirm('Hapus data nilai "' + siswa.nama + '"?')) return;

  dataSiswa = dataSiswa.filter(function (s) {
    return s.id !== id;
  });
  simpanData();

  if (idSedangDiedit === id) {
    kosongkanForm();
  } else {
    renderDaftar();
  }
}

addSubjectBtn.addEventListener("click", function () {
  const barisBaru = buatBaris();
  subjectRows.appendChild(barisBaru);
  barisBaru.querySelector(".input-mapel").focus();
});

resetBtn.addEventListener("click", function () {
  kosongkanForm();
  namaInput.focus();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  sembunyikanError();

  const nama = namaInput.value.trim();
  if (!nama) {
    tampilkanError("Nama siswa belum diisi.", namaInput);
    return;
  }

  const daftarNilai = [];
  const baris = subjectRows.querySelectorAll(".baris-mapel");

  for (let i = 0; i < baris.length; i++) {
    const mapelEl = baris[i].querySelector(".input-mapel");
    const skorEl = baris[i].querySelector(".input-skor");
    const mapel = mapelEl.value.trim();
    const skorMentah = skorEl.value.trim();

    if (!mapel) {
      tampilkanError(
        "Nama mata pelajaran di baris " + (i + 1) + " belum diisi.",
        mapelEl
      );
      return;
    }
    if (skorMentah === "") {
      tampilkanError("Nilai " + mapel + " belum diisi.", skorEl);
      return;
    }

    const skor = Number(skorMentah);
    if (Number.isNaN(skor) || skor < 0 || skor > 100) {
      tampilkanError(
        "Nilai " + mapel + " harus berupa angka antara 0 sampai 100.",
        skorEl
      );
      return;
    }

    daftarNilai.push({ mapel: mapel, skor: skor });
  }

  if (idSedangDiedit === null) {
    dataSiswa.push({ id: Date.now(), nama: nama, nilai: daftarNilai });
  } else {
    dataSiswa = dataSiswa.map(function (s) {
      if (s.id === idSedangDiedit) {
        return { id: s.id, nama: nama, nilai: daftarNilai };
      }
      return s;
    });
  }

  simpanData();
  kosongkanForm();
  daftarSiswa.scrollIntoView({ behavior: "smooth", block: "start" });
});

isiBarisAwal();
renderDaftar();
