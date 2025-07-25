#!/usr/bin/env node

import { program } from 'commander'
import { ServiceContainer } from './services/service_container.js'
import { CommandRegistry } from './cli/command_registry.js'
import chalk from 'chalk'

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  // Setup CLI program
  program
    .name('dt')
    .description('Digital Twin CLI tools - generate components, manage projects')
    .version('0.1.0')
  
  // Create service container with all dependencies
  const services = await ServiceContainer.create()
  
  // Register all commands
  const registry = new CommandRegistry(services)
  await registry.registerCommands(program)
  
  // Handle unknown commands gracefully
  program.on('command:*', (operands) => {
    console.error(chalk.red(`❌ Unknown command: ${operands[0]}`))
    console.log(chalk.gray('Run `dt --help` for available commands'))
    process.exit(1)
  })
  
  // Parse and execute
  await program.parseAsync()
}

// Run CLI with error handling
main().catch((error: Error) => {
  console.error(chalk.red('❌ CLI Error:'), error.message)
  process.exit(1)
})