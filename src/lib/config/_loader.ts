// Select available config file
import type { Config } from "./example"

const configs = import.meta.glob<Config>(
  [
    '/src/lib/config/example.ts',
    '/src/lib/config/default/default.ts'
  ],
  { 
    eager: true, 
    import: 'default' 
  }
)

export const siteconfig: Config = 
  configs['/src/lib/config/default/default.ts'] || 
  configs['/src/lib/config/example.ts']