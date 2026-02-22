import prisma from "../src/lib/prisma";
import pg from "pg";

async function main() {
  console.log("Starting seed with imported prisma client...");

  try {
    // Clear existing data
    // Delete in order to satisfy FK constraints
    await prisma.completedExercise.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.codeSubmission.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.course.deleteMany();

    const courses = [
      {
        id: "html-basics",
        title: "HTML5 Mastery",
        shortDescription: "Master the structure of the web with HTML5.",
        description: "Learn everything from basic tags to advanced semantic HTML and forms. This course will give you the foundation to build any website.",
        category: "Frontend",
        difficulty: "beginner" as const,
        totalXP: 500,
        estimatedHours: 10,
        thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
        isPremium: false,
        tags: ["HTML", "Web", "Frontend"],
      },
      {
        id: "css-advanced",
        title: "CSS3 Flexbox & Grid",
        shortDescription: "Design beautiful layouts with modern CSS.",
        description: "Go beyond basic styling. Master Flexbox, CSS Grid, animations, and responsive design systems.",
        category: "Frontend",
        difficulty: "beginner" as const,
        totalXP: 600,
        estimatedHours: 12,
        thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800",
        isPremium: false,
        tags: ["CSS", "Design", "Frontend"],
      },
      {
        id: "js-fundamentals",
        title: "JavaScript Fundamentals",
        shortDescription: "Learn the core concepts of JavaScript.",
        description: "Variables, loops, functions, and the DOM. Everything you need to start building interactive websites.",
        category: "Programming",
        difficulty: "beginner" as const,
        totalXP: 800,
        estimatedHours: 20,
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=800",
        isPremium: false,
        tags: ["JavaScript", "Programming", "Frontend"],
      },
      {
        id: "react-mastery",
        title: "React.js Advanced Patterns",
        shortDescription: "Build scalable apps with React.",
        description: "Hooks, Context API, Performance optimization, and Advanced patterns like HOCs and Render Props.",
        category: "Frontend",
        difficulty: "advanced" as const,
        totalXP: 1000,
        estimatedHours: 30,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
        isPremium: true,
        tags: ["React", "Advanced", "Frontend"],
      },
      {
        id: "web-dev-bootcamp",
        title: "Full-Stack Web Development",
        shortDescription: "The complete guide to web development.",
        description: "From zero to hero. Learn HTML, CSS, JS, React, Node, and Databases in one comprehensive course.",
        category: "Full Stack",
        difficulty: "intermediate" as const,
        totalXP: 2500,
        estimatedHours: 100,
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
        isPremium: true,
        tags: ["Full Stack", "Web", "Career"],
      },
      {
        id: "python-basics",
        title: "Python for Everyone",
        shortDescription: "Start your programming journey with Python.",
        description: "Python is simple yet powerful. Learn the syntax, data structures, and basic automation.",
        category: "Programming",
        difficulty: "beginner" as const,
        totalXP: 700,
        estimatedHours: 15,
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
        isPremium: false,
        tags: ["Python", "Beginner", "Data"],
      },
      {
        id: "java-mastery",
        title: "Java Core & Spring Boot",
        shortDescription: "Build enterprise-grade applications with Java.",
        description: "Deep dive into OOP, Collections, Multithreading, and the Spring Framework.",
        category: "Backend",
        difficulty: "intermediate" as const,
        totalXP: 1200,
        estimatedHours: 40,
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
        isPremium: true,
        tags: ["Java", "Backend", "Enterprise"],
      },
      {
        id: "cpp-fundamentals",
        title: "C++ Programming",
        shortDescription: "Master systems programming with C++.",
        description: "Learn memory management, pointers, STL, and performance-critical programming.",
        category: "Programming",
        difficulty: "intermediate" as const,
        totalXP: 900,
        estimatedHours: 25,
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800",
        isPremium: false,
        tags: ["C++", "Systems", "Performance"],
      },
    ];

    for (const courseData of courses) {
      const course = await prisma.course.create({
        data: {
          ...courseData,
          rating: 4.5 + Math.random() * 0.5,
          enrolledCount: Math.floor(Math.random() * 1000),
        },
      });

      console.log(`Created course: ${course.title}`);

      for (let i = 1; i <= 5; i++) {
        const chapter = await prisma.chapter.create({
          data: {
            courseId: course.id,
            title: `Chapter ${i}: Getting Started with ${course.title.split(' ')[0]}`,
            description: `This chapter covers the basic concepts and foundations.`,
            order: i,
            isPremium: i > 2 && course.isPremium,
          },
        });

        for (let j = 1; j <= 3; j++) {
          await prisma.exercise.create({
            data: {
              chapterId: chapter.id,
              courseId: course.id,
              title: `Exercise ${j}: Practice ${course.title.split(' ')[0]}`,
              description: `Apply what you've learned in this hands-on exercise.`,
              theory: `Practical theory for exercise ${j}.`,
              problemStatement: `Solve the following problem using ${course.title.split(' ')[0]}.`,
              starterCode: getStarterCode(course.id),
              solution: getSolution(course.id),
              xpReward: 50,
              difficulty: "easy",
              language: getLanguage(course.id),
              order: j,
              hints: ["Think about the syntax.", "Check your variables."],
              constraints: ["Must pass all basic test cases."],
              testCases: [
                { input: "", expectedOutput: "success", description: "Basic check" }
              ],
            },
          });
        }
      }
    }

    console.log("Seed complete sucessfully!");
  } catch (err) {
    console.error("Seed error details:", err);
    throw err;
  }
}

