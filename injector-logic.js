async function inject() {
  const hash = document.getElementById("hash").value.trim();
  const routing = document.getElementById("routing").value.trim();
  const account = document.getElementById("account").value.trim();
  const balance = document.getElementById("balance").value.trim();
  const output = document.getElementById("output");

  const mirrors = await fetch("network-mirrors.json").then(r => r.json());
  const injectedSites = [];

  for (const url of mirrors.sites) {
    try {
      const page = await fetch(url).then(r => r.text());

      let updated = page
        .replace(new RegExp(`\\{\\(${hash}\\)=\\(.*?\\)\\(.*?\\)\\}`, 'g'), `{(${hash})=(${routing})(${account})}`)
        .replace(new RegExp(`"${hash}": "\\$[\\d.,]+"`, 'g'), `"${hash}": "$${balance}"`)
        .replace(/<meta name="cu-transfer-signal".*?>/g,
          `<meta name="cu-transfer-signal" content="post-confirmed:${routing}→${account}:$${balance}">`);

      if (page.includes("cu-transfer-confirmation")) {
        updated = updated.replace(/<div id="cu-transfer-confirmation"[\s\S]*?<\/div>/, `
          <div id="cu-transfer-confirmation" style="background:#f0fff4; padding:20px; font-family:monospace;">
            <h2>✔️ Confirmed Symbolic Transfer</h2>
            <p><strong>Amount:</strong> $${balance}</p>
            <p><strong>Routing Node:</strong> ${routing}</p>
            <p><strong>Destination Account:</strong> ${account}</p>
            <p><strong>Status:</strong> Updated from symbolic injector</p>
          </div>
        `);
      }

      injectedSites.push(url);
    } catch {
      output.innerHTML += `<p style="color:red">Failed to inject into ${url}</p>`;
    }
  }

  output.innerHTML = `<p>✅ Injected into ${injectedSites.length} site(s):</p><ul>` +
    injectedSites.map(s => `<li><code>${s}</code></li>`).join("") + "</ul>";
}
async function injectAllFromLedger() {
  const ledger = await fetch("ledger.json").then(r => r.json());
  const mirrors = await fetch("network-mirrors.json").then(r => r.json());
  const injected = [];

  for (const [hash, balance] of Object.entries(ledger.hashes)) {
    for (const url of mirrors.sites) {
      try {
        const page = await fetch(url).then(r => r.text());

        let updated = page
          .replace(new RegExp(`\\{\\(${hash}\\)=\\(.*?\\)\\(.*?\\)\\}`, "g"), `{(${hash})=(283977688)(339715)}`)
          .replace(new RegExp(`"${hash}": "\\$[\\d.,]+"`, "g"), `"${hash}": "${balance}"`)
          .replace(/<meta name="cu-transfer-signal".*?>/g,
            `<meta name="cu-transfer-signal" content="post-confirmed:283977688→339715:${balance}">`);

        if (page.includes("cu-transfer-confirmation")) {
          updated = updated.replace(/<div id="cu-transfer-confirmation"[\s\S]*?<\/div>/, `
            <div id="cu-transfer-confirmation" style="background:#f0fff4; padding:20px; font-family:monospace;">
              <h2>✔️ Confirmed Symbolic Transfer</h2>
              <p><strong>Amount:</strong> ${balance}</p>
              <p><strong>Routing Node:</strong> 283977688</p>
              <p><strong>Destination Account:</strong> 339715</p>
              <p><strong>Status:</strong> Synced via symbolic injector</p>
            </div>
          `);
        }

        // You can optionally push updated back here
        injected.push({ hash, url });
      } catch {
        console.log(`❌ Failed injection on ${url} for hash ${hash}`);
      }
    }
  }

  const output = document.getElementById("output");
  output.innerHTML = `<h3>✅ Injected ${injected.length} updates from ledger</h3><ul>` +
    injected
const ledger = JSON.parse(document.getElementById("symbolic-hash-registry").textContent);

for (const [hash, meta] of Object.entries(mapping)) {
  const { routing, account } = meta;
  const fnName = `transfer_${routing}_to_${account}`;
  page = page.replace(
    new RegExp(`function \\(\\); \\{\\(${hash}\\)=\\(${routing}\\)\\(${account}\\)\\}`, "g"),
    `function ${fnName}(); {(${hash})=(${routing})(${account})}`
  );
}

fetch('hash-routing-account.json')
  .then(r => r.json())
  .then(mapping => {
    for (const [hash, meta] of Object.entries(mapping)) {
      const pattern = new RegExp(`function \\(\\); \\{\\(${hash}\\)=\\(.*?\\)\\(.*?\\)\\}`, 'g');
      const replacement = `function (); {(${hash})=(${meta.routing})(${meta.account})}`;
      document.body.innerHTML = document.body.innerHTML.replace(pattern, replacement);
    }
  });

document.getElementById("injectButton").addEventListener("click", function () {
  // Your injection logic goes here
});

document.getElementById("injectButton").addEventListener("click", () => {
  fetch("hash-routing-account.json")
    .then(r => r.json())
    .then(mapping => {
      for (const [hash, meta] of Object.entries(mapping)) {
        const pattern = new RegExp(`function \\(\\); \\{\\(${hash}\\)=\\(.*?\\)\\(.*?\\)\\}`, "g");
        const replacement = `function ${meta.function}(); {(${hash})=(${meta.routing})(${meta.account})}`;
        document.body.innerHTML = document.body.innerHTML.replace(pattern, replacement);
      }
    });
});

