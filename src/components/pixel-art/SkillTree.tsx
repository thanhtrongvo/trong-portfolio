import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { audioSystem } from "../../utils/audio";

// ── Data Types ──────────────────────────────────────────────
interface SkillNode {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  mastery: number; // 0-100%
  coreFeatures: string[]; // 3 core technical sub-skills instead of stats
  tagline: string; // Professional summary line
}

interface SkillBranch {
  label: string;
  color: string;
  glowColor: string;
  icon: string;
  nodes: SkillNode[];
}

// ── Rich Skill Tree Data ─────────────────────────────────────
const skillBranches: SkillBranch[] = [
  {
    label: "FRONTEND",
    color: "var(--color-pixel-cyan)",
    glowColor: "var(--color-pixel-cyan)",
    icon: "🖥",
    nodes: [
      {
        id: "html",
        name: "HTML/CSS",
        icon: "📄",
        description: "Tạo dựng giao diện web chuẩn ngữ nghĩa (Semantic HTML) kết hợp các kỹ thuật dựng bố cục hiện đại (Flexbox, Grid, Container Queries) và biến CSS.",
        unlocked: true,
        mastery: 95,
        coreFeatures: ["Responsive Design", "Semantic HTML", "Flexbox/Grid Layout"],
        tagline: "Thiết kế giao diện Web tối ưu cấu trúc, tương thích hoàn hảo trên đa thiết bị.",
      },
      {
        id: "js",
        name: "JavaScript",
        icon: "⚡",
        description: "Lập trình tương tác động phía client, xử lý bất đồng bộ (Promises, Async/Await), thao tác DOM hiệu năng cao và nắm vững các chuẩn ES6+.",
        unlocked: true,
        mastery: 90,
        coreFeatures: ["ES6+ Standards", "Async/Await API", "DOM Manipulation"],
        tagline: "Vận hành logic nghiệp vụ phía Client và tối ưu hóa trải nghiệm người dùng.",
      },
      {
        id: "ts",
        name: "TypeScript",
        icon: "🛡",
        description: "Áp dụng hệ thống kiểu tĩnh (Static Typing) để xây dựng mã nguồn tin cậy, tự động kiểm lỗi trong quá trình biên dịch và tăng tốc độ phát triển.",
        unlocked: true,
        mastery: 85,
        coreFeatures: ["Static Typing", "Interfaces & Types", "Generics Development"],
        tagline: "Kiểm soát chặt chẽ kiểu dữ liệu, ngăn ngừa lỗi runtime trong các dự án quy mô lớn.",
      },
      {
        id: "react",
        name: "React",
        icon: "⚛",
        description: "Xây dựng ứng dụng đơn trang (SPA) sử dụng Functional Components, Hooks, tối ưu việc render với Virtual DOM và quản lý state phức tạp.",
        unlocked: true,
        mastery: 90,
        coreFeatures: ["React Hooks", "State Management", "Component Reusability"],
        tagline: "Kiến tạo ứng dụng Web có tính module hóa cao và quản lý trạng thái linh hoạt.",
      },
      {
        id: "astro",
        name: "Astro",
        icon: "🚀",
        description: "Tận dụng cơ chế Island Architecture để giảm thiểu JavaScript gửi về trình duyệt, cải thiện tối đa chỉ số Core Web Vitals (LCP, INP).",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["Island Architecture", "Zero-JS Default", "Core Web Vitals Optimization"],
        tagline: "Tối ưu hiệu năng tải trang thông qua mô hình Server-First và Static Site Generation.",
      },
    ],
  },
  {
    label: "BACKEND",
    color: "var(--color-pixel-lime)",
    glowColor: "var(--color-pixel-lime)",
    icon: "⚙",
    nodes: [
      {
        id: "node",
        name: "Node.js",
        icon: "🟢",
        description: "Xây dựng ứng dụng phía máy chủ sử dụng cơ chế Non-blocking I/O và Event Loop để xử lý lượng lớn kết nối đồng thời một cách mượt mà.",
        unlocked: true,
        mastery: 85,
        coreFeatures: ["Event Loop architecture", "File System APIs", "NPM Package Management"],
        tagline: "Vận hành môi trường thực thi Javascript ở Server, xử lý luồng dữ liệu hiệu năng cao.",
      },
      {
        id: "express",
        name: "Express",
        icon: "📦",
        description: "Thiết kế các API RESTful tinh gọn, cấu hình middleware kiểm soát bảo mật, định tuyến và xử lý các tham số HTTP tối ưu.",
        unlocked: true,
        mastery: 85,
        coreFeatures: ["RESTful API Design", "Middleware Pipeline", "HTTP Routing"],
        tagline: "Xây dựng dịch vụ Web API có tính mở rộng cao và định tuyến luồng tin cậy.",
      },
      {
        id: "java",
        name: "Java",
        icon: "☕",
        description: "Phát triển mã nguồn theo mô hình hướng đối tượng (OOP) chặt chẽ, tối ưu luồng xử lý và quản lý bộ nhớ ổn định trên nền tảng JVM.",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["OOP Design Patterns", "Multithreading", "Memory Management (JVM)"],
        tagline: "Lập trình hướng đối tượng vững chắc, đảm bảo khả năng chịu tải của hệ thống Backend.",
      },
      {
        id: "spring",
        name: "Spring Boot",
        icon: "🌱",
        description: "Phát triển các dịch vụ Microservices doanh nghiệp sử dụng Dependency Injection, quản lý truy cập cơ sở dữ liệu qua JPA/Hibernate và bảo mật Spring Security.",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["Spring IoC/DI", "JPA / Hibernate", "Microservice architecture"],
        tagline: "Thiết lập cấu trúc Backend chuẩn doanh nghiệp, tích hợp Dependency Injection.",
      },
    ],
  },
  {
    label: "DATABASE",
    color: "var(--color-pixel-yellow)",
    glowColor: "var(--color-pixel-yellow)",
    icon: "💾",
    nodes: [
      {
        id: "sql",
        name: "SQL",
        icon: "📊",
        description: "Thiết kế lược đồ cơ sở dữ liệu chuẩn hóa, tối ưu hóa truy vấn thông qua Indexing, viết các truy vấn phức tạp kết hợp nhiều bảng (Joins).",
        unlocked: true,
        mastery: 85,
        coreFeatures: ["DB Normalization", "Query Indexing", "Complex Query Joins"],
        tagline: "Tổ chức dữ liệu quan hệ chặt chẽ và tối ưu hóa hiệu năng truy vấn.",
      },
      {
        id: "mongodb",
        name: "MongoDB",
        icon: "🍃",
        description: "Thiết kế các mô hình tài liệu Document linh hoạt, tối ưu hóa truy xuất với Aggregation Pipeline và phân chia dữ liệu ngang (Sharding).",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["Aggregation Pipeline", "Document Schema Design", "Replica Sets Setup"],
        tagline: "Lưu trữ dữ liệu phi cấu trúc linh hoạt theo định dạng JSON-like Documents.",
      },
      {
        id: "postgres",
        name: "PostgreSQL",
        icon: "🐘",
        description: "Vận hành hệ quản trị dữ liệu quan hệ mạnh mẽ, đảm bảo tính toàn vẹn ACID tuyệt đối và hỗ trợ đắc lực cho các kiểu dữ liệu JSONB.",
        unlocked: true,
        mastery: 85,
        coreFeatures: ["ACID Transactions", "JSONB Support", "Views & Triggers"],
        tagline: "Hệ quản trị cơ sở dữ liệu quan hệ nâng cao hỗ trợ xử lý đa luồng dữ liệu.",
      },
    ],
  },
  {
    label: "TOOLS",
    color: "var(--color-pixel-orange)",
    glowColor: "var(--color-pixel-orange)",
    icon: "🔧",
    nodes: [
      {
        id: "git",
        name: "Git",
        icon: "🔀",
        description: "Kiểm soát lịch sử mã nguồn dự án, phối hợp làm việc nhóm thông qua quy trình Git Flow (Branching, Merge, Rebase, Resolve Conflicts).",
        unlocked: true,
        mastery: 90,
        coreFeatures: ["Git Flow Branching", "Rebase & Merge Strategy", "Conflict Resolution"],
        tagline: "Quản lý phiên bản mã nguồn chuyên nghiệp và cộng tác phát triển dự án hiệu quả.",
      },
      {
        id: "docker",
        name: "Docker",
        icon: "🐳",
        description: "Đóng gói toàn bộ ứng dụng và các dependencies vào các container cô lập, loại bỏ lỗi cấu hình không đồng nhất giữa các môi trường.",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["App Containerization", "Docker Compose Orchestration", "Multi-stage Builds"],
        tagline: "Đóng gói ứng dụng dạng Container giúp ảo hóa và đồng nhất môi trường chạy.",
      },
      {
        id: "linux",
        name: "Linux",
        icon: "🐧",
        description: "Quản lý và vận hành máy chủ Linux, thiết lập quyền truy cập tệp tin, lập lịch tự động tác vụ (Cron Jobs) và viết các script Bash tự động.",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["Bash Shell Scripting", "System Administration", "Cron Automations"],
        tagline: "Làm chủ môi trường dòng lệnh Bash và quản trị cấu hình hệ điều hành Server.",
      },
      {
        id: "cloud",
        name: "Cloud",
        icon: "☁",
        description: "Thiết lập máy chủ ảo VPS, cấu hình mạng, tường lửa và tích hợp quy trình CI/CD để tự động hóa hoạt động deployment lên nền tảng đám mây.",
        unlocked: false,
        mastery: 50,
        coreFeatures: ["VPS Deployments", "CI/CD Automations", "DNS & SSL Management"],
        tagline: "Nghiên cứu triển khai hệ thống lên hạ tầng đám mây AWS/GCP.",
      },
    ],
  },
];