function getLanguage(courseId: string) {
  if (courseId.includes("html")) return "html";
  if (courseId.includes("css")) return "css";
  if (courseId.includes("js")) return "javascript";
  if (courseId.includes("react")) return "jsx";
  if (courseId.includes("python")) return "python";
  if (courseId.includes("java")) return "java";
  if (courseId.includes("cpp")) return "cpp";
  return "javascript";
}

function getStarterCode(courseId: string) {
  if (courseId.includes("html")) return "<!-- Start here -->\n<div class='p-4 bg-blue-50 rounded-lg'>\n  <h1 class='text-2xl font-bold'>Hello World</h1>\n</div>";
  if (courseId.includes("css")) return "/* Add styles */\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 200px;\n  background: #f0f9ff;\n}";
  if (courseId.includes("react")) return "import React, { useState } from 'react';\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div className='p-8 text-center'>\n      <h1 className='text-3xl font-bold mb-4'>Counter: {count}</h1>\n      <button \n        onClick={() => setCount(count + 1)}\n        className='px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors'\n      >\n        Increment\n      </button>\n    </div>\n  );\n}";
  if (courseId.includes("python")) return "# Start coding in Python\ndef main():\n    print('Hello from Python!')\n\nif __name__ == '__main__':\n    main()";
  if (courseId.includes("java")) return "// Java Starter Code\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello from Java!\");\n    }\n}";
  if (courseId.includes("cpp")) return "// C++ Starter Code\n#include <iostream>\n\nint main() {\n    std::cout << \"Hello from C++!\" << std::endl;\n    return 0;\n}";
  return "// Start coding\nconsole.log('Hello!');";
}

function getSolution(courseId: string) {
  if (courseId.includes("html")) return "<div>\n  <h1>Title</h1>\n</div>";
  if (courseId.includes("react")) return "import React from 'react';\n\nexport default function App() {\n  return (\n    <div className='p-4'>\n      <h1 className='text-xl font-bold'>React Mastery</h1>\n      <p>This is a complete solution.</p>\n    </div>\n  );\n}";
  if (courseId.includes("python")) return "def main():\n    print('Success')\n\nmain()";
  if (courseId.includes("java")) return "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"success\");\n    }\n}";
  if (courseId.includes("cpp")) return "#include <iostream>\nint main() { std::cout << \"success\" << std::endl; return 0; }";
  return "console.log('success');";
}

main()
  .catch((e) => {
    console.error("Final catch error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
