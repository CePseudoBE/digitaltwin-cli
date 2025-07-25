import { Command } from 'commander'
import { BaseMakeCommand } from './base_make_command.js'
import { StringUtils } from '../../utils/string_utils.js'
import path from 'path'

export class MakeHarvesterCommand extends BaseMakeCommand {
  readonly name = 'make:harvester'
  readonly description = 'Generate a new harvester component'
  readonly componentType = 'Harvester'
  readonly stubName = 'harvester'
  
  setupCommand(command: Command): Command {
    return super.setupCommand(command)
      .option('-d, --description <description>', 'Description of the harvester')
      .option('-t, --tags <tags>', 'Comma-separated tags', (value) => value.split(',').map(t => t.trim()))
      .option('--endpoint <endpoint>', 'Custom endpoint name (defaults to kebab-case of name)')
      .option('--source <source>', 'Source collector to harvest from (required)')
      .option('--dependencies <deps>', 'Comma-separated list of dependency components', (value) => value.split(',').map(t => t.trim()))
      .option('--source-range <range>', 'Source range (number of records or time range like "1h", "30m")')
      .option('--trigger-mode <mode>', 'Trigger mode: on-source or scheduled', 'on-source')
  }
  
  protected async generateComponent(name: string, options: any): Promise<void> {
    const projectDetector = this.services.get('projectDetector') as any
    const stubGenerator = this.services.get('stubGenerator') as any
    
    // Validate we're in a digitaltwin project
    await projectDetector.validateProject()
    
    // Validate required options
    if (!options.source) {
      throw new Error('--source option is required. Specify which collector to harvest from.')
    }
    
    // Get project info
    const projectInfo = await projectDetector.getProjectInfo()
    if (!projectInfo) {
      throw new Error('Could not read project information')
    }
    
    // Prepare template data
    const templateData = {
      name,
      description: options.description || `Data harvester for ${name}`,
      tags: options.tags || [],
      endpoint: options.endpoint || StringUtils.toKebabCase(name),
      sourceCollector: options.source,
      dependencies: options.dependencies || [],
      sourceRange: options.sourceRange,
      triggerMode: options.triggerMode
    }
    
    // Generate content
    const content = await stubGenerator.generate(this.stubName, templateData)
    
    // Determine file path
    const componentsDir = path.join(process.cwd(), projectInfo.srcDir, 'components')
    const fileName = `${StringUtils.toSnakeCase(name)}_harvester.ts`
    
    // Write file
    const filePath = await stubGenerator.writeFile(
      content, 
      fileName, 
      componentsDir,
      { force: options.force }
    )
    
    this.success(`Generated harvester: ${path.relative(process.cwd(), filePath)}`)
    this.info(`Harvests from: ${options.source}`)
    if (options.dependencies?.length > 0) {
      this.info(`Dependencies: ${options.dependencies.join(', ')}`)
    }
    this.info(`Remember to add it to your DigitalTwinEngine configuration!`)
  }
}