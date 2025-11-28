// Simple rule-based disease classifier
    { name: 'Common Cold / Mild Respiratory', match: s => ['cough','sorethroat','headache'].filter(x=>s.includes(x)).length >= 2, advice: 'Rest, OTC meds, see doctor if symptoms worsen.' },
    { name: 'Gastrointestinal Infection', match: s => ['nausea','diarrhea','fever'].filter(x=>s.includes(x)).length >= 2, advice: 'Hydration, BRAT diet, seek care if severe.' },
    { name: 'Allergic Reaction / Dermatitis', match: s => ['rash','joint'].filter(x=>s.includes(x)).length >= 1, advice: 'Avoid triggers, antihistamines, consult dermatologist.' },
    { name: 'Respiratory Distress (Urgent)', match: s => s.includes('breath'), advice: 'Seek emergency care immediately for breathing difficulty.' }
  ];

  // find first matching rule
  for(let r of rules){
    if(r.match(symptoms)) return { found: true, diagnosis: r.name, advice: r.advice };
  }
  return { found: false, diagnosis: 'No clear match', advice: 'Consider consulting a healthcare professional for detailed evaluation.' };
}

// Page-specific wiring
document.addEventListener('DOMContentLoaded', ()=>{
  // Symptom page
  const diagnoseBtn = document.getElementById('diagnose-btn');
  if(diagnoseBtn){
    diagnoseBtn.addEventListener('click', ()=>{
      const checked = Array.from(document.querySelectorAll('input[name="symptom"]:checked')).map(i=>i.value);
      const res = diagnoseFromSymptoms(checked);
      const out = document.getElementById('result');
      if(res.found){
        out.innerHTML = `<strong>Likely:</strong> ${res.diagnosis}<br><strong>Advice:</strong> ${res.advice}`;
      } else {
        out.innerHTML = `<strong>${res.diagnosis}</strong><br>${res.advice}`;
      }
    });
    document.getElementById('clear-btn').addEventListener('click', ()=>{
      document.querySelectorAll('input[name="symptom"]').forEach(i=>i.checked=false);
      document.getElementById('result').innerHTML='';
    });
  }

  // Image page
  const imageInput = document.getElementById('image-input');
  if(imageInput){
    const preview = document.getElementById('preview');
    imageInput.addEventListener('change', (ev)=>{
      const file = ev.target.files[0];
      if(!file) { preview.textContent = 'No image selected'; return; }
      const img = document.createElement('img');
      img.style.maxWidth = '100%';
      img.style.maxHeight = '280px';
      img.alt = 'Uploaded preview';
      const reader = new FileReader();
      reader.onload = (e)=>{
        img.src = e.target.result;
        preview.innerHTML = '';
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('analyze-btn').addEventListener('click', ()=>{
      const file = imageInput.files[0];
      const imageResult = document.getElementById('image-result');
      if(!file){ imageResult.textContent = 'Please upload an image first.'; return; }

      imageResult.innerHTML = '<strong>Analysis:</strong> Running placeholder model...';

      // Placeholder: a mock asynchronous 'analysis'
      setTimeout(()=>{
        // Mock result based on random selection to simulate output
        const mock = [
          {label:'Benign skin lesion (low risk)', confidence:0.87},
          {label:'Suspicious lesion — recommend clinical exam', confidence:0.62},
          {label:'Image unclear — retake photo with better lighting', confidence:0.45}
        ];
        const pick = mock[Math.floor(Math.random()*mock.length)];
        imageResult.innerHTML = `<strong>Prediction:</strong> ${pick.label}<br><strong>Confidence:</strong> ${(pick.confidence*100).toFixed(0)}%<br><em>Note: This is a demo placeholder. Integrate a real model for production use.</em>`;
      }, 900);

      // Real integration notes:
      // - To use TensorFlow.js: load model and run `model.predict()` on preprocessed tensor from uploaded image.
      // - To use server: upload the file via fetch() to your inference endpoint and display response.
    });
  }
});
