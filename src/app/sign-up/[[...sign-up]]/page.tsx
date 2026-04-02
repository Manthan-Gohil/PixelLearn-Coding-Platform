import { SignUp } from "@clerk/nextjs";
import FloatingParticlesWrapper from "./FloatingParticlesWrapper";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center bg-grid-pattern relative overflow-hidden">
            <FloatingParticlesWrapper />

            {/* Animated background orbs */}
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] animate-morph" />
            <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-morph" style={{ animationDelay: "4s" }} />

            <div className="relative z-10 animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        <span className="text-text-primary">PIXEL</span>
                        <span className="text-[#E6C212]">LEARN</span>
                    </h1>
                    <p className="text-text-muted text-sm mt-1">Start Your Coding Journey</p>
                </div>

                <div className="animate-glow-pulse rounded-2xl">
                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: "mx-auto",
                                card: "bg-surface-card border border-border shadow-2xl rounded-2xl",
                                headerTitle: "text-text-primary",
                                headerSubtitle: "text-text-secondary",
                                socialButtonsBlockButton:
                                    "bg-surface-alt border-border text-text-primary hover:bg-surface-hover",
                                formFieldLabel: "text-text-secondary",
                                formFieldInput:
                                    "bg-surface-alt border-border text-text-primary focus:border-primary",
                                footerActionLink: "text-primary-light hover:text-primary",
                                formButtonPrimary:
                                    "bg-gradient-to-r from-primary to-accent hover:opacity-90",
                                dividerLine: "bg-border",
                                dividerText: "text-text-muted",
                            },
                        }}
                        forceRedirectUrl="/dashboard"
                    />
                </div>
            </div>
        </div>
    );
}
