import { Angry } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export const metadata = {
    title: 'Banned',
    description: 'Sorry, you are banned from using this service.',
}

export default function Banned() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Card className="px-15 py-20 w-155">
                <CardHeader className="pb-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
                        <Angry className="h-8 w-8 text-red-500 dark:text-red-400" />
                    </div>
                    <CardTitle className="mt-3 text-center text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
                        You've been added to the naughty list
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-neutral-600 dark:text-neutral-400">
                        You have been added to the naughty list for violating the rules and your account has been disabled. Please report any complaints.
                    </p>
                </CardContent>
            </Card>
            <p className="mt-5 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Need help? <a href="https://discord.gg/6BPfVm6cST" className="text-blue-600 hover:underline dark:text-blue-400">Contact support</a>
            </p>
        </div>
    )
}