diff --git a/static/app.js b/static/app.js
new file mode 100644
index 0000000000000000000000000000000000000000..2f418983a3898c0e527baacd9614d9dfde2c5e16
--- /dev/null
+++ b/static/app.js
@@ -0,0 +1,170 @@
+const descriptions = {
+  1: "Единицы отвечают за характер и силу воли. Чем их больше — тем увереннее лидерские качества.",
+  2: "Двойки символизируют энергию и чувствительность, показывают эмоциональный потенциал.",
+  3: "Тройки связаны с интересом к знаниям, любознательностью и общением.",
+  4: "Четвёрки описывают здоровье и устойчивость организма.",
+  5: "Пятёрки показывают логику, аналитическое мышление и гибкость.",
+  6: "Шестёрки отражают трудолюбие, дисциплину и практичность.",
+  7: "Семёрки отвечают за удачу, интуицию и защиту.",
+  8: "Восьмёрки символизируют чувство долга и ответственность.",
+  9: "Девятки показывают память, интеллект и широту мышления."
+};
+
+const extraDescriptions = {
+  sum1: "Первое число — общий энергетический потенциал даты.",
+  sum2: "Второе число — ключевой внутренний ресурс, который раскрывает душу.",
+  sum3: "Третье число — коррекция по первой цифре даты, показывает уроки характера.",
+  sum4: "Четвёртое число — суть предназначения, выведенная из коррекции."
+};
+
+const destinyDescriptions = {
+  1: "Путь лидера: самостоятельность и смелость.",
+  2: "Путь дипломата: гармония и партнёрство.",
+  3: "Путь вдохновения: творчество и лёгкость.",
+  4: "Путь устойчивости: порядок и надёжность.",
+  5: "Путь свободы: перемены и любознательность.",
+  6: "Путь заботы: гармония в семье и красота.",
+  7: "Путь мудреца: интуиция и поиск смысла.",
+  8: "Путь силы: достижения и материальный успех.",
+  9: "Путь гуманиста: сострадание и служение людям."
+};
+
+const sideDescriptions = {
+  temperament: "Сумма 2-4-6 показывает энергичность и тип реакции.",
+  goal: "Сумма 1-4-7 раскрывает целеустремлённость и вектор развития.",
+  family: "Сумма 2-5-8 говорит о семейных ценностях и поддержке.",
+  habits: "Сумма 3-6-9 отражает образ жизни и устойчивость привычек.",
+  spirituality: "Сумма 3-5-7 описывает внутренние ценности и духовные ориентиры."
+};
+
+const form = document.getElementById("calculator-form");
+const birthInput = document.getElementById("birth-date");
+const formError = document.getElementById("form-error");
+const results = document.getElementById("results");
+
+function getDigits(value) {
+  return value.replace(/\D/g, "").split("").map(Number);
+}
+
+function reduceToSingleDigit(number) {
+  if (number <= 9) return number;
+  return getDigits(String(number)).reduce((acc, digit) => acc + digit, 0);
+}
+
+function calculate(birthDate) {
+  const digits = getDigits(birthDate);
+  if (!digits.length) return null;
+
+  const sum1 = digits.reduce((acc, digit) => acc + digit, 0);
+  const sum2 = getDigits(String(sum1)).reduce((acc, digit) => acc + digit, 0);
+  const firstDigit = digits[0];
+  const sum3 = Math.abs(sum1 - 2 * firstDigit);
+  const sum4 = getDigits(String(sum3)).reduce((acc, digit) => acc + digit, 0);
+
+  const fullDigits = [
+    ...digits,
+    ...getDigits(String(sum1)),
+    ...getDigits(String(sum2)),
+    ...getDigits(String(sum3)),
+    ...getDigits(String(sum4))
+  ];
+
+  const matrix = {
+    1: "",
+    2: "",
+    3: "",
+    4: "",
+    5: "",
+    6: "",
+    7: "",
+    8: "",
+    9: ""
+  };
+
+  fullDigits.forEach((digit) => {
+    if (matrix[digit] !== undefined) {
+      matrix[digit] += String(digit);
+    }
+  });
+
+  const destiny = reduceToSingleDigit(sum2);
+
+  const counts = Object.fromEntries(
+    Object.entries(matrix).map(([key, value]) => [key, value.length])
+  );
+
+  return {
+    matrix,
+    sum1,
+    sum2,
+    sum3,
+    sum4,
+    destiny,
+    temperament: counts[2] + counts[4] + counts[6],
+    goal: counts[1] + counts[4] + counts[7],
+    family: counts[2] + counts[5] + counts[8],
+    habits: counts[3] + counts[6] + counts[9],
+    spirituality: counts[3] + counts[5] + counts[7]
+  };
+}
+
+function updateCell(number, value) {
+  const cell = document.querySelector(`.cell[data-number="${number}"]`);
+  if (!cell) return;
+  cell.querySelector(".cell__value").textContent = value || "—";
+  cell.querySelector(".desc").textContent = descriptions[number] || "";
+}
+
+function updateSide(id, value) {
+  document.getElementById(id).textContent = value;
+  document.getElementById(`${id}-desc`).textContent = sideDescriptions[id];
+}
+
+function updateExtra(id, value) {
+  document.getElementById(id).textContent = value;
+  document.getElementById(`${id}-desc`).textContent = extraDescriptions[id];
+}
+
+function setResults(data, birthDate) {
+  document.getElementById("summary-date").textContent = birthDate || "—";
+  document.getElementById("summary-destiny").textContent = data.destiny;
+  document.getElementById("summary-destiny-desc").textContent =
+    destinyDescriptions[data.destiny] || "";
+
+  updateExtra("sum1", data.sum1);
+  updateExtra("sum2", data.sum2);
+  updateExtra("sum3", data.sum3);
+  updateExtra("sum4", data.sum4);
+
+  updateCell(1, data.matrix[1]);
+  updateCell(2, data.matrix[2]);
+  updateCell(3, data.matrix[3]);
+  updateCell(4, data.matrix[4]);
+  updateCell(5, data.matrix[5]);
+  updateCell(6, data.matrix[6]);
+  updateCell(7, data.matrix[7]);
+  updateCell(8, data.matrix[8]);
+  updateCell(9, data.matrix[9]);
+
+  updateSide("temperament", data.temperament);
+  updateSide("goal", data.goal);
+  updateSide("family", data.family);
+  updateSide("habits", data.habits);
+  updateSide("spirituality", data.spirituality);
+}
+
+form.addEventListener("submit", (event) => {
+  event.preventDefault();
+  const birthDate = birthInput.value.trim();
+  const data = calculate(birthDate);
+
+  if (!data) {
+    formError.textContent = "Введите дату рождения в формате ДД.ММ.ГГГГ.";
+    results.classList.remove("is-visible");
+    return;
+  }
+
+  formError.textContent = "";
+  setResults(data, birthDate);
+  results.classList.add("is-visible");
+});
