import prisma from "../src/lib/prisma";
import {
  JS_COURSE_ID as JS_COURSE_ID_FROM_MODULE,
  seedJsCourse as seedJsCourseFromModule,
} from "./seeds/seed-js";
import { CPP_COURSE_ID, seedCppCourse } from "./seeds/seed-cpp";
import { DSA_COURSE_ID, seedDsaCourse } from "./seeds/seed-dsa";
import { REACTJS_COURSE_ID, seedReactJsCourse } from "./seeds/seed-reactjs";
import { HTML_COURSE_ID, seedHtmlCourse } from "./seeds/seed-html";
import { CSS_COURSE_ID, seedCssCourse } from "./seeds/seed-css";
import { JAVA_COURSE_ID, seedJavaCourse } from "./seeds/seed-java";
import { PYTHON_COURSE_ID, seedPythonCourse } from "./seeds/seed-python";

type TestCase = {
  input: string;
  expectedOutput: string;
  description: string;
};

type SeedExercise = {
  id: string;
  title: string;
  description: string;
  theory: string;
  problemStatement: string;
  inputExample: string;
  outputExample: string;
  hints: string[];
  constraints: string[];
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  xpReward: number;
  difficulty: "easy" | "medium" | "hard";
  language: "cpp" | "html" | "css" | "javascript" | "java";
  order: number;
};

type SeedChapter = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: SeedExercise[];
};

async function main() {
  console.log("Starting additive seed...");
  const retainedCourseIds = [
    DSA_COURSE_ID,
    CPP_COURSE_ID,
    HTML_COURSE_ID,
    CSS_COURSE_ID,
    JS_COURSE_ID_FROM_MODULE,
    REACTJS_COURSE_ID,
    JAVA_COURSE_ID,
    PYTHON_COURSE_ID,
  ];

  const removedCourses = await prisma.course.deleteMany({
    where: {
      id: { notIn: retainedCourseIds },
    },
  });

  if (removedCourses.count > 0) {
    console.log(
      `Removed ${removedCourses.count} legacy course(s) not in active curriculum.`,
    );
  }

  await seedDsaCourse();
  await seedCppCourse();
  await seedHtmlCourse();
  await seedCssCourse();
  await seedJsCourseFromModule();
  await seedReactJsCourse();
  await seedJavaCourse();
  await seedPythonCourse();
  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Final catch error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
