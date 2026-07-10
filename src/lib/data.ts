// lib/data.ts — All portfolio data from me.md

export type Lang = "en" | "th";

export interface SkillCategory {
  id: string;
  icon: string;
  titleEn: string;
  titleTh: string;
  color: string;
  tags: string[];
}

export interface Project {
  id: string;
  typeEn: string;
  typeTh: string;
  titleEn: string;
  titleTh: string;
  descEn: string;
  descTh: string;
  stack: string[];
  color: string;
  github?: string;
}

export interface Achievement {
  id: string;
  icon: string;
  titleEn: string;
  titleTh: string;
  subtitleEn: string;
  subtitleTh: string;
  descEn: string;
  descTh: string;
  highlight?: boolean;
}

export const hero = {
  name: "Achernar",
  nameTh: "Achernar",
  badge: { en: "Available for Internship & Full-time", th: "พร้อมรับงานฝึกงาน & งานประจำ" },
  role: { en: "Computer Engineering Student · Network & Infrastructure Enthusiast", th: "นักศึกษาวิศวกรรมคอมพิวเตอร์ · ผู้สนใจ Network & Infrastructure" },
  description: {
    en: "Computer Engineering student with a strong interest in Network Engineering, IT Infrastructure, Linux Systems, and Virtualization. Experienced in building home lab environments using Proxmox VE, Ubuntu Server, Docker, and networking technologies.",
    th: "นักศึกษาวิศวกรรมคอมพิวเตอร์ที่มีความสนใจอย่างแรงกล้าด้าน Network Engineering, IT Infrastructure, Linux Systems และ Virtualization มีประสบการณ์ในการสร้างโฮมแล็บด้วย Proxmox VE, Ubuntu Server, Docker และเทคโนโลยีเครือข่าย",
  },
  terminalLines: [
    { prompt: true, text: "whoami" },
    { prompt: false, text: "kunakorn @ engineering-student" },
    { prompt: true, text: "cat focus.txt" },
    { prompt: false, text: "Network · Infrastructure · Virtualization · Linux" },
    { prompt: true, text: "status --check" },
    { prompt: false, text: "✓ Open to opportunities" },
  ],
};

export const about = {
  bio: {
    en: [
      "I'm a Computer Engineering student with a strong interest in Network Engineering, IT Infrastructure, Linux Systems, and Virtualization.",
      "I have hands-on experience building home lab environments using Proxmox VE, Ubuntu Server, Docker, and various networking technologies. I am passionate about designing reliable systems, solving technical problems, and continuously learning modern infrastructure technologies.",
    ],
    th: [
      "เป็นนักศึกษาวิศวกรรมคอมพิวเตอร์ที่มีความสนใจอย่างมากในด้าน Network Engineering, IT Infrastructure, Linux Systems และ Virtualization",
      "มีประสบการณ์ลงมือปฏิบัติจริงในการสร้างสภาพแวดล้อมโฮมแล็บด้วย Proxmox VE, Ubuntu Server, Docker และเทคโนโลยีเครือข่ายต่าง ๆ มุ่งมั่นที่จะออกแบบระบบที่เชื่อถือได้ แก้ไขปัญหาทางเทคนิค และเรียนรู้เทคโนโลยีโครงสร้างพื้นฐานที่ทันสมัยอยู่เสมอ",
    ],
  },
  info: [
    { labelEn: "Real Name", labelTh: "ชื่อจริง", valueEn: "Kunakorn Suwanaphong", valueTh: "คุณากร สุวรรณพงษ์" },
    { labelEn: "Faculty", labelTh: "คณะ", valueEn: "Engineering & Industrial Technology", valueTh: "คณะวิศวกรรมและเทคโนโลยีอุตสาหกรรม" },
    { labelEn: "Major", labelTh: "สาขา", valueEn: "Computer Engineering", valueTh: "วิศวกรรมคอมพิวเตอร์" },
    { labelEn: "Education", labelTh: "การศึกษา", valueEn: "Pibulsongkram Rajabhat University (2023 - Present)", valueTh: "มหาวิทยาลัยราชภัฏพิบูลสงคราม (2023 - ปัจจุบัน)" },
    { labelEn: "Focus", labelTh: "ความเชี่ยวชาญ", valueEn: "Network · Infrastructure · Linux · Virtualization", valueTh: "Network · Infrastructure · Linux · Virtualization" },
    { labelEn: "Languages", labelTh: "ภาษา", valueEn: "Thai (Native) · English (Intermediate)", valueTh: "ไทย (ภาษาแม่) · อังกฤษ (ระดับกลาง)" },
  ],
  stats: [
    { value: "2023", labelEn: "Started", labelTh: "เริ่มศึกษา" },
    { value: "5", labelEn: "Skill Areas", labelTh: "กลุ่มทักษะ" },
    { value: "6", labelEn: "Labs Done", labelTh: "Lab เสร็จแล้ว" },
    { value: "4", labelEn: "Achievements", labelTh: "ผลงาน" },
  ],
  interests: [
    { icon: "🌐", label: "Networking" }, { icon: "🐧", label: "Linux" },
    { icon: "🖥️", label: "Server" }, { icon: "📦", label: "Docker" },
    { icon: "🛡️", label: "Infrastructure" }, { icon: "🔒", label: "Virtualization" },
  ],
};

