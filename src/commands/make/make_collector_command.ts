import { Command } from 'commander'
import { BaseMakeCommand } from './base_make_command.js'
import { StringUtils } from '../../utils/string_utils.js'
import path from 'path'

export class MakeCollectorCommand extends BaseMakeCommand {
  readonly name = 'make:collector'
  readonly description = 'Generate a new collector component'
  readonly componentType = 'Collector'
  readonly stubName = 'collector'
  
  setupCommand(command: Command): Command {
    return super.setupCommand(command)
      .option('-d, --description <description>', 'Description of the collector')
      .option('-s, --schedule <schedule>', 'Cron schedule (default: every 5 minutes)')
      .option('-t, --tags <tags>', 'Comma-separated tags', (value) => value.split(',').map(t => t.trim()))
      .option('--endpoint <endpoint>', 'Custom endpoint name (defaults to kebab-case of name)')
  }
  
  protected async generateComponent(name: string, options: any): Promise<void> {
    const projectDetector = this.services.get('projectDetector') as any
    const stubGenerator = this.services.get('stubGenerator') as any
    
    // Validate we're in a digitaltwin project
    await projectDetector.validateProject()
    
    // Get project info
    const projectInfo = await projectDetector.getProjectInfo()
    if (!projectInfo) {
      throw new Error('Could not read project information')
    }
    
    // Prepare template data
    const templateData = {
      name,
      description: options.description || `Data collector for ${name}`,
      schedule: options.schedule || '0 */5 * * * *',
      tags: options.tags || [],
      endpoint: options.endpoint,
    }
    
    // Generate content
    const content = await stubGenerator.generate(this.stubName, templateData)
    
    // Determine file path
    const componentsDir = path.join(process.cwd(), projectInfo.srcDir, 'components')
    const fileName = `${StringUtils.toSnakeCase(name)}_collector.ts`
    
    // Write file
    const filePath = await stubGenerator.writeFile(
      content, 
      fileName, 
      componentsDir,
      { force: options.force }
    )
    
    this.success(`Generated collector: ${path.relative(process.cwd(), filePath)}`)
    this.info(`Remember to add it to your DigitalTwinEngine configuration!`)
  }
}