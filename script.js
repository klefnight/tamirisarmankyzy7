document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("birth");
  const btn = document.getElementById("calcBtn");
  const error = document.getElementById("error");
  const result = document.getElementById("result");

  btn.addEventListener("click", calculate);

  function calculate(){
    error.textContent = "";

    const v = input.value.trim();
    const m = v.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

    if(!m){
      error.textContent = "Формат даты: ДД.ММ.ГГГГ";
      result.classList.add("hidden");
      return;
    }

    const day = parseInt(m[1],10); // 01 → 1
    const digits = m[1] + m[2] + m[3];

    const S1 = sum(digits);
    const S2 = sum(String(S1));
    const S3 = Math.abs(S1 - 2 * day); // ТЕТРАДНО!
    const S4 = sum(String(S3));

    const all = digits + S1 + S2 + S3 + S4;
    const c = count(all);

    document.getElementById("outDate").textContent = v;
    document.getElementById("outExtra").textContent = `${S1}, ${S2}, ${S3}, ${S4}`;
    document.getElementById("outDestiny").textContent = destiny(digits);

    for(let i=1;i<=9;i++){
      document.getElementById("c"+i).textContent =
        c[i] ? String(i).repeat(c[i]) : "—";
    }

    document.getElementById("outTemper").textContent = line(c,[3,5,7]);
    document.getElementById("lineGoal").textContent = line(c,[1,4,7]);
    document.getElementById("lineFamily").textContent = line(c,[2,5,8]);
    document.getElementById("lineHabits").textContent = line(c,[3,6,9]);
    document.getElementById("lineEsteem").textContent = line(c,[1,2,3]);
    document.getElementById("lineLife").textContent = line(c,[4,5,6]);
    document.getElementById("lineTalent").textContent = line(c,[7,8,9]);
    document.getElementById("lineSpirit").textContent = line(c,[1,5,9]);

    result.classList.remove("hidden");

    // волна анимации
    document.querySelectorAll(".cell").forEach((cell,i)=>{
      cell.style.animation = "none";
      cell.style.setProperty("--delay", `${i*50}ms`);
      void cell.offsetHeight;
      cell.style.animation = "";
    });
  }

  function sum(s){
    return s.split("").reduce((a,b)=>a+Number(b),0);
  }

  function count(s){
    const r={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
    for(const ch of s) if(r[ch]!==undefined) r[ch]++;
    return r;
  }

  function destiny(s){
    let n=sum(s);
    while(n>9) n=sum(String(n));
    return n;
  }

  function line(c,a){
    return a.reduce((s,n)=>s+c[n],0);
  }
});