export const skillCategories: SkillCategory[] = [
  { id: "networking", icon: "🌐", titleEn: "Networking", titleTh: "เครือข่าย", color: "from-blue-500/20 to-cyan-500/20", tags: ["TCP/IP", "VLAN", "OSPF", "BGP (eBGP)", "Routing & Switching", "DHCP", "DNS", "NAT", "VPN", "SSH", "FRRouting (FRR)", "vtysh"] },
  { id: "infrastructure", icon: "🖥️", titleEn: "System & Infrastructure", titleTh: "ระบบ & โครงสร้างพื้นฐาน", color: "from-violet-500/20 to-purple-500/20", tags: ["Linux", "Ubuntu Server", "Proxmox VE", "Docker", "Virtual Machines", "Windows", "Netplan", "sysctl"] },
  { id: "programming", icon: "💻", titleEn: "Programming", titleTh: "การเขียนโปรแกรม", color: "from-green-500/20 to-emerald-500/20", tags: ["C", "Python", "HTML", "CSS", "JavaScript (Basic)"] },
  { id: "security", icon: "🔒", titleEn: "Cybersecurity", titleTh: "ความปลอดภัยไซเบอร์", color: "from-red-500/20 to-orange-500/20", tags: ["Wireshark", "Nmap", "Burp Suite", "CTF", "Linux Security (Basic)"] },
  { id: "tools", icon: "🛠️", titleEn: "Tools", titleTh: "เครื่องมือ", color: "from-slate-500/20 to-gray-500/20", tags: ["Git", "GitHub", "Cloudflare", "Vercel"] },
];


export const projects: Project[] = [
  {
    id: "wastecoin",
    typeEn: "Backend Development",
    typeTh: "พัฒนา Backend",
    titleEn: "WasteCoin Backend",
    titleTh: "WasteCoin Backend",
    descEn: "Developed backend services for WasteCoin platform, including user authentication with JWT & bcrypt, RESTful API design, and MongoDB database integration.",
    descTh: "พัฒนา Backend สำหรับแพลตฟอร์ม WasteCoin ครอบคลุมระบบ Authentication ด้วย JWT & bcrypt, ออกแบบ RESTful API และเชื่อมต่อฐานข้อมูล MongoDB",
    stack: ["Node.js", "Express", "JWT", "bcrypt", "REST API", "MongoDB"],
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "smartcontract",
    typeEn: "Blockchain Dev",
    typeTh: "พัฒนา Blockchain",
    titleEn: "Smart Contract Development",
    titleTh: "พัฒนา Smart Contract",
    descEn: "Developed and tested smart contracts using Solidity on Hardhat framework. Explored dApp development and blockchain integration with ethers.js.",
    descTh: "พัฒนาและทดสอบ Smart Contract ด้วย Solidity บน Hardhat Framework สำรวจการพัฒนา dApp และการเชื่อมต่อ Blockchain ด้วย ethers.js",
    stack: ["Solidity", "Hardhat", "ethers.js"],
    color: "from-yellow-500 to-orange-600"
  },
  {
    id: "network-sim",
    typeEn: "Network Lab",
    typeTh: "แล็บเครือข่าย",
    titleEn: "Enterprise Network Simulation",
    titleTh: "จำลองระบบเครือข่ายองค์กร",
    descEn: "Designed and simulated enterprise network topologies using GNS3 & Cisco Packet Tracer, covering VLANs, routing protocols, firewall rules, and VPN configurations.",
    descTh: "ออกแบบและจำลองโทโพโลยีเครือข่ายองค์กรด้วย GNS3 & Cisco Packet Tracer ครอบคลุม VLAN, Routing Protocol, Firewall และ VPN",
    stack: ["GNS3", "Cisco PT", "VLAN", "VPN", "Firewall"],
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "mips-cpu",
    typeEn: "Computer Architecture",
    typeTh: "สถาปัตยกรรมคอมพิวเตอร์",
    titleEn: "Single Cycle MIPS CPU Design",
    titleTh: "ออกแบบ Single Cycle MIPS CPU",
    descEn: "Designed and implemented a Single Cycle MIPS CPU. Tested instruction execution and memory operations.",
    descTh: "ออกแบบและพัฒนาหน่วยประมวลผล Single Cycle MIPS CPU พร้อมทดสอบการทำงานของชุดคำสั่งและการทำงานร่วมกับหน่วยความจำ",
    stack: ["MIPS", "Digital Logic", "CPU Design"],
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "homelab",
    typeEn: "System & Infrastructure",
    typeTh: "ระบบและโครงสร้างพื้นฐาน",
    titleEn: "Home Lab Infrastructure",
    titleTh: "โครงสร้างพื้นฐานโฮมแล็บ",
    descEn: "Built an enterprise-grade home lab using Proxmox VE. Deployed a Windows Server 2022 Domain Controller for Active Directory (AD DS, DNS, DHCP, GPOs), implemented a virtual pfSense firewall with VLAN segmentation, configured a standalone WireGuard remote access VPN server on Ubuntu, and built a 3-router OSPF/BGP topology using FRRouting to demonstrate dynamic routing protocols in production software.",
    descTh: "สร้างระบบโฮมแล็บจำลองเครือข่ายระดับองค์กรโดยใช้ Proxmox VE ครอบคลุม Windows Server 2022 Domain Controller (AD DS, DNS, DHCP, GPOs), pfSense Firewall พร้อม VLAN, WireGuard VPN Server บน Ubuntu และสร้างโทโพโลยีเราเตอร์ 3 ตัวด้วย FRRouting เพื่อสาธิต OSPF และ eBGP ด้วยซอฟต์แวร์ Routing ระดับ Production",
    stack: ["Proxmox VE", "Active Directory", "Windows Server 2022", "pfSense", "VLAN", "WireGuard", "VPN", "FRRouting", "OSPF", "BGP"],
    color: "from-violet-500 to-purple-600"
  },
  {
    id: "portfolio-web",
    typeEn: "Web Development",
    typeTh: "พัฒนาเว็บไซต์",
    titleEn: "Portfolio Website",
    titleTh: "เว็บไซต์พอร์ตโฟลิโอ",
    descEn: "Developed and deployed a personal portfolio. Configured Cloudflare DNS and Vercel deployment.",
    descTh: "พัฒนาและนำส่งเว็บไซต์พอร์ตโฟลิโอส่วนตัว พร้อมทั้งตั้งค่า Cloudflare DNS และเชื่อมโยงบริการของ Vercel สำหรับดีพลอยเมนต์",
    stack: ["Next.js", "React", "Cloudflare", "Vercel"],
    color: "from-pink-500 to-rose-600",
    github: "https://github.com/Achernar046/portforio.git"
  },
];

