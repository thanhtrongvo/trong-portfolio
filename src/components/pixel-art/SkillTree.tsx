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
        description: "Building semantically structured web pages (Semantic HTML) combined with modern layout techniques (Flexbox, Grid, Container Queries) and native CSS custom properties.",
        unlocked: true,
        mastery: 95,
        coreFeatures: ["Responsive Design", "Semantic HTML", "Flexbox/Grid Layout"],
        tagline: "Develop structured, responsive, and cross-browser compatible user interfaces.",
      },
      {
        id: "js",
        name: "JavaScript",
        icon: "⚡",
        description: "Programming dynamic client-side interactions, handling asynchronous control flows (Promises, Async/Await), manipulating the DOM efficiently, and applying ES6+ standards.",
        unlocked: true,
        mastery: 90,
        coreFeatures: ["ES6+ Standards", "Async/Await API", "DOM Manipulation"],
        tagline: "Drive dynamic client-side applications with optimized performance and user experience.",
      },
      {
        id: "ts",
        name: "TypeScript",
        icon: "🛡",
        description: "Integrating static typing systems to build reliable, self-documenting codebases, prevent runtime type exceptions during compilation, and accelerate application scaling.",
        unlocked: true,
        mastery: 85,
        coreFeatures: ["Static Typing", "Interfaces & Types", "Generics Development"],
        tagline: "Enforce strict type safety and prevent runtime errors in large-scale codebases.",
      },
      {
        id: "react",
        name: "React",
        icon: "⚛",
        description: "Architecting modern single-page applications (SPA) utilizing functional components, custom hooks, virtual DOM rendering optimization, and robust state management.",
        unlocked: true,
        mastery: 90,
        coreFeatures: ["React Hooks", "State Management", "Component Reusability"],
        tagline: "Build component-driven single page applications with highly reactive UI states.",
      },
      {
        id: "astro",
        name: "Astro",
        icon: "🚀",
        description: "Leveraging Astro's Island Architecture to ship minimal client-side JavaScript, significantly optimizing Core Web Vitals (LCP, INP) for fast page loading.",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["Island Architecture", "Zero-JS Default", "Core Web Vitals Optimization"],
        tagline: "Optimize site delivery with Server-First models and Static Site Generation.",
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
        description: "Building scalable server-side systems utilizing asynchronous event loops and non-blocking I/O operations to handle high-concurrency requests seamlessly.",
        unlocked: true,
        mastery: 85,
        coreFeatures: ["Event Loop architecture", "File System APIs", "NPM Package Management"],
        tagline: "Execute server-side JavaScript utilizing event-driven, non-blocking runtimes.",
      },
      {
        id: "express",
        name: "Express",
        icon: "📦",
        description: "Structuring lightweight RESTful APIs, building middleware pipelines for security, request validation, routing configurations, and error handling.",
        unlocked: true,
        mastery: 85,
        coreFeatures: ["RESTful API Design", "Middleware Pipeline", "HTTP Routing"],
        tagline: "Design high-performance REST APIs and configure robust routing pipelines.",
      },
      {
        id: "java",
        name: "Java",
        icon: "☕",
        description: "Developing robust enterprise codebases using strict Object-Oriented Programming (OOP) paradigms, multithreaded processing, and JVM memory optimization.",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["OOP Design Patterns", "Multithreading", "Memory Management (JVM)"],
        tagline: "Program highly reliable backend services with strict OOP architecture.",
      },
      {
        id: "spring",
        name: "Spring Boot",
        icon: "🌱",
        description: "Architecting enterprise-grade microservices utilizing Dependency Injection, database persistence with Spring Data JPA/Hibernate, and security configurations.",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["Spring IoC/DI", "JPA / Hibernate", "Microservice architecture"],
        tagline: "Build production-ready Backend architectures powered by Spring IoC.",
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
        description: "Designing normalized relational database schemas, optimizing complex multi-table JOIN queries, and configuring indexes to speed up read operations.",
        unlocked: true,
        mastery: 85,
        coreFeatures: ["DB Normalization", "Query Indexing", "Complex Query Joins"],
        tagline: "Structure reliable relational data schemas and optimize query execution plans.",
      },
      {
        id: "mongodb",
        name: "MongoDB",
        icon: "🍃",
        description: "Designing dynamic document schemas, aggregating complex datasets using Aggregation Pipelines, and configuring replica sets for high availability.",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["Aggregation Pipeline", "Document Schema Design", "Replica Sets Setup"],
        tagline: "Store unstructured, dynamic JSON-like data using flexible document schemas.",
      },
      {
        id: "postgres",
        name: "PostgreSQL",
        icon: "🐘",
        description: "Operating advanced open-source relational databases, guaranteeing strict ACID compliance, and utilizing advanced features like JSONB and triggers.",
        unlocked: true,
        mastery: 85,
        coreFeatures: ["ACID Transactions", "JSONB Support", "Views & Triggers"],
        tagline: "Deploy enterprise-grade relational databases supporting complex operations.",
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
        description: "Managing codebase revision histories and facilitating team collaboration using structured Git workflows (Branching, Merging, Rebasing, Conflict Resolution).",
        unlocked: true,
        mastery: 90,
        coreFeatures: ["Git Flow Branching", "Rebase & Merge Strategy", "Conflict Resolution"],
        tagline: "Manage version histories professionally and coordinate team collaborations.",
      },
      {
        id: "docker",
        name: "Docker",
        icon: "🐳",
        description: "Packaging full application stacks and dependencies into isolated container environments, eliminating configuration differences across environments.",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["App Containerization", "Docker Compose Orchestration", "Multi-stage Builds"],
        tagline: "Containerize applications to ensure identical execution environments everywhere.",
      },
      {
        id: "linux",
        name: "Linux",
        icon: "🐧",
        description: "Managing and configuring Linux environments, setting up file permissions, writing automated shell scripts, and scheduling cron jobs.",
        unlocked: true,
        mastery: 80,
        coreFeatures: ["Bash Shell Scripting", "System Administration", "Cron Automations"],
        tagline: "Manage server operating systems and automate tasks using Bash shell scripting.",
      },
      {
        id: "cloud",
        name: "Cloud",
        icon: "☁",
        description: "Setting up VPS server instances, managing DNS/SSL certificate configurations, and establishing automated CI/CD deployment pipelines.",
        unlocked: false,
        mastery: 50,
        coreFeatures: ["VPS Deployments", "CI/CD Automations", "DNS & SSL Management"],
        tagline: "Deploy and manage software applications on AWS, GCP, and cloud platforms.",
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
