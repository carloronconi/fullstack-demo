# @fullstack-demo/design-system

Shared Tailwind-driven UI primitives for the Fullstack Demo workspace.

## Integrating the library in an app

1. **Add the dependency**

   ```json
   {
     "dependencies": {
       "@fullstack-demo/design-system": "workspace:*"
     }
   }
   ```

2. **Compile the workspace package**

   ```ts
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     reactCompiler: true,
     transpilePackages: ["@fullstack-demo/design-system"],
   };

   export default nextConfig;
   ```

3. **Expose Tailwind to the component sources**

   ```css
   @import "@fullstack-demo/design-system/styles.css";
   @source "./**/*.{ts,tsx,js,jsx,mdx}";
   @source "../../packages/design-system/src/**/*.{ts,tsx}";
   @import "tailwindcss";
   ```

4. **Use the components**

   ```tsx
   import {
     Button,
     Card,
     CardContent,
     CardTitle,
   } from "@fullstack-demo/design-system";

   export function Example() {
     return (
       <Card>
         <CardContent className="gap-4">
           <CardTitle>Greetings</CardTitle>
           <Button variant="primary">Create greeting</Button>
         </CardContent>
       </Card>
     );
   }
   ```

5. **Emit production assets**

   ```
   pnpm --filter @fullstack-demo/design-system build
   ```

## Design reference app

- `apps/design` is a sample Next.js app that follows the integration steps above.
- Run `pnpm dev:design` and open `http://localhost:3000` to explore every component and state.
- Use it as a visual regression playground before rolling updates into other applications.