export const achievements: Achievement[] = [
  { id: "psru", icon: "🥉", titleEn: "PSRU Cyber Hackathon", titleTh: "PSRU Cyber Hackathon", subtitleEn: "🏆 3rd Place", subtitleTh: "🏆 อันดับที่ 3", descEn: "Participated in cybersecurity challenges involving practical problem solving and teamwork in a fast-paced competition.", descTh: "เข้าร่วมการแข่งขัน Hackathon ด้านไซเบอร์ซีเคียวริตี้ที่ต้องใช้ทักษะการแก้ปัญหาและการทำงานเป็นทีม", highlight: true },
  { id: "cybersec", icon: "🔐", titleEn: "Cybersecurity Competition", titleTh: "การแข่งขันด้าน Cybersecurity", subtitleEn: "Participant", subtitleTh: "ผู้เข้าร่วม", descEn: "Applied theoretical knowledge in practical cybersecurity challenges covering network security, CTF, and defensive operations.", descTh: "นำความรู้ทางทฤษฎีไปใช้ในโจทย์ Cybersecurity จริง ครอบคลุมความปลอดภัยเครือข่าย, CTF และการป้องกันระบบ" },
  { id: "business", icon: "💼", titleEn: "Business Model Competition", titleTh: "การแข่งขันด้านโมเดลธุรกิจ", subtitleEn: "Participant", subtitleTh: "ผู้เข้าร่วม", descEn: "Developed and presented an innovative business model as part of a cross-disciplinary team competition.", descTh: "พัฒนาและนำเสนอโมเดลธุรกิจที่สร้างสรรค์ในการแข่งขันข้ามสาขาวิชา" },
  { id: "solidworks", icon: "🏗️", titleEn: "SolidWorks Competition", titleTh: "การแข่งขัน SolidWorks", subtitleEn: "Participant", subtitleTh: "ผู้เข้าร่วม", descEn: "Competed in 3D engineering design using SolidWorks, showcasing technical precision and engineering fundamentals.", descTh: "แข่งขันออกแบบ 3D เชิงวิศวรรณด้วย SolidWorks แสดงความแม่นยำทางเทคนิคและพื้นฐานทางวิศวกรรม" },
];

export const learningTopics = [
  { icon: "🐧", titleEn: "System Administration", titleTh: "การบริหารจัดการระบบ", items: ["Linux Administration", "Windows Server", "Active Directory", "Virtualization (Proxmox VE/ESXi)", "Docker & Containerization", "Backup & Recovery"] },
  { icon: "🛡️", titleEn: "Security Topics", titleTh: "หัวข้อด้านความปลอดภัย", items: ["Firewalls", "NAC", "Sandbox", "WAF", "Secure Email Gateway", "Content Filter", "Wi-Fi Security", "Endpoint Hardening", "SIEM", "SOAR"] },
  { icon: "🌐", titleEn: "Network & Cloud", titleTh: "เครือข่าย & คลาวด์", items: ["OSPF (FRRouting)", "BGP / eBGP (FRRouting)", "Dynamic Routing Protocols", "SD-WAN", "Zero Trust Network Access", "Cloud Security", "SASE", "Endpoint Monitoring", "Cloud Computing"] },
  { icon: "🔬", titleEn: "Research Interests", titleTh: "หัวข้อที่สนใจวิจัย", items: ["Enterprise Network", "Infrastructure Design", "Distributed Systems", "Hardware Architecture", "High Availability Systems", "Security Operations"] },
];

export const contact = {
  email: "kunakorn1516@gmail.com",
  github: "https://github.com/Achernar046",
  githubUsername: "Achernar046",
  instagram: "https://instagram.com/kunakorn_kup/",
  instagramHandle: "@kunakorn_kup",
  facebook: "https://www.facebook.com/kunakorn.suwanaphong",
  facebookHandle: "kunakorn.suwanaphong",
};


export interface Certificate {
  id: string;
  titleEn: string;
  titleTh: string;
  issuerEn: string;
  issuerTh: string;
  file: string;
}

export const certificates: Certificate[] = [
  {
    id: "thctt-24",
    titleEn: "Thailand Cyber Top Talent 2024",
    titleTh: "Thailand Cyber Top Talent 2024",
    issuerEn: "NCSA",
    issuerTh: "สอท. (สำนักงานคณะกรรมการการรักษาความมั่นคงปลอดภัยไซเบอร์แห่งชาติ)",
    file: "/picture/certificates/Cert Senior THCTT24_Num491.pdf"
  },
  {
    id: "ctf-part",
    titleEn: "CTF Competition Participant",
    titleTh: "ผู้เข้าร่วมการแข่งขัน CTF",
    issuerEn: "Cyber Security Agency",
    issuerTh: "หน่วยงานความมั่นคงปลอดภัยไซเบอร์",
    file: "/picture/certificates/CTF_Cert_Part15.pdf"
  },
  {
    id: "hackathon-2",
    titleEn: "Hackathon #2 Participant",
    titleTh: "ผู้เข้าร่วม Hackathon #2",
    issuerEn: "Hackathon Organizer",
    issuerTh: "ผู้จัดงาน Hackathon",
    file: "/picture/certificates/Certificate_Hackathon#2.pdf"
  },
  {
    id: "python-essentials",
    titleEn: "Python Essentials 1",
    titleTh: "Python Essentials 1",
    issuerEn: "Cisco Networking Academy & Python Institute",
    issuerTh: "Cisco Networking Academy & Python Institute",
    file: "/picture/certificates/Python_Essentials_1_certificate_kunakorn-s-psru-ac-th_e821c98c-ca92-4550-abe1-7baa9e3ce90f.pdf"
  },
  {
    id: "cert-kunakorn",
    titleEn: "Academic Achievement Certificate",
    titleTh: "เกียรติบัตรสำเร็จการศึกษา/ผลงานทางวิชาการ",
    issuerEn: "Pibulsongkram Rajabhat University",
    issuerTh: "มหาวิทยาลัยราชภัฏพิบูลสงคราม",
    file: "/picture/certificates/คุณากร สุวรรณพงษ์.pdf"
  },
  {
    id: "cert-1",
    titleEn: "Certificate of Achievement",
    titleTh: "เกียรติบัตรแสดงความสำเร็จ",
    issuerEn: "Training Center",
    issuerTh: "ศูนย์อบรมสัมมนา",
    file: "/picture/certificates/certificate(1).pdf"
  },
  {
    id: "cert-generic",
    titleEn: "Technical Training Certificate",
    titleTh: "เกียรติบัตรฝึกอบรมทางเทคนิค",
    issuerEn: "Education Provider",
    issuerTh: "สถาบันการศึกษาและฝึกอบรม",
    file: "/picture/certificates/certificate.pdf"
  },
  {
    id: "cert-award",
    titleEn: "Achievement Award",
    titleTh: "รางวัลผลงานดีเด่น",
    issuerEn: "Competition Committee",
    issuerTh: "คณะกรรมการจัดงาน",
    file: "/picture/certificates/11.png"
  }
];