// ── Single Node Icon ─────────────────────────────────────────
function TreeNode({
  node,
  color,
  isSelected,
  onClick,
}: {
  node: SkillNode;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center select-none" style={{ position: "relative" }}>
      {/* Node Button */}
      <motion.div
        whileHover={node.unlocked ? { scale: 1.1 } : {}}
        onClick={onClick}
        onMouseEnter={() => {
          setIsHovered(true);
          if (node.unlocked) audioSystem?.playHoverSound();
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: isSelected
            ? "var(--color-pixel-blue)"
            : node.unlocked
            ? "var(--color-pixel-dark)"
            : "var(--color-pixel-black)",
          border: `3px solid ${
            isSelected
              ? "var(--color-pixel-yellow)"
              : node.unlocked
              ? color
              : "var(--color-pixel-dark)"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          cursor: "pointer",
          boxShadow: isSelected
            ? "0 0 14px var(--color-pixel-yellow)"
            : node.unlocked && isHovered
            ? `0 0 10px ${color}`
            : "none",
          opacity: node.unlocked ? 1 : 0.45,
          imageRendering: "pixelated",
          transition: "border-color 0.15s, background-color 0.15s",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            lineHeight: 1,
            filter: node.unlocked ? "none" : "grayscale(1)",
          }}
        >
          {node.icon}
        </span>
        
        {/* Lock indicator */}
        {!node.unlocked && (
          <span
            style={{
              position: "absolute",
              bottom: "1px",
              right: "2px",
              fontSize: "8px",
            }}
          >
            🔒
          </span>
        )}
      </motion.div>

      {/* Label */}
      <span
        style={{
          fontFamily: "'VT323', monospace",
          fontSize: "15px",
          color: isSelected
            ? "var(--color-pixel-yellow)"
            : node.unlocked
            ? "var(--color-pixel-white)"
            : "var(--color-pixel-gray)",
          marginTop: "6px",
          textAlign: "center",
          width: "60px",
          lineHeight: "1.1",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {node.name}
      </span>
    </div>
  );
}

// ── Main Skill Tree Component ───────────────────────────────
export default function SkillTree() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  // Default to HTML/CSS
  const [selectedNode, setSelectedNode] = useState<SkillNode>(skillBranches[0].nodes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(skillBranches[0].color);

  const totalSkills = skillBranches.reduce((acc, b) => acc + b.nodes.length, 0);
  const unlockedSkills = skillBranches.reduce(
    (acc, b) => acc + b.nodes.filter((n) => n.unlocked).length,
    0
  );

  return (
    <div ref={ref} className="w-full">
      {/* Tree header */}
      <h3
        className="mb-1 text-center"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "13px",
          color: "var(--color-pixel-cyan)",
          letterSpacing: "1px",
        }}
      >
        ♦ TECHNICAL SKILLS ♦
      </h3>

      <div className="text-center mb-6">
        <span
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: "18px",
            color: "var(--color-pixel-light)",
          }}
        >
          Technology Stack:{" "}
          <span style={{ color: "var(--color-pixel-lime)" }}>
            {unlockedSkills}/{totalSkills} Competencies Acquired
          </span>
        </span>
      </div>

      {/* Main Dual-pane grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        
        {/* Left Side: Interactive Board (Grid based - no overflow clipping) */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {skillBranches.map((branch) => (
            <div
              key={branch.label}
              className="p-3"
              style={{
                backgroundColor: "rgba(0,0,0,0.15)",
                border: "2px solid var(--color-pixel-dark)",
              }}
            >
              {/* Branch Title */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{branch.icon}</span>
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "10px",
                    color: branch.color,
                    letterSpacing: "1.5px",
                  }}
                >
                  {branch.label}
                </span>
              </div>

              {/* Node Grid wrapper (uses natural wrapping, preventing clipping) */}
              <div className="flex flex-wrap gap-4 pl-1">
                {branch.nodes.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    color={branch.color}
                    isSelected={selectedNode.id === node.id}
                    onClick={() => {
                      setSelectedNode(node);
                      setSelectedColor(branch.color);
                      audioSystem?.playClickSound();
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Skill Status detail pane */}
        <div className="md:col-span-2 flex">
          <div
            className="w-full p-4 flex flex-col justify-between"
            style={{
              backgroundColor: "var(--color-pixel-dark)",
              border: "3px double var(--color-pixel-light)",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-4 h-full"
              >
                {/* Header info */}
                <div className="border-b-2 border-[var(--color-pixel-gray)] pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedNode.icon}</span>
                    <div>
                      <h4
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "13px",
                          color: selectedColor,
                          lineHeight: "1.4",
                        }}
                      >
                        {selectedNode.name}
                      </h4>
                      <span
                        className="text-[14px] uppercase font-bold"
                        style={{
                          fontFamily: "'VT323', monospace",
                          fontSize: "17px",
                          color: selectedNode.unlocked
                            ? "var(--color-pixel-lime)"
                            : "var(--color-pixel-red)",
                        }}
                      >
                        {selectedNode.unlocked ? "✓ Active Competency" : "🔒 In Development"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tagline summary */}
                <p
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: "20px",
                    color: "var(--color-pixel-light)",
                    lineHeight: "1.4",
                    borderLeft: `4px solid ${selectedColor}`,
                    paddingLeft: "10px",
                  }}
                >
                  {selectedNode.tagline}
                </p>

                {/* Core description */}
                <div>
                  <h5
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "9px",
                      color: "var(--color-pixel-gray)",
                      marginBottom: "6px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    TECHNICAL DESCRIPTION:
                  </h5>
                  <p
                    style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: "19px",
                      color: "var(--color-pixel-white)",
                      lineHeight: "1.4",
                    }}
                  >
                    {selectedNode.description}
                  </p>
                </div>



                {/* Technical Core Features Grid */}
                <div className="mt-auto border-t-2 border-[var(--color-pixel-gray)] pt-3">
                  <h5
                    className="mb-2"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "9px",
                      color: "var(--color-pixel-gray)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    KEY COMPETENCIES:
                  </h5>
                  <div className="grid grid-cols-1 gap-2 text-center">
                    {selectedNode.coreFeatures.map((feature, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 bg-[var(--color-pixel-black)] border border-[var(--color-pixel-gray)] text-[18px] text-[var(--color-pixel-light)] flex items-center justify-center font-semibold"
                        style={{
                          fontFamily: "'VT323', monospace",
                        }}
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
