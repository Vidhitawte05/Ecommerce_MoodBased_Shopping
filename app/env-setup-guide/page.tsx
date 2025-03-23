import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Info } from "lucide-react"
import { getAppUrl, debugEnv } from "@/lib/env"

export default function EnvSetupGuidePage() {
  const envInfo = debugEnv()
  const appUrl = getAppUrl()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Environment Variables Setup Guide</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Environment</CardTitle>
          <CardDescription>Information about your current environment setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">NEXT_PUBLIC_APP_URL:</p>
              <p className="font-mono bg-muted p-2 rounded">{envInfo.NEXT_PUBLIC_APP_URL || "Not set"}</p>
            </div>
            <div>
              <p className="font-semibold">Current Origin:</p>
              <p className="font-mono bg-muted p-2 rounded">{envInfo.origin || "Not available (server-side)"}</p>
            </div>
            <div>
              <p className="font-semibold">Effective App URL:</p>
              <p className="font-mono bg-muted p-2 rounded">{appUrl}</p>
            </div>
            <div>
              <p className="font-semibold">NODE_ENV:</p>
              <p className="font-mono bg-muted p-2 rounded">{envInfo.NODE_ENV || "Not set"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Setup Instructions</h2>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary/10 p-1 rounded">1</span> Local Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 list-decimal list-inside">
              <li>
                Create a <span className="font-mono">.env.local</span> file in the root of your project
                <pre className="bg-muted p-3 rounded-md mt-2 overflow-x-auto">
                  NEXT_PUBLIC_APP_URL=http://localhost:3000
                </pre>
              </li>
              <li>
                Restart your development server:
                <pre className="bg-muted p-3 rounded-md mt-2 overflow-x-auto">npm run dev</pre>
              </li>
              <li>
                For testing with mobile devices on your local network, use your computer's IP address:
                <pre className="bg-muted p-3 rounded-md mt-2 overflow-x-auto">
                  NEXT_PUBLIC_APP_URL=http://192.168.1.100:3000
                </pre>
                <p className="text-sm text-muted-foreground mt-1">Replace 192.168.1.100 with your actual IP address</p>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary/10 p-1 rounded">2</span> Vercel Deployment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 list-decimal list-inside">
              <li>Go to your Vercel dashboard and select your project</li>
              <li>Navigate to the "Settings" tab and then "Environment Variables" section</li>
              <li>
                Add a new environment variable:
                <div className="bg-muted p-3 rounded-md mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-semibold text-sm">Name:</p>
                    <p className="font-mono">NEXT_PUBLIC_APP_URL</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Value:</p>
                    <p className="font-mono">https://your-domain.vercel.app</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Replace with your actual Vercel domain or custom domain
                </p>
              </li>
              <li>Click "Save" and redeploy your application</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary/10 p-1 rounded">3</span> Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Check Console Logs</AlertTitle>
                <AlertDescription>
                  Open your browser's developer console (F12) to see detailed logs about the QR code generation process.
                </AlertDescription>
              </Alert>

              <div>
                <h3 className="font-semibold mb-2">Common Issues:</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <span className="font-semibold">Environment variable not loading:</span> Make sure you've restarted
                    your development server after adding the .env.local file.
                  </li>
                  <li>
                    <span className="font-semibold">QR code still showing localhost:</span> Check that the
                    NEXT_PUBLIC_APP_URL is correctly set and that the QR code generation function is using it.
                  </li>
                  <li>
                    <span className="font-semibold">Mobile device can't access the URL:</span> Ensure your mobile device
                    is on the same network as your development machine.
                  </li>
                </ul>
              </div>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                  The NEXT_PUBLIC_ prefix is required for the environment variable to be accessible in the browser.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              After setting up your environment variables, you can verify they're working correctly by:
            </p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Visiting this page to check the current environment information</li>
              <li>Testing the checkout process and scanning the generated QR code</li>
              <li>Checking the browser console for detailed logs</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