export const galleryImages = [
  "/picture/pic/IMG20240808123203.jpg",
  "/picture/pic/IMG20241005231000.jpg",
  "/picture/pic/IMG20241008160112.jpg",
  "/picture/pic/IMG20241127155829.jpg",
  "/picture/pic/IMG20241226121403.jpg",
  "/picture/pic/IMG20241227120238.jpg",
  "/picture/pic/IMG20250213160810.jpg",
  "/picture/pic/IMG_4853.jpg",
  "/picture/pic/IMG_4980.jpg",
  "/picture/pic/IMG_5028.jpg",
  "/picture/pic/IMG_5552.JPG",
  "/picture/pic/IMG_9931.jpg",
  "/picture/pic/received_1504015043843323.jpeg",
  "/picture/pic/received_761241249669225.jpeg",
  "/picture/pic/received_773726318645939.jpeg"
];

export interface LabProblem {
  title: string;
  symptom: string;
  solution: string;
}

export interface LabDetail {
  architecture: string;
  implemented: string[];
  problems: LabProblem[];
  skills: string[];
}

export interface Lab {
  id: string;
  icon: string;
  color: string;
  accentColor: string;
  titleEn: string;
  titleTh: string;
  overviewEn: string;
  overviewTh: string;
  stack: string[];
  status: "done" | "coming";
  detail?: LabDetail;
}

