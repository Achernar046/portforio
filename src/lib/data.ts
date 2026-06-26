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
    en: "Computer Engineering student with interests in Network Infrastructure, Hardware Systems, and Cybersecurity fundamentals. Passionate about designing reliable systems and solving technical problems.",
    th: "นักศึกษาวิศวกรรมคอมพิวเตอร์ ชั้นปีที่ 4 มีความสนใจด้าน Network Infrastructure, Computer Hardware และ System Administration รวมถึงมีพื้นฐานด้าน Cybersecurity และ Software Development",
  },
  terminalLines: [
    { prompt: true, text: "whoami" },
    { prompt: false, text: "achernar @ engineering-student" },
    { prompt: true, text: "cat focus.txt" },
    { prompt: false, text: "Network · Infrastructure · Security · Hardware" },
    { prompt: true, text: "status --check" },
    { prompt: false, text: "✓ Open to opportunities" },
  ],
};

export const about = {
  bio: {
    en: [
      "I'm a 4th-year Computer Engineering student with a strong focus on Network Infrastructure, Computer Hardware, and System Administration. I also have a solid foundation in Cybersecurity and Software Development.",
      "I love learning new technologies through Hackathons, CTF competitions, and real-world project development. I prioritize building efficient, stable systems that can scale in the future.",
    ],
    th: [
      "ปัจจุบันเป็นนักศึกษาวิศวกรรมคอมพิวเตอร์ ชั้นปีที่ 4 มีความสนใจด้าน Network Infrastructure, Computer Hardware และ System Administration รวมถึงมีพื้นฐานด้าน Cybersecurity และ Software Development",
      "ชอบเรียนรู้เทคโนโลยีใหม่ ๆ ผ่านการแข่งขัน Hackathon, CTF และการพัฒนาโปรเจกต์จริง โดยให้ความสำคัญกับการออกแบบระบบที่มีประสิทธิภาพ มีความเสถียร และสามารถขยายระบบได้ในอนาคต",
    ],
  },
  info: [
    { labelEn: "Real Name", labelTh: "ชื่อจริง", valueEn: "Kunakorn Suwanaphong", valueTh: "คุณากร สุวรรณพงษ์" },
    { labelEn: "Faculty", labelTh: "คณะ", valueEn: "Engineering & Industrial Technology", valueTh: "คณะวิศวกรรมและเทคโนโลยีอุตสาหกรรม" },
    { labelEn: "Major", labelTh: "สาขา", valueEn: "Computer Engineering", valueTh: "วิศวกรรมคอมพิวเตอร์" },
    { labelEn: "Year", labelTh: "ชั้นปี", valueEn: "4th Year", valueTh: "ชั้นปีที่ 4" },
    { labelEn: "Focus", labelTh: "ความเชี่ยวชาญ", valueEn: "Network · Infrastructure · Security", valueTh: "เครือข่าย · โครงสร้างพื้นฐาน · ความปลอดภัย" },
    { labelEn: "Languages", labelTh: "ภาษา", valueEn: "Thai (mother language) · English (second language)", valueTh: "ไทย (ภาษาแม่) · อังกฤษ (ภาษาที่สอง)" },
  ],
  stats: [
    { value: "4th", labelEn: "Year", labelTh: "ปี" },
    { value: "10+", labelEn: "Skills", labelTh: "ทักษะ" },
    { value: "3+", labelEn: "Projects", labelTh: "โปรเจกต์" },
    { value: "4+", labelEn: "Competitions", labelTh: "การแข่งขัน" },
  ],
  interests: [
    { icon: "🌐", label: "Networking" }, { icon: "🐧", label: "Linux" },
    { icon: "🔒", label: "Cybersecurity" }, { icon: "☁️", label: "Cloud" },
    { icon: "⛓️", label: "Blockchain" }, { icon: "🔧", label: "Hardware" },
    { icon: "📡", label: "SD-WAN" }, { icon: "🖥️", label: "Server" },
    { icon: "🛡️", label: "Zero Trust" }, { icon: "🔬", label: "Embedded" },
  ],
};

export const skillCategories: SkillCategory[] = [
  { id: "networking", icon: "🌐", titleEn: "Networking", titleTh: "เครือข่าย", color: "from-blue-500/20 to-cyan-500/20", tags: ["TCP/IP", "Routing", "Switching", "VLAN", "Network Security", "Firewall", "VPN", "SD-WAN", "Zero Trust", "Wireless Networking"] },
  { id: "infrastructure", icon: "🖥️", titleEn: "Infrastructure", titleTh: "โครงสร้างพื้นฐาน", color: "from-violet-500/20 to-purple-500/20", tags: ["Linux", "Windows Server", "System Administration", "Virtualization", "Infrastructure Design", "Server Deployment"] },
  { id: "hardware", icon: "⚙️", titleEn: "Hardware", titleTh: "ฮาร์ดแวร์", color: "from-orange-500/20 to-amber-500/20", tags: ["Computer Architecture", "Digital Logic", "Embedded Systems", "Hardware Troubleshooting", "Computer Assembly"] },
  { id: "programming", icon: "💻", titleEn: "Programming", titleTh: "การเขียนโปรแกรม", color: "from-green-500/20 to-emerald-500/20", tags: ["C", "C++", "Python", "JavaScript", "TypeScript", "Solidity", "SQL"] },
  { id: "web", icon: "🔗", titleEn: "Web Development", titleTh: "พัฒนาเว็บ", color: "from-pink-500/20 to-rose-500/20", tags: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "REST API", "MongoDB", "MySQL"] },
  { id: "security", icon: "🔒", titleEn: "Security", titleTh: "ความปลอดภัย", color: "from-red-500/20 to-orange-500/20", tags: ["Network Security", "SIEM", "SOAR", "Endpoint Protection", "WAF", "Secure Email Gateway", "Content Filtering", "Malware Analysis", "CTF"] },
  { id: "tools", icon: "🛠️", titleEn: "Tools & Platforms", titleTh: "เครื่องมือ", color: "from-slate-500/20 to-gray-500/20", tags: ["Git", "GitHub", "Docker", "VS Code", "VMware", "VirtualBox", "Cisco Packet Tracer", "Wireshark", "Burp Suite", "Nmap", "GNS3"] },
  { id: "blockchain", icon: "⛓️", titleEn: "Blockchain", titleTh: "บล็อกเชน", color: "from-yellow-500/20 to-amber-500/20", tags: ["Solidity", "Hardhat", "ethers.js", "Smart Contract Development"] },
];

