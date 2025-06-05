// data/labValues.js
export const labValues = {
  serum: {
    name: "Serum Chemistry",
    subcategories: [
      {
        name: "Basic Metabolic Panel",
        values: [
          { name: "Sodium", value: "136-145 mEq/L", si_value: "136-145 mmol/L" },
          { name: "Potassium", value: "3.5-5.0 mEq/L", si_value: "3.5-5.0 mmol/L" },
          { name: "Chloride", value: "98-107 mEq/L", si_value: "98-107 mmol/L" },
          { name: "CO2", value: "22-29 mEq/L", si_value: "22-29 mmol/L" },
          { name: "BUN", value: "7-20 mg/dL", si_value: "2.5-7.1 mmol/L" },
          { name: "Creatinine", value: "0.7-1.3 mg/dL", si_value: "62-115 μmol/L" },
          { name: "Glucose", value: "70-100 mg/dL", si_value: "3.9-5.6 mmol/L" },
          { name: "Calcium", value: "8.5-10.5 mg/dL", si_value: "2.12-2.62 mmol/L" },
          { name: "Phosphorus", value: "2.5-4.5 mg/dL", si_value: "0.81-1.45 mmol/L" },
          { name: "Magnesium", value: "1.5-2.5 mg/dL", si_value: "0.62-1.03 mmol/L" }
        ]
      },
      {
        name: "Liver Function Tests",
        values: [
          { name: "ALT (SGPT)", value: "7-56 U/L", si_value: "7-56 U/L" },
          { name: "AST (SGOT)", value: "10-40 U/L", si_value: "10-40 U/L" },
          { name: "Alkaline Phosphatase", value: "44-147 U/L", si_value: "44-147 U/L" },
          { name: "Total Bilirubin", value: "0.3-1.2 mg/dL", si_value: "5.1-20.5 μmol/L" },
          { name: "Direct Bilirubin", value: "0.1-0.3 mg/dL", si_value: "1.7-5.1 μmol/L" },
          { name: "Albumin", value: "3.5-5.0 g/dL", si_value: "35-50 g/L" },
          { name: "Total Protein", value: "6.0-8.3 g/dL", si_value: "60-83 g/L" },
          { name: "GGT", value: "9-48 U/L", si_value: "9-48 U/L" }
        ]
      },
      {
        name: "Lipid Panel",
        values: [
          { name: "Total Cholesterol", value: "<200 mg/dL", si_value: "<5.18 mmol/L" },
          { name: "LDL Cholesterol", value: "<100 mg/dL", si_value: "<2.59 mmol/L" },
          { name: "HDL Cholesterol", value: ">40 mg/dL (M), >50 mg/dL (F)", si_value: ">1.04 (M), >1.29 (F) mmol/L" },
          { name: "Triglycerides", value: "<150 mg/dL", si_value: "<1.70 mmol/L" },
          { name: "Non-HDL Cholesterol", value: "<130 mg/dL", si_value: "<3.37 mmol/L" }
        ]
      },
      {
        name: "Cardiac Markers",
        values: [
          { name: "Troponin I", value: "<0.04 ng/mL", si_value: "<0.04 μg/L" },
          { name: "Troponin T", value: "<0.01 ng/mL", si_value: "<0.01 μg/L" },
          { name: "CK-MB", value: "0-6.3 ng/mL", si_value: "0-6.3 μg/L" },
          { name: "Total CK", value: "30-200 U/L (M), 20-170 U/L (F)", si_value: "30-200 U/L (M), 20-170 U/L (F)" },
          { name: "BNP", value: "<100 pg/mL", si_value: "<100 ng/L" },
          { name: "NT-proBNP", value: "<125 pg/mL", si_value: "<125 ng/L" }
        ]
      },
      {
        name: "Thyroid Function",
        values: [
          { name: "TSH", value: "0.27-4.20 μIU/mL", si_value: "0.27-4.20 mIU/L" },
          { name: "Free T4", value: "0.93-1.70 ng/dL", si_value: "12-22 pmol/L" },
          { name: "Free T3", value: "2.0-4.4 pg/mL", si_value: "3.1-6.8 pmol/L" },
          { name: "Total T4", value: "5.1-14.1 μg/dL", si_value: "66-181 nmol/L" },
          { name: "Total T3", value: "80-200 ng/dL", si_value: "1.2-3.1 nmol/L" }
        ]
      },
      {
        name: "Inflammatory Markers",
        values: [
          { name: "CRP", value: "<3.0 mg/L", si_value: "<3.0 mg/L" },
          { name: "ESR", value: "0-22 mm/hr (M), 0-29 mm/hr (F)", si_value: "0-22 mm/hr (M), 0-29 mm/hr (F)" },
          { name: "Procalcitonin", value: "<0.08 ng/mL", si_value: "<0.08 μg/L" },
          { name: "Ferritin", value: "12-300 ng/mL (M), 12-150 ng/mL (F)", si_value: "12-300 μg/L (M), 12-150 μg/L (F)" }
        ]
      }
    ]
  },
  
  blood_gases: {
    name: "Blood Gas Analysis",
    subcategories: [
      {
        name: "Arterial Blood Gas",
        values: [
          { name: "pH", value: "7.35-7.45", si_value: "7.35-7.45" },
          { name: "pCO2", value: "35-45 mmHg", si_value: "4.7-6.0 kPa" },
          { name: "pO2", value: "80-100 mmHg", si_value: "10.7-13.3 kPa" },
          { name: "HCO3-", value: "22-26 mEq/L", si_value: "22-26 mmol/L" },
          { name: "Base Excess", value: "-2 to +2 mEq/L", si_value: "-2 to +2 mmol/L" },
          { name: "O2 Saturation", value: "95-100%", si_value: "0.95-1.00" },
          { name: "Lactate", value: "0.5-2.2 mmol/L", si_value: "0.5-2.2 mmol/L" }
        ]
      },
      {
        name: "Venous Blood Gas",
        values: [
          { name: "pH", value: "7.31-7.41", si_value: "7.31-7.41" },
          { name: "pCO2", value: "41-51 mmHg", si_value: "5.5-6.8 kPa" },
          { name: "pO2", value: "35-49 mmHg", si_value: "4.7-6.5 kPa" },
          { name: "HCO3-", value: "22-26 mEq/L", si_value: "22-26 mmol/L" },
          { name: "O2 Saturation", value: "60-80%", si_value: "0.60-0.80" }
        ]
      }
    ]
  },
  
  csf: {
    name: "Cerebrospinal Fluid",
    subcategories: [
      {
        name: "CSF Analysis",
        values: [
          { name: "Opening Pressure", value: "70-180 mmH2O", si_value: "70-180 mmH2O" },
          { name: "Total Protein", value: "15-60 mg/dL", si_value: "0.15-0.60 g/L" },
          { name: "Glucose", value: "50-80 mg/dL", si_value: "2.8-4.4 mmol/L" },
          { name: "CSF/Serum Glucose Ratio", value: "0.6-0.7", si_value: "0.6-0.7" },
          { name: "Cell Count", value: "0-5 cells/μL", si_value: "0-5 × 10⁶/L" },
          { name: "RBC Count", value: "0 cells/μL", si_value: "0 × 10⁶/L" },
          { name: "Chloride", value: "118-132 mEq/L", si_value: "118-132 mmol/L" }
        ]
      }
    ]
  },
  
  hematologic: {
    name: "Hematologic Values",
    subcategories: [
      {
        name: "Complete Blood Count",
        values: [
          { name: "Hemoglobin", value: "14-18 g/dL (M), 12-16 g/dL (F)", si_value: "140-180 g/L (M), 120-160 g/L (F)" },
          { name: "Hematocrit", value: "42-52% (M), 37-47% (F)", si_value: "0.42-0.52 (M), 0.37-0.47 (F)" },
          { name: "RBC Count", value: "4.7-6.1 × 10⁶/μL (M), 4.2-5.4 × 10⁶/μL (F)", si_value: "4.7-6.1 × 10¹²/L (M), 4.2-5.4 × 10¹²/L (F)" },
          { name: "WBC Count", value: "5,000-10,000/μL", si_value: "5.0-10.0 × 10⁹/L" },
          { name: "Platelet Count", value: "150,000-450,000/μL", si_value: "150-450 × 10⁹/L" },
          { name: "MCV", value: "80-100 fL", si_value: "80-100 fL" },
          { name: "MCH", value: "27-31 pg", si_value: "27-31 pg" },
          { name: "MCHC", value: "32-36 g/dL", si_value: "320-360 g/L" },
          { name: "RDW", value: "11.5-14.5%", si_value: "11.5-14.5%" }
        ]
      },
      {
        name: "White Blood Cell Differential",
        values: [
          { name: "Neutrophils", value: "50-70%", si_value: "0.50-0.70" },
          { name: "Lymphocytes", value: "20-40%", si_value: "0.20-0.40" },
          { name: "Monocytes", value: "2-8%", si_value: "0.02-0.08" },
          { name: "Eosinophils", value: "1-4%", si_value: "0.01-0.04" },
          { name: "Basophils", value: "0.5-1%", si_value: "0.005-0.01" },
          { name: "Bands", value: "3-5%", si_value: "0.03-0.05" }
        ]
      },
      {
        name: "Coagulation Studies",
        values: [
          { name: "PT", value: "11-13 seconds", si_value: "11-13 seconds" },
          { name: "INR", value: "0.8-1.1", si_value: "0.8-1.1" },
          { name: "aPTT", value: "25-35 seconds", si_value: "25-35 seconds" },
          { name: "Fibrinogen", value: "200-400 mg/dL", si_value: "2.0-4.0 g/L" },
          { name: "D-Dimer", value: "<0.50 mg/L", si_value: "<0.50 mg/L" },
          { name: "Bleeding Time", value: "2-7 minutes", si_value: "2-7 minutes" }
        ]
      },
      {
        name: "Iron Studies",
        values: [
          { name: "Serum Iron", value: "65-175 μg/dL (M), 50-170 μg/dL (F)", si_value: "11.6-31.3 μmol/L (M), 9.0-30.4 μmol/L (F)" },
          { name: "TIBC", value: "250-450 μg/dL", si_value: "45-81 μmol/L" },
          { name: "Transferrin Saturation", value: "20-50%", si_value: "0.20-0.50" },
          { name: "Ferritin", value: "12-300 ng/mL (M), 12-150 ng/mL (F)", si_value: "12-300 μg/L (M), 12-150 μg/L (F)" }
        ]
      }
    ]
  },
  
  urine: {
    name: "Urinalysis",
    subcategories: [
      {
        name: "Urine Chemistry",
        values: [
          { name: "Specific Gravity", value: "1.003-1.030", si_value: "1.003-1.030" },
          { name: "pH", value: "4.6-8.0", si_value: "4.6-8.0" },
          { name: "Protein", value: "Negative to trace", si_value: "<0.20 g/L" },
          { name: "Glucose", value: "Negative", si_value: "Negative" },
          { name: "Ketones", value: "Negative", si_value: "Negative" },
          { name: "Blood", value: "Negative", si_value: "Negative" },
          { name: "Bilirubin", value: "Negative", si_value: "Negative" },
          { name: "Urobilinogen", value: "0.2-1.0 mg/dL", si_value: "3.4-17 μmol/L" },
          { name: "Nitrites", value: "Negative", si_value: "Negative" },
          { name: "Leukocyte Esterase", value: "Negative", si_value: "Negative" }
        ]
      },
      {
        name: "Urine Microscopy",
        values: [
          { name: "RBC", value: "0-3/hpf", si_value: "0-3/hpf" },
          { name: "WBC", value: "0-5/hpf", si_value: "0-5/hpf" },
          { name: "Epithelial Cells", value: "Few", si_value: "Few" },
          { name: "Bacteria", value: "None to few", si_value: "None to few" },
          { name: "Casts", value: "0-2 hyaline/lpf", si_value: "0-2 hyaline/lpf" },
          { name: "Crystals", value: "Few or none", si_value: "Few or none" }
        ]
      },
      {
        name: "24-Hour Urine",
        values: [
          { name: "Total Volume", value: "800-2000 mL/24hr", si_value: "0.8-2.0 L/24hr" },
          { name: "Creatinine Clearance", value: "85-125 mL/min", si_value: "1.42-2.08 mL/s" },
          { name: "Protein", value: "<150 mg/24hr", si_value: "<0.15 g/24hr" },
          { name: "Microalbumin", value: "<30 mg/24hr", si_value: "<30 mg/24hr" },
          { name: "Sodium", value: "40-220 mEq/24hr", si_value: "40-220 mmol/24hr" },
          { name: "Potassium", value: "25-125 mEq/24hr", si_value: "25-125 mmol/24hr" }
        ]
      }
    ]
  },
  
  body_metrics: {
    name: "Body Metrics & Vitals",
    subcategories: [
      {
        name: "Vital Signs",
        values: [
          { name: "Body Temperature", value: "36.1-37.2°C (97-99°F)", si_value: "36.1-37.2°C" },
          { name: "Heart Rate", value: "60-100 bpm", si_value: "60-100 bpm" },
          { name: "Respiratory Rate", value: "12-20 breaths/min", si_value: "12-20 breaths/min" },
          { name: "Blood Pressure (Systolic)", value: "<120 mmHg", si_value: "<16.0 kPa" },
          { name: "Blood Pressure (Diastolic)", value: "<80 mmHg", si_value: "<10.7 kPa" },
          { name: "Oxygen Saturation", value: "95-100%", si_value: "0.95-1.00" }
        ]
      },
      {
        name: "Anthropometric Measurements",
        values: [
          { name: "BMI", value: "18.5-24.9 kg/m²", si_value: "18.5-24.9 kg/m²" },
          { name: "Waist Circumference", value: "<102 cm (M), <88 cm (F)", si_value: "<102 cm (M), <88 cm (F)" },
          { name: "Body Fat Percentage", value: "6-24% (M), 16-30% (F)", si_value: "6-24% (M), 16-30% (F)" }
        ]
      },
      {
        name: "Pulmonary Function",
        values: [
          { name: "Peak Flow", value: "400-700 L/min", si_value: "400-700 L/min" },
          { name: "FEV1", value: ">80% predicted", si_value: ">80% predicted" },
          { name: "FVC", value: ">80% predicted", si_value: ">80% predicted" },
          { name: "FEV1/FVC Ratio", value: ">70%", si_value: ">0.70" }
        ]
      }
    ]
  }
};