export const labs: Lab[] = [
  {
    id: "active-directory",
    icon: "🏢",
    color: "from-blue-500/20 to-indigo-500/20",
    accentColor: "blue",
    titleEn: "Active Directory Infrastructure",
    titleTh: "Active Directory Infrastructure",
    overviewEn: "Set up a small-scale enterprise network using Proxmox VE as hypervisor with Windows Server 2022 Domain Controller managing centralized authentication, DNS, DHCP, and Group Policy.",
    overviewTh: "ตั้งค่าเครือข่ายองค์กรขนาดเล็กโดยใช้ Proxmox VE เป็น Hypervisor พร้อม Windows Server 2022 Domain Controller จัดการ Authentication, DNS, DHCP และ Group Policy",
    stack: ["Proxmox VE", "Windows Server 2022", "Active Directory", "DNS", "DHCP", "GPO", "PowerShell"],
    status: "done",
    detail: {
      architecture: `Internet\n   |\n[Router/Gateway - 192.168.1.1]\n   |\n   ├── DC01 (Windows Server 2022)\n   │   IP: 192.168.1.99 (static)\n   │   Roles: AD DS, DNS, DHCP\n   │   Domain: lab.local\n   │\n   └── Client01 (Windows 10/11 Enterprise)\n       IP: 192.168.1.20 (static)\n       Domain: LAB\\Client01`,
      implemented: [
        "Domain Controller Setup — Windows Server 2022, static IP, AD DS + DNS",
        "OU Structure — lab.local → lab → IT / User / Computers (via PowerShell)",
        "Users & Groups — jdoe (IT-Admins), msmith, awilson (Staff)",
        "Client Domain Join — Windows 10/11 Enterprise joined to lab.local",
        "GPO — Custom wallpaper, password complexity, Control Panel restriction"
      ],
      problems: [
        { title: "VirtIO Disk Not Recognized", symptom: "Windows Setup showed no drives found", solution: "Switched VM disk bus from VirtIO/SCSI to SATA for native Windows driver support" },
        { title: "Network Adapter Missing", symptom: "Network Connections showed no adapters", solution: "Changed VM NIC from VirtIO to Intel E1000 which has built-in Windows drivers" },
        { title: "Static IP Address Conflict", symptom: "DNS timed out, RDP failed intermittently", solution: "Found duplicate IP via Get-NetIPAddress, reassigned DC to 192.168.1.99 using Remove/New-NetIPAddress" },
        { title: "Windows 10 Home Domain Join", symptom: "Cannot join domain error on Windows 10 Home", solution: "Rebuilt VM with Windows Enterprise Evaluation ISO which supports domain join" },
        { title: "GPO Wrong Config Node", symptom: "Wallpaper policy had no effect", solution: "Moved to User Configuration instead of Computer Configuration, re-linked GPO to User OU" },
        { title: "Password Policy GPO No Effect", symptom: "New GPO password policy ignored", solution: "Edited Default Domain Policy at domain root — the only place AD enforces password rules" }
      ],
      skills: [
        "Windows Server 2022 role configuration (AD DS, DNS, DHCP)",
        "Active Directory management via PowerShell",
        "Group Policy design and scoping",
        "Network troubleshooting (IP conflicts, port-level testing)",
        "Proxmox VE VM hardware configuration"
      ]
    }
  },
  {
    id: "pfsense-vlan",
    icon: "🛡️",
    color: "from-orange-500/20 to-red-500/20",
    accentColor: "orange",
    titleEn: "pfSense Firewall + VLAN Segmentation",
    titleTh: "pfSense Firewall + VLAN Segmentation",
    overviewEn: "Implemented a virtual firewall/router with WAN/LAN separation, outbound NAT, and VLAN-based network segmentation using pfSense CE on Proxmox VE.",
    overviewTh: "สร้าง Firewall/Router เสมือนพร้อม WAN/LAN, Outbound NAT และแบ่งเครือข่ายด้วย VLAN โดยใช้ pfSense CE บน Proxmox VE",
    stack: ["pfSense CE", "Proxmox VE", "Ubuntu Server", "VLAN 802.1Q", "NAT", "iptables"],
    status: "done",
    detail: {
      architecture: `Home Router (192.168.1.1)\n   │\n   ├── vmbr0 (home network) ── DC01, Client01 — untouched\n   │\n   └── pfSense VM\n       ├── WAN (em0) → vmbr0 → 192.168.1.4/24\n       └── LAN (em1) → vmbr1 (internal bridge) → 10.10.10.1/24\n           │\n           ├── OPT1/VLAN10-Servers → 10.10.20.1/24\n           └── OPT2/VLAN20-Clients → 10.10.30.1/24\n\nUbuntu VM (multi-homed test client):\n   ├── ens18 → vmbr1 (LAN) → 10.10.10.101\n   ├── ens19 → vmbr0 (home) → 192.168.1.9\n   └── ens20 → vmbr1 (VLAN10 tagged) → 10.10.20.50`,
      implemented: [
        "Network Isolation — vmbr1 internal-only bridge, no physical NIC",
        "pfSense CE 2.8.1 — WAN/LAN setup, LAN IP changed to 10.10.10.1",
        "Firewall Rules — tested block/allow rules, verified rule ordering",
        "NAT — Automatic Outbound NAT for 10.10.10.0/24",
        "VLAN10 (Servers 10.10.20.0/24) + VLAN20 (Clients 10.10.30.0/24)"
      ],
      problems: [
        { title: "Proxmox Bridge Rejected VLAN Tag", symptom: "VM failed to start: pve-bridge failed with status 65280", solution: "Removed VLAN Tag from Proxmox device, did VLAN tagging inside Ubuntu guest OS using linux vlan package" },
        { title: "SSH Tunnel Wrong Direction", symptom: "Browser on Windows couldn't reach localhost:8443 after running ssh -L on Ubuntu", solution: "Ran the ssh -L command from Windows PowerShell instead, so the forwarded port is on the machine with a browser" },
        { title: "VLAN Traffic Timed Out", symptom: "ping to pfSense OPT1 gateway timed out", solution: "Added Pass rule on OPT1 — pfSense is deny-by-default on new OPT interfaces unlike LAN" },
        { title: "SSH Tunnel Broke After Reboot", symptom: "Connection timed out after Ubuntu VM reboot", solution: "Re-checked IP via Proxmox console (DHCP changed it), updated SSH command with new address" }
      ],
      skills: [
        "pfSense firewall installation and rule configuration",
        "VLAN segmentation with 802.1Q guest-OS tagging",
        "Default-deny vs default-allow firewall behavior",
        "SSH tunneling and local port forwarding",
        "Network isolation design (parallel lab network)"
      ]
    }
  },
  {
    id: "wireguard-vpn",
    icon: "🔐",
    color: "from-green-500/20 to-emerald-500/20",
    accentColor: "green",
    titleEn: "WireGuard Remote Access VPN",
    titleTh: "WireGuard Remote Access VPN",
    overviewEn: "Set up a WireGuard VPN server on Ubuntu VM with router port forwarding, enabling a Windows client to establish a full-tunnel VPN connection from outside the home network (tested over mobile data).",
    overviewTh: "ติดตั้ง WireGuard VPN Server บน Ubuntu VM พร้อม Port Forwarding บน Router ทดสอบ Full-Tunnel จากภายนอกเครือข่าย (ผ่านสัญญาณมือถือ)",
    stack: ["WireGuard", "Ubuntu Server", "Proxmox VE", "iptables", "NAT (MASQUERADE)"],
    status: "done",
    detail: {
      architecture: `Windows Client (remote — on mobile data)\n   │  WireGuard tunnel (UDP 51820)\n   ▼\nHome Router (Public IP: 182.53.x.x)\n   │  Port Forward: UDP 51820 → 192.168.1.9\n   ▼\nWireGuard Server VM (Ubuntu)\n   IP: 192.168.1.9\n   wg0: 10.10.99.1/24\n   │\n   └── NAT (MASQUERADE) → routes traffic out via ens18`,
      implemented: [
        "Ubuntu VM on vmbr0 with IP forwarding enabled via sysctl.d",
        "WireGuard server key pair + wg0.conf with PostUp/PostDown iptables rules",
        "Full-tunnel client config (AllowedIPs = 0.0.0.0/0) for Windows client",
        "Router port forwarding UDP 51820 to WireGuard server",
        "Verified: handshake, ping through tunnel, public IP changed to home IP"
      ],
      problems: [
        { title: "/etc/sysctl.conf Not Found", symptom: "sed command failed — file does not exist", solution: "Created /etc/sysctl.d/99-wireguard.conf and applied with sysctl -p" },
        { title: "Config Left With Placeholder Values", symptom: "wg-quick failed: Key is not the correct length or format", solution: "Used heredoc to inject actual key file values directly, eliminating manual copy-paste step" },
        { title: "Internet Broken Through Tunnel", symptom: "Ping to VPN server worked but curl to internet failed", solution: "Added iptables MASQUERADE + FORWARD rules via PostUp in wg0.conf — kernel forwarding alone doesn't NAT" },
        { title: "PowerShell curl Alias Confusion", symptom: "curl returned a full parsed object instead of plain IP", solution: "Used (Invoke-WebRequest -Uri ...).Content to extract body, or checked in browser instead" }
      ],
      skills: [
        "WireGuard VPN from scratch with native wg/wg-quick tools",
        "Key pair generation and peer-based trust model",
        "Linux IP forwarding and NAT (iptables MASQUERADE)",
        "Router port forwarding for self-hosted services",
        "End-to-end VPN verification methodology"
      ]
    }
  },
  {
    id: "ospf-routing",
    icon: "🔀",
    color: "from-cyan-500/20 to-teal-500/20",
    accentColor: "cyan",
    titleEn: "OSPF Routing Lab (FRRouting)",
    titleTh: "OSPF Routing Lab (FRRouting)",
    overviewEn: "Built a 3-router OSPF topology on Proxmox VE using FRRouting — a production-grade routing suite — to demonstrate dynamic route learning, neighbor adjacency, and failure detection without any static routes.",
    overviewTh: "สร้างโทโพโลยี OSPF 3 เราเตอร์บน Proxmox VE ด้วย FRRouting (ซอฟต์แวร์ Routing ระดับ Production) เพื่อสาธิตการเรียนรู้เส้นทางแบบ Dynamic, Neighbor Adjacency และการตรวจจับความล้มเหลว โดยไม่ต้องตั้ง Static Route ใดๆ",
    stack: ["FRRouting", "OSPF", "Ubuntu Server", "Proxmox VE", "vtysh", "Netplan"],
    status: "done",
    detail: {
      architecture: `            vmbr2                       vmbr3
          (Link A-B)                  (Link B-C)
Router-A ──────────── Router-B ──────────── Router-C
10.0.12.1/30      10.0.12.2/30  10.0.23.1/30    10.0.23.2/30
(Area 0)                                         (Area 0)

Loopbacks (simulate networks "behind" each router):
  Router-A: lo → 1.1.1.1/32
  Router-B: lo → 2.2.2.2/32
  Router-C: lo → 3.3.3.3/32

Management (vmbr0, DHCP — SSH access from host):
  All 3 routers have a management NIC on the home network`,
      implemented: [
        "Created 2 internal-only Proxmox bridges (vmbr2, vmbr3) as isolated point-to-point virtual cables",
        "Built 3 lightweight Ubuntu VMs, each assigned /30 point-to-point IPs via Netplan",
        "Added loopback addresses (1.1.1.1, 2.2.2.2, 3.3.3.3) to simulate networks behind each router",
        "Installed FRR, enabled ospfd daemon, and configured OSPF Area 0 on all routers via vtysh",
        "Verified OSPF neighbor adjacency reached Full state and routes propagated end-to-end",
        "Deliberate link failure test — confirmed OSPF Dead Timer removed routes and re-established them on recovery"
      ],
      problems: [
        {
          title: "Ping Between Non-Adjacent Routers Failed Despite Correct Routing Table",
          symptom: "show ip route ospf on Router-A correctly showed routes to Router-C's networks, but ping still failed with 100% packet loss",
          solution: "Enabled IP forwarding via /etc/sysctl.d/99-routing.conf on all three routers — the Linux kernel's ip_forward was 0 (the Ubuntu default), so FRR's correct routing table wasn't being acted on by the kernel's data plane"
        }
      ],
      skills: [
        "OSPF configuration and verification using production routing software (FRR) via vtysh (Cisco IOS-style CLI)",
        "Point-to-point /30 addressing convention and loopback-based network simulation",
        "Diagnosing routing (control plane) vs. forwarding (data plane) issues independently",
        "Failure detection and self-healing behavior of OSPF, verified through deliberate link failure testing",
        "Proxmox internal-bridge networking to build isolated multi-node lab topologies"
      ]
    }
  },
  {
    id: "bgp-routing",
    icon: "🌍",
    color: "from-violet-500/20 to-purple-500/20",
    accentColor: "purple",
    titleEn: "BGP Routing Lab (FRRouting)",
    titleTh: "BGP Routing Lab (FRRouting)",
    overviewEn: "Reconfigured the OSPF lab topology into three separate Autonomous Systems (AS 65001–65003) and established eBGP sessions using FRRouting to demonstrate AS-Path propagation, transit routing, and RFC 8212 default policy behavior.",
    overviewTh: "ปรับโทโพโลยีจาก OSPF Lab ให้เป็น 3 Autonomous Systems แยกกัน (AS 65001–65003) และตั้งค่า eBGP ด้วย FRRouting เพื่อสาธิต AS-Path, Transit Routing และ RFC 8212 Default Policy",
    stack: ["FRRouting", "eBGP", "Ubuntu Server", "Proxmox VE", "vtysh", "RFC 8212"],
    status: "done",
    detail: {
      architecture: `┌──────────────┐     eBGP      ┌──────────────┐     eBGP      ┌──────────────┐
│   AS 65001   │  10.0.12.0/30 │   AS 65002   │  10.0.23.0/30 │   AS 65003   │
│  Router-A    │◄─────────────►│  Router-B    │◄─────────────►│  Router-C    │
│  lo:1.1.1.1  │               │  lo:2.2.2.2  │               │  lo:3.3.3.3  │
└──────────────┘               └──────────────┘               └──────────────┘

Route propagation on Router-A (show ip bgp):
  1.1.1.1/32  Weight 32768  Path: i           (originated locally)
  2.2.2.2/32               Path: 65002 i      (learned from AS 65002)
  3.3.3.3/32               Path: 65002 65003 i (transit via AS 65002)`,
      implemented: [
        "Disabled OSPF (no router ospf) and enabled bgpd daemon on all three routers",
        "Assigned each router its own AS number (65001, 65002, 65003) and configured eBGP neighbors across each point-to-point link",
        "Advertised each router's loopback into BGP via network X.X.X.X/32 under address-family ipv4 unicast",
        "Created route-map ALLOW-ALL permit 10 and applied as in/out policy on every eBGP neighbor (RFC 8212 compliance)",
        "Verified all 3 sessions reached Established state with correct prefix counts",
        "Confirmed AS-Path propagation: Router-A shows 1-hop (65002 i) and 2-hop transit (65002 65003 i) routes correctly"
      ],
      problems: [
        {
          title: "Local vs. Remote IP Confusion in Neighbor Statements",
          symptom: "Router-B's neighbor 10.0.23.1 remote-as 65003 was rejected with '% Can not configure the local system as neighbor'",
          solution: "Cross-checked each router's actual assigned IP via 'ip a' before writing neighbor statements — the neighbor must point to the far-end router's address, not the local one. Also caught a typo pattern of 10.10.x.x instead of 10.0.x.x across multiple routers"
        },
        {
          title: "BGP Sessions Established But Showing (Policy) Instead of Prefix Counts",
          symptom: "show ip bgp summary showed Established sessions, but State/PfxRcd displayed '(Policy)' and no prefixes appeared from any neighbor",
          solution: "Created a permissive route-map ALLOW-ALL permit 10 and applied it as both inbound and outbound policy on every eBGP neighbor — FRR enforces RFC 8212 by default, refusing to exchange any prefixes without an explicit policy. Adding 'neighbor ... activate' was a no-op since frr defaults traditional already auto-activates IPv4 unicast"
        },
        {
          title: "Loopback Addresses Disappeared After VM Reboot, Silently Breaking Route Advertisement",
          symptom: "After route-maps were applied and sessions Established, no prefixes were being advertised — show ip bgp on every router showed only its own locally-originated route",
          solution: "Re-added each loopback address and made them persistent via a lo: stanza in each router's Netplan config — they had been added with 'ip addr add' (non-persistent) and were lost on reboot. FRR v7.4+ requires the network prefix to exist in the local RIB before advertising it via BGP"
        }
      ],
      skills: [
        "eBGP configuration across multiple Autonomous Systems using production routing software (FRR)",
        "Understanding and applying RFC 8212 (default eBGP policy requirement) with route-map based policy",
        "Reading and interpreting AS-Path attributes to distinguish directly-originated, single-hop, and transit routes",
        "Systematic troubleshooting across three distinct root causes affecting the same symptom (missing prefixes)",
        "Recognizing when a fix attempt is a no-op by verifying the running-config rather than assuming command success"
      ]
    }
  },
  {
    id: "pfsense-wazuh-siem",
    icon: "🔍",
    color: "from-red-500/20 to-rose-500/20",
    accentColor: "red" as const,
    titleEn: "pfSense → Wazuh SIEM Integration",
    titleTh: "pfSense → Wazuh SIEM Integration",
    overviewEn: "Built a full syslog-based log pipeline from pfSense firewall into Wazuh SIEM/XDR. Wrote custom decoders and detection rules to parse pfSense filterlog, generate real-time alerts (including port-scan detection via MITRE T1046), and built a firewall monitoring dashboard in OpenSearch Dashboards.",
    overviewTh: "สร้าง Log Pipeline แบบ Syslog เต็มรูปแบบจาก pfSense Firewall เข้าสู่ Wazuh SIEM/XDR เขียน Custom Decoder และ Detection Rules เพื่อ Parse pfSense filterlog สร้าง Real-time Alerts (รวมการตรวจจับ Port Scan ด้วย MITRE T1046) และสร้าง Firewall Monitoring Dashboard ใน OpenSearch Dashboards",
    stack: ["Wazuh 4.14", "pfSense CE", "Ubuntu Server", "Proxmox VE", "OpenSearch", "Filebeat", "Syslog UDP", "MITRE ATT&CK"],
    status: "done",
    detail: {
      architecture: `pfSense Firewall (10.10.10.1)\n   │  Syslog UDP 514\n   ▼\nWazuh Manager (Ubuntu 22.04)\n   ├── wazuh-remoted  → receives syslog on :514\n   ├── Custom Decoder → parses filterlog CSV fields\n   │     (interface, reason, fw_action, srcip, dstip, srcport, dstport)\n   ├── Custom Rules → 100100 / 100101 / 100102 (port-scan MITRE T1046)\n   └── Filebeat\n        │\n        ▼\n   OpenSearch Indexer (wazuh-alerts-*)\n        │\n        ▼\n   OpenSearch Dashboards\n        └── pfSense Firewall Monitoring Dashboard`,
      implemented: [
        "Added 2nd virtual NIC to Wazuh VM and configured static IP 10.10.10.50/24 via Netplan (renderer: networkd)",
        "Configured pfSense remote syslog → 10.10.10.50:514 (System, Firewall, DHCP events)",
        "Added syslog <remote> listener block in ossec.conf for UDP port 514",
        "Wrote PCRE2-based custom decoder to extract 9 fields from pfSense filterlog CSV payload",
        "Wrote 3-rule chain: base event (L3) → blocked traffic with src/dst in description (L6) → port-scan frequency rule 10 events/60s (L10, MITRE T1046)",
        "Validated decoder+rules with wazuh-logtest before touching live config",
        "Built pfSense Firewall Monitoring dashboard in OpenSearch: alert timeline, top blocked ports, top blocked source IPs"
      ],
      problems: [
        { title: "wazuh-manager failed to start after adding decoder", symptom: "ERROR (1452): Syntax error on regex — manager refused to start", solution: "Wazuh's default OS_Regex engine doesn't support PCRE syntax (\\d, \\S, \\[). Switched to <regex type=\"pcre2\"> which enables full PCRE2 support" },
        { title: "pfSense IP collided with home router after factory reset", symptom: "pfSense LAN defaulted to 192.168.1.1 — web UI unreachable over home LAN", solution: "Used pfSense console menu option 2 to directly reassign LAN to 10.10.10.1/24, bypassing web UI" },
        { title: "Wazuh VM had no route to pfSense lab subnet", symptom: "ping 10.10.10.1 failed — Wazuh only had a NIC on 192.168.1.0/24", solution: "Added a 2nd virtual NIC in Proxmox bridged to the same vSwitch as pfSense LAN, then assigned static IP via Netplan" },
        { title: "Static IP reverted to DHCP after VM reboot", symptom: "ens19 came back with a DHCP lease despite Netplan specifying static IP", solution: "Added renderer: networkd in Netplan config — forces systemd-networkd exclusively, preventing NetworkManager from racing at boot" },
        { title: "filterlog decoder never matched — 'No decoder matched'", symptom: "wazuh-logtest showed Phase 2: No decoder matched on real captured lines", solution: "Switched from <program_name> to <prematch>filterlog</prematch> — wazuh-remoted's syslog path prefixes lines non-standardly, blocking clean program_name extraction" },
        { title: "Rule failed to load — 'Field action is static'", symptom: "wazuh-analysisd: ERROR: Field 'action' is static", solution: "'action' is reserved by Wazuh's active-response subsystem. Renamed decoder field to 'fw_action' in both decoder order and rule field references" },
        { title: "Rules never fired despite correct field decoding", symptom: "Phase 3 never appeared in wazuh-logtest output after all fields decoded correctly", solution: "Rule used <decoded_as>pfsense-filterlog-fields</decoded_as> (child name), but Wazuh reports parent's name for matching by default. Fixed by pointing rule at parent name 'pfsense-filterlog'" },
        { title: "Dashboard showed 'No results' despite alerts firing", symptom: "Threat Hunting returned zero results for rule.groups: pfsense", solution: "Dashboard time range defaulted to a stale narrow window. Widened to 'Last 1 day' — alerts appeared immediately. IndexerConnector warnings in ossec.log were a red herring (unrelated inventory feature)" }
      ],
      skills: [
        "Wazuh SIEM architecture: remoted, decoder engine, rule engine, Filebeat, OpenSearch indexer pipeline",
        "Writing PCRE2-based custom decoders to parse structured syslog payloads (pfSense filterlog CSV format)",
        "Designing multi-level detection rule chains with frequency-based correlation (port-scan detection, MITRE T1046)",
        "Debugging a multi-hop pipeline hop-by-hop: network → syslog receipt → decode → rule → indexer → dashboard",
        "Netplan static IP configuration with explicit renderer to survive VM reboots under NetworkManager",
        "OpenSearch Dashboards: index pattern setup, visualization types (Date Histogram, Terms aggregation), dashboard assembly"
      ]
    }
  },
  {
    id: "docker-nginx",
    icon: "🐋",
    color: "from-cyan-500/20 to-blue-500/20",
    accentColor: "cyan",
    titleEn: "Docker + Nginx Portfolio Deployment",
    titleTh: "Docker + Nginx Portfolio Deployment",
    overviewEn: "Containerizing and deploying the portfolio website using Docker and Nginx as a reverse proxy.",
    overviewTh: "ใช้ Docker และ Nginx เป็น Reverse Proxy สำหรับ Deploy เว็บไซต์ Portfolio",
    stack: ["Docker", "Nginx", "Docker Compose", "Linux"],
    status: "coming"
  },
  {
    id: "monitoring",
    icon: "📊",
    color: "from-yellow-500/20 to-amber-500/20",
    accentColor: "yellow",
    titleEn: "Monitoring Lab (Prometheus + Grafana)",
    titleTh: "Monitoring Lab (Prometheus + Grafana)",
    overviewEn: "Setting up infrastructure monitoring with Prometheus metrics collection and Grafana dashboards.",
    overviewTh: "ติดตั้งระบบ Monitoring ด้วย Prometheus และ Grafana Dashboard",
    stack: ["Prometheus", "Grafana", "Node Exporter", "Docker"],
    status: "coming"
  },
  {
    id: "elk-wazuh",
    icon: "🔍",
    color: "from-purple-500/20 to-violet-500/20",
    accentColor: "purple",
    titleEn: "ELK Stack + Wazuh SIEM",
    titleTh: "ELK Stack + Wazuh SIEM",
    overviewEn: "Deploying a SIEM solution with Elasticsearch, Logstash, Kibana, and Wazuh for centralized log collection and security monitoring.",
    overviewTh: "ติดตั้งระบบ SIEM ด้วย ELK Stack และ Wazuh สำหรับรวบรวม Log และตรวจสอบความปลอดภัย",
    stack: ["Elasticsearch", "Logstash", "Kibana", "Wazuh", "Docker"],
    status: "coming"
  },
  {
    id: "vmware-proxmox",
    icon: "🖥️",
    color: "from-slate-500/20 to-zinc-500/20",
    accentColor: "slate",
    titleEn: "VMware ESXi vs Proxmox Comparison",
    titleTh: "VMware ESXi vs Proxmox Comparison",
    overviewEn: "Hands-on comparison of VMware ESXi and Proxmox VE hypervisors covering installation, VM management, and enterprise features.",
    overviewTh: "เปรียบเทียบ Hypervisor ระหว่าง VMware ESXi และ Proxmox VE ครอบคลุมการติดตั้ง, จัดการ VM และฟีเจอร์สำหรับองค์กร",
    stack: ["VMware ESXi", "Proxmox VE", "vSphere", "KVM"],
    status: "coming"
  }
];