export const projects: Project[] = [
  { id: "wastecoin", typeEn: "Backend Development", typeTh: "พัฒนา Backend", titleEn: "WasteCoin Backend", titleTh: "WasteCoin Backend", descEn: "Developed backend services for WasteCoin platform, including user authentication with JWT & bcrypt, RESTful API design, and MongoDB database integration.", descTh: "พัฒนา Backend สำหรับแพลตฟอร์ม WasteCoin ครอบคลุมระบบ Authentication ด้วย JWT & bcrypt, ออกแบบ RESTful API และเชื่อมต่อฐานข้อมูล MongoDB", stack: ["Node.js", "Express", "JWT", "bcrypt", "REST API", "MongoDB"], color: "from-green-500 to-emerald-600" },
  { id: "smartcontract", typeEn: "Blockchain Dev", typeTh: "พัฒนา Blockchain", titleEn: "Smart Contract Development", titleTh: "พัฒนา Smart Contract", descEn: "Developed and tested smart contracts using Solidity on Hardhat framework. Explored dApp development and blockchain integration with ethers.js.", descTh: "พัฒนาและทดสอบ Smart Contract ด้วย Solidity บน Hardhat Framework สำรวจการพัฒนา dApp และการเชื่อมต่อ Blockchain ด้วย ethers.js", stack: ["Solidity", "Hardhat", "ethers.js"], color: "from-yellow-500 to-orange-600" },
  { id: "network-sim", typeEn: "Network Lab", typeTh: "แล็บเครือข่าย", titleEn: "Enterprise Network Simulation", titleTh: "จำลองระบบเครือข่ายองค์กร", descEn: "Designed and simulated enterprise network topologies using GNS3 & Cisco Packet Tracer, covering VLANs, routing protocols, firewall rules, and VPN configurations.", descTh: "ออกแบบและจำลองโทโพโลยีเครือข่ายองค์กรด้วย GNS3 & Cisco Packet Tracer ครอบคลุม VLAN, Routing Protocol, Firewall และ VPN", stack: ["GNS3", "Cisco PT", "VLAN", "VPN", "Firewall"], color: "from-blue-500 to-cyan-600" },
];

export const achievements: Achievement[] = [
  { id: "psru", icon: "🥉", titleEn: "PSRU Cyber Hackathon", titleTh: "PSRU Cyber Hackathon", subtitleEn: "🏆 3rd Place", subtitleTh: "🏆 อันดับที่ 3", descEn: "Participated in cybersecurity challenges involving practical problem solving and teamwork in a fast-paced competition.", descTh: "เข้าร่วมการแข่งขัน Hackathon ด้านไซเบอร์ซีเคียวริตี้ที่ต้องใช้ทักษะการแก้ปัญหาและการทำงานเป็นทีม", highlight: true },
  { id: "business", icon: "💼", titleEn: "Business Model Competition", titleTh: "การแข่งขันด้านโมเดลธุรกิจ", subtitleEn: "Participant", subtitleTh: "ผู้เข้าร่วม", descEn: "Developed and presented an innovative business model as part of a cross-disciplinary team competition.", descTh: "พัฒนาและนำเสนอโมเดลธุรกิจที่สร้างสรรค์ในการแข่งขันข้ามสาขาวิชา" },
  { id: "cybersec", icon: "🔐", titleEn: "Cybersecurity Competition", titleTh: "การแข่งขันด้าน Cybersecurity", subtitleEn: "Participant", subtitleTh: "ผู้เข้าร่วม", descEn: "Applied theoretical knowledge in practical cybersecurity challenges covering network security, CTF, and defensive operations.", descTh: "นำความรู้ทางทฤษฎีไปใช้ในโจทย์ Cybersecurity จริง ครอบคลุมความปลอดภัยเครือข่าย, CTF และการป้องกันระบบ" },
  { id: "solidworks", icon: "🏗️", titleEn: "SolidWorks Competition", titleTh: "การแข่งขัน SolidWorks", subtitleEn: "Participant", subtitleTh: "ผู้เข้าร่วม", descEn: "Competed in 3D engineering design using SolidWorks, showcasing technical precision and engineering fundamentals.", descTh: "แข่งขันออกแบบ 3D เชิงวิศวกรรมด้วย SolidWorks แสดงความแม่นยำทางเทคนิคและพื้นฐานทางวิศวกรรม" },
];

export const learningTopics = [
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
