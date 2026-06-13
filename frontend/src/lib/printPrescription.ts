export type Medicine = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
};

export type PrintRx = {
  id: string;
  created_at: string;
  patient_name: string;
  patient_age: number | null;
  patient_phone?: string | null;
  diagnosis: string;
  chief_complaint: string | null;
  medicines: Medicine[];
  instructions: string | null;
  follow_up_date: string | null;
};

type Lang = "en" | "bn";

const L = {
  en: {
    title: "Digital Prescription",
    patient: "Patient Name",
    age: "Age",
    date: "Date",
    phone: "Phone",
    complaint: "Chief Complaint",
    diagnosis: "Diagnosis",
    rx: "Medicines / Prescription",
    med: "Medicine Name",
    dosage: "Dosage",
    freq: "Frequency",
    dur: "Duration",
    notes: "Notes",
    no: "No.",
    instructions: "Instructions",
    followup: "Follow-up Date",
    sig: "Doctor's Signature",
    stamp: "SEAL / STAMP",
    footer: "This prescription was digitally issued by Techno Dental Care · BMDC Reg. No: 2073",
    yrs: "yrs",
    doctor_name: "Prof. Dr. Golam Mohammad Pavel",
    doctor_quals: "BDS (Dhaka), MPH (Dhaka), FICID (USA), PGT (BSMMU), Member of ADA (USA)",
    doctor_training: "Special Training in Orthodontics & Implantology (AIC, Korea) | Training in Cosmetic Dentistry (Dubai)",
    doctor_title: "Professor & Head, Pediatric Dentistry Dept, Marks Medical College, Dental Unit, Dhaka | Oral and Dental Surgeon",
    doctor_bmdc: "BMDC Reg. No: 2073",
    clinic_name_1: "Techno",
    clinic_name_2: "Dental Care",
    clinic_address: "767 Rokeya Sarani (2nd Floor), Near Metro Rail Pillar No. 305, Shewrapara, Mirpur, Dhaka-1216",
    clinic_phone: "Phone: 01711-102-368",
    clinic_hours: "Sunday, Tuesday & Thursday · 6 PM – 9 PM",
  },
  bn: {
    title: "ডিজিটাল প্রেসক্রিপশন",
    patient: "রোগীর নাম",
    age: "বয়স",
    date: "তারিখ",
    phone: "ফোন",
    complaint: "প্রধান সমস্যা",
    diagnosis: "রোগ নির্ণয়",
    rx: "ওষুধ / প্রেসক্রিপশন",
    med: "ওষুধের নাম",
    dosage: "মাত্রা",
    freq: "সেবনবিধি",
    dur: "সময়কাল",
    notes: "বিশেষ টীকা",
    no: "নং",
    instructions: "নির্দেশনা",
    followup: "পরবর্তী ভিজিটের তারিখ",
    sig: "চিকিৎসকের স্বাক্ষর",
    stamp: "সিল / স্ট্যাম্প",
    footer: "এই প্রেসক্রিপশনটি টেকনো ডেন্টাল কেয়ার কর্তৃক ডিজিটালি ইস্যু করা হয়েছে · বিএমডিসি নিবন্ধন: ২০৭৩",
    yrs: "বছর",
    doctor_name: "প্রফেসর ডা. গোলাম মোহাম্মদ পাভেল",
    doctor_quals: "BDS (ঢাকা), MPH (ঢাকা), FICID (USA), PGT (BSMMU), ADA সদস্য (USA)",
    doctor_training: "অর্থোডন্টিক্স ও ইমপ্লান্টোলজিতে বিশেষ প্রশিক্ষণ (AIC, কোরিয়া) | কসমেটিক ডেন্টিস্ট্রিতে প্রশিক্ষণ (দুবাই)",
    doctor_title: "অধ্যাপক ও বিভাগীয় প্রধান, শিশু দন্তচিকিৎসা বিভাগ, মার্কস মেডিকেল কলেজ, ঢাকা | ওরাল ও ডেন্টাল সার্জন",
    doctor_bmdc: "বিএমডিসি নিবন্ধন: ২০৭৩",
    clinic_name_1: "টেকনো",
    clinic_name_2: "ডেন্টাল কেয়ার",
    clinic_address: "৭৬৭ রোকেয়া সরণি (২য় তলা), মেট্রো রেল পিলার নং ৩০৫ এর নিকট, শেওড়াপাড়া, মিরপুর, ঢাকা-১২১৬",
    clinic_phone: "ফোন: ০১৭১১-১০২-৩৬৮",
    clinic_hours: "রবিবার, মঙ্গলবার ও বৃহস্পতিবার · সন্ধ্যা ৬টা – রাত ৯টা",
  },
};

