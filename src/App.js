import { useState, useEffect } from "react";

import Dashboard from './Dashboard';

const DEFAULT_PHASES = [
  {
    id: 1, month: "Month 1", title: "Data Science Foundations", color: "#00D4FF", icon: "📊",
    weeks: [
      { week: 1, title: "Python for Data", days: [
        { id: "1-1-1", task: "Install Python, Jupyter, Pandas, NumPy", type: "setup" },
        { id: "1-1-2", task: "Pandas basics: DataFrames, read_csv, head/tail", type: "learn" },
        { id: "1-1-3", task: "NumPy basics: arrays, shapes, operations", type: "learn" },
        { id: "1-1-4", task: "Practice: Load a CSV dataset and explore it", type: "code" },
        { id: "1-1-5", task: "Write notes on what you learned this week", type: "notes" },
      ]},
      { week: 2, title: "Data Cleaning", days: [
        { id: "1-2-1", task: "Handle missing values (fillna, dropna)", type: "learn" },
        { id: "1-2-2", task: "Handle duplicates and outliers", type: "learn" },
        { id: "1-2-3", task: "Data types: convert, parse dates, fix dtypes", type: "learn" },
        { id: "1-2-4", task: "Practice: Clean a messy real dataset", type: "code" },
        { id: "1-2-5", task: "Push cleaned dataset + code to GitHub", type: "project" },
      ]},
      { week: 3, title: "EDA + Statistics", days: [
        { id: "1-3-1", task: "Matplotlib & Seaborn: histograms, boxplots, scatter", type: "learn" },
        { id: "1-3-2", task: "Khan Academy: Mean, Median, Std Dev, Distributions", type: "learn" },
        { id: "1-3-3", task: "Correlation analysis on a dataset", type: "code" },
        { id: "1-3-4", task: "Create a full EDA notebook on Kaggle dataset", type: "code" },
        { id: "1-3-5", task: "Add clear visualizations and markdown explanations", type: "project" },
      ]},
      { week: 4, title: "SQL Fundamentals", days: [
        { id: "1-4-1", task: "SQL: SELECT, WHERE, ORDER BY, LIMIT", type: "learn" },
        { id: "1-4-2", task: "SQL: GROUP BY, HAVING, aggregates", type: "learn" },
        { id: "1-4-3", task: "SQL: JOINs (INNER, LEFT, RIGHT)", type: "learn" },
        { id: "1-4-4", task: "LeetCode SQL: Solve 5 easy problems", type: "code" },
        { id: "1-4-5", task: "Finalize EDA project with clean README ✅", type: "project" },
      ]},
    ],
  },
  {
    id: 2, month: "Month 2", title: "Core Machine Learning", color: "#7C3AED", icon: "🤖",
    weeks: [
      { week: 5, title: "Linear & Logistic Regression", days: [
        { id: "2-1-1", task: "Understand Linear Regression concept + math intuition", type: "learn" },
        { id: "2-1-2", task: "Implement Linear Regression with Scikit-learn", type: "code" },
        { id: "2-1-3", task: "Understand Logistic Regression + classification", type: "learn" },
        { id: "2-1-4", task: "Implement Logistic Regression, check accuracy", type: "code" },
        { id: "2-1-5", task: "Learn metrics: MAE, RMSE, Accuracy, F1", type: "learn" },
      ]},
      { week: 6, title: "Tree-Based Models", days: [
        { id: "2-2-1", task: "Decision Trees: concept, overfitting, depth", type: "learn" },
        { id: "2-2-2", task: "Random Forest: bagging, n_estimators", type: "learn" },
        { id: "2-2-3", task: "XGBoost: install, basic usage", type: "learn" },
        { id: "2-2-4", task: "Feature importance: visualize it", type: "code" },
        { id: "2-2-5", task: "Start regression project on Kaggle dataset", type: "project" },
      ]},
      { week: 7, title: "Cross-Validation + Feature Engineering", days: [
        { id: "2-3-1", task: "Cross-validation: k-fold, train/test split correctly", type: "learn" },
        { id: "2-3-2", task: "Feature engineering: encode categoricals, scale features", type: "learn" },
        { id: "2-3-3", task: "Pipeline with Scikit-learn (ColumnTransformer)", type: "code" },
        { id: "2-3-4", task: "Finalize regression project with clean code", type: "project" },
        { id: "2-3-5", task: "Start classification project (different dataset)", type: "project" },
      ]},
      { week: 8, title: "First Deployment Taste", days: [
        { id: "2-4-1", task: "Finalize classification project", type: "project" },
        { id: "2-4-2", task: "Learn model serialization: pickle and joblib", type: "learn" },
        { id: "2-4-3", task: "FastAPI basics: create a simple hello-world API", type: "learn" },
        { id: "2-4-4", task: "Wrap your ML model in a FastAPI endpoint", type: "code" },
        { id: "2-4-5", task: "Push both ML projects to GitHub with READMEs ✅", type: "project" },
      ]},
    ],
  },
  {
    id: 3, month: "Month 3", title: "ML Engineering Layer", color: "#059669", icon: "⚙️",
    weeks: [
      { week: 9, title: "FastAPI + Docker", days: [
        { id: "3-1-1", task: "FastAPI deep dive: request body, response model", type: "learn" },
        { id: "3-1-2", task: "Build a complete ML prediction API", type: "code" },
        { id: "3-1-3", task: "Docker basics: Dockerfile, build, run", type: "learn" },
        { id: "3-1-4", task: "Dockerize your ML API", type: "code" },
        { id: "3-1-5", task: "Test Docker container locally", type: "code" },
      ]},
      { week: 10, title: "Model Versioning + CI/CD", days: [
        { id: "3-2-1", task: "Version models separately from code", type: "learn" },
        { id: "3-2-2", task: "GitHub Actions: create a basic CI workflow", type: "learn" },
        { id: "3-2-3", task: "Add tests to your ML API (pytest basics)", type: "code" },
        { id: "3-2-4", task: "Jenkins basics OR GitHub Actions pipeline", type: "learn" },
        { id: "3-2-5", task: "Push CI/CD config to your ML API repo", type: "project" },
      ]},
      { week: 11, title: "Production-Grade API", days: [
        { id: "3-3-1", task: "Add input validation to FastAPI (Pydantic)", type: "code" },
        { id: "3-3-2", task: "Add logging to your API", type: "code" },
        { id: "3-3-3", task: "Docker Compose: combine API + dependencies", type: "learn" },
        { id: "3-3-4", task: "Write a proper README with architecture diagram", type: "project" },
        { id: "3-3-5", task: "Start interview prep: bias-variance, overfitting", type: "learn" },
      ]},
      { week: 12, title: "Polish + Jenkins Pipeline", days: [
        { id: "3-4-1", task: "Set up Jenkins locally (Docker container)", type: "code" },
        { id: "3-4-2", task: "Create Jenkinsfile for your ML API", type: "code" },
        { id: "3-4-3", task: "Full pipeline: lint → test → build → tag Docker image", type: "code" },
        { id: "3-4-4", task: "Clean up all GitHub repos with consistent READMEs", type: "project" },
        { id: "3-4-5", task: "Production ML API with Docker + CI/CD COMPLETE ✅", type: "project" },
      ]},
    ],
  },
  {
    id: 4, month: "Month 4", title: "MLOps Layer", color: "#DC2626", icon: "🚀",
    weeks: [
      { week: 13, title: "MLflow Experiment Tracking", days: [
        { id: "4-1-1", task: "MLflow setup: install, start tracking server", type: "setup" },
        { id: "4-1-2", task: "Log experiments: params, metrics, artifacts", type: "code" },
        { id: "4-1-3", task: "Compare multiple model runs in MLflow UI", type: "code" },
        { id: "4-1-4", task: "Add MLflow tracking to Month 2 ML project", type: "code" },
        { id: "4-1-5", task: "Study MLflow docs: model signature, input example", type: "learn" },
      ]},
      { week: 14, title: "Model Registry + Cloud Basics", days: [
        { id: "4-2-1", task: "MLflow Model Registry: register, stage, promote", type: "learn" },
        { id: "4-2-2", task: "Load model from registry in API instead of file", type: "code" },
        { id: "4-2-3", task: "AWS or GCP: create free tier account", type: "setup" },
        { id: "4-2-4", task: "Cloud basics: EC2/VM, S3/GCS bucket, IAM roles", type: "learn" },
        { id: "4-2-5", task: "Push a Docker image to ECR or GCR", type: "code" },
      ]},
      { week: 15, title: "Monitoring + Deployment", days: [
        { id: "4-3-1", task: "Add prediction logging to your API", type: "code" },
        { id: "4-3-2", task: "Simple accuracy monitoring: track drift over time", type: "code" },
        { id: "4-3-3", task: "Deploy Docker container to cloud VM", type: "code" },
        { id: "4-3-4", task: "Test live endpoint from internet", type: "code" },
        { id: "4-3-5", task: "Update README with live URL + architecture diagram", type: "project" },
      ]},
      { week: 16, title: "Portfolio Polish + Job Prep", days: [
        { id: "4-4-1", task: "Write LinkedIn post about your ML API project", type: "project" },
        { id: "4-4-2", task: "Practice: 10 ML theory interview questions", type: "learn" },
        { id: "4-4-3", task: "Practice: 5 SQL interview questions on LeetCode", type: "code" },
        { id: "4-4-4", task: "System design: design an ML prediction service", type: "learn" },
        { id: "4-4-5", task: "Full MLOps pipeline COMPLETE. Start applying! ✅", type: "project" },
      ]},
    ],
  },
];

