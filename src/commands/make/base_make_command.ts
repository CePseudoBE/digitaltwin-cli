import { Command } from 'commander'
import { BaseCommand } from '../base_command.js'

/**
 * Base class for all 'make:*' commands that generate components
 */
export abstract class BaseMakeCommand extends BaseCommand {
  abstract readonly componentType: string
  abstract readonly stubName: string
  
  setupCommand(command: Command): Command {
    return command
      .argument('<name>', 'Component name')
      .option('--dry-run', 'Show what would be generated without creating files')
      .option('--force', 'Overwrite existing files if they exist')
      .option('--path <path>', 'Custom path for the component (relative to src/components)')
  }
  
  async execute(name: string, options: any): Promise<void> {
    try {
      this.info(`Generating ${this.componentType}: ${name}`)
      
      if (options.dryRun) {
        this.info('Dry run mode - no files will be created')
        await this.showPreview(name, options)
      } else {
        await this.generateComponent(name, options)
        this.success(`${this.componentType} '${name}' generated successfully!`)
      }
    } catch (error: any) {
      this.error(`Failed to generate ${this.componentType}: ${error.message}`)
      process.exit(1)
    }
  }
  
  /**
   * Show preview of what would be generated (dry-run)
   */
  protected async showPreview(name: string, options: any): Promise<void> {
    // TODO: Implement preview logic with stub generator
    this.info(`Would generate ${this.componentType} component with name: ${name}`)
    if (options.path) {
      this.info(`Custom path: ${options.path}`)
    }
  }
  
  /**
   * Generate the actual component
   */
  protected async generateComponent(name: string, options: any): Promise<void> {
    // TODO: Implement actual generation logic with stub generator
    this.info(`Generating ${this.componentType} component...`)
  }
}