export function printPrescription(rx: PrintRx, lang: Lang = "en"): void {
  const l = L[lang];
  const logoUrl = `${window.location.origin}/assets/techno-dental-logo.jpeg`;
  const dateStr = new Date(rx.created_at).toLocaleDateString(
    lang === "bn" ? "bn-BD" : "en-GB",
    { day: "2-digit", month: "short", year: "numeric" }
  );

  const medRows = rx.medicines
    .map(
      (m, i) => `
      <tr>
        <td class="num">${i + 1}</td>
        <td><strong>${m.name}</strong></td>
        <td>${m.dosage || "—"}</td>
        <td>${m.frequency || "—"}</td>
        <td>${m.duration || "—"}</td>
        <td>${m.notes || "—"}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8"/>
<title>Prescription — ${rx.patient_name}</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Segoe UI', Arial, sans-serif;
  max-width: 210mm;
  margin: 0 auto;
  padding: 14mm 16mm 12mm;
  color: #1a1a2e;
  font-size: 13px;
}

/* ── Header ── */
.header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding-bottom: 10px;
  border-bottom: 3px solid #0D63D6;
}
.logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 10px;
}
.clinic-info { flex: 1; }
.clinic-name {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.1;
}
.clinic-name .blue { color: #18B8F0; }
.clinic-name .dark { color: #0D63D6; }
.clinic-sub { font-size: 10.5px; color: #555; margin-top: 4px; line-height: 1.6; }

/* ── Doctor section ── */
.doctor-box {
  background: linear-gradient(135deg, #eef5ff 0%, #f0f8ff 100%);
  border-left: 4px solid #0D63D6;
  border-radius: 0 8px 8px 0;
  padding: 10px 14px;
  margin: 10px 0;
}
.doctor-name {
  font-size: 15px;
  font-weight: 700;
  color: #0D63D6;
  letter-spacing: -0.2px;
}
.doctor-quals {
  font-size: 11px;
  color: #333;
  margin-top: 2px;
  line-height: 1.55;
}
.doctor-title {
  font-size: 10.5px;
  color: #555;
  margin-top: 3px;
  font-style: italic;
}
.doctor-bmdc {
  font-size: 11px;
  font-weight: 700;
  color: #0D63D6;
  margin-top: 4px;
}

/* ── Patient bar ── */
.patient-bar {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 8px 12px;
  background: #f8faff;
  border: 1px solid #e0eaff;
  border-radius: 8px;
  margin: 10px 0;
}
.pf { display: flex; flex-direction: column; }
.plabel {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #888;
  font-weight: 700;
}
.pval {
  font-size: 13px;
  color: #1a1a2e;
  font-weight: 600;
  margin-top: 1px;
}

/* ── Clinical ── */
.clabel {
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #888;
  margin-bottom: 3px;
}
.cval { font-size: 13px; color: #1a1a2e; }
.cblock { margin: 8px 0; }

/* ── Rx ── */
.rx-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 14px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1.5px solid #0D63D6;
}
.rx-sym {
  font-size: 30px;
  font-weight: 900;
  color: #0D63D6;
  font-family: 'Times New Roman', serif;
  line-height: 1;
}
.rx-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0D63D6;
}

table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
thead tr { background: #0D63D6; }
thead th {
  padding: 7px 9px;
  text-align: left;
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #fff;
}
tbody tr:nth-child(even) { background: #f3f7ff; }
tbody tr:nth-child(odd)  { background: #ffffff; }
tbody td { padding: 6px 9px; border-bottom: 1px solid #e8edf5; vertical-align: top; }
tbody tr:last-child td { border-bottom: none; }
.num { color: #0D63D6; font-weight: 700; text-align: center; width: 32px; }

/* ── Instructions box ── */
.instructions-box {
  background: #fffbf0;
  border: 1px solid #ffe58f;
  border-radius: 7px;
  padding: 9px 14px;
  margin: 10px 0;
  font-size: 12px;
  color: #664d00;
  line-height: 1.5;
}
.instructions-box strong { color: #554000; }

/* ── Follow-up ── */
.followup {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e8f5e9;
  border: 1px solid #a5d6a7;
  border-radius: 7px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #1b5e20;
  margin: 8px 0;
}

/* ── Footer / Signature ── */
.sig-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 28px;
  padding-top: 14px;
  border-top: 1px solid #ddd;
}
.sig-box { text-align: center; }
.sig-line {
  width: 160px;
  border-bottom: 1.5px solid #333;
  margin: 0 auto 5px;
  height: 40px;
}
.sig-label {
  font-size: 9.5px;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.stamp-circle {
  width: 86px;
  height: 86px;
  border: 2px dashed #bbb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stamp-text { font-size: 9px; color: #bbb; text-align: center; line-height: 1.4; }

.gen-footer {
  text-align: center;
  font-size: 9.5px;
  color: #aaa;
  margin-top: 12px;
  border-top: 1px solid #eee;
  padding-top: 8px;
}

@media print {
  body { padding: 8mm 12mm; }
  .no-print { display: none !important; }
}
</style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <img src="${logoUrl}" alt="Techno Dental Care" class="logo" onerror="this.style.display='none'" />
  <div class="clinic-info">
    <div class="clinic-name">
      <span class="blue">${l.clinic_name_1}</span> <span class="dark">${l.clinic_name_2}</span>
    </div>
    <div class="clinic-sub">
      ${l.clinic_address}<br/>
      ${l.clinic_phone} &nbsp;·&nbsp; ${l.clinic_hours}
    </div>
  </div>
</div>

<!-- DOCTOR INFO -->
<div class="doctor-box">
  <div class="doctor-name">${l.doctor_name}</div>
  <div class="doctor-quals">${l.doctor_quals}</div>
  <div class="doctor-quals">${l.doctor_training}</div>
  <div class="doctor-title">${l.doctor_title}</div>
  <div class="doctor-bmdc">${l.doctor_bmdc}</div>
</div>

<!-- PATIENT BAR -->
<div class="patient-bar">
  <div class="pf" style="flex:2">
    <span class="plabel">${l.patient}</span>
    <span class="pval">${rx.patient_name}</span>
  </div>
  ${rx.patient_age ? `<div class="pf"><span class="plabel">${l.age}</span><span class="pval">${rx.patient_age} ${l.yrs}</span></div>` : ""}
  ${rx.patient_phone ? `<div class="pf" style="flex:1.5"><span class="plabel">${l.phone}</span><span class="pval">${rx.patient_phone}</span></div>` : ""}
  <div class="pf">
    <span class="plabel">${l.date}</span>
    <span class="pval">${dateStr}</span>
  </div>
</div>

<!-- CLINICAL -->
${rx.chief_complaint ? `<div class="cblock"><div class="clabel">${l.complaint}</div><div class="cval">${rx.chief_complaint}</div></div>` : ""}
<div class="cblock"><div class="clabel">${l.diagnosis}</div><div class="cval">${rx.diagnosis}</div></div>

<!-- MEDICINES -->
${rx.medicines.length > 0 ? `
<div class="rx-header">
  <div class="rx-sym">℞</div>
  <div class="rx-label">${l.rx}</div>
</div>
<table>
  <thead>
    <tr>
      <th style="width:32px">${l.no}</th>
      <th style="width:24%">${l.med}</th>
      <th>${l.dosage}</th>
      <th>${l.freq}</th>
      <th>${l.dur}</th>
      <th>${l.notes}</th>
    </tr>
  </thead>
  <tbody>
    ${medRows}
  </tbody>
</table>` : ""}

<!-- INSTRUCTIONS -->
${rx.instructions ? `<div class="instructions-box"><strong>${l.instructions}:</strong> ${rx.instructions}</div>` : ""}

<!-- FOLLOW-UP -->
${rx.follow_up_date ? `<div><span class="followup">📅 ${l.followup}: ${rx.follow_up_date}</span></div>` : ""}

<!-- SIGNATURE / SEAL -->
<div class="sig-row">
  <div class="sig-box">
    <div class="sig-line"></div>
    <div class="sig-label">${l.sig}</div>
  </div>
  <div class="stamp-circle">
    <div class="stamp-text">${l.stamp}</div>
  </div>
</div>

<div class="gen-footer">${l.footer}</div>

</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;width:0;height:0;border:none;top:-9999px;left:-9999px;";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) { document.body.removeChild(iframe); return; }

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  iframe.onload = () => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
    }, 1000);
  };
}