const TYPE_COLORS = {
  setup:   { bg: "#1a2a1a", text: "#4ade80",  border: "#166534" },
  learn:   { bg: "#1a1a2e", text: "#818cf8",  border: "#3730a3" },
  code:    { bg: "#2a1a1a", text: "#fb923c",  border: "#9a3412" },
  notes:   { bg: "#2a2a1a", text: "#facc15",  border: "#854d0e" },
  project: { bg: "#2a1a2a", text: "#e879f9",  border: "#7e22ce" },
};
const TYPE_LIST = ["learn", "code", "project", "setup", "notes"];
const PHASE_ICONS = ["📊","🤖","⚙️","🚀","🧠","🎯","💡","🔥","📈","🛠️","🌐","⚡","📦","🔬","🏗️","📡"];
const PHASE_COLORS = ["#00D4FF","#7C3AED","#059669","#DC2626","#F59E0B","#EC4899","#14B8A6","#6366F1","#84CC16","#F97316"];

const STORAGE_KEY = "mlops_tracker_v2";

function uid() { return Math.random().toString(36).slice(2,9); }

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    phases: DEFAULT_PHASES,
    completed: {}, notes: {}, streakDays: [], lastVisit: null,
    profile: { name: "ML Engineer", goal: "Job-ready in 6 months", quote: "Build. Deploy. Monitor. Repeat." },
  };
}

