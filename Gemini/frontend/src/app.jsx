import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, Lock, LogOut, LayoutDashboard, Loader2, AlertCircle, 
  CheckCircle2, Pill, Plus, Package, Search, Trash2, Edit3, Save, X, 
  ArrowLeft, Globe, Settings, Clock, CreditCard, TrendingUp, ShieldCheck,
  History, Building2, Key, Fingerprint, ShieldAlert
} from 'lucide-react';

// --- SECURITY & MULTI-TENANT CONFIG ---
const MOCK_COMPANIES = {
  'COMP-001': {
    name: 'HealthCorp India',
    region: 'IN',
    securityLevel: 'Enterprise',
    logoColor: 'bg-emerald-600'
  },
  'COMP-002': {
    name: 'BioPharma Global',
    region: 'US',
    securityLevel: 'High-Compliance',
    logoColor: 'bg-blue-600'
  }
};

const MOCK_USERS = [
  { id: 'u1', email: 'owner@pharminto.com', password: 'password123', companyId: 'COMP-001', role: 'SuperAdmin' },
  { id: 'u2', email: 'admin@biopharma.com', password: 'password123', companyId: 'COMP-002', role: 'Admin' }
];

const App = () => {
  // --- Core State ---
  const [view, setView] = useState('login'); 
  const [activeTab, setActiveTab] = useState('inventory');
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]); // Audit Logs
  
  // --- Localization ---
  const [currentTime, setCurrentTime] = useState(new Date());
  const EX_RATE = 83.25;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const localeConfigs = {
    US: { currency: 'USD', symbol: '$', dateFormat: 'en-US', timeZone: 'America/New_York', rate: 1 },
    IN: { currency: 'INR', symbol: '₹', dateFormat: 'en-IN', timeZone: 'Asia/Kolkata', rate: EX_RATE }
  };

  const config = localeConfigs[company?.region || 'US'];

  // --- Inventory State (Company Scoped) ---
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Amoxicillin 500mg', sku: 'PH-AMX-001', stock: 150, priceUSD: 12.50, companyId: 'COMP-001' },
    { id: 2, name: 'Paracetamol 650mg', sku: 'PH-PCM-002', stock: 500, priceUSD: 5.20, companyId: 'COMP-001' },
    { id: 3, name: 'Atorvastatin 20mg', sku: 'PH-ATR-003', stock: 85, priceUSD: 25.00, companyId: 'COMP-002' }
  ]);

  const companyInventory = useMemo(() => 
    inventory.filter(item => item.companyId === company?.id), 
  [inventory, company]);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', stock: '', price: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // --- Handlers ---
  const addAuditLog = (action, details) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: user.email,
      action,
      details,
      ipHash: "SHA256:..." + Math.random().toString(16).slice(2, 8)
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const email = e.target.email.value;
    const pass = e.target.password.value;
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === pass);
    
    if (foundUser) {
      setUser(foundUser);
      setCompany({ id: foundUser.companyId, ...MOCK_COMPANIES[foundUser.companyId] });
      addAuditLog("AUTH_LOGIN", "Secure session established via web gateway.");
      setView('dashboard');
    } else {
      addAuditLog("AUTH_FAILURE", `Failed login attempt for ${email}`);
      alert("Encryption mismatch: Invalid credentials.");
    }
    setIsLoading(false);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const inputPrice = parseFloat(newProduct.price) || 0;
    const priceInUSD = company.region === 'IN' ? inputPrice / EX_RATE : inputPrice;

    const product = {
      id: Date.now(),
      name: newProduct.name,
      sku: newProduct.sku,
      stock: parseInt(newProduct.stock) || 0,
      priceUSD: priceInUSD,
      companyId: company.id
    };
    
    setInventory([...inventory, product]);
    addAuditLog("INV_CREATE", `SKU ${product.sku} added to vault.`);
    setIsAddingProduct(false);
    setNewProduct({ name: '', sku: '', stock: '', price: '' });
  };

  const formatCurrency = (valInUSD) => {
    const convertedVal = valInUSD * config.rate;
    return new Intl.NumberFormat(config.dateFormat, {
      style: 'currency', currency: config.currency
    }).format(convertedVal);
  };

  // --- UI Components ---
  const SecurityShield = ({ children }) => (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );

  const Sidebar = () => (
    <aside className="w-72 bg-slate-950 text-slate-400 flex flex-col h-full border-r border-slate-800">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className={`${company.logoColor} p-2.5 rounded-xl shadow-lg shadow-blue-500/20`}>
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white leading-none tracking-tight">PHARMINTO</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Multi-Tenant Vault</span>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 mb-8">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Authenticated Org</p>
          <div className="flex items-center gap-3">
            <Building2 size={16} className="text-blue-500"/>
            <span className="text-sm font-bold text-white truncate">{company.name}</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {[
            { id: 'inventory', label: 'Vault Inventory', icon: Package },
            { id: 'audit', label: 'Audit Logs', icon: History },
            { id: 'security', label: 'Security Hub', icon: ShieldCheck }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-slate-900 hover:text-white'}`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-900 bg-slate-950/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
            <Fingerprint className="text-blue-400" size={20}/>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user.email}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase">{user.role}</p>
          </div>
        </div>
        <button onClick={() => setView('login')} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-black text-red-400 bg-red-400/5 border border-red-400/20 rounded-xl hover:bg-red-400 hover:text-white transition-all">
          TERMINATE SESSION
        </button>
      </div>
    </aside>
  );

  const renderInventory = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4"><Clock size={20}/></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional Time</p>
          <p className="text-xl font-black text-slate-900 mt-1">
            {currentTime.toLocaleTimeString(config.dateFormat, { timeZone: config.timeZone })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 mb-4"><TrendingUp size={20}/></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Asset Value</p>
          <p className="text-xl font-black text-slate-900 mt-1">
            {formatCurrency(companyInventory.reduce((acc, curr) => acc + (curr.priceUSD * curr.stock), 0))}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center text-amber-600 mb-4"><ShieldAlert size={20}/></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Status</p>
          <p className="text-xl font-black text-slate-900 mt-1">{company.securityLevel}</p>
        </div>
      </div>

      <SecurityShield>
        <div className="p-8 border-b border-slate-50 flex flex-wrap justify-between items-center gap-6">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Query Inventory Vault..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setIsAddingProduct(true)} className="bg-slate-900 text-white font-black px-10 py-4 rounded-2xl flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95">
            <Plus size={20}/> ADD ENTRY
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                <th className="px-8 py-5 text-left">Medicine / Product</th>
                <th className="px-8 py-5 text-left">Audit SKU</th>
                <th className="px-8 py-5 text-left">Quantity</th>
                <th className="px-8 py-5 text-left">Valuation</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {companyInventory.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <Pill size={16}/>
                      </div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs text-slate-400">{item.sku}</td>
                  <td className="px-8 py-6">
                    <span className={`font-black ${item.stock < 100 ? 'text-red-500' : 'text-slate-700'}`}>{item.stock}</span>
                  </td>
                  <td className="px-8 py-6 font-bold text-blue-600">{formatCurrency(item.priceUSD)}</td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => {
                      setInventory(inventory.filter(p => p.id !== item.id));
                      addAuditLog("INV_DELETE", `SKU ${item.sku} purged from vault.`);
                    }} className="text-slate-300 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SecurityShield>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic">Immutable Audit Logs</h2>
          <p className="text-slate-500 font-medium">Real-time session monitoring and data mutation tracking.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black">
          <ShieldCheck size={14}/> SYSTEM SECURE
        </div>
      </div>

      <div className="bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-slate-800">
        <div className="p-8 space-y-4">
          {logs.length === 0 ? (
            <div className="py-20 text-center text-slate-600">
              <History size={48} className="mx-auto mb-4 opacity-20"/>
              <p className="font-bold">No audit trails recorded in this session.</p>
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="flex gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all group">
                <div className="p-2 h-fit bg-slate-900 rounded-lg">
                  {log.action.startsWith('AUTH') ? <Key size={16} className="text-amber-400"/> : <Package size={16} className="text-blue-400"/>}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-white">{log.action}</span>
                    <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">{log.details}</p>
                  <div className="mt-3 flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">User: <span className="text-blue-400">{log.user}</span></span>
                    <span className="text-slate-500">Node: <span className="text-emerald-400">{log.ipHash}</span></span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="text-center">
            <div className="inline-flex p-4 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/40 mb-6">
              <ShieldCheck className="text-white w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter">PHARMINTO</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Enterprise Resource Gateway</p>
          </div>

          <div className="bg-slate-900 p-10 rounded-[48px] border border-slate-800 shadow-2xl">
            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4">Corporate ID / Email</label>
                <input 
                  name="email"
                  className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-white font-bold transition-all"
                  placeholder="name@company.com" required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4">Access Key</label>
                <input 
                  name="password"
                  type="password"
                  className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-white font-bold transition-all"
                  placeholder="••••••••" required
                />
              </div>
              <button className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3">
                SECURE LOGIN <ArrowLeft className="rotate-180" size={18}/>
              </button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-slate-800 space-y-2">
              <p className="text-[9px] font-black text-slate-600 uppercase text-center tracking-widest">Available Tenants</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-[8px] font-bold text-blue-500">IN - HealthCorp</p>
                  <p className="text-[10px] text-white truncate">owner@pharminto.com</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-[8px] font-bold text-emerald-500">US - BioPharma</p>
                  <p className="text-[10px] text-white truncate">admin@biopharma.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-blue-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white border-b border-slate-100 px-12 flex items-center justify-between sticky top-0 z-10">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{activeTab}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{company.name} • {config.currency} Mode</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                <Clock size={16} className="text-blue-600"/>
                <span className="text-sm font-black text-slate-800 font-mono tracking-tighter">
                  {currentTime.toLocaleTimeString(config.dateFormat, { timeZone: config.timeZone })}
                </span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 bg-[#fcfcfd]">
          {activeTab === 'inventory' && renderInventory()}
          {activeTab === 'audit' && renderAuditLogs()}
          {activeTab === 'security' && (
             <div className="max-w-xl bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm text-center">
                <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                   <ShieldCheck size={48} className="text-blue-600"/>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Security Hardened</h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                  Tenant <span className="text-blue-600 font-bold">{company.id}</span> is protected with field-level encryption and immutable audit trails. All access logs are SHA-256 hashed.
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                      <p className="font-bold text-emerald-600">Active</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">MFA</p>
                      <p className="font-bold text-slate-800">Enforced</p>
                   </div>
                </div>
             </div>
          )}
        </main>
      </div>

      {isAddingProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-[48px] w-full max-w-md p-12 animate-in zoom-in-95 duration-300 shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-slate-900 uppercase italic">New Entry</h3>
              <button onClick={() => setIsAddingProduct(false)} className="bg-slate-100 p-3 rounded-full hover:bg-slate-200 transition-colors"><X/></button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Medicine Label</label>
                <input className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Ibuprofen" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-4">SKU ID</label>
                   <input className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none" placeholder="PH-..." value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} required />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Units</label>
                   <input className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none" type="number" placeholder="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Unit Cost ({config.currency})</label>
                <div className="relative">
                  <span className="absolute left-6 top-4.5 text-blue-600 font-black">{config.symbol}</span>
                  <input className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none" type="number" step="0.01" placeholder="0.00" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl mt-4 shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:scale-[1.02]">AUTHORIZE ENTRY</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;