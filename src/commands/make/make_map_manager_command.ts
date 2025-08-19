import { Command } from 'commander'
import { BaseMakeCommand } from './base_make_command.js'
import { StringUtils } from '../../utils/string_utils.js'
import path from 'path'

export class MakeMapManagerCommand extends BaseMakeCommand {
  readonly name = 'make:map-manager'
  readonly description = 'Generate a new map manager component for handling map layer data'
  readonly componentType = 'MapManager'
  readonly stubName = 'map_manager'
  
  setupCommand(command: Command): Command {
    return super.setupCommand(command)
      .option('-d, --description <description>', 'Description of the map manager')
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
      description: options.description || `Map manager for ${name}`,
      tags: options.tags || ['map', 'layer', 'geojson', 'assets'],
      endpoint: options.endpoint || StringUtils.toKebabCase(name)
    }
    
    // Generate content
    const content = await stubGenerator.generate(this.stubName, templateData)
    
    // Determine file path
    const componentsDir = path.join(process.cwd(), projectInfo.srcDir, 'components')
    const fileName = `${StringUtils.toSnakeCase(name)}_map_manager.ts`
    
    // Write file
    const filePath = await stubGenerator.writeFile(
      content, 
      fileName, 
      componentsDir,
      { force: options.force }
    )
    
    this.success(`Generated map manager: ${path.relative(process.cwd(), filePath)}`)
    this.info(`Map layers will be available at GET /${templateData.endpoint}`)
    this.info(`Upload endpoint: POST /${templateData.endpoint}/upload (accepts JSON layer objects)`)
    this.info(`The manager will automatically detect GeoJSON and other layer formats`)
    this.info(`Remember to add it to your DigitalTwinEngine configuration!`)
  }
}