function updateGokuImage(speed) {
  const goku = document.getElementById("gokuImage");
  const levelText = document.getElementById("gokuLevelText");

  if (speed < 5) {
    goku.src = "images/goku_base.jpg";
    levelText.textContent = "Muy débil 🐢";
  } else if (speed < 50) {
    goku.src = "images/ssj1.jpg";
    levelText.textContent = "Entrenando 💪";
  } else if (speed < 80) {
    goku.src = "images/ssj2.jpg";
    levelText.textContent = "Saiyan medio ⚡";
  } else if (speed < 150) {
    goku.src = "images/ssj_blue.jpg";
    levelText.textContent = "¡Super Saiyan! 🔥";
  } else {
    goku.src = "images/ultra_instinct.jpg";
    levelText.textContent = "¡Ultra Instinto! 🚀";
  }
}

async function measurePing(url = "https://www.google.com") {
  const start = performance.now();
  try {
    // Para evitar CORS, hacemos fetch sin esperar la respuesta
    await fetch(url + "?ping=" + Math.random(), { mode: "no-cors" });
  } catch (e) {
    // Ignorar errores porque modo no-cors no devuelve datos
  }
  const end = performance.now();
  return Math.round(end - start);
}

async function testSpeedProgressive() {
  const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg";
  const response = await fetch(imageUrl + "?nocache=" + Math.random());
  const reader = response.body.getReader();

  let totalBytes = 0;
  const startTime = Date.now();

  // Empezamos la medición del ping en paralelo
  const pingPromise = measurePing();

  function update() {
    const duration = (Date.now() - startTime) / 1000;
    const bitsLoaded = totalBytes * 8;
    const speedMbps = bitsLoaded / duration / 1024 / 1024;
    document.getElementById("speed").textContent = `Velocidad: ${speedMbps.toFixed(2)} Mbps`;
    updateGokuImage(speedMbps);
  }


  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.length;
    update();
  }

   // Esperamos ping y lo mostramos
  const ping = await pingPromise;
  document.getElementById("ping").textContent = `Ping: ${ping} ms`;
}

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("speed").textContent = "Midiendo...";
  document.getElementById("ping").textContent = "Midiendo...";
  document.getElementById("gokuLevelText").textContent = "Midiendo...";
  testSpeedProgressive();
});
