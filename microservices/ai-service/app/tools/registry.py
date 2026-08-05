from app.services.intents import Intent


class ToolRegistry:
    mapping = {
        Intent.PROGRESS: ["user_progress"],
        Intent.RECOMMENDATION: ["user_progress", "course_catalog", "knowledge"],
        Intent.NAVIGATION: ["navigation", "knowledge"],
        Intent.PLAYGROUND: ["code_context"],
        Intent.COURSE: ["course_catalog", "knowledge"],
        Intent.KNOWLEDGE: ["knowledge"],
    }

    def for_intent(self, intent: Intent) -> list[str]:
        return self.mapping[intent]
