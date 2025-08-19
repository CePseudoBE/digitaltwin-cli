import { Command } from 'commander'
import { BaseMakeCommand } from './base_make_command.js'
import { StringUtils } from '../../utils/string_utils.js'
import path from 'path'

export class MakeTilesetManagerCommand extends BaseMakeCommand {
  readonly name = 'make:tileset-manager'
  readonly description = 'Generate a new tileset manager component for handling ZIP tileset files'
  readonly componentType = 'TilesetManager'
  readonly stubName = 'tileset_manager'
  
  setupCommand(command: Command): Command {
    return super.setupCommand(command)
      .option('-d, --description <description>', 'Description of the tileset manager')
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
      description: options.description || `Tileset manager for ${name}`,
      tags: options.tags || ['tileset', 'assets', 'zip'],
      endpoint: options.endpoint || StringUtils.toKebabCase(name)
    }
    
    // Generate content
    const content = await stubGenerator.generate(this.stubName, templateData)
    
    // Determine file path
    const componentsDir = path.join(process.cwd(), projectInfo.srcDir, 'components')
    const fileName = `${StringUtils.toSnakeCase(name)}_tileset_manager.ts`
    
    // Write file
    const filePath = await stubGenerator.writeFile(
      content, 
      fileName, 
      componentsDir,
      { force: options.force }
    )
    
    this.success(`Generated tileset manager: ${path.relative(process.cwd(), filePath)}`)
    this.info(`Tileset ZIP files will be available at GET /${templateData.endpoint}`)
    this.info(`Upload endpoint: POST /${templateData.endpoint}/upload (accepts .zip files)`)
    this.info(`The manager will automatically extract and analyze ZIP content`)
    this.info(`Remember to add it to your DigitalTwinEngine configuration!`)
  }
}