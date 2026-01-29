// ====== Трактовки по количеству цифр (можешь менять текст) ======
const interpretations = {
  1: [
    "Единиц нет: мягкость, избегание конфликтов, важно учиться отстаивать себя.",
    "1: спокойный характер, гибкость.",
    "11: уверенность растёт, есть воля.",
    "111: сильный характер, лидерские качества.",
    "1111+: очень мощная воля, важно не давить на других."
  ],
  2: [
    "Двоек нет: энергия быстро расходуется, нужен режим отдыха.",
    "2: чувствительность, тонкая энергетика.",
    "22: хороший энергетический запас.",
    "222: сильная энергия, эмоциональность.",
    "2222+: избыток энергии — важно направлять в дело."
  ],
  3: [
    "Троек нет: интерес включается не сразу, нужна мотивация.",
    "3: любознательность, коммуникация.",
    "33: хороший умственный интерес, лёгкость в обучении.",
    "333: сильные способности к знаниям/общению.",
    "3333+: очень яркий интеллект, важно не распыляться."
  ],
  4: [
    "Четвёрок нет: здоровье требует внимания и дисциплины.",
    "4: нормальная выносливость.",
    "44: крепкая база здоровья.",
    "444: сильная выносливость.",
    "4444+: очень крепкий ресурс, важно не перегружаться."
  ],
  5: [
    "Пятёрок нет: логика включается через опыт, важно тренировать анализ.",
    "5: нормальная логика, практичность.",
    "55: хорошее мышление, рассудительность.",
    "555: сильная логика, аналитика.",
    "5555+: очень мощный ум, важно не уходить в холодность."
  ],
  6: [
    "Шестёрок нет: дисциплину нужно развивать осознанно.",
    "6: трудолюбие проявляется волнами.",
    "66: устойчивое трудолюбие.",
    "666: сильная работоспособность.",
    "6666+: трудоголизм — нужен баланс."
  ],
  7: [
    "Семёрок нет: удача через труд и правильные решения.",
    "7: удача иногда помогает.",
    "77: хорошая защита/везение.",
    "777: сильная удача, интуиция.",
    "7777+: очень мощная защита — важно быть благодарным."
  ],
  8: [
    "Восьмёрок нет: ответственность учится постепенно.",
    "8: чувство долга проявляется в важных делах.",
    "88: высокая ответственность.",
    "888: сильный долг, надёжность.",
    "8888+: сверхответственность — не тащи всё один(а)."
  ],
  9: [
    "Девяток нет: память тренируется практикой и режимом.",
    "9: нормальная память.",
    "99: хорошая память, интеллект.",
    "999: сильная память и мышление.",
    "9999+: очень сильный ум — важна эмоциональная разрядка."
  ]
};

function pickInterpretation(digit, count) {
  const arr = interpretations[digit];
  if (!arr) return "";
  if (count <= 0) return arr[0];
  if (count === 1) return arr[1];
  if (count === 2) return arr[2];
  if (count === 3) return arr[3];
  return arr[4];
}

// ====== Дата: парсинг и проверка ======
function isLeapYear(y){
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}

