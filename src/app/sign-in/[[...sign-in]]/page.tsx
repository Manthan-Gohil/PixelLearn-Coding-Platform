import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center bg-grid-pattern">
            <div className="animate-fade-in">
                <SignIn
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
    );
}
