import { Command } from 'commander'
import { BaseMakeCommand } from './base_make_command.js'
import { StringUtils } from '../../utils/string_utils.js'
import path from 'path'

export class MakeHandlerCommand extends BaseMakeCommand {
  readonly name = 'make:handler'
  readonly description = 'Generate a new handler component'
  readonly componentType = 'Handler'
  readonly stubName = 'handler'
  
  setupCommand(command: Command): Command {
    return super.setupCommand(command)
      .option('-d, --description <description>', 'Description of the handler')
      .option('-t, --tags <tags>', 'Comma-separated tags', (value) => value.split(',').map(t => t.trim()))
      .option('--endpoint <endpoint>', 'Custom endpoint name (defaults to kebab-case of name)')
      .option('-m, --method <method>', 'HTTP method (get, post, put, delete)', 'get')
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
      description: options.description || `HTTP handler for ${name}`,
      tags: options.tags || [],
      endpoint: options.endpoint || StringUtils.toKebabCase(name),
      method: options.method.toLowerCase()
    }
    
    // Generate content
    const content = await stubGenerator.generate(this.stubName, templateData)
    
    // Determine file path
    const componentsDir = path.join(process.cwd(), projectInfo.srcDir, 'components')
    const fileName = `${StringUtils.toSnakeCase(name)}_handler.ts`
    
    // Write file
    const filePath = await stubGenerator.writeFile(
      content, 
      fileName, 
      componentsDir,
      { force: options.force }
    )
    
    this.success(`Generated handler: ${path.relative(process.cwd(), filePath)}`)
    this.info(`Handler will be available at ${options.method.toUpperCase()} /api/${templateData.endpoint}`)
    this.info(`Remember to add it to your DigitalTwinEngine configuration!`)
  }
}