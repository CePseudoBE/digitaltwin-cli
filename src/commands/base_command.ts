import { Command } from 'commander'
import { ServiceContainer } from '../services/service_container.js'
import chalk from 'chalk'

/**
 * Base class for all CLI commands providing common functionality
 */
export abstract class BaseCommand {
  abstract readonly name: string
  abstract readonly description: string
  
  constructor(protected services: ServiceContainer) {}
  
  /**
   * Execute the command with provided arguments
   */
  abstract execute(...args: any[]): Promise<void>
  
  /**
   * Setup the command with Commander.js - arguments, options, etc.
   */
  abstract setupCommand(command: Command): Command
  
  // Helper methods for consistent CLI output
  protected success(message: string): void {
    console.log(chalk.green('✓'), message)
  }
  
  protected error(message: string): void {
    console.error(chalk.red('✗'), message)
  }
  
  protected info(message: string): void {
    console.log(chalk.blue('i'), message)
  }
  
  protected warning(message: string): void {
    console.log(chalk.yellow('!'), message)
  }
}