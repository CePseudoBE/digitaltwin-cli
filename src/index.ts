// Main exports for digitaltwin-cli package

// Core CLI functionality
export { ServiceContainer } from './services/service_container.js'
export { CommandRegistry } from './cli/command_registry.js'

// Base classes for extending
export { BaseCommand } from './commands/base_command.js'
export { BaseMakeCommand } from './commands/make/base_make_command.js'

// Note: CLI execution is handled by cli.ts, not exported
// This index.ts is for programmatic usage if needed