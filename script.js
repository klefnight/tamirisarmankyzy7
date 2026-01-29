document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("birth");
  const btn = document.getElementById("calcBtn");
  const error = document.getElementById("error");
  const result = document.getElementById("result");

  btn.addEventListener("click", calculate);

  function calculate() {
    error.textContent = "";

    const value = input.value.trim();
    const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

    if (!match) {
      error.textContent = "Введите дату в формате ДД.ММ.ГГГГ";
      result.classList.add("hidden");
      return;
    }

    const day = parseInt(match[1], 10);   // 01 → 1
    const month = match[2];
    const year = match[3];

    const digits = `${match[1]}${month}${year}`;

    // С1 — сумма всех цифр даты
    const S1 = sumDigits(digits);

    // С2 — сумма цифр S1 (ОДИН раз)
    const S2 = sumDigits(String(S1));

    // С3 — |S1 − 2 × ДЕНЬ| (тетрадно!)
    const S3 = Math.abs(S1 - 2 * day);

    // С4 — сумма цифр S3 (ОДИН раз)
    const S4 = sumDigits(String(S3));

    // Собираем ВСЕ цифры для квадрата
    const allDigits = digits + S1 + S2 + S3 + S4;

    const counts = countDigits(allDigits);

    // вывод
    document.getElementById("outDate").textContent = value;
    document.getElementById("outExtra").textContent = `${S1}, ${S2}, ${S3}, ${S4}`;
    document.getElementById("outDestiny").textContent = destiny(digits);

    for (let i = 1; i <= 9; i++) {
      document.getElementById(`c${i}`).textContent =
        counts[i] ? String(i).repeat(counts[i]) : "—";
    }

    result.classList.remove("hidden");
  }

  function sumDigits(str) {
    return str.split("").reduce((s, n) => s + Number(n), 0);
  }

  function countDigits(str) {
    const res = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
    for (const ch of str) {
      if (res[ch] !== undefined) res[ch]++;
    }
    return res;
  }

  function destiny(str) {
    let s = sumDigits(str);
    while (s > 9) s = sumDigits(String(s));
    return s;
  }
});
