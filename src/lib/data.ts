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
    { labelEn: "Education", labelTh: "การศึกษา", valueEn: "Pibulsongkram Rajabhat University (2025 - Present)", valueTh: "มหาวิทยาลัยราชภัฏพิบูลสงคราม (2025 - ปัจจุบัน)" },
    { labelEn: "Focus", labelTh: "ความเชี่ยวชาญ", valueEn: "Network · Infrastructure · Linux · Virtualization", valueTh: "เครือข่าย · โครงสร้างพื้นฐาน · ลินุกซ์ · Virtualization" },
    { labelEn: "Languages", labelTh: "ภาษา", valueEn: "Thai (Native) · English (Intermediate)", valueTh: "ไทย (ภาษาแม่) · อังกฤษ (ระดับกลาง)" },
  ],
  stats: [
    { value: "2025", labelEn: "Started", labelTh: "เริ่มศึกษา" },
    { value: "5", labelEn: "Skill Areas", labelTh: "กลุ่มทักษะ" },
    { value: "3", labelEn: "Projects", labelTh: "โปรเจกต์" },
    { value: "4", labelEn: "Achievements", labelTh: "ผลงาน" },
  ],
  interests: [
    { icon: "🌐", label: "Networking" }, { icon: "🐧", label: "Linux" },
    { icon: "🖥️", label: "Server" }, { icon: "📦", label: "Docker" },
    { icon: "🛡️", label: "Infrastructure" }, { icon: "🔒", label: "Virtualization" },
  ],
};

export const skillCategories: SkillCategory[] = [
  { id: "networking", icon: "🌐", titleEn: "Networking", titleTh: "เครือข่าย", color: "from-blue-500/20 to-cyan-500/20", tags: ["TCP/IP", "VLAN", "Routing & Switching", "DHCP", "DNS", "NAT", "VPN", "SSH"] },
  { id: "infrastructure", icon: "🖥️", titleEn: "System & Infrastructure", titleTh: "ระบบ & โครงสร้างพื้นฐาน", color: "from-violet-500/20 to-purple-500/20", tags: ["Linux", "Ubuntu Server", "Proxmox VE", "Docker", "Virtual Machines", "Windows"] },
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
    descEn: "Built a virtualization environment using Proxmox VE. Deployed Ubuntu Server VMs with SSH, Docker, and Tailscale. Practiced Linux administration and infrastructure management.", 
    descTh: "สร้างระบบเสมือน (Virtualization) โดยใช้ Proxmox VE และติดตั้งใช้งาน Ubuntu Server VMs ร่วมกับ SSH, Docker และ Tailscale พร้อมฝึกฝนการบริหารจัดการระบบ Linux", 
    stack: ["Proxmox VE", "Ubuntu Server", "Docker", "Tailscale", "Linux"], 
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
  { icon: "🌐", titleEn: "Network & Cloud", titleTh: "เครือข่าย & คลาวด์", items: ["SD-WAN", "Zero Trust Network Access", "Cloud Security", "SASE", "Endpoint Monitoring", "Cloud Computing"] },
  { icon: "🔬", titleEn: "Research Interests", titleTh: "หัวข้อที่สนใจวิจัย", items: ["Enterprise Network", "Infrastructure Design", "Distributed Systems", "Hardware Architecture", "High Availability Systems", "Security Operations"] },
];

export const contact = {
  email: "kunakorn1516@gmail.com",
  github: "https://github.com/Achernar046",
  githubUsername: "Achernar046",
  instagram: "https://instagram.com/kunakorn_kup/",
  instagramHandle: "@kunakorn_kup",
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
