import { Command } from 'commander'
import { ServiceContainer } from '../services/service_container.js'
import { BaseCommand } from '../commands/base_command.js'

/**
 * Central registry for all CLI commands
 */
export class CommandRegistry {
  constructor(private services: ServiceContainer) {}
  
  /**
   * Register all commands with the Commander program
   */
  async registerCommands(program: Command): Promise<void> {
    const commands = await this.createCommands()
    
    commands.forEach(cmd => {
      const command = program.command(cmd.name).description(cmd.description)
      cmd.setupCommand(command).action((...args) => cmd.execute(...args))
    })
  }
  
  /**
   * Create all command instances
   * Explicit registration - no auto-discovery magic
   */
  private async createCommands(): Promise<BaseCommand[]> {
    // Import commands dynamically
    const { MakeCollectorCommand } = await import('../commands/make/make_collector_command.js')
    const { MakeHandlerCommand } = await import('../commands/make/make_handler_command.js')
    const { MakeHarvesterCommand } = await import('../commands/make/make_harvester_command.js')
    const { MakeAssetsManagerCommand } = await import('../commands/make/make_assets_manager_command.js')
    
    return [
      // Make commands
      new MakeCollectorCommand(this.services),
      new MakeHandlerCommand(this.services),
      new MakeHarvesterCommand(this.services),
      new MakeAssetsManagerCommand(this.services),
      
      // Other commands will be added here
      // new ServeCommand(this.services),
      // new ListCommand(this.services),
    ]
  }
}