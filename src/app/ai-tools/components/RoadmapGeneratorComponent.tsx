"use client";

import { useState } from "react";
import { Rocket, Send, Loader2, Clock, Target, BookOpen } from "lucide-react";
import { generateRoadmap, RoadmapStep } from "@/lib/api/aiApi";

interface RoadmapGeneratorComponentProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function RoadmapGeneratorComponent({
  isLoading,
  setIsLoading,
}: RoadmapGeneratorComponentProps) {
  const [desiredRole, setDesiredRole] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);

  const handleGenerateRoadmap = async () => {
    if (!desiredRole.trim()) return;

    setIsLoading(true);
    try {
      const skillsArray = currentSkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const result = await generateRoadmap(
        desiredRole,
        skillsArray,
        experienceLevel
      );

      if (Array.isArray(result.result)) {
        setRoadmapSteps(result.result);
      }
    } catch (error) {
      console.error("Roadmap generation error:", error);
      setRoadmapSteps([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-accent" />
          Generate Your Career Roadmap
        </h2>

        <div className="space-y-4">
          {/* Desired Role */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Desired Role *
            </label>
            <input
              type="text"
              value={desiredRole}
              onChange={(e) => setDesiredRole(e.target.value)}
              placeholder="e.g., Full-Stack Developer, DevOps Engineer, Product Manager"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              disabled={isLoading}
            />
          </div>

          {/* Current Skills */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Current Skills (comma-separated)
            </label>
            <input
              type="text"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="e.g., JavaScript, React, HTML/CSS"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              disabled={isLoading}
            />
            <p className="text-xs text-text-muted mt-1">
              Leave empty if you're a complete beginner
            </p>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-alt border border-border text-text-primary focus:outline-none focus:border-primary/50"
              disabled={isLoading}
            >
              <option value="beginner">Beginner (0-1 year)</option>
              <option value="intermediate">Intermediate (1-3 years)</option>
              <option value="advanced">Advanced (3+ years)</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateRoadmap}
            disabled={isLoading || !desiredRole.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Roadmap...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate Roadmap
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {roadmapSteps.length > 0 && (
        <div className="animate-slide-up space-y-6">
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-6">
              Your Learning Path: <span className="gradient-text">{desiredRole}</span>
            </h3>

            <div className="space-y-4">
              {roadmapSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative p-6 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  {/* Step Number and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-light">
                        {step.step}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-text-primary">
                        {step.title}
                      </h4>
                      <p className="text-sm text-text-secondary mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pl-14">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Clock className="w-4 h-4 text-warning" />
                      <span>{step.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Target className="w-4 h-4 text-success" />
                      <span>{step.milestone}</span>
                    </div>
                  </div>

                  {/* Skills to Learn */}
                  {step.skills.length > 0 && (
                    <div className="pl-14 mb-4">
                      <p className="text-xs font-semibold text-text-primary mb-2 flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5" />
                        Key Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md bg-primary/20 text-primary-light text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {step.resources.length > 0 && (
                    <div className="pl-14">
                      <p className="text-xs font-semibold text-text-primary mb-2">
                        Recommended Resources
                      </p>
                      <ul className="space-y-1">
                        {step.resources.map((resource, i) => (
                          <li
                            key={i}
                            className="text-xs text-text-secondary flex items-center gap-2"
                          >
                            <span className="text-accent">→</span>
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 p-4 rounded-lg bg-success/5 border border-success/20">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">
                  Total Duration:
                </span>{" "}
                {roadmapSteps.length > 0
                  ? `${roadmapSteps.length} phases`
                  : "N/A"}
              </p>
              <p className="text-xs text-text-muted mt-2">
                This is a personalized roadmap based on your goals and current skills. Adjust the timeline based on your pace and learning style.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!roadmapSteps.length && !isLoading && desiredRole && (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-text-muted">Generate a roadmap to see your learning path</p>
        </div>
      )}
    </div>
  );
}