function daysInMonth(m, y){
  const table = [31, (isLeapYear(y) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return table[m - 1] ?? 0;
}

// Принимаем "01.02.2000" / "1.2.2000" / "01 02 2000" / "01-02-2000"
function parseBirth(input){
  const raw = String(input || "").trim();
  const cleaned = raw.replace(/\s+/g, ".").replace(/[-/]/g, "."); // приводим к точкам
  const m = cleaned.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!m) return { ok:false, error:"Введите дату в формате ДД.ММ.ГГГГ (например 01.02.2000)" };

  const d = Number(m[1]);
  const mo = Number(m[2]);
  const y = Number(m[3]);

  if (y < 1900 || y > 2100) return { ok:false, error:"Год должен быть в пределах 1900–2100" };
  if (mo < 1 || mo > 12) return { ok:false, error:"Месяц должен быть 1–12" };

  const maxD = daysInMonth(mo, y);
  if (d < 1 || d > maxD) return { ok:false, error:`В этом месяце максимум ${maxD} дней` };

  const dd = String(d).padStart(2,"0");
  const mm = String(mo).padStart(2,"0");
  const yyyy = String(y);

  return {
    ok:true,
    d, mo, y,
    pretty: `${dd}.${mm}.${yyyy}`,
    digits: `${dd}${mm}${yyyy}` // без точек
  };
}

// ====== Математика "тетрадного" расчёта ======
function sumDigits(nStr){
  return String(nStr).split("").reduce((a,ch)=>a + (ch >= "0" && ch <= "9" ? Number(ch) : 0), 0);
}

function oneStepSumToNumber(n){
  // суммируем цифры один раз: 14 -> 1+4=5, 5 -> 5
  const s = Math.abs(Number(n));
  if (s < 10) return s;
  return sumDigits(String(s));
}

// Число судьбы (life path) — сводим дату к 1 цифре, но сохраняем 11/22/33 (по желанию)
function destinyNumber(dateDigits){
  let s = sumDigits(dateDigits);
  while (s > 9 && s !== 11 && s !== 22 && s !== 33) {
    s = sumDigits(String(s));
  }
  return s;
}

function buildCounts(allDigits){
  const counts = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
  for (const ch of String(allDigits)) {
    if (ch >= "1" && ch <= "9") counts[ch] += 1; // нули не учитываем
  }
  return counts;
}

function repeatDigit(digit, count){
  if (count <= 0) return "—";
  return String(digit).repeat(count);
}

function lineSum(counts, arr){
  return arr.reduce((a,d)=>a + (counts[d] || 0), 0);
}

// ====== UI ======
const birthEl = document.getElementById("birth");
const btn = document.getElementById("calcBtn");
const errEl = document.getElementById("error");
const resultEl = document.getElementById("result");

function setText(id, value){
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function render(dateInfo){
  // 1) Доп. числа (тетрадный вариант)
  const dateDigits = dateInfo.digits; // DDMMYYYY
  const s1 = sumDigits(dateDigits);              // С1
  const s2 = oneStepSumToNumber(s1);             // С2 (один шаг)
  const day = dateInfo.d;                        // ВАЖНО: день как число (01 -> 1)
  const s3 = Math.abs(s1 - 2 * day);             // С3
  const s4 = oneStepSumToNumber(s3);             // С4 (один шаг)

  // 2) Число судьбы
  const dest = destinyNumber(dateDigits);

  // 3) Цифры для квадрата: цифры даты + цифры доп. чисел
  const allDigits = `${dateDigits}${s1}${s2}${s3}${s4}`;
  const counts = buildCounts(allDigits);

  // 4) Верхняя панель
  setText("outDate", dateInfo.pretty);
  setText("outExtra", `${s1}, ${s2}, ${s3}, ${s4}`);
  setText("outDestiny", String(dest));

  // 5) Заполняем клетки 1-9
  for (let d=1; d<=9; d++){
    const c = counts[d];
    setText(`c${d}`, repeatDigit(d, c));
    const desc = pickInterpretation(d, c);
    const descEl = document.getElementById(`d${d}`);
    if (descEl) descEl.textContent = desc;
  }

  // 6) Линии/показатели
  setText("outTemper", String(lineSum(counts, [3,5,7])));  // темперамент (3+5+7)
  setText("lineGoal",  String(lineSum(counts, [1,4,7])));  // цель
  setText("lineFamily",String(lineSum(counts, [2,5,8])));  // семья
  setText("lineHabits",String(lineSum(counts, [3,6,9])));  // привычки
  setText("lineEsteem",String(lineSum(counts, [1,2,3])));  // самооценка
  setText("lineLife",  String(lineSum(counts, [4,5,6])));  // быт
  setText("lineTalent",String(lineSum(counts, [7,8,9])));  // талант
  setText("lineSpirit",String(lineSum(counts, [1,5,9])));  // духовность

  // 7) Показ с анимацией
  resultEl.classList.remove("hidden");
  // перезапуск анимации
  resultEl.style.animation = "none";
  // eslint-disable-next-line no-unused-expressions
  resultEl.offsetHeight;
  resultEl.style.animation = "";
}

function onCalc(){
  errEl.textContent = "";
  const parsed = parseBirth(birthEl.value);
  if (!parsed.ok){
    resultEl.classList.add("hidden");
    errEl.textContent = parsed.error;
    return;
  }
  render(parsed);
}

btn.addEventListener("click", onCalc);
birthEl.addEventListener("keydown", (e)=>{
  if (e.key === "Enter") onCalc();
});

// Авто-формат по мере ввода (мягко): 01022000 -> 01.02.2000
birthEl.addEventListener("input", ()=>{
  const v = birthEl.value.replace(/[^\d]/g,"");
  if (v.length === 8){
    const dd = v.slice(0,2), mm = v.slice(2,4), yy = v.slice(4,8);
    birthEl.value = `${dd}.${mm}.${yy}`;
  }
});
