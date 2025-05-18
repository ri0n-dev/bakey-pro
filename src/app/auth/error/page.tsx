import { CloudAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export const metadata = {
    title: 'Auth Error',
    description: 'Sorry, an error occurred during the authentication process. Please try again or contact support if the problem persists.',
}

export default function AuthError() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Card className="px-15 py-20 w-155">
                <CardHeader className="pb-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
                        <CloudAlert className="h-8 w-8 text-red-500 dark:text-red-400" />
                    </div>
                    <CardTitle className="mt-3 text-center text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
                        Authentication Error
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-neutral-600 dark:text-neutral-400">
                        Sorry, an error occurred during the authentication process. Please try again or contact support if the
                        problem persists.
                    </p>
                </CardContent>
            </Card>
            <p className="mt-5 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Need help? <a href="https://discord.gg/6BPfVm6cST" className="text-blue-600 hover:underline dark:text-blue-400">Contact support</a>
            </p>
        </div>
    )
}