export default function MLOpsTracker() {
  const [data, setData] = useState(loadData);
  const [activePhaseId, setActivePhaseId] = useState(1);
  const [activeWeekNum, setActiveWeekNum] = useState(null);
  const [view, setView] = useState("dashboard");
  const [editSection, setEditSection] = useState("profile");
  const [editPhaseId, setEditPhaseId] = useState(null);
  const [editWeekIdx, setEditWeekIdx] = useState(0);
  const [toast, setToast] = useState(null);

  const phases = data.phases || DEFAULT_PHASES;

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }, [data]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (data.lastVisit !== today) {
      setData(d => {
        const streakDays = [...(d.streakDays||[])];
        if (!streakDays.includes(today)) streakDays.push(today);
        return { ...d, lastVisit: today, streakDays };
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function upd(fn) { setData(d => fn({ ...d })); }

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(null), 2000); }

  const totalTasks = phases.reduce((a,p)=>a+p.weeks.reduce((b,w)=>b+w.days.length,0),0);
  const completedCount = Object.values(data.completed).filter(Boolean).length;
  const pct = totalTasks ? Math.round((completedCount/totalTasks)*100) : 0;

  const streakDays = data.streakDays || [];
  // const todayStr = new Date().toDateString(); // Not used currently
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(); d.setDate(d.getDate()-i);
    if (streakDays.includes(d.toDateString())) streak++;
    else if (i > 0) break;
  }

  function phasePct(p) {
    const ids = p.weeks.flatMap(w=>w.days.map(d=>d.id));
    return ids.length ? Math.round(ids.filter(id=>data.completed[id]).length/ids.length*100) : 0;
  }

  const activePhase = phases.find(p=>p.id===activePhaseId) || phases[0];
  const activeWeek = activeWeekNum !== null
    ? activePhase?.weeks.find(w=>w.week===activeWeekNum)
    : activePhase?.weeks[0];

  function goToPhase(pid) {
    const p = phases.find(x=>x.id===pid);
    setActivePhaseId(pid);
    setActiveWeekNum(p?.weeks[0]?.week ?? null);
    setView("tracker");
  }

  // ── EDIT FUNCTIONS ──────────────────────────────────────────────────────────
  function updateProfile(k,v) { upd(d=>({...d, profile:{...d.profile,[k]:v}})); }

  function updatePhaseField(pid,k,v) {
    upd(d=>({...d, phases:d.phases.map(p=>p.id===pid?{...p,[k]:v}:p)}));
  }

  function addPhase() {
    const newId = Date.now();
    const idx = phases.length + 1;
    const newPhase = {
      id: newId, month: `Month ${idx}`, title: "New Phase",
      color: PHASE_COLORS[idx % PHASE_COLORS.length], icon: "🎯",
      weeks: [{ week: newId, title: "Week 1", days: [
        { id: `${newId}-1-1`, task: "New task — tap to edit", type: "learn" }
      ]}]
    };
    upd(d=>({...d, phases:[...d.phases, newPhase]}));
    setEditPhaseId(newId);
    showToast("Phase added ✓");
  }

  function deletePhase(pid) {
    upd(d=>({...d, phases:d.phases.filter(p=>p.id!==pid)}));
    setEditPhaseId(null);
    showToast("Phase deleted");
  }

  function addWeek(pid) {
    upd(d=>({...d, phases:d.phases.map(p=>{
      if (p.id!==pid) return p;
      const maxW = Math.max(...p.weeks.map(w=>w.week),0);
      return {...p, weeks:[...p.weeks,{
        week: maxW+1, title:"New Week",
        days:[{id:`${pid}-${uid()}`,task:"New task — tap to edit",type:"learn"}]
      }]};
    })}));
    showToast("Week added ✓");
  }

  function deleteWeek(pid, wi) {
    upd(d=>({...d, phases:d.phases.map(p=>{
      if(p.id!==pid) return p;
      return {...p, weeks:p.weeks.filter((_,i)=>i!==wi)};
    })}));
    showToast("Week deleted");
  }

  function updateWeekTitle(pid, wi, v) {
    upd(d=>({...d, phases:d.phases.map(p=>{
      if(p.id!==pid) return p;
      return {...p, weeks:p.weeks.map((w,i)=>i===wi?{...w,title:v}:w)};
    })}));
  }

  function addTask(pid, wi) {
    const newT = {id:`${pid}-${wi}-${uid()}`, task:"New task — tap to edit", type:"learn"};
    upd(d=>({...d, phases:d.phases.map(p=>{
      if(p.id!==pid) return p;
      return {...p, weeks:p.weeks.map((w,i)=>i===wi?{...w,days:[...w.days,newT]}:w)};
    })}));
    showToast("Task added ✓");
  }

  function updateTask(pid,wi,ti,k,v) {
    upd(d=>({...d, phases:d.phases.map(p=>{
      if(p.id!==pid) return p;
      return {...p, weeks:p.weeks.map((w,i)=>{
        if(i!==wi) return w;
        return {...w, days:w.days.map((t,j)=>j===ti?{...t,[k]:v}:t)};
      })};
    })}));
  }

  function deleteTask(pid,wi,ti) {
    upd(d=>({...d, phases:d.phases.map(p=>{
      if(p.id!==pid) return p;
      return {...p, weeks:p.weeks.map((w,i)=>{
        if(i!==wi) return w;
        return {...w, days:w.days.filter((_,j)=>j!==ti)};
      })};
    })}));
    showToast("Task deleted");
  }

  function resetProgress() {
    upd(d=>({...d, completed:{}, streakDays:[], lastVisit:null}));
    showToast("Progress reset ✓");
  }

  function resetAll() {
    const fresh = {
      phases:DEFAULT_PHASES, completed:{}, notes:{}, streakDays:[], lastVisit:null,
      profile:{name:"ML Engineer",goal:"Job-ready in 6 months",quote:"Build. Deploy. Monitor. Repeat."},
    };
    setData(fresh);
    showToast("Reset to defaults ✓");
  }

  const profile = data.profile || {};

  // ── STYLES ──────────────────────────────────────────────────────────────────
  const card = { background:"#0f1421", border:"1px solid #1e2a3a", borderRadius:14, padding:14 };
  const inputStyle = {
    width:"100%", background:"#060910", border:"1px solid #1e2a3a", borderRadius:8,
    padding:"9px 12px", color:"#e2e8f0", fontFamily:"inherit", fontSize:13,
    outline:"none", boxSizing:"border-box"
  };
  const sectionLabel = { fontSize:11, color:"#475569", letterSpacing:2, textTransform:"uppercase", marginBottom:10 };

  if (view === "dashboard") {
    return <Dashboard data={data} setData={setData} view={view} setView={setView} />;
  }

  return (
    <div style={{
      minHeight:"100vh", background:"#0a0a0f", color:"#e2e8f0",
      fontFamily:"'JetBrains Mono','Fira Code',monospace",
      maxWidth: "100%", margin:"0 auto", position:"relative",
    }}>
      {/* Grid bg */}
      <div style={{
        position:"fixed",top:0,left:0,right:0,bottom:0,
        backgroundImage:`linear-gradient(rgba(0,212,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.025) 1px,transparent 1px)`,
        backgroundSize:"32px 32px",pointerEvents:"none",zIndex:0,
      }}/>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",
          background:"#00D4FF",color:"#000",borderRadius:20,padding:"8px 20px",
          fontSize:13,fontWeight:700,zIndex:9999,boxShadow:"0 0 20px #00D4FF88",
          whiteSpace:"nowrap"
        }}>{toast}</div>
      )}

      <div style={{position:"relative",zIndex:1,paddingBottom:84}}>

        {/* ═══════════════ HOME ═══════════════ */}
        {view==="home" && (
          <div>
            <div style={{padding:"28px 20px 10px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"#00D4FF",boxShadow:"0 0 8px #00D4FF",animation:"pulse 2s infinite"}}/>
                  <span style={{fontSize:11,color:"#00D4FF",letterSpacing:3,textTransform:"uppercase"}}>MLOps Journey</span>
                </div>
                <button 
                  onClick={() => setView("dashboard")}
                  style={{
                    background: "transparent", border: "1px solid #1e2a3a", color: "#e2e8f0", 
                    padding: "4px 8px", borderRadius: 6, fontSize: 10, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4
                  }}
                >
                  ← Dashboard
                </button>
              </div>
              <h1 style={{fontSize:24,fontWeight:700,margin:"0 0 2px",lineHeight:1.2}}>
                Hey, <span style={{color:"#00D4FF"}}>{profile.name||"Engineer"}</span> 👋
              </h1>
              <div style={{fontSize:12,color:"#475569"}}>{profile.goal||""}</div>
            </div>

            {/* Ring */}
            <div style={{display:"flex",justifyContent:"center",padding:"16px 0 4px"}}>
              <div style={{position:"relative",width:150,height:150}}>
                <svg width="150" height="150" style={{transform:"rotate(-90deg)"}}>
                  <circle cx="75" cy="75" r="62" fill="none" stroke="#1a1f2e" strokeWidth="9"/>
                  <circle cx="75" cy="75" r="62" fill="none" stroke="#00D4FF" strokeWidth="9"
                    strokeDasharray={`${2*Math.PI*62}`}
                    strokeDashoffset={`${2*Math.PI*62*(1-pct/100)}`}
                    strokeLinecap="round"
                    style={{transition:"stroke-dashoffset 0.8s ease",filter:"drop-shadow(0 0 6px #00D4FF)"}}
                  />
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:34,fontWeight:700,color:"#00D4FF"}}>{pct}%</span>
                  <span style={{fontSize:10,color:"#64748b",letterSpacing:1}}>COMPLETE</span>
                  <span style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{completedCount}/{totalTasks}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{display:"flex",gap:10,padding:"8px 20px 16px"}}>
              {[
                {label:"Streak",value:streak,icon:"🔥",color:"#f97316"},
                {label:"Active Days",value:streakDays.length,icon:"📅",color:"#a78bfa"},
                {label:"Done",value:completedCount,icon:"✅",color:"#34d399"},
              ].map(s=>(
                <div key={s.label} style={{flex:1,...card,padding:"12px 8px",textAlign:"center",borderRadius:12}}>
                  <div style={{fontSize:18}}>{s.icon}</div>
                  <div style={{fontSize:20,fontWeight:700,color:s.color}}>{s.value}</div>
                  <div style={{fontSize:10,color:"#64748b",marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Phase cards */}
            <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}}>
              <div style={sectionLabel}>Phases</div>
              {phases.map(p=>{
                const prog=phasePct(p);
                return (
                  <div key={p.id} onClick={()=>goToPhase(p.id)} style={{
                    background:"#0f1421",border:`1px solid ${prog>0?p.color+"44":"#1e2a3a"}`,
                    borderRadius:14,padding:"14px",cursor:"pointer",position:"relative",overflow:"hidden"
                  }}>
                    <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${prog}%`,background:`${p.color}09`,transition:"width 0.5s"}}/>
                    <div style={{position:"relative"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                            <span style={{fontSize:16}}>{p.icon}</span>
                            <span style={{fontSize:11,color:p.color,fontWeight:600}}>{p.month}</span>
                          </div>
                          <div style={{fontSize:14,fontWeight:600,color:"#e2e8f0"}}>{p.title}</div>
                        </div>
                        <div style={{fontSize:20,fontWeight:700,color:prog===100?"#34d399":p.color}}>{prog}%</div>
                      </div>
                      <div style={{height:4,background:"#1e2a3a",borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${prog}%`,background:p.color,borderRadius:4,boxShadow:`0 0 8px ${p.color}`,transition:"width 0.5s"}}/>
                      </div>
                      <div style={{marginTop:6,fontSize:10,color:"#475569"}}>{p.weeks.length} weeks · {p.weeks.reduce((a,w)=>a+w.days.length,0)} tasks</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quote */}
            <div style={{margin:"16px 20px 0",...card}}>
              <div style={sectionLabel}>Reminder</div>
              <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.7,fontStyle:"italic"}}>"{profile.quote||"Build. Deploy. Monitor. Repeat."}"</div>
            </div>
          </div>
        )}

        {/* ═══════════════ TRACKER ═══════════════ */}
        {view==="tracker" && (
          <div>
            <div style={{padding:"18px 20px 10px",background:"#0d1117",position:"sticky",top:0,zIndex:50,borderBottom:"1px solid #1e2a3a"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <button onClick={()=>setView("home")} style={{background:"none",border:"1px solid #1e2a3a",color:"#94a3b8",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>← Home</button>
                <span style={{fontSize:11,color:"#475569"}}>Task Tracker</span>
              </div>
              <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
                {phases.map((p,pi)=>(
                  <button key={p.id} onClick={()=>{setActivePhaseId(p.id);setActiveWeekNum(p.weeks[0]?.week??null);}} style={{
                    flexShrink:0,padding:"6px 12px",borderRadius:20,
                    border:`1px solid ${activePhaseId===p.id?p.color:"#1e2a3a"}`,
                    background:activePhaseId===p.id?p.color+"22":"transparent",
                    color:activePhaseId===p.id?p.color:"#64748b",
                    cursor:"pointer",fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4
                  }}>
                    <span>{p.icon}</span><span>M{pi+1}</span>
                  </button>
                ))}
              </div>
            </div>

            {activePhase && (
              <div style={{padding:"12px 20px 0"}}>
                <h2 style={{margin:"0 0 6px",fontSize:18,color:activePhase.color}}>{activePhase.title}</h2>
                <div style={{height:3,background:"#1e2a3a",borderRadius:3,overflow:"hidden",marginBottom:4}}>
                  <div style={{height:"100%",width:`${phasePct(activePhase)}%`,background:activePhase.color,transition:"width 0.4s",boxShadow:`0 0 6px ${activePhase.color}`}}/>
                </div>
                <div style={{fontSize:10,color:"#475569",marginBottom:12}}>{phasePct(activePhase)}% complete</div>

                {/* Week tabs */}
                <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto"}}>
                  {activePhase.weeks.map((w,wi)=>{
                    const wDone=w.days.filter(d=>data.completed[d.id]).length;
                    const wPct=w.days.length?Math.round(wDone/w.days.length*100):0;
                    const isActive=activeWeek?.week===w.week;
                    return (
                      <button key={w.week} onClick={()=>setActiveWeekNum(w.week)} style={{
                        flexShrink:0,padding:"7px 10px",borderRadius:10,
                        border:`1px solid ${isActive?activePhase.color:"#1e2a3a"}`,
                        background:isActive?activePhase.color+"22":"#0f1421",
                        color:isActive?activePhase.color:"#64748b",
                        cursor:"pointer",fontSize:11,fontFamily:"inherit",textAlign:"center"
                      }}>
                        <div>Wk {wi+1}</div>
                        <div style={{fontSize:10,color:wPct===100?"#34d399":"#475569"}}>{wPct}%</div>
                      </button>
                    );
                  })}
                </div>

                {activeWeek && (
                  <div>
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:14,fontWeight:600,color:"#e2e8f0"}}>{activeWeek.title}</div>
                      <div style={{fontSize:11,color:"#475569"}}>{activeWeek.days.length} tasks</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {activeWeek.days.map(task=>{
                        const done=!!data.completed[task.id];
                        const tc=TYPE_COLORS[task.type]||TYPE_COLORS.learn;
                        return (
                          <div key={task.id} onClick={()=>upd(d=>({...d,completed:{...d.completed,[task.id]:!d.completed[task.id]}}))} style={{
                            background:done?"#0f2a1a":"#0f1421",
                            border:`1px solid ${done?"#166534":"#1e2a3a"}`,
                            borderRadius:12,padding:"13px",cursor:"pointer",
                            display:"flex",gap:11,alignItems:"flex-start",transition:"all 0.2s"
                          }}>
                            <div style={{
                              width:22,height:22,borderRadius:6,flexShrink:0,
                              border:`2px solid ${done?"#34d399":"#2a3547"}`,
                              background:done?"#34d399":"transparent",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontSize:13,boxShadow:done?"0 0 8px #34d39966":"none",transition:"all 0.2s"
                            }}>{done?"✓":""}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,color:done?"#4ade80":"#cbd5e1",lineHeight:1.5,textDecoration:done?"line-through":"none",textDecorationColor:"#475569"}}>
                                {task.task}
                              </div>
                              <div style={{display:"inline-block",marginTop:5,padding:"2px 8px",borderRadius:20,background:tc.bg,color:tc.text,border:`1px solid ${tc.border}`,fontSize:10,letterSpacing:1,textTransform:"uppercase"}}>
                                {task.type}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Week notes */}
                    <div style={{marginTop:16,...card}}>
                      <div style={sectionLabel}>📝 Week Notes</div>
                      <textarea
                        placeholder="Notes, blockers, questions…"
                        value={data.notes?.[`${activePhase.id}-${activeWeek.week}`]||""}
                        onChange={e=>upd(d=>({...d,notes:{...(d.notes||{}),[`${activePhase.id}-${activeWeek.week}`]:e.target.value}}))}
                        style={{...inputStyle,minHeight:80,resize:"vertical"}}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ STATS ═══════════════ */}
        {view==="stats" && (
          <div style={{padding:"20px"}}>
            <h2 style={{margin:"0 0 16px",fontSize:20}}>📈 Your Stats</h2>
            {phases.map(p=>{
              const prog=phasePct(p);
              const ids=p.weeks.flatMap(w=>w.days.map(d=>d.id));
              const done=ids.filter(id=>data.completed[id]).length;
              return (
                <div key={p.id} style={{marginBottom:12,...card}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                    <span style={{fontSize:13,color:p.color}}>{p.icon} {p.title}</span>
                    <span style={{fontSize:14,fontWeight:700,color:prog===100?"#34d399":p.color}}>{prog}%</span>
                  </div>
                  <div style={{height:5,background:"#1e2a3a",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${prog}%`,background:p.color,boxShadow:`0 0 8px ${p.color}`}}/>
                  </div>
                  <div style={{marginTop:5,fontSize:10,color:"#475569"}}>{done}/{ids.length} tasks</div>
                </div>
              );
            })}

            <div style={{...card,marginTop:4}}>
              <div style={sectionLabel}>Activity — Last 60 Days</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {Array.from({length:60}).map((_,i)=>{
                  const d=new Date(); d.setDate(d.getDate()-(59-i));
                  const active=streakDays.includes(d.toDateString());
                  return <div key={i} style={{width:12,height:12,borderRadius:3,background:active?"#00D4FF":"#1e2a3a",boxShadow:active?"0 0 4px #00D4FF88":"none"}}/>;
                })}
              </div>
              <div style={{marginTop:8,fontSize:12,color:"#64748b"}}>🔥 Streak: <span style={{color:"#f97316",fontWeight:700}}>{streak} days</span></div>
            </div>

            <div style={{...card,marginTop:14}}>
              <div style={sectionLabel}>By Task Type</div>
              {Object.entries(TYPE_COLORS).map(([type,tc])=>{
                const all=phases.flatMap(p=>p.weeks.flatMap(w=>w.days.filter(d=>d.type===type)));
                const done=all.filter(t=>data.completed[t.id]).length;
                const tp=all.length?Math.round(done/all.length*100):0;
                return (
                  <div key={type} style={{marginBottom:9}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:11,color:tc.text,textTransform:"uppercase",letterSpacing:1}}>{type}</span>
                      <span style={{fontSize:11,color:"#475569"}}>{done}/{all.length}</span>
                    </div>
                    <div style={{height:4,background:"#1e2a3a",borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${tp}%`,background:tc.text,transition:"width 0.4s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════ EDIT MODE ═══════════════ */}
        {view==="edit" && (
          <div style={{padding:"20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <button onClick={()=>setView("home")} style={{background:"none",border:"1px solid #1e2a3a",color:"#94a3b8",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>← Back</button>
              <span style={{fontSize:16,fontWeight:700}}>✏️ Edit Mode</span>
            </div>

            {/* Sub-nav */}
            <div style={{display:"flex",gap:6,marginBottom:20}}>
              {[["profile","👤 Profile"],["phases","🗂 Phases"],["tasks","📋 Tasks"]].map(([k,l])=>(
                <button key={k} onClick={()=>setEditSection(k)} style={{
                  flex:1,padding:"8px 4px",borderRadius:10,fontFamily:"inherit",
                  border:`1px solid ${editSection===k?"#00D4FF":"#1e2a3a"}`,
                  background:editSection===k?"#00D4FF22":"#0f1421",
                  color:editSection===k?"#00D4FF":"#64748b",cursor:"pointer",fontSize:11
                }}>{l}</button>
              ))}
            </div>

            {/* ─── PROFILE EDITOR ─── */}
            {editSection==="profile" && (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={card}>
                  <div style={sectionLabel}>Your Profile</div>
                  {[
                    {k:"name",label:"Your Name / Role",ph:"ML Engineer"},
                    {k:"goal",label:"Goal / Tagline",ph:"Job-ready in 6 months"},
                    {k:"quote",label:"Motivational Quote",ph:"Build. Deploy. Monitor. Repeat."},
                  ].map(f=>(
                    <div key={f.k} style={{marginBottom:12}}>
                      <div style={{fontSize:11,color:"#64748b",marginBottom:5}}>{f.label}</div>
                      <input value={profile[f.k]||""} onChange={e=>updateProfile(f.k,e.target.value)}
                        placeholder={f.ph} style={inputStyle}/>
                    </div>
                  ))}
                </div>

                <div style={{background:"#1a0a0a",border:"1px solid #7f1d1d",borderRadius:14,padding:14}}>
                  <div style={{...sectionLabel,color:"#ef4444"}}>⚠️ Danger Zone</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <button onClick={resetProgress} style={{background:"#2a0a0a",border:"1px solid #7f1d1d",color:"#ef4444",borderRadius:8,padding:"9px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12,textAlign:"left"}}>
                      Reset Progress Only (keep tasks & phases)
                    </button>
                    <button onClick={resetAll} style={{background:"#2a0a0a",border:"1px solid #7f1d1d",color:"#ef4444",borderRadius:8,padding:"9px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12,textAlign:"left"}}>
                      Reset Everything to Defaults
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── PHASES EDITOR ─── */}
            {editSection==="phases" && (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{fontSize:12,color:"#64748b"}}>{phases.length} phases total</span>
                  <button onClick={addPhase} style={{background:"#00D4FF22",border:"1px solid #00D4FF55",color:"#00D4FF",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>
                    + Add Phase
                  </button>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {phases.map(p=>{
                    const open=editPhaseId===p.id;
                    return (
                      <div key={p.id} style={{...card,padding:0,overflow:"hidden",border:`1px solid ${open?p.color+"66":"#1e2a3a"}`}}>
                        {/* Header row */}
                        <div style={{padding:"13px 14px",display:"flex",alignItems:"center",gap:10}}>
                          <select value={p.icon} onChange={e=>updatePhaseField(p.id,"icon",e.target.value)}
                            style={{background:"#060910",border:"1px solid #1e2a3a",borderRadius:6,color:"#e2e8f0",fontSize:18,padding:"2px 4px",fontFamily:"inherit",cursor:"pointer",outline:"none"}}>
                            {PHASE_ICONS.map(ic=><option key={ic} value={ic}>{ic}</option>)}
                          </select>
                          <div style={{flex:1,minWidth:0}}>
                            <input value={p.month} onChange={e=>updatePhaseField(p.id,"month",e.target.value)}
                              style={{width:"100%",background:"none",border:"none",color:p.color,fontFamily:"inherit",fontSize:11,fontWeight:600,outline:"none",padding:0,marginBottom:2}}/>
                            <input value={p.title} onChange={e=>updatePhaseField(p.id,"title",e.target.value)}
                              style={{width:"100%",background:"none",border:"none",color:"#e2e8f0",fontFamily:"inherit",fontSize:13,fontWeight:600,outline:"none",padding:0}}/>
                          </div>
                          <button onClick={()=>setEditPhaseId(open?null:p.id)} style={{
                            background:"none",border:"1px solid #1e2a3a",color:"#64748b",
                            borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:13,flexShrink:0
                          }}>{open?"▲":"▼"}</button>
                        </div>

                        {open && (
                          <div style={{borderTop:"1px solid #1e2a3a",padding:"14px"}}>
                            {/* Color */}
                            <div style={{marginBottom:14}}>
                              <div style={{fontSize:11,color:"#64748b",marginBottom:7}}>Phase Color</div>
                              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                                {PHASE_COLORS.map(c=>(
                                  <div key={c} onClick={()=>updatePhaseField(p.id,"color",c)} style={{
                                    width:26,height:26,borderRadius:"50%",background:c,cursor:"pointer",
                                    border:p.color===c?"3px solid #fff":"3px solid transparent",
                                    boxShadow:p.color===c?`0 0 10px ${c}`:"none",transition:"all 0.15s"
                                  }}/>
                                ))}
                              </div>
                            </div>

                            {/* Weeks */}
                            <div style={{marginBottom:12}}>
                              <div style={{fontSize:11,color:"#64748b",marginBottom:7}}>Weeks</div>
                              {p.weeks.map((w,wi)=>(
                                <div key={w.week} style={{display:"flex",gap:8,marginBottom:7,alignItems:"center"}}>
                                  <input value={w.title} onChange={e=>updateWeekTitle(p.id,wi,e.target.value)}
                                    style={{flex:1,background:"#060910",border:"1px solid #1e2a3a",borderRadius:7,padding:"7px 10px",color:"#e2e8f0",fontFamily:"inherit",fontSize:12,outline:"none"}}/>
                                  <button onClick={()=>deleteWeek(p.id,wi)} style={{background:"none",border:"1px solid #7f1d1d",color:"#ef4444",borderRadius:7,padding:"6px 10px",cursor:"pointer",fontSize:14,flexShrink:0}}>🗑</button>
                                </div>
                              ))}
                              <button onClick={()=>addWeek(p.id)} style={{width:"100%",background:"transparent",border:"1px dashed #1e2a3a",color:"#475569",borderRadius:8,padding:"8px",cursor:"pointer",fontFamily:"inherit",fontSize:12,marginTop:4}}>
                                + Add Week
                              </button>
                            </div>

                            <button onClick={()=>deletePhase(p.id)} style={{width:"100%",background:"#2a0a0a",border:"1px solid #7f1d1d",color:"#ef4444",borderRadius:8,padding:"9px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>
                              🗑 Delete This Phase
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── TASKS EDITOR ─── */}
            {editSection==="tasks" && (
              <div>
                {/* Phase selector */}
                <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:2}}>
                  {phases.map(p=>(
                    <button key={p.id} onClick={()=>{setEditPhaseId(p.id);setEditWeekIdx(0);}} style={{
                      flexShrink:0,padding:"6px 12px",borderRadius:20,fontFamily:"inherit",
                      border:`1px solid ${editPhaseId===p.id?p.color:"#1e2a3a"}`,
                      background:editPhaseId===p.id?p.color+"22":"transparent",
                      color:editPhaseId===p.id?p.color:"#64748b",cursor:"pointer",fontSize:12
                    }}>{p.icon} M{phases.indexOf(p)+1}</button>
                  ))}
                </div>

                {(()=>{
                  const ep=phases.find(p=>p.id===editPhaseId)||phases[0];
                  if(!ep) return null;
                  const wi=editWeekIdx??0;
                  const ew=ep.weeks[wi];
                  return (
                    <div>
                      {/* Week selector */}
                      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
                        {ep.weeks.map((w,i)=>(
                          <button key={w.week} onClick={()=>setEditWeekIdx(i)} style={{
                            flexShrink:0,padding:"6px 12px",borderRadius:10,fontFamily:"inherit",
                            border:`1px solid ${wi===i?ep.color:"#1e2a3a"}`,
                            background:wi===i?ep.color+"22":"#0f1421",
                            color:wi===i?ep.color:"#64748b",cursor:"pointer",fontSize:11
                          }}>Wk {i+1}</button>
                        ))}
                      </div>

                      {ew ? (
                        <div>
                          <div style={{fontSize:13,color:"#94a3b8",fontWeight:600,marginBottom:12}}>{ew.title}</div>
                          <div style={{display:"flex",flexDirection:"column",gap:8}}>
                            {ew.days.map((task,ti)=>(
                              <div key={task.id} style={{...card,padding:12}}>
                                <textarea value={task.task}
                                  onChange={e=>updateTask(ep.id,wi,ti,"task",e.target.value)}
                                  style={{...inputStyle,minHeight:48,resize:"none",marginBottom:8}}
                                />
                                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                                  <select value={task.type} onChange={e=>updateTask(ep.id,wi,ti,"type",e.target.value)}
                                    style={{flex:1,background:"#060910",border:"1px solid #1e2a3a",borderRadius:7,color:TYPE_COLORS[task.type]?.text||"#94a3b8",fontFamily:"inherit",fontSize:11,padding:"6px 8px",outline:"none",cursor:"pointer"}}>
                                    {TYPE_LIST.map(t=><option key={t} value={t}>{t}</option>)}
                                  </select>
                                  <button onClick={()=>deleteTask(ep.id,wi,ti)} style={{background:"none",border:"1px solid #7f1d1d",color:"#ef4444",borderRadius:7,padding:"6px 10px",cursor:"pointer",fontSize:14,flexShrink:0}}>🗑</button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button onClick={()=>addTask(ep.id,wi)} style={{
                            width:"100%",marginTop:12,background:"transparent",
                            border:"1px dashed #1e2a3a",color:"#475569",
                            borderRadius:10,padding:"10px",cursor:"pointer",
                            fontFamily:"inherit",fontSize:12
                          }}>+ Add Task to This Week</button>
                        </div>
                      ) : (
                        <div style={{color:"#475569",fontSize:13,textAlign:"center",padding:20}}>No weeks yet. Add one in the Phases tab.</div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Nav */}
      <div style={{
        position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:430,
        background:"#0d1117",borderTop:"1px solid #1e2a3a",
        display:"flex",zIndex:100
      }}>
        {[
          {key:"home",   icon:"🏠", label:"Home"},
          {key:"tracker",icon:"📋", label:"Tasks"},
          {key:"stats",  icon:"📊", label:"Stats"},
          {key:"edit",   icon:"✏️", label:"Edit"},
        ].map(nav=>(
          <button key={nav.key} onClick={()=>setView(nav.key)} style={{
            flex:1,padding:"12px 8px 16px",background:"none",border:"none",
            cursor:"pointer",fontFamily:"inherit",
            display:"flex",flexDirection:"column",alignItems:"center",gap:2,
          }}>
            <span style={{fontSize:19}}>{nav.icon}</span>
            <span style={{fontSize:10,color:view===nav.key?"#00D4FF":"#475569",letterSpacing:1}}>{nav.label}</span>
            {view===nav.key&&<div style={{width:18,height:2,background:"#00D4FF",borderRadius:2,boxShadow:"0 0 6px #00D4FF"}}/>}
          </button>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:#0a0a0f;}
        ::-webkit-scrollbar-thumb{background:#1e2a3a;border-radius:4px;}
        input:focus,textarea:focus,select:focus{border-color:#00D4FF!important;}
        button:active{opacity:0.7;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>
    </div>
  );
}
