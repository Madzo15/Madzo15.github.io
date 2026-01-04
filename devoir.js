document.addEventListener('DOMContentLoaded', () => {
  // Récupère les éléments DOM importants
  const form = document.getElementById('calcForm');
  const aInput = document.getElementById('a');
  const bInput = document.getElementById('b');
  const aError = document.getElementById('aError');
  const bError = document.getElementById('bError');
  const output = document.getElementById('output');

  const numberRE = /^[+-]?(?:\d+|\d*\.\d+)(?:[eE][+-]?\d+)?$/;

  // Convertit la virgule en point et supprime les espaces
  function normalize(val){
    return String(val).replace(',', '.').trim();
  }

  // Permet de verifier qu'une valeur est valide et non vide
  function validateField(value){
    if (value === '') return { ok:false, msg:'Le champ est requis.' };
    if (!numberRE.test(value)) return { ok:false, msg:'Veuillez saisir un nombre valide.' };
    return { ok:true };
  }

  // On efface les messages d'erreurs affichés et les atributs invalide
  function clearErrors(){
    
    aError.textContent = '';
    bError.textContent = '';
    aInput.removeAttribute('aria-invalid');
    bInput.removeAttribute('aria-invalid');
  }

  // Chaque ligne est soit une erreur { error:true, text } soit { label, text }
  function showResultRows(rows){
    output.innerHTML = '';
    rows.forEach(r => {
      const p = document.createElement('p');
      if (r.error) { p.className = 'error'; p.textContent = r.text; }
      else { p.innerHTML = `<strong>${r.label}:</strong> <span>${r.text}</span>`; }
      output.appendChild(p);
    });
  }

  // La validation en direct pour chaque champ de saisie
  function onInput(e){
    const el = e.target;
    const v = normalize(el.value);
    const res = validateField(v);
    const errorEl = el.id === 'a' ? aError : bError;
    if (v === '') { errorEl.textContent = ''; el.removeAttribute('aria-invalid'); return; }
    if (!res.ok){ errorEl.textContent = res.msg; el.setAttribute('aria-invalid', 'true'); }
    else { errorEl.textContent = ''; el.removeAttribute('aria-invalid'); }
  }

  aInput.addEventListener('input', onInput);
  bInput.addEventListener('input', onInput);

  // On gere la soumission du formulaire : valider, calculer et afficher les résultats
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    clearErrors();
    const aRaw = normalize(aInput.value);
    const bRaw = normalize(bInput.value);

    const va = validateField(aRaw);
    const vb = validateField(bRaw);

    let ok = true;
    if (!va.ok){ aError.textContent = va.msg; aInput.setAttribute('aria-invalid', 'true'); ok = false; }
    if (!vb.ok){ bError.textContent = vb.msg; bInput.setAttribute('aria-invalid', 'true'); ok = false; }

    if (!ok){
      showResultRows([{ error:true, text:'Impossible d’effectuer les calculs : corrigez les erreurs ci‑dessus.' }]);
      return;
    }

    const a = Number(aRaw);
    const b = Number(bRaw);

    const rows = [
      { label: 'Somme', text: a + b },
      { label: 'Différence', text: a - b },
      { label: 'Produit', text: a * b }
    ];

    if (b === 0){
      rows.push({ label: 'Quotient', text: '—' });
      rows.push({ error:true, text: 'Erreur : division par zéro interdite.' });
    } else {
      rows.push({ label: 'Quotient', text: a / b });
    }

    showResultRows(rows);
  });
});