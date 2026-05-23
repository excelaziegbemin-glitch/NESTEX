import { useState, useEffect, useRef, useCallback } from "react";

// ─── GLOBAL TOAST ─────────────────────────────────────────────────────────────
let _setToasts = null;
const toast = (msg, type = "success") => {
  if (!_setToasts) return;
  const id = Date.now() + Math.random();
  _setToasts(t => [...t, { id, msg, type }]);
  setTimeout(() => _setToasts(t => t.filter(x => x.id !== id)), 3800);
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const PROPERTIES = [
  { id:1, title:"Modern 3-Bed Duplex", price:2500000, priceLabel:"₦2.5M/yr", type:"Rent", cat:"Duplex", beds:3, baths:2, sqm:180, addr:"14 Admiralty Way", city:"Lekki", state:"Lagos", verified:true, featured:true, agent:{name:"Chidi Okonkwo",phone:"+2348012345678",rating:4.8,count:24,id:"a1"}, feats:["Pool","Security","Generator","Parking","AC"], desc:"Stunning duplex in the heart of Lekki Phase 1 with modern finishes, spacious rooms, premium kitchen fittings and excellent ventilation. Close to major landmarks and shopping centres.", imgs:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80","https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80"], views:284, leads:18 },
  { id:2, title:"Cozy Studio Apartment", price:600000, priceLabel:"₦600K/yr", type:"Rent", cat:"Studio", beds:1, baths:1, sqm:45, addr:"7 Allen Avenue", city:"Ikeja", state:"Lagos", verified:true, featured:false, agent:{name:"Ngozi Adeyemi",phone:"+2348023456789",rating:4.5,count:18,id:"a2"}, feats:["Security","Parking","AC"], desc:"Compact and fully furnished studio apartment perfect for young professionals. Walking distance from Ikeja City Mall and major bus stops.", imgs:["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80"], views:142, leads:9 },
  { id:3, title:"Luxury 4-Bed Apartment", price:5000000, priceLabel:"₦5M/yr", type:"Rent", cat:"Apartment", beds:4, baths:3, sqm:320, addr:"Plot 2 Bourdillon Rd", city:"Ikoyi", state:"Lagos", verified:true, featured:true, agent:{name:"Emeka Eze",phone:"+2348034567890",rating:4.9,count:41,id:"a3"}, feats:["Pool","Gym","Security","Generator","Parking","Sea View","AC","Elevator"], desc:"Premium apartment on Bourdillon Road, Ikoyi. Breathtaking views of the Lagos Lagoon with world-class amenities and dedicated concierge service.", imgs:["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80","https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80"], views:521, leads:34 },
  { id:4, title:"3-Bedroom Bungalow", price:1800000, priceLabel:"₦1.8M/yr", type:"Rent", cat:"Bungalow", beds:3, baths:2, sqm:140, addr:"22 Ogui Road", city:"Enugu", state:"Enugu", verified:false, featured:false, agent:{name:"Amaka Obi",phone:"+2348045678901",rating:4.2,count:9,id:"a4"}, feats:["Generator","Parking","Borehole"], desc:"Spacious bungalow in a quiet estate in Enugu. Perfect for families looking for comfort and tranquility away from the city noise.", imgs:["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80","https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80"], views:98, leads:5 },
  { id:5, title:"Executive Self-Contain", price:450000, priceLabel:"₦450K/yr", type:"Rent", cat:"Self-Contain", beds:1, baths:1, sqm:38, addr:"15 Wuse Zone 5", city:"Abuja", state:"FCT", verified:true, featured:false, agent:{name:"Ibrahim Sani",phone:"+2348056789012",rating:4.6,count:15,id:"a5"}, feats:["Security","Parking","Generator"], desc:"Neat and well-maintained self-contain in Wuse. Close to major government offices and commercial areas.", imgs:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80"], views:67, leads:4 },
  { id:6, title:"Shortlet – Lekki Phase 1", price:35000, priceLabel:"₦35K/night", type:"Shortlet", cat:"Apartment", beds:2, baths:2, sqm:95, addr:"1a Admiralty Close", city:"Lekki", state:"Lagos", verified:true, featured:true, agent:{name:"Funke Adeyinka",phone:"+2348067890123",rating:4.7,count:32,id:"a6"}, feats:["Pool","WiFi","Netflix","AC","Security","Parking"], desc:"Luxurious shortlet apartment perfect for business trips or vacations. Fully furnished with Netflix, fast WiFi, and a shared rooftop pool.", imgs:["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80","https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80","https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=900&q=80"], views:389, leads:28 },
  { id:7, title:"5-Bed Detached House", price:85000000, priceLabel:"₦85M", type:"Buy", cat:"Duplex", beds:5, baths:4, sqm:450, addr:"Plot 44 Maitama", city:"Abuja", state:"FCT", verified:true, featured:true, agent:{name:"Kabiru Musa",phone:"+2348078901234",rating:4.9,count:28,id:"a7"}, feats:["Pool","Gym","BQ","Generator","Smart Home","Parking","Garden"], desc:"Magnificent 5-bedroom detached house in prestigious Maitama. Premium finishes throughout with smart home integration.", imgs:["https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=900&q=80","https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=900&q=80"], views:743, leads:52 },
  { id:8, title:"2-Bedroom Flat", price:950000, priceLabel:"₦950K/yr", type:"Rent", cat:"Apartment", beds:2, baths:2, sqm:85, addr:"Block C Trans Amadi", city:"Port Harcourt", state:"Rivers", verified:true, featured:false, agent:{name:"Tunde Akin",phone:"+2348089012345",rating:4.3,count:11,id:"a8"}, feats:["Generator","Parking","Security"], desc:"Clean 2-bedroom flat in Trans Amadi industrial layout. Suitable for working professionals in the oil sector.", imgs:["https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=900&q=80"], views:112, leads:7 },
  { id:9, title:"Mini Flat – Surulere", price:380000, priceLabel:"₦380K/yr", type:"Rent", cat:"Apartment", beds:1, baths:1, sqm:42, addr:"23 Bode Thomas St", city:"Surulere", state:"Lagos", verified:true, featured:false, agent:{name:"Chidi Okonkwo",phone:"+2348012345678",rating:4.8,count:24,id:"a1"}, feats:["Security","Borehole"], desc:"Affordable mini flat in the heart of Surulere. Great for young professionals and students.", imgs:["https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=900&q=80"], views:203, leads:14 },
  { id:10, title:"3-Bed Terrace Duplex", price:3200000, priceLabel:"₦3.2M/yr", type:"Rent", cat:"Terrace", beds:3, baths:3, sqm:210, addr:"Chevron Drive", city:"Lekki", state:"Lagos", verified:true, featured:false, agent:{name:"Ngozi Adeyemi",phone:"+2348023456789",rating:4.5,count:18,id:"a2"}, feats:["Pool","Security","Generator","Parking","AC"], desc:"Modern terrace duplex in a serene estate. Features a communal pool and 24/7 security.", imgs:["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80","https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80"], views:178, leads:11 },
  { id:11, title:"Office Space – Victoria Island", price:8000000, priceLabel:"₦8M/yr", type:"Rent", cat:"Commercial", beds:0, baths:2, sqm:500, addr:"10 Adeola Odeku", city:"Victoria Island", state:"Lagos", verified:true, featured:false, agent:{name:"Emeka Eze",phone:"+2348034567890",rating:4.9,count:41,id:"a3"}, feats:["Elevator","Generator","Parking","Security","AC"], desc:"Prime office space in the heart of Victoria Island business district. Open plan with meeting rooms.", imgs:["https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80"], views:95, leads:6 },
  { id:12, title:"4-Bed Semi-Detached", price:45000000, priceLabel:"₦45M", type:"Buy", cat:"Duplex", beds:4, baths:3, sqm:280, addr:"Guzape District", city:"Abuja", state:"FCT", verified:true, featured:false, agent:{name:"Kabiru Musa",phone:"+2348078901234",rating:4.9,count:28,id:"a7"}, feats:["Generator","Parking","Security","BQ"], desc:"Beautiful semi-detached duplex in Guzape. Modern design with quality finishing throughout.", imgs:["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80"], views:267, leads:19 },
];

const STATES = ["Lagos","Abuja (FCT)","Rivers","Oyo","Kano","Kaduna","Anambra","Enugu","Delta","Edo","Ondo","Osun","Ogun","Kwara","Benue"];
const CATS = ["Apartment","Duplex","Bungalow","Self-Contain","Studio","Terrace","Commercial"];
const LOCS = [
  {name:"Lekki",state:"Lagos",count:284,img:"https://images.unsplash.com/photo-1567967455389-e432b6e444ea?w=500&q=80"},
  {name:"Victoria Island",state:"Lagos",count:156,img:"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80"},
  {name:"Maitama",state:"Abuja",count:93,img:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&q=80"},
  {name:"Ikoyi",state:"Lagos",count:118,img:"https://images.unsplash.com/photo-1582407947304-fd86f28f8b64?w=500&q=80"},
  {name:"GRA Port Harcourt",state:"Rivers",count:71,img:"https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=500&q=80"},
  {name:"Asokoro",state:"Abuja",count:64,img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80"},
];

const PLANS = [
  { id:"starter", name:"Starter", price:0, priceLabel:"Free", color:"#6b7c75", features:["5 free lead credits","Up to 3 listings","Basic profile","Email support"], leads:5, listings:3, badge:"" },
  { id:"pro", name:"Pro", price:15000, priceLabel:"₦15,000/mo", color:"#16a34a", features:["50 lead credits/month","Up to 20 listings","Verified badge","Featured placement","Priority support","Analytics dashboard"], leads:50, listings:20, badge:"Most Popular" },
  { id:"elite", name:"Elite", price:35000, priceLabel:"₦35,000/mo", color:"#0d1f18", features:["Unlimited lead credits","Unlimited listings","Top verified badge","Homepage featured","Dedicated account manager","Advanced analytics","Referral bonuses"], leads:999, listings:999, badge:"Best Value" },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --g:#16a34a;--g2:#15803d;--g3:#dcfce7;--g4:#bbf7d0;--g5:#f0fdf4;
  --dark:#0a0f0d;--dark2:#111714;--dark3:#1c2b23;
  --white:#ffffff;--off:#f7faf8;--off2:#eef5f1;
  --text:#0d1f18;--text2:#2d4438;--text3:#6b8c7a;
  --border:#ddeae3;--border2:#c5dbd0;
  --red:#ef4444;--amber:#f59e0b;--blue:#3b82f6;
  --sh:0 1px 3px rgba(0,0,0,.05),0 4px 16px rgba(0,0,0,.06);
  --sh2:0 8px 32px rgba(0,0,0,.1),0 2px 8px rgba(0,0,0,.05);
  --sh3:0 20px 60px rgba(0,0,0,.15);
  --r:12px;--r2:18px;--r3:26px;
}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;background:var(--off);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.6}
h1,h2,h3,h4,h5{font-family:'Syne',sans-serif;line-height:1.15}
button{cursor:pointer;border:none;outline:none;font-family:inherit}
input,textarea,select{font-family:inherit;outline:none;border:none;background:transparent}
a{text-decoration:none;color:inherit}
img{display:block;max-width:100%}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:99px}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

.anim-up{animation:fadeUp .45s ease both}
.anim-in{animation:fadeIn .3s ease both}
.anim-scale{animation:scaleIn .3s ease both}
.d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}.d5{animation-delay:.25s}.d6{animation-delay:.3s}

/* Skeleton */
.skel{background:linear-gradient(90deg,var(--border) 0%,var(--off2) 50%,var(--border) 100%);background-size:400px 100%;animation:shimmer 1.4s infinite;border-radius:8px}

/* Layout */
.app-shell{display:flex;flex-direction:column;min-height:100vh}
.main-content{flex:1}
.container{max-width:1240px;margin:0 auto;padding:0 20px}
.with-sidebar{display:flex;min-height:calc(100vh - 68px)}

/* Header */
.header{position:sticky;top:0;z-index:200;background:rgba(255,255,255,.96);backdrop-filter:blur(14px);border-bottom:1px solid var(--border);height:68px;display:flex;align-items:center}
.header-inner{display:flex;align-items:center;justify-content:space-between;width:100%;padding:0 24px}
.header-nav{display:flex;align-items:center;gap:4px}
.hn-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;font-size:14px;font-weight:500;color:var(--text2);transition:all .2s;white-space:nowrap}
.hn-btn:hover,.hn-btn.active{background:var(--g5);color:var(--g2)}
.hn-btn.active{font-weight:700}
.header-actions{display:flex;align-items:center;gap:10px}

/* Logo */
.logo{display:flex;align-items:center;gap:10px;cursor:pointer}
.logo-mark{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,var(--g),var(--g2));display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 12px rgba(22,163,74,.3)}
.logo-text{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;letter-spacing:-1px;color:var(--text)}
.logo-text span{color:var(--g)}

/* Buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;border-radius:var(--r);font-size:14px;font-weight:600;transition:all .2s;white-space:nowrap;cursor:pointer}
.btn-primary{background:var(--g);color:#fff}
.btn-primary:hover{background:var(--g2);transform:translateY(-1px);box-shadow:0 6px 20px rgba(22,163,74,.3)}
.btn-dark{background:var(--dark);color:#fff}
.btn-dark:hover{background:var(--dark3);transform:translateY(-1px)}
.btn-ghost{background:transparent;color:var(--text2);border:1.5px solid var(--border2)}
.btn-ghost:hover{background:var(--off2);border-color:var(--border2)}
.btn-outline{background:transparent;color:var(--g);border:1.5px solid var(--g)}
.btn-outline:hover{background:var(--g5)}
.btn-danger{background:#fee2e2;color:var(--red);border:1.5px solid #fecaca}
.btn-danger:hover{background:#fecaca}
.btn-warn{background:#fef3c7;color:#92400e}
.btn-sm{padding:7px 14px;font-size:13px;border-radius:9px}
.btn-lg{padding:14px 28px;font-size:16px;border-radius:var(--r2)}
.btn-xl{padding:16px 36px;font-size:17px;border-radius:var(--r2)}
.btn-icon{padding:9px;border-radius:50%;width:38px;height:38px}
.btn-w{width:100%}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}

/* Inputs */
.inp-wrap{display:flex;flex-direction:column;gap:6px}
.inp-label{font-size:13px;font-weight:600;color:var(--text2)}
.inp{width:100%;padding:11px 15px;border:1.5px solid var(--border2);border-radius:var(--r);font-size:14px;color:var(--text);background:#fff;transition:all .2s}
.inp:focus{border-color:var(--g);box-shadow:0 0 0 3px rgba(22,163,74,.1)}
.inp::placeholder{color:var(--text3)}
textarea.inp{resize:vertical;min-height:96px}
select.inp{cursor:pointer}

/* Cards */
.card{background:#fff;border-radius:var(--r2);box-shadow:var(--sh);overflow:hidden}
.card-p{padding:22px}
.card-p-lg{padding:28px}

/* Badge */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.3px}
.badge-green{background:var(--g3);color:var(--g2)}
.badge-amber{background:#fef3c7;color:#92400e}
.badge-red{background:#fee2e2;color:#b91c1c}
.badge-dark{background:var(--dark);color:#fff}
.badge-blue{background:#dbeafe;color:#1d4ed8}
.badge-purple{background:#ede9fe;color:#6d28d9}

/* Property card */
.pcard{background:#fff;border-radius:var(--r2);overflow:hidden;box-shadow:var(--sh);transition:all .28s;cursor:pointer;border:1.5px solid transparent;position:relative}
.pcard:hover{transform:translateY(-4px);box-shadow:var(--sh2);border-color:var(--g4)}
.pcard-img{position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--off2)}
.pcard-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.pcard:hover .pcard-img img{transform:scale(1.06)}
.pcard-body{padding:16px}
.pcard-price{font-family:'Syne',sans-serif;font-size:19px;font-weight:800;color:var(--g2)}
.pcard-title{font-size:14px;font-weight:600;margin:4px 0 3px;color:var(--text)}
.pcard-loc{font-size:12px;color:var(--text3);display:flex;align-items:center;gap:3px}
.pcard-meta{display:flex;gap:12px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);flex-wrap:wrap}
.pcard-meta-i{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text3);font-weight:500}
.pcard-badge{position:absolute;top:10px;left:10px;background:rgba(10,15,13,.78);backdrop-filter:blur(8px);color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:99px;letter-spacing:.5px;text-transform:uppercase}
.pcard-verified{position:absolute;bottom:10px;left:10px;background:rgba(22,163,74,.9);color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px}
.pcard-featured{position:absolute;top:10px;right:44px;background:rgba(245,158,11,.9);color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px}
.fav-btn{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,.12);transition:all .2s}
.fav-btn:hover{transform:scale(1.12)}
.fav-btn.active{background:#fee2e2}

/* Chips */
.chip{padding:7px 16px;border-radius:99px;font-size:13px;font-weight:600;border:1.5px solid var(--border2);color:var(--text2);background:#fff;cursor:pointer;transition:all .2s;white-space:nowrap}
.chip.active{background:var(--g);color:#fff;border-color:var(--g)}
.chip:hover:not(.active){border-color:var(--g);color:var(--g)}
.chips{display:flex;gap:8px;flex-wrap:wrap}

/* Grids */
.g2{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@media(max-width:1100px){.g4{grid-template-columns:repeat(3,1fr)}}
@media(max-width:900px){.g3,.g4{grid-template-columns:repeat(2,1fr)}}
@media(max-width:620px){.g2,.g3,.g4{grid-template-columns:1fr}.with-sidebar{flex-direction:column}}

/* Divider */
.div{height:1px;background:var(--border);margin:20px 0}

/* Sidebar */
.sidebar{width:256px;min-height:100%;background:#fff;border-right:1px solid var(--border);flex-shrink:0;padding:0}
.sidebar-top{padding:22px 18px 16px;border-bottom:1px solid var(--border)}
.sb-nav{padding:10px}
.sbn-item{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:var(--r);font-size:14px;font-weight:500;color:var(--text2);cursor:pointer;transition:all .2s;margin-bottom:2px}
.sbn-item:hover{background:var(--g5);color:var(--g2)}
.sbn-item.active{background:var(--g3);color:var(--g2);font-weight:700}
.sbn-icon{font-size:17px;width:22px;text-align:center}
.sbn-section{font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;padding:14px 14px 6px}

/* Content area */
.content-area{flex:1;padding:28px;overflow:auto;background:var(--off)}

/* Section header */
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.sec-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800}

/* Stats */
.stat-card{background:#fff;border-radius:var(--r2);padding:22px;box-shadow:var(--sh);border:1.5px solid var(--border)}
.stat-val{font-family:'Syne',sans-serif;font-size:30px;font-weight:800;line-height:1}
.stat-lbl{font-size:13px;color:var(--text3);margin-top:5px;font-weight:500}
.stat-trend{font-size:12px;font-weight:700;margin-top:6px}
.up{color:var(--g)}.dn{color:var(--red)}

/* Table */
.tbl{width:100%;border-collapse:collapse;font-size:14px}
.tbl th{text-align:left;padding:11px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);border-bottom:1.5px solid var(--border);white-space:nowrap}
.tbl td{padding:13px 16px;border-bottom:1px solid var(--border);color:var(--text2);vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:var(--g5)}

/* Modal */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease}
.modal{background:#fff;border-radius:var(--r3);padding:32px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:var(--sh3);animation:scaleIn .3s ease}
.modal-lg{max-width:660px}
.modal-xl{max-width:880px}
.modal-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
.modal-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800}
.modal-close{width:34px;height:34px;border-radius:50%;background:var(--off2);display:flex;align-items:center;justify-content:center;font-size:17px;cursor:pointer;border:none;transition:background .2s}
.modal-close:hover{background:var(--border)}

/* Toast */
.toast-wrap{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.toast{display:flex;align-items:center;gap:10px;padding:13px 18px;border-radius:var(--r2);min-width:260px;max-width:380px;background:var(--dark);color:#fff;font-size:14px;font-weight:500;box-shadow:var(--sh3);animation:fadeUp .3s ease;pointer-events:all}
.toast-success{border-left:3px solid var(--g)}
.toast-error{border-left:3px solid var(--red)}
.toast-info{border-left:3px solid var(--blue)}
.toast-warn{border-left:3px solid var(--amber)}

/* Spinner */
.spinner{border:2.5px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
.spinner-dark{border-color:var(--border2);border-top-color:var(--g)}

/* Avatar */
.avatar{border-radius:50%;background:var(--g3);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--g2);font-family:'Syne',sans-serif;flex-shrink:0}

/* Carousel */
.carousel{position:relative;aspect-ratio:16/9;overflow:hidden;background:var(--off2)}
.carousel img{width:100%;height:100%;object-fit:cover}
.car-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.9);backdrop-filter:blur(6px);width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;cursor:pointer;border:none;box-shadow:var(--sh);transition:all .2s}
.car-btn:hover{background:#fff;transform:translateY(-50%) scale(1.06)}
.car-prev{left:12px}.car-next{right:12px}
.car-dots{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:5px}
.car-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.5);cursor:pointer;transition:all .2s}
.car-dot.active{background:#fff;width:18px;border-radius:4px}

/* Scroll x */
.scroll-x{display:flex;gap:16px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none}
.scroll-x::-webkit-scrollbar{display:none}

/* Loc tile */
.loc-tile{border-radius:var(--r2);overflow:hidden;position:relative;cursor:pointer;min-width:190px;aspect-ratio:4/3;flex-shrink:0;transition:transform .3s}
.loc-tile:hover{transform:scale(1.03)}
.loc-tile img{width:100%;height:100%;object-fit:cover}
.loc-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 55%);display:flex;flex-direction:column;justify-content:flex-end;padding:14px}
.loc-name{color:#fff;font-family:'Syne',sans-serif;font-size:15px;font-weight:700}
.loc-count{color:rgba(255,255,255,.7);font-size:12px}

/* Hero */
.hero{background:linear-gradient(140deg,var(--dark) 0%,var(--dark3) 50%,#0f2e1e 100%);padding:72px 24px 80px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 25% 60%,rgba(22,163,74,.18) 0%,transparent 55%),radial-gradient(ellipse at 75% 20%,rgba(22,163,74,.1) 0%,transparent 50%)}
.hero-inner{position:relative;z-index:1;max-width:740px;margin:0 auto;text-align:center}
.hero h1{font-size:clamp(30px,5.5vw,58px);font-weight:800;color:#fff;line-height:1.08;letter-spacing:-1px}
.hero h1 em{color:var(--g);font-style:normal}
.hero-sub{color:rgba(255,255,255,.6);font-size:clamp(14px,2vw,17px);margin:14px 0 36px;font-weight:400}
.search-bar{background:#fff;border-radius:var(--r2);padding:7px 7px 7px 20px;display:flex;align-items:center;gap:8px;box-shadow:var(--sh3)}
.search-bar input{flex:1;font-size:15px;color:var(--text)}
.search-bar input::placeholder{color:var(--text3)}
.hero-chips{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:20px}
.hero-chip{padding:7px 18px;border-radius:99px;font-size:13px;font-weight:600;border:1.5px solid rgba(255,255,255,.2);color:rgba(255,255,255,.85);background:rgba(255,255,255,.08);cursor:pointer;transition:all .2s;backdrop-filter:blur(4px)}
.hero-chip:hover,.hero-chip.active{background:var(--g);border-color:var(--g);color:#fff}
.hero-stats{display:flex;gap:32px;justify-content:center;margin-top:32px;flex-wrap:wrap}
.hero-stat{text-align:center}
.hero-stat-val{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:#fff}
.hero-stat-lbl{font-size:12px;color:rgba(255,255,255,.5);margin-top:2px}

/* Feature pill */
.feat-pill{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:var(--r);background:var(--off);font-size:13px;color:var(--text2);font-weight:500;border:1px solid var(--border)}

/* Agent contact card */
.agent-box{background:var(--off2);border-radius:var(--r2);padding:18px;border:1.5px solid var(--border)}
.agent-av{width:52px;height:52px;border-radius:50%;background:var(--g3);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:var(--g2);font-family:'Syne',sans-serif;flex-shrink:0}

/* Wallet card */
.wallet{background:linear-gradient(135deg,var(--dark) 0%,var(--dark3) 60%,#0f3a22 100%);border-radius:var(--r3);padding:28px;color:#fff;position:relative;overflow:hidden}
.wallet::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(22,163,74,.12)}
.wallet::after{content:'';position:absolute;bottom:-60px;left:-20px;width:200px;height:200px;border-radius:50%;background:rgba(22,163,74,.06)}

/* Payment option */
.pay-opt{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1.5px solid var(--border);border-radius:var(--r2);cursor:pointer;transition:all .2s;margin-bottom:10px}
.pay-opt:hover{border-color:var(--g);background:var(--g5)}
.pay-opt.sel{border-color:var(--g);background:var(--g5)}

/* Subscription plan card */
.plan-card{border-radius:var(--r3);padding:28px;border:2px solid var(--border);background:#fff;transition:all .3s;cursor:pointer;position:relative;overflow:hidden}
.plan-card:hover{transform:translateY(-4px);box-shadow:var(--sh2)}
.plan-card.popular{border-color:var(--g);box-shadow:0 0 0 3px rgba(22,163,74,.12)}
.plan-badge{position:absolute;top:0;right:24px;background:var(--g);color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:0 0 10px 10px;letter-spacing:.3px}
.plan-elite{background:linear-gradient(135deg,var(--dark),var(--dark3));color:#fff;border-color:var(--dark)}
.plan-price{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;margin:12px 0 4px}
.plan-feat{display:flex;align-items:center;gap:8px;font-size:13px;padding:5px 0;color:var(--text2)}
.plan-feat .tick{color:var(--g);font-size:15px;font-weight:700}

/* Referral card */
.ref-card{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid var(--g4);border-radius:var(--r3);padding:28px;position:relative;overflow:hidden}
.ref-code{background:#fff;border:2px dashed var(--g4);border-radius:var(--r2);padding:14px 20px;font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--g2);letter-spacing:3px;text-align:center;cursor:pointer;transition:all .2s}
.ref-code:hover{background:var(--g3)}

/* Map placeholder */
.map-ph{height:260px;background:linear-gradient(135deg,#e8f5ed,#d1eadb);border-radius:var(--r2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;position:relative;overflow:hidden}
.map-ph::after{content:'📍 Google Maps — Real integration in production';position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.55);color:#fff;font-size:11px;padding:5px 14px;border-radius:99px;white-space:nowrap}

/* Upload zone */
.upload-zone{border:2px dashed var(--border2);border-radius:var(--r2);padding:36px;text-align:center;cursor:pointer;transition:all .2s}
.upload-zone:hover{border-color:var(--g);background:var(--g5)}

/* Number input */
.num-wrap{display:flex;align-items:center;border:1.5px solid var(--border2);border-radius:var(--r);overflow:hidden}
.num-wrap input{flex:1;padding:10px 8px;text-align:center;font-size:15px;font-weight:600}
.num-btn{padding:0 16px;height:44px;background:var(--off);font-size:20px;color:var(--text2);transition:background .2s;font-family:inherit}
.num-btn:hover{background:var(--border)}

/* Progress */
.prog-bar{height:8px;background:var(--border);border-radius:99px;overflow:hidden}
.prog-fill{height:100%;background:var(--g);border-radius:99px;transition:width .6s ease}

/* Toggle */
.toggle-wrap{position:relative;width:46px;height:26px;cursor:pointer}
.toggle-wrap input{opacity:0;width:0;height:0;position:absolute}
.toggle-track{position:absolute;inset:0;background:var(--border2);border-radius:99px;transition:.3s}
.toggle-track::before{content:'';position:absolute;height:20px;width:20px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.3s;box-shadow:0 1px 4px rgba(0,0,0,.2)}
input:checked+.toggle-track{background:var(--g)}
input:checked+.toggle-track::before{transform:translateX(20px)}

/* Range */
input[type=range]{-webkit-appearance:none;width:100%;height:5px;border-radius:99px;background:var(--border2);outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--g);cursor:pointer;box-shadow:0 2px 6px rgba(22,163,74,.3)}

/* Form row */
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:580px){.form-row{grid-template-columns:1fr}}

/* Bar chart */
.barchart{display:flex;align-items:flex-end;gap:10px;height:130px;padding:0 4px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;position:relative}
.bar-fill{width:100%;border-radius:6px 6px 0 0;transition:height .6s ease;position:relative;min-height:4px}
.bar-fill::before{content:attr(data-v);position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;color:var(--text3);white-space:nowrap}
.bar-lbl{font-size:10px;color:var(--text3);font-weight:600}

/* Pagination */
.pag{display:flex;align-items:center;gap:6px;justify-content:center;flex-wrap:wrap}
.pag-btn{width:36px;height:36px;border-radius:9px;font-size:14px;font-weight:600;background:#fff;border:1.5px solid var(--border2);color:var(--text2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}
.pag-btn.active{background:var(--g);color:#fff;border-color:var(--g)}
.pag-btn:hover:not(.active){border-color:var(--g);color:var(--g)}

/* Notif indicator */
.notif-dot{width:8px;height:8px;border-radius:50%;background:var(--red);position:absolute;top:1px;right:1px}

/* Mobile bottom nav */
.mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--border);padding:8px 0 12px;z-index:300;justify-content:space-around}
@media(max-width:768px){.mobile-nav{display:flex}.header-nav{display:none}.header-actions .hn-extra{display:none}}
.mn-item{display:flex;flex-direction:column;align-items:center;gap:3px;padding:4px 12px;cursor:pointer;font-size:11px;font-weight:600;color:var(--text3);transition:color .2s;position:relative}
.mn-item.active{color:var(--g)}
.mn-item .mn-icon{font-size:22px}

/* FAB */
.fab{position:fixed;bottom:80px;right:20px;width:54px;height:54px;border-radius:50%;background:var(--g);color:#fff;font-size:22px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(22,163,74,.4);z-index:250;transition:all .2s;border:none}
.fab:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(22,163,74,.5)}
@media(min-width:769px){.fab{display:none}}

/* Empty state */
.empty{text-align:center;padding:60px 20px}
.empty-ico{font-size:56px;margin-bottom:16px;animation:bounce 2s infinite}
.empty h3{font-size:18px;margin-bottom:8px}
.empty p{color:var(--text3);font-size:14px}

/* Step progress */
.steps{display:flex;gap:8px;margin-bottom:24px}
.step-fill{flex:1;height:4px;border-radius:99px;background:var(--border);transition:background .35s}
.step-fill.done{background:var(--g)}

/* Tabs */
.tabs-row{display:flex;gap:4px;background:var(--off2);padding:4px;border-radius:var(--r);margin-bottom:20px}
.tab-btn{flex:1;padding:8px 12px;border-radius:9px;font-size:13px;font-weight:600;color:var(--text3);background:transparent;transition:all .2s;text-align:center;cursor:pointer;border:none;font-family:inherit;white-space:nowrap}
.tab-btn.active{background:#fff;color:var(--text);box-shadow:var(--sh)}

/* Notification panel */
.notif-item{display:flex;gap:12px;padding:14px;border-bottom:1px solid var(--border);transition:background .2s;cursor:pointer}
.notif-item:hover{background:var(--g5)}
.notif-item.unread{background:var(--g5)}
.notif-dot2{width:8px;height:8px;border-radius:50%;background:var(--g);flex-shrink:0;margin-top:6px}

/* Footer */
.footer{background:var(--dark);color:rgba(255,255,255,.55);padding:56px 24px 32px}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;max-width:1240px;margin:0 auto 40px}
@media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr}}
@media(max-width:580px){.footer-grid{grid-template-columns:1fr}}
.footer-link{font-size:13px;margin-bottom:8px;cursor:pointer;transition:color .2s}
.footer-link:hover{color:#fff}
.footer-bottom{max-width:1240px;margin:0 auto;border-top:1px solid rgba(255,255,255,.08);padding-top:20px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px}

/* Alert banner */
.alert{padding:12px 18px;border-radius:var(--r2);font-size:13px;font-weight:500;display:flex;align-items:center;gap:10px}
.alert-warn{background:#fef3c7;color:#92400e;border:1px solid #fde68a}
.alert-green{background:var(--g3);color:var(--g2);border:1px solid var(--g4)}
.alert-red{background:#fee2e2;color:#b91c1c;border:1px solid #fecaca}

/* Responsive hide */
@media(max-width:768px){.hide-mobile{display:none!important}}
@media(min-width:769px){.hide-desktop{display:none!important}}

/* Dark mode */
body.dark{
  --off:#0d1710;--off2:#111f18;--white:#1a2e22;
  --text:#e2efe8;--text2:#a8c5b5;--text3:#5a7a69;
  --border:#1e3328;--border2:#234530;
}
body.dark .card,body.dark .pcard,body.dark .sidebar,body.dark .header,
body.dark .stat-card,body.dark .modal,body.dark .plan-card{background:#141f1a!important}
body.dark .inp{background:#141f1a!important;color:var(--text)!important}
body.dark .tabs-row{background:#0d1710}
body.dark .tab-btn.active{background:#141f1a}
body.dark .ref-card{background:linear-gradient(135deg,#0d1f12,#111f18)}
body.dark .agent-box{background:#0d1710}
body.dark .feat-pill{background:#141f1a}
body.dark .num-btn{background:#0d1710}
body.dark .hero-chip{background:rgba(255,255,255,.06)}
`;

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function App() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;

  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");
  const [favs, setFavs] = useState([1, 3, 6]);
  const [selProp, setSelProp] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showPay, setShowPay] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [revealed, setRevealed] = useState([]);
  const [wallet, setWallet] = useState({ free: 3, paid: 5, plan: "starter" });
  const [agentDashTab, setAgentDashTab] = useState("overview");
  const [adminTab, setAdminTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterState, setFilterState] = useState("All");
  const [filterBeds, setFilterBeds] = useState("All");
  const [filterCat, setFilterCat] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [showFilters, setShowFilters] = useState(false);
  const [myListings, setMyListings] = useState(PROPERTIES.slice(0, 4));
  const [notifCount, setNotifCount] = useState(3);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const toggleFav = (id) => {
    const has = favs.includes(id);
    setFavs(f => has ? f.filter(x => x !== id) : [...f, id]);
    toast(has ? "Removed from saved" : "💚 Saved to favorites!");
  };

  const viewProp = (p) => { setSelProp(p); setPage("detail"); window.scrollTo(0, 0); };

  const handleContact = (prop, method) => {
    if (!user) { setShowAuth(true); return; }
    if (revealed.includes(prop.id)) {
      toast(method === "call" ? `📞 Calling ${prop.agent.phone}` : `💬 Opening WhatsApp...`, "info");
      return;
    }
    const total = wallet.free + wallet.paid;
    if (total <= 0) { setShowPay(true); return; }
    setRevealed(r => [...r, prop.id]);
    if (wallet.free > 0) setWallet(w => ({ ...w, free: w.free - 1 }));
    else setWallet(w => ({ ...w, paid: w.paid - 1 }));
    toast(method === "call" ? `📞 ${prop.agent.phone}` : `💬 wa.me/${prop.agent.phone.replace(/\D/g,"")}`, "success");
  };

  const filtered = PROPERTIES.filter(p => {
    const q = search.toLowerCase();
    const mQ = !q || p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.state.toLowerCase().includes(q) || p.addr.toLowerCase().includes(q);
    const mT = filterType === "All" || p.type === filterType;
    const mS = filterState === "All" || p.state.toLowerCase().includes(filterState.toLowerCase());
    const mB = filterBeds === "All" || p.beds >= parseInt(filterBeds);
    const mC = filterCat === "All" || p.cat === filterCat;
    const mP = p.price <= maxPrice;
    return mQ && mT && mS && mB && mC && mP;
  });

  const navTo = (p) => { setPage(p); window.scrollTo(0, 0); };

  const PageContent = () => {
    switch (page) {
      case "home": return <HomePage filtered={filtered} favs={favs} toggleFav={toggleFav} viewProp={viewProp} search={search} setSearch={setSearch} filterType={filterType} setFilterType={setFilterType} navTo={navTo} user={user} setShowAuth={setShowAuth} />;
      case "search": return <SearchPage filtered={filtered} favs={favs} toggleFav={toggleFav} viewProp={viewProp} search={search} setSearch={setSearch} filterType={filterType} setFilterType={setFilterType} filterState={filterState} setFilterState={setFilterState} filterBeds={filterBeds} setFilterBeds={setFilterBeds} filterCat={filterCat} setFilterCat={setFilterCat} maxPrice={maxPrice} setMaxPrice={setMaxPrice} showFilters={showFilters} setShowFilters={setShowFilters} />;
      case "detail": return selProp ? <DetailPage prop={selProp} favs={favs} toggleFav={toggleFav} revealed={revealed} onContact={handleContact} onBack={() => navTo("search")} viewProp={viewProp} user={user} setShowAuth={setShowAuth} /> : null;
      case "saved": return <SavedPage favs={favs} toggleFav={toggleFav} viewProp={viewProp} />;
      case "agent": return <AgentDash wallet={wallet} setWallet={setWallet} myListings={myListings} setMyListings={setMyListings} tab={agentDashTab} setTab={setAgentDashTab} setShowPay={setShowPay} setShowUpload={setShowUpload} setShowPlans={setShowPlans} />;
      case "admin": return <AdminDash tab={adminTab} setTab={setAdminTab} />;
      default: return <HomePage filtered={filtered} favs={favs} toggleFav={toggleFav} viewProp={viewProp} search={search} setSearch={setSearch} filterType={filterType} setFilterType={setFilterType} navTo={navTo} user={user} setShowAuth={setShowAuth} />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        {/* HEADER */}
        <header className="header">
          <div className="header-inner">
            <div className="logo" onClick={() => navTo("home")}>
              <div className="logo-mark">🏠</div>
              <div className="logo-text">UP<span>NEST</span></div>
            </div>
            <nav className="header-nav">
              {[["home","🏠","Home"],["search","🔍","Search"],["saved","❤️","Saved"]].map(([pg, ic, lb]) => (
                <button key={pg} className={`hn-btn ${page === pg ? "active" : ""}`} onClick={() => navTo(pg)}>
                  {ic} {lb}{pg === "saved" && favs.length > 0 && <span style={{background:"var(--g)",color:"#fff",borderRadius:"99px",fontSize:11,padding:"1px 7px",fontWeight:700}}>{favs.length}</span>}
                </button>
              ))}
            </nav>
            <div className="header-actions">
              <button className="btn btn-ghost btn-sm btn-icon hn-extra" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
                {darkMode ? "☀️" : "🌙"}
              </button>
              {user && (
                <div style={{position:"relative"}}>
                  <button className="btn btn-ghost btn-sm btn-icon hn-extra" onClick={() => { setShowNotifs(!showNotifs); setNotifCount(0); }}>
                    🔔
                    {notifCount > 0 && <span className="notif-dot" />}
                  </button>
                  {showNotifs && <NotifPanel onClose={() => setShowNotifs(false)} />}
                </div>
              )}
              {user ? (
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {(role === "agent" || role === "admin") && (
                    <button className="btn btn-outline btn-sm" onClick={() => navTo(role === "admin" ? "admin" : "agent")}>
                      {role === "admin" ? "⚡ Admin" : "👔 Dashboard"}
                    </button>
                  )}
                  <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"6px 10px",borderRadius:"var(--r)",background:"var(--off2)",border:"1.5px solid var(--border)"}}
                    onClick={() => { setUser(null); setRole("guest"); toast("👋 Logged out", "info"); navTo("home"); }}>
                    <div className="avatar" style={{width:30,height:30,fontSize:13}}>{user.name?.[0]?.toUpperCase()}</div>
                    <span style={{fontSize:13,fontWeight:600,maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</span>
                    <span style={{fontSize:11,color:"var(--text3)"}}>↩</span>
                  </div>
                </div>
              ) : (
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setAuthMode("login"); setShowAuth(true); }}>Log in</button>
                  <button className="btn btn-primary btn-sm" onClick={() => { setAuthMode("register"); setShowAuth(true); }}>Sign up free</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE */}
        <main className="main-content">
          <PageContent />
        </main>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-grid">
            <div>
              <div className="logo" style={{marginBottom:14}}>
                <div className="logo-mark">🏠</div>
                <div className="logo-text" style={{color:"#fff"}}>UP<span>NEST</span></div>
              </div>
              <p style={{fontSize:13,lineHeight:1.8,maxWidth:260}}>Nigeria's most trusted property marketplace. Find homes, connect with agents, and close deals faster.</p>
              <div style={{display:"flex",gap:10,marginTop:16}}>
                {["𝕏","in","f","📸"].map((s,i) => <div key={i} style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13,transition:"background .2s"}}>{s}</div>)}
              </div>
            </div>
            {[["For Users",["Browse Listings","Shortlets","Buy Property","Saved Homes","Create Account"]],["For Agents",["List Property","Agent Dashboard","Lead Credits","Subscription Plans","Referral Program"]],["Company",["About UPNEST","Blog","Careers","Contact Us","Privacy Policy"]]].map(([title, links]) => (
              <div key={title}>
                <div style={{color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,marginBottom:16}}>{title}</div>
                {links.map(l => <div key={l} className="footer-link">{l}</div>)}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© 2025 UPNEST Technologies Ltd. All rights reserved.</span>
            <span>🇳🇬 Proudly built for Nigeria</span>
          </div>
        </footer>

        {/* Mobile nav */}
        <nav className="mobile-nav">
          {[["home","🏠","Home"],["search","🔍","Search"],["saved","❤️","Saved"],["agent","👔","Agent"]].map(([pg,ic,lb]) => (
            <div key={pg} className={`mn-item ${page === pg ? "active" : ""}`} onClick={() => navTo(pg)}>
              <span className="mn-icon">{ic}</span>{lb}
            </div>
          ))}
        </nav>

        {/* Mobile FAB */}
        {user && role === "agent" && <button className="fab" onClick={() => setShowUpload(true)}>➕</button>}
      </div>

      {/* MODALS */}
      {showAuth && <AuthModal mode={authMode} setMode={setAuthMode} onClose={() => setShowAuth(false)} onAuth={(u, r) => { setUser(u); setRole(r); setShowAuth(false); toast(`🎉 Welcome, ${u.name}!`); if(r==="agent") navTo("agent"); if(r==="admin") navTo("admin"); }} />}
      {showPay && <PayModal onClose={() => setShowPay(false)} onPaid={(amt) => { const c = amt/100; setWallet(w => ({...w, paid: w.paid + c})); setShowPay(false); toast(`✅ ₦${amt.toLocaleString()} paid — ${c} credit(s) added!`); }} />}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSubmit={(d) => { setMyListings(l => [{...d,id:Date.now(),verified:false,imgs:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80"],views:0,leads:0,agent:{name:user?.name||"Agent",phone:"+2348000000000",rating:5,count:1,id:"new"}},...l]); setShowUpload(false); toast("🏠 Listing submitted for review!"); }} />}
      {showPlans && <PlansModal onClose={() => setShowPlans(false)} currentPlan={wallet.plan} onSelect={(plan) => { setWallet(w => ({...w, plan})); setShowPlans(false); toast(`✅ Upgraded to ${plan.charAt(0).toUpperCase()+plan.slice(1)} plan!`); }} />}

      {/* TOASTS */}
      <div className="toast-wrap">
        {toasts.map(t => <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>)}
      </div>
    </>
  );
}

// ─── PROPERTY CARD ────────────────────────────────────────────────────────────
function PropCard({ prop, favs, toggleFav, viewProp, delay = "" }) {
  const isFav = favs.includes(prop.id);
  return (
    <div className={`pcard anim-up ${delay}`} onClick={() => viewProp(prop)}>
      <div className="pcard-img">
        <img src={prop.imgs[0]} alt={prop.title} loading="lazy" />
        <span className="pcard-badge">{prop.type}</span>
        {prop.verified && <span className="pcard-verified">✔ Verified</span>}
        {prop.featured && <span className="pcard-featured">⭐ Featured</span>}
        <button className={`fav-btn ${isFav?"active":""}`} onClick={e=>{e.stopPropagation();toggleFav(prop.id)}}>
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="pcard-body">
        <div className="pcard-price">{prop.priceLabel}</div>
        <div className="pcard-title">{prop.title}</div>
        <div className="pcard-loc">📍 {prop.city}, {prop.state}</div>
        <div className="pcard-meta">
          {prop.beds > 0 && <div className="pcard-meta-i">🛏 {prop.beds}</div>}
          <div className="pcard-meta-i">🚿 {prop.baths}</div>
          <div className="pcard-meta-i">📐 {prop.sqm}m²</div>
          <div className="pcard-meta-i">👁 {prop.views}</div>
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ filtered, favs, toggleFav, viewProp, search, setSearch, filterType, setFilterType, navTo, user, setShowAuth }) {
  const featured = PROPERTIES.filter(p => p.featured);
  const latest = PROPERTIES.slice(0, 6);
  const shortlets = PROPERTIES.filter(p => p.type === "Shortlet");

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="anim-up">
            <h1>Find Your <em>Dream Home</em><br/>Across Nigeria</h1>
          </div>
          <p className="hero-sub anim-up d1">Thousands of verified listings — rent, buy, or shortlet anywhere in Nigeria</p>
          <div className="search-bar anim-up d2">
            <span style={{fontSize:20}}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search city, state, area e.g. Lekki, Lagos..."
              onKeyDown={e => e.key==="Enter" && navTo("search")} />
            <button className="btn btn-primary btn-lg" onClick={() => navTo("search")}>Search</button>
          </div>
          <div className="hero-chips anim-up d3">
            {["All","Rent","Buy","Shortlet"].map(t => (
              <div key={t} className={`hero-chip ${filterType===t?"active":""}`} onClick={() => { setFilterType(t); navTo("search"); }}>
                {t==="Rent"?"🔑 Rent":t==="Buy"?"🏡 Buy":t==="Shortlet"?"🏨 Shortlet":"🏘 All"}
              </div>
            ))}
          </div>
          <div className="hero-stats anim-up d4">
            {[["8,400+","Listings"],["3,200+","Happy Tenants"],["950+","Verified Agents"],["36","States"]].map(([v,l]) => (
              <div key={l} className="hero-stat"><div className="hero-stat-val">{v}</div><div className="hero-stat-lbl">{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="container" style={{marginTop:40}}>
        <div className="sec-hdr"><h2 className="sec-title anim-up">Browse by Category</h2></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:12,marginBottom:44}}>
          {[["🔑","Rent","Rent"],["🏡","Buy","Buy"],["🏨","Shortlet","Shortlet"],["🏢","Apartments","Apartment"],["🏘","Duplex","Duplex"],["🚪","Self-Contain","Self-Contain"],["🛋","Studio","Studio"],["🏗","Commercial","Commercial"]].map(([ico,lb],i) => (
            <div key={lb} className={`anim-up d${Math.min(i+1,6)}`} style={{background:"#fff",borderRadius:"var(--r2)",padding:"18px 10px",textAlign:"center",cursor:"pointer",border:"1.5px solid var(--border)",boxShadow:"var(--sh)",transition:"all .22s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--g)";e.currentTarget.style.transform="translateY(-3px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform=""}}
              onClick={() => { setFilterType(lb.includes("Rent")||lb.includes("Buy")||lb.includes("Shortlet")?lb:"All"); navTo("search"); }}>
              <div style={{fontSize:28,marginBottom:8}}>{ico}</div>
              <div style={{fontSize:13,fontWeight:700}}>{lb}</div>
            </div>
          ))}
        </div>

        {/* FEATURED */}
        <div className="sec-hdr"><h2 className="sec-title">⭐ Featured Listings</h2><button className="btn btn-ghost btn-sm" onClick={() => navTo("search")}>View all →</button></div>
        <div className="g3" style={{marginBottom:48}}>
          {featured.slice(0,3).map((p,i) => <PropCard key={p.id} prop={p} favs={favs} toggleFav={toggleFav} viewProp={viewProp} delay={`d${i+1}`} />)}
        </div>

        {/* TRENDING LOCATIONS */}
        <div className="sec-hdr"><h2 className="sec-title">📍 Trending Locations</h2></div>
        <div className="scroll-x" style={{marginBottom:48}}>
          {LOCS.map((l,i) => (
            <div key={l.name} className={`loc-tile anim-up d${Math.min(i+1,6)}`} onClick={() => navTo("search")}>
              <img src={l.img} alt={l.name} loading="lazy" />
              <div className="loc-overlay">
                <div className="loc-name">{l.name}</div>
                <div className="loc-count">{l.count} listings · {l.state}</div>
              </div>
            </div>
          ))}
        </div>

        {/* LATEST */}
        <div className="sec-hdr"><h2 className="sec-title">🆕 Latest Listings</h2><button className="btn btn-ghost btn-sm" onClick={() => navTo("search")}>View all →</button></div>
        <div className="g3" style={{marginBottom:48}}>
          {latest.map((p,i) => <PropCard key={p.id} prop={p} favs={favs} toggleFav={toggleFav} viewProp={viewProp} delay={`d${i+1}`} />)}
        </div>

        {/* SHORTLETS */}
        {shortlets.length > 0 && <>
          <div className="sec-hdr"><h2 className="sec-title">🏨 Shortlet Apartments</h2><button className="btn btn-ghost btn-sm" onClick={() => navTo("search")}>View all →</button></div>
          <div className="g3" style={{marginBottom:48}}>
            {shortlets.map((p,i) => <PropCard key={p.id} prop={p} favs={favs} toggleFav={toggleFav} viewProp={viewProp} delay={`d${i+1}`} />)}
          </div>
        </>}

        {/* AGENT CTA */}
        {!user && (
          <div style={{background:"linear-gradient(140deg,var(--dark),var(--dark3),#0f3d20)",borderRadius:"var(--r3)",padding:"52px 44px",marginBottom:48,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:28,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-50,right:-50,width:240,height:240,borderRadius:"50%",background:"rgba(22,163,74,.1)"}}/>
            <div style={{position:"absolute",bottom:-80,left:60,width:200,height:200,borderRadius:"50%",background:"rgba(22,163,74,.06)"}}/>
            <div style={{position:"relative",zIndex:1,maxWidth:500}}>
              <span className="badge badge-green" style={{marginBottom:16}}>🇳🇬 For Real Estate Agents</span>
              <h2 style={{fontFamily:"'Syne'",fontSize:"clamp(22px,4vw,38px)",fontWeight:800,color:"#fff",marginBottom:14,lineHeight:1.1}}>List Your Properties.<br/>Get Real Customers.</h2>
              <p style={{color:"rgba(255,255,255,.6)",fontSize:15,marginBottom:24,lineHeight:1.7}}>Join 950+ agents already using UPNEST. Get your first 5 customer leads FREE. No credit card required.</p>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <button className="btn btn-primary btn-xl">🚀 Start Listing — Free</button>
                <button className="btn btn-xl" style={{background:"rgba(255,255,255,.1)",color:"#fff",border:"1.5px solid rgba(255,255,255,.2)"}}>View Pricing →</button>
              </div>
              <div style={{display:"flex",gap:20,marginTop:20,flexWrap:"wrap"}}>
                {["✅ 5 free leads","✅ No setup fee","✅ Cancel anytime"].map(t => <span key={t} style={{fontSize:13,color:"rgba(255,255,255,.6)",fontWeight:500}}>{t}</span>)}
              </div>
            </div>
            <div style={{fontSize:88,position:"relative",zIndex:1,animation:"bounce 3s infinite"}}>🏡</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SEARCH PAGE ──────────────────────────────────────────────────────────────
function SearchPage({ filtered, favs, toggleFav, viewProp, search, setSearch, filterType, setFilterType, filterState, setFilterState, filterBeds, setFilterBeds, filterCat, setFilterCat, maxPrice, setMaxPrice, showFilters, setShowFilters }) {
  return (
    <div className="container" style={{padding:"32px 20px"}}>
      {/* Search bar */}
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:200,display:"flex",alignItems:"center",background:"#fff",border:"1.5px solid var(--border2)",borderRadius:"var(--r)",padding:"0 16px",gap:10,boxShadow:"var(--sh)"}}>
          <span style={{fontSize:18}}>🔍</span>
          <input style={{flex:1,padding:"12px 0",fontSize:14,color:"var(--text)"}} placeholder="Location, area, property type..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text3)"}} onClick={() => setSearch("")}>✕</button>}
        </div>
        <button className={`btn ${showFilters?"btn-primary":"btn-ghost"}`} onClick={() => setShowFilters(!showFilters)}>🎛 Filters {showFilters ? "▲" : "▼"}</button>
      </div>

      {/* Type chips */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        {["All","Rent","Buy","Shortlet"].map(t => <div key={t} className={`chip ${filterType===t?"active":""}`} onClick={() => setFilterType(t)}>{t==="All"?"🏘 All":t==="Rent"?"🔑 Rent":t==="Buy"?"🏡 Buy":"🏨 Shortlet"}</div>)}
        <div style={{width:1,background:"var(--border)",margin:"0 4px"}} />
        {["All","1+","2+","3+","4+"].map(b => <div key={b} className={`chip ${filterBeds===b?"active":""}`} onClick={() => setFilterBeds(b)}>🛏 {b==="All"?"Any":b}</div>)}
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="card card-p anim-scale" style={{marginBottom:18}}>
          <div className="form-row" style={{marginBottom:14}}>
            <div className="inp-wrap">
              <label className="inp-label">State</label>
              <select className="inp" value={filterState} onChange={e => setFilterState(e.target.value)}>
                <option value="All">All States</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="inp-wrap">
              <label className="inp-label">Category</label>
              <select className="inp" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="All">All Categories</option>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="inp-wrap" style={{marginBottom:14}}>
            <label className="inp-label">Max Price: ₦{maxPrice.toLocaleString()}</label>
            <input type="range" min={0} max={100000000} step={500000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} />
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-primary btn-sm">Apply</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setFilterType("All"); setFilterState("All"); setFilterBeds("All"); setFilterCat("All"); setMaxPrice(100000000); setShowFilters(false); }}>Reset All</button>
          </div>
        </div>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <p style={{color:"var(--text3)",fontSize:14}}><strong style={{color:"var(--text)"}}>{filtered.length}</strong> properties found {search && `for "${search}"`}</p>
        <select className="inp" style={{width:"auto",padding:"8px 14px",fontSize:13}}>
          <option>Newest First</option>
          <option>Price: Low → High</option>
          <option>Price: High → Low</option>
          <option>Most Popular</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty"><div className="empty-ico">🏚</div><h3>No properties found</h3><p>Try adjusting filters or search differently</p></div>
      ) : (
        <>
          <div className="g3">{filtered.map((p,i) => <PropCard key={p.id} prop={p} favs={favs} toggleFav={toggleFav} viewProp={viewProp} delay={`d${Math.min(i%6+1,6)}`} />)}</div>
          <div className="pag" style={{marginTop:36}}>{[1,2,3,4,5].map(n => <div key={n} className={`pag-btn ${n===1?"active":""}`}>{n}</div>)}<div className="pag-btn">→</div></div>
        </>
      )}
    </div>
  );
}

// ─── DETAIL PAGE ──────────────────────────────────────────────────────────────
function DetailPage({ prop, favs, toggleFav, revealed, onContact, onBack, viewProp, user, setShowAuth }) {
  const [imgIdx, setImgIdx] = useState(0);
  const isFav = favs.includes(prop.id);
  const isRev = revealed.includes(prop.id);
  const similar = PROPERTIES.filter(p => p.id !== prop.id && (p.city === prop.city || p.type === prop.type)).slice(0, 3);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="container" style={{padding:"32px 20px"}} >
      <button className="btn btn-ghost btn-sm" style={{marginBottom:20}} onClick={onBack}>← Back to listings</button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:28,alignItems:"start"}}>
        {/* LEFT */}
        <div>
          {/* Carousel */}
          <div className="carousel" style={{borderRadius:"var(--r3)",overflow:"hidden"}}>
            <img src={prop.imgs[imgIdx]} alt={prop.title} style={{animation:"fadeIn .35s ease"}} key={imgIdx} />
            {prop.imgs.length > 1 && <>
              <button className="car-btn car-prev" onClick={() => setImgIdx(i => (i-1+prop.imgs.length)%prop.imgs.length)}>←</button>
              <button className="car-btn car-next" onClick={() => setImgIdx(i => (i+1)%prop.imgs.length)}>→</button>
              <div className="car-dots">{prop.imgs.map((_,i) => <div key={i} className={`car-dot ${i===imgIdx?"active":""}`} onClick={() => setImgIdx(i)} />)}</div>
            </>}
          </div>

          {/* Thumbnails */}
          {prop.imgs.length > 1 && (
            <div style={{display:"flex",gap:8,marginTop:10}}>
              {prop.imgs.map((img,i) => (
                <div key={i} style={{width:72,height:52,borderRadius:10,overflow:"hidden",cursor:"pointer",border:`2px solid ${i===imgIdx?"var(--g)":"transparent"}`,transition:"border .2s"}} onClick={() => setImgIdx(i)}>
                  <img src={img} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                </div>
              ))}
            </div>
          )}

          <div className="card" style={{marginTop:18,padding:"26px"}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
              <div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                  <span className="badge badge-dark">{prop.type}</span>
                  <span className="badge badge-green">{prop.cat}</span>
                  {prop.verified && <span className="badge badge-blue">✔ Verified</span>}
                  {prop.featured && <span className="badge badge-amber">⭐ Featured</span>}
                </div>
                <h1 style={{fontFamily:"'Syne'",fontSize:"clamp(20px,3vw,28px)",fontWeight:800}}>{prop.title}</h1>
                <div style={{color:"var(--text3)",marginTop:6,fontSize:14}}>📍 {prop.addr}, {prop.city}, {prop.state}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Syne'",fontSize:30,fontWeight:800,color:"var(--g2)"}}>{prop.priceLabel}</div>
                <div style={{fontSize:12,color:"var(--text3)"}}>
                  {prop.type==="Shortlet"?"per night":prop.type==="Buy"?"asking price":"per annum"}
                </div>
              </div>
            </div>

            <div className="div" />
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {prop.beds > 0 && <div className="feat-pill">🛏 {prop.beds} Bedroom{prop.beds>1?"s":""}</div>}
              <div className="feat-pill">🚿 {prop.baths} Bathroom{prop.baths>1?"s":""}</div>
              <div className="feat-pill">📐 {prop.sqm}m² area</div>
              <div className="feat-pill">📍 {prop.city}</div>
              <div className="feat-pill">👁 {prop.views} views</div>
            </div>

            <div className="div" />
            <h3 style={{fontFamily:"'Syne'",fontWeight:700,marginBottom:12}}>About this property</h3>
            <p style={{color:"var(--text2)",lineHeight:1.85,fontSize:15}}>{prop.desc}</p>

            <div className="div" />
            <h3 style={{fontFamily:"'Syne'",fontWeight:700,marginBottom:12}}>Features & Amenities</h3>
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {prop.feats.map(f => <div key={f} className="feat-pill">✔ {f}</div>)}
            </div>

            <div className="div" />
            <h3 style={{fontFamily:"'Syne'",fontWeight:700,marginBottom:12}}>Location</h3>
            <div className="map-ph"><span style={{fontSize:44}}>🗺</span></div>

            {similar.length > 0 && <>
              <div className="div" />
              <h3 style={{fontFamily:"'Syne'",fontWeight:700,marginBottom:14}}>Similar Properties</h3>
              <div className="g3" style={{gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))"}}>
                {similar.map(p => <PropCard key={p.id} prop={p} favs={favs} toggleFav={toggleFav} viewProp={viewProp} />)}
              </div>
            </>}
          </div>
        </div>

        {/* RIGHT STICKY */}
        <div style={{position:"sticky",top:80,display:"flex",flexDirection:"column",gap:14}}>
          <div className="card card-p-lg">
            <div style={{fontFamily:"'Syne'",fontSize:28,fontWeight:800,color:"var(--g2)"}}>{prop.priceLabel}</div>
            <div style={{fontSize:13,color:"var(--text3)",marginBottom:18}}>{prop.type==="Shortlet"?"per night":prop.type==="Buy"?"asking price":"per annum"}</div>

            {user ? <>
              <button className="btn btn-primary btn-w" style={{marginBottom:10,fontSize:15}} onClick={() => onContact(prop, "call")}>
                📞 {isRev ? `Call: ${prop.agent.phone}` : "Reveal & Call Agent"}
              </button>
              <button className="btn btn-w" style={{background:"#25D366",color:"#fff",fontSize:15,marginBottom:6,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"11px",borderRadius:"var(--r)",fontWeight:600}} onClick={() => onContact(prop, "whatsapp")}>
                💬 {isRev ? `WhatsApp: ${prop.agent.phone}` : "Reveal & WhatsApp"}
              </button>
              {!isRev && <p style={{fontSize:12,color:"var(--text3)",textAlign:"center",marginTop:4}}>Uses 1 lead credit to reveal contact</p>}
            </> : (
              <button className="btn btn-primary btn-w btn-lg" onClick={() => setShowAuth(true)}>Sign in to Contact Agent</button>
            )}

            <div className="div" />
            <div style={{display:"flex",gap:10}}>
              <button className={`btn btn-w ${isFav?"btn-danger":"btn-ghost"}`} onClick={() => toggleFav(prop.id)}>
                {isFav ? "❤️ Saved" : "🤍 Save"}
              </button>
              <button className="btn btn-ghost btn-w" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast("🔗 Link copied!", "info"); }}>📤 Share</button>
            </div>
          </div>

          {/* Agent */}
          <div className="card card-p">
            <h4 style={{fontFamily:"'Syne'",fontWeight:700,marginBottom:14,fontSize:15}}>Listed by Agent</h4>
            <div className="agent-box">
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div className="agent-av">{prop.agent.name[0]}</div>
                <div>
                  <div style={{fontWeight:700}}>{prop.agent.name}</div>
                  <div style={{fontSize:12,color:"var(--text3)"}}>⭐ {prop.agent.rating} · {prop.agent.count} listings</div>
                  {prop.verified && <span className="badge badge-green" style={{marginTop:6}}>✔ Verified Agent</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Report */}
          <div>
            <button className="btn btn-ghost btn-sm btn-w" style={{color:"var(--red)",borderColor:"#fecaca"}} onClick={() => setReportOpen(!reportOpen)}>⚠️ Report this listing</button>
            {reportOpen && (
              <div className="card card-p anim-scale" style={{marginTop:8}}>
                <p style={{fontSize:13,fontWeight:600,marginBottom:10}}>Reason for report:</p>
                {["Fake listing","Wrong price","Already rented/sold","Spam","Other"].map(r => (
                  <div key={r} style={{padding:"8px 12px",fontSize:13,cursor:"pointer",borderRadius:8,transition:"background .2s"}}
                    onMouseEnter={e => e.currentTarget.style.background="var(--off2)"}
                    onMouseLeave={e => e.currentTarget.style.background=""}
                    onClick={() => { toast("✅ Report submitted. Thank you!", "info"); setReportOpen(false); }}>
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SAVED PAGE ───────────────────────────────────────────────────────────────
function SavedPage({ favs, toggleFav, viewProp }) {
  const saved = PROPERTIES.filter(p => favs.includes(p.id));
  return (
    <div className="container" style={{padding:"32px 20px"}}>
      <h2 className="sec-title" style={{marginBottom:24}}>❤️ Saved Properties ({saved.length})</h2>
      {saved.length === 0 ? (
        <div className="empty"><div className="empty-ico">🤍</div><h3>No saved properties</h3><p>Tap the heart on any listing to save it here</p></div>
      ) : (
        <div className="g3">{saved.map(p => <PropCard key={p.id} prop={p} favs={favs} toggleFav={toggleFav} viewProp={viewProp} />)}</div>
      )}
    </div>
  );
}

// ─── AGENT DASHBOARD ──────────────────────────────────────────────────────────
function AgentDash({ wallet, setWallet, myListings, setMyListings, tab, setTab, setShowPay, setShowUpload, setShowPlans }) {
  const totalCredits = wallet.free + wallet.paid;
  const navItems = [["overview","📊","Overview"],["listings","🏠","My Listings"],["leads","🎯","Lead Wallet"],["referral","🤝","Referral"],["plans","💎","Upgrade Plan"],["payments","💸","Payments"],["analytics","📈","Analytics"]];

  return (
    <div className="with-sidebar">
      <div className="sidebar">
        <div className="sidebar-top">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div className="avatar" style={{width:42,height:42,fontSize:17}}>A</div>
            <div>
              <div style={{fontWeight:700,fontSize:14}}>My Dashboard</div>
              <span className={`badge ${wallet.plan==="elite"?"badge-dark":wallet.plan==="pro"?"badge-green":"badge-blue"}`} style={{marginTop:3}}>
                {wallet.plan==="elite"?"⚡ Elite":wallet.plan==="pro"?"🌟 Pro":"🆓 Starter"}
              </span>
            </div>
          </div>
        </div>
        <nav className="sb-nav">
          {navItems.map(([id,ic,lb]) => (
            <div key={id} className={`sbn-item ${tab===id?"active":""}`} onClick={() => setTab(id)}>
              <span className="sbn-icon">{ic}</span>{lb}
            </div>
          ))}
          <div className="div" />
          <div className="sbn-item" style={{background:"var(--g5)",color:"var(--g2)"}} onClick={() => setShowUpload(true)}>
            <span className="sbn-icon">➕</span>Add Listing
          </div>
        </nav>
      </div>

      <div className="content-area">
        {tab === "overview" && (
          <div className="anim-up">
            <div className="sec-hdr"><h2 className="sec-title">Dashboard Overview</h2></div>
            <div className="g4" style={{marginBottom:24}}>
              {[["My Listings",myListings.length,"🏠","↑2 this month"],["Lead Credits",totalCredits,"🎯",`${wallet.free} free · ${wallet.paid} paid`],["Total Views","1,284","👁","↑12% this month"],["Conversion","18%","📈","↑3% this month"]].map(([l,v,ic,t]) => (
                <div key={l} className="stat-card anim-up">
                  <div style={{fontSize:28,marginBottom:8}}>{ic}</div>
                  <div className="stat-val">{v}</div>
                  <div className="stat-lbl">{l}</div>
                  <div className="stat-trend up" style={{marginTop:5}}>{t}</div>
                </div>
              ))}
            </div>
            <div className="g2">
              <div className="wallet">
                <div style={{position:"relative",zIndex:1}}>
                  <p style={{color:"rgba(255,255,255,.55)",fontSize:12,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Lead Credits Wallet</p>
                  <div style={{fontFamily:"'Syne'",fontSize:52,fontWeight:800,lineHeight:1}}>{totalCredits}</div>
                  <p style={{color:"rgba(255,255,255,.6)",fontSize:14,marginTop:6}}>credits remaining · {wallet.free} free · {wallet.paid} paid</p>
                  <div style={{display:"flex",gap:10,marginTop:20,flexWrap:"wrap"}}>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowPay(true)}>💳 Buy Credits</button>
                    <button className="btn btn-sm" style={{background:"rgba(255,255,255,.1)",color:"#fff",border:"1.5px solid rgba(255,255,255,.2)"}} onClick={() => setShowPlans(true)}>💎 Upgrade Plan</button>
                  </div>
                  {totalCredits <= 2 && <div className="alert alert-red" style={{marginTop:14}}>⚠️ Low credits! Buy more to continue receiving leads.</div>}
                </div>
              </div>
              <div className="card card-p">
                <h3 style={{fontFamily:"'Syne'",fontWeight:700,marginBottom:16}}>Recent Activity</h3>
                {[["New lead on Lekki Duplex","2 min ago","🎯"],["Listing approved by admin","1 hr ago","✅"],["Payment of ₦500 confirmed","3 hrs ago","💸"],["Profile viewed 12 times","Today","👁"],["New listing: Studio Apt","Yesterday","🏠"]].map(([text,time,ic]) => (
                  <div key={text} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                    <span style={{fontSize:18}}>{ic}</span>
                    <div><div style={{fontSize:13,fontWeight:500}}>{text}</div><div style={{fontSize:12,color:"var(--text3)"}}>{time}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "listings" && (
          <div className="anim-up">
            <div className="sec-hdr">
              <h2 className="sec-title">My Listings ({myListings.length})</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setShowUpload(true)}>➕ Add New</button>
            </div>
            <div className="card" style={{overflow:"hidden"}}>
              <table className="tbl">
                <thead><tr><th>Property</th><th>Type</th><th>Price</th><th>Status</th><th>Views</th><th>Leads</th><th>Actions</th></tr></thead>
                <tbody>
                  {myListings.map(l => (
                    <tr key={l.id}>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <img src={l.imgs[0]} style={{width:54,height:40,borderRadius:8,objectFit:"cover",flexShrink:0}} />
                          <div>
                            <div style={{fontWeight:600,fontSize:13,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</div>
                            <div style={{fontSize:11,color:"var(--text3)"}}>📍 {l.city}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-dark">{l.cat}</span></td>
                      <td style={{fontWeight:700,color:"var(--g2)",fontSize:13}}>{l.priceLabel}</td>
                      <td><span className={`badge ${l.verified?"badge-green":"badge-amber"}`}>{l.verified?"✅ Live":"⏳ Pending"}</span></td>
                      <td style={{fontWeight:600}}>{l.views}</td>
                      <td style={{fontWeight:600}}>{l.leads}</td>
                      <td>
                        <div style={{display:"flex",gap:6}}>
                          <button className="btn btn-ghost btn-sm">✏️</button>
                          <button className="btn btn-danger btn-sm" onClick={() => { setMyListings(ls => ls.filter(x => x.id !== l.id)); toast("Listing deleted","info"); }}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "leads" && (
          <div className="anim-up">
            <h2 className="sec-title" style={{marginBottom:20}}>🎯 Lead Wallet</h2>
            <div className="g3" style={{marginBottom:24}}>
              {[["Free Credits Left",wallet.free,"🆓"],["Paid Credits Left",wallet.paid,"💳"],["Total Used","23","✅"]].map(([l,v,ic]) => (
                <div key={l} className="stat-card">
                  <div style={{fontSize:26,marginBottom:8}}>{ic}</div>
                  <div className="stat-val">{v}</div>
                  <div className="stat-lbl">{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,marginBottom:24}}>
              <button className="btn btn-primary" onClick={() => setShowPay(true)}>💳 Buy Lead Credits</button>
              <button className="btn btn-outline" onClick={() => setShowPlans(true)}>💎 Upgrade for Unlimited</button>
            </div>
            <div className="card" style={{overflow:"hidden"}}>
              <table className="tbl">
                <thead><tr><th>Date</th><th>Property</th><th>Action</th><th>Credit Type</th></tr></thead>
                <tbody>
                  {[["May 10","Modern 3-Bed Duplex","📞 Call","Free"],["May 9","Shortlet – Lekki","💬 WhatsApp","Free"],["May 7","4-Bed Apartment","📞 Call","Paid ₦100"],["May 5","Studio Apt","💬 WhatsApp","Paid ₦100"],["May 3","2-Bed Flat","📞 Call","Paid ₦100"]].map(([d,p,a,c],i) => (
                    <tr key={i}><td style={{color:"var(--text3)",fontSize:13}}>{d}</td><td style={{fontWeight:600}}>{p}</td><td>{a}</td><td><span className={`badge ${c==="Free"?"badge-green":"badge-amber"}`}>{c}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "referral" && (
          <div className="anim-up">
            <h2 className="sec-title" style={{marginBottom:6}}>🤝 Referral Program</h2>
            <p style={{color:"var(--text3)",fontSize:14,marginBottom:24}}>Earn ₦2,000 for every agent you refer who signs up and activates a paid plan.</p>
            <div className="ref-card" style={{marginBottom:24}}>
              <h3 style={{fontFamily:"'Syne'",fontWeight:800,marginBottom:4}}>Your Referral Code</h3>
              <p style={{fontSize:13,color:"var(--text3)",marginBottom:16}}>Share this code or link with other agents</p>
              <div className="ref-code" onClick={() => { navigator.clipboard?.writeText("UPNEST-A1234"); toast("📋 Code copied!","info"); }}>UPNEST-A1234</div>
              <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
                <button className="btn btn-primary" onClick={() => toast("🔗 Link copied!","info")}>📤 Copy Referral Link</button>
                <button className="btn btn-ghost" onClick={() => toast("💬 Opening WhatsApp...","info")}>💬 Share via WhatsApp</button>
                <button className="btn btn-ghost" onClick={() => toast("✉️ Opening email...","info")}>✉️ Share via Email</button>
              </div>
            </div>
            <div className="g3" style={{marginBottom:24}}>
              {[["Agents Referred","7","🤝"],["Activated Plans","4","✅"],["Total Earned","₦8,000","💰"]].map(([l,v,ic]) => (
                <div key={l} className="stat-card"><div style={{fontSize:26,marginBottom:8}}>{ic}</div><div className="stat-val">{v}</div><div className="stat-lbl">{l}</div></div>
              ))}
            </div>
            <div className="card" style={{overflow:"hidden"}}>
              <table className="tbl">
                <thead><tr><th>Referred Agent</th><th>Date</th><th>Plan</th><th>Bonus</th><th>Status</th></tr></thead>
                <tbody>
                  {[["Ngozi Adeyemi","May 1","Pro","₦2,000","Paid"],["Ibrahim Sani","Apr 20","Starter","—","Pending"],["Amaka Obi","Apr 10","Elite","₦2,000","Paid"],["Tunde Akin","Mar 28","Pro","₦2,000","Paid"]].map(([n,d,p,b,s],i) => (
                    <tr key={i}><td style={{fontWeight:600}}>{n}</td><td style={{color:"var(--text3)",fontSize:13}}>{d}</td><td><span className={`badge ${p==="Elite"?"badge-dark":p==="Pro"?"badge-green":"badge-blue"}`}>{p}</span></td><td style={{fontWeight:700,color:"var(--g2)"}}>{b}</td><td><span className={`badge ${s==="Paid"?"badge-green":"badge-amber"}`}>{s}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="alert alert-green" style={{marginTop:16}}>💡 <strong>Pro tip:</strong> Agents on the Elite plan earn ₦5,000 per referral instead of ₦2,000!</div>
          </div>
        )}

        {tab === "plans" && (
          <div className="anim-up">
            <h2 className="sec-title" style={{marginBottom:6}}>💎 Subscription Plans</h2>
            <p style={{color:"var(--text3)",fontSize:14,marginBottom:28}}>Upgrade to unlock more leads, listings and features</p>
            <div className="g3">
              {PLANS.map((plan,i) => (
                <div key={plan.id} className={`plan-card ${plan.id==="pro"?"popular":""} ${plan.id==="elite"?"plan-elite":""} anim-up d${i+1}`}>
                  {plan.badge && <div className="plan-badge">{plan.badge}</div>}
                  <div style={{fontSize:28,marginBottom:8}}>{plan.id==="starter"?"🆓":plan.id==="pro"?"🌟":"⚡"}</div>
                  <div style={{fontFamily:"'Syne'",fontWeight:800,fontSize:20,color:plan.id==="elite"?"#fff":"var(--text)"}}>{plan.name}</div>
                  <div className="plan-price" style={{color:plan.id==="elite"?"#fff":plan.id==="pro"?"var(--g2)":"var(--text)"}}>{plan.priceLabel}</div>
                  <div className="div" style={{borderColor:plan.id==="elite"?"rgba(255,255,255,.15)":undefined}} />
                  {plan.features.map(f => (
                    <div key={f} className="plan-feat" style={{color:plan.id==="elite"?"rgba(255,255,255,.8)":"var(--text2)"}}>
                      <span className="tick">✓</span>{f}
                    </div>
                  ))}
                  <button className={`btn btn-w btn-lg`} style={{marginTop:20,background:plan.id==="elite"?"var(--g)":plan.id==="pro"?"var(--g)":"var(--off2)",color:plan.id==="starter"?"var(--text)":"#fff"}}
                    onClick={() => { toast(`✅ Switched to ${plan.name} plan!`); }}>
                    {wallet.plan === plan.id ? "✓ Current Plan" : plan.id==="starter"?"Get Started":"Upgrade Now →"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="anim-up">
            <h2 className="sec-title" style={{marginBottom:20}}>💸 Payment History</h2>
            <div className="card" style={{overflow:"hidden"}}>
              <table className="tbl">
                <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                <tbody>
                  {[["May 8","5 Lead Credits","₦500","Card","Success"],["Apr 25","Pro Plan — Monthly","₦15,000","Bank Transfer","Success"],["Apr 15","10 Lead Credits","₦1,000","USSD","Success"],["Mar 28","5 Lead Credits","₦500","OPay","Success"],["Mar 10","Pro Plan — Monthly","₦15,000","Card","Success"]].map(([d,desc,amt,meth,status],i) => (
                    <tr key={i}>
                      <td style={{color:"var(--text3)",fontSize:13}}>{d}</td>
                      <td style={{fontWeight:600}}>{desc}</td>
                      <td style={{fontWeight:700,color:"var(--g2)"}}>{amt}</td>
                      <td>{meth}</td>
                      <td><span className="badge badge-green">✔ {status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="anim-up">
            <h2 className="sec-title" style={{marginBottom:20}}>📈 Analytics</h2>
            <div className="g4" style={{marginBottom:24}}>
              {[["Total Views","1,284","📊","↑12%"],["Leads Used","23","🎯","↑5%"],["Enquiries","18","💬","↑8%"],["Conversion","18%","📈","↑3%"]].map(([l,v,ic,t]) => (
                <div key={l} className="stat-card"><div style={{fontSize:26,marginBottom:8}}>{ic}</div><div className="stat-val">{v}</div><div className="stat-lbl">{l}</div><div className="stat-trend up" style={{marginTop:5}}>{t} this month</div></div>
              ))}
            </div>
            <div className="g2">
              <div className="card card-p">
                <h3 style={{fontFamily:"'Syne'",fontWeight:700,marginBottom:20}}>Monthly Views</h3>
                <div className="barchart">
                  {[["Jan",120],["Feb",180],["Mar",145],["Apr",210],["May",284]].map(([m,v]) => (
                    <div key={m} className="bar-col">
                      <div className="bar-fill" data-v={v} style={{height:`${(v/284)*100}%`,background:`linear-gradient(to top,var(--g4),var(--g3))`}} />
                      <div className="bar-lbl">{m}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card card-p">
                <h3 style={{fontFamily:"'Syne'",fontWeight:700,marginBottom:20}}>Lead Usage</h3>
                <div className="barchart">
                  {[["Jan",2],["Feb",4],["Mar",3],["Apr",7],["May",7]].map(([m,v]) => (
                    <div key={m} className="bar-col">
                      <div className="bar-fill" data-v={v} style={{height:`${(v/7)*100}%`,background:"linear-gradient(to top,#fde68a,#fef3c7)"}} />
                      <div className="bar-lbl">{m}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDash({ tab, setTab }) {
  const [listings, setListings] = useState(PROPERTIES.map(p => ({...p, approved: p.verified})));
  const navItems = [["overview","📊","Overview"],["listings","🏠","Listings"],["agents","👔","Agents"],["users","👥","Users"],["payments","💸","Payments"],["reports","⚠️","Reports"]];

  return (
    <div className="with-sidebar">
      <div className="sidebar">
        <div className="sidebar-top">
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{background:"linear-gradient(135deg,var(--dark),var(--dark3))",width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚡</div>
            <div><div style={{fontWeight:700,fontSize:14}}>Admin Panel</div><div style={{fontSize:11,color:"var(--text3)"}}>Full access</div></div>
          </div>
        </div>
        <nav className="sb-nav">
          {navItems.map(([id,ic,lb]) => (
            <div key={id} className={`sbn-item ${tab===id?"active":""}`} onClick={() => setTab(id)}>
              <span className="sbn-icon">{ic}</span>{lb}
            </div>
          ))}
        </nav>
      </div>

      <div className="content-area">
        {tab === "overview" && (
          <div className="anim-up">
            <h2 className="sec-title" style={{marginBottom:24}}>Platform Overview</h2>
            <div className="g4" style={{marginBottom:24}}>
              {[["Total Users","12,840","👥","↑8%"],["Agents","950","👔","↑12%"],["Listings","8,420","🏠","↑5%"],["Revenue MTD","₦2.84M","💰","↑22%"]].map(([l,v,ic,t]) => (
                <div key={l} className="stat-card anim-up"><div style={{fontSize:28,marginBottom:8}}>{ic}</div><div className="stat-val">{v}</div><div className="stat-lbl">{l}</div><div className="stat-trend up" style={{marginTop:5}}>{t} this month</div></div>
              ))}
            </div>
            <div className="g2">
              <div className="card card-p">
                <h3 style={{fontFamily:"'Syne'",fontWeight:700,marginBottom:20}}>Monthly Revenue (₦)</h3>
                <div className="barchart">
                  {[["Jan","820K"],["Feb","1.2M"],["Mar","1.6M"],["Apr","2.1M"],["May","2.84M"]].map(([m,v]) => (
                    <div key={m} className="bar-col">
                      <div className="bar-fill" data-v={v} style={{height:`${(parseFloat(v)/2.84)*100}%`,background:"linear-gradient(to top,var(--g4),var(--g3))"}} />
                      <div className="bar-lbl">{m}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card card-p">
                <h3 style={{fontFamily:"'Syne'",fontWeight:700,marginBottom:16}}>Recent Activity</h3>
                {[["New agent signed up","2 min ago","👔"],["5 listings submitted","15 min ago","🏠"],["Payment ₦15,000 received","1 hr ago","💸"],["Listing reported","3 hrs ago","⚠️"],["Admin approved 8 listings","5 hrs ago","✅"]].map(([t,ti,ic]) => (
                  <div key={t} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                    <span style={{fontSize:18}}>{ic}</span>
                    <div><div style={{fontSize:13,fontWeight:500}}>{t}</div><div style={{fontSize:11,color:"var(--text3)"}}>{ti}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="g3" style={{marginTop:24}}>
              {[["Lead Revenue","₦284,000","This month from lead credits","🎯"],["Plan Revenue","₦1,425,000","From agent subscriptions","💎"],["Total Agents","950","Registered agents","👔"]].map(([t,v,sub,ic]) => (
                <div key={t} className="card card-p">
                  <div style={{fontSize:26,marginBottom:8}}>{ic}</div>
                  <div style={{fontFamily:"'Syne'",fontSize:22,fontWeight:800,color:"var(--g2)"}}>{v}</div>
                  <div style={{fontSize:13,fontWeight:600,marginTop:2}}>{t}</div>
                  <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "listings" && (
          <div className="anim-up">
            <div className="sec-hdr">
              <h2 className="sec-title">Manage Listings</h2>
              <div style={{display:"flex",gap:8}}>
                <span className="badge badge-amber">⏳ {listings.filter(l=>!l.approved).length} Pending</span>
                <span className="badge badge-green">✅ {listings.filter(l=>l.approved).length} Live</span>
              </div>
            </div>
            <div className="card" style={{overflow:"hidden"}}>
              <table className="tbl">
                <thead><tr><th>Property</th><th>Agent</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {listings.map(l => (
                    <tr key={l.id}>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <img src={l.imgs[0]} style={{width:50,height:38,borderRadius:8,objectFit:"cover",flexShrink:0}} />
                          <div style={{fontWeight:600,fontSize:13,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</div>
                        </div>
                      </td>
                      <td style={{fontSize:13}}>{l.agent.name}</td>
                      <td><span className="badge badge-dark">{l.type}</span></td>
                      <td style={{fontWeight:700,color:"var(--g2)",fontSize:13}}>{l.priceLabel}</td>
                      <td><span className={`badge ${l.approved?"badge-green":"badge-amber"}`}>{l.approved?"✅ Live":"⏳ Pending"}</span></td>
                      <td>
                        <div style={{display:"flex",gap:6}}>
                          {!l.approved && <button className="btn btn-outline btn-sm" onClick={() => { setListings(ls => ls.map(x => x.id===l.id?{...x,approved:true}:x)); toast("✅ Listing approved!"); }}>Approve</button>}
                          <button className="btn btn-danger btn-sm" onClick={() => { setListings(ls => ls.filter(x => x.id!==l.id)); toast("Listing removed","error"); }}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "agents" && (
          <div className="anim-up">
            <h2 className="sec-title" style={{marginBottom:20}}>Agent Management</h2>
            <div className="card" style={{overflow:"hidden"}}>
              <table className="tbl">
                <thead><tr><th>Agent</th><th>Plan</th><th>Listings</th><th>Credits</th><th>Referrals</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {[["Chidi Okonkwo","Lagos","Pro","24","3","5"],["Ngozi Adeyemi","Lagos","Starter","18","2","2"],["Emeka Eze","Lagos","Elite","41","8","11"],["Amaka Obi","Enugu","Starter","9","3","1"],["Ibrahim Sani","Abuja","Pro","15","2","3"],["Kabiru Musa","Abuja","Elite","28","12","7"]].map(([n,state,plan,listings,credits,refs]) => (
                    <tr key={n}>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div className="avatar" style={{width:32,height:32,fontSize:12}}>{n[0]}</div>
                          <div><div style={{fontWeight:600,fontSize:13}}>{n}</div><div style={{fontSize:11,color:"var(--text3)"}}>{state}</div></div>
                        </div>
                      </td>
                      <td><span className={`badge ${plan==="Elite"?"badge-dark":plan==="Pro"?"badge-green":"badge-blue"}`}>{plan}</span></td>
                      <td>{listings}</td>
                      <td>{credits}</td>
                      <td>{refs}</td>
                      <td><span className="badge badge-green">Active</span></td>
                      <td>
                        <div style={{display:"flex",gap:6}}>
                          <button className="btn btn-outline btn-sm" onClick={() => toast(`Added 5 credits to ${n}`)}>+5 Credits</button>
                          <button className="btn btn-danger btn-sm">Suspend</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="anim-up">
            <h2 className="sec-title" style={{marginBottom:20}}>User Management</h2>
            <div className="card" style={{overflow:"hidden"}}>
              <table className="tbl">
                <thead><tr><th>User</th><th>Joined</th><th>Saved</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {[["Adaeze Nwachukwu","May 1","8","User","Active"],["Bello Musa","Apr 28","3","User","Active"],["Grace Okafor","Apr 20","12","Agent","Active"],["Tunde Akin","Apr 15","0","User","Inactive"],["Fatima Abdullahi","Apr 10","5","User","Active"],["Chukwuemeka Eze","Apr 5","15","Agent","Active"]].map(([n,d,s,r,status]) => (
                    <tr key={n}>
                      <td><div style={{display:"flex",alignItems:"center",gap:10}}><div className="avatar" style={{width:32,height:32,fontSize:12}}>{n[0]}</div><span style={{fontWeight:600,fontSize:13}}>{n}</span></div></td>
                      <td style={{fontSize:13,color:"var(--text3)"}}>{d}</td>
                      <td>{s}</td>
                      <td><span className={`badge ${r==="Agent"?"badge-blue":"badge-dark"}`}>{r}</span></td>
                      <td><span className={`badge ${status==="Active"?"badge-green":"badge-amber"}`}>{status}</span></td>
                      <td><button className="btn btn-danger btn-sm">Suspend</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="anim-up">
            <h2 className="sec-title" style={{marginBottom:20}}>Payment Records</h2>
            <div className="g3" style={{marginBottom:20}}>
              {[["Total Revenue","₦2,845,000","💰"],["This Month","₦523,000","📈"],["Lead Revenue","₦284,000","🎯"]].map(([l,v,ic]) => (
                <div key={l} className="stat-card"><div style={{fontSize:26,marginBottom:6}}>{ic}</div><div className="stat-val" style={{fontSize:22}}>{v}</div><div className="stat-lbl">{l}</div></div>
              ))}
            </div>
            <div className="card" style={{overflow:"hidden"}}>
              <table className="tbl">
                <thead><tr><th>Agent</th><th>Description</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {[["Emeka Eze","Elite Plan","₦35,000","Card","May 8"],["Chidi Okonkwo","10 Credits","₦1,000","USSD","May 5"],["Ibrahim Sani","Pro Plan","₦15,000","Bank Transfer","May 2"],["Ngozi Adeyemi","5 Credits","₦500","Card","Apr 28"],["Kabiru Musa","Elite Plan","₦35,000","OPay","Apr 25"]].map(([a,d,amt,m,dt]) => (
                    <tr key={a+dt}><td style={{fontWeight:600}}>{a}</td><td>{d}</td><td style={{color:"var(--g2)",fontWeight:700}}>{amt}</td><td>{m}</td><td style={{fontSize:13,color:"var(--text3)"}}>{dt}</td><td><span className="badge badge-green">✔ Confirmed</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "reports" && (
          <div className="anim-up">
            <h2 className="sec-title" style={{marginBottom:20}}>⚠️ Reported Listings</h2>
            <div className="card" style={{overflow:"hidden"}}>
              <table className="tbl">
                <thead><tr><th>Property</th><th>Reason</th><th>Reported By</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {[["3-Bed Duplex Lekki","Fake listing","User123","May 9"],["Studio Apt Ikeja","Wrong price","User456","May 7"],["5-Bed Maitama","Already sold","User789","May 5"],["Self-Contain Abuja","Spam","User012","May 2"]].map(([prop,reason,by,date]) => (
                    <tr key={prop}>
                      <td style={{fontWeight:600,fontSize:13}}>{prop}</td>
                      <td><span className="badge badge-red">{reason}</span></td>
                      <td style={{fontSize:13,color:"var(--text3)"}}>{by}</td>
                      <td style={{fontSize:13,color:"var(--text3)"}}>{date}</td>
                      <td>
                        <div style={{display:"flex",gap:6}}>
                          <button className="btn btn-ghost btn-sm" onClick={() => toast("✅ Report dismissed","info")}>Dismiss</button>
                          <button className="btn btn-danger btn-sm" onClick={() => toast("🗑 Listing removed","error")}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({ mode, setMode, onClose, onAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const submit = async () => {
    if (!email || !pass) { toast("Please fill all fields", "error"); return; }
    if (!isLogin && !name) { toast("Please enter your name", "error"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    onAuth({ name: name || email.split("@")[0], email, role }, role);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
            <div className="logo-mark" style={{width:48,height:48,fontSize:22}}>🏠</div>
          </div>
          <h2 style={{fontFamily:"'Syne'",fontWeight:800,fontSize:24}}>{isLogin ? "Welcome back!" : "Join UPNEST"}</h2>
          <p style={{color:"var(--text3)",fontSize:14,marginTop:4}}>{isLogin ? "Sign in to your account" : "Create your free account today"}</p>
        </div>

        <button className="btn btn-ghost btn-w" style={{marginBottom:16,justifyContent:"center",gap:10}}>
          <span style={{fontSize:18}}>🔵</span> Continue with Google
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <div style={{flex:1,height:1,background:"var(--border)"}} />
          <span style={{fontSize:12,color:"var(--text3)",whiteSpace:"nowrap"}}>or with email</span>
          <div style={{flex:1,height:1,background:"var(--border)"}} />
        </div>

        {!isLogin && (
          <div className="inp-wrap" style={{marginBottom:12}}>
            <label className="inp-label">Full Name</label>
            <input className="inp" placeholder="e.g. Adaeze Nwachukwu" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div className="inp-wrap" style={{marginBottom:12}}>
          <label className="inp-label">Email Address</label>
          <input className="inp" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="inp-wrap" style={{marginBottom:12}}>
          <label className="inp-label">Password</label>
          <input className="inp" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key==="Enter" && submit()} />
        </div>

        {!isLogin && (
          <div style={{marginBottom:16}}>
            <label className="inp-label" style={{marginBottom:8,display:"block"}}>I am a...</label>
            <div className="tabs-row">
              {[["user","🏠 Property Seeker"],["agent","👔 Real Estate Agent"],["admin","⚡ Admin"]].map(([r,lb]) => (
                <button key={r} className={`tab-btn ${role===r?"active":""}`} onClick={() => setRole(r)}>{lb}</button>
              ))}
            </div>
          </div>
        )}

        {isLogin && <div style={{textAlign:"right",marginBottom:14}}><span style={{fontSize:13,color:"var(--g2)",cursor:"pointer",fontWeight:600}}>Forgot password?</span></div>}

        <button className="btn btn-primary btn-w btn-lg" onClick={submit} disabled={loading}>
          {loading ? <><div className="spinner" style={{width:18,height:18}} /> Processing...</> : isLogin ? "Sign In →" : "Create Account →"}
        </button>

        <p style={{textAlign:"center",marginTop:16,fontSize:14,color:"var(--text3)"}}>
          {isLogin ? "No account? " : "Already have one? "}
          <span style={{color:"var(--g2)",fontWeight:700,cursor:"pointer"}} onClick={() => setMode(isLogin?"register":"login")}>
            {isLogin ? "Sign up free" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
function PayModal({ onClose, onPaid }) {
  const [method, setMethod] = useState("card");
  const [amount, setAmount] = useState(500);
  const [loading, setLoading] = useState(false);
  const pkgs = [[100,"1 Lead","Quick top-up"],[500,"5 Leads","Popular 🔥"],[1000,"10 Leads","Save 10%"],[2000,"20 Leads","Best value ⭐"]];
  const methods = [["card","💳","Card","Visa · Mastercard · Verve"],["ussd","📱","USSD","*901# · *966# · *737#"],["bank","🏦","Bank Transfer","Direct transfer"],["opay","🟢","OPay","OPay wallet"],["palmpay","🔵","PalmPay","PalmPay wallet"]];

  const pay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2200));
    setLoading(false);
    onPaid(amount);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <div className="modal-title">💳 Buy Lead Credits</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{color:"var(--text3)",fontSize:14,marginBottom:20}}>Unlock customer contacts by purchasing lead credits</p>

        <p style={{fontSize:12,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Choose Package</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:22}}>
          {pkgs.map(([a,leads,label]) => (
            <div key={a} style={{border:`2px solid ${amount===a?"var(--g)":"var(--border)"}`,borderRadius:"var(--r2)",padding:"14px 10px",textAlign:"center",cursor:"pointer",background:amount===a?"var(--g5)":"#fff",transition:"all .2s"}} onClick={() => setAmount(a)}>
              <div style={{fontFamily:"'Syne'",fontWeight:800,fontSize:17,color:amount===a?"var(--g2)":"var(--text)"}}>₦{a.toLocaleString()}</div>
              <div style={{fontSize:12,fontWeight:700,marginTop:2}}>{leads}</div>
              <div style={{fontSize:11,color:"var(--text3)"}}>{label}</div>
            </div>
          ))}
        </div>

        <p style={{fontSize:12,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Payment Method</p>
        {methods.map(([id,ic,lb,sub]) => (
          <div key={id} className={`pay-opt ${method===id?"sel":""}`} onClick={() => setMethod(id)}>
            <span style={{fontSize:22,width:36,textAlign:"center"}}>{ic}</span>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{lb}</div><div style={{fontSize:12,color:"var(--text3)"}}>{sub}</div></div>
            {method===id && <span style={{color:"var(--g)",fontSize:20,fontWeight:700}}>✓</span>}
          </div>
        ))}

        <div className="div" />
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontWeight:800,fontSize:18}}>Total: ₦{amount.toLocaleString()}</div>
            <div style={{fontSize:13,color:"var(--text3)"}}>{amount/100} lead credit{amount>100?"s":""} added to wallet</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary btn-lg" onClick={pay} disabled={loading}>
              {loading ? <><div className="spinner" style={{width:18,height:18}} /> Processing...</> : `Pay ₦${amount.toLocaleString()} →`}
            </button>
          </div>
        </div>
        <p style={{fontSize:11,color:"var(--text3)",textAlign:"center",marginTop:12}}>🔒 Secured by Paystack & Flutterwave. All payments encrypted.</p>
      </div>
    </div>
  );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────
function UploadModal({ onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({title:"",desc:"",price:"",type:"Rent",cat:"Apartment",beds:2,baths:1,sqm:"",addr:"",city:"",state:"Lagos",feats:[]});
  const upd = (k,v) => setForm(f => ({...f,[k]:v}));
  const allFeats = ["Swimming Pool","24/7 Security","Generator","Parking","Air Conditioning","WiFi","Gym","Elevator","Borehole","CCTV","Boys Quarters","Smart Home"];

  const submit = () => {
    if (!form.title || !form.price || !form.addr || !form.city) { toast("Fill all required fields","error"); return; }
    onSubmit({...form, priceLabel:`₦${parseInt(form.price).toLocaleString()}${form.type==="Shortlet"?"/night":form.type==="Buy"?"":"/yr"}`, beds:form.beds, baths:form.baths, sqm:parseInt(form.sqm)||80, verified:false, featured:false, imgs:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80"], views:0, leads:0 });
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal modal-xl" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <div className="modal-title">{step===1?"📋 Basic Info":step===2?"🏠 Property Details":"📸 Photos & Features"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="steps">{[1,2,3].map(s => <div key={s} className={`step-fill ${s<=step?"done":""}`} />)}</div>
        <p style={{fontSize:12,color:"var(--text3)",marginBottom:20}}>Step {step} of 3</p>

        {step === 1 && (
          <div className="anim-up">
            <div className="inp-wrap" style={{marginBottom:14}}>
              <label className="inp-label">Property Title *</label>
              <input className="inp" placeholder="e.g. Modern 3-Bedroom Duplex in Lekki" value={form.title} onChange={e => upd("title",e.target.value)} />
            </div>
            <div className="form-row" style={{marginBottom:14}}>
              <div className="inp-wrap">
                <label className="inp-label">Listing Type *</label>
                <select className="inp" value={form.type} onChange={e => upd("type",e.target.value)}>
                  {["Rent","Buy","Shortlet"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="inp-wrap">
                <label className="inp-label">Category *</label>
                <select className="inp" value={form.cat} onChange={e => upd("cat",e.target.value)}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="inp-wrap" style={{marginBottom:14}}>
              <label className="inp-label">Price (₦) * {form.type==="Shortlet"?"— per night":form.type==="Buy"?"— asking price":"— per year"}</label>
              <input className="inp" type="number" placeholder={form.type==="Shortlet"?"e.g. 35000":"e.g. 1500000"} value={form.price} onChange={e => upd("price",e.target.value)} />
            </div>
            <div className="inp-wrap">
              <label className="inp-label">Description</label>
              <textarea className="inp" rows={4} placeholder="Describe the property, location advantages, and unique features..." value={form.desc} onChange={e => upd("desc",e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="anim-up">
            <div className="form-row" style={{marginBottom:14}}>
              <div className="inp-wrap">
                <label className="inp-label">Bedrooms</label>
                <div className="num-wrap">
                  <button className="num-btn" onClick={() => upd("beds",Math.max(0,form.beds-1))}>−</button>
                  <input type="number" value={form.beds} onChange={e => upd("beds",+e.target.value)} />
                  <button className="num-btn" onClick={() => upd("beds",form.beds+1)}>+</button>
                </div>
              </div>
              <div className="inp-wrap">
                <label className="inp-label">Bathrooms</label>
                <div className="num-wrap">
                  <button className="num-btn" onClick={() => upd("baths",Math.max(1,form.baths-1))}>−</button>
                  <input type="number" value={form.baths} onChange={e => upd("baths",+e.target.value)} />
                  <button className="num-btn" onClick={() => upd("baths",form.baths+1)}>+</button>
                </div>
              </div>
            </div>
            <div className="inp-wrap" style={{marginBottom:14}}>
              <label className="inp-label">Property Size (m²)</label>
              <input className="inp" type="number" placeholder="e.g. 120" value={form.sqm} onChange={e => upd("sqm",e.target.value)} />
            </div>
            <div className="inp-wrap" style={{marginBottom:14}}>
              <label className="inp-label">Street Address *</label>
              <input className="inp" placeholder="e.g. 14 Admiralty Way, Lekki Phase 1" value={form.addr} onChange={e => upd("addr",e.target.value)} />
            </div>
            <div className="form-row">
              <div className="inp-wrap">
                <label className="inp-label">City *</label>
                <input className="inp" placeholder="e.g. Lekki" value={form.city} onChange={e => upd("city",e.target.value)} />
              </div>
              <div className="inp-wrap">
                <label className="inp-label">State *</label>
                <select className="inp" value={form.state} onChange={e => upd("state",e.target.value)}>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="anim-up">
            <div className="upload-zone" style={{marginBottom:20}}>
              <div style={{fontSize:40,marginBottom:10}}>📸</div>
              <h3 style={{fontFamily:"'Syne'",fontWeight:700,marginBottom:6}}>Upload Photos</h3>
              <p style={{color:"var(--text3)",fontSize:14,marginBottom:14}}>Up to 10 photos · max 5MB each · JPG or PNG</p>
              <button className="btn btn-outline btn-sm">Choose Photos</button>
            </div>
            <div className="inp-wrap" style={{marginBottom:16}}>
              <label className="inp-label">Features & Amenities</label>
              <div className="chips" style={{marginTop:8}}>
                {allFeats.map(f => (
                  <div key={f} className={`chip ${form.feats.includes(f)?"active":""}`}
                    onClick={() => upd("feats", form.feats.includes(f) ? form.feats.filter(x=>x!==f) : [...form.feats,f])}>
                    {form.feats.includes(f)?"✓ ":""}{f}
                  </div>
                ))}
              </div>
            </div>
            <div className="alert alert-green">
              📋 <strong>Review Process:</strong> Your listing will be reviewed within 2–4 hours. We verify all properties for quality and accuracy.
            </div>
          </div>
        )}

        <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>
          <button className="btn btn-ghost" onClick={step===1?onClose:()=>setStep(s=>s-1)}>{step===1?"Cancel":"← Back"}</button>
          <button className="btn btn-primary" onClick={step===3?submit:()=>setStep(s=>s+1)}>
            {step===3?"Submit Listing 🚀":"Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PLANS MODAL ──────────────────────────────────────────────────────────────
function PlansModal({ onClose, currentPlan, onSelect }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal modal-xl" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <div className="modal-title">💎 Choose Your Plan</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{color:"var(--text3)",fontSize:14,marginBottom:28,textAlign:"center"}}>Upgrade to get more leads, listings and unlock powerful features</p>
        <div className="g3">
          {PLANS.map((plan,i) => (
            <div key={plan.id} className={`plan-card ${plan.id==="pro"?"popular":""} ${plan.id==="elite"?"plan-elite":""}`}>
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}
              <div style={{fontSize:28,marginBottom:8}}>{plan.id==="starter"?"🆓":plan.id==="pro"?"🌟":"⚡"}</div>
              <div style={{fontFamily:"'Syne'",fontWeight:800,fontSize:20,color:plan.id==="elite"?"#fff":"var(--text)"}}>{plan.name}</div>
              <div className="plan-price" style={{color:plan.id==="elite"?"#fff":plan.id==="pro"?"var(--g2)":"var(--text)"}}>{plan.priceLabel}</div>
              <div className="div" style={{borderColor:plan.id==="elite"?"rgba(255,255,255,.15)":undefined}} />
              {plan.features.map(f => (
                <div key={f} className="plan-feat" style={{color:plan.id==="elite"?"rgba(255,255,255,.8)":"var(--text2)"}}>
                  <span className="tick">✓</span>{f}
                </div>
              ))}
              <button className="btn btn-w btn-lg" style={{marginTop:20,background:plan.id==="elite"||plan.id==="pro"?"var(--g)":"var(--off2)",color:plan.id==="starter"?"var(--text)":"#fff"}}
                onClick={() => onSelect(plan.id)}>
                {currentPlan===plan.id?"✓ Current Plan":plan.id==="starter"?"Get Started":"Select Plan →"}
              </button>
            </div>
          ))}
        </div>
        <p style={{textAlign:"center",fontSize:13,color:"var(--text3)",marginTop:20}}>All plans include access to UPNEST Nigeria platform · Cancel anytime</p>
      </div>
    </div>
  );
}

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────────
function NotifPanel({ onClose }) {
  const notifs = [
    {id:1,text:"Your listing was approved by admin ✅",time:"2 min ago",unread:true,ico:"✅"},
    {id:2,text:"New lead on your Lekki Duplex",time:"1 hr ago",unread:true,ico:"🎯"},
    {id:3,text:"Payment of ₦500 confirmed",time:"3 hrs ago",unread:true,ico:"💸"},
    {id:4,text:"Your profile was viewed 12 times today",time:"Today",unread:false,ico:"👁"},
    {id:5,text:"Referral bonus: Ngozi activated Pro plan",time:"Yesterday",unread:false,ico:"🤝"},
  ];

  useEffect(() => {
    const handler = (e) => { if (!e.target.closest(".notif-panel")) onClose(); };
    setTimeout(() => document.addEventListener("click", handler), 100);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="notif-panel card anim-scale" style={{position:"absolute",top:"calc(100% + 8px)",right:0,width:340,zIndex:500,overflow:"hidden"}}>
      <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:"'Syne'",fontWeight:700,fontSize:15}}>Notifications</span>
        <span style={{fontSize:12,color:"var(--g2)",cursor:"pointer",fontWeight:600}}>Mark all read</span>
      </div>
      {notifs.map(n => (
        <div key={n.id} className={`notif-item ${n.unread?"unread":""}`}>
          <span style={{fontSize:18,flexShrink:0}}>{n.ico}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:n.unread?600:400}}>{n.text}</div>
            <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{n.time}</div>
          </div>
          {n.unread && <div className="notif-dot2" />}
        </div>
      ))}
      <div style={{padding:12,textAlign:"center",borderTop:"1px solid var(--border)"}}>
        <span style={{fontSize:13,color:"var(--g2)",cursor:"pointer",fontWeight:600}}>View all notifications →</span>
      </div>
    </div>
  );